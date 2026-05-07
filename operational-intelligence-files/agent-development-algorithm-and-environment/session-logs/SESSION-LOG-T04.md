# T04 — SYNC CHECK
## Template: Functional + Security Contract Validation
## Executed: 2026-04-28 | Agent: Claude Sonnet

---

## FUNCTIONAL CONTRACT VALIDATIONS

---

### SYNC-01 — Config Shape Contract

**Contract**: `AppContext.getConfig()` must always return the full shape defined in SYNC-MAP.md.

**Fields accessed by modules but NOT in fallback** (`getEmergencyFallback()` in `loader.js` lines 156–199):
- `webhook_secret` — accessed by SYNC-MAP contract, missing from fallback (line 190 has `webhook_url: ''` but no `webhook_secret`)
- `ai_tier` — referenced in SYNC-MAP shape spec, missing from fallback

**Fields in fallback never accessed by any module**: NONE confirmed

**Evidence**:
- Fallback defined: `loader.js` lines 156–199 — `webhook_secret` ABSENT
- `webhook_url` present at fallback line 190: `webhook_url: ''`
- SYNC-MAP.md line 66 specifies: `webhook_url, webhook_secret` as required contract fields
- Modules that access `AppContext.getConfig()`: `intent-detector.js` (line 28), `lead-capture.js` (line 156), `fallback-recovery.js` (line 19), `response-orchestrator.js` (line 132) — none of these crash on missing `webhook_secret` because they don't read it yet, but the contract is incomplete

**Result**: **FAIL** — `webhook_secret` and `ai_tier` missing from emergency fallback shape

---

### SYNC-02 — State Machine Contract

**Contract**: Every `STATES.X` reference in `response-orchestrator.js` must exist in the `STATES` enum in `state-machine.js`.

**All STATES.X references found in `response-orchestrator.js`** (from direct code reads):

```
STATES.GREETING         — lines 114, 126, 180, 761 (step4), 755 (step4)
STATES.DISCOVERY        — lines 181 (transition), 768 (step4)
STATES.ENDED            — lines 126, 755, 821 (step4)
STATES.INTENT_DETECTED  — line 775 (step4), 843 (step5)
STATES.FLOW_WEBSITE     — lines 139 (demo), 141 (demo), 778 (step4)
STATES.FLOW_SEO         — lines 149 (demo), 151 (demo), 779 (step4)
STATES.FLOW_AI          — line 780 (step4)
STATES.FLOW_APP         — line 781 (step4)
STATES.FLOW_GENERAL     — lines 782, 796 (step4)
STATES.LEAD_CAPTURE     — line 801 (step4)
STATES.CLOSING          — lines 755, 804 (step4)
STATES.OBJECTION        — lines 749, 811 (step4)
STATES.FALLBACK         — line 816 (step4)
```

**Also used in `FLOW_CTX` map** (`response-orchestrator.js` lines 59–64):
```javascript
STATES.FLOW_WEBSITE → 'website'
STATES.FLOW_SEO     → 'seo'
STATES.FLOW_AI      → 'ai'
STATES.FLOW_APP     → 'app'
```

**STATES enum in `state-machine.js`** (lines 8–19):
```javascript
IDLE, GREETING, DISCOVERY, INTENT_DETECTED, FLOW_GENERAL,
LEAD_CAPTURE, CLOSING, OBJECTION, FALLBACK, ENDED
```
**Plus dynamically injected**: `FLOW_WEBSITE`, `FLOW_SEO`, `FLOW_AI`, `FLOW_APP` (injected from `config.services` in `state-machine.js` constructor)

**Every state confirmed in STATES enum**: YES — all orchestrator references map to either static or dynamically injected STATES entries.

**Result**: **PASS**

---

### SYNC-03 — Lead/Webhook Payload Contract

**Contract**: Payload shape must be consistent across lead-capture.js → outbox-db.js → webhook-dispatcher.js.

**Shape at dispatch call** (`lead-capture.js` lines 168–172):
```javascript
webhookDispatcher.dispatch('LEAD_CAPTURE', {
  ...this._leadData,    // name, business, goal, problem, contactMethod, budget, timeline
  completeness: this.getCompleteness(),
  url_context: window.location.href
})
```

