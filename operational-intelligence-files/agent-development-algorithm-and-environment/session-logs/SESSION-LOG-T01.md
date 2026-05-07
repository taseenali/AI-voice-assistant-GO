# T01 — PROJECT SCAN
## Template: Full Current State Assessment

---

## PRE-SCAN CHECKLIST
- [x] ENVIRONMENT.md read completely
- [x] SECURITY-AUDIT.md read completely
- [x] ACTIVE_LOOP_PASS noted: 1
- [x] Last session log reviewed
- [x] GOAL-STACK.md reviewed

---

## SECTION 1 — FILE INVENTORY

Confirm every source file exists and record line count:

```
js/app.js                              — EXISTS — LINES: 535
js/state-machine.js                    — EXISTS — LINES: 322
js/speech-io.js                        — EXISTS — LINES: 290
js/response-orchestrator.js            — EXISTS — LINES: 969
js/config/loader.js                    — EXISTS — LINES: 184
js/config/validator.js                 — EXISTS — LINES: 59
js/services/webhook-dispatcher.js      — EXISTS — LINES: 214
js/services/outbox-db.js               — EXISTS — LINES: 169
js/modules/intent-detector.js          — EXISTS — LINES: 214
js/modules/lead-capture.js             — EXISTS — LINES: 179
js/modules/closing-engine.js           — EXISTS — LINES: 119
js/modules/discovery-engine.js         — EXISTS — LINES: 170
js/modules/fallback-recovery.js        — EXISTS — LINES: 131
js/modules/objection-handler.js        — EXISTS — LINES: 108
js/modules/personality.js              — EXISTS — LINES: 263
js/modules/response-builder.js         — EXISTS — LINES: 143
js/modules/memory-synthesis.js         — EXISTS — LINES: 164
js/modules/service-mapper.js           — EXISTS — LINES: 103
js/modules/conversation-flows.js       — EXISTS — LINES: 107
js/nlp/nlp-core.js                     — EXISTS — LINES: 64
js/nlp/nlp-intent.js                   — EXISTS — LINES: 120
js/nlp/nlp-extractor.js                — EXISTS — LINES: 70
js/nlp/nlp-confidence.js               — EXISTS — LINES: 49
js/nlp/nlp-temporal.js                 — EXISTS — LINES: 119
js/router/conversation-router.js       — EXISTS — LINES: 207
js/router/router-handlers.js           — EXISTS — LINES: 134
js/knowledge/knowledge-engine.js       — EXISTS — LINES: 71
configs/default.json                   — EXISTS — SIZE: 18852 bytes
configs/abc-roofing.json               — EXISTS — SIZE: 12172 bytes
index.html                             — EXISTS
```

---

## SECTION 2 — OPEN ISSUES REVIEW

| Issue ID | Status          | Notes                          |
|----------|-----------------|--------------------------------|
| BUG-01   | OPEN            | Fallback URL path still present in _attemptDelivery |
| BUG-02   | OPEN            | tenure field in reset() not in constructor |
| BUG-03   | OPEN            | Build is stale |
| SEC-01   | OPEN            | No auth token on webhook POST |
| SEC-02   | OPEN            | Config files publicly fetchable |
| SEC-03   | OPEN            | No input sanitization on raw user speech/text |
| SEC-04   | OPEN            | Web Speech API sends voice to Google/Azure cloud |
| SEC-05   | OPEN            | EU AI Act Article 50 — greetings do not disclose AI identity |
| SEC-06   | OPEN            | BUG-01 tenant isolation failure = security issue |
| SEC-07   | OPEN            | localStorage key is predictable company_name |
| SEC-08   | OPEN            | Potential XSS — innerHTML usage unverified |

New issues discovered: none

---

## SECTION 3 — GOAL PROGRESS

| Goal ID | Progress | Blocker        |
|---------|----------|----------------|
| G-001   | 0%       | none |
| G-002   | 0%       | none |
| G-003   | 0%       | none |
| G-007   | 0%       | none |
| G-008   | 0%       | none |

---

## SECTION 4 — ARCHITECTURE INTEGRITY

1. Boot sequence in app.js still config-first? YES (loadConfig() -> AppContext.setConfig() -> DOMContentLoaded listener -> UI setup)
2. AppContext.waitForConfig() exists and functions correctly? YES
3. All STATES in state-machine.js referenced correctly in orchestrator? YES (States: IDLE, GREETING, DISCOVERY, INTENT_DETECTED, FLOW_GENERAL, LEAD_CAPTURE, CLOSING, OBJECTION, FALLBACK, ENDED)
4. Outbox DB schema consistent with what dispatcher writes? YES
5. lead-capture.js calls webhookDispatcher.dispatch() correctly? YES
6. dist/ current with source? NO (dist modified April 22 vs source April 27)
7. EU AI Act — do any greeting strings disclose AI identity? NO (only abc-roofing's first greeting does, the rest do not)
8. Webhook auth header present in dispatcher HTTP calls? NO

---

## SECTION 5 — SCAN SUMMARY

**Overall project health**: AMBER
**Reason**: Functional foundation is strong, but 3 active functional bugs and 8 open security issues exist. Critical data isolation (BUG-01) and EU AI Act (SEC-05) remain unmitigated.
**Recommended focus for this pass**: Resolve BUG-01, BUG-02, BUG-03 and SEC-05 as per P0 active goals.
**Blocking T05**: none

---

## T01 COMPLETION SIGN-OFF

```
T01_COMPLETED     = YES
T01_DATE          = 2026-04-28
T01_AGENT         = Antigravity (Gemini)
T01_HEALTH        = AMBER
ADVANCE_TO_T02    = YES
```
