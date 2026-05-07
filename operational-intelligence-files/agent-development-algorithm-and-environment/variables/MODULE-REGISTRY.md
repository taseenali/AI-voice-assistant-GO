# MODULE REGISTRY
## Every module, its status, purpose, dependency chain, and security posture

---

## STATUS LEGEND
```
STABLE      = Production-ready, no known issues
FUNCTIONAL  = Works but has known limitations or open issues
PLANNED     = Defined but not built
DEPRECATED  = Being replaced
```

## SECURITY LEGEND
```
CLEAN    = No known security issues
SEC-XX   = Known security issue — see SECURITY-AUDIT.md
REVIEW   = Security review required at T03
```

---

## CORE MODULES

| Module                     | File                          | Status     | Open Issues        | Security     |
|----------------------------|-------------------------------|------------|--------------------|--------------|
| App Controller             | js/app.js                     | FUNCTIONAL | BUG-03             | CLEAN        |
| Config Loader              | js/config/loader.js           | STABLE     | —                  | SEC-02 (indirect) |
| Config Validator           | js/config/validator.js        | STABLE     | Missing webhook_secret in REQUIRED_FIELDS | REVIEW |
| State Machine              | js/state-machine.js           | STABLE     | —                  | CLEAN        |
| Response Orchestrator      | js/response-orchestrator.js   | FUNCTIONAL | GAP-01             | SEC-05 (greeting delivery) |
| Speech I/O                 | js/speech-io.js               | FUNCTIONAL | —                  | SEC-04       |

---

## SERVICE MODULES

| Module                     | File                              | Status     | Open Issues        | Security         |
|----------------------------|-----------------------------------|------------|--------------------|------------------|
| Webhook Dispatcher         | js/services/webhook-dispatcher.js | FUNCTIONAL | BUG-01             | SEC-01, SEC-06   |
| Outbox DB                  | js/services/outbox-db.js          | STABLE     | —                  | CLEAN            |
| LLM Adapter                | js/services/llm-adapter.js        | FUNCTIONAL | —                  | CLEAN            |
| Conversation Logger        | js/services/conversation-logger.js| FUNCTIONAL | —                  | SEC-11 (PHI in logs) |
| Local Model Runner         | js/services/local-model-runner.js | FUNCTIONAL | Scaffold only      | CLEAN            |

---

## SERVER ROUTES

| Module                     | File                              | Status     | Open Issues        | Security         |
|----------------------------|-----------------------------------|------------|--------------------|------------------|
| Config Route               | server/routes/config.js           | STABLE     | —                  | CLEAN            |
| Calendar Route             | server/routes/calendar.js         | FUNCTIONAL | BLOCKER-01         | CLEAN            |
| Voice Route                | server/routes/voice.js            | FUNCTIONAL | Twilio not live    | CLEAN            |
| LLM Proxy Route            | server/routes/llm-proxy.js        | FUNCTIONAL | —                  | CLEAN            |
| Conversation Log Route     | server/routes/log.js              | FUNCTIONAL | —                  | SEC-11 (PHI in logs) |

---

## CONVERSATION MODULES

| Module                     | File                              | Status     | Open Issues        | Security     |
|----------------------------|-----------------------------------|------------|--------------------|--------------|
| Intent Detector            | js/modules/intent-detector.js     | FUNCTIONAL | Keyword-only NLP   | REVIEW       |
| Discovery Engine           | js/modules/discovery-engine.js    | STABLE     | —                  | CLEAN        |
| Lead Capture               | js/modules/lead-capture.js        | FUNCTIONAL | BUG-02             | SEC-07       |
| Closing Engine             | js/modules/closing-engine.js      | STABLE     | —                  | CLEAN        |
| Objection Handler          | js/modules/objection-handler.js   | STABLE     | —                  | CLEAN        |
| Fallback Recovery          | js/modules/fallback-recovery.js   | STABLE     | —                  | CLEAN        |
| Personality                | js/modules/personality.js         | STABLE     | —                  | CLEAN        |
| Response Builder           | js/modules/response-builder.js    | STABLE     | —                  | SEC-08       |
| Memory Synthesis           | js/modules/memory-synthesis.js    | STABLE     | —                  | REVIEW       |
| Conversation Flows         | js/modules/conversation-flows.js  | STABLE     | —                  | CLEAN        |
| Service Mapper             | js/modules/service-mapper.js      | STABLE     | —                  | CLEAN        |

---

## NLP MODULES

| Module                     | File                          | Status     | Open Issues        | Security     |
|----------------------------|-------------------------------|------------|--------------------|--------------|
| NLP Core                   | js/nlp/nlp-core.js            | STABLE     | —                  | CLEAN        |
| NLP Intent                 | js/nlp/nlp-intent.js          | FUNCTIONAL | Keyword-based      | REVIEW       |
| NLP Extractor              | js/nlp/nlp-extractor.js       | FUNCTIONAL | Regex-based        | SEC-03       |
| NLP Confidence             | js/nlp/nlp-confidence.js      | STABLE     | —                  | CLEAN        |
| NLP Temporal               | js/nlp/nlp-temporal.js        | STABLE     | —                  | CLEAN        |

---

## ROUTER + KNOWLEDGE MODULES

| Module                     | File                              | Status     | Open Issues        | Security     |
|----------------------------|-----------------------------------|------------|--------------------|--------------|
| Conversation Router        | js/router/conversation-router.js  | STABLE     | —                  | CLEAN        |
| Router Handlers            | js/router/router-handlers.js      | STABLE     | —                  | CLEAN        |
| Knowledge Engine           | js/knowledge/knowledge-engine.js  | FUNCTIONAL | Config-driven only | CLEAN        |

---

## CONFIG FILES

| File                       | Status     | Open Issues             | Security              |
|----------------------------|------------|-------------------------|-----------------------|
| configs/default.json       | FUNCTIONAL | SEC-05 greetings        | SEC-02, SEC-05        |
| configs/abc-roofing.json   | FUNCTIONAL | SEC-05 greetings        | SEC-02, SEC-05        |

---

## PLANNED MODULES

| Module                     | Planned File                      | Target Pass | Purpose                         |
|----------------------------|-----------------------------------|-------------|---------------------------------|
| LLM API Adapter            | js/services/llm-adapter.js        | 3           | Abstract LLM calls for Tier 2   |
| Analytics Emitter          | js/services/analytics.js          | 6           | Event tracking per interaction  |
| Admin UI Controller        | js/admin/admin.js                 | 5           | Config editing interface        |
| Local Model Adapter        | js/services/local-model.js        | 4           | WebLLM / ONNX integration       |
| ML Intent Classifier       | js/nlp/nlp-ml-intent.js           | TBD         | Replace keyword matching        |
