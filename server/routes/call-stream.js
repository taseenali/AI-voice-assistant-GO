import express from 'express';
import { addSseClient, removeSseClient } from '../lib/call-events.js';

const router = express.Router();

/**
 * GET /api/calls/stream
 * Server-Sent Events endpoint consumed by the live receptionist monitor.
 * Keeps the HTTP connection open and pushes named events as calls progress.
 */
router.get('/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // disable nginx buffering if behind a proxy
  });
  res.flushHeaders();

  // Initial heartbeat so the client knows the connection is alive
  res.write('event: connected\ndata: {}\n\n');

  // Keep-alive ping every 25 s to prevent proxy/browser timeouts
  const ping = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(ping);
    }
  }, 25_000);

  addSseClient(res);

  req.on('close', () => {
    clearInterval(ping);
    removeSseClient(res);
  });
});

export default router;
