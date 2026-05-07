# PROJECT VARIABLES
## Editable per project — update at start of every loop pass

---

## CURRENT LOOP STATE

```
ACTIVE_LOOP_PASS    = 8
ACTIVE_TEMPLATE     = T07
LAST_COMPLETED      = [Pass 8 T05 complete — P0 Enterprise Ship Blockers implemented]
SESSION_DATE        = 2026-05-02
AGENT_USED          = Claude Sonnet 4.6
```

---

## GOAL THIS PASS

```
PASS_PRIMARY_GOAL    = "P0 Enterprise Ship Blockers — redirected by owner from G-044"
PASS_SECONDARY_GOAL  = "P1 Major quality gaps (next pass)"
PASS_CONSTRAINT      = "P0-3 skipped per SK-014 (CLOSE must remain deterministic for medical safety)"
```

---

## BUILD CONSTRAINTS — T05 THIS PASS

```
FILES_ALLOWED_TO_MODIFY = [
  "js/admin/admin.js",
  "api/config.js",
  "configs/medical-clinic.json",
  "BLUEPRINT-CURRENT.md",
  "variables/PROJECT-VARS.md",
  "variables/GOAL-STACK.md",
  "ENVIRONMENT.md"
]

FILES_FORBIDDEN_TO_MODIFY = [
  "js/state-machine.js",                  // stable
  "dist/*"                                // never edit dist directly — rebuild only
]
```

---

## PROJECT METRICS

```
TOTAL_SOURCE_FILES          = 32
TOTAL_LINES_OF_CODE         = ~5,200
OPEN_BUGS                   = 0
OPEN_SEC_ISSUES             = 1 (SEC-10: package.json devDependencies)
OPEN_GAPS                   = 1 (GAP-08: HIPAA BAA)
SYNC_CONTRACTS_PASSING      = 6/6 functional + 3/3 security
BUILD_IS_CURRENT            = true
T01_HEALTH                  = GREEN
T02_COMPLETED               = YES
SECURITY_LAYER_INTEGRATED   = YES
```

---

## KEY FINDINGS FROM T02 (Carry into T03–T07)

```
FINDING_01 = "EU AI Act Article 50 — AI disclosure mandatory in all greetings → P0 fix in T05"
FINDING_02 = "Web Speech API routes voice through Google/Azure cloud → SEC-04, fix Pass 2"
FINDING_03 = "ONNX Runtime Web viable for browser-native intent classification → G-020, Pass 4"
FINDING_04 = "WebLLM + Phi-3-mini viable for Tier 2 local model → G-020, Pass 4"
FINDING_05 = "Competitive gap confirmed — Tier 1 at $29–59 is blue ocean vs $150–900 market"
FINDING_06 = "ServiceWorker Background Sync improves outbox reliability → G-015, Pass 3"
FINDING_07 = "iOS / non-Chromium throttles Web Speech API → G-016, Pass 2"
FINDING_08 = "Privacy by Architecture is valid HIPAA positioning — no BAA required"
```

---

## FEATURE FLAGS

```
FEATURE_LLM_TIER        = disabled
FEATURE_ANALYTICS       = disabled
FEATURE_ADMIN_UI        = disabled
FEATURE_LOCAL_MODEL     = enabled   // G-020 (Pass 4)
FEATURE_MULTI_LANGUAGE  = disabled
FEATURE_WEBHOOK_AUTH    = enabled   // SEC-01 implemented in T05 Pass 2
FEATURE_SW_SYNC         = enabled   // G-015 implemented in T05 Pass 3
```

---

## EXTERNAL DEPENDENCIES

```
WEBHOOK_TARGET          = "n8n (self-hosted or cloud)"
CALENDAR_INTEGRATION    = "URL-based only — no API"
CRM_INTEGRATION         = "Via webhook → n8n → CRM (indirect)"
SPEECH_API              = "Web Speech API (browser-native, Chromium-dependent)"
BUILD_DEPS              = "Vite, esbuild, rollup (dev only)"
RUNTIME_DEPS            = "None — zero runtime dependencies"
```
# DEFINITION OF DONE — PASS 8

## G-044: Calendar Booking End-to-End

**DONE WHEN:**
- [ ] 1. Full conversation reaches BOOKING_CONFIRMATION state
- [ ] 2. Agent confirms name, date, time with patient
- [ ] 3. Frontend calls /api/calendar/check — returns real freebusy data
- [ ] 4. Frontend calls /api/calendar/book — creates real calendar event
- [ ] 5. Agent returns verbal booking confirmation to patient
- [ ] 6. Event visible in Google Calendar
- [ ] 7. 16+ tests still passing

**RUNTIME VERIFIED**: YES required — calendar event URL as evidence
