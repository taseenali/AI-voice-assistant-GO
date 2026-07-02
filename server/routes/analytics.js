import express from 'express';
import db from '../lib/database.js';
import { requireDashboardAuth, requireNotStaff } from '../platform/auth/clinic-auth.js';
import { parseIntParam } from '../lib/validate.js';

const router = express.Router();

/**
 * GET /api/analytics/overview
 * Returns aggregated KPIs for the active tenant.
 * Query params:
 *   days=30  — rolling window (default 30)
 */
router.get('/overview', requireDashboardAuth, requireNotStaff, (req, res) => {
  try {
    const tenantId = req.tenantId;
    const days = parseIntParam(req.query.days, 30, 1, 365);
    const since = new Date(Date.now() - days * 86_400_000).toISOString();

    const sessions = db.prepare(
      `SELECT * FROM sessions WHERE client_id = ? AND start_time >= ? ORDER BY start_time ASC`
    ).all(tenantId, since);

    const leads = db.prepare(
      `SELECT * FROM leads WHERE client_id = ? AND captured_at >= ?`
    ).all(tenantId, since);

    const appointments = db.prepare(
      `SELECT * FROM appointments WHERE tenant_id = ? AND start_time >= ?`
    ).all(tenantId, since);

    const emergencies = db.prepare(
      `SELECT e.* FROM emergency_events e
       JOIN sessions s ON s.session_id = e.session_id
       WHERE s.client_id = ? AND e.timestamp >= ?`
    ).all(tenantId, since);

    const totalCalls = sessions.length;
    const phoneCalls = sessions.filter(s => s.channel === 'phone').length;
    const callsWithLead = sessions.filter(s => s.lead_captured).length;
    const callsWithBooking = sessions.filter(s =>
      appointments.some(a => a.session_id === s.session_id)
    ).length;

    const durations = sessions.map(s => s.duration_seconds || 0).filter(Boolean);
    const avgDurationSeconds = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    const costs = sessions.map(s => s.cost_usd).filter(v => v != null);
    const totalCostUsd = costs.reduce((a, b) => a + b, 0);
    const avgCostUsd = costs.length ? totalCostUsd / costs.length : 0;

    // Lead conversion = calls that ended with a captured lead / total calls
    const conversionRate = totalCalls > 0
      ? Math.round((callsWithLead / totalCalls) * 100)
      : 0;

    // Booking rate = calls that resulted in an appointment / total calls
    const bookingRate = totalCalls > 0
      ? Math.round((callsWithBooking / totalCalls) * 100)
      : 0;

    // Daily breakdown for sparklines
    const byDay = {};
    for (const s of sessions) {
      const day = s.start_time?.slice(0, 10);
      if (!day) continue;
      if (!byDay[day]) byDay[day] = { calls: 0, leads: 0, bookings: 0 };
      byDay[day].calls++;
      if (s.lead_captured) byDay[day].leads++;
      if (appointments.some(a => a.session_id === s.session_id)) byDay[day].bookings++;
    }

    // Top reasons from leads
    const reasonFreq = {};
    for (const l of leads) {
      if (!l.reason_for_visit) continue;
      const key = l.reason_for_visit.slice(0, 60);
      reasonFreq[key] = (reasonFreq[key] || 0) + 1;
    }
    const topReasons = Object.entries(reasonFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({ reason, count }));

    res.json({
      window_days: days,
      since,
      totals: {
        calls: totalCalls,
        phone_calls: phoneCalls,
        leads: leads.length,
        appointments: appointments.length,
        emergencies: emergencies.length,
      },
      rates: {
        lead_conversion_pct: conversionRate,
        booking_rate_pct: bookingRate,
      },
      performance: {
        avg_duration_seconds: avgDurationSeconds,
        avg_cost_usd: Math.round(avgCostUsd * 10000) / 10000,
        total_cost_usd: Math.round(totalCostUsd * 100) / 100,
      },
      daily: Object.entries(byDay)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, v]) => ({ date, ...v })),
      top_reasons: topReasons,
    });
  } catch (err) {
    console.error('[Analytics] overview error:', err);
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

/**
 * GET /api/analytics/costs
 * Cost breakdown by day over the last N days.
 */
router.get('/costs', requireDashboardAuth, requireNotStaff, (req, res) => {
  try {
    const tenantId = req.tenantId;
    const days = parseIntParam(req.query.days, 30, 1, 365);
    const since = new Date(Date.now() - days * 86_400_000).toISOString();

    const rows = db.prepare(
      `SELECT start_time, cost_usd FROM sessions
       WHERE client_id = ? AND start_time >= ? AND cost_usd IS NOT NULL
       ORDER BY start_time ASC`
    ).all(tenantId, since);

    const byDay = {};
    for (const r of rows) {
      const day = r.start_time?.slice(0, 10);
      if (!day) continue;
      byDay[day] = (byDay[day] || 0) + r.cost_usd;
    }

    res.json({
      window_days: days,
      costs: Object.entries(byDay)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, cost_usd]) => ({ date, cost_usd: Math.round(cost_usd * 10000) / 10000 })),
      total_usd: Math.round(rows.reduce((s, r) => s + r.cost_usd, 0) * 100) / 100,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute cost analytics' });
  }
});

export default router;
