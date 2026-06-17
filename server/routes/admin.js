import express from 'express';
import { platformQueries } from '../lib/platform-migrations.js';
import { getTenantConfig } from '../platform/tenants/tenant-service.js';
import { authMiddleware, requireSuperAdmin } from '../platform/auth/middleware.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * GET /api/admin/tenants — super_admin only
 */
router.get('/tenants', requireSuperAdmin, (req, res) => {
  try {
    const rows = platformQueries.listTenants.all();
    res.json({ tenants: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/tenants/:id
 */
router.get('/tenants/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'super_admin' && req.user?.tenantId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const bundle = getTenantConfig(id);
    if (!bundle) return res.status(404).json({ error: 'Tenant not found' });

    res.json(bundle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
