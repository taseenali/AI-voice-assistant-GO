# AGENT DEVELOPMENT ENVIRONMENT
## Master Environment File — Source of Truth

> **RULE FOR ALL AGENTS**: Before executing any prompt in this environment, read this file completely. All variables defined here override any assumptions made from training data. This file is always current. Your training data is not.

---

## ENVIRONMENT IDENTITY

```
ENV_NAME          = "AI Voice Agent — Development Environment"
ENV_VERSION       = "2.0.0"
ENV_OWNER         = "[YOUR NAME / COMPANY]"  ← fill this with your actual name/company
ENV_CREATED       = "2026-04-28"
ENV_LAST_UPDATED  = "2026-05-02"
ACTIVE_LOOP_PASS  = 8
ACTIVE_TEMPLATE   = "T07"
```

---

## PROJECT IDENTITY

```
PROJECT_NAME        = "MedVoice AI"
PROJECT_CODENAME    = "ai-voice-assistent"
PROJECT_TYPE        = "Multi-tenant AI Medical Receptionist platform"
PROJECT_STAGE       = "BUILD"
PROJECT_STAGE_REALITY = "PROTOTYPE — Web widget functional, phone not connected, calendar unverified, no production deployment"
PROJECT_REPO        = "[YOUR REPO PATH OR URL]"
PRIMARY_LANGUAGE    = "JavaScript (Vanilla, ES Modules)"
BUILD_TOOL          = "Vite"
DEPLOYMENT_TARGET   = "Node.js backend (Railway/Render) + Static frontend (Netlify/Vercel) — NOT YET DEPLOYED"
```

---

## PRODUCT TIERS

```
TIER_1_NAME         = "Rule-Based Agent"
TIER_1_PRICE_RANGE  = "$29–$59/month per client"
TIER_1_AI_BACKEND   = "None — pure rule-based NLP + template responses"
TIER_1_STATUS       = "FUNCTIONAL — Rule-based engine active, web widget working, localhost only"

TIER_2_NAME         = "LLM-Powered Agent"
TIER_2_PRICE_RANGE  = "$99–$199/month per client"
TIER_2_AI_BACKEND   = "External API (Claude / GPT-4o) or local model (Phi-3 / Llama via WebLLM)"
TIER_2_STATUS       = "FUNCTIONAL — Ollama & Local Model (Pass 4)"
```

---

## TARGET MARKET SEGMENTS

```
SEGMENT_PRIMARY     = "Medical practices, dental clinics, allied health providers"
SEGMENT_SECONDARY   = "Specialists, physiotherapists, mental health providers"
SEGMENT_EDGE        = "HIPAA-constrained businesses (rule-based only, data stays local)"
SEGMENT_EXCLUDED    = "Enterprise (Fortune 500) — out of scope for current phase"
COMPETITIVE_GAP     = "Most SMB solutions cost $150–$900/month. Tier 1 at $29–$59 is blue ocean."
```

---

## ARCHITECTURE CONSTANTS

```
STATE_MACHINE_STATES = [IDLE, GREETING, DISCOVERY, INTENT_DETECTED,
                         FLOW_GENERAL, FLOW_SERVICE_*, LEAD_CAPTURE,
                         BOOKING_CONFIRMATION, CLOSING, OBJECTION, FALLBACK, ENDED]

PIPELINE_STEPS       = [detect_intent, update_context, evaluate_state,
                         choose_goal, select_action, generate_response]

LEAD_FIELDS          = [name, patient_type, dob, reason_for_visit,
                         insurance_provider, insurance_id, urgency, contactMethod]

LEAD_REQUIRED        = [name, reason_for_visit]

WEBHOOK_PATTERN      = "Transactional Outbox — IndexedDB → Web Locks → FIFO → HMAC-signed HTTP POST"

CONFIG_SYSTEM        = "Multi-tenant — Node.js /api/config?client= endpoint — secrets injected from env vars"

CALENDAR_SYSTEM      = "Google Calendar API — Service Account JWT — freebusy.query before events.insert"

PHONE_SYSTEM         = "Twilio ConversationRelay — SCAFFOLDED — not live"
```

---

## KNOWN ISSUES REGISTER

> Agents must address these unless marked RESOLVED. SEC-XX issues with HIGH severity block T06.

