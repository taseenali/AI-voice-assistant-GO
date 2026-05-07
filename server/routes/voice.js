import express from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const { VoiceResponse } = twilio.twiml;

/**
 * Middleware: Validate Twilio Signature
 */
const validateTwilio = (req, res, next) => {
  const signature = req.headers['x-twilio-signature'];
  const url = (process.env.PUBLIC_URL || '') + req.originalUrl;
  
  const valid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN || '',
    signature || '',
    url,
    req.body
  );

  if (!valid && process.env.NODE_ENV === 'production') {
    console.warn('[Twilio] Signature validation failed');
    return res.status(403).send('Forbidden');
  }
  next();
};

/**
 * POST /api/voice/inbound
 * Entry point for inbound Twilio calls
 */
router.post('/inbound', validateTwilio, (req, res) => {
  const response = new VoiceResponse();
  
  // Use ConversationRelay for 2026-era real-time AI voice
  const connect = response.connect();
  connect.conversationRelay({
    url: `wss://${process.env.DOMAIN || req.headers.host}/voice`,
    dtmfDetection: true,
    voice: 'en-US-Neural2-F'
  });

  res.type('text/xml');
  res.send(response.toString());
});

/**
 * Placeholder WebSocket Upgrade Handler
 * Real implementation requires 'ws' or similar library integration in server/index.js
 */
router.get('/voice-ws-info', (req, res) => {
  res.json({ status: 'scaffolded', endpoint: '/voice' });
});

export default router;