**Shape wrapped by dispatcher** (`webhook-dispatcher.js` lines 64–71):
```javascript
const payload = {
  client_id:       config.company_name || 'unknown',  // line 65
  webhook_url:     config.webhook_url,                 // line 66 — CAPTURE AT SOURCE
  event_type:      eventType,                          // line 67
  data:            data,                               // line 68 — the lead payload above
  timestamp:       new Date().toISOString(),            // line 69
  idempotency_key: crypto.randomUUID()                 // line 70
};
```

**Shape stored in outbox** (`outbox-db.js` lines 73–80):
```javascript
const record = {
  id:          crypto.randomUUID(),     // line 74
  status:      OutboxStatus.PENDING,    // line 75
  attempts:    0,                       // line 76
  lastAttempt: 0,                       // line 77
  createdAt:   Date.now(),              // line 78
  ...item                               // line 79 — spreads full dispatch payload
};
```

**Shape sent via HTTP** (`webhook-dispatcher.js` _attemptDelivery lines 198–206):
```javascript
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type':      'application/json',   // line 201
    'X-Client-ID':       item.client_id,       // line 202
    'X-Idempotency-Key': item.idempotency_key  // line 203
    // ❌ X-Webhook-Secret: ABSENT
  },
  body: JSON.stringify(item),   // full record sent as body — line 205
})
```

**BUG-01 fallback confirmed at line**: **187**
```javascript
if (!url) {
  url = AppContext.getConfig().webhook_url;  // line 187 — TENANT ISOLATION VIOLATION
}
```

**SYNC-MAP contract shape gap**: SYNC-MAP.md line 88 specifies `webhook_secret` in the payload wrapper — it is **absent** from the `dispatch()` method at lines 64–71.

**Result**: **FAIL** — BUG-01 at line 187 (tenant isolation), `webhook_secret` not captured/stored in payload

---

### SYNC-04 — Config Validation Contract

**Contract**: `REQUIRED_FIELDS` in `validator.js` must include all critical fields including `webhook_secret`.

**Actual `REQUIRED_FIELDS`** (`validator.js` lines 10–18):
```javascript
const REQUIRED_FIELDS = [
  'company_name',          // line 11
  'assistant_name',        // line 12
  'tone',                  // line 13
  'primary_goal',          // line 14
  'greetings',             // line 15
  'cta_templates',         // line 16
  'service_domain_tokens'  // line 17
];
```

**Fields in REQUIRED_FIELDS without fallback**: NONE — all 7 listed fields have fallback equivalents in `getEmergencyFallback()`.

**`webhook_secret` in REQUIRED_FIELDS**: **NO** — must be YES per SSYNC-01 requirement.

**Additional missing**: `ai_tier` (referenced in SYNC-MAP contract shape, line 68).

**Result**: **FAIL** — `webhook_secret` absent from REQUIRED_FIELDS; violates SSYNC-01 contract.

---

### SYNC-05 — Outbox Status Contract

**Contract**: Both `webhook-dispatcher.js` and `outbox-db.js` must use `OutboxStatus` enum exclusively. No hardcoded status strings.

**OutboxStatus enum** (`outbox-db.js` lines 11–16):
```javascript
export const OutboxStatus = {
  PENDING:     'pending',
  PROCESSING:  'processing',
  COMPLETED:   'completed',
  DEAD_LETTER: 'dead-letter'
};
```

**Dispatcher usages** (`webhook-dispatcher.js`):
- Line 128: `status: OutboxStatus.PROCESSING` ✅
- Line 142: `status: OutboxStatus.DEAD_LETTER` ✅
- Line 148: `status: OutboxStatus.PENDING` ✅

**outbox-db.js usages** (line 75):
- Line 75: `status: OutboxStatus.PENDING` ✅

**outbox-db.js getAllProcessable filter** (lines 157–160):
```javascript
item.status === OutboxStatus.PENDING ||
(item.status === OutboxStatus.PROCESSING && ...)
```
Both use enum ✅