| ID     | File                          | Issue                                                                                    | Severity | Status  |
|--------|-------------------------------|------------------------------------------------------------------------------------------|----------|---------|
| BUG-01 | webhook-dispatcher.js         | Fallback URL path still present — tenant isolation leak                                  | HIGH     | RESOLVED |
| BUG-02 | lead-capture.js               | `tenure` field in reset() not in constructor                                             | MEDIUM   | RESOLVED |
| BUG-03 | dist/                         | Build is stale — does not reflect latest source                                          | MEDIUM   | RESOLVED |
| GAP-01 | response-orchestrator.js      | RESOLVED - LLM adapter integrated                                        | ARCH     | RESOLVED |
| GAP-02 | [none yet]                    | No analytics dashboard for client-facing reporting                                       | LOW      | PLANNED |
| GAP-03 | [none yet]                    | No admin UI for config editing                                                           | LOW      | PLANNED |
| GAP-04 | js/services/llm-adapter.js       | RESOLVED - LLM Adapter built with Ollama                                                | ARCH     | RESOLVED|
| GAP-05     | js/modules/emergency-detector.js  | RESOLVED - Emergency Detector built                                                | HIGH     | RESOLVED|
| GAP-06 | js/services/llm-adapter.js | isEnabled reads config at import time — misses ai_tier:2 set after boot | HIGH | RESOLVED |
| GAP-07 | Multiple files | SMB business consultant language present throughout — requires medical vertical sweep | MEDIUM | RESOLVED |
| GAP-08 | Pre-production gate | HIPAA BAA required with all vendors before first medical client — Anthropic, n8n host, cloud provider | HIGH | OPEN |
| GAP-ORCH-01 | js/response-orchestrator.js | RESOLVED — _triggerWebhook() removed, all 4 call sites routed through dispatcher | HIGH     | RESOLVED|
| SEC-01 | webhook-dispatcher.js         | No HMAC/token authentication on webhook POST — unauthenticated endpoint                  | HIGH     | RESOLVED |
| SEC-02 | configs/*.json                | Config files publicly fetchable — expose webhook URLs and business logic                 | MEDIUM   | RESOLVED |
| SEC-03 | nlp/nlp-extractor.js          | No input sanitization on user speech/text before NLP processing                         | MEDIUM   | RESOLVED |
| SEC-04 | speech-io.js                  | Web Speech API routes voice through Google/Azure cloud — breaks local-first privacy      | HIGH     | RESOLVED |
| SEC-05 | configs/*.json (greetings)    | EU AI Act Article 50 — greeting strings do not disclose AI identity explicitly           | HIGH     | RESOLVED|
| SEC-06 | webhook-dispatcher.js         | Tenant isolation failure (= BUG-01) — wrong tenant webhook receives lead data            | HIGH     | RESOLVED|
| SEC-07 | lead-capture.js               | localStorage key uses predictable company_name — accessible to other scripts             | LOW      | RESOLVED |
| SEC-08 | response-builder.js           | Potential XSS — verify innerHTML not used for config-sourced strings                     | MEDIUM   | RESOLVED|
| SEC-09 | configs/default.json + configs/abc-roofing.json | webhook_secret set to placeholder "test_secret_123" — must be replaced with real secret before any production deployment | HIGH | RESOLVED |
| GAP-09 | js/state-machine.js:14 | BOOKING_CONFIRMATION state missing — insert after LEAD_CAPTURE | MEDIUM | RESOLVED (Pass 7) |
| GAP-10 | configs/medical-clinic.json | calendar_id field missing — required for Google Calendar API | HIGH | RESOLVED (Pass 7) |
| SEC-10 | package.json devDependencies | 18 vulnerabilities in dev-only packages (vite, vitest, webdriverio) — dev environment only, no production exposure | LOW | OPEN — fix when upgrading Vite to v8 |
| BLOCKER-01 | server/routes/calendar.js | Target calendar ID unconfirmed — service account may not have write permission to Medical AI Receptionist calendar | HIGH | OPEN |
| GAP-ORCH-02 | js/response-orchestrator.js | Hardcoded "Tuesday at 2:00 PM" placeholder — agent not extracting real date/time from conversation | HIGH | OPEN |
| P0-1 | js/app.js, index.html | Chrome TTS autoplay blocks greeting — no user-gesture gate | HIGH | RESOLVED (Pass 8 T05) |
| P0-2 | js/router/router-handlers.js | service_summary always "medical care" — s.name vs s.display_name | MEDIUM | RESOLVED (Pass 8 T05) |
| P0-4 | js/services/llm-adapter.js, server/ | Browser called Ollama directly — ollama_endpoint exposed in public config | HIGH | RESOLVED (Pass 8 T05) |
| P0-5 | js/app.js, js/speech-io.js | onToken streaming never wired — LLM TTS always waited for full response | MEDIUM | RESOLVED (Pass 8 T05) |
| P0-6 | server/, js/services/ | No conversation audit logging — zero HIPAA trail | HIGH | RESOLVED (Pass 8 T05) |
| SEC-11 | server/routes/log.js, js/services/conversation-logger.js | Conversation log text may contain PHI (name, DOB, insurance) — stdout is not a HIPAA-compliant sink | HIGH | OPEN — must replace stdout with encrypted, access-controlled log store before first medical client |

---

## SYNCHRONIZATION CONTRACTS

### Functional Contracts

| Contract ID | Module A              | Module B                  | What Must Stay Synced                     |
|-------------|----------------------|---------------------------|-------------------------------------------|
| SYNC-01     | config/loader.js      | All modules               | AppContext.getConfig() shape              |
| SYNC-02     | state-machine.js      | response-orchestrator.js  | STATES enum + valid transitions           |
| SYNC-03     | lead-capture.js       | outbox-db.js              | Lead data schema = webhook payload schema |
| SYNC-04     | config JSON files     | validator.js              | Required fields list                      |
| SYNC-05     | webhook-dispatcher.js | outbox-db.js              | OutboxStatus enum values                  |
| SYNC-06     | app.js boot sequence  | AppContext._readyPromise   | Boot order: config → dispatcher → engines |

### Security Contracts

| Contract ID | Parties                                           | What Must Stay Synced                                      | Status                  |
|-------------|---------------------------------------------------|------------------------------------------------------------|-------------------------|
| SSYNC-01    | webhook-dispatcher.js ↔ n8n endpoint             | Every POST must include X-Webhook-Secret HMAC header       | IMPLEMENTED             |
| SSYNC-02    | configs/*.json greetings ↔ orchestrator delivery  | Every greeting must identify system as AI (EU AI Act)      | VERIFIED                |
| SSYNC-03    | configs/*.json ↔ hosting configuration            | Sensitive fields (webhook_url, webhook_secret) not public  | IMPLEMENTED (Node.js backend live, Option A deployed) |

---

## PRODUCT REALITY CHECK

> Updated at every T07. Honest assessment of what the product can actually do.

```
PRODUCT_CAPABILITY_MATRIX   = "See PRODUCT-CAPABILITY-MATRIX.md"
OVERALL_COMPLETION          = "~28% toward production medical receptionist"
LAST_E2E_VERIFICATION       = "Emergency detection (Pass 6) — only verified capability"
PHONE_LIVE                  = NO
CALENDAR_LIVE               = NO — code scaffolded, never called with real credentials
PRODUCTION_DEPLOYED         = NO
FIRST_REAL_CLIENT           = NOT YET — blocked by: GAP-08 HIPAA BAA, unverified calendar/phone
```

---

## ENVIRONMENT RULES FOR ALL AGENTS

1. **Never invent file names.** Only reference files that exist in the project.
2. **Never assume module behavior.** Read the actual file before describing it.
3. **All responses must map to a module.** Abstract suggestions without file-level anchoring are rejected.
4. **Known issues must be addressed.** If your output touches a file with an open BUG or SEC, address it.
5. **Sync contracts are non-negotiable.** Any change breaking a SYNC-* or SSYNC-* contract must fix both sides.
6. **End every template with its STATUS UPDATE / SIGN-OFF block** filled completely.
7. **Loop pass number must increment** at the end of T07 and be written back to ACTIVE_LOOP_PASS.
8. **Security is not optional.** Every T03 must run SECURITY-AUDIT.md checklist. HIGH severity SEC-XX findings block T06.
9. **Read SECURITY-AUDIT.md at every session start** alongside ENVIRONMENT.md.
10. **The Onboarding Gate.** AGENT-ONBOARDING.md must be read at the start of every session (as per ALGORITHM.md Rule 10). Once read, it is not required for the remainder of the session (T01-T07).
11. **EU AI Act compliance is P0.** Any greeting string that does not disclose AI identity is a blocker.
12. **Product Capability Matrix is truth.** Never claim a capability is COMPLETE unless PRODUCT-CAPABILITY-MATRIX.md shows it as VERIFIED. SCAFFOLDED code is not a working feature.
13. **Agent failures must be logged.** Any provably wrong output caught this session must be added to AGENT-FAILURE-LOG.md before T07 closes.
14. **Definition of Done must be written at T01.** P0 and P1 goals need testable DoD criteria before T05 begins.
15. **E2E Verification is required.** For any user-facing feature built in T05, T06E must be run before the goal is marked COMPLETED.
