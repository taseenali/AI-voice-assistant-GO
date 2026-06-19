# MedVoice AI — Agent Context

Read this first. It overrides any other context you find in this repo.

---

## What this project is

**MedVoice AI** (brand name: **MVAIR**) is a multi-tenant AI phone receptionist for medical clinics. When a patient calls a clinic's phone number, an AI agent named **Aria** answers, books appointments on Google Calendar, and captures patient leads — all via voice.

**Stack:**
- **Phone AI:** Vapi (vapi.ai) — handles the phone call, voice synthesis, speech recognition
- **Backend:** Node.js / Express on port 3001 — webhook receiver, calendar tools, DB, tenant config
- **Database:** SQLite via `better-sqlite3` — sessions, leads, appointments, tenants, users
- **Dashboard:** React + Vite + Tailwind on port 5173 — admin UI for sessions/leads/appointments
- **Design system:** MVAIR — CSS custom properties in `tokens/brand.css`, bridged to Tailwind via `dashboard/tailwind.config.js`

**How a call works:**
```
Patient dials +18564402211
  → Vapi receives the call
  → Vapi POSTs assistant-request to https://<ngrok>/api/vapi/webhook
  → Express resolves tenant by phone number (phone_numbers table → medical-clinic)
  → Returns Aria assistant config (tools: check_availability, book_appointment, capture_lead, log_emergency)
  → Patient talks to Aria; Vapi calls tool endpoints on our webhook
  → check_availability / book_appointment hit Google Calendar API
  → capture_lead saves name/phone/reason to SQLite leads table
  → end-of-call-report saves session, transcript, duration
```

---

## Ports

| Port | What runs there |
|---|---|
| 3001 | Express API server (`server/index.js`) |
| 5173 | React dashboard (`dashboard/`) — `npm run dev --prefix dashboard` |
| 3000 | Live Receptionist Monitor (`live/`) — `npm run live` — real-time call view |
| 4040 | ngrok local inspector |

---

## Live source directories

```
server/
  index.js                     Express app entry point
  lib/
    database.js                SQLite init + all prepared statements (sessions, leads, etc.)
    platform-migrations.js     Platform table migrations + platformQueries
  platform/
    bootstrap.js               Seeds tenants from configs/ on startup
    tenants/
      tenant-service.js        buildSystemPrompt(), getTenantConfig(), resolveTenantByPhone()
    vapi/
      assistant-builder.js     Builds Aria assistant response for Vapi (tools, voice, prompt)
      webhook-handler.js       Routes Vapi events: assistant-request, tool-calls, end-of-call-report
      webhook-auth.js          Validates x-vapi-secret header
      context.js               extractTenantId(), extractCallId() helpers
    tools/
      tool-calls-handler.js    Dispatches tool calls to calendar / emergency / capture-lead
      calendar-tool.js         checkAvailability(), bookAppointment() — Google Calendar API
      emergency-tool.js        logEmergency()
      capture-lead-tool.js     saveLead()
    safety/
      transcript-scanner.js    Deterministic emergency keyword scan on live transcript
  routes/
    vapi.js                    POST /api/vapi/webhook
    auth.js                    POST /api/auth/login, /logout
    sessions.js                GET /api/sessions
    leads.js                   GET /api/leads
    appointments.js            GET /api/appointments
    admin.js                   GET/POST /api/admin/tenants, users
    calendar.js                GET /api/calendar/upcoming
    emergency.js               GET /api/emergency-events
    health.js                  GET /health
    sessions.js                sessions CRUD

configs/
  medical-clinic.json          Primary tenant — Aria, real Google Calendar, Asia/Karachi timezone
  default.json                 Fallback defaults
  northgate-family-health.json Demo tenant
  sunrise-dental.json          Demo tenant
  valley-physiotherapy.json    Demo tenant

tokens/
  brand.css                    MASTER MVAIR design tokens (--mvair-* CSS variables)
  dashboard-components.css     Component-level token aliases

dashboard/
  src/
    styles/globals.css         Tailwind entry — MVAIR :root vars inlined here (no @import)
    tailwind.config.js         Bridges Tailwind to --mvair-* via var()
    App.tsx                    React router root
    main.tsx                   Dashboard entry
    marketing/                 Landing page (main.tsx → Landing.tsx → sections/)
  landing.html                 Landing page entry (served at /landing.html)
  index.html                   Dashboard entry
  vite.config.ts               Dual entry (index + landing), proxy /api → 3001

tests/                         Vitest suite — 69 tests, run with `npm test`

live/                          Real-time call monitor (port 3000) — see below
```

---

## Dead code — DO NOT edit or reference

These exist in the repo but are from the pre-Vapi era. They are superseded and will be removed.

| Path | What it was |
|---|---|
| `js/` | Old browser-side NLP engine (intent detection, conversation flows, state machine). Replaced by Vapi + `server/platform/`. |
| `index.html` (root) | Old voice chat web UI entry point. Replaced by `dashboard/`. |
| `styles.css` (root) | Old voice chat styles. |
| `sw.js` | Old service worker. |
| `dist/` (root) | Old Vite build output from the prototype. |
| `server/routes/voice.js` | Old voice route stub. |
| `server/routes/llm-proxy.js` | Old Ollama LLM proxy — not used in current Vapi flow. |
| `monitor-deepseek.ps1` | Old PowerShell monitoring script. |
| `operational-intelligence-files/` | Old agent session logs and NLP documentation from pre-Vapi development. Context is obsolete. |
| `system_validation_summary.md` | Old validation doc from pre-Vapi phase. |
| `testCalendar.js` / `check-db.js` | One-off debug scripts. Not part of the application. |

