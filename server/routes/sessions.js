import express from 'express';
import { queries } from '../lib/database.js';
import { requireDashboardAuth, canAccessSession } from '../platform/auth/clinic-auth.js';
import { writeAuditLog } from '../lib/audit.js';
import { requireStrings, parseIntParam } from '../lib/validate.js';

const router = express.Router();

// GET /api/sessions - List all sessions for a client (dashboard — JWT required)
router.get('/', requireDashboardAuth, (req, res) => {
  try {
    const client = req.tenantId;
    const limit = parseIntParam(req.query.limit, 100, 1, 200);
    const offset = parseIntParam(req.query.offset, 0, 0, 1_000_000);

    writeAuditLog({
      event_type: 'phi_access',
      action: 'list_sessions',
      resource: 'sessions',
      client_id: client,
      user_id: req.user?.userId,
      req,
    });

    const total = queries.countSessions.get(client).n;
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
      hasRecording:      Boolean(s.recording_url),
      costUsd:           s.cost_usd ?? null,
      summary:           s.summary ?? null,
      successEvaluation: s.success_evaluation ?? null,
    }));

    // Stats: "today" = server's local calendar date, same basis as localYMD(startTime)
    const todaySessions = sessions.filter(s => s.startTime && localYMD(s.startTime) === todayKey);
    const leadsToday = todaySessions.filter(s => s.leadCaptured).length;
    const phoneCallsToday = todaySessions.filter(s => s.channel === 'phone').length;
    const webCallsToday = todaySessions.filter(s => s.channel !== 'phone').length;
    // avgDuration is scoped to today's sessions only (not all-time) for the KPI card
    const avgDuration = todaySessions.length > 0
      ? Math.round(todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0) / todaySessions.length)
      : 0;

    res.json({
      sessions,
      total,
      hasMore: offset + sessions.length < total,
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

    res.json({
      sessionId:         session.session_id,
      startTime:         session.start_time,
      endTime:           session.end_time,
      duration:          session.duration_seconds || 0,
      turnCount:         Number(session.computed_turns ?? session.total_turns) || 0,
      intent:            session.intent_detected || '',
      leadCaptured:      Boolean(session.lead_captured),
      emergencyDetected: Boolean(session.emergency_detected),
      channel:           session.channel || 'web',
      phone_number:      session.phone_number || null,
      hasRecording:      Boolean(session.recording_url),
      turns,
    });
  } catch (error) {
    console.error('[Sessions API] Error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// POST /api/sessions - Create new session
router.post('/', requireDashboardAuth, (req, res) => {
  try {
    const { session_id, client_id, start_time, intent_detected } = req.body;

    const err = requireStrings(req.body, ['session_id', 'client_id']);
    if (err) return res.status(400).json({ error: err });

    queries.insertSession.run(session_id, client_id, start_time, intent_detected || null);

    res.json({ success: true, session_id });
  } catch (error) {
    console.error('[Sessions API] Error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// PUT /api/sessions/:id - Update session (on conversation end)
router.put('/:id', requireDashboardAuth, (req, res) => {
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
router.post('/:id/turns', requireDashboardAuth, (req, res) => {
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