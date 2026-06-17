/**
 * Conversation Log Route — POST /api/log/conversation
 *
 * Receives structured turn-level conversation events from the browser.
 * Persists to SQLite database AND writes to server stdout.
 *
 * Payload: { clientId, sessionId, turn, role, text, state, intent, timestamp }
 * PHI note: text field may contain patient-provided information — ensure your
 * deployment is HIPAA-compliant before enabling in production.
 */

import express from 'express';
import { queries } from '../lib/database.js';

const router = express.Router();

// Track which sessions have been created to avoid duplicate INSERT
const _sessionCache = new Set();

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

  const clientId = String(entry.clientId || 'unknown').substring(0, 32);
  const turn = Number(entry.turn) || 0;
  const state = String(entry.state || '').substring(0, 32);
  const intent = String(entry.intent || '').substring(0, 64);
  const ts = timestamp || new Date().toISOString();

  // Persist to SQLite
  try {
    // Auto-create session on first turn
    if (!_sessionCache.has(sessionId)) {
      try {
        queries.insertSession.run(sessionId, clientId, ts, intent || null);
        _sessionCache.add(sessionId);
      } catch (_) {
        // Session already exists — swallow duplicate key error
        _sessionCache.add(sessionId);
      }
    }

    // Insert turn record
    queries.insertTurn.run(
      sessionId,
      turn,
      ts,
      role,
      state || null,
      String(text).substring(0, 500),
      intent || null,
      null
    );
    queries.syncSessionTurnCount.run(sessionId, sessionId);
  } catch (dbErr) {
    console.warn('[Log] DB write failed:', dbErr.message);
    // Continue — log persistence is best-effort, must not block response
  }

  // Structured log line — also written to stdout for real-time monitoring
  const line = JSON.stringify({
    ts,
    sessionId: String(sessionId).substring(0, 64),
    clientId,
    turn,
    role: String(role).substring(0, 16),
    state,
    intent,
    text: String(text).substring(0, 500)
  });

  console.log(`[ConvLog] ${line}`);

  res.json({ ok: true });
});

export default router;
