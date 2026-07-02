# MedVoice AI — Project Brief
**For stakeholder presentation and business planning**  
Prepared from codebase analysis · Last updated: 2026-07-02

---

## 1. PRODUCT OVERVIEW

**MedVoice AI** (brand name: **MVAIR**) is a multi-tenant, AI-powered phone receptionist SaaS for medical clinics. When a patient calls a clinic's direct phone number, an AI agent named **Aria** answers 24/7, qualifies the caller, books appointments directly on Google Calendar, captures patient lead data, and escalates medical emergencies — all in real time, with no human intervention required.

**The core value proposition:**
- Clinics never miss a call outside business hours
- Reception staff spend zero time on appointment scheduling phone calls
- Patient information is captured automatically and available in a dashboard within seconds of the call ending
- Emergency keywords trigger automatic escalation protocols

**Live proof:** As of 2026-06-19, the system is running on a real phone number (+18564402211) with verified end-to-end bookings against a live Google Calendar. Call #2 produced the first confirmed live appointment booking.

**Target customer:** Small-to-mid-size medical clinics (1–10 providers). Initial clinic: "MedVoice Medical" (internal pilot tenant).

---

## 2. ARCHITECTURE

### System topology

```
Patient call
  → Vapi (cloud telephony + LLM + TTS)
      ↓ webhook
  → Express API (port 3001, Node.js ESM)
      ↓ reads tenant config from SQLite
  → Aria assistant config returned to Vapi
      ↓ Vapi runs the call; tool calls POST back to Express
  → Calendar tools (Google Calendar API)
  → lead / session / emergency stored in SQLite
  → SSE event broadcast to React dashboard
  → React dashboard (port 5173, Vite + Tailwind)
```

### Components and their source

| Component | Runtime | Source path |
|---|---|---|
| API server | Node.js ≥20.9 / Express | `server/index.js` |
| Phone AI / STT / TTS / LLM | Vapi cloud (hosted) | External |
| Database | SQLite via `better-sqlite3` | `server/lib/database.js`, `server/lib/platform-migrations.js` |
| Calendar integration | Google Calendar API v3 | `server/platform/tools/calendar-tool.js` |
| Webhook handler | Express route | `server/platform/vapi/webhook-handler.js` |
| Assistant builder | Tenant config → Aria config | `server/platform/vapi/assistant-builder.js` |
| Tenant config source | JSON + SQLite (dual source) | `configs/*.json` → SQLite on boot |
| Dashboard UI | React + Vite + Tailwind | `dashboard/` |
| Live call monitor | SSE + React | `server/routes/call-stream.js`, `live/` (port 3000) |
| Auth | JWT (httpOnly cookies) + bcryptjs | `server/routes/auth.js`, `server/platform/auth/clinic-auth.js` |
| Design tokens | CSS custom properties | `tokens/brand.css` |

### Call flow (detailed)

1. Patient dials → Vapi receives on the assigned phone number
2. Vapi POSTs `assistant-request` to `https://<ngrok>/api/vapi/webhook`
3. `webhook-handler.js` resolves tenant by phone number: `phone_numbers` table → `medical-clinic`
4. `assistant-builder.js` returns the full Aria config: voice, system prompt, tools, first message
5. Patient talks to Aria; Vapi calls tool endpoints as needed:
   - `check_availability` → Google Calendar freeBusy query
   - `get_available_slots` → returns open slots for the day
   - `book_appointment` → creates Google Calendar event, saves to `appointments` table
   - `capture_lead` → saves name/phone/reason/urgency to `leads` table
   - `log_emergency` → saves to `emergency_events` table, marks session `emergency_detected = 1`
6. Aria's transcript is scanned in real time by `transcript-scanner.js` (30+ emergency keywords, deterministic)
7. End-of-call report arrives → `sessions` table updated with duration, cost, recording URL, summary, success evaluation

### Database schema (SQLite)

