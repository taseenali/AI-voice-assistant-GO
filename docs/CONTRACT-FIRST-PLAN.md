# MedVoice — Contract-First Build Plan

> **Principle:** Build what you control. Read official docs for what you don't. Test with fixtures before buying Vapi minutes.

**Status:** Phase 1 complete — **Phase 1.5 spike gates Phase 2**  
**Date:** June 2026

> **Sequencing correction:** Do not build dashboard/auth breadth until one live Vapi call diffs captures against fixtures. See [PHASE-3-SPIKE.md](./PHASE-3-SPIKE.md).

---

## 1. Strategic Shift: Two Products in One Repo

MedVoice is splitting into two isolated layers. **Nothing in the new path may depend on the legacy browser orchestrator.**

| Layer | Name | Location | Status |
|-------|------|----------|--------|
| **A — Control Plane** | MedVoice Platform | `server/platform/`, `contracts/` | **BUILD NOW** |
| **B — Legacy Demo** | Browser Widget Orchestrator | `js/`, `index.html` | **FROZEN** — demo only |
| **C — Runtime (external)** | Vapi / LiveKit | Their cloud | **Contract only** — no account required yet |

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER C — Voice Runtime (Vapi)          [external, paid later] │
│  Owns: STT, TTS, turn-taking, WebSocket media                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS only (2 wires)
              ┌─────────────┴─────────────┐
              ▼                           ▼
   assistant-request                 tool-calls
   (config in)                       end-of-call-report
   (config out)                      (callbacks in)
              │                           │
┌─────────────▼───────────────────────────▼───────────────────────┐
│  LAYER A — MedVoice Control Plane (YOU BUILD NOW)               │
│  server/platform/  ·  contracts/  ·  auth  ·  tenants  ·  tools │
└───────────────────────────┬─────────────────────────────────────┘
                            │ optional embed
