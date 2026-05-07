/**
 * Conversation Log Route — POST /api/log/conversation
 *
 * Receives structured turn-level conversation events from the browser.
 * Writes to server stdout (production: swap with your preferred log sink).
 *
 * Payload: { clientId, sessionId, turn, role, text, state, intent, timestamp }
 * PHI note: text field may contain patient-provided information — ensure your
 * log sink is HIPAA-compliant before enabling in production.
 */

import express from 'express';

const router = express.Router();

router.post('/conversation', (req, res) => {
  const entry = req.body;

  if (!entry || typeof entry !== 'object') {
    return res.status(400).json({ error: 'Invalid log payload' });
  }

  // Minimal required fields
  const { sessionId, role, text, timestamp } = entry;
  if (!sessionId || !role || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing required log fields' });
  }

  // Structured log line — replace with database/SIEM write in production
  const line = JSON.stringify({
    ts:        timestamp || new Date().toISOString(),
    sessionId: String(sessionId).substring(0, 64),
    clientId:  String(entry.clientId || 'unknown').substring(0, 32),
    turn:      Number(entry.turn)  || 0,
    role:      String(role).substring(0, 16),
    state:     String(entry.state  || '').substring(0, 32),
    intent:    String(entry.intent || '').substring(0, 64),
    text:      String(text).substring(0, 500) // truncate to limit log volume
  });

  console.log(`[ConvLog] ${line}`);

  res.json({ ok: true });
});

export default router;
