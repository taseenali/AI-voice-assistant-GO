import { buildAssistantResponse } from './assistant-builder.js';
import {
  extractTenantId,
  extractCallId,
  extractSessionId,
  requireTenant,
} from './context.js';
import { resolveTenantByPhone } from '../tenants/tenant-service.js';
import { handleToolCalls } from '../tools/tool-calls-handler.js';
import { queries } from '../../lib/database.js';
import { platformQueries } from '../../lib/platform-migrations.js';
import {
  scanTranscriptForEmergency,
  extractCallerText,
} from '../safety/transcript-scanner.js';
import * as emergencyTool from '../tools/emergency-tool.js';
import * as leadTool from '../tools/lead-tool.js';
import { broadcast } from '../../lib/call-events.js';

/**
 * Extract partial patient info from a Vapi messages array (end-of-call-report).
 * Looks for name and reason in the user-side utterances without NLP — just
 * simple heuristics for display in the dashboard ("partial lead").
 */
function extractPartialLead(messages = [], callerPhone = null) {
  const userTexts = messages
    .filter(m => m.role === 'user' && m.message?.trim())
    .map(m => m.message.trim());

  if (userTexts.length === 0) return null;

  // Name: first non-trivial user utterance is often just their name (1-4 words, no digits)
  let name = null;
  for (const t of userTexts) {
    const words = t.split(/\s+/);
    if (words.length >= 1 && words.length <= 5 && !/\d/.test(t) && t.length < 40) {
      const lower = t.toLowerCase();
      // Skip greetings and affirmations
      if (!['yes', 'no', 'hi', 'hello', 'yeah', 'sure', 'okay', 'ok', 'yep', 'nope'].includes(lower)) {
        name = t;
        break;
      }
    }
  }

  // Reason: look for utterances mentioning clinical keywords
  const REASON_KEYWORDS = /check.?up|appointment|pain|ache|sick|fever|doctor|consult|dental|tooth|follow.?up|urgent|infection|prescription|refill|lab|result/i;
  let reason = null;
  for (const t of userTexts) {
    if (REASON_KEYWORDS.test(t) && t.length < 200) {
      reason = t;
      break;
    }
  }

  if (!name && !reason && !callerPhone) return null;

  return { name, reason, phone: callerPhone };
}

const TRANSCRIPT_EVENT_TYPES = new Set([
  'transcript',
  'speech-update',
  'conversation-update',
  'hang',
]);

async function handleAssistantRequest(body) {
  const phone =
    body?.message?.call?.phoneNumber?.number ||
    body?.message?.phoneNumber?.number;

  let tenantId = extractTenantId(body);

  if (!tenantId && phone) {
    const resolved = resolveTenantByPhone(phone);
    tenantId = resolved?.tenant_id;
  }

  if (!tenantId) {
    const err = new Error(
      `No tenant mapped for this phone number${phone ? ` (${phone})` : ''}`
    );
    err.status = 404;
    throw err;
  }

  const bundle = requireTenant(tenantId);

  // Notify monitor: call is starting
  const callId = body?.message?.call?.id;
  broadcast('call:started', {
    callId,
    tenantId,
    callerPhone: body?.message?.call?.customer?.number ?? null,
    ts: Date.now(),
  });

  return buildAssistantResponse(bundle);
}

async function handleToolCallsEvent(body) {
  const tenantId = extractTenantId(body);
  if (!tenantId) {
    const err = new Error('tenant_id required in assistant metadata or phone mapping');
    err.status = 400;
    throw err;
  }

  const callId = extractCallId(body);
  const sessionId = extractSessionId(body) || callId;
  const ctx = { sessionId, callId };

  if (sessionId) {
    const ts = new Date().toISOString();
    try {
      queries.insertSession.run(sessionId, tenantId, ts, null);
    } catch {
      /* exists */
    }
  }

  // Notify monitor: tool calls are about to fire
  const toolList = body.message?.toolCallList || [];
  for (const tc of toolList) {
    broadcast('call:tool:start', {
      callId,
      toolName: tc.function?.name,
      args: tc.function?.arguments ?? {},
      ts: Date.now(),
    });
  }

  const response = await handleToolCalls(body.message, tenantId, ctx);

  // Notify monitor: tool results
  const resultMap = Object.fromEntries(
    (response.results ?? []).map(r => [r.toolCallId, r.result])
  );
  for (const tc of toolList) {
    broadcast('call:tool:done', {
      callId,
      toolName: tc.function?.name,
      args: tc.function?.arguments ?? {},
      result: resultMap[tc.id] ?? null,
      ts: Date.now(),
    });
  }

  return response;
}

/**
 * Deterministic emergency scan on live transcript events (phone channel).
 * @see docs/EMERGENCY-PHONE-PATH.md
 */
async function handleTranscriptEvent(body) {
  const tenantId = extractTenantId(body);
  const callId = extractCallId(body);
  const text = extractCallerText(body);

  // Broadcast the full updated conversation to the monitor on every conversation-update
  const type = body?.message?.type;
  if (type === 'conversation-update') {
    const messages = body?.message?.messages ?? [];
    const turns = messages
      .filter(m => m.role === 'user' || m.role === 'bot')
      .map(m => ({ role: m.role, text: m.message, ts: m.time ?? Date.now() }));
    if (turns.length > 0) {
      broadcast('call:transcript', { callId, turns, ts: Date.now() });
    }
  }

  if (!text || !tenantId) return null;

  const bundle = requireTenant(tenantId);
  const keywords = bundle.config.emergency_keywords || [];
  const scan = scanTranscriptForEmergency(text, keywords);

  if (!scan.detected) return null;

  const sessionId = extractSessionId(body) || extractCallId(body) || `phone_${Date.now()}`;
  emergencyTool.logEmergency({
    tenantId,
    sessionId,
    pattern_matched: scan.pattern,
    user_message: text,
    response_sent: bundle.config.emergency_response,
  });

  console.warn(`[Safety] Deterministic emergency on phone: ${scan.pattern}`);
  return null;
}