**Hardcoded status strings found**: NONE

**Result**: **PASS**

---

### SYNC-06 — Boot Order Contract

**Contract**: app.js must follow: 1. `loadConfig()` → 2. `AppContext.setConfig()` → 3. `webhookDispatcher.init()` → 4. engines

**Actual boot sequence in `app.js` `_boot()` method** (lines 45–75):
```
1. getClientFromURL()           — line 48
2. loadConfig(clientId)         — line 49  ← config load
3. AppContext.setConfig(config) — line 50  ← config ready
4. webhookDispatcher.init()     — line 53  ← dispatcher ready
5. new ConversationStateMachine(config)  — line 58  ← engines init
6. new ResponseOrchestrator(stateMachine) — line 59
7. new SpeechIO()               — line 60
8. _cacheDOMRefs()              — line 63
9. _applyBranding(config)       — line 66
10. _bindEvents()               — line 69
11. _startConversation()        — line 75
```

**Deviations**: NONE — boot order matches contract exactly.

**Result**: **PASS**

---

## SECURITY CONTRACT VALIDATIONS

---

### SSYNC-01 — Webhook Authentication Contract

**Contract**: Every HTTP POST must include `X-Webhook-Secret` header.

**Actual headers object** from `webhook-dispatcher.js` `_attemptDelivery()` (lines 200–204):
```javascript
headers: {
  'Content-Type':      'application/json',
  'X-Client-ID':       item.client_id,
  'X-Idempotency-Key': item.idempotency_key
  // ❌ 'X-Webhook-Secret' — ABSENT
}
```

**Result**: **FAIL** — `X-Webhook-Secret` header not present. SEC-01 open.

**Mitigation plan documented**: YES — recorded in SECURITY-AUDIT.md, SYNC-MAP.md (lines 113–124), and SESSION-LOG-T03.md. Implementation target: Pass 2 (G-009, G-024). T05 target for this pass: add `webhook_secret` field to configs and validator; full header implementation deferred to Pass 2.

---

### SSYNC-02 — EU AI Act Greeting Compliance

**Contract**: Every greeting string must explicitly identify system as AI.

**default.json greetings** (lines 245–250):
```
1. "Hey there! Welcome to Genuine Optimum. I help businesses find the right tech solutions..."
   → Compliant: NO — no AI disclosure
2. "Hi! Thanks for reaching out to Genuine Optimum. I'd love to understand what you're looking for..."
   → Compliant: NO — no AI disclosure
3. "Hello! Welcome to Genuine Optimum. We help businesses leverage technology to scale..."
   → Compliant: NO — no AI disclosure (uses "We" — implies team)
4. "Hey! Great to have you here. I'm with Genuine Optimum — we help businesses solve real problems..."
   → Compliant: NO — "I'm with Genuine Optimum" implies human employee
```
**default.json greetings: NON-COMPLIANT (0/4)**

**abc-roofing.json greetings** (lines 130–135):
```
1. "Hi! Welcome to ABC Roofing. I'm Sarah, your virtual assistant. How can I help you with your roofing needs today?"
   → Compliant: PARTIAL — "virtual assistant" is disclosed but EU AI Act requires explicit "AI" identification
2. "Hey there! Thanks for reaching out to ABC Roofing. What's going on with your roof — I'm here to help!"
   → Compliant: NO — no AI disclosure
3. "Hello! Welcome to ABC Roofing. Whether it's a repair or a new roof, I'm here to point you in the right direction."
   → Compliant: NO — no AI disclosure
4. "Hi! I'm Sarah from ABC Roofing. We handle everything from small repairs to full installations."
   → Compliant: NO — humanizes the system ("I'm Sarah from ABC Roofing")
```
**abc-roofing.json greetings: NON-COMPLIANT (0/4, 1 partial)**

**webhook_url in both configs** — present as empty string `""` (default.json line 340, abc-roofing.json line 223) — safe for now.

**Result**: **FAIL** — All 8 greeting strings non-compliant. SEC-05 confirmed P0. T05 must fix.

---

### SSYNC-03 — Config Sensitive Field Protection

