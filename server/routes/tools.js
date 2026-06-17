import express from 'express';
import { executeTool, TOOL_HANDLERS } from '../platform/tools/tool-router.js';

const router = express.Router();

/**
 * GET /api/tools — list callable tools (contract reference)
 */
router.get('/', (req, res) => {
  res.json({
    tools: Object.keys(TOOL_HANDLERS),
    usage: 'POST /api/tools/:toolName with { tenant_id, ...arguments }',
  });
});

/**
 * POST /api/tools/:toolName
 * Standalone tool testing without Vapi account.
 * Headers: X-Tenant-ID or body.tenant_id
 */
router.post('/:toolName', async (req, res) => {
  try {
    const { toolName } = req.params;
    const tenantId =
      req.headers['x-tenant-id'] ||
      req.body.tenant_id ||
      req.body.client_id;

    if (!tenantId) {
      return res.status(400).json({ error: 'tenant_id required (header X-Tenant-ID or body)' });
    }

    const { tenant_id: _t, client_id: _c, ...args } = req.body;
    const sessionId = req.body.session_id || `tool_test_${Date.now()}`;

    const result = await executeTool(toolName, tenantId, args, { sessionId });

    res.json({
      tool: toolName,
      tenant_id: tenantId,
      result,
    });
  } catch (err) {
    console.error('[Tools]', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