Core tables (source: `server/lib/database.js` + `server/lib/platform-migrations.js`):
- `sessions` — one row per call; `session_id`, `channel`, `cost_usd`, `recording_url`, `phone_number`, `success_evaluation`
- `conversation_turns` — every utterance; `role` = `user` | `assistant`
- `leads` — patient intake data per session
- `emergency_events` — flagged keywords; `resolved` boolean; `owner`
- `tenants` — one row per clinic; `plan_tier`, `status`
- `tenant_config` — Aria config per clinic: voice, prompt, business hours, services, emergency keywords, calendar ID
- `phone_numbers` — maps phone number → tenant
- `users` — clinic staff accounts; role: `super_admin` | `clinic_admin` | `clinic_staff`
- `appointments` — confirmed Google Calendar bookings
- `audit_log` — PHI access log; every GET /api/sessions call is recorded

### External service dependencies

| Service | Purpose | Removal impact |
|---|---|---|
| **Vapi** | STT, LLM (gpt-4o-mini), TTS, telephony | System cannot answer calls |
| **Google Calendar API** | Appointment availability + booking | Aria falls back to "team will call you back" |
| **Railway** | Server hosting (target, not yet live) | — |
| **Vercel** | Dashboard hosting (target, not yet live) | — |
| **ngrok** | Dev tunnel for Vapi webhooks (dev only) | Required in local dev; replaced by Railway URL in production |
| **ElevenLabs** | Premium TTS voice (optional) | Falls back to Vapi's built-in voice |
| **Twilio** | Outbound SMS notifications (optional) | SMS disabled; no call impact |

---

## 3. FEATURE INVENTORY

### Voice AI (production-ready)
| Feature | Status | Source |
|---|---|---|
| Answer inbound calls 24/7 | ✅ Live | `server/platform/vapi/` |
| Resolve tenant from caller's dialed number | ✅ Live | `server/platform/tenants/tenant-service.js` |
| Multi-service appointment booking (4 service types) | ✅ Live | `server/platform/tools/calendar-tool.js` |
| Check calendar availability before booking | ✅ Live | `server/platform/tools/calendar-tool.js` |
| Reject past-date booking attempts with helpful error | ✅ Live | `server/platform/tools/calendar-tool.js` |
| Capture patient lead (name, phone, reason, urgency) | ✅ Live | `server/platform/tools/capture-lead-tool.js` |
| Emergency keyword detection (real-time transcript scan) | ✅ Live | `server/platform/safety/transcript-scanner.js` |
| Emergency escalation logging | ✅ Live | `server/platform/tools/emergency-tool.js` |
| Call recording URL storage | ✅ Live | `server/platform/vapi/webhook-handler.js` |
| Call cost tracking (per-session USD) | ✅ Live | `server/routes/sessions.js` + analytics |
| AI call summary + success evaluation | ✅ Live | `server/platform/vapi/webhook-handler.js` |
| Date-aware system prompt (prevents LLM hallucination) | ✅ Live | `server/platform/tenants/tenant-service.js` |
| Phone number confirmed back by Aria (with +1 prefix) | ✅ Live | `configs/medical-clinic.json` system prompt |
| Timezone-aware scheduling (Asia/Karachi) | ✅ Live | `configs/medical-clinic.json` |

### Dashboard (production-ready panels)
| Panel | Feature | Status |
|---|---|---|
| Command Center | KPI row, outcome donut, AI insight card, recent sessions table | ✅ |
| Calls | Session list with recording playback, transcript viewer, load more | ✅ |
| Appointments | Google Calendar bookings list | ✅ |
| Leads | Patient lead profiles, detail panel, completeness scoring, load more | ✅ |
| Emergency | Open/resolved escalation log, resolve button, load more | ✅ |
| Analytics | Daily volume, cost per call, conversion rate, booking rate (30-day) | ✅ |
| System Health | Service status cards, known issues | ✅ |
| Trust & Compliance | BAA record form, compliance checklist | ✅ |
| Aria Config | JSON config editor (VisualView + raw JSON) | ✅ |
| Integrations | Integration status list | ✅ |
| Billing | Plan tier + monthly cost summary | ✅ |
| Users | Add/deactivate clinic users | ✅ |
| Live Monitor | Real-time active call view (SSE) | ⚠️ Stub — SSE endpoint needs implementation |
| Admin: Clinics | Tenant list (super_admin) | ✅ |
| Admin: Audit Log | PHI access log with filters | ✅ |

### Auth & access control
- 3-role system: `super_admin` / `clinic_admin` / `clinic_staff`
- JWT stored in httpOnly cookies; 7-day expiry
- Role-filtered nav sidebar
- Tenant isolation: every API route filters by `req.tenantId` from JWT
- ⌘K command palette for page navigation
- Theme (dark/light) and density (comfortable/compact) toggles

### Multi-tenant management
- Tenant configuration stored in `configs/*.json` and seeded to SQLite on every server boot (`server/platform/bootstrap.js`)
- 4 tenants currently configured: `medical-clinic` (live), `northgate-family-health`, `sunrise-dental`, `valley-physiotherapy` (demo/seed)
- Super-admin tenant switcher in dashboard header

---

## 4. COST DRIVERS

### Per-call cost (Vapi-hosted)
Vapi charges per minute of call time. Cost is captured per session in `sessions.cost_usd` and aggregated in `server/routes/analytics.js`. Based on Vapi's public pricing (gpt-4o-mini transport):

| Component | Approx. cost |
|---|---|
| Vapi voice transport (STT + TTS) | ~$0.05–0.08 / min |
| LLM (gpt-4o-mini, via Vapi) | ~$0.01–0.02 / min |
| Google Calendar API | Free (within quota) |
| **Typical 3-minute call** | **~$0.18–$0.30** |

Cost data flows: `end-of-call-report` → `webhook-handler.js` → `sessions.cost_usd` → `GET /api/analytics/costs` → Billing panel.

### Infrastructure cost (proposed production)
| Service | Tier | Est. monthly |
|---|---|---|
| Railway (server + SQLite volume) | Hobby / Pro | $5–20/mo |
| Vercel (dashboard) | Hobby | $0 |
| Vapi (phone number) | Per number | ~$2/number/mo |
| Vapi call minutes | Volume-based | ~$50–200/mo (est.) |
| Google Calendar API | Free | $0 |
| **Total infra (100 calls/mo)** | | **~$60–225/mo** |

### Proposed billing tiers (defined in plan, not yet in DB)
| Tier | Calls/month | Price/month | Margin est. |
|---|---|---|---|
| Starter | 500 | $199 | ~$100 net |
| Growth | 2,000 | $499 | ~$200 net |
| Enterprise | Unlimited | Custom | Negotiated |

Tier table (`plan_tiers`) is defined in the roadmap (`server/lib/platform-migrations.js`) but not yet migrated. Billing panel currently reads analytics endpoint for cost summary.

---

## 5. MULTI-TENANCY READINESS

### What's working
- Every DB query scopes to `client_id` / `tenant_id` — cross-tenant data leakage is prevented at the query layer (`server/lib/database.js`, `server/routes/sessions.js`)
- Tenant resolved by phone number at call time — no shared phone numbers (`phone_numbers` table)
- Each tenant has isolated: sessions, leads, appointments, emergency events, users, audit log
- Tenant config (Aria persona, services, keywords, hours, calendar) is per-tenant (`tenant_config` table)
- Super-admin can switch between tenants in the dashboard without logging out
- 4 tenant configs ready in `configs/` — deploy a new clinic by adding a JSON file and restarting

### Gaps
- **Tenant creation requires a JSON file + server restart** — no self-serve UI or API yet. Roadmap item (Phase 5 in the production plan).
- **Phone number assignment to new tenants** is manual (requires Vapi dashboard + row insertion in `phone_numbers` table).
- **Per-tenant calendar** is supported in schema (`tenant_config.calendar_id`) and config, but the Google service account is shared across all tenants. Each clinic must share the same GCP project or a per-tenant setup is needed.
- **Tenant isolation on emergency resolve** — a fix is scheduled: `PUT /api/emergency-events/:id/resolve` must verify the event belongs to the requesting tenant (see Phase 1B in production plan).

---

## 6. COMPLIANCE GAPS

This section reflects the **current codebase state** against HIPAA requirements. This is not a legal opinion.