---

## Design system — MVAIR

**One source of truth for tokens:** `tokens/brand.css`

All UI must use `--mvair-*` CSS variables. Never hardcode colors.

| Token | Value | Use |
|---|---|---|
| `--mvair-dark` | `#0C1A20` | Sidebar / dark panels |
| `--mvair-surface` | `#FBFCFD` | Page background |
| `--mvair-primary` | `#0B5563` | Petrol teal — buttons, links, active states |
| `--mvair-primary-dark` | `#084149` | Button hover |
| `--mvair-accent` | `#2DD4BF` | Aqua highlight |
| `--mvair-signal` | `#C6F24E` | Chartreuse — live pulse dot only |
| `--mvair-text-primary` | `#0E1B23` | Body text |
| `--mvair-text-secondary` | `#5A6B72` | Muted text |
| `--mvair-danger` | `#DA3633` | Error / emergency |

**Fonts:** Hanken Grotesk (body/UI) · Newsreader (display/headings). Both loaded via Google Fonts in `globals.css`.

**In the dashboard:** `globals.css` inlines the full `:root {}` block directly (no @import — Vite's `fs.strict` drops external imports). If you add a token, add it in BOTH `tokens/brand.css` AND `dashboard/src/styles/globals.css`.

**In Tailwind:** Colors are bridged via `var(--mvair-*)` in `dashboard/tailwind.config.js`. Use classes like `bg-primary`, `text-accent`, `border-card-border` — not raw hex values.

---

## Environment variables (`.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Express port (3001) |
| `VAPI_API_KEY` | Vapi API key — never log |
| `VAPI_WEBHOOK_SECRET` | Validates x-vapi-secret header on all Vapi webhook calls |
| `VAPI_SPIKE_MODE` | `false` = full Aria assistant. `true` = capture-only spike (no calendar). Keep `false`. |
| `PUBLIC_URL` | ngrok tunnel URL — must match what Vapi's phone number points to |
| `G_CLIENT_EMAIL` | Google service account email — never log |
| `G_PRIVATE_KEY` | Google service account private key — never log, never print |
| `G_CALENDAR_SCOPE` | Calendar API scope |
| `ALLOWED_ORIGINS` | CORS — `http://localhost:5173` for dev |

**Security rule:** Never read, print, or expose `G_PRIVATE_KEY`, `VAPI_WEBHOOK_SECRET`, or `VAPI_API_KEY` values. Check presence only (`!!process.env.VAR`).

---

## Key conventions

- **ESM throughout** — all server files use `import`/`export`, `"type": "module"` in package.json
- **No transpilation on server** — Node runs `.js` files directly, no build step
- **SQLite is runtime state** — `server/data/*.db` is gitignored. Schema is in `server/lib/database.js` and `server/lib/platform-migrations.js` (auto-migrated on boot)
- **Tenant config is dual-source** — `configs/*.json` is the source of truth; `seedTenantsFromConfigs()` writes it to SQLite on every server start
- **Tool responses must be strings** — Vapi requires `results[].result` to be a plain string, not an object
- **Date handling** — calendar tools use `Asia/Karachi` timezone for `medical-clinic`. Always pass full `YYYY-MM-DD` dates. Never pass past dates — the calendar tool now rejects them with a clear error.
- **Tests** — `npm test` runs 69 Vitest tests in `tests/`. Tests must pass before any PR.

---

## Running locally

```bash
# Start API server
npm run dev:server        # node --watch server/index.js on port 3001

# Start dashboard
npm run dashboard         # Vite dev server on port 5173

# Start live monitor (call 3000)
npm run live              # Vite dev server on port 3000

# Run tests
npm test

# Both servers need ngrok for Vapi webhook:
# ngrok http 3001
# Then update PUBLIC_URL in .env and restart server
```

---

## Current sprint status (as of 2026-06-19)

**Done:**
- Vapi phone integration — Aria answers calls, books appointments, captures leads
- Google Calendar integration — `check_availability` + `book_appointment` working against real calendar
- Multi-tenant architecture — `configs/*.json` seeds SQLite on boot
- Dashboard — sessions, leads, appointments, emergency events panels
- MVAIR design system — tokens, Tailwind bridge, dashboard styled
- Marketing landing page — `dashboard/src/marketing/` (React)
- Call #2 completed — first live end-to-end booking verified

**Active fixes (just applied):**
- System prompt now injects `TODAY IS: <date>` — prevents LLM date hallucination
- Calendar tool rejects past dates with clear error for LLM self-correction
- Phone guidance: Aria confirms number back, saves with +1 country code
- Transcript parser captures AI/Aria turns (was only saving user turns)
- Duration calculated from `startedAt`/`endedAt` (Vapi doesn't send a `duration` field)
- `vitest.config.js` fixed after root `vite.config.js` was deleted

**Next:**
- Live Receptionist Monitor at `localhost:3000` — real-time call view (in progress)
- Railway + Vercel deployment (Sprint E)
