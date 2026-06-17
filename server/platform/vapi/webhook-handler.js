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

  return handleToolCalls(body.message, tenantId, ctx);
}

/**
 * Deterministic emergency scan on live transcript events (phone channel).
 * @see docs/EMERGENCY-PHONE-PATH.md
 */
async function handleTranscriptEvent(body) {
  const tenantId = extractTenantId(body);
  const text = extractCallerText(body);
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
  const duration = call.duration ?? msg.duration ?? 0;
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
      sessionId
    );
  } catch (e) {
    console.warn('[Vapi] updateSessionPhoneMeta:', e.message);
  }

  if (typeof transcript === 'string' && transcript.trim()) {
    const lines = transcript.split('\n').filter(Boolean);
    let turnNum = 1;
    for (const line of lines) {
      const match = line.match(/^(User|Assistant|Customer):\s*(.+)$/i);
      if (!match) continue;
      const role = match[1].toLowerCase() === 'assistant' ? 'assistant' : 'user';
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
