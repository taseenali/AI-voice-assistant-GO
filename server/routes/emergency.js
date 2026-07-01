import express from 'express';
import { queries } from '../lib/database.js';
import { requireDashboardAuth } from '../platform/auth/clinic-auth.js';

const router = express.Router();

// GET /api/emergency - List emergency events for tenant (dashboard — JWT required)
router.get('/', requireDashboardAuth, (req, res) => {
  try {
    const client = req.tenantId;
    const { limit = 100, offset = 0 } = req.query;

    const rows = queries.getEmergencyEventsByClient.all(
      client,
      parseInt(limit),
      parseInt(offset)
    );

    // Map to camelCase for dashboard
    const events = rows.map(e => ({
      id:          `ev_${e.event_id}`,
      rawId:       e.event_id,
      sessionId:   e.session_id,
      detectedAt:  e.timestamp,
      keyword:     e.pattern_matched,
      userMessage: e.user_message || null,
      severity:    'high',
      resolved:    e.resolved_at != null,
      resolvedAt:  e.resolved_at || null,
      owner:       e.owner || null,
    }));

    res.json({ events });
  } catch (error) {
    console.error('[Emergency API] Error:', error);
    res.status(500).json({ error: 'Failed to fetch emergency events' });
  }
});

// PUT /api/emergency/:id/resolve - Mark an emergency event as resolved
router.put('/:id/resolve', requireDashboardAuth, (req, res) => {
  try {
    const rawId = parseInt(req.params.id, 10);
    if (isNaN(rawId)) return res.status(400).json({ error: 'Invalid event ID' });
    const { owner = 'dashboard' } = req.body || {};
    const result = queries.resolveEmergencyEvent.run(String(owner), rawId);
    if (result.changes === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('[Emergency API] Resolve error:', error);
    res.status(500).json({ error: 'Failed to resolve emergency event' });
  }
});

// POST /api/emergency - Log emergency event
router.post('/', (req, res) => {
  try {
    const {
      session_id,
      client_id = 'unknown',
      pattern_matched,
      user_message,
      response_sent,
    } = req.body;
    const timestamp = new Date().toISOString();

    // FK: emergency_events references sessions — ensure session row exists first
    if (session_id) {
      try {
        queries.insertSession.run(
          session_id,
          String(client_id).substring(0, 128),
          timestamp,
          null
        );
      } catch {
        /* duplicate session_id — ok */
      }
    }

    queries.insertEmergencyEvent.run(
      session_id,
      timestamp,
      pattern_matched,
      user_message,
      response_sent
    );

    res.json({ success: true });
  } catch (error) {
    console.error('[Emergency API] Error:', error);
    res.status(500).json({ error: 'Failed to log emergency event' });
  }
});

export default router;