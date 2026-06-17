import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import configRouter from './routes/config.js';
import healthRouter from './routes/health.js';
import calendarRouter from './routes/calendar.js';
import voiceRouter from './routes/voice.js';
import llmProxyRouter from './routes/llm-proxy.js';
import logRouter from './routes/log.js';
import sessionsRouter from './routes/sessions.js';
import leadsRouter from './routes/leads.js';
import emergencyRouter from './routes/emergency.js';
import vapiRouter from './routes/vapi.js';
import toolsRouter from './routes/tools.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import appointmentsRouter from './routes/appointments.js';
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Required for Twilio webhooks
app.use(cors({
  origin: ALLOWED_ORIGIN_LIST,
  credentials: true
}));

// Rate limiters
const llmLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests to LLM — please wait a moment.' }
});

const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please wait a moment.' }
});

// Routes
app.use('/api', configRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/llm', llmLimiter, llmProxyRouter);
app.use('/api/log', apiLimiter, logRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/leads', apiLimiter, leadsRouter);
app.use('/api/emergency', apiLimiter, emergencyRouter);
app.use('/api/vapi', vapiRouter);
app.use('/api/tools', apiLimiter, toolsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/', healthRouter);

await bootstrapPlatform();

// Start
app.listen(PORT, () => {
  console.log(`[MedVoice Server] Running on port ${PORT}`);
});