┌───────────────────────────▼─────────────────────────────────────┐
│  LAYER B — Legacy Web Widget (FROZEN)                             │
│  js/response-orchestrator.js  ·  speech-io.js  ·  browser STT/TTS │
│  Do NOT extend for phone. Do NOT couple platform to this code.    │
└───────────────────────────────────────────────────────────────────┘
```

### Legacy freeze rules (non-negotiable)

1. **No new features** in `js/response-orchestrator.js`, `js/speech-io.js`, `js/state-machine.js`
2. **Do not route phone traffic** through `server/routes/voice.js` (ConversationRelay scaffold)
3. **Platform tool logic** lives in `server/platform/tools/` — not in widget JS
4. **Widget may call** `/api/calendar/*` for demo — platform tools are the canonical implementation
5. **Dashboard** migrates to auth-protected platform APIs; legacy `?client=` query param retired in Phase 2

---

## 2. External Contracts (Read Before Building UI)

Source of truth: [Vapi docs](https://docs.vapi.ai) — fixtures stored in `contracts/vapi/`.

### Wire 1: `assistant-request` (inbound call → your server)

Vapi POSTs when a call arrives and no static `assistantId` is set.

**You must respond within 7.5 seconds** with assistant config or `assistantId` + overrides.

```json
// IN — contracts/vapi/assistant-request.in.json
{
  "message": {
    "type": "assistant-request",
    "call": {
      "id": "call-uuid",
      "phoneNumber": { "number": "+15551234567" }
    }
  }
}

// OUT — your response shape
{
  "assistant": {
    "name": "Aria",
    "firstMessage": "...",
    "model": { "provider": "openai", "model": "gpt-4o-mini", "messages": [...] },
    "voice": { "provider": "11labs", "voiceId": "..." },
    "serverUrl": "https://your-domain.com/api/vapi/webhook"
  }
}
```

Tenant resolution: `call.phoneNumber.number` (dialed) or `to` → lookup `phone_numbers` table → `tenant_id`.

### Wire 2a: `tool-calls` (during call)

```json
// IN — contracts/vapi/tool-calls.in.json
{
  "message": {
    "type": "tool-calls",
    "toolCallList": [{
      "id": "toolu_xxx",
      "name": "check_availability",
      "arguments": { "date": "2026-06-17", "time": "10:00" }
    }],
    "call": { "id": "call-uuid" }
  }
}

// OUT — required exact shape
{
  "results": [{
    "toolCallId": "toolu_xxx",
    "result": "Tuesday 10:00 AM is available."
  }]
}
```

### Wire 2b: `end-of-call-report` (after call)

```json
// IN — contracts/vapi/end-of-call-report.in.json
{
  "message": {
    "type": "end-of-call-report",
    "call": { "id": "...", "duration": 180 },
    "artifact": {
      "transcript": "...",
      "recordingUrl": "https://..."
    }
  }
}
// OUT — 200 OK or 204
```

### Static tool parameters (security)

Pass `tenant_id` and `session_id` as Vapi **static parameters** (server-trusted, invisible to LLM). Never let the LLM choose which calendar to touch.

---

## 3. What We Own (Build Without Paying Anyone)

| Component | Contract source | Test method |
|-----------|-----------------|-------------|
| Tenant data model | Our schema | Unit tests + SQLite |
| Auth (JWT) | Our API | Postman / vitest |
| `assistant-request` handler | Vapi docs | POST fixture to `/api/vapi/webhook` |
| Tool: `check_availability` | Our logic + Google API | POST fixture to `/api/tools/check_availability` |
| Tool: `book_appointment` | Our logic + Google API | POST fixture with test calendar |
| Tool: `capture_lead` | Our schema | POST fixture → verify DB row |
| Tool: `log_emergency` | Our schema | POST fixture → verify DB row |
| `end-of-call-report` handler | Vapi docs | POST fixture → session + turns in DB |
| Clinic dashboard (read) | Our API | Auth token + tenant scope |
| Super-admin scaffold | Our API | `role: super_admin` only |
| Webhook dispatcher (server) | Our HMAC contract | Mock HTTP target |

**Does NOT require:** Vapi account, Twilio number, Deepgram, ElevenLabs, production LLM.

**Google Calendar exception:** Needs service account + shared test calendar (free GCP tier).

---

## 4. Directory Layout (New)

```
contracts/
  vapi/                    # Official payload fixtures (from docs)
  README.md
server/
  platform/
    auth/                  # JWT issue, verify, middleware
    tenants/               # CRUD, resolve by phone slug
    tools/                 # Calendar, lead, emergency (canonical)
    vapi/                  # Webhook router, assistant builder
    webhooks/              # Outbound HMAC dispatcher (server-side)
  routes/
    vapi.js                # POST /api/vapi/webhook
    tools.js               # POST /api/tools/:name (standalone test)
    auth.js                # POST /api/auth/login
    tenants.js             # Admin tenant CRUD (super_admin)
  lib/
    database.js            # Extended schema
docs/
  CONTRACT-FIRST-PLAN.md   # This file
  ARCHITECTURE-BOUNDARY.md # Legacy vs platform quick reference
```

---

## 5. Database Evolution

### Phase 1 tables (build now)

```sql
tenants (
  tenant_id TEXT PRIMARY KEY,        -- slug: medical-clinic
  company_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',      -- active | trial | suspended
  plan_tier TEXT DEFAULT 'starter',
  created_at TEXT
)

tenant_config (
  tenant_id TEXT PRIMARY KEY REFERENCES tenants,
  assistant_name TEXT,
  system_prompt TEXT,                -- built from services JSON
  first_message TEXT,
  voice_provider TEXT,
  voice_id TEXT,
  calendar_id TEXT,
  calendar_enabled INTEGER DEFAULT 0,
  business_hours TEXT,               -- JSON
  emergency_keywords TEXT,           -- JSON
  services TEXT,                     -- JSON (from legacy config)
  webhook_url TEXT,
  webhook_secret TEXT
)

phone_numbers (
  phone_number TEXT PRIMARY KEY,     -- E.164
  tenant_id TEXT REFERENCES tenants,
  label TEXT,
  vapi_phone_id TEXT                 -- filled when Vapi account exists
)

users (
  user_id TEXT PRIMARY KEY,
  tenant_id TEXT,                    -- NULL = super_admin
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('super_admin','clinic_admin','clinic_staff')),
  created_at TEXT
)
```

### Extend existing tables

```sql
sessions ADD COLUMN channel TEXT DEFAULT 'web';  -- web | phone
sessions ADD COLUMN external_call_id TEXT;       -- Vapi call.id
sessions ADD COLUMN recording_url TEXT;
sessions ADD COLUMN phone_number TEXT;
```

### Migration path from legacy

1. Seed `tenants` + `tenant_config` from `configs/medical-clinic.json` on boot
2. `GET /api/config` reads from DB first, falls back to JSON (transition)
3. Remove JSON fallback at Phase 2

---

## 6. Execution Phases

### Phase 1 — Foundation (this sprint, no paid accounts)

- [x] This plan document
- [x] `docs/ARCHITECTURE-BOUNDARY.md`
- [x] `contracts/vapi/*` fixtures
- [x] DB schema: tenants, users, phone_numbers, tenant_config
- [x] Seed medical-clinic from JSON
- [x] `server/platform/tools/*` — calendar, lead, emergency
- [x] `POST /api/tools/:toolName` — standalone test endpoints
- [x] `POST /api/vapi/webhook` — dispatches by `message.type`
- [x] `assistant-builder.js` — builds Vapi assistant from tenant_config
- [x] Auth: login, JWT middleware, tenant scoping scaffold
- [x] Vitest contract tests with fixtures
- [ ] Dashboard login + JWT client (Phase 2)
- [ ] Server-side outbound webhook worker (Phase 3)

**Exit criteria:** `curl` fixture → tool response in correct Vapi shape; tenant resolved from phone number; zero imports from `js/`.

### Phase 1.5 — Live contract spike `[BLOCKS PHASE 2]`

See **[PHASE-3-SPIKE.md](./PHASE-3-SPIKE.md)** for full checklist.

- [x] Raw capture instrumentation (`captures/`)
- [x] Webhook auth (`x-vapi-secret`; HMAC scaffold)
- [x] Tool-call normalization (string/object args, `toolCallList`/`toolCalls`)
- [x] HTTP 200 on all tool-call responses
- [x] Spike assistant mode (`VAPI_SPIKE_MODE=true`)
- [x] Deterministic emergency transcript scan (phone)
- [x] Production seed guard for default admin
- [ ] Vapi account + phone number `[you]`
- [ ] ngrok tunnel + one live call `[you]`
- [ ] Diff captures vs fixtures → [SPIKE-DISCREPANCY-LOG.md](./SPIKE-DISCREPANCY-LOG.md)
- [ ] Call #2 with calendar tool (latency measurement)

**Exit criteria:** Three captures match fixtures; agent spoke tool result; lead in DB. **Phase 2 does not start until this passes.**

### Phase 2 — Dashboard + auth integration `[IN PROGRESS — Sprint 2.1 done]`

- [x] Dashboard login page
- [x] API client sends `Authorization: Bearer`
- [x] Clinic read routes enforce JWT + `tenant_id` (`/api/sessions`, `/api/leads`, `/api/emergency` GET)
- [x] Emergency events filtered by tenant
- [x] Config panel reads from `GET /api/admin/tenants/:id` (DB-backed)
- [x] `tests/auth.test.js` — login, 401, cross-tenant 403, hostile invariant suite
- [x] Phone channel surfaced in Overview + Sessions (channel badge, caller, recording)
- [x] Null-safe display helpers (`—` for missing phone/recording on web sessions)
- [ ] Super-admin UI at `/admin/*`
- [ ] Appointments panel (from sessions + calendar events)
- [ ] Deprecate unauthenticated `?client=` on write routes
- [ ] `PLATFORM_REQUIRE_AUTH=true` in production

**Filed (conscious decisions — not today-fix):**
- **JWT in `localStorage`:** readable by any XSS on the dashboard origin. Acceptable for dev; before real PHI in production, move to `httpOnly` secure cookie or equivalent. See `docs/PHASE-2-SECURITY-NOTES.md`.
- **Phone on `capture_lead`:** prompt should collect + confirm callback number; consider `phone` required in tool schema (conversation design, Phase 2+).

### Phase 3 — Vapi production (after spike verified)

- [ ] Create Vapi org; register tools pointing to `/api/vapi/webhook`
- [ ] Import Twilio number
- [ ] Live call test against staging URL (ngrok)
- [ ] Server-side outbound webhook worker

### Phase 4 — Production

- [ ] HIPAA hosting, BAAs, Stripe, pilot clinic

---

## 7. Tool Specifications (Canonical)

### `check_availability`

| Field | Source |
|-------|--------|
| `tenant_id` | Static param (server) |
| `date` | LLM argument |
| `time` | LLM argument |
| `duration_minutes` | LLM argument, default 30 |

Returns natural-language string for Vapi `result` field.

### `book_appointment`

| Field | Source |
|-------|--------|
| `tenant_id` | Static param |
| `date`, `time` | LLM |
| `patient_name`, `reason` | LLM |
| `session_id` | Static param |

Creates Google event + `appointments` row (Phase 1: event only).

### `capture_lead`

Maps to existing `leads` table. Returns confirmation string.

### `log_emergency`

Maps to `emergency_events`. Returns escalation message string.

---

## 8. Testing Strategy

```
tests/
  fixtures/vapi/          # Copy of contracts/vapi/
  vapi-webhook.test.js    # assistant-request, tool-calls, end-of-call
  tools.test.js           # Each tool with mock calendar
  tenant-resolve.test.js  # Phone → tenant mapping
  auth.test.js            # JWT issue + middleware
```

Run: `npm test` — all pass without network except optional calendar integration test (`CALENDAR_TEST=1`).

---

## 9. Environment Variables (Phase 1)

```env
# Auth
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d

# Platform
PLATFORM_SEED_TENANTS=true

# Google Calendar (optional for tool tests)
G_CLIENT_EMAIL=...
G_PRIVATE_KEY=...

# Vapi (Phase 3 only)
# VAPI_API_KEY=
# VAPI_WEBHOOK_SECRET=
```

---

## 10. What NOT to Do

| Anti-pattern | Why |
|--------------|-----|
| Add phone logic to `js/speech-io.js` | Wrong layer |
| Extend `voice.js` ConversationRelay | Replaced by Vapi |
| Build dashboard UI before API contracts tested | UI on imaginary shapes |
| Store tenant secrets in `configs/*.json` long-term | DB + env injection |
| Let LLM pass `calendar_id` | Tenant isolation breach |
| Couple platform imports to `js/*` | Breaks isolation |

---

## 11. Success Definition for Phase 1

1. `POST /api/vapi/webhook` + `assistant-request.in.json` → valid assistant JSON in <100ms
2. `POST /api/vapi/webhook` + `tool-calls.in.json` → `{ results: [{ toolCallId, result }] }`
3. `POST /api/tools/check_availability` works standalone with tenant header
4. Login → JWT → `GET /api/leads` scoped to tenant
5. All vitest contract tests green
6. Legacy widget still runs unchanged (no regressions)

---

*Next file: `docs/ARCHITECTURE-BOUNDARY.md` · Implementation: `server/platform/`*
