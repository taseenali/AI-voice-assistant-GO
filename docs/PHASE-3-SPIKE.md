# Phase 1.5 — Live Contract Verification Spike

> **Gate:** Phase 2 (dashboard, auth enforcement, admin UI) does **not** start until this spike passes.  
> **Principle:** Fixtures are docs-derived guesses until a real Vapi call proves them.

**Status:** Ground prepared — awaiting live call  
**Companion:** [CONTRACT-FIRST-PLAN.md](./CONTRACT-FIRST-PLAN.md) · [EMERGENCY-PHONE-PATH.md](./EMERGENCY-PHONE-PATH.md)

---

## Why this exists

Phase 1 built handlers against `contracts/vapi/*.json`. Those fixtures are load-bearing assumptions. A single real call through ngrok diffs actual payloads against fixtures **before** building dashboard breadth on wrong shapes.

**Excluded deliberately:** multi-tenancy edge cases, auth enforcement, dashboard, calendar latency (call #2).

---

## Success criterion

| # | Deliverable |
|---|-------------|
| 1 | Three raw payloads in `captures/` (assistant-request, tool-calls, end-of-call-report) |
| 2 | Field-by-field diff vs `contracts/vapi/*.json` |
| 3 | Every discrepancy logged in [SPIKE-DISCREPANCY-LOG.md](./SPIKE-DISCREPANCY-LOG.md) |
| 4 | Fixtures + handlers updated to match reality |
| 5 | Agent **spoke** the tool result on the call |
| 6 | One `capture_lead` row in DB |
| 7 | `npm test -- tests/vapi-contract.test.js` still green |

**Only then:** Phase 2 starts.

---

## Revised sequencing

```
Phase 1   ✅ Platform foundation (done)
Phase 1.5 ⬅ YOU ARE HERE — live contract spike
Phase 2   Dashboard + auth (blocked until 1.5 passes)
Phase 3   Vapi production wiring + Twilio import
Phase 4   First paying client
```

---

## Step 0 — Raw capture instrumentation `[code — done]`

Every inbound webhook body is written to `captures/` **before** parsing.

- Module: `server/platform/vapi/capture.js`
- Mounted on: `POST /api/vapi/webhook` (first middleware)
- `captures/` is in `.gitignore` (PHI-adjacent)
- Remove `capture.js` after spike passes

---

## Step 1 — Vapi account + number `[you — not started]`

1. Sign up at [dashboard.vapi.ai](https://dashboard.vapi.ai) ($10 credit)
2. Copy **Private Key** (API Keys → Server-side) → `VAPI_API_KEY` in `.env` — **not** the Public Key
3. Use **Vapi default** STT/LLM/voice — do not wire Deepgram/ElevenLabs yet
4. Get a Vapi-provided phone number (Twilio import waits)

> **Spike nuance:** Call #1 is webhook-driven (transient assistant from your `assistant-request` handler). The API key does **not** block the first call — Vapi calls **you**. You still save the key now for later (call logs, programmatic number management).

---

## Step 2 — Tunnel `[you — not started]`

```powershell
ngrok http 3001
```

Copy `https://….ngrok-free.app` → set `PUBLIC_URL` in `.env`  
**Do not start ngrok until Step 3 env is ready** (URL changes on restart).

---

## Step 3 — Webhook auth `[code — done, you configure secret]`

Spike: plaintext header check (`x-vapi-secret` === `VAPI_WEBHOOK_SECRET`).  
Production: upgrade to `X-Vapi-Signature` HMAC (scaffold in `webhook-auth.js`).

```env
VAPI_WEBHOOK_SECRET=generate-a-long-random-string
VAPI_SPIKE_MODE=true
PUBLIC_URL=https://your-subdomain.ngrok-free.app
```

Auth runs **before** capture handler processes body. Unauthenticated POSTs → `401`.

---

## Step 4 — Spike assistant config `[code — done]`

When `VAPI_SPIKE_MODE=true`, `assistant-request` returns a **minimal** assistant:

- One tool: `capture_lead` only (no Google round-trip)
- Tool `server.url` → `{PUBLIC_URL}/api/vapi/webhook`
- Tool `server.headers` → `{ "x-vapi-secret": "<VAPI_WEBHOOK_SECRET>" }`
- System prompt: get name + reason, call `capture_lead`, one-sentence replies

Reference shape in `contracts/vapi/spike-assistant.out.json`.

Point the Vapi phone number's **server URL** at the same `/api/vapi/webhook` endpoint.

---

## Step 5 — Place the call `[you — not started]`

Dial the number. Script:

> *"I'd like to book an appointment. My name is Jane Doe, it's for a checkup."*

Hang up within 30 seconds to fire `end-of-call-report`.

**Listen for:** agent speaks the tool result aloud. If call log shows "No result returned" → tool response shape is wrong.

---

## Step 6 — Diff captures `[the deliverable]`

```powershell
# After call, list captures
Get-ChildItem captures/

# Compare each file to fixture
# Log every difference in docs/SPIKE-DISCREPANCY-LOG.md
```

### tool-calls — confirm

| Check | Why |
|-------|-----|
| Array key: `toolCallList` vs `toolCalls` | Historical variance |
| Item `.id` field name | Must match response `toolCallId` |
| `.name` vs `.function.name` | Shape variance |
| `.arguments` string vs object | Router must parse both |

### tool response — confirm

| Check | Why |
|-------|-----|
| Top-level `{ results: [...] }` | Bare object fails silently |
| `toolCallId` exact match | Mismatch = ignored |
| `result` is a **string** | Objects/arrays break TTS |
| HTTP **200** even on error | Other statuses ignored |
| Token limit (default 100) | Verbose results truncated |

### end-of-call-report — confirm

| Check | Map to |
|-------|--------|
| Transcript field name/path | `conversation_turns` |
| `recordingUrl` vs alternatives | `sessions.recording_url` |
| `call.id`, `call.duration` | `external_call_id`, `duration_seconds` |
| `messages[]` array shape | May differ from `artifact.transcript` string |

### assistant-request — confirm

| Check | Why |
|-------|-----|
| `message.type` value | Dispatcher switch |
| Dialed number field path | Phone → tenant resolver |

---

## Step 7 — Reconcile, then stop

1. Fix fixture + handler for each discrepancy
2. Re-run call until captures match fixtures
3. Run `npm test -- tests/vapi-contract.test.js`
4. Delete `capture.js` instrumentation
5. **Call #2:** repeat with `check_availability` (measure calendar latency, configure filler phrase)

---

## Call #2 — Calendar latency (after call #1 passes)

Set `VAPI_SPIKE_MODE=false` (full assistant) or add calendar to spike config.

Measure Google Calendar round-trip during live call. Configure Vapi tool messages:

- Request start: *"Let me check the schedule for you…"*
- Target: < 3s dead air

---

## Environment checklist

```env
# Required for spike
VAPI_WEBHOOK_SECRET=
VAPI_SPIKE_MODE=true
PUBLIC_URL=https://....ngrok-free.app

# Optional for spike (Vapi dashboard config)
# VAPI_API_KEY=

# Do NOT set yet (reduces failure modes)
# G_CLIENT_EMAIL=
# DEEPGRAM_API_KEY=
```

---

## What code already prepared

| Item | File |
|------|------|
| Raw capture to disk | `server/platform/vapi/capture.js` |
| Webhook auth (secret + HMAC scaffold) | `server/platform/vapi/webhook-auth.js` |
| Tool-call normalization | `server/platform/vapi/normalize-tool-calls.js` |
| HTTP 200 on tool errors | `server/routes/vapi.js` |
| Spike assistant mode | `server/platform/vapi/assistant-builder.js` |
| Deterministic emergency scan (phone) | `server/platform/safety/transcript-scanner.js` |
| Production seed guard | `server/platform/tenants/tenant-service.js` |
| Discrepancy log template | `docs/SPIKE-DISCREPANCY-LOG.md` |

---

## Stop line

**Stop here until Step 5 call is placed and Step 6 diff is complete.**  
Do not start Phase 2 dashboard work until success criterion table is fully checked.
