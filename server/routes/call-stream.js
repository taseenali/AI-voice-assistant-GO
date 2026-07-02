import express from 'express';
import { requireDashboardAuth } from '../platform/auth/clinic-auth.js';
import { addSseClient, removeSseClient } from '../lib/call-events.js';

const router = express.Router();

/**
 * GET /api/calls/stream
 * Server-Sent Events endpoint consumed by the live receptionist monitor.
 * Keeps the HTTP connection open and pushes named events as calls progress.
 * Auth required — super_admin receives all tenants, clinic users see own clinic only.
 */
router.get('/stream', requireDashboardAuth, (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  res.write('event: connected\ndata: {}\n\n');

  const ping = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(ping);
    }
  }, 25_000);

  // super_admin: tenantId=null (sees all). clinic users: their tenantId.
  const scopedTenantId = req.user?.role === 'super_admin' ? null : req.tenantId;
  addSseClient(res, scopedTenantId);

  req.on('close', () => {
    clearInterval(ping);
    removeSseClient(res);
  });
});

export default router;
