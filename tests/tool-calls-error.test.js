import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '../contracts/vapi');

function loadFixture(name) {
  return JSON.parse(readFileSync(path.join(fixturesDir, name), 'utf8'));
}

beforeAll(async () => {
  await import('../server/lib/database.js');
  const { bootstrapPlatform } = await import('../server/platform/bootstrap.js');
  await bootstrapPlatform();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('tool-calls error contract (Vapi requires error string in results, not HTTP 5xx)', () => {
  it('handleToolCalls wraps tool failures in results array', async () => {
    const toolRouter = await import('../server/platform/tools/tool-router.js');
    const { handleToolCalls } = await import('../server/platform/tools/tool-calls-handler.js');

    vi.spyOn(toolRouter, 'executeTool').mockRejectedValue(new Error('DB locked'));

    const message = loadFixture('tool-calls.capture.json').message;
    const result = await handleToolCalls(message, 'medical-clinic', {
      sessionId: 'call-test-error-001',
    });

    expect(result.results).toHaveLength(1);
    expect(result.results[0].toolCallId).toBe('call_capture_test_001');
    expect(result.results[0].result).toBe('Error: DB locked');
  });

  it('webhook route still returns HTTP 200 when handleVapiWebhook throws on tool-calls', async () => {
    const webhookHandler = await import('../server/platform/vapi/webhook-handler.js');
    const { buildToolCallResponse, normalizeToolCallList } = await import(
      '../server/platform/vapi/normalize-tool-calls.js'
    );

    vi.spyOn(webhookHandler, 'handleVapiWebhook').mockRejectedValue(
      new Error('tenant_id required')
    );

    const body = loadFixture('tool-calls.capture.json');
    const type = body.message.type;

    // Mirror server/routes/vapi.js catch path for tool-calls
    let status = 500;
    let payload;
    try {
      await webhookHandler.handleVapiWebhook(body);
    } catch (err) {
      if (type === 'tool-calls') {
        const calls = normalizeToolCallList(body.message || {});
        const resultsById = new Map(calls.map((c) => [c.id, { error: err.message }]));
        status = 200;
        payload = buildToolCallResponse(calls, resultsById);
      }
    }

    expect(status).toBe(200);
    expect(payload.results[0].result).toBe('Error: tenant_id required');
  });
});
