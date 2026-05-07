# T06 — QUALITY GATE
## Template: Functional + Security Validation Before Loop Closure

> **AGENT INSTRUCTIONS**: Hard stop. Loop does NOT advance to T07 unless every mandatory check passes. Failed checks → return to T05 → fix → re-run T06.

---

```
GATE_ITERATION    = [1 — increment each T05→T06 cycle]
FILES_UNDER_TEST  = [LIST files modified in T05]
```

---

## MANDATORY FUNCTIONAL CHECKS

### M1 — Bug Resolution
| Bug ID | In allowed files? | Resolved? | Verification                  |
|--------|-------------------|-----------|-------------------------------|
| BUG-01 | [YES/NO]          | [YES/NO]  | [how confirmed]               |
| BUG-02 | [YES/NO]          | [YES/NO]  | [how confirmed]               |
| BUG-03 | [YES/NO]          | [YES/NO]  | [how confirmed]               |
**M1 Result**: [PASS / FAIL]

### M2 — Functional Sync Contracts
| Contract | Touches modified files? | Passes? |
|----------|------------------------|---------|
| SYNC-01  | [YES/NO]               | [PASS/FAIL] |
| SYNC-02  | [YES/NO]               | [PASS/FAIL] |
| SYNC-03  | [YES/NO]               | [PASS/FAIL] |
| SYNC-04  | [YES/NO]               | [PASS/FAIL] |
| SYNC-05  | [YES/NO]               | [PASS/FAIL] |
| SYNC-06  | [YES/NO]               | [PASS/FAIL] |
**M2 Result**: [PASS / FAIL]

### M3 — No New Bugs Introduced
- No hardcoded strings where enums exist: [PASS/FAIL]
- No async functions without error handling: [PASS/FAIL]
- No references to non-existent variables/functions: [PASS/FAIL]
- Boot sequence contract unbroken: [PASS/FAIL]
- No config access outside AppContext: [PASS/FAIL]
**M3 Result**: [PASS / FAIL]

### M4 — Forbidden Files Untouched
[List each forbidden file and confirm untouched]
**M4 Result**: [PASS / FAIL]

### M5 — Module Registry Updated
- Status of modified modules updated: [YES/NO]
- Security column updated for modified modules: [YES/NO]
**M5 Result**: [PASS / FAIL]

---

## MANDATORY SECURITY CHECKS

### S1 — SEC-05 Resolved (EU AI Act)
Every greeting string in every config file explicitly identifies system as AI:
- default.json: [COMPLIANT/NON-COMPLIANT — quote first greeting]
- abc-roofing.json: [COMPLIANT/NON-COMPLIANT — quote first greeting]
**S1 Result**: [PASS / FAIL] ← BLOCKS T07 if FAIL

### S2 — SEC-01 Mitigation Plan Documented
Written mitigation plan for webhook authentication exists in T05 output:
- Plan present: [YES/NO]
- Target pass specified: [YES/NO]
**S2 Result**: [PASS / FAIL] ← BLOCKS T07 if FAIL

### S3 — SSYNC-03 Decision Documented
Architectural decision for config protection exists in T05 output:
- Decision present: [YES/NO]
- Rationale present: [YES/NO]
**S3 Result**: [PASS / FAIL] ← BLOCKS T07 if FAIL

### S4 — No New HIGH Security Issues Without Mitigation Plan
New HIGH severity SEC-XX findings from T03 without documented mitigation plan: [COUNT]
**S4 Result**: [PASS if COUNT = 0 / FAIL]

### S5 — BUG-01/SEC-06 Fix Verified
Fallback URL path removed from webhook-dispatcher.js:
- Hard throw confirmed at line: [LINE NUMBER]
- No remaining AppContext.getConfig().webhook_url references in _attemptDelivery: [YES/NO]
**S5 Result**: [PASS / FAIL]

---

## MANDATORY FULL-FLOW SECURITY CHECKS

Validate all security tasks across their full flow, explicitly proving the failure paths exist:

- **HMAC Authentication**:
  - Valid request accepted: [YES/NO/NA]
  - Invalid signature rejected: [YES/NO/NA]
  - Missing header rejected: [YES/NO/NA]
- **Sanitization**:
  - Valid input processed: [YES/NO/NA]
  - Malicious input neutralized: [YES/NO/NA]
- **TCPA Compliance**:
  - Consent explicitly given → mic unlocks: [YES/NO/NA]
  - No consent → mic blocked: [YES/NO/NA]
- **Privacy Disclosure**:
  - Explicit voice disclosure present: [YES/NO/NA]
  - No voice → text fallback disclosure present: [YES/NO/NA]
- **localStorage Isolation**:
  - Valid write/read succeeds: [YES/NO/NA]
  - Cross-tenant read impossible (isolated key generation): [YES/NO/NA]

**Full-Flow Result**: [PASS / FAIL] ← BLOCKS T07 if FAIL

---

## GATE DECISION

```
M1 — Bug resolution:              [PASS/FAIL]
M2 — Functional sync contracts:   [PASS/FAIL]
M3 — No new bugs:                 [PASS/FAIL]
M4 — Forbidden untouched:         [PASS/FAIL]
M5 — Registry updated:            [PASS/FAIL]
S1 — EU AI Act greetings:         [PASS/FAIL]
S2 — SEC-01 plan documented:      [PASS/FAIL]
S3 — SSYNC-03 decision:           [PASS/FAIL]
S4 — No unplanned HIGH sec:       [PASS/FAIL]
S5 — BUG-01 fix verified:         [PASS/FAIL]
S6 — Full-Flow sec validated:     [PASS/FAIL]

ALL MANDATORY PASS:               [YES/NO]
```

**If NO**: Return to T05. Document what failed. Increment GATE_ITERATION.
**If YES**: Advance to T07.

---

## T06 COMPLETION SIGN-OFF

```
T06_COMPLETED         = [YES/NO — only YES when all checks PASS]
T06_DATE              = [DATE]
T06_GATE_ITERATIONS   = [NUMBER]
T06_FINAL_RESULT      = [PASS/FAIL]
ADVANCE_TO_T07        = [YES — only when PASS]
```
