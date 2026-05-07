# SYNC MAP
## All Synchronization Points Across the Project

> Authoritative record of every dependency, contract, and data flow. Any agent making changes must consult this file before and after modifications.

---

## DATA FLOW MAP

```
URL (?client=)
    │
    ▼
loadConfig() → /configs/{clientId}.json
    │
    ▼
AppContext.setConfig()  ←──── ALL MODULES depend on this
    │
    ├──► ConversationStateMachine(config)
    │         └──► STATES, TRANSITIONS (dynamic service states injected)
    │
    ├──► ResponseOrchestrator(stateMachine)
    │         ├──► IntentDetector
    │         ├──► NLPEngine
    │         ├──► ServiceMapper
    │         ├──► DiscoveryEngine
    │         ├──► ConversationFlows
    │         ├──► LeadCapture ──────────────────────────────┐
    │         ├──► ClosingEngine                             │
    │         ├──► ObjectionHandler                          │
    │         ├──► FallbackRecovery                          │
    │         ├──► Personality                               │
    │         ├──► KnowledgeEngine                           │
    │         ├──► ResponseBuilder ──[DOM render — XSS risk] │
    │         ├──► MemorySynthesis                           │
    │         ├──► ConversationRouter                        │
    │         └──► RouterHandlers                            │
    │                                                        │
    ├──► SpeechIO ──[Voice → Google/Azure cloud — SEC-04]    │
    │                                                        ▼
    └──► webhookDispatcher.init()              webhookDispatcher.dispatch()
              │                                             │
              ▼                                             ▼
          outboxDB.init()                         outboxDB.add(payload)
              │                                             │
              └─────────────── IndexedDB ──────────────────┘
                                    │
                                    ▼
                    HTTP POST + X-Webhook-Secret header [SSYNC-01 — NOT YET IMPL]
                                    │
                                    ▼
                          n8n webhook → CRM / notifications
```

---

## FUNCTIONAL CONTRACT REGISTER

### SYNC-01 — Config Shape Contract
**Parties**: `config/loader.js` ↔ every module
**Contract**: Shape returned by `AppContext.getConfig()` must always include:
```javascript
{
  company_name, assistant_name, tone, role, primary_goal,
  secondary_goals, services, greetings, cta_templates,
  webhook_url, webhook_secret,   // webhook_secret added — SSYNC-01 requirement
  calendar_url, qualification_fields, knowledge_base,
  closing_responses, service_domain_tokens, ai_tier   // ai_tier for Tier 1/2 switching
}
```
**Status**: ⚠ webhook_secret not yet in schema — required for SSYNC-01

### SYNC-02 — State Machine Contract
**Parties**: `state-machine.js` ↔ `response-orchestrator.js`
**Contract**: Every STATES.X reference in orchestrator must exist in STATES enum. Every transition must be in TRANSITIONS map.
**Evidence required at T03**: Agent must list actual enum values from file.
**Status**: ✅ Passing (verify at every T03)

### SYNC-03 — Lead/Webhook Payload Contract
**Parties**: `lead-capture.js` ↔ `outbox-db.js` ↔ `webhook-dispatcher.js`
**Contract**: Payload shape consistent end-to-end.
```javascript
// LeadCapture sends:
{ name, business, goal, problem, timeline, contactMethod, budget,
  completeness, url_context }

// WebhookDispatcher wraps in:
{ id, client_id, webhook_url, webhook_secret, event_type, data,
  timestamp, idempotency_key, status, attempts, lastAttempt, createdAt }
```
**⚠ BUG-01 / SEC-06**: webhook_url fallback still present in _attemptDelivery.
**Status**: ⚠ FAIL — BUG-01 open

### SYNC-04 — Config Validation Contract
**Parties**: `/configs/*.json` ↔ `config/validator.js`
**REQUIRED_FIELDS must include**: company_name, assistant_name, tone, primary_goal, greetings, cta_templates, service_domain_tokens, webhook_secret (add this)
**Status**: ⚠ webhook_secret not yet in REQUIRED_FIELDS

### SYNC-05 — Outbox Status Contract
**Parties**: `webhook-dispatcher.js` ↔ `outbox-db.js`
**Contract**: Both use OutboxStatus enum exclusively. No hardcoded strings.
**Status**: ✅ Passing

### SYNC-06 — Boot Order Contract
**Parties**: `app.js` ↔ `AppContext` ↔ `webhookDispatcher`
**Contract**: 1. loadConfig() → 2. AppContext.setConfig() → 3. webhookDispatcher.init() → 4. engines
**Status**: ✅ Passing

---

## SECURITY CONTRACT REGISTER

### SSYNC-01 — Webhook Authentication Contract
**Parties**: `webhook-dispatcher.js` ↔ `n8n webhook endpoint`
**Contract**: Every HTTP POST must include:
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-Webhook-Secret': capturedWebhookSecret  // captured at dispatch time, same pattern as webhook_url
}
```
**Config requirement**: Add `webhook_secret` to all config JSON files and validator.js REQUIRED_FIELDS
**Implementation target**: Pass 2 full implementation. Pass 1: mitigation plan documented.
**Status**: IN PROGRESS

### SSYNC-02 — EU AI Act Greeting Compliance
**Parties**: `configs/*.json` greetings array ↔ `response-orchestrator.js` greeting delivery
**Contract**: Every greeting string must explicitly identify system as AI.
```json
// COMPLIANT:
"greetings": ["Hi! I'm [NAME], an AI assistant for [COMPANY]. How can I help you today?"]
// NON-COMPLIANT:
"greetings": ["Hi! I'm [NAME], how can I help?"]
```
**Implementation target**: Pass 1 T05 — this is a config edit only.
**Status**: RESOLVED

### SSYNC-03 — Config Sensitive Field Protection
**Parties**: `configs/*.json` ↔ hosting/deployment configuration
**Contract**: webhook_url and webhook_secret must not be exposed in publicly accessible files in production.
**Options**:
1. Netlify/Vercel environment variables + thin API endpoint
2. Runtime decryption with deployment-time key
3. Server-side config injection at build time
**Implementation target**: Pass 5 full implementation. Pass 1: decision documented.
**Status**: DECISION MADE — Option A

---

## PLANNED SYNC CONTRACTS (Future Passes)

| ID      | Description                                       | Pass |
|---------|---------------------------------------------------|------|
| SYNC-07 | LLM API module ↔ ResponseOrchestrator             | 3    |
| SYNC-08 | Analytics module ↔ all event-emitting modules     | 6    |
| SYNC-09 | Admin UI ↔ config validation schema               | 5    |
| SYNC-10 | Local ML model ↔ IntentDetector interface         | 4    |
| SYNC-11 | ServiceWorker ↔ OutboxDB retry relay              | 3    |
