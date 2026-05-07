# T05 — BUILD DIRECTIVE
## Template: Controlled Construction Pass
## Executed: 2026-04-28 | Agent: Claude Sonnet

---

## PRE-BUILD CHECKLIST

- [x] T01 HEALTH is AMBER
- [x] T02 research insights reviewed (EU AI Act, TCPA, privacy)
- [x] T03 module issues for all allowed files known
- [x] T04 failing contracts for allowed files all known
- [x] FILES_ALLOWED_TO_MODIFY confirmed from PROJECT-VARS.md
- [x] FILES_FORBIDDEN_TO_MODIFY confirmed — orchestrator, state-machine, speech-io NOT touched

**Allowed files this pass:**
```
js/services/webhook-dispatcher.js   ← BUG-01, SEC-06
js/modules/lead-capture.js          ← BUG-02
configs/default.json                ← SEC-05 (greetings), SSYNC-03 (webhook_secret field)
configs/abc-roofing.json            ← SEC-05 (greetings), SSYNC-03 (webhook_secret field)
js/config/validator.js              ← SYNC-04, SSYNC-01 prep
js/config/loader.js                 ← SYNC-01 (emergency fallback shape)
```

---

## TASK 1 — Fix P0 Functional Bugs

---

### BUG-01 + SEC-06: webhook-dispatcher.js — Remove fallback URL

**File**: `js/services/webhook-dispatcher.js`
**Method**: `_attemptDelivery(item)`
**Location**: Lines 182–192 (post-edit)

**BEFORE** (lines 183–192):
```javascript
let url = item.webhook_url; // USE CAPTURED URL

if (!url) {
  console.warn(`WebhookDispatcher: Item ${item.id} missing stored URL. Falling back to current config.`);
  url = AppContext.getConfig().webhook_url;
}

if (!url) {
  throw new Error('No webhook URL available (stored or config)');
}
```

**AFTER** (lines 183–192):
```javascript
const url = item.webhook_url; // MUST be captured at dispatch time — tenant isolation

// BUG-01 fix (SEC-06): Hard fail on missing URL. Do NOT fall back to current config.
// Falling back would deliver the payload to a different tenant's webhook endpoint.
if (!url) {
  throw new Error(
    `WebhookDispatcher: Item ${item.id} has no captured webhook_url. ` +
    `Tenant isolation violation prevented. Check dispatch() call site.`
  );
}
```

**Impact**: The silent fallback to `AppContext.getConfig().webhook_url` is gone. Any item without a captured URL now throws immediately, surfaces to `_processQueue()`'s try/catch (line 137), and is marked DEAD_LETTER after 5 attempts — preventing cross-tenant delivery.

**SYNC-03 status after fix**: PASS — URL is always captured at dispatch time (line 66: `webhook_url: config.webhook_url`). An empty string `""` will now correctly throw rather than silently no-op, which also improves observability.

**[x] BUG-01 RESOLVED**
**[x] SEC-06 RESOLVED**

---

### BUG-02: lead-capture.js — Fix tenure field

**File**: `js/modules/lead-capture.js`
**Method**: `constructor()`
**Location**: Lines 19–29

**BEFORE** (constructor `_leadData`, lines 20–28):
```javascript
this._leadData = {
  name:          null,
  business:      null,
  goal:          null,
  problem:       null,
  contactMethod: null,
  budget:        null,
  timeline:      null
};
```

**AFTER** (constructor `_leadData`, lines 20–29):
```javascript
this._leadData = {
  name:          null,
  business:      null,
  goal:          null,
  tenure:        null,  // BUG-02 fix: was missing from constructor (present in reset())
  problem:       null,
  contactMethod: null,
  budget:        null,
  timeline:      null
};
```

**`reset()` shape** (lines 190–194 — unchanged):
```javascript
this._leadData = {
  name: null, business: null, goal: null,
  tenure: null, problem: null,
  contactMethod: null, budget: null, timeline: null
};
```

Both shapes are now **identical** (8 fields each, same keys).

**SYNC-03 payload shape check**: The `tenure` field is already captured in `response-orchestrator.js` step 2 (`leads.capture('tenure', ...)` at line 579) and stored in leadData — it will now correctly persist after a `save()` + `reset()` cycle.

