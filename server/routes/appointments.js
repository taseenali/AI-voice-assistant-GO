import express from 'express';
import { requireDashboardAuth } from '../platform/auth/clinic-auth.js';
import { platformQueries } from '../lib/platform-migrations.js';

const router = express.Router();

function mapAppointment(row) {
  return {
    id: row.appointment_id,
    startTime: row.start_time,
    endTime: row.end_time,
    patientName: row.patient_name || 'Patient',
    reason: row.reason || null,
    status: row.status,
    htmlLink: row.html_link || null,
    sessionId: row.session_id || null,
  };
}

/**
 * GET /api/appointments — upcoming DB appointments for tenant (dashboard read)
 */
router.get('/', requireDashboardAuth, (req, res) => {
  try {
    const tenantId = req.tenantId;
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
    const from = req.query.from || new Date().toISOString();

    const rows = platformQueries.getAppointmentsByTenant.all(tenantId, from, limit);

    res.json({
      appointments: rows.map(mapAppointment),
      calendarEnabled: true,
      message: rows.length === 0 ? 'No upcoming appointments found.' : null,
    });
  } catch (err) {
    console.error('[Appointments API]', err);
    res.status(500).json({ error: 'Failed to load appointments' });
  }
});

export default router;
