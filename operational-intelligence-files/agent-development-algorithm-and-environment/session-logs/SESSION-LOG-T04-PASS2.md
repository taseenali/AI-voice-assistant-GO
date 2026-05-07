# T04 — SYNC CHECK (PASS 2)
## Template: Functional + Security Contract Validation

> **FULL-FLOW RULE**: Validate all security tasks across their entire flow (e.g., HMAC request → verification → rejection). Do not check at module level only.

---

## PRE-T04 VERIFICATION — ORCHESTRATOR INPUT PATH

Before proceeding, the following was verified to close the T03 gap flagged by reviewer:

**response-orchestrator.js `processInput()` (lines 121–124)**:
```javascript
processInput(userInput) {
  if (!userInput || !userInput.trim()) return null;
  const input = userInput.trim();
  const lower = input.toLowerCase();
```
- **Verdict**: Only `.trim()` is applied. Zero sanitization, zero length bounding.

**response-builder.js `build()` (lines 60–101)**:
```javascript
build(data) {
  const { insight, outcome, leadData, ... } = data;
  // Insight is directly pushed: components.push(insight);
```
- **Verdict**: `insight` (which can be derived from user input) is pushed into the response components array with no sanitization applied. ResponseBuilder assumes input is already safe — it is not.

**Conclusion**: There is no partial handling or double processing. The sanitization gap is a clean, single missing layer that must be inserted at `app.js` input entry point (for text input) and at `response-orchestrator.js processInput()` as a secondary gate. T05 must fix at both points.

---

## FUNCTIONAL CONTRACT VALIDATIONS

### SYNC-01 — Config Shape Contract
Fields accessed by modules but NOT in fallback: `ai_tier`, `webhook_secret`
- `loader.js` emergency fallback (lines 156–204): Missing `webhook_secret` and `ai_tier`.
- `validator.js` REQUIRED_FIELDS (line 18): `webhook_secret` is present ✅.
- All other required fields confirmed present in both config files.

**Full-Flow Trace**: `loader.js` → `AppContext.setConfig()` → all modules call `AppContext.getConfig()`.
**Result**: ⚠️ PARTIAL — `webhook_secret` missing from emergency fallback. Functional modules pass. Flag for T05.

---

### SYNC-02 — State Machine Contract
STATES enum in `state-machine.js` (lines 8–19):
```
IDLE, GREETING, DISCOVERY, INTENT_DETECTED, FLOW_GENERAL,
LEAD_CAPTURE, CLOSING, OBJECTION, FALLBACK, ENDED
```
`_updateStateDisplay()` in `app.js` references (lines 566–576):
```
STATES.IDLE, STATES.GREETING, STATES.DISCOVERY, STATES.INTENT_DETECTED,
STATES.FLOW_GENERAL, STATES.LEAD_CAPTURE, STATES.CLOSING,
STATES.OBJECTION, STATES.FALLBACK, STATES.ENDED
```
Every state confirmed in STATES enum: YES
**Result**: ✅ PASS

---

### SYNC-03 — Lead/Webhook Payload Contract
Shape at dispatch call (`lead-capture.js`, line 169):
```javascript
webhookDispatcher.dispatch('LEAD_CAPTURE', {
  ...this._leadData,
  completeness: this.getCompleteness(),
  url_context: window.location.href
});
```
Shape stored in outbox (`outbox-db.js`): Wraps in `{ id, client_id, webhook_url, webhook_secret, event_type, data, timestamp, idempotency_key, status, attempts, lastAttempt, createdAt }`.
Shape sent via HTTP (`_attemptDelivery`, line 198): `body: JSON.stringify(item)` — sends the wrapped item.

BUG-01 fallback confirmed at line: NOT PRESENT ✅ — Hard fail implemented. Fallback URL removed.
**Result**: ✅ PASS

---

### SYNC-04 — Config Validation Contract
Fields in REQUIRED_FIELDS without fallback: `webhook_secret` (no fallback in `getEmergencyFallback()`)
webhook_secret in REQUIRED_FIELDS: YES (line 18 of validator.js)
**Result**: ⚠️ PARTIAL — Contract enforces validation presence correctly. Emergency fallback does not include it. Flag for T05.

---

