import express from 'express';
import { authMiddleware } from '../platform/auth/middleware.js';
import { clientCount } from '../lib/call-events.js';
import { platformQueries } from '../lib/platform-migrations.js';
import { queries } from '../lib/database.js';

const router = express.Router();
const START_TIME = Date.now();

/**
 * GET /health — public, minimal.
 * Used by Vapi, Railway health checks, and the dashboard status card.
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * GET /api/status — JWT-protected, full runtime status.
 * Powers the System Health dashboard panel.
 */
router.get('/api/status', authMiddleware, (req, res) => {
  try {
    // Vapi configuration (presence check only — no values exposed)
    const vapiConfigured   = !!(process.env.VAPI_API_KEY?.trim());
    const webhookConfigured = !!(process.env.VAPI_WEBHOOK_SECRET?.trim());
    const publicUrlSet     = !!(process.env.PUBLIC_URL?.trim());
    const spikeMode        = process.env.VAPI_SPIKE_MODE === 'true';

    // Calendar configuration (presence check only)
    const calendarConfigured = !!(process.env.G_CLIENT_EMAIL?.trim());

    // DB stats
    let tenantCount = 0;
    let sessionsToday = 0;
    let calendarEnabledCount = 0;
    try {
      const tenants = platformQueries.listTenants.all();
      tenantCount = tenants.length;
      calendarEnabledCount = tenants.filter(t => t.calendar_enabled).length;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const allSessions = queries.listSessions.all('medical-clinic', 200, 0);
      sessionsToday = allSessions.filter(s => {
        if (!s.start_time) return false;
        return new Date(s.start_time) >= todayStart;
      }).length;
    } catch {
      // non-fatal: DB may be initialising
    }

    res.json({
      server: {
        up: true,
        version: '1.0.0',
        uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
      },
      vapi: {
        configured: vapiConfigured,
        webhookConfigured,
        publicUrlSet,
        spikeMode,
      },
      calendar: {
        configured: calendarConfigured,
        enabledTenants: calendarEnabledCount,
      },
      sse: {
        activeConnections: clientCount(),
      },
      db: {
        tenants: tenantCount,
        sessionsToday,
      },
    });
  } catch (err) {
    console.error('[Status API]', err);
    res.status(500).json({ error: 'Could not retrieve status' });
  }
});

export default router;
