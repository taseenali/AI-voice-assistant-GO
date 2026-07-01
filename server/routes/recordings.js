import express from 'express';
import { queries } from '../lib/database.js';
import { requireDashboardAuth, canAccessSession } from '../platform/auth/clinic-auth.js';
import { writeAuditLog } from '../lib/audit.js';

const router = express.Router();

/**
 * GET /api/recordings/:sessionId
 *
 * Streams the Vapi recording to an authenticated dashboard user.
 * The raw Vapi URL is never exposed to the client — only this proxy
 * forwards the audio bytes.
 */
router.get('/:sessionId', requireDashboardAuth, async (req, res) => {
  const { sessionId } = req.params;

  const session = queries.getSession.get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  if (!canAccessSession(req, session)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const recordingUrl = session.recording_url;
  if (!recordingUrl) return res.status(404).json({ error: 'No recording for this session' });

  writeAuditLog({
    event_type: 'phi_access',
    action: 'stream_recording',
    resource: `session:${sessionId}`,
    client_id: session.client_id,
    user_id: req.user?.userId,
    session_id: sessionId,
    req,
  });

  try {
    const upstreamHeaders = {};
    if (req.headers.range) upstreamHeaders.Range = req.headers.range;
    const upstream = await fetch(recordingUrl, { headers: upstreamHeaders });

    if (!upstream.ok && upstream.status !== 206) {
      return res.status(502).json({ error: 'Recording unavailable' });
    }

    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type') || 'audio/mpeg';
    const contentLength = upstream.headers.get('content-length');
    const contentRange = upstream.headers.get('content-range');
    const acceptRanges = upstream.headers.get('accept-ranges');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, max-age=3600');
    if (contentLength) res.setHeader('Content-Length', contentLength);
    if (contentRange) res.setHeader('Content-Range', contentRange);
    if (acceptRanges) res.setHeader('Accept-Ranges', acceptRanges);

    upstream.body.pipeTo(
      new WritableStream({
        write(chunk) { res.write(chunk); },
        close() { res.end(); },
        abort(err) {
          console.error('[Recordings] Stream aborted:', err?.message);
          res.end();
        },
      })
    );
  } catch (err) {
    console.error('[Recordings] Proxy error:', err.message);
    if (!res.headersSent) res.status(502).json({ error: 'Failed to stream recording' });
  }
});

export default router;