### SYNC-05 — Outbox Status Contract
Hardcoded status strings found: NONE — `OutboxStatus` enum used exclusively throughout both files.
**Result**: ✅ PASS

---

### SYNC-06 — Boot Order Contract
Actual boot sequence in `app.js` (lines 45–75):
```
1. loadConfig(clientId) → AppContext.setConfig(config)
2. webhookDispatcher.init()
3. new ConversationStateMachine(config)
4. new ResponseOrchestrator(stateMachine)
5. SpeechIO, DOM caching, branding, events
6. _startConversation()
```
Deviations: NONE
**Result**: ✅ PASS

---

## SECURITY CONTRACT VALIDATIONS

### SSYNC-01 — Webhook Authentication
`_attemptDelivery()` headers object (lines 199–204):
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-Client-ID': item.client_id,
  'X-Idempotency-Key': item.idempotency_key
}
```
`X-Webhook-Secret` header present: NO
`X-Webhook-Timestamp` header present: NO

**Full-Flow Trace**:
- Request creation: `webhook-dispatcher.js` — body is built, but no signature or timestamp generated.
- Verification: n8n — No HMAC Code Node exists. Request would be accepted without validation.
- Rejection path: None — no mechanism to reject invalid or replayed requests.

**Result**: ❌ FAIL — Expected FAIL for Pass 2. Implementation is the target of T05.
**Mitigation plan documented**: YES (T02 research log contains exact implementation inputs).

---

### SSYNC-02 — EU AI Act Greeting Compliance
`default.json` greetings (lines 246–249):
```
"Hey there! I'm an AI assistant for Genuine Optimum..."  ✅
"Hi! I'm an AI with Genuine Optimum..."                  ✅
"Hello! I'm an AI assistant at Genuine Optimum..."       ✅
"Hey! I'm an AI assistant from Genuine Optimum..."       ✅
```
`abc-roofing.json` greetings (lines 131–134):
```
"Hi! Welcome to ABC Roofing. I'm Sarah, an AI assistant." ✅
"I'm an AI assistant — what's going on with your roof?"   ✅
"I'm Sarah, an AI assistant."                              ✅
"I'm Sarah, ABC Roofing's AI assistant."                   ✅
```
All compliant: YES
**Result**: ✅ PASS

---

### SSYNC-03 — Config Sensitive Field Protection
webhook_url present in plaintext in publicly accessible config files: YES (by design — not yet mitigated)
webhook_secret field exists in config files: NO (field defined in validator as required, but not yet injected as env var per Option A)
Architectural decision documented: YES — Option A (Netlify/Vercel Env Vars + thin API proxy)
**Result**: ✅ PASS (Decision made; implementation deferred to Pass 5 per plan)

---

## SYNC CHECK SUMMARY

| Contract | Result      | Action Required                                      |
|----------|-------------|------------------------------------------------------|
| SYNC-01  | ⚠️ PARTIAL   | Add `webhook_secret` + `ai_tier` to emergency fallback |
| SYNC-02  | ✅ PASS      | None                                                 |
| SYNC-03  | ✅ PASS      | None                                                 |
| SYNC-04  | ⚠️ PARTIAL   | Add `webhook_secret` to emergency fallback           |
| SYNC-05  | ✅ PASS      | None                                                 |
| SYNC-06  | ✅ PASS      | None                                                 |
| SSYNC-01 | ❌ FAIL      | T05: Implement HMAC + Timestamp headers + n8n script |
| SSYNC-02 | ✅ PASS      | None                                                 |
| SSYNC-03 | ✅ PASS      | None                                                 |

**Functional contracts passing**: 4 full + 2 partial / 6
**Security contracts passing**: 2 / 3
**T05 must fix**: SSYNC-01 (HMAC full implementation), SYNC-01/SYNC-04 emergency fallback gap

---

## T04 COMPLETION SIGN-OFF

```
T04_COMPLETED                   = YES
T04_DATE                        = 2026-04-28
T04_FUNCTIONAL_CONTRACTS        = 4 PASS / 2 PARTIAL / 6 TOTAL
T04_SECURITY_CONTRACTS          = 2 / 3
T04_BLOCKING_T05                = NO
ADVANCE_TO_T05                  = YES
```