**`webhook_url` present in plaintext in publicly accessible config files**: YES
- `default.json` line 340: `"webhook_url": ""`  (empty, but structure is public)
- `abc-roofing.json` line 223: `"webhook_url": ""` (empty, but structure is public)

**`webhook_secret` field exists in config files**: NO — absent from both configs.

**Architectural decision documented**: YES — SYNC-MAP.md lines 138–146 documents three options:
1. Netlify/Vercel environment variables + thin API endpoint
2. Runtime decryption with deployment-time key
3. Server-side config injection at build time

**Recommended decision** (to document for Pass 5 implementation): Option 1 — environment variables + thin proxy API endpoint, as it requires no build changes and works with all hosting providers.

**Result**: **FAIL** — `webhook_secret` absent from configs (blocking SSYNC-01). Architectural decision is documented in SYNC-MAP.md. SEC-02 remains open until Pass 5 full implementation.

---

## SYNC CHECK SUMMARY

| Contract | Result | Evidence                                    | Action Required                                        |
|----------|--------|---------------------------------------------|--------------------------------------------------------|
| SYNC-01  | FAIL   | `loader.js:190` — fallback missing `webhook_secret`, `ai_tier` | T05: Add fields to `getEmergencyFallback()` |
| SYNC-02  | PASS   | All STATES.X refs verified in `orchestrator.js` + `state-machine.js:8-19` | none |
| SYNC-03  | FAIL   | `webhook-dispatcher.js:187` — BUG-01 URL fallback; `webhook_secret` not in payload | T05: Remove fallback; add `webhook_secret` to payload |
| SYNC-04  | FAIL   | `validator.js:10-18` — `webhook_secret` absent from REQUIRED_FIELDS | T05: Add `webhook_secret` to REQUIRED_FIELDS |
| SYNC-05  | PASS   | `webhook-dispatcher.js:128,142,148` — all use OutboxStatus enum | none |
| SYNC-06  | PASS   | `app.js:48-75` — boot order matches contract exactly | none |
| SSYNC-01 | FAIL   | `webhook-dispatcher.js:200-204` — `X-Webhook-Secret` header absent | T05: Add field to configs/validator; Pass 2: full impl |
| SSYNC-02 | FAIL   | `default.json:245-250`, `abc-roofing.json:130-135` — 0/8 strings compliant | T05 P0: Rewrite all greeting strings |
| SSYNC-03 | FAIL   | `webhook_secret` absent from both configs; decision documented in SYNC-MAP.md | T05: Add field to configs; Pass 5: full protection |

**Functional contracts passing**: **3 / 6** (SYNC-02, SYNC-05, SYNC-06)
**Security contracts passing**: **0 / 3** (all fail pending T05 fixes)

**T05 must fix** (within allowed files per PROJECT-VARS.md):
1. `configs/default.json` — rewrite all 4 greetings for EU AI Act (SSYNC-02, SEC-05)
2. `configs/abc-roofing.json` — rewrite all 4 greetings for EU AI Act (SSYNC-02, SEC-05)
3. `js/services/webhook-dispatcher.js` — remove BUG-01 fallback at line 187 (SYNC-03, SEC-06)
4. `js/modules/lead-capture.js` — add `tenure` to constructor (BUG-02); add input length bound (SEC-03)
5. `js/config/validator.js` — add `webhook_secret` to REQUIRED_FIELDS (SYNC-04, SSYNC-01)
6. `js/config/loader.js` — add `webhook_secret` and `ai_tier` to emergency fallback (SYNC-01)
7. `configs/default.json` + `configs/abc-roofing.json` — add `webhook_secret: ""` field (SSYNC-03)
8. Rebuild `dist/` (BUG-03)

---

## T04 COMPLETION SIGN-OFF

```
T04_COMPLETED                   = YES
T04_DATE                        = 2026-04-28
T04_AGENT                       = Claude Sonnet
T04_FUNCTIONAL_CONTRACTS        = 3 / 6
T04_SECURITY_CONTRACTS          = 0 / 3
T04_BLOCKING_T05                = NO (all failures have documented fix targets)
ADVANCE_TO_T05                  = YES
```