| Area | Current state | Risk |
|---|---|---|
| **PHI at rest** | SQLite stored in plaintext at `server/data/medvoice.db` | Medium — file access = PHI access |
| **PHI in transit** | Vapi → Express webhook uses HMAC-SHA256 validation (`server/platform/vapi/webhook-auth.js`); Dashboard → API uses HTTPS in production (Railway) | Low in production |
| **BAA with Vapi** | No signed BAA on record. Vapi does offer BAA for covered entities. | **High** — calling Vapi without a BAA is a HIPAA violation if PHI is transmitted |
| **BAA with Google** | Google Workspace BAA covers Calendar API when using a HIPAA-eligible Google account | Verify with clinic's Google account type |
| **Audit logging** | PHI access logged for `GET /api/sessions`, `GET /api/leads`, and emergency events (`server/lib/audit.js`) | Partial — write events (POST leads via webhook) are not yet in audit log |
| **Encryption at rest** | Not implemented | Medium — mitigated if Railway volume is encrypted-at-rest (Railway does encrypt volumes) |
| **User access control** | 3 roles, JWT auth, httpOnly cookies | Good — no known gaps |
| **Deactivated user login** | `WHERE active = 1` check is present in login query but needs verification | Low |
| **Emergency resolve tenant check** | Cross-tenant resolve not yet blocked | Medium |
| **Data retention policy** | No automated retention/purge. Scripts exist: `server/scripts/retain-data.mjs` | Medium — HIPAA requires defined retention |
| **Business Associate Agreement (UI)** | BAA record form exists in Trust & Compliance panel (`dashboard/src/components/panels/Admin/Compliance.tsx`) | Informational only — not a real BAA generator |
| **Recording storage** | Recording URLs point to Vapi-hosted storage. Vapi's data retention policy applies. | Depends on Vapi BAA status |

