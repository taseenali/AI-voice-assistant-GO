import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeAll } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '../contracts/vapi');

function loadFixture(name) {
  return JSON.parse(readFileSync(path.join(fixturesDir, name), 'utf8'));
}

// Boot database + platform
beforeAll(async () => {
  await import('../server/lib/database.js');
  const { bootstrapPlatform } = await import('../server/platform/bootstrap.js');
  await bootstrapPlatform();
});

describe('Vapi webhook contract', () => {
  it('assistant-request returns valid assistant shape', async () => {
    const { handleVapiWebhook } = await import('../server/platform/vapi/webhook-handler.js');
    const body = loadFixture('assistant-request.in.json');
    const result = await handleVapiWebhook(body);

    expect(result).toHaveProperty('assistant');
    expect(result.assistant).toHaveProperty('firstMessage');
    expect(result.assistant).toHaveProperty('model');
    expect(result.assistant).toHaveProperty('serverUrl');
    expect(result.assistant.serverUrl).toContain('/api/vapi/webhook');
    expect(result.assistant.metadata.tenant_id).toBe('medical-clinic');
  });

  it('tool-calls returns Vapi results array shape', async () => {
    const { handleVapiWebhook } = await import('../server/platform/vapi/webhook-handler.js');
    const body = loadFixture('tool-calls.in.json');
    const result = await handleVapiWebhook(body);

    expect(result).toHaveProperty('results');
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results[0]).toHaveProperty('toolCallId');
    expect(result.results[0]).toHaveProperty('result');
    expect(result.results[0].toolCallId).toBe('toolu_test_check_avail_001');
  });

  it('tool-calls.capture (live shape) parses nested function.arguments object', async () => {
    const { handleVapiWebhook } = await import('../server/platform/vapi/webhook-handler.js');
    const body = loadFixture('tool-calls.capture.json');
    const result = await handleVapiWebhook(body);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].toolCallId).toBe('call_capture_test_001');
    expect(typeof result.results[0].result).toBe('string');
    expect(result.results[0].result).toMatch(/Jane/);
  });

  it('end-of-call-report returns ok without error', async () => {
    const { handleVapiWebhook } = await import('../server/platform/vapi/webhook-handler.js');
    const body = loadFixture('end-of-call-report.in.json');
    const result = await handleVapiWebhook(body);
    expect(result).toEqual({ ok: true });
  });
});

describe('Tenant resolution', () => {
  it('resolves medical-clinic from live Vapi phone number', async () => {
    const { resolveTenantByPhone } = await import('../server/platform/tenants/tenant-service.js');
    const tenant = resolveTenantByPhone('+18564402211');
    expect(tenant?.tenant_id).toBe('medical-clinic');
    expect(tenant?.config?.assistant_name).toBeTruthy();
  });

  it('resolves medical-clinic from dev phone number', async () => {
    const { resolveTenantByPhone } = await import('../server/platform/tenants/tenant-service.js');
    const tenant = resolveTenantByPhone('+15559876543');
    expect(tenant?.tenant_id).toBe('medical-clinic');
    expect(tenant?.config?.assistant_name).toBeTruthy();
  });
});

describe('Standalone tools', () => {
  it('capture_lead persists to database', async () => {
    const { executeTool } = await import('../server/platform/tools/tool-router.js');
    const { queries } = await import('../server/lib/database.js');

    const sessionId = `test_lead_${Date.now()}`;
    const msg = await executeTool(
      'capture_lead',
      'medical-clinic',
      {
        name: 'Jane Test',
        phone: '+15551112222',
        reason_for_visit: 'Annual checkup',
      },
      { sessionId }
    );

    expect(msg).toContain('Jane Test');
    const lead = queries.getLeadBySession.get(sessionId);
    expect(lead?.name).toBe('Jane Test');
  });
});
