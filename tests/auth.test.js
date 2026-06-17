import express from 'express';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import authRouter from '../server/routes/auth.js';
import leadsRouter from '../server/routes/leads.js';
import sessionsRouter from '../server/routes/sessions.js';
import emergencyRouter from '../server/routes/emergency.js';
import appointmentsRouter from '../server/routes/appointments.js';
import adminRouter from '../server/routes/admin.js';
import { queries } from '../server/lib/database.js';
import { signToken } from '../server/platform/auth/middleware.js';

const HOSTILE = {
  defaultSessionId: 'hostile-test-sess-default',
  defaultLeadName: 'HOSTILE_OTHER_TENANT_LEAD',
  defaultEmergencyKeyword: 'HOSTILE_EMERGENCY_DEFAULT',
};

let server;
let baseUrl;
let clinicToken;
let superAdminToken;

async function login(email) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'changeme-dev-only' }),
  });
  expect(res.status).toBe(200);
  const body = await res.json();
  return body.token;
}

function authGet(path, token) {
  return fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

beforeAll(async () => {
  await import('../server/lib/database.js');
  const { bootstrapPlatform } = await import('../server/platform/bootstrap.js');
  await bootstrapPlatform();

  const ts = new Date().toISOString();

  // Second tenant (default) with data clinic user must never see
  try {
    queries.insertSession.run(HOSTILE.defaultSessionId, 'default', ts, null);
  } catch {
    /* exists */
  }

  queries.insertLead.run(
    HOSTILE.defaultSessionId,
    'default',
    HOSTILE.defaultLeadName,
    '+15550009999',
    null,
    null,
    'hostile test reason',
    null,
    null,
    null,
    null,
    0.9,
    ts,
    null
  );

  queries.insertEmergencyEvent.run(
    HOSTILE.defaultSessionId,
    ts,
    HOSTILE.defaultEmergencyKeyword,
    'hostile emergency message',
    'call 911'
  );

  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/sessions', sessionsRouter);
  app.use('/api/emergency', emergencyRouter);
  app.use('/api/appointments', appointmentsRouter);
  app.use('/api/admin', adminRouter);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;

  clinicToken = await login('clinic@medical-clinic.local');
  superAdminToken = await login('admin@medvoice.local');
});

afterAll(async () => {
  await new Promise((resolve) => server?.close(resolve));
});

describe('Dashboard auth — basics', () => {
  it('POST /api/auth/login returns JWT for clinic user', async () => {
    expect(clinicToken).toBeTruthy();
  });

  it('GET /api/leads without token returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/leads`);
    expect(res.status).toBe(401);
  });

  it('GET /api/appointments without token returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/appointments`);
    expect(res.status).toBe(401);
  });

  it('GET /api/appointments with clinic token returns calendar state', async () => {
    const res = await authGet('/api/appointments', clinicToken);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('appointments');
    expect(body).toHaveProperty('calendarEnabled');
    expect(Array.isArray(body.appointments)).toBe(true);
  });

  it('GET /api/admin/tenants without token returns 403', async () => {
    const res = await fetch(`${baseUrl}/api/admin/tenants`);
    expect(res.status).toBe(403);
  });

  it('GET /api/admin/tenants with clinic token returns 403', async () => {
    const res = await authGet('/api/admin/tenants', clinicToken);
    expect(res.status).toBe(403);
  });

  it('GET /api/admin/tenants with super_admin token returns tenant list', async () => {
    const res = await authGet('/api/admin/tenants', superAdminToken);
    expect(res.status).toBe(200);
    const { tenants } = await res.json();
    expect(Array.isArray(tenants)).toBe(true);
    expect(tenants.some((t) => t.tenant_id === 'medical-clinic')).toBe(true);
  });
});

