# T06-END — END-TO-END VERIFICATION
## Supplementary Template — Runs After Standard T06 Quality Gate

> **When to run this**: This template runs as part of T06 for any pass where T05 touched a user-facing flow. Specifically required when any of these were modified:
> - `js/response-orchestrator.js`
> - `js/modules/emergency-detector.js`
> - `server/routes/calendar.js`
> - `server/routes/voice.js`
> - `js/config/loader.js`
> - `js/app.js`
> - Any config file in `configs/`
>
> **Rule**: If this template is required and is not completed, T06 CANNOT be marked PASS. Mark as "GREEN-CODE / E2E-PENDING" instead.

---

## PRE-VERIFICATION CHECKLIST

```
[ ] Standard T06 quality gate passed first
[ ] npm run build succeeded
[ ] npm test -- --run shows 0 failures
[ ] Local server running: node server/index.js
[ ] Frontend running: npm run dev
[ ] Browser open at http://localhost:5173 (or configured port)
```

---

## SECTION 1 — CONVERSATION FLOW TESTS

Run these manually in the browser widget. For each test, state: INPUT → EXPECTED → ACTUAL → PASS/FAIL

### Test 1.1 — AI Disclosure (SSYNC-02)
```
INPUT:    Open the widget (no message sent)
EXPECTED: Greeting message contains "AI" explicitly
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
EVIDENCE: [Quote first 20 chars of greeting]
```

### Test 1.2 — Emergency Intercept (SK-009)
```
INPUT:    "I am having chest pain"
EXPECTED: Emergency response containing "911" — NO booking language
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
EVIDENCE: [Quote response]
```

### Test 1.3 — Emergency Does Not Book (SK-009)
```
INPUT:    "I am having chest pain" followed by "yes book me in"
EXPECTED: System does not proceed to booking flow after emergency detection
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
EVIDENCE: [Describe what happened]
```

### Test 1.4 — Normal Booking Intent
```
INPUT:    "I'd like to book an appointment"
EXPECTED: Agent asks for name (not business, not goal)
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
EVIDENCE: [Quote agent response]
```

### Test 1.5 — Medical Field Capture
```
INPUT:    "My name is Sarah, I'm a new patient"
EXPECTED: Agent captures name, asks for patient_type or reason_for_visit next
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
EVIDENCE: [Quote agent response + lead panel state if visible]
```

### Test 1.6 — LLM Activation (if ai_tier: 2)
```
INPUT:    "What should I do about my back pain?"
EXPECTED: Natural, contextual response — not a scripted template
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
EVIDENCE: [Quote response, note if it sounds LLM-generated vs template]
```

---

## SECTION 2 — BACKEND API TESTS

Run these with curl or a REST client against the running Node.js server.

### Test 2.1 — Config Endpoint Serves Correctly
```bash
curl http://localhost:3001/api/config?client=medical-clinic
```
```
EXPECTED: JSON response containing company_name, emergency_keywords array, NO webhook_secret in plaintext
ACTUAL:   [ ] webhook_secret absent from response
          [ ] emergency_keywords array present with 20+ terms
          [ ] company_name = "MedVoice Clinic" or configured value
RESULT:   [ ] PASS  [ ] FAIL
```

### Test 2.2 — Path Traversal Protection
```bash
curl "http://localhost:3001/api/config?client=../../../etc/passwd"
```
```
EXPECTED: 400 Bad Request — "Invalid client ID"
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
```

### Test 2.3 — Health Endpoint
```bash
curl http://localhost:3001/health
```
```
EXPECTED: 200 OK with status message
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
```

### Test 2.4 — Calendar Check (if calendar route built)
```bash
curl -X POST http://localhost:3001/api/calendar/check \
  -H "Content-Type: application/json" \
  -d '{"calendar_id":"test@group.calendar.google.com","start":"2026-05-01T09:00:00Z","end":"2026-05-01T09:30:00Z"}'
```
```
EXPECTED: 
  - If G_CLIENT_EMAIL env var set: freebusy response from Google
  - If not set: 503 "Calendar credentials not configured"
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
```

---

## SECTION 3 — REGRESSION CHECKS

### Test 3.1 — Webhook Delivery (SSYNC-01)
```
ACTION:   Complete a full patient intake conversation to the closing state
EXPECTED: Webhook POST fires to configured endpoint with HMAC signature headers
CHECK:    Browser DevTools → Network → look for POST to webhook_url
          Headers include X-Webhook-Signature and X-Webhook-Timestamp
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL  [ ] SKIP (no webhook_url configured)
```

### Test 3.2 — Config Loads From Backend
```
ACTION:   Open browser DevTools → Network → refresh page
EXPECTED: Request to /api/config?client= (not to /configs/*.json)
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
```

### Test 3.3 — Stale Build Check
```
ACTION:   Compare dist/ file dates against source file dates
EXPECTED: dist/ modified date >= most recently modified source file
ACTUAL:   [AGENT FILL IN]
RESULT:   [ ] PASS  [ ] FAIL
```

---

## SECTION 4 — RUNTIME VERIFICATION STATUS

For each goal built in T05 this pass, declare its runtime status:

| Goal ID | Description | Code Written | Runtime Tested | Status |
|---------|-------------|-------------|----------------|--------|
| G-[ID] | [description] | YES | YES/NO | COMPLETED / SCAFFOLDED |

---

## T06-END COMPLETION SIGN-OFF

```
T06E_COMPLETED              = YES / NO
T06E_DATE                   = [DATE]
T06E_CONVERSATION_TESTS     = [X/6 passing]
T06E_BACKEND_TESTS          = [X/4 passing]
T06E_REGRESSION_TESTS       = [X/3 passing]
T06E_OVERALL                = PASS / FAIL / GREEN-CODE-E2E-PENDING

GOALS_RUNTIME_VERIFIED      = [list goal IDs that passed runtime test]
GOALS_SCAFFOLDED_ONLY       = [list goal IDs built but not runtime tested]

ADVANCE_TO_T07              = YES (only if T06E_OVERALL = PASS)
```

> **If T06E_OVERALL = GREEN-CODE-E2E-PENDING**: The pass may advance to T07 but all unverified goals must be marked SCAFFOLDED in GOAL-STACK.md and PRODUCT-CAPABILITY-MATRIX.md. They are NOT COMPLETED until runtime verified in a future pass.
