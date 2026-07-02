import { verifyToken } from './middleware.js';

/**
 * Dashboard tenant scope resolution.
 *
 * Clinic users: scope ALWAYS from JWT tenant_id. Query ?client= / ?tenant_id= is
 * never used as the source of truth — only rejected when it mismatches the token.
 *
 * Super admins: may pass ?client= / ?tenant_id= to view another tenant (role-gated).
 */
export function requireDashboardAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const bearerMatch = header.match(/^Bearer\s+(.+)$/i);
  const token = bearerMatch?.[1] || req.cookies?.mvair_session;

  if (!token) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.sub,
      tenantId: decoded.tenant_id ?? null,
      role: decoded.role,
      email: decoded.email,
    };

    if (req.user.role === 'super_admin') {
      const requested = req.query.client || req.query.tenant_id;
      req.tenantId = requested || req.user.tenantId || 'medical-clinic';
      return next();
    }

    // Clinic users — token is the only scope source
    if (!req.user.tenantId) {
      return res.status(403).json({ error: 'No tenant assigned to this account' });
    }

    const requested = req.query.client || req.query.tenant_id;
    if (requested && requested !== req.user.tenantId) {
      return res.status(403).json({ error: 'Tenant scope mismatch' });
    }

    req.tenantId = req.user.tenantId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function canAccessSession(req, session) {
  if (!session || !req?.user) return false;
  if (req.user.role === 'super_admin') return true;
  if (!req.tenantId) return false;
  return session.client_id === req.tenantId;
}

export function canAccessLead(req, lead) {
  if (!lead || !req?.user) return false;
  if (req.user.role === 'super_admin') return true;
  if (!req.tenantId) return false;
  return lead.client_id === req.tenantId;
}

export function canAccessEmergencyEvent(req, event, sessionClientId) {
  if (!event || !req?.user) return false;
  if (req.user.role === 'super_admin') return true;
  if (!req.tenantId || !sessionClientId) return false;
  return sessionClientId === req.tenantId;
}

export function isClinicStaff(req) {
  return req?.user?.role === 'clinic_staff';
}

export function requireNotStaff(req, res, next) {
  if (req?.user?.role === 'clinic_staff') {
    return res.status(403).json({ error: 'Access restricted to clinic administrators' });
  }
  next();
}
