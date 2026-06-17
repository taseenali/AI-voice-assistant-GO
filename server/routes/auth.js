import express from 'express';
import bcrypt from 'bcryptjs';
import { platformQueries } from '../lib/platform-migrations.js';
import { signToken, verifyToken } from '../platform/auth/middleware.js';

const router = express.Router();

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

    res.json({
      token,
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
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = verifyToken(match[1]);
    res.json({
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenant_id ?? null,
    });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