function pickArtifact(msg) {
  return msg?.artifact || msg?.call?.artifact || {};
}

async function handleEndOfCallReport(body) {
  const msg = body.message || {};
  const call = msg.call || {};
  const artifact = pickArtifact(msg);
  const callId = call.id;
  const tenantId =
    extractTenantId(body) ||
    resolveTenantByPhone(call.phoneNumber?.number)?.tenant_id;

  if (!callId) {
    return { ok: true };
  }

  const sessionId = callId;
  // Vapi doesn't send a duration field — compute from startedAt/endedAt
  const startedAt = call.startedAt ? new Date(call.startedAt).getTime() : null;
  const endedAt = call.endedAt ? new Date(call.endedAt).getTime() : null;
  const duration =
    startedAt && endedAt
      ? Math.round((endedAt - startedAt) / 1000)
      : (call.duration ?? msg.duration ?? 0);
  const recordingUrl =
    artifact.recordingUrl ||
    artifact.recording?.url ||
    msg.recordingUrl ||
    null;
  // Caller E.164 for inbound phone — NOT the dialed clinic line, NOT lead.phone
  const phone =
    call.customer?.number ||
    body?.message?.customer?.number ||
    call.phoneNumber?.number ||
    null;
  const transcript =
    artifact.transcript ||
    artifact.messagesTranscript ||
    msg.transcript ||
    '';

  // Cost, summary, success evaluation from end-of-call-report
  const costUsd =
    msg.cost?.total ?? msg.cost ?? call.cost?.total ?? call.cost ?? null;
  const summary =
    msg.summary ?? msg.analysis?.summary ?? artifact.summary ?? null;
  const successEval =
    msg.analysis?.successEvaluation ?? msg.successEvaluation ?? null;

  try {
    queries.insertSession.run(sessionId, tenantId || 'unknown', new Date().toISOString(), null);
  } catch {
    /* exists */
  }

  try {
    platformQueries.updateSessionPhoneMeta.run(
      'phone',
      callId,
      recordingUrl,
      phone,
      new Date().toISOString(),
      duration,
      costUsd ?? null,
      summary ?? null,
      successEval ?? null,
      sessionId
    );
  } catch (e) {
    console.warn('[Vapi] updateSessionPhoneMeta:', e.message);
  }

  if (typeof transcript === 'string' && transcript.trim()) {
    const lines = transcript.split('\n').filter(Boolean);
    let turnNum = 1;
    for (const line of lines) {
      const match = line.match(/^(User|Customer|Assistant|AI|Bot|Aria|System):\s*(.+)$/i);
      if (!match) continue;
      const speakerLc = match[1].toLowerCase();
      const role = (speakerLc === 'user' || speakerLc === 'customer') ? 'user' : 'assistant';
      queries.insertTurn.run(
        sessionId,
        turnNum++,
        new Date().toISOString(),
        role,
        null,
        match[2],
        null,
        null
      );
    }
    queries.syncSessionTurnCount.run(sessionId, sessionId);
  }

  // Partial lead capture: if the call ended without a lead saved, extract what we can
  // from the conversation so the clinic doesn't lose the contact entirely.
  try {
    const sessionRow = queries.getSession.get(sessionId);
    const alreadyCaptured = sessionRow?.lead_captured;
    if (!alreadyCaptured) {
      const messages = msg.artifact?.messages ?? msg.messages ?? [];
      const partial = extractPartialLead(messages, phone);
      if (partial && (partial.name || partial.reason || partial.phone)) {
        const effectiveTenantId = tenantId || 'unknown';
        // Completeness: phone only → 0.2, phone+name → 0.5, all three → 0.7
        const fieldCount = [partial.name, partial.reason, partial.phone].filter(Boolean).length;
        const score = fieldCount === 3 ? 0.7 : fieldCount === 2 ? 0.5 : 0.2;
        leadTool.captureLead({
          tenantId: effectiveTenantId,
          sessionId,
          name: partial.name || null,
          phone: partial.phone || null,
          reason_for_visit: partial.reason || null,
          completeness_score: score,
        });
        console.log(`[Vapi] Partial lead saved for ${sessionId} (score ${score})`);
      }
    }
  } catch (leadErr) {
    console.warn('[Vapi] Partial lead save failed (non-fatal):', leadErr.message);
  }

  broadcast('call:ended', {
    callId,
    duration,
    recordingUrl: recordingUrl ?? null,
    callerPhone: phone ?? null,
    ts: Date.now(),
  });

  return { ok: true };
}

export async function handleVapiWebhook(body) {
  const type = body?.message?.type;

  if (TRANSCRIPT_EVENT_TYPES.has(type)) {
    await handleTranscriptEvent(body);
    return null;
  }

  switch (type) {
    case 'assistant-request':
      return handleAssistantRequest(body);
    case 'tool-calls':
      return handleToolCallsEvent(body);
    case 'end-of-call-report':
      return handleEndOfCallReport(body);
    default:
      return null;
  }
}
