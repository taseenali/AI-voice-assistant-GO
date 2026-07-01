import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Resolve a JWT token from the request.
 * Cookie takes priority over Authorization header (cookie is httpOnly, harder to steal).
 */
function extractToken(req) {
  const cookie = req.cookies?.mvair_session;
  if (cookie) return cookie;
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

/**
 * Express middleware — optional unless PLATFORM_REQUIRE_AUTH=true.
 * Attaches req.user = { userId, tenantId, role, email }
 */
export function authMiddleware(req, res, next) {
  const requireAuth = process.env.PLATFORM_REQUIRE_AUTH === 'true';

  const token = extractToken(req);

  if (!token) {
    if (requireAuth) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    return next();
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.sub,
      tenantId: decoded.tenant_id ?? null,
      role: decoded.role,
      email: decoded.email,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Require super_admin role.
 */
export function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin required' });
  }
  next();
}

/**
 * Scope requests to JWT tenant (clinic users).
 */
export function requireTenantScope(req, res, next) {
  if (!req.user) return next();

  if (req.user.role === 'super_admin') return next();

  const requested =
    req.query.client ||
    req.query.tenant_id ||
    req.body?.client_id ||
    req.body?.tenant_id;

  if (requested && requested !== req.user.tenantId) {
    return res.status(403).json({ error: 'Tenant scope mismatch' });
  }

  req.tenantId = req.user.tenantId;
  next();
}