**[x] BUG-02 RESOLVED**

---

### BUG-03: Rebuild dist/

**Command**: `cmd /c "npm run build"`
**Result**: SUCCESS

```
vite v5.4.21 building for production...
✓ 34 modules transformed.
dist/index.html               6.20 kB │ gzip:  2.07 kB
dist/assets/index-DFkxVo-u.css  14.07 kB │ gzip:  3.53 kB
dist/assets/index-DIvQxGtX.js  104.45 kB │ gzip: 33.05 kB
✓ built in 392ms
```

All 34 source modules bundled. dist/ is now current with source. All fixes in this pass are included in the bundle.

**[x] BUG-03 RESOLVED**

---

## TASK 2 — Fix P0 Security Issues

---

### SEC-05 + SSYNC-02: EU AI Act greeting compliance

#### default.json

**File**: `configs/default.json` — Lines 245–250

| # | BEFORE | AFTER | Compliant |
|---|--------|-------|-----------|
| 1 | "Hey there! Welcome to Genuine Optimum. I help businesses find the right tech solutions to grow..." | "Hey there! **I'm an AI assistant for Genuine Optimum.** I help businesses find the right tech solutions to grow..." | ✅ |
| 2 | "Hi! Thanks for reaching out to Genuine Optimum. I'd love to understand what you're looking for..." | "Hi! **I'm an AI with Genuine Optimum.** I'd love to understand what you're looking for..." | ✅ |
| 3 | "Hello! Welcome to Genuine Optimum. **We** help businesses leverage technology to scale..." | "Hello! **I'm an AI assistant at Genuine Optimum.** We help businesses leverage technology to scale..." | ✅ |
| 4 | "Hey! Great to have you here. **I'm with Genuine Optimum**..." | "Hey! **I'm an AI assistant from Genuine Optimum**..." | ✅ |

All 4 strings: **COMPLIANT** (explicit "AI assistant" disclosure in every string)

#### abc-roofing.json

**File**: `configs/abc-roofing.json` — Lines 130–135

| # | BEFORE | AFTER | Compliant |
|---|--------|-------|-----------|
| 1 | "Hi! Welcome to ABC Roofing. I'm Sarah, **your virtual assistant**..." | "Hi! Welcome to ABC Roofing. I'm Sarah, **an AI assistant**..." | ✅ |
| 2 | "Hey there! Thanks for reaching out to ABC Roofing. What's going on with your roof — I'm here to help!" | "Hey there! Thanks for reaching out to ABC Roofing. **I'm an AI assistant** — what's going on with your roof?..." | ✅ |
| 3 | "Hello! Welcome to ABC Roofing. Whether it's a repair or a new roof, I'm here to point you in the right direction." | "Hello! Welcome to ABC Roofing. **I'm Sarah, an AI assistant.** Whether it's a repair or a new roof..." | ✅ |
| 4 | "Hi! **I'm Sarah from ABC Roofing**. We handle everything from small repairs to full installations." | "Hi! **I'm Sarah, ABC Roofing's AI assistant.** We handle everything from small repairs to full installations." | ✅ |

All 4 strings: **COMPLIANT** (explicit "AI assistant" disclosure in every string)

**SSYNC-02 contract status**: ✅ PASS — all 8 greeting strings now explicitly identify the system as AI.

**[x] SEC-05 RESOLVED**

---

### SYNC-04 + SSYNC-01 prep: validator.js + loader.js

#### validator.js — Add webhook_secret to REQUIRED_FIELDS

**File**: `js/config/validator.js` — Lines 10–19

**BEFORE**:
```javascript
const REQUIRED_FIELDS = [
  'company_name', 'assistant_name', 'tone', 'primary_goal',
  'greetings', 'cta_templates', 'service_domain_tokens'
];
```

**AFTER**:
```javascript
const REQUIRED_FIELDS = [
  'company_name', 'assistant_name', 'tone', 'primary_goal',
  'greetings', 'cta_templates', 'service_domain_tokens',
  'webhook_secret'   // SYNC-04 fix: required per SSYNC-01 — enables Pass 2 HMAC auth
];
```

