import { queries } from '../../lib/database.js';

function ensureSession(sessionId, tenantId) {
  if (!sessionId) return;
  const ts = new Date().toISOString();
  try {
    queries.insertSession.run(String(sessionId), String(tenantId), ts, null);
  } catch {
    /* duplicate */
  }
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

  return {
    success: true,
    message:
      'Emergency logged. Advise the caller to hang up and dial 911 immediately if this is a life-threatening emergency.',
  };
}
