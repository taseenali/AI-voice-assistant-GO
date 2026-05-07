# T04 — SYNC CHECK
## Template: Functional + Security Contract Validation

> **AGENT INSTRUCTIONS**: Validate every contract in SYNC-MAP.md by reading actual source files. A contract PASSES only if both sides are consistent. Do not fix here — flag for T05.

---

## FUNCTIONAL CONTRACT VALIDATIONS

### SYNC-01 — Config Shape Contract
Fields accessed by modules but NOT in fallback: [LIST or "NONE"]
Fields in fallback never accessed: [LIST or "NONE"]
**Result**: [PASS / FAIL]

### SYNC-02 — State Machine Contract
List every STATES.X reference in response-orchestrator.js:
```
[FILL — actual state references with line numbers]
```
Every state confirmed in STATES enum: [YES/NO]
**Result**: [PASS / FAIL]

### SYNC-03 — Lead/Webhook Payload Contract
Shape at dispatch call (lead-capture.js line ___):
```javascript
[FILL from actual code]
```
Shape stored in outbox (outbox-db.js):
```javascript
[FILL from actual code]
```
Shape sent via HTTP (_attemptDelivery):
```javascript
[FILL from actual code]
```
BUG-01 fallback confirmed at line: [LINE NUMBER]
**Result**: [PASS / FAIL]

### SYNC-04 — Config Validation Contract
Fields in REQUIRED_FIELDS without fallback: [LIST or "NONE"]
webhook_secret in REQUIRED_FIELDS: [YES/NO — should be YES]
**Result**: [PASS / FAIL]

### SYNC-05 — Outbox Status Contract
Hardcoded status strings found: [LIST or "NONE"]
**Result**: [PASS / FAIL]

### SYNC-06 — Boot Order Contract
Actual boot sequence in app.js:
```
1. [FILL]
2. [FILL]
3. [FILL]
4. [FILL]
```
Deviations: [LIST or "NONE"]
**Result**: [PASS / FAIL]

---

## SECURITY CONTRACT VALIDATIONS

> **FULL-FLOW RULE**: Validate all security tasks across their entire flow (e.g., HMAC request → verification → rejection).

### SSYNC-01 — Webhook Authentication
Check webhook-dispatcher.js _attemptDelivery() — is X-Webhook-Secret header present?
```javascript
[FILL — actual headers object from code]
```
**Result**: [PASS / FAIL — expected FAIL until Pass 2]
**Mitigation plan documented**: [YES/NO — must be YES before T07]

### SSYNC-02 — EU AI Act Greeting Compliance
Check every greeting string in default.json and abc-roofing.json:
```
default.json greetings:
  [QUOTE ACTUAL STRINGS]
  Compliant: [YES/NO]

abc-roofing.json greetings:
  [QUOTE ACTUAL STRINGS]
  Compliant: [YES/NO]
```
**Result**: [PASS / FAIL — must PASS after T05 fixes SEC-05]

### SSYNC-03 — Config Sensitive Field Protection
webhook_url present in plaintext in publicly accessible config files: [YES/NO]
webhook_secret field exists in config files: [YES/NO]
Architectural decision documented: [YES/NO — must be YES before T07]
**Result**: [PASS / FAIL — expected FAIL until decision documented]

---

## SYNC CHECK SUMMARY

| Contract | Result      | Action Required            |
|----------|-------------|----------------------------|
| SYNC-01  | [PASS/FAIL] | [action or "none"]         |
| SYNC-02  | [PASS/FAIL] | [action or "none"]         |
| SYNC-03  | [PASS/FAIL] | [action or "none"]         |
| SYNC-04  | [PASS/FAIL] | [action or "none"]         |
| SYNC-05  | [PASS/FAIL] | [action or "none"]         |
| SYNC-06  | [PASS/FAIL] | [action or "none"]         |
| SSYNC-01 | [PASS/FAIL] | [action or "none"]         |
| SSYNC-02 | [PASS/FAIL] | [action or "none"]         |
| SSYNC-03 | [PASS/FAIL] | [action or "none"]         |

**Functional contracts passing**: [X] / 6
**Security contracts passing**: [X] / 3
**T05 must fix**: [LIST all FAIL contracts within allowed files]

---

## T04 COMPLETION SIGN-OFF

```
T04_COMPLETED                   = [YES/NO]
T04_DATE                        = [DATE]
T04_FUNCTIONAL_CONTRACTS        = [X] / 6
T04_SECURITY_CONTRACTS          = [X] / 3
T04_BLOCKING_T05                = [YES/NO]
ADVANCE_TO_T05                  = [YES/NO]
```
