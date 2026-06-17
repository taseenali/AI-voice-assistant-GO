import express from 'express';
import { queries } from '../lib/database.js';
import { requireDashboardAuth, canAccessSession } from '../platform/auth/clinic-auth.js';

const router = express.Router();

// GET /api/sessions - List all sessions for a client (dashboard — JWT required)
router.get('/', requireDashboardAuth, (req, res) => {
  try {
    const client = req.tenantId;
    const { limit = 50, offset = 0 } = req.query;


    const rows = queries.listSessions.all(client, parseInt(limit), parseInt(offset));

    const localYMD = (iso) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const todayKey = localYMD(new Date());

    // Map DB fields (snake_case) → Dashboard types (camelCase)
    const sessions = rows.map(s => ({
      sessionId:         s.session_id,
      startTime:         s.start_time,
      endTime:           s.end_time,
      duration:          s.duration_seconds || 0,
      turns:             Number(s.computed_turns ?? s.total_turns) || 0,
      intent:            s.intent_detected || '',
      leadCaptured:      Boolean(s.lead_captured),
      emergencyDetected: Boolean(s.emergency_detected),
      finalState:        s.final_state,
      channel:           s.channel || 'web',
      phoneNumber:       s.phone_number || null,
      recordingUrl:      s.recording_url || null,
    }));

    // Stats: "today" = server's local calendar date, same basis as localYMD(startTime)
    const todaySessions = sessions.filter(s => s.startTime && localYMD(s.startTime) === todayKey);
    const leadsToday = todaySessions.filter(s => s.leadCaptured).length;
    const phoneCallsToday = todaySessions.filter(s => s.channel === 'phone').length;
    const webCallsToday = todaySessions.filter(s => s.channel !== 'phone').length;
    const avgDuration = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length)
      : 0;

    res.json({
      sessions,
      stats: {
        totalToday: todaySessions.length,
        leadsToday,
        avgDuration,
        emergenciesToday: todaySessions.filter(s => s.emergencyDetected).length,
        phoneCallsToday,
        webCallsToday,
      }
    });
  } catch (error) {
    console.error('[Sessions API] Error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/sessions/:id - Get single session with full transcript (dashboard — JWT required)
router.get('/:id', requireDashboardAuth, (req, res) => {
  try {
    const { id } = req.params;

    const session = queries.getSession.get(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!canAccessSession(req, session)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const turns = queries.getTurns.all(id).map(t => ({
      timestamp: t.timestamp,
      role: t.role,
      state: t.state,
      text: t.message,
    }));
    const lead = queries.getLeadBySession.get(id);

    res.json({
      ...session,
      turns,
      lead
    });
  } catch (error) {
    console.error('[Sessions API] Error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// POST /api/sessions - Create new session
router.post('/', (req, res) => {
  try {
    const { session_id, client_id, start_time, intent_detected } = req.body;

    queries.insertSession.run(session_id, client_id, start_time, intent_detected || null);

    res.json({ success: true, session_id });
  } catch (error) {
    console.error('[Sessions API] Error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// PUT /api/sessions/:id - Update session (on conversation end)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { end_time, duration_seconds, total_turns, final_state, lead_captured, emergency_detected } = req.body;

    queries.updateSession.run(
      end_time,
      duration_seconds,
      total_turns,
      final_state,
      lead_captured ? 1 : 0,
      emergency_detected ? 1 : 0,
      id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('[Sessions API] Error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// POST /api/sessions/:id/turns - Add conversation turn
router.post('/:id/turns', (req, res) => {
  try {
    const { id } = req.params;
    const { turn_number, timestamp, role, state, message, intent, confidence } = req.body;

    queries.insertTurn.run(
      id,
      turn_number,
      timestamp,
      role,
      state || null,
      message,
      intent || null,
      confidence || null
    );

    res.json({ success: true });
  } catch (error) {
    console.error('[Sessions API] Error:', error);
    res.status(500).json({ error: 'Failed to add turn' });
  }
});

export default router;