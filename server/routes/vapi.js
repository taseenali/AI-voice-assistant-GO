import express from 'express';
import { captureRawWebhook } from '../platform/vapi/capture.js';
import { vapiAuthMiddleware } from '../platform/vapi/webhook-auth.js';
import { handleVapiWebhook } from '../platform/vapi/webhook-handler.js';
import { normalizeToolCallList, buildToolCallResponse } from '../platform/vapi/normalize-tool-calls.js';

const router = express.Router();

/**
 * POST /api/vapi/webhook
 * Vapi server URL — assistant-request, tool-calls, end-of-call-report
 * @see docs/PHASE-3-SPIKE.md
 */
router.post(
  '/webhook',
  captureRawWebhook,
  vapiAuthMiddleware,
  async (req, res) => {
    const type = req.body?.message?.type;

    try {
      const result = await handleVapiWebhook(req.body);

      if (type === 'tool-calls') {
        return res.status(200).json(result || { results: [] });
      }

      if (result === null) {
        return res.status(200).json({ ok: true });
      }

      return res.json(result);
    } catch (err) {
      console.error('[Vapi Webhook]', type, err.message);

      // Vapi ignores non-200 tool responses entirely
      if (type === 'tool-calls') {
        const calls = normalizeToolCallList(req.body?.message || {});
        const resultsById = new Map(
          calls.map((c) => [c.id, { error: err.message }])
        );
        return res.status(200).json(buildToolCallResponse(calls, resultsById));
      }

      return res.status(err.status || 500).json({ error: err.message });
    }
  }
);

export default router;
