# BLUEPRINT — CURRENT
## AI Voice Agent — Living Architecture Document

> **This file is updated at T07 of every loop pass. It reflects the current known state of the product — not the goal state. Do not confuse what IS here with what is PLANNED.**

```
BLUEPRINT_VERSION   = 1.7.0
LAST_UPDATED        = 2026-05-01
ACTIVE_LOOP_PASS    = 8
ACTIVE_TEMPLATE     = "T01"
STATUS              = COMPLETED — Pass 7 closed (Calendar & Twilio Infrastructure Live)
```

---

## PRODUCT IDENTITY

**What it is**: MedVoice AI — A multi-tenant, browser-native Medical AI Receptionist platform that embeds on any clinic or healthcare website, conducts a natural triage conversation, captures patient lead data (including DOB, insurance info, and reason for visit), enforces emergency guardrails, and fires data via webhook to an automation platform (n8n or equivalent).

**What it is not**: A server-side telephony agent. Not an enterprise call center product. Not a standalone mobile app. 

**Who buys it**: Clinics, private practices, dental offices, and medical service providers that get repeated inbound questions and want 24/7 patient triage and lead capture without staff.

---

## CURRENT ARCHITECTURE (As-Built)

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│                                                                 │
│  index.html                                                     │
│      │                                                          │
│      ▼                                                          │
│  app.js — Boot Controller                                       │
│      │                                                          │
│      ├──[1]── loadConfig(?client=ID) ──► /configs/{ID}.json    │
│      │              │                                           │
│      │              ▼                                           │
│      ├──[2]── AppContext.setConfig() ──► readyPromise resolved  │
│      │                                                          │
│      ├──[3]── webhookDispatcher.init()                         │
│      │              └──► outboxDB.init() ──► IndexedDB         │
│      │                                                          │
│      └──[4]── new ResponseOrchestrator(stateMachine)           │
│                      │                                          │
│              ┌───────┴────────────────────────────┐            │
│              │   6-STEP PIPELINE (per message)     │            │
│              │  1. detect_intent                   │            │
│              │  2. update_context                  │            │
│              │  3. evaluate_state                  │            │
│              │  4. choose_goal                     │            │
│              │  5. select_action                   │            │
│              │  6. generate_response               │            │
│              └───────────────────────────────────-─┘            │
│                      │                                          │
│              ┌───────┴──────┐                                  │
│              │              │                                   │
│         SpeechIO      LeadCapture                              │
│    (Web Speech API)        │                                    │
│                            ▼                                    │
│                   webhookDispatcher.dispatch()                  │
│                            │                                    │
│                            ▼                                    │
│                   outboxDB (IndexedDB)                          │
│                    ├── FIFO queue                               │
│                    ├── Web Locks mutex                          │
│                    └── Retry + dead-letter                      │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │ HTTP POST (when online)
                             ▼
                    n8n webhook → CRM / notifications
```

---

## MODULE STATUS MATRIX

| Module                     | Status     | Tier   | Open Issues |
|----------------------------|------------|--------|-------------|
| App Controller             | FUNCTIONAL | Both   | —           |
| Config Loader              | STABLE     | Both   | SEC-02/SSYNC-03 RESOLVED |
| Config Validator           | STABLE     | Both   | Medical Shape Enforced |
| State Machine              | STABLE     | Both   | —           |
| Discovery Engine           | STABLE     | Both   | Medical Sweep Applied |
| Lead Capture               | FUNCTIONAL | Both   | Medical Fields (Pass 3)|
| Closing Engine             | STABLE     | Both   | Medical Sweep Applied |
| Objection Handler          | STABLE     | Both   | —           |
| Fallback Recovery          | STABLE     | Both   | —           |
| Personality                | STABLE     | Both   | Medical Sweep Applied |
| Response Builder           | STABLE     | Both   | SEC-08       |
| Memory Synthesis           | STABLE     | Both   | REVIEW       |
| Conversation Flows         | STABLE     | Both   | —           |
| Service Mapper             | STABLE     | Both   | —           |
| NLP Suite (8 modules)      | FUNCTIONAL | Tier 1 | Regex-based |
| Knowledge Engine           | FUNCTIONAL | Both   | Medical Focus Applied |
| LLM Adapter                | STABLE     | Tier 2 | G-032 Fix Applied |
| Local Model Runner         | FUNCTIONAL | Tier 3 | Scaffold Live (Pass 4) |
| Emergency Detector         | FUNCTIONAL | Both   | P0 Live     |
| Analytics Emitter          | PLANNED    | Both   | Not built   |
| Admin UI                   | PLANNED    | Both   | Not built   |
| FEATURE_LOCAL_MODEL        | ENABLED    | Tier 3 | G-020 (Pass 4) |
| FEATURE_MEDICAL_SWEEP      | ENABLED    | Both   | G-033 (Pass 4) |

---

## FEATURE COMPLETION MATRIX

| Feature                        | Tier 1 (Rule-Based) | Tier 2 (LLM)   |
|--------------------------------|---------------------|-----------------|
| Multi-tenant config system     | ✅ Complete          | ✅ Inherits      |
| Conversation state machine     | ✅ Complete          | ✅ Inherits      |
| Voice input (mic)              | ✅ Functional        | ✅ Inherits      |
| Voice output (TTS)             | ✅ Functional        | ✅ Inherits      |
| Lead capture (gradual)         | ✅ Complete          | ✅ Inherits      |
| Webhook delivery (outbox)      | ✅ Complete          | ✅ Inherits      |
| Intent detection               | ⚠️ Keyword-based     | ✅ LLM-native    |
| Natural language responses     | ⚠️ Template-based    | ✅ LLM-generated |
| Open-ended Q&A                 | ❌ Not supported     | ✅ LLM-native    |
| Local Model Inference (G-020)  | ❌ Not supported     | ⚠️ Scaffolded (Pass 4) |
| Objection handling             | ⚠️ Scripted          | ✅ Contextual    |
| Analytics dashboard            | 🔲 Planned           | 🔲 Planned       |
| Admin config UI                | 🔲 Planned           | 🔲 Planned       |
| CRM direct integration         | ⚠️ Via webhook only  | ⚠️ Via webhook   |
| HIPAA-safe (data stays local)  | ✅ By design         | ✅ Tier 3 Native |

**Legend**: ✅ Done | ⚠️ Partial/Limited | ❌ Not possible | 🔲 Planned

---

## TIER 2 — LLM INTEGRATION (As-Built)

> Live in Pass 3. This section reflects the current implementation.

The minimum change to enable Tier 2 is a single integration point in `response-orchestrator.js` at step 6 (`generate_response`). Everything else (state machine, lead capture, webhook, config) is reused.

**LLM Adapter interface**:
```javascript
// js/services/llm-adapter.js (LIVE)
class LLMAdapter {
  constructor(config) { }
  
  async generateResponse(conversationHistory, systemContext, currentState) {
    // systemContext built from config: company_name, role, services, tone
    // Returns: { text: string, extractedEntities: object }
  }
  
  async classifyIntent(userInput, availableIntents) {
    // Returns: { intent: string, confidence: number }
  }
}
```

**System prompt construction** (from existing config):
```javascript
// The config JSON already contains everything needed for a system prompt:
// company_name + role + tone + services + primary_goal + knowledge_base
// → These map directly to a structured system prompt
// → No new config fields needed for basic Tier 2
```

**Tier selector** (proposed addition to config):
```json
{
  "ai_tier": "rule-based",   // or "llm-api" or "local-model"
  "llm_model": "claude-sonnet-4-20250514",
  "llm_max_tokens": 300
}
```

---

## KNOWN LIMITATIONS

| Limitation                    | Impact           | Resolution                    | Target Pass |
|-------------------------------|------------------|-------------------------------|-------------|
| Keyword-based NLP             | Brittle intent   | ML classifier or LLM          | 3 or TBD    |
| Template-only responses       | Obvious bot feel | LLM tier or local model       | 3           |
| No analytics                  | No client ROI data | Analytics module             | 6           |
| No admin UI                   | Config requires dev | Config editor UI            | 8           |
| Web Speech API only           | Chrome/Edge only | Fallback or alternative       | TBD         |
| No test suite                 | Regressions risk | Vitest Browser Mode           | 6           |
| Manual deployment             | Error-prone      | CI/CD pipeline                | 7           |

---

## PASS HISTORY

| Pass | Date | Key Outcomes | Agent |
|------|------|--------------|-------|
| 1    | 2026-04-28 | Full audit, BUG-01/02/03 fixed, SEC-05 fixed, Tenant Isolation verified | Gemini 1.5 Pro + Claude Sonnet |
| 2    | 2026-04-29 | Security hardening (HMAC, sanitization, TCPA consent, localStorage isolation) | Claude Sonnet + Gemini 3.1 Pro |
| 3    | 2026-04-29 | ServiceWorker sync, LLM Adapter (Ollama), Emergency Detector, Medical Pivot | Gemini 1.5 Pro |
| 4    | 2026-04-29 | Vitest Suite, G-032 (LLM Init Fix), G-033 (Medical Sweep), G-020 (Local Model) | Gemini 3 Flash |
| 5    | 2026-04-30 | Node.js Backend Scaffold, HMAC Security Hardening, Option A Config Serving | Claude Sonnet |
| 6    | 2026-05-01 | Frontend-Backend Wiring, Secret Isolation (SEC-02), Emergency Guardrail (choking), 100% Test Pass | Antigravity |
| 7    | 2026-05-01 | Google Calendar Real-time Booking, Twilio Voice Inbound Scaffold, Booking Confirmation State | Antigravity |

---

## NEXT PASS PRIORITY

> Updated at T07 of each pass.

NEXT_PASS   = 8
FOCUS       = Admin UI & Testing Expansion
GOALS       = [G-047, G-048, G-049, G-050]

| Priority | Goal ID | Description |
| :--- | :--- | :--- |
| P0 | G-047 | Admin UI scaffold — practice configuration editor |
| P1 | G-048 | Expand Vitest suite — calendar, voice, dispatcher |
| P1 | G-049 | Complete DRAFT skills — SK-006, SK-008 |
| P2 | G-050 | HIPAA BAA documentation — vendor checklist |
```
