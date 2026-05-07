# PRODUCT CAPABILITY MATRIX
## MedVoice AI — Real Medical Receptionist vs Current State

> **This file is reviewed and updated at every T07. It is the single source of truth for what the product can actually do — not what the code contains.**
>
> **Status definitions:**
> - `NOT_STARTED` — No code path exists for this capability
> - `SCAFFOLDED` — Code exists but has never been tested with real external services
> - `FUNCTIONAL` — Works end-to-end in a controlled test environment
> - `VERIFIED` — Confirmed working with real credentials, real data, real external services
> - `PRODUCTION` — Deployed, monitored, used by a real clinic

```
MATRIX_VERSION    = "1.1.0"
LAST_UPDATED      = "2026-05-02"
UPDATED_AT_PASS   = 8
OVERALL_STATUS    = "FUNCTIONAL — Web widget only. Phone not live. P0 enterprise ship blockers resolved."
PRODUCT_READY     = NO
BLOCKER           = "Phone integration unverified, Calendar unverified, no production deployment, SEC-11 PHI logging"
```

---

## CORE RECEPTIONIST CAPABILITIES

| # | Capability | Status | Pass Built | Evidence | Blocker to Next Status |
|---|---|---|---|---|---|
| 1 | Answer web chat contacts | FUNCTIONAL | 1 | Web widget live, conversation engine working | Deploy to production URL |
| 2 | Answer phone calls (inbound) | SCAFFOLDED | 7 | server/routes/voice.js exists, TwiML ConversationRelay pattern | Real Twilio number + WebSocket handler + Deepgram STT |
| 3 | Greet patients by name (returning) | NOT_STARTED | — | No patient lookup against existing records | Patient database |
| 4 | Understand reason for contact | FUNCTIONAL | 3 | LLM adapter + intent detection working | Verify with real speech transcription |
| 5 | Book appointments (calendar check) | FUNCTIONAL | 7 | freebusy.query code exists | Wire into conversation flow end-to-end |
| 6 | Book appointments (event creation) | FUNCTIONAL | 8 | events.insert verified with real credentials | Wire into BOOKING_CONFIRMATION state |
| 7 | Reschedule existing appointments | NOT_STARTED | — | No code path exists | Build in Pass 9+ |
| 8 | Cancel appointments | NOT_STARTED | — | No code path exists | Build in Pass 9+ |
| 9 | Verify patient identity (DOB check) | SCAFFOLDED | 3 | DOB captured in lead data | No verification against existing records |
| 10 | Collect insurance information | FUNCTIONAL | 3 | insurance_provider + insurance_id captured | Test with real intake flow |
| 11 | Handle medical emergencies | VERIFIED | 3 | Emergency detector tested with 9 test cases, all passing | — |
| 12 | Route urgent calls to clinical staff | NOT_STARTED | — | No escalation / call transfer logic | Twilio call transfer + on-call routing |
| 13 | Answer common clinic questions | FUNCTIONAL | 3 | Knowledge engine + LLM handles FAQs | Verify per-clinic knowledge base works |
| 14 | Handle after-hours contacts | NOT_STARTED | — | No time-of-day awareness in config | Add business_hours to config, after-hours flow |
| 15 | Send appointment confirmations | NOT_STARTED | — | No outbound capability | Twilio SMS or email integration |
| 16 | Send appointment reminders | NOT_STARTED | — | No scheduler / cron capability | Background job system |
| 17 | Take messages for callback | SCAFFOLDED | 1 | Webhook fires lead data to n8n | n8n automation not configured per clinic |
| 18 | Multi-language support | NOT_STARTED | — | English only | Pass 10+ |

---

## PLATFORM CAPABILITIES (Operational)

| # | Capability | Status | Pass Built | Evidence | Blocker |
|---|---|---|---|---|---|
| 19 | Multi-tenant architecture | FUNCTIONAL | 1 | Client ID URL param → per-clinic config | Deploy multiple clients |
| 20 | Secret protection (config) | VERIFIED | 5/6 | Node.js backend + env vars + 16 tests passing | Real .env in production |
| 21 | HMAC webhook authentication | VERIFIED | 2 | X-Webhook-Signature on all POSTs, tested | Real webhook endpoint |
| 22 | Offline webhook delivery | FUNCTIONAL | 3 | ServiceWorker + IndexedDB outbox | Test in offline conditions |
| 23 | Admin UI for clinic config | NOT_STARTED | — | No admin interface | Pass 9 target |
| 24 | Patient data dashboard | NOT_STARTED | — | No dashboard | Pass 10+ |
| 25 | Analytics / call reporting | NOT_STARTED | — | No analytics layer | Pass 10+ |
| 26 | HIPAA BAA with vendors | NOT_STARTED | — | GAP-08 open | Required before first paying client |
| 27 | HIPAA-compliant hosting | NOT_STARTED | — | Localhost only | AWS HIPAA or equivalent |
| 28 | Audit logging (HIPAA) | SCAFFOLDED | 8 | POST /api/log/conversation fires per turn; stdout only | Replace stdout with encrypted, access-controlled store (SEC-11) |
| 29 | Production deployment | NOT_STARTED | — | No deployed URL | Netlify/Vercel + Railway/Render |
| 30 | CI/CD pipeline | NOT_STARTED | — | Manual builds | GitHub Actions |
| 31 | Monitoring and alerting | NOT_STARTED | — | Nothing | Datadog / Sentry |
| 32 | Onboarding flow for new clinics | NOT_STARTED | — | Manual JSON config | Admin UI + self-serve setup |

---

## COMPLETION SUMMARY

```
CORE_RECEPTIONIST_FUNCTIONS   = 18
  PRODUCTION                  = 0
  VERIFIED                    = 1  (Emergency detection)
  FUNCTIONAL                  = 7  (Web chat, intent, insurance, FAQs, data capture, calendar check/book)
  SCAFFOLDED                  = 2  (Phone, identity)
  NOT_STARTED                 = 8  (Reschedule, cancel, after-hours, reminders, etc.)

PLATFORM_CAPABILITIES         = 14
  VERIFIED                    = 2  (Secret protection, HMAC auth)
  FUNCTIONAL                  = 3  (Multi-tenant, offline delivery, LLM proxy security)
  SCAFFOLDED                  = 1  (Audit logging — P0-6)
  NOT_STARTED                 = 8  (Admin UI, HIPAA hosting, CI/CD, monitoring, etc.)

OVERALL_COMPLETION            = ~33% toward a production medical receptionist
MINIMUM_FOR_FIRST_DEMO        = Items 1, 4, 5, 6, 10, 11, 13 all reaching VERIFIED
MINIMUM_FOR_FIRST_CLIENT      = All items above + #19, #20, #21, #26, #27, #28, #29
```

---

## NEXT MILESTONE

**Target: First Verified End-to-End Booking**
- Patient says "I'd like a Tuesday appointment" via web widget
- Agent collects name, DOB, reason for visit
- Agent calls `freebusy.query` against real Google Calendar
- Agent proposes available slot
- Agent calls `events.insert` to confirm booking
- Patient receives verbal confirmation
- n8n webhook fires with patient data

This milestone requires: real Google Calendar credentials in `.env`, Vitest E2E test or manual walk-through, T06 verification with screenshot/log evidence.

**Estimate: Pass 8**