**[x] SYNC-04 RESOLVED**

#### loader.js — Add webhook_secret, ai_tier, confirmations to emergency fallback

**File**: `js/config/loader.js` — `getEmergencyFallback()` function, lines 190–200

**BEFORE**:
```javascript
webhook_url: '',
calendar_url: '',
// (no webhook_secret, no ai_tier)
closing_responses: {
  soft: ['Would you like to take this forward?'],
  direct: ["Let's get you started."],
  exit: ['Thanks for chatting! Feel free to reach out anytime.']
}
```

**AFTER**:
```javascript
webhook_url: '',
webhook_secret: '',    // SYNC-01 fix: required per SSYNC-01 — must match config shape
calendar_url: '',
ai_tier: 1,            // SYNC-01 fix: required per SYNC-MAP shape spec
// ...
closing_responses: {
  soft: ['Would you like to take this forward?'],
  direct: ["Let's get you started."],
  confirmations: ['Great! We will be in touch shortly.'],  // was missing from fallback
  exit: ['Thanks for chatting! Feel free to reach out anytime.']
}
```

**[x] SYNC-01 RESOLVED**

#### configs/*.json — Add webhook_secret field

- `configs/default.json` line 341: `"webhook_secret": ""` added after `webhook_url`
- `configs/abc-roofing.json` line 224: `"webhook_secret": ""` added after `webhook_url`

Both configs now satisfy `validator.js` `REQUIRED_FIELDS` and the SSYNC-01 structural requirement.

**[x] SSYNC-03 (partial) — field now exists in configs, protection mechanism deferred to Pass 5**

---

## TASK 3 — Mitigation Plans Documented

### SEC-01 Mitigation Plan (Webhook HMAC Authentication)

```
SEC-01 MITIGATION PLAN:
Status: FIELD SCAFFOLD COMPLETE this pass — full implementation Pass 2
Approach: HMAC-SHA256 signature on all webhook POST requests

Implementation steps (Pass 2 target — G-009):
  1. webhook_secret field now in all config files (done)
  2. webhook_secret now in validator.js REQUIRED_FIELDS (done)
  3. webhook_secret now in emergency fallback (done)
  4. Pass 2 — In webhook-dispatcher.js dispatch():
       const capturedSecret = config.webhook_secret;
       // Store in payload alongside webhook_url
  5. Pass 2 — In _attemptDelivery():
       const key = await crypto.subtle.importKey(
         'raw', new TextEncoder().encode(item.webhook_secret),
         { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
       );
       const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
       headers['X-Webhook-Secret'] = btoa(String.fromCharCode(...new Uint8Array(sig)));
  6. Pass 2 — In n8n webhook node: validate X-Webhook-Secret header

Feature flag: FEATURE_WEBHOOK_AUTH = disabled (will enable Pass 2)
Target pass: Pass 2 (G-009, G-024)
```

### SSYNC-03 Architectural Decision (Config Sensitive Field Protection)

```
SSYNC-03 DECISION:
Chosen approach: Option A — Netlify/Vercel environment variables + thin API endpoint

Rationale:
  - Tier 1 clients are SMBs deploying to Netlify/Vercel (confirmed T02 research)
  - webhook_url and webhook_secret must not be committed to public repos or
    served as static JSON files in production
  - Option A requires no build pipeline changes and works with zero runtime deps
  - A thin serverless function (/api/config?client=abc-roofing) injects env vars
    at request time, never exposing secrets to the browser's network tab
  - Option B (runtime decryption) adds key management complexity not justified
    for Pass 1 Tier 1 clients
  - Option C (accept risk) is acceptable ONLY for local dev — never production

Pass 1 (this pass): webhook_secret field added as empty string to configs (structural scaffold)
Pass 5 full implementation: Netlify Function / Vercel Edge Function to serve config
Feature flag: FEATURE_WEBHOOK_AUTH (Pass 2) gates actual secret use
Target pass for full config protection: Pass 5 (G-011 or new goal)
```

---

## TASK 4 — Code Quality Checklist

