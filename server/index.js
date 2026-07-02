import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import healthRouter from './routes/health.js';
import calendarRouter from './routes/calendar.js';
import sessionsRouter from './routes/sessions.js';
import leadsRouter from './routes/leads.js';
import emergencyRouter from './routes/emergency.js';
import vapiRouter from './routes/vapi.js';
import toolsRouter from './routes/tools.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import appointmentsRouter from './routes/appointments.js';
import callStreamRouter from './routes/call-stream.js';
import recordingsRouter from './routes/recordings.js';
import analyticsRouter from './routes/analytics.js';
import llmRouter from './routes/llm-proxy.js';
import { bootstrapPlatform } from './platform/bootstrap.js';

// Initialize database (creates tables if they don't exist)
import './lib/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: merge env with local dev origins so dashboard (:5173) keeps working when
// ALLOWED_ORIGINS only lists the voice widget (:3000).
const DEFAULT_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];
const fromEnv = process.env.ALLOWED_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
const ALLOWED_ORIGIN_LIST = [...new Set([...DEFAULT_DEV_ORIGINS, ...fromEnv])];

// Security headers — applied before any route so every response is protected.
// In production the dashboard is a compiled static bundle, so a proper CSP is safe.
// In development Vite uses inline scripts, so CSP is relaxed.
const isProd = process.env.NODE_ENV === 'production';
app.use(helmet({
  contentSecurityPolicy: isProd
    ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind injects styles
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", ...fromEnv],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: ALLOWED_ORIGIN_LIST,
  credentials: true,
}));

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please wait a moment.' },
  skip: (req) => req.path.startsWith('/api/vapi'), // Vapi webhook has its own auth; never rate-limit it
});

const authLimiter = rateLimit({
  windowMs: 15 * 60_000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts — please wait 15 minutes.' },
});

// Apply global limiter to all routes first, then per-router overrides
app.use(globalLimiter);

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/vapi', vapiRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/calls', callStreamRouter);
app.use('/api/recordings', recordingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/llm', llmRouter);
app.use('/', healthRouter);

await bootstrapPlatform();

// Production environment validation — warn about missing critical vars.
// Only checks presence (!!), never prints values.
if (process.env.NODE_ENV === 'production') {
  const required = [
    ['JWT_SECRET', process.env.JWT_SECRET],
    ['VAPI_API_KEY', process.env.VAPI_API_KEY],
    ['VAPI_WEBHOOK_SECRET', process.env.VAPI_WEBHOOK_SECRET],
    ['PUBLIC_URL', process.env.PUBLIC_URL],
    ['G_CLIENT_EMAIL', process.env.G_CLIENT_EMAIL],
    ['G_PRIVATE_KEY', process.env.G_PRIVATE_KEY],
  ];
  const missing = required.filter(([, v]) => !v?.trim()).map(([k]) => k);
  if (missing.length) {
    console.warn(`[MedVoice] WARNING: Missing production env vars: ${missing.join(', ')}`);
  }
  if (process.env.JWT_SECRET?.trim() === 'change-me-in-production') {
    console.error('[MedVoice] CRITICAL: JWT_SECRET is using the insecure default. Set a real secret in Railway.');
  }
}

// Start
app.listen(PORT, () => {
  console.log(`[MedVoice Server] Running on port ${PORT} (${process.env.NODE_ENV ?? 'development'})`);
});
