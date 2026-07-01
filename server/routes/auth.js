import express from 'express';
import bcrypt from 'bcryptjs';
import { platformQueries } from '../lib/platform-migrations.js';
import { signToken, verifyToken } from '../platform/auth/middleware.js';
import { writeAuditLog } from '../lib/audit.js';

const router = express.Router();

const COOKIE_NAME = 'mvair_session';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const user = platformQueries.getUserByEmail.get(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({
      sub: user.user_id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id,
    });

    res.cookie(COOKIE_NAME, token, cookieOptions());

    writeAuditLog({
      event_type: 'auth',
      action: 'login',
      resource: 'session',
      client_id: user.tenant_id || 'system',
      user_id: user.user_id,
      req,
    });

    res.json({
      user: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      },
    });
  } catch (err) {
    console.error('[Auth]', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = verifyToken(token);
    res.json({
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenant_id ?? null,
    });
  } catch {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/logout', (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) {
    try {
      const decoded = verifyToken(token);
      writeAuditLog({
        event_type: 'auth',
        action: 'logout',
        resource: 'session',
        client_id: decoded.tenant_id || 'system',
        user_id: decoded.sub,
        req,
      });
    } catch {
      /* expired token on logout is fine */
    }
  }
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

export default router;
