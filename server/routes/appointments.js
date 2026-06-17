import express from 'express';
import { requireDashboardAuth } from '../platform/auth/clinic-auth.js';
import { getTenantConfig } from '../platform/tenants/tenant-service.js';
import { listUpcomingAppointments } from '../platform/tools/calendar-tool.js';

const router = express.Router();

/**
 * GET /api/appointments — upcoming calendar events for tenant (read-only dashboard)
 */
router.get('/', requireDashboardAuth, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const bundle = getTenantConfig(tenantId);

    if (!bundle) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const cfg = bundle.config;
    const calendarEnabled = Boolean(cfg.calendar_enabled);

    if (!calendarEnabled) {
      return res.json({
        appointments: [],
        calendarEnabled: false,
        message: 'Online booking is not enabled for this clinic.',
      });
    }

    if (!cfg.calendar_id) {
      return res.json({
        appointments: [],
        calendarEnabled: true,
        message: 'Calendar ID is not configured.',
      });
    }

    const { events, message } = await listUpcomingAppointments({
      calendarId: cfg.calendar_id,
      maxResults: parseInt(req.query.limit, 10) || 30,
    });

    res.json({
      appointments: events,
      calendarEnabled: true,
      message: message || null,
    });
  } catch (err) {
    console.error('[Appointments API]', err);
    res.status(500).json({ error: 'Failed to load appointments' });
  }
});

export default router;
