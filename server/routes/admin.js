import express from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { platformQueries } from '../lib/platform-migrations.js';
import { getTenantConfig, updateTenantConfig } from '../platform/tenants/tenant-service.js';
import { authMiddleware, requireSuperAdmin } from '../platform/auth/middleware.js';
import { writeAuditLog } from '../lib/audit.js';
import db from '../lib/database.js';

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

/**
 * PUT /api/admin/tenants/:id — update editable config fields
 */
router.put('/tenants/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'super_admin' && req.user?.tenantId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Request body must be a JSON object' });
    }

    // HIPAA gate: if enabling calendar (live booking = PHI collected), require an active BAA
    if (req.body.calendar_enabled === true || req.body.calendar_enabled === 1) {
      const baas = platformQueries.listBaaByTenant.all(id);
      const activeBaa = baas.find(b => b.status === 'active');
      if (!activeBaa && req.user?.role !== 'super_admin') {
        return res.status(422).json({
          error: 'A signed BAA is required before enabling live appointment booking.',
          code: 'BAA_REQUIRED',
        });
      }
    }

    const updated = updateTenantConfig(id, req.body);

    writeAuditLog({
      event_type: 'config_change',
      action: 'update_tenant_config',
      resource: `tenant_config:${id}`,
      client_id: id,
      user_id: req.user?.userId,
      details: { keys_changed: Object.keys(req.body) },
      req,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/audit-logs
 * Query params: tenant_id, from, to, limit, offset
 */
router.get('/audit-logs', requireSuperAdmin, (req, res) => {
  try {
    const { tenant_id, from, to, limit = 100, offset = 0 } = req.query;

    let sql = `SELECT * FROM audit_logs WHERE 1=1`;
    const params = [];

    if (tenant_id) {
      sql += ` AND client_id = ?`;
      params.push(tenant_id);
    }
    if (from) {
      sql += ` AND timestamp >= ?`;
      params.push(from);
    }
    if (to) {
      sql += ` AND timestamp <= ?`;
      params.push(to);
    }

    sql += ` ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const rows = db.prepare(sql).all(...params);

    res.json({ logs: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * BAA record routes — super_admin only
 */

// GET /api/admin/baa?tenant_id=...
router.get('/baa', requireSuperAdmin, (req, res) => {
  try {
    const { tenant_id } = req.query;
    if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
    const records = platformQueries.listBaaByTenant.all(tenant_id);
    res.json({ baa_records: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/baa
router.post('/baa', requireSuperAdmin, (req, res) => {
  try {
    const { tenant_id, signed_by, signed_at, effective_date, expiry_date, document_ref, notes } = req.body;
    if (!tenant_id || !signed_by || !signed_at || !effective_date) {
      return res.status(400).json({ error: 'tenant_id, signed_by, signed_at, effective_date required' });
    }

    const baaId = randomUUID();
    platformQueries.insertBaa.run(
      baaId, tenant_id, signed_by, signed_at, effective_date,
      expiry_date ?? null, document_ref ?? null, 'active', notes ?? null
    );

    writeAuditLog({
      event_type: 'compliance',
      action: 'baa_signed',
      resource: `baa:${baaId}`,
      client_id: tenant_id,
      user_id: req.user?.userId,
      details: { signed_by, effective_date },
      req,
    });

    res.status(201).json({ baa_id: baaId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/baa/:baaId/status
router.patch('/baa/:baaId/status', requireSuperAdmin, (req, res) => {
  try {
    const { baaId } = req.params;
    const { tenant_id, status } = req.body;
    if (!tenant_id || !status) return res.status(400).json({ error: 'tenant_id and status required' });
    if (!['active', 'expired', 'revoked'].includes(status)) {
      return res.status(400).json({ error: 'status must be active, expired, or revoked' });
    }

    platformQueries.updateBaaStatus.run(status, baaId, tenant_id);

    writeAuditLog({
      event_type: 'compliance',
      action: 'baa_status_changed',
      resource: `baa:${baaId}`,
      client_id: tenant_id,
      user_id: req.user?.userId,
      details: { new_status: status },
      req,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/users?tenant_id=...
 * super_admin: list all users (optionally filtered by tenant)
 * clinic_admin: list users in own tenant only
 */
router.get('/users', (req, res) => {
  try {
    const { tenant_id } = req.query;
    const role = req.user?.role;
    const callerTenant = req.user?.tenantId;

    let rows;
    if (role === 'super_admin') {
      rows = tenant_id
        ? platformQueries.listUsersByTenant.all(tenant_id)
        : platformQueries.listAllUsers.all();
    } else if (role === 'clinic_admin') {
      rows = platformQueries.listUsersByTenant.all(callerTenant);
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/users — create a user in a tenant
 * super_admin: any tenant. clinic_admin: own tenant only.
 */
router.post('/users', async (req, res) => {
  try {
    const { email, password, role: newRole, tenant_id } = req.body;
    if (!email || !password || !newRole || !tenant_id) {
      return res.status(400).json({ error: 'email, password, role, tenant_id are required' });
    }

    const callerRole = req.user?.role;
    const callerTenant = req.user?.tenantId;

    if (callerRole !== 'super_admin' && callerTenant !== tenant_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (callerRole === 'clinic_admin' && newRole === 'super_admin') {
      return res.status(403).json({ error: 'Cannot create super_admin' });
    }

    const existing = platformQueries.getUserByEmail.get(email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();
    platformQueries.insertUser.run(userId, tenant_id, email, passwordHash, newRole);

    writeAuditLog({
      event_type: 'auth',
      action: 'create_user',
      resource: `user:${userId}`,
      client_id: tenant_id,
      user_id: req.user?.userId,
      req,
    });

    res.status(201).json({ user_id: userId, email, role: newRole, tenant_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/admin/users/:userId — soft-deactivate
 * super_admin: any. clinic_admin: own tenant only.
 */
router.delete('/users/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const callerRole = req.user?.role;
    const callerTenant = req.user?.tenantId;

    const target = db.prepare(`SELECT * FROM users WHERE user_id = ?`).get(userId);
    if (!target) return res.status(404).json({ error: 'User not found' });

    if (callerRole !== 'super_admin' && callerTenant !== target.tenant_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (target.role === 'super_admin' && callerRole !== 'super_admin') {
      return res.status(403).json({ error: 'Cannot deactivate super_admin' });
    }

    platformQueries.deactivateUser.run(userId);

    writeAuditLog({
      event_type: 'auth',
      action: 'deactivate_user',
      resource: `user:${userId}`,
      client_id: target.tenant_id,
      user_id: req.user?.userId,
      req,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