**Top 3 compliance actions before HIPAA-covered production launch:**
1. Sign BAA with Vapi
2. Confirm Google Workspace account is HIPAA-eligible and activate BAA
3. Enable SQLite encryption at rest (Railway volume encryption is automatic; verify it's on)

---

## 7. REMAINING WORK

Items are ordered by dependency and business impact.

### Immediate (before first paying client)

| Item | What | Source / File |
|---|---|---|
| Sign Vapi BAA | Contract — cannot transmit PHI to Vapi without it | External action (vapi.ai) |
| Railway deployment | Server deploy + Volume mount for SQLite | `railway.toml` (in roadmap), Railway dashboard |
| Vercel deployment | Dashboard deploy + `VITE_API_BASE_URL` env var | Vercel dashboard |
| Vapi webhook URL update | Set `PUBLIC_URL` to Railway URL in Vapi dashboard | `.env` + Vapi phone number config |
| Production `.env` | Set `JWT_SECRET`, `PLATFORM_ADMIN_PASSWORD`, `VAPI_WEBHOOK_SECRET` to real values | `.env.example` |
| ngrok → off | After Railway deployment, remove ngrok from the call path | `PUBLIC_URL` env var |

### High priority (pre-scale)

| Item | What | File |
|---|---|---|
| Live Monitor (SSE) | Real-time transcript stream during active calls | `server/routes/call-stream.js`, `dashboard/src/components/panels/LiveMonitor/LiveMonitor.tsx` |
| Tenant creation UI + API | Super-admin can add a new clinic without editing JSON | `server/routes/admin.js`, `dashboard/src/components/panels/Admin/TenantsAdmin.tsx` |
| Emergency resolve tenant check | Block cross-tenant emergency resolution | `server/routes/emergency.js` |
| Billing endpoint (`/api/billing/usage`) | Proper call volume vs. plan limit tracking | `server/routes/analytics.js` |
| System Health: remove hardcoded latency | Replace fake 420/1200/2800ms values with real status or "—" | `dashboard/src/components/panels/SystemHealth/SystemHealth.tsx` |
| Integrations: real status badges | Show actual Google Calendar / Vapi connection status | `dashboard/src/components/panels/Integrations/Integrations.tsx`, `server/routes/health.js` |
| Emergency keywords from config | Panel currently hardcodes "chest pain, difficulty breathing…" — should pull from `tenant_config.emergency_keywords` | `dashboard/src/components/panels/Emergency/EmergencyLog.tsx` |

### Medium priority (Growth tier)

| Item | What | File |
|---|---|---|
| Structured Config Form | Replace raw JSON editor with validated form fields | `dashboard/src/components/panels/Configuration/ConfigForm.tsx` (new) |
| Phone number self-service | Assign Vapi phone numbers to new tenants from dashboard | `server/routes/admin.js` + Vapi API |
| Stripe billing | Automated invoicing, plan upgrades | New (no code yet) |
| SMS notifications | Outbound SMS for appointment confirmations (Twilio wired, credentials not set) | `server/routes/` + `.env` TWILIO vars |
| Per-tenant Google Calendar | Each clinic uses their own calendar (currently shared service account) | `server/platform/tools/calendar-tool.js` |
| Email notifications | Confirmation email after booking | New |

---

## 8. RISKS

### Technical risks

| Risk | Severity | Mitigation |
|---|---|---|
| **SQLite single-file DB** — not horizontally scalable; concurrent writes on Railway could queue under high load | Medium | WAL mode enabled (`server/lib/database.js:24`); acceptable to ~500 concurrent users; migrate to Postgres if needed post-MVP |
| **ngrok as load-bearing dev dependency** — if ngrok session expires, all inbound calls fail silently | High (dev only) | Eliminated by Railway deployment; tracked in `PUBLIC_URL` env var |
| **Vapi API changes** — Vapi's webhook contract, tool call format, or pricing can change without notice | Medium | Webhook handler is isolated to `server/platform/vapi/`; schema changes are contained |
| **Google Calendar quota** — API has 1M requests/day free tier per project; shared service account across tenants | Low at current scale | Per-tenant service accounts if quota becomes a constraint |
| **LLM hallucination / date errors** — Aria could book wrong dates | Mitigated | System prompt injects `TODAY IS: <date>`; past-date rejection in calendar tool |
| **Emergency false positives** — keyword scanner could flag non-emergencies | Low | Deterministic keyword list (`configs/medical-clinic.json` emergency_keywords); 30+ keywords tuned manually |
| **Recording URL permanence** — recordings hosted by Vapi; if Vapi changes storage policy, URLs break | Medium | No mitigation yet; depends on Vapi BAA and data terms |

### Business risks

| Risk | Severity | Note |
|---|---|---|
| **Vapi BAA absent** — PHI is transmitted to Vapi on every call; without a signed BAA, this is a HIPAA violation | **High** | Must resolve before first paying clinic |
| **Single cloud provider lock-in (Vapi)** | Medium | STT, LLM, TTS, and telephony are all Vapi-managed; switching requires replacing all 4 layers |
| **No recurring billing infrastructure** | Medium | Currently no Stripe integration; plan tiers are defined in code but not enforced or invoiced |
| **Per-call cost floor limits low-volume pricing** | Low-Medium | At ~$0.25/call, 500 calls = ~$125 in Vapi costs against a $199/mo plan → 37% gross margin (tight) |
| **Timezone hardcoding** | Low | `medical-clinic` is Asia/Karachi; per-tenant timezone is in schema but must be verified per new tenant |

---

## Appendix: Key File Index

| What you're looking for | Where it lives |
|---|---|
| Vapi call flow | `server/platform/vapi/webhook-handler.js` |
| Aria persona & tools config builder | `server/platform/vapi/assistant-builder.js` |
| Primary tenant config (medical-clinic) | `configs/medical-clinic.json` |
| All tenant configs | `configs/*.json` |
| Calendar booking / availability | `server/platform/tools/calendar-tool.js` |
| Emergency keyword scanning | `server/platform/safety/transcript-scanner.js` |
| Database schema | `server/lib/database.js` + `server/lib/platform-migrations.js` |
| Auth middleware | `server/platform/auth/clinic-auth.js` |
| Dashboard entry | `dashboard/src/App.tsx` |
| Design tokens (MVAIR) | `tokens/brand.css` + `dashboard/src/styles/globals.css` |
| Analytics / cost data | `server/routes/analytics.js` |
| Environment variable reference | `.env.example` |
| Running locally | `CLAUDE.md` → "Running locally" section |
