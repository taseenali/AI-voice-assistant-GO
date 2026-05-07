import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import configRouter from './routes/config.js';
import healthRouter from './routes/health.js';
import calendarRouter from './routes/calendar.js';
import voiceRouter from './routes/voice.js';
import llmProxyRouter from './routes/llm-proxy.js';
import logRouter from './routes/log.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Required for Twilio webhooks
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Routes
app.use('/api', configRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/llm', llmProxyRouter);
app.use('/api/log', logRouter);
app.use('/', healthRouter);

// Start
app.listen(PORT, () => {
  console.log(`[MedVoice Server] Running on port ${PORT}`);
});
