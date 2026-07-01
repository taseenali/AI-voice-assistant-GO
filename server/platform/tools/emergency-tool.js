import { queries } from '../../lib/database.js';
import { requireTenant } from '../vapi/context.js';

function ensureSession(sessionId, tenantId) {
  if (!sessionId) return;
  const ts = new Date().toISOString();
  try {
    queries.insertSession.run(String(sessionId), String(tenantId), ts, null);
  } catch {
    /* duplicate */
  }
}

/**
 * Fire-and-forget POST to the tenant's on-call webhook URL.
 * Never throws — a failed pingback must not interrupt the call flow.
 */
function fireOncallPingback(webhookUrl, payload) {
  if (!webhookUrl) return;
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  }).catch((err) => {
    console.error('[Emergency] Pingback failed:', err.message);
  });
}

export function logEmergency({
  tenantId,
  sessionId,
  pattern_matched,
  user_message,
  response_sent,
}) {
  ensureSession(sessionId, tenantId);
  const timestamp = new Date().toISOString();

  queries.insertEmergencyEvent.run(
    sessionId || `emerg_${Date.now()}`,
    timestamp,
    pattern_matched || 'unknown',
    user_message || '',
    response_sent || 'Emergency protocol activated. Please call 911.'
  );

  if (sessionId) {
    try {
      queries.markSessionEmergency.run(sessionId);
    } catch {
      /* session may not exist */
    }
  }

  // Pingback to on-call webhook if configured for this tenant
  try {
    const bundle = requireTenant(tenantId);
    const webhookUrl = bundle.config.oncall_webhook_url;
    if (webhookUrl) {
      fireOncallPingback(webhookUrl, {
        event: 'emergency_detected',
        tenant_id: tenantId,
        session_id: sessionId,
        timestamp,
        pattern: pattern_matched || 'unknown',
        message: user_message || '',
      });
    }
  } catch {
    /* requireTenant failure is non-fatal here */
  }

  return {
    success: true,
    message:
      'Emergency logged. Advise the caller to hang up and dial 911 immediately if this is a life-threatening emergency.',
  };
}