### webhook-dispatcher.js ✅
- [x] All async functions have try/catch — `_processQueue()` line 132, `_attemptDelivery()` line 197
- [x] No hardcoded strings where enums exist — all status updates use `OutboxStatus.*`
- [x] BUG-01 fix: hard throw instead of fallback ✅
- [x] SYNC-03 passes — URL captured at dispatch, never falls back ✅
- [x] SYNC-05 passes — OutboxStatus enum used exclusively ✅
- [x] SYNC-06 passes — init() called in boot sequence after config ✅

### lead-capture.js ✅
- [x] `_leadData` shape identical in constructor and `reset()` — 8 fields each ✅
- [x] SYNC-03 payload shape unchanged — `tenure` was already captured by orchestrator ✅

### configs/*.json ✅
- [x] All 8 greetings now include explicit AI disclosure ✅
- [x] `webhook_secret: ""` field added to both configs ✅

### validator.js ✅
- [x] `webhook_secret` in REQUIRED_FIELDS ✅

### loader.js ✅
- [x] Emergency fallback includes `webhook_secret`, `ai_tier`, `closing_responses.confirmations` ✅

---

## BUILD SUMMARY

**Files modified**: 6
1. `js/services/webhook-dispatcher.js` — BUG-01 / SEC-06
2. `js/modules/lead-capture.js` — BUG-02
3. `js/config/validator.js` — SYNC-04
4. `js/config/loader.js` — SYNC-01
5. `configs/default.json` — SEC-05, SSYNC-02, SSYNC-03 scaffold
6. `configs/abc-roofing.json` — SEC-05, SSYNC-02, SSYNC-03 scaffold

**Bugs resolved**: BUG-01, BUG-02, BUG-03

**Security issues addressed**:
- SEC-05 ✅ RESOLVED — all 8 greetings now EU AI Act compliant
- SEC-06 ✅ RESOLVED — tenant isolation now enforced with hard throw
- SEC-01 ⚙ SCAFFOLDED — field infrastructure complete; HMAC impl deferred to Pass 2
- SEC-02 ⚙ SCAFFOLDED — `webhook_secret` field exists; config protection deferred to Pass 5

**Sync contracts addressed**:
- SYNC-01 ✅ RESOLVED — emergency fallback shape now complete
- SYNC-03 ✅ RESOLVED — BUG-01 removed; fallback gone
- SYNC-04 ✅ RESOLVED — `webhook_secret` in REQUIRED_FIELDS
- SSYNC-02 ✅ RESOLVED — all greeting strings compliant

**Mitigation plans documented**: SEC-01, SSYNC-03

**Deferred to next pass**:
- SEC-01 full HMAC implementation → Pass 2 (FEATURE_WEBHOOK_AUTH)
- SEC-02 config protection API endpoint → Pass 5
- SEC-03 input length bounding (nlp-extractor.js) → Pass 2 (forbidden file this pass)
- SEC-04 Web Speech API privacy disclosure → Pass 2 (forbidden file this pass)
- SEC-07 localStorage key hardening → Pass 2
- TCPA consent gate (G-026) → Pass 2

---

## T05 COMPLETION SIGN-OFF

```
T05_COMPLETED         = YES
T05_DATE              = 2026-04-28
T05_AGENT             = Claude Sonnet
T05_FILES_MODIFIED    = webhook-dispatcher.js, lead-capture.js, validator.js,
                        loader.js, default.json, abc-roofing.json
T05_BUGS_FIXED        = BUG-01, BUG-02, BUG-03
T05_SEC_FIXED         = SEC-05 (full), SEC-06 (full), SEC-01 (scaffold), SEC-02 (scaffold)
T05_CONTRACTS_FIXED   = SYNC-01, SYNC-03, SYNC-04, SSYNC-02
T05_PLANS_DOCUMENTED  = SEC-01 HMAC mitigation, SSYNC-03 Option A architectural decision
T05_DEFERRED          = SEC-01 full impl (Pass 2), SEC-02 API (Pass 5),
                        SEC-03/04/07 (Pass 2), G-026 TCPA (Pass 2)
ADVANCE_TO_T06        = YES
```