describe('Dashboard auth — hostile tenant scoping', () => {
  it('clinic user with no ?client= sees only own-tenant leads (param ignored, token wins)', async () => {
    const res = await authGet('/api/leads', clinicToken);
    expect(res.status).toBe(200);
    const { leads } = await res.json();
    const names = leads.map((l) => l.name);
    expect(names).not.toContain(HOSTILE.defaultLeadName);
    expect(leads.every((l) => l.client_id === 'medical-clinic' || l.client_id == null)).toBe(
      true
    );
  });

  it('clinic user with matching ?client= returns identical data to no param', async () => {
    const [noParam, withParam] = await Promise.all([
      authGet('/api/leads', clinicToken),
      authGet('/api/leads?client=medical-clinic', clinicToken),
    ]);
    expect(noParam.status).toBe(200);
    expect(withParam.status).toBe(200);
    const a = await noParam.json();
    const b = await withParam.json();
    expect(a.leads).toEqual(b.leads);
  });

  it('clinic user with mismatched ?client= returns 403 (cannot override token)', async () => {
    const res = await authGet('/api/leads?client=default', clinicToken);
    expect(res.status).toBe(403);
  });

  it('clinic user cannot access super-admin tenant switch via forged query alone', async () => {
    const res = await authGet(
      `/api/emergency?client=default&tenant_id=default`,
      clinicToken
    );
    expect(res.status).toBe(403);
  });

  it('super_admin with ?client=default can read other-tenant leads (role-gated override)', async () => {
    const res = await authGet('/api/leads?client=default', superAdminToken);
    expect(res.status).toBe(200);
    const { leads } = await res.json();
    expect(leads.some((l) => l.name === HOSTILE.defaultLeadName)).toBe(true);
  });

  it('super_admin without param defaults to medical-clinic, not default tenant', async () => {
    const res = await authGet('/api/leads', superAdminToken);
    expect(res.status).toBe(200);
    const { leads } = await res.json();
    expect(leads.some((l) => l.name === HOSTILE.defaultLeadName)).toBe(false);
  });
});

describe('Dashboard auth — detail-by-id and list consistency', () => {
  it('GET /api/sessions/:id cross-tenant returns 403, not 200 with PHI', async () => {
    const res = await authGet(`/api/sessions/${HOSTILE.defaultSessionId}`, clinicToken);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Forbidden');
  });

  it('GET /api/sessions/:id same-tenant returns 200 for clinic user', async () => {
    const listRes = await authGet('/api/sessions?client=medical-clinic', clinicToken);
    const { sessions } = await listRes.json();
    if (sessions.length === 0) return;

    const ownId = sessions[0].sessionId;
    const detailRes = await authGet(`/api/sessions/${ownId}`, clinicToken);
    expect(detailRes.status).toBe(200);
  });

  it('emergency list for clinic user excludes other-tenant events', async () => {
    const res = await authGet('/api/emergency', clinicToken);
    expect(res.status).toBe(200);
    const { events } = await res.json();
    const keywords = events.map((e) => e.keyword);
    expect(keywords).not.toContain(HOSTILE.defaultEmergencyKeyword);
  });

  it('super_admin ?client=default emergency list includes other-tenant event', async () => {
    const res = await authGet('/api/emergency?client=default', superAdminToken);
    expect(res.status).toBe(200);
    const { events } = await res.json();
    expect(events.some((e) => e.keyword === HOSTILE.defaultEmergencyKeyword)).toBe(true);
  });
});

describe('Dashboard auth — route handler audit', () => {
  it('dashboard GET handlers use req.tenantId or canAccessSession, not req.query.client', async () => {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const root = join(process.cwd(), 'server', 'routes');
    const files = ['leads.js', 'sessions.js', 'emergency.js', 'appointments.js'];
    for (const file of files) {
      const src = readFileSync(join(root, file), 'utf8');
      const authGetBlocks = src.split('requireDashboardAuth');
      expect(authGetBlocks.length).toBeGreaterThan(1);
      for (const block of authGetBlocks.slice(1)) {
        expect(block).not.toMatch(/req\.query\.client/);
      }
    }
    const sessionsSrc = readFileSync(join(root, 'sessions.js'), 'utf8');
    expect(sessionsSrc).toMatch(/req\.tenantId/);
    expect(sessionsSrc).toMatch(/canAccessSession/);
  });
});
