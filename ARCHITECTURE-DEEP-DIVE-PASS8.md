# MedVoice AI Receptionist — Architecture Deep Dive
### Proven Component Reference | Pass 8 State | 2026-05-02

> **Authorship note**: Every claim in this document is derived directly from source
> code read at Pass 8. No assumptions are made. Where behavior is inferred, the
> exact file and line that proves it is cited. This document is a learning reference,
> not a spec — it describes what the code actually does today.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack & File Inventory](#2-technology-stack--file-inventory)
3. [Boot Sequence — How the App Initializes](#3-boot-sequence)
4. [Config System](#4-config-system)
5. [Speech I/O Layer](#5-speech-io-layer)
6. [Pre-Pipeline Router (Conversation Gate)](#6-pre-pipeline-router)
7. [The 6-Step Pipeline — ResponseOrchestrator](#7-the-6-step-pipeline)
8. [NLP Layer — 8 Sub-Modules](#8-nlp-layer)
9. [Intent Detector](#9-intent-detector)
10. [State Machine](#10-state-machine)
11. [Conversation Flow Modules](#11-conversation-flow-modules)
12. [Personality, Response Builder, Memory Synthesis](#12-personality-response-builder-memory-synthesis)
13. [Knowledge Engine](#13-knowledge-engine)
14. [LLM Layer](#14-llm-layer)
15. [Services Layer (Webhooks, Logging, Outbox)](#15-services-layer)
16. [Express Backend — Server & Routes](#16-express-backend)
17. [Emergency Detector — Hard Safety Guardrail](#17-emergency-detector)
18. [Full Turn Data Flow (End-to-End Trace)](#18-full-turn-data-flow)
19. [Config JSON Schema Reference](#19-config-json-schema-reference)
20. [Component Dependency Graph](#20-component-dependency-graph)

---

## 1. System Overview

MedVoice is a multi-tenant AI medical receptionist delivered as a web widget. A patient opens a URL, is greeted by voice, and can speak or type. The assistant collects patient information, books calendar appointments, handles objections, and fires HMAC-authenticated webhooks to downstream automation (n8n).

**Three runtime environments:**
- **Browser** — Vue-like single-page app (`index.html` + ES modules). Handles all UI, voice I/O, and the conversation engine.
- **Node.js backend** — Express server (`server/`). Handles: config serving, Google Calendar, LLM proxying, Twilio voice, and audit logging.
- **Ollama** (optional, local) — LLM inference server running `llama3.2` or equivalent. Never called directly from the browser; all calls proxy through the Node backend.

**Core design decision**: The browser runs the full conversation engine (intent detection, state machine, flow orchestration) entirely in JavaScript. The backend exists for security (secret protection, LLM proxying) and external integrations (calendar, Twilio). There is no database.

---

## 2. Technology Stack & File Inventory

### Browser (client-side)

| Path | Role |
|---|---|
| `index.html` | Shell HTML, tap-to-start overlay, chat UI, all DOM |
| `js/app.js` | Entry point class `App` — boots everything, owns DOM |
| `js/state-machine.js` | `ConversationStateMachine` + `STATES` + `GOALS` |
| `js/response-orchestrator.js` | `ResponseOrchestrator` — 6-step pipeline |
| `js/speech-io.js` | `SpeechIO` — Web Speech API wrapper |
| `js/config/loader.js` | `loadConfig()`, `AppContext` singleton |
| `js/config/validator.js` | `validateConfig()` — structural validation |
| `js/router/conversation-router.js` | `ConversationRouter` — pre-pipeline gate |
| `js/router/router-handlers.js` | `RouterHandlers` — canned responses for non-CORE inputs |
| `js/nlp/nlp-core.js` | `NLPEngine` — orchestrates all 8 NLP sub-modules |
| `js/nlp/nlp-preprocess.js` | `preprocess()` — tokenize + clean |
| `js/nlp/nlp-semantic.js` | `normalizeSemantics()` — synonym expansion |
| `js/nlp/nlp-extractor.js` | `extractSignals()` — extract structured clinical entities |
| `js/nlp/nlp-intent.js` | `detectIntent()` — primary/secondary intent detection |
| `js/nlp/nlp-user-model.js` | `evaluateUser()` — classify user behavioral type |
| `js/nlp/nlp-confidence.js` | `scoreConfidence()` — per-field confidence scoring |
| `js/nlp/nlp-temporal.js` | `NLPTemporal` — multi-turn intent stabilization |
| `js/nlp/nlp-behavior.js` | `BehaviorEngine` — response strategy by user profile |
| `js/nlp/nlp-temporal-extractor.js` | `extractDateTime()` — ISO timestamp from natural language |
| `js/modules/intent-detector.js` | `IntentDetector` — keyword/phrase weighted matching |
| `js/modules/conversation-flows.js` | `ConversationFlows` — config-driven flow step management |
| `js/modules/discovery-engine.js` | `DiscoveryEngine` — open-ended discovery questions |
| `js/modules/lead-capture.js` | `LeadCapture` — field-by-field data collection |
| `js/modules/closing-engine.js` | `ClosingEngine` — close/exit response library |
| `js/modules/objection-handler.js` | `ObjectionHandler` — rebuttals |
| `js/modules/fallback-recovery.js` | `FallbackRecovery` — when all else fails |
| `js/modules/personality.js` | `Personality` + `TONE_STATES` — tone modulation |
| `js/modules/response-builder.js` | `ResponseBuilder` — KB-enriched responses |
| `js/modules/memory-synthesis.js` | `MemorySynthesis` — entity store, user state |
| `js/modules/emergency-detector.js` | `emergencyDetector` — deterministic keyword scan |
| `js/knowledge/knowledge-engine.js` | `KnowledgeEngine` — config-driven FAQ + insight layer |
| `js/services/llm-adapter.js` | `LLMAdapter` + `ProxyProvider` — Tier 2/3 LLM |
| `js/services/local-model-runner.js` | `LocalModelProvider` — Tier 3 local model |
| `js/services/webhook-dispatcher.js` | `webhookDispatcher` — HMAC, outbox, backoff |
| `js/services/outbox-db.js` | `OutboxDB` — IndexedDB offline queue |
| `js/services/conversation-logger.js` | `conversationLogger` — per-turn audit log |
| `sw.js` | Service Worker — offline webhook delivery |

### Server (Node.js backend)

| Path | Role |
|---|---|
| `server/index.js` | Express app entry, route registration |
| `server/routes/config.js` | `GET /api/config` — serve client config (secrets stripped) |
| `server/routes/health.js` | `GET /health` — liveness check |
| `server/routes/calendar.js` | `POST /api/calendar/check`, `POST /api/calendar/book` |
| `server/routes/voice.js` | `POST /api/voice/webhook` — Twilio ConversationRelay |
| `server/routes/llm-proxy.js` | `POST /api/llm/chat`, `GET /api/llm/health` |
| `server/routes/log.js` | `POST /api/log/conversation` — audit log |

### Config

| Path | Role |
|---|---|
| `configs/default.json` | Base config used when no client ID specified |
| `configs/medical-clinic.json` | MedVoice Clinic demo config |

---

## 3. Boot Sequence

**Entry point**: `js/app.js` line 754
```js
document.addEventListener('DOMContentLoaded', () => { window.app = new App(); });
```

The `App` constructor immediately calls `_boot()` (async). Every system is initialized in strict order:

```
1. getClientFromURL()           → parse ?client=medical-clinic from URL
2. loadConfig(clientId)         → fetch /api/config?client=... → validate → return safeConfig
3. AppContext.setConfig(config)  → freeze config, make it globally available
4. new ConversationStateMachine(config)  → registers dynamic FLOW_SERVICE_* states
5. new ResponseOrchestrator(stateMachine)  → instantiates ALL 14+ modules
6. new SpeechIO()               → init Web Speech API
7. _cacheDOMRefs()              → grab all element refs
8. _applyBranding(config)       → inject company_name into title, logo, footer
9. _bindEvents()                → send button, enter key, mic, orb click, reset
10. _setupSpeechCallbacks()     → wire recognition and synthesis callbacks
11. _setupStateListener()       → subscribe to state machine changes → update UI
12. _checkBrowserSupport()      → disable mic if no SpeechRecognition
13. _bindTapToStart()           → show overlay; on click → unlockAudio() + _startConversation()
```

**Why tap-to-start exists** (`app.js:249`): Chrome's autoplay policy requires that `speechSynthesis.speak()` is called within a user-gesture handler. `unlockAudio()` fires a near-silent utterance synchronously in the click handler, keeping the audio engine warm for the async speak() call that follows after `processInput()` resolves.

**After tap**: `_startConversation()` calls `orchestrator.startConversation()` → transitions state machine to `GREETING` → gets greeting text → renders it → calls `speechIO.speak(greeting)`.

---

## 4. Config System

**Files**: `js/config/loader.js`, `js/config/validator.js`

### AppContext Singleton

`AppContext` is a module-level object that all 14+ modules call to read config. It is **not** a class — it is a plain object with methods, exported directly. Every module does:
```js
import { AppContext } from '../config/loader.js';
const config = AppContext.getConfig();
```

`AppContext.setConfig(config)` freezes the config with `Object.freeze()`. Once set, it cannot be mutated. This is the single source of truth for all runtime behavior.

### Load Priority Chain (`loadConfig`)

1. `GET /api/config?client={clientId}` — client-specific
2. `GET /api/config?client=default` — fallback
3. `getEmergencyFallback()` — hardcoded minimal config if both fetches fail

The server's `config.js` route reads `configs/{clientId}.json` from disk. It strips `ollama_endpoint` from the response (security: `SSYNC-03`), and injects `webhook_url` and `webhook_secret` from environment variables.

### Validator (`validator.js`)

`validateConfig(config, fallback)` checks required fields and returns `{ valid, errors, safeConfig }`. Fields with defaults are backfilled from the fallback if missing. The safeConfig is always returned — the app never crashes from a bad config.

### Key Config Fields

| Field | Type | Effect |
|---|---|---|
| `company_name` | string | Injected into all UI, greetings, router responses |
| `assistant_name` | string | Used in personality greetings |
| `tone` | string | Sets Personality module defaults |
| `primary_goal` | string | `'book_appointment'` triggers calendar close flow in orchestrator |
| `services[]` | array | Defines all service intents, keywords, flow steps |
| `ai_tier` | number | 1=rule-based, 2=Ollama proxy, 3=local model |
| `llm_model` | string | Passed to LLM proxy (`llama3.2`, `llama3.1:8b`, etc.) |
| `calendar_enabled` | bool | Gates calendar check/book in close action |
| `calendar_id` | string | Google Calendar ID for booking |
| `emergency_keywords[]` | array | Loaded into EmergencyDetector |
| `qualification_fields[]` | array | Fields LeadCapture collects in order |
| `service_domain_tokens[]` | array | Used by ConversationRouter to detect domain signal |
| `cta_templates[]` | array | Round-robin CTA phrases for conversion anchor |

---

## 5. Speech I/O Layer

**File**: `js/speech-io.js` — class `SpeechIO`

Wraps two browser APIs: `SpeechRecognition` (input) and `SpeechSynthesis` (output). These are completely separate sub-systems within one class.

### Recognition (Input)

Initialized in `_initRecognition()`:
- `continuous: false` — one utterance at a time
- `interimResults: true` — partial transcripts fire during speech
- `lang: 'en-US'`
- `maxAlternatives: 1`

**`onresult` handler** (`speech-io.js:70`): For interim results, checks `_isMeaningfulInterrupt()` — if user is speaking while assistant is speaking AND the transcript has ≥2 meaningful non-filler words, it cancels speech, saves partial transcript to `interruptBuffer`, and fires `onInterrupt`.

**`_isMeaningfulInterrupt(text)`** (`speech-io.js:342`): Filters out filler words (`uh`, `um`, `okay`, etc.) and requires 2+ meaningful tokens or 4+ words total to trigger an interrupt.

**Error handling** (`speech-io.js:113`): Hard errors (`not-allowed`, `service-not-allowed`, `network`, `audio-capture`) fire `onPrivacyFallback` → app disables mic and switches to text-only mode. `no-speech` and `aborted` are silently ignored.

### Synthesis (Output)

**`speak(text)`** (`speech-io.js:209`): Full async pipeline:
1. Cancels any active speech
2. Increments `_activeSpeechToken` (invalidates stale chunks)
3. Fires `onSpeakStart`
4. Random delay (100–450ms) — simulates thinking
5. Splits text into chunks at punctuation if >15 words
6. Speaks each chunk via `_speakUtterance()` with subtle rate/pitch variation (first chunk slightly faster, last chunk slightly slower)
7. Inter-chunk pause (30–150ms)
8. Fires `onSpeakEnd` when done

**`speakChunk(text)`** (`speech-io.js:302`): Used for LLM streaming TTS. Directly queues a single utterance without resetting the speech token. `onSpeakEnd` only fires when `_synthesis.speaking` is fully drained (no remaining queued utterances).

**`unlockAudio()`** (`speech-io.js:160`): Fires a near-silent utterance (`volume: 0`, `rate: 16`) to satisfy Chrome's user-activation requirement. Must be called synchronously inside a click handler before any async work.

**Voice selection** (`speech-io.js:132`): Preferences in order: Google voice > Natural voice > any English > first available.

### Callbacks wired by `app.js`

| Callback | Trigger | App action |
|---|---|---|
| `onResult(transcript, isFinal)` | Recognition result | Final → `_processUserInput(transcript)` |
| `onInterrupt(partial)` | User speaks over assistant | `_processUserInput('__INTERRUPT__')` |
| `onListenStart` | Mic active | Orb → `listening` state |
| `onListenStop` | Mic stopped | Orb → `idle` |
| `onSpeakStart` | TTS starts | Orb → `speaking` state |
| `onSpeakEnd` | TTS done | Orb → `idle`; if voiceMode → restart listening |

---

## 6. Pre-Pipeline Router

**Files**: `js/router/conversation-router.js`, `js/router/router-handlers.js`

### ConversationRouter

Runs **before** the 6-step pipeline on every input. Classifies input into one of 6 types:

```
ROUTE_TYPE = { GREETING, NOISE, META, OUT_OF_SCOPE, INTERRUPT, CORE }
```

**Priority stack** (`conversation-router.js:99`):

1. **Empty input** → `NOISE`
2. **`__INTERRUPT__` signal** → `INTERRUPT` (system interrupt from mic cutoff)
3. **Priority 1 — Strong domain signal + ≥3 words** → `CORE` immediately (fast path)
4. **Priority 2 — Interrupt phrase + domain signal** → `CORE` (e.g. "actually I need dental work")
5. **Priority 3 — Greeting exact/pattern match** → `GREETING`
6. **Priority 3 — Meta phrase match** → `META`
7. **Priority 3 — Out-of-scope pattern match** → `OUT_OF_SCOPE`
8. **Priority 4 — Interrupt phrase, no domain signal** → `INTERRUPT`
9. **Priority 5a — All tokens are fillers** → `NOISE`
10. **Priority 5b — ≤2 words, no domain signal** → `NOISE`
11. **Priority 5c — NLP confidence < 0.25, no domain signal** → `NOISE`
12. **Priority 6 — Has domain signal** → `CORE`
13. **Priority 6 — NLP confidence ≥ 0.5** → `CORE`
14. **Unclear streak ≥2** → `NOISE`
15. **Default** → `CORE`

**Domain signal detection** (`conversation-router.js:223`): Checks if any token from `config.service_domain_tokens` appears as a whole word in the input. For `medical-clinic.json`, these tokens include: `pain`, `doctor`, `appointment`, `symptoms`, `checkup`, `clinic`, `health`, `dental`, `medical`, `treatment`, `booking`, `schedule`.

**What happens for non-CORE routes** (`response-orchestrator.js:160`):
- `NOISE` → increments `_unclear` counter, increments `_turnsSinceGoalProgress`
- `INTERRUPT` → returns `fallback.getInterruptResponse()` immediately
- All others → passed to `RouterHandlers.handle(type)` → returns a canned response without touching the pipeline

### RouterHandlers

All response pools are built from config at construction time (`router-handlers.js:27`). Template variables `{{company_name}}` and `{{service_summary}}` are interpolated once at construction. `{{service_summary}}` is built from `config.services[].display_name || config.services[].name`.

**Round-robin selection** (`router-handlers.js:114`): Per-pool counter increments on each pick. No consecutive repetition.

**Response pool hierarchy**:
- `GREETING` → `config.greeting_responses` (or 4 hardcoded defaults)
- `NOISE` (streak < 2) → `config.noise_responses`
- `NOISE` (streak ≥ 2) → `config.noise_escalated_responses`
- `META` → `config.meta_responses`
- `OUT_OF_SCOPE` → `config.out_of_scope_responses`

---

## 7. The 6-Step Pipeline

**File**: `js/response-orchestrator.js` — class `ResponseOrchestrator`

`processInput(userInput, onToken)` is the public API called by `app.js` after routing. It runs all 6 steps in strict sequence. `onToken` is an optional callback for streaming TTS from the LLM.

### Emergency Check (before Step 1)

**Line 141**: `emergencyDetector.scan(input)` runs **before everything** including routing. If a keyword matches, the response is returned immediately without entering the pipeline. This is deterministic — no LLM, no confidence scoring.

### Step 1 — `_step1_detectIntent(input)`

1. Calls `nlp.analyze(input, ctx)` → full NLP snapshot
2. Calls `intent.detect(input)` → keyword-based intent
3. **Merges**: If keyword engine has a service intent OR NLP is uncertain (`UNKNOWN`), keyword engine wins and overwrites NLP intent
4. Checks for interruption: if current intent and new intent are both service intents, they differ, and we're in an active flow → `isInterruption = true`
5. **Multi-intent processing** (Step 5 layer): If `nlpData.multiIntents` has >1 intent, resolves via type hierarchy:
   - `override` type: later position wins; cancels deferred stack; breaks processing
   - `dependent`/`primary` type: primary intent fires now, secondary deferred via `sm.deferIntent()`
6. **Deferred intent resolution**: If input is an acknowledgment (`yeah/yes/okay/sure`) AND current flow is stable AND a deferred intent exists → pops and fires deferred intent
7. **Knowledge engine boost** (`kb.analyze()`): If intent is unknown or weak but KB has high confidence (`>0.6`), KB's recommended intent overrides

### Step 2 — `_step2_updateContext(input, nlpData)`

Extracts structured data from the NLP snapshot and stores it:
- `medical_practice`, `care_goal`, `problem`, `patient_history` → stored in both `MemorySynthesis` and `LeadCapture` (with confidence threshold gating)
- **Name extraction** (strict): only matches `"my name is X"`, `"I am X"`, `"I'm X"`, `"this is X"`, `"call me X"` patterns; blacklisted words like `"trying"`, `"looking"`, `"going"` are ignored
- **Urgency**: if `high`, stored immediately in lead data
- **Temporal extraction** (`extractDateTime(input)`): ISO timestamp extracted and stored as `appointment_time` + `appointment_iso` in lead data
- **Secondary intent**: stored in memory for multi-turn context
- **Intent update**: only if new intent is not UNKNOWN/POSITIVE/NEGATIVE and strength is not weak
- **Engagement scoring**: see `_scoreEngagement()`
- **Unclear tracking**: increments if UNKNOWN+low quality; resets if dominated intent found

**Engagement scoring deltas** (`response-orchestrator.js:665`):
- High detail input: +8; Medium: +4; 1-word non-positive: −3
- High urgency: +10; Low urgency: −3
- Strong intent: +5
- Positive response: +8; Negative: −10; Objection intent: −8
- User type direct: +5; exploratory: +2; skeptical: −5; confused: −2

### Step 3 — `_step3_evaluateState(input, ir)`

Builds an `ev` (evaluation) object — a flat set of boolean flags read by Steps 4 and 5:

| Flag | Condition |
|---|---|
| `fastTrack` | `engagementScore > 65` OR `urgency === 'high'` |
| `isInterruption` | Set in Step 1 |
| `isObjection` | Intent is OBJECTION OR `objections.isObjection(input)`, AND not a service intent |
| `isPositive` | `intent.isPositive(input)` |
| `isNegative` | `intent.isNegative(input)` |
| `hasService` | Intent is in `SERVICE_INTENTS` set |
| `hasIntent` | Intent is not UNKNOWN AND strength is not weak |
| `isGeneral` | Intent is `GENERAL_INQUIRY` |
| `isLow` | Intent is `LOW_INTENT` |
| `hasLead` | Lead completeness ≥ 50% |
| `hasName` | Lead has name field |
| `hasReason` | Lead has reason_for_visit |
| `inFlow` | `sm.isInFlow()` |
| `isFlowMismatch` | In flow AND service intent detected AND intent ≠ current flow's intent |
| `needsCTA` | `_shouldInjectCTA()` returns true |

**`_shouldInjectCTA()`** (`response-orchestrator.js:394`): Fires if any of: user is skeptical/confused; unclear streak ≥ 2; `_turnsSinceGoalProgress ≥ 3`; minimum lead data captured but stalled for 2+ turns. Cooldown: minimum 2 turns between CTAs.

### Step 4 — `_step4_chooseGoal(ev)`

Returns a goal string. Priority order:

1. **CTA confirmation check**: if `_ctaShown` is true, positive response → `capture_lead`, negative → `exit`, anything else → clears flag
2. **Lateral pivot**: `ev.isFlowMismatch` → `reroute`
3. **Objection override**: `ev.isObjection` → `handle_objection`
4. **CTA injection**: `ev.needsCTA` → `inject_cta`
5. **State-specific logic** (switch on `ev.state`): See table below
6. **Default** (FLOW_SERVICE_* states): `ev.inFlow` → `explore_context` or `capture_lead`; `identify_problem` otherwise

**State → Goal mapping (key paths)**:

| State | Conditions | Goal |
|---|---|---|
| DISCOVERY | `hasService` or `isGeneral` | `position_solution` |
| DISCOVERY | `isNegative` | `exit` |
| DISCOVERY | `unclearStreak ≥ 2` | `clarify` |
| DISCOVERY | default | `identify_problem` |
| FLOW_GENERAL | flow complete + `isPositive` | `close` |
| FLOW_GENERAL | `fastTrack + flowStep ≥ 4 + hasName\|hasReason` | `close` |
| FLOW_GENERAL | default | `explore_context` |
| LEAD_CAPTURE | `hasLead` | `close` |
| LEAD_CAPTURE | default | `capture_lead` |
| CLOSING | `isPositive + !hasLead` | `capture_lead` |
| CLOSING | `isPositive + hasLead` | `close` |
| CLOSING | `isNegative` | `exit` |
| OBJECTION | `isPositive` | `resume` or `explore_context` |
| FALLBACK | `hasService` or `isGeneral` | `position_solution` |

### Step 5 — `_step5_selectAction(goal, ev, ir)`

Maps goal string → action object `{ type: ACT.*, ... }`. Pure mapping, no side effects.

| Goal | Action |
|---|---|
| `identify_problem` | `ASK` (style: light if isLow) or `FALLBACK` if unclearStreak ≥ 2 |
| `explore_context` | If `INTENT_DETECTED` state → `POSITION` with flow; if `OBJECTION` state → `RESUME` or `ASK` |
| `position_solution` | `POSITION` with flow from `flows.intentToFlow(ir.intent)` |
| `capture_lead` | `CAPTURE` |
| `close` | `CLOSE` |
| `handle_objection` | `OBJECTION` |
| `reroute` | `REROUTE` with `newIntent` |
| `resume` | `RESUME` |
| `exit` | `EXIT` |
| `clarify` | `FALLBACK` |
| `inject_cta` | `CTA` |
| `ended` | `ENDED` |

### Step 6 — `_step6_generateResponse(act, ir, input, onToken)`

**LLM hook** (`response-orchestrator.js:906`): If `llm.isEnabled` AND action is not EXIT/ENDED/CLOSE:
- Calls `llm.generate(input, history, onToken)`
- If non-null response returned → return it (skipping rule-based engine entirely)
- If null (unavailable or timeout) → fall through to rule-based

**Rule-based engine** (switch on `act.type`):

| Action | State transition | Response source |
|---|---|---|
| `EXIT` | → ENDED | `closing.getExit()` + partial webhook dispatch |
| `OBJECTION` | → OBJECTION (or ENDED if shouldExit) | `objections.handle(input).response` |
| `CLOSE` | → BOOKING_CONFIRMATION or CLOSING | Calendar flow if `primary_goal=book_appointment && calendar_enabled`; else `closing.getClose(level)` |
| `BOOKING_CONFIRM` | → ENDED | Hardcoded confirmation string + final webhook |
| `CAPTURE` | → LEAD_CAPTURE | `leads.getNextCapture()` prompt; if complete → close |
| `POSITION` | → service flow state | `flows.getStep(flow, 0).prompt`; optionally prefixed with KB insight |
| `RESUME` | (no transition) | Next flow step prompt with redirect phrase |
| `REROUTE` | → new flow state | `"Absolutely — let's talk about that instead. {step.prompt}"` |
| `CTA` | (no transition) | `_getCTA()` with acknowledge phrase; sets `_ctaShown = true` |
| `ASK` | (no transition) | Next flow step if in flow; else `discovery.getNextQuestion()` |
| `FALLBACK` | → FALLBACK if `shouldEscalate` | `fallback.getResponse()` |

**Post-pipeline actions** (`response-orchestrator.js:311`):
- `_trackGoalProgress()` — resets or increments `_turnsSinceGoalProgress`
- Partial webhook dispatch if `leads.hasMinimumData()` and not yet sent
- Adds response to memory (`sm.addToMemory()`)
- Fires audit log (`conversationLogger.log()`)

---

## 8. NLP Layer

**File**: `js/nlp/nlp-core.js` — `NLPEngine.analyze(input, contextMemory)`

`NLPEngine` is the orchestrator for 8 sub-modules. It calls them in sequence and assembles the NLP snapshot returned to Step 1.

### 8.1 `nlp-preprocess.js` — `preprocess(input)`

Tokenizes and cleans raw input. Returns `{ tokens: string[], cleanedText: string }`. Lowercases, removes punctuation noise, splits on whitespace.

### 8.2 `nlp-semantic.js` — `normalizeSemantics(cleanedText)`

Synonym expansion. Maps colloquial terms to canonical medical vocabulary. Example: `"wanna"` → `"want to"`, `"doc"` → `"doctor"`. Returns expanded text passed downstream.

### 8.3 `nlp-extractor.js` — `extractSignals(cleanedText, normalizedText)`

Extracts structured clinical entities:
- `medical_practice` — clinic/specialty references
- `care_goal` — what the patient wants to achieve
- `problem` — symptom or condition description
- `urgency` — urgency level with `.type` and `.value`
- `care_outcome` — expected outcome phrases
- `patient_history` — prior visit/history references

Each entity is returned as `{ value: string }` or null.

### 8.4 `nlp-intent.js` — `detectIntent(tokens, normalizedText, ext)`

Returns:
```js
{
  primaryIntent: string,
  secondaryIntent: string | null,
  // also acts as multiIntents array for Step 5 processing
}
```
Each element in the array has `{ intent, confidence, type, position }` where `type` is one of: `primary`, `dependent`, `override`, `modifier`.

The `type` field drives Step 5 multi-intent resolution:
- `primary` — execute this turn
- `dependent` — depends on primary resolving first; deferred
- `override` — replaces the primary intent; cancels deferred stack
- `modifier` — modifies confidence, does not replace intent

### 8.5 `nlp-user-model.js` — `evaluateUser(tokens, normalizedText)`

Returns a `userType` string: `direct`, `exploratory`, `skeptical`, or `confused`.

- **direct** — short, decisive language
- **exploratory** — tentative phrasing ("maybe", "just checking")
- **skeptical** — doubt language ("not sure", "seems", "I don't know")
- **confused** — contradiction signals, repeated questions

Used by orchestrator for engagement scoring and tone selection.

### 8.6 `nlp-confidence.js` — `scoreConfidence(ext, intentData, contextMemory)`

Returns a `confidence` object with per-field scores:
```js
{
  intent: 0–1,
  problem: 0–1,
  care_goal: 0–1,
  medical_practice: 0–1,
  overall: 0–1,
  lowConfidence: bool
}
```

Scores are contextual — if prior turns established strong context, confidence for matching signals is boosted.

### 8.7 `nlp-temporal.js` — `NLPTemporal.process(turnData, contextMemory)`

Multi-turn intent stabilization. Maintains `stableIntent` across turns. If intent flips back and forth (contradiction), sets `contradiction: true`. If user just pivoted, sets `pivotAcknowledgment: true` for conversational smoothing. Returns:
```js
{ stableIntent, confidenceTrend, contradiction, pivotAcknowledgment, userProfile }
```

### 8.8 `nlp-behavior.js` — `BehaviorEngine.getStrategy(userProfile)`

Maps `userProfile` (from temporal) to a response strategy:
```js
{
  approach: 'direct' | 'educational' | 'reassuring' | 'empathetic',
  verbosity: 'concise' | 'detailed',
  questionStyle: 'open' | 'closed'
}
```

This is passed back in the NLP snapshot but is not yet heavily consumed by the orchestrator (used implicitly via Personality module tone decisions).

### NLP Snapshot (full return shape)

```js
{
  intent,               // primary intent string
  secondaryIntent,      // secondary or null
  stableIntent,         // stabilized over turns
  confidenceTrend,      // 0–1 trend
  contradiction,        // bool
  pivotAcknowledgment,  // bool
  userProfile,          // from temporal
  strategy,             // from behavior engine
  intentStrength,       // 'high' | 'moderate' | 'weak'
  medical_practice,     // { value } or null
  care_goal,            // { value } or null
  problem,              // { value } or null
  urgency,              // { type, value } or null
  care_outcome,         // { value } or null
  patient_history,      // { value } or null
  userType,             // 'direct' | 'exploratory' | 'skeptical' | 'confused'
  multiIntents,         // array of { intent, confidence, type, position }
  confidence,           // { intent, problem, care_goal, medical_practice, overall, lowConfidence }
  quality,              // { chars, words, detail: 'high'|'medium'|'low' }
}
```

---

## 9. Intent Detector

**File**: `js/modules/intent-detector.js` — class `IntentDetector`

Separate from NLP layer. Uses pure keyword/phrase scoring rather than semantic NLP. Used in two ways:
1. Step 1 — `detect(input)` → intent classification for service routing
2. Steps 3–4 — `isPositive(input)`, `isNegative(input)` → boolean checks

### Intent Categories

**Generic intents** (engine-level, always present):
- `GENERAL_INQUIRY` — "what services", "how can you help", "need a doctor"
- `LOW_INTENT` — "just looking", "just curious", "not sure yet"
- `OBJECTION` — "too expensive", "can't afford", "not ready", "do you take insurance"
- `POSITIVE` — "yes", "absolutely", "sounds good", "let's do it"
- `NEGATIVE` — "no", "nope", "not interested", "maybe later"

**Service intents** — dynamically built from `config.services`. Each service provides:
- `intent_key` (e.g., `GENERAL_CONSULT`, `DENTAL`, `URGENT_CARE`)
- `keywords[]` — individual words
- `phrases[]` — multi-word exact matches (worth 0.4 each)

### Scoring (`_scoreIntent`)

```
phrase match → +0.4 per phrase
keyword match:
  - length ≤ 3 chars: regex word boundary required
  - length > 3 chars: substring match
  → +0.15 per keyword
```

Final confidence = `min(1.0, score × weight)`. Intents sorted by weighted score. Ties broken by order.

Strength classification:
- `confidence > 0.3` → `strong`
- `confidence > 0.15` → `moderate`
- `< 0.15` → `weak`

**`isPositive(input)`** / **`isNegative(input)`**: Call `detect()` and check if result intent matches. These are used directly in Step 3 flags (`ev.isPositive`, `ev.isNegative`).

---

## 10. State Machine

**File**: `js/state-machine.js` — class `ConversationStateMachine`

### States

```js
STATES = {
  IDLE, GREETING, DISCOVERY, INTENT_DETECTED, FLOW_GENERAL,
  LEAD_CAPTURE, BOOKING_CONFIRMATION, CLOSING, OBJECTION, FALLBACK, ENDED
}
```

Plus **dynamically registered** `FLOW_SERVICE_{INTENT_KEY}` states — one per service in config.

### Dynamic State Registration (`initFromConfig`)

Called by the constructor when a config is passed. For each service with `intent_key`:
1. Creates `FLOW_SERVICE_{KEY}` string constant on the `STATES` object
2. Adds it to `FLOW_STATES` set (so `isInFlow()` recognizes it)
3. Adds it to `TRANSITIONS[INTENT_DETECTED]` (can enter from intent gate)
4. Adds it to `TRANSITIONS[FLOW_GENERAL]` (can enter from general flow)
5. Adds it to `TRANSITIONS[OBJECTION]` (can resume from objection)
6. Creates its own transition list: can go to LEAD_CAPTURE, OBJECTION, DISCOVERY, CLOSING, FALLBACK, itself, or any other service flow (lateral switching)

### Valid Transitions (core states)

```
IDLE              → GREETING
GREETING          → DISCOVERY | INTENT_DETECTED | FALLBACK
DISCOVERY         → INTENT_DETECTED | FALLBACK | DISCOVERY | ENDED | LEAD_CAPTURE
INTENT_DETECTED   → FLOW_GENERAL | DISCOVERY | LEAD_CAPTURE | [FLOW_SERVICE_*]
FLOW_GENERAL      → LEAD_CAPTURE | OBJECTION | DISCOVERY | CLOSING | FALLBACK | FLOW_GENERAL | [FLOW_SERVICE_*]
LEAD_CAPTURE      → CLOSING | LEAD_CAPTURE | OBJECTION | FALLBACK | BOOKING_CONFIRMATION
BOOKING_CONFIRM   → ENDED | CLOSING | FALLBACK
CLOSING           → ENDED | OBJECTION | LEAD_CAPTURE | FALLBACK | BOOKING_CONFIRMATION
OBJECTION         → DISCOVERY | CLOSING | ENDED | FALLBACK | [FLOW_SERVICE_*]
FALLBACK          → DISCOVERY | GREETING | ENDED | FALLBACK
ENDED             → IDLE
```

### Context Object (shape after `reset()`)

```js
{
  state, intent, intentStrength, urgency_level, engagementScore,
  conversationGoal,
  contextMemory: [],          // {role, text, turn, timestamp}[]
  leadData: {
    name, patient_type, dob, reason_for_visit,
    insurance_provider, insurance_id, urgency, contactMethod,
    medical_practice, care_goal, problem, patient_history,
    appointment_time, appointment_iso
  },
  confirmations: [...],
  exit: [...],
  emergency_keywords: [...],
  leadPrompts: { patient_type, dob, reason_for_visit, insurance_provider, urgency },
  history: [],                // {from, to, turn, timestamp, data}[]
  flowStep: 0,
  discoveryDepth: 0,
  fallbackCount: 0,
  turnCount: 0,
  previousState: null,
  activeFlow: null,
  depthLevel: 1,              // set by orchestrator._updateDepthLevel()
  userType: null              // set by orchestrator
}
```

### Key Methods

| Method | What it does |
|---|---|
| `transition(newState, data)` | Validates transition, updates state, increments turnCount, records history, notifies listeners |
| `canTransition(newState)` | Returns bool — checks TRANSITIONS map |
| `updateContext(updates)` | Merge updates into context; `leadData` key merges nested |
| `updateLeadData(data)` | Shallow merge into `context.leadData` |
| `addToMemory(entry)` | Push `{role, text, turn, timestamp}` to contextMemory |
| `adjustEngagement(delta)` | Clamp score to [0, 100] |
| `isInFlow()` | Checks `FLOW_STATES.has(state)` |
| `advanceFlowStep()` | `flowStep++` |
| `resetFlowStep()` | `flowStep = 0` |
| `deferIntent(obj)` | Push to deferred stack (max 3); drops oldest on overflow |
| `popDeferredIntent()` | Pop from stack; adds to `_resolvedIntents` set |
| `isCurrentFlowStable()` | True if not in LEAD_CAPTURE, OBJECTION, or FLOW_GENERAL |
| `getNextLeadField()` | Returns first null field in order: name → patient_type → reason_for_visit → dob → insurance_provider |
| `getLeadCompleteness()` | Scored 0–100: name +25, patient_type +15, reason +25, dob +15, insurance +10, urgency +10 |
| `onStateChange(cb)` | Subscribe to all transitions; `cb(oldState, newState, context)` |

---

## 11. Conversation Flow Modules

### 11.1 ConversationFlows (`js/modules/conversation-flows.js`)

Manages multi-step flows built from config. At construction:
1. For each service in config: builds `_flows['FLOW_SERVICE_{KEY}']` from `svc.flow_steps` if present, else falls back to `svc.discovery_questions` (mapped to generic step format)
2. Builds `_intentToFlowMap[intent_key] → flow state name`
3. Builds `FLOW_GENERAL` from `config.general_flow_steps` if present, else 1-step fallback

**`getStep(flowName, stepIndex)`**: Returns `{ prompt, stepId, expect, isLastStep, totalSteps, currentStep }` or `null` if flow complete.

**`intentToFlow(intent)`**: Maps e.g. `'DENTAL'` → `'FLOW_SERVICE_DENTAL'`.

**`hasFlow(name)`** / **`getStepCount(name)`** / **`getFlowName(name)`**: Utility accessors.

### 11.2 DiscoveryEngine (`js/modules/discovery-engine.js`)

Used when no active flow exists and the goal is `identify_problem`. Returns contextual open-ended questions. Takes `depthLevel` (1–5) and `MemorySynthesis` reference to avoid re-asking known data.

**`reset()`** called by `orchestrator.reset()`.

### 11.3 LeadCapture (`js/modules/lead-capture.js`)

Manages structured data collection field by field.

**`capture(field, value)`**: Stores a value for a field.  
**`getNextCapture()`**: Returns `{ field, prompt }` for the next uncaptured field in `config.qualification_fields` order, or `null` if all captured.  
**`hasMinimumData()`**: True if name is captured (triggers partial webhook).  
**`getData()`**: Returns all captured fields.  
**`getCompleteness()`**: 0–100 score matching state machine's lead completeness logic.  
**`hasField(name)`**: True if field has non-null value.  
**`reset()`**: Clears all captured data.

Lead prompts come from `config.leadPrompts` or the fallback defined in state machine context (e.g., "What's the main thing you're looking to address today?").

### 11.4 ClosingEngine (`js/modules/closing-engine.js`)

**`getClose(level)`**: Returns closing response based on engagement level. `'high'` → direct close; `'medium'` → soft close; `'low'` → gentle close with CTA.  
**`getExit()`**: Exit phrase from `config.closing_responses.exit`.

### 11.5 ObjectionHandler (`js/modules/objection-handler.js`)

**`isObjection(input)`**: Pattern-based check (price, timing, doubt phrases).  
**`handle(input)`**: Returns `{ response, shouldExit }`. Provides rebuttals for common objections. `shouldExit: true` triggers immediate transition to ENDED.

### 11.6 FallbackRecovery (`js/modules/fallback-recovery.js`)

**`getResponse()`**: Returns `{ response, shouldEscalate }`. After N consecutive failures (tracked via `sm.incrementFallbackCount()`), `shouldEscalate` becomes true triggering FALLBACK state.  
**`getInterruptResponse()`**: Returns a brief pause response for `__INTERRUPT__` signals.  
**`reset()`**: Resets escalation counter.

---

## 12. Personality, Response Builder, Memory Synthesis

### 12.1 Personality (`js/modules/personality.js`)

Controls conversational tone and provides phrase building blocks.

**`TONE_STATES`**: `DEFAULT`, `URGENT`, `EMPATHETIC`, `FORMAL`

**`updateTone(trigger, reason)`**: Called by orchestrator after Step 2 with detected tone trigger:
- `URGENT` — input contains: `emergency`, `broken`, `urgent`, `leaking`, `crisis`, `asap`, `now`
- `EMPATHETIC` — unclear streak > 0, OR frustration_strikes > 0, OR input contains confused/stuck/help keywords

**`getGreeting()`**: Returns random greeting from `config.greetings`.

**`getPhrase(type)`**: Returns a phrase for types: `bridge`, `acknowledge`, `redirect`, `softClose`.

**`compose(text, opts)`**: Wraps text with optional acknowledgment prefix. Returns `"${ack} ${text}"`.

**`getToneState()`**: Returns current active tone.

### 12.2 ResponseBuilder (`js/modules/response-builder.js`)

Used in `_buildInsightResponse()` — the fallback assembly when no specific template applies.

**`build({ insight, outcome, leadData, depthLevel, questionType, intentStrength, userType, forceShort })`**: Combines KB insight with an appropriate follow-up question. `questionType` is one of: `CLARIFY`, `DIAGNOSE`, `CONFIRM`, `CLOSE`. Returns a full response string.

### 12.3 MemorySynthesis (`js/modules/memory-synthesis.js`)

Maintains an in-memory entity store with confidence scores and source turns.

**`storeEntity(field, value, confidence, turn, source)`**: Stores or updates an entity. Higher confidence replaces lower.  
**`getEntity(field)`**: Returns stored entity or null.  
**`updateUserState(ir)`**: Updates behavioral signals (frustration_strikes, confusion_count, etc.) from NLP snapshot.  
**`getSnapshot()`**: Returns full memory snapshot including `user_state`.  
**`reset()`**: Clears all stored entities and user state.

---

## 13. Knowledge Engine

**File**: `js/knowledge/knowledge-engine.js` — class `KnowledgeEngine`

Config-driven FAQ and insight layer.

**`analyze(ir, ctx, input, depthLevel)`**: Checks `config.knowledge_base` for matching entries. Returns:
```js
{
  insight: string,       // enrichment text to prepend to response
  outcome: string,       // expected resolution
  confidence: 0–1,       // confidence of KB match
  recommendedIntent: string  // if KB is more confident than NLP
}
```

**`fallbackInsight`**: A default "I can help with that" string used when no KB match. ResponseBuilder and orchestrator check `ir.insight !== kb.fallbackInsight` before prepending.

The KB is purely `config.knowledge_base` — a map of topics to `{ insight, outcome }` entries. It is not trained; it is explicitly authored in the client config.

---

## 14. LLM Layer

### 14.1 LLMAdapter (`js/services/llm-adapter.js`)

Singleton: `export const llmAdapter = new LLMAdapter()`.

**`isEnabled` getter**: Lazy-initializes provider based on `config.ai_tier`:
- Tier 1 → no provider, returns false
- Tier 2 → `ProxyProvider` (calls `/api/llm/chat`)
- Tier 3 → `LocalModelProvider` (client-side model)

**`generate(userInput, memory, onToken)`**: Calls `_provider.generate()`. Returns response string or `null`.

### 14.2 ProxyProvider (`js/services/llm-adapter.js`)

Browser-side proxy client. Never calls Ollama directly.

**`checkAvailability()`**: `GET /api/llm/health` with 3s timeout. Cached in `_available` (checked once per page load).

**`generate(userMessage, history, onToken)`**: `POST /api/llm/chat` with `{ userInput, memory, model, stream }`.
- If `onToken` is provided → `stream: true`, reads SSE `data: {token}` events, calls `onToken(token)` per event
- If `onToken` is null → `stream: false`, reads single `{ response: string }` JSON

Timeout: 32s via `AbortController`.

### 14.3 LLM Proxy (`server/routes/llm-proxy.js`)

**`POST /api/llm/chat`**: Receives `{ userInput, memory, model, stream }` from browser. Builds message array:
```
[system: MEDICAL_SYSTEM_PROMPT, ...memory, user: userInput]
```
Forwards to `OLLAMA_ENDPOINT/api/chat` (from `process.env.OLLAMA_ENDPOINT`, defaults to `localhost:11434`).

**Streaming mode** (`stream: true`): Reads Ollama's NDJSON stream, buffers tokens until punctuation mark (`[.!?;:\n]`), then SSE-flushes the buffer as `data: {token: "..."}`. Ends with `data: [DONE]`.

**Non-streaming mode**: Accumulates full response, returns `{ response: text }`.

Timeout: 30s. Hard errors return 502 or 504.

**`GET /api/llm/health`**: Calls `OLLAMA_ENDPOINT/api/tags` with 3s timeout. Returns `{ available: bool }`.

**`MEDICAL_SYSTEM_PROMPT`** (hardcoded at Pass 8 — P1-1 gap):
- Establishes AI receptionist role
- Hard rules: no diagnoses, `EMERGENCY_DETECTED` prefix on emergency keywords, disclose AI, collect only booking data, 3-sentence max
- P1-1 item: replace with `config.llm_system_prompt` per-client

### 14.4 Streaming TTS Path

```
Ollama NDJSON token
  → llm-proxy.js buffers at punctuation
  → SSE event "data: {token}"
  → ProxyProvider.generate() reads SSE
  → onToken(chunk) fires
  → app.js onToken sets streamedSpeech = true
  → speechIO.speakChunk(chunk) queues utterance
  → speak() not called (streamedSpeech flag prevents double-speaking)
```

---

## 15. Services Layer

### 15.1 WebhookDispatcher (`js/services/webhook-dispatcher.js`)

Singleton: `export const webhookDispatcher`.

**`dispatch(eventType, payload)`**: Sends authenticated webhook to `config.webhook_url`.
- Adds `event_type`, `timestamp`, `idempotency_key` (UUID) to payload
- Signs payload with HMAC-SHA256 using `config.webhook_secret`
- Adds `X-Webhook-Signature: sha256=...` header
- On network failure → saves to `OutboxDB` for retry

**HMAC generation**: `crypto.subtle.importKey()` + `crypto.subtle.sign()` using HMAC-SHA256. Base64-encoded.

**Delivery guarantee**: Uses `OutboxDB` (IndexedDB) as offline outbox. ServiceWorker (`sw.js`) drains the outbox when connectivity resumes.

Events dispatched by orchestrator:
- `LEAD_PARTIAL` — when `leads.hasMinimumData()` first becomes true (name captured)
- `LEAD_FINAL` — on CLOSE, EXIT, or BOOKING_CONFIRMATION (each fires once, guarded by `_webhookSentFinal` flag)

### 15.2 OutboxDB (`js/services/outbox-db.js`)

IndexedDB wrapper for offline message queue. Stores failed webhook payloads keyed by idempotency key. `sw.js` reads and retries on `sync` event (Background Sync API).

### 15.3 ConversationLogger (`js/services/conversation-logger.js`)

Singleton: `export const conversationLogger`.

**`log({ turn, role, text, state, intent })`**: Fire-and-forget `POST /api/log/conversation`. Failures are silent (`.catch(() => {})`). Text is truncated to 500 chars.

**Session ID**: `sess_${Date.now()}_${Math.random().toString(36).slice(2,8)}` — assigned once per page load.

**SEC-11**: The backend (`server/routes/log.js`) writes to stdout as structured JSON. This is NOT HIPAA-compliant. Must be replaced with encrypted, access-controlled persistent store before production use with real patient data.

---

## 16. Express Backend

**File**: `server/index.js`

```
Express app on PORT (default 3001)
Middleware: express.json(), express.urlencoded(), CORS (ALLOWED_ORIGINS env var)

Routes:
  /api          → config.js
  /api/calendar → calendar.js
  /api/voice    → voice.js
  /api/llm      → llm-proxy.js
  /api/log      → log.js
  /             → health.js
```

### `server/routes/config.js`

**`GET /api/config?client={id}`**:
1. Reads `configs/{id}.json` from disk
2. Strips `ollama_endpoint` from response (SSYNC-03)
3. Injects `webhook_url` and `webhook_secret` from `process.env["{CLIENT}_WEBHOOK_URL"]`
4. Returns merged config object

### `server/routes/calendar.js`

**`POST /api/calendar/check`**: Google Calendar freebusy query. Reads `GOOGLE_CALENDAR_*` env vars. Returns `{ available: bool }`.

**`POST /api/calendar/book`**: Google Calendar events.insert. Creates a 30-minute event. Returns `{ success: bool, eventId }`.

Triggered from `app.js`:
- `_checkCalendarAvailability()` — fired when state machine enters BOOKING_CONFIRMATION
- `_handleBookingConfirmation()` — fired when state machine transitions from BOOKING_CONFIRMATION → ENDED

### `server/routes/voice.js`

Twilio ConversationRelay webhook. Receives `POST /api/voice/webhook` with TwiML. Returns XML with `<Connect><ConversationRelay>` instructions. **Status**: SCAFFOLDED — not end-to-end tested.

### `server/routes/health.js`

**`GET /health`**: Returns `{ status: 'ok', timestamp }`.

### `server/routes/log.js`

**`POST /api/log/conversation`**: Validates `{ sessionId, clientId, turn, role, state, intent, text }`. Truncates text to 500 chars. Writes to `stdout` as `[AuditLog] {JSON}`.

---

## 17. Emergency Detector — Hard Safety Guardrail

**File**: `js/modules/emergency-detector.js` — exported singleton `emergencyDetector`

**`scan(input)`**: Returns `{ detected: bool, response: string, voiceResponse: string }`.

Checks input against `config.emergency_keywords` (exact substring match, case-insensitive). If matched:
- `detected: true`
- `response`: `config.emergency_response` (e.g. "🚨 This sounds like a medical emergency. Please call 911 immediately...")
- `voiceResponse`: voice-safe version without emojis

**Architectural rule** (from T02): Emergency detection must NEVER use the LLM. It is deterministic keyword matching only. This guarantees sub-millisecond response time and eliminates any possibility of LLM hallucination on life-safety paths.

Called in `processInput()` at line 141 — before emergency detector, before routing, before any of the 6 steps. It is the absolute first check.

---

## 18. Full Turn Data Flow

This traces a single user input from DOM event to spoken response.

### Input: "I need to book a dental appointment"

```
1. User types in text input → clicks Send button
   app.js: _handleSend()
     → speechIO.unlockAudio()    (synchronous — satisfies Chrome gesture requirement)
     → _processUserInput("I need to book a dental appointment")

2. _processUserInput()
   → currentInputId++  (stale protection — later inputs cancel pending ones)
   → Interrupt merge check (none pending)
   → speechIO.cancelSpeech() if speaking
   → _addMessage('user', input)
   → setTimeout 120ms → show thinking orb
   → Complexity calculation: wordCount=8, nlpData → intentStrength 'strong' → intent_complexity=2
   → Delay: 200 + (2×300) + (8×10) = 880ms (clamped to 1200ms max → 880ms)
   → await delay (cancellable)
   → streamedSpeech = false
   → onToken callback = fn { speechIO.speakChunk(chunk); streamedSpeech=true }

3. await orchestrator.processInput(input, onToken)

4. Inside processInput():

   4a. emergencyDetector.scan(input)
       → no emergency keywords matched → continue

   4b. State is GREETING → transition(DISCOVERY)

   4c. ConversationRouter.route(input, null, 0)
       → hasDomainSignal: "dental" matches service_domain_tokens → true
       → wordCount=8 ≥ 3 → Priority 1: CORE → { type: 'CORE' }
       → _unclear = 0

   4d. STEP 1: _step1_detectIntent("I need to book a dental appointment")
       nlp.analyze():
         preprocess → tokens=['i','need','to','book','a','dental','appointment']
         normalizeSemantics → expanded text
         extractSignals → care_goal detected (booking), urgency medium
         detectIntent → primaryIntent='DENTAL', confidence~0.6
         evaluateUser → 'direct'
         scoreConfidence → { intent:0.6, overall:0.65 }
         NLPTemporal → stableIntent='DENTAL'
       intent.detect():
         'dental' keyword → DENTAL intent, confidence 0.15+weight → 'moderate'
         'appointment' → GENERAL_INQUIRY score also bumped
         DENTAL wins
       Merge: SERVICE_INTENTS.has('DENTAL') = true → nlpData.intent = 'DENTAL'
       No interruption (no prior flow active)
       kb.analyze() → KB insight for DENTAL or fallback
       Returns NLP snapshot with intent='DENTAL'

   4e. STEP 2: _step2_updateContext()
       care_goal extracted → leads.capture('care_goal', 'booking')
       No name in input
       sm.updateContext({ intent: 'DENTAL', intentStrength: 'moderate' })
       engagement: +4 (medium detail) + 5 (strong intent) = +9 → score=59
       _unclear = 0

   4f. Tone evaluation:
       No urgent keywords → no EMPATHETIC trigger
       personality.updateTone(null, 'none') → DEFAULT tone

   4g. STEP 3: _step3_evaluateState()
       state: DISCOVERY
       hasService: true (DENTAL is in SERVICE_INTENTS)
       isPositive: false
       isNegative: false
       inFlow: false
       isFlowMismatch: false
       needsCTA: false (turnCount=1, _turnsSinceGoalProgress=0)

   4h. STEP 4: _step4_chooseGoal(ev)
       _ctaShown = false → skip
       ev.isFlowMismatch = false → skip
       ev.isObjection = false → skip
       ev.needsCTA = false → skip
       switch(DISCOVERY):
         ev.hasService = true → return 'position_solution'

   4i. STEP 5: _step5_selectAction('position_solution', ev, ir)
       → { type: ACT.POSITION, flow: flows.intentToFlow('DENTAL') }
       → flow = 'FLOW_SERVICE_DENTAL'

   4j. STEP 6: _step6_generateResponse(ACT.POSITION, ...)
       llm.isEnabled? config.ai_tier=2 → yes
         llm.generate("I need to book...", history, onToken)
         → ProxyProvider.checkAvailability() → GET /api/llm/health
         → if Ollama unavailable → returns null → falls through to rule-based
         → if Ollama available → POST /api/llm/chat with stream=true
           → SSE stream: each punctuation-buffered chunk → onToken(chunk)
           → streamedSpeech = true in app.js
           → speechIO.speakChunk(chunk) → utterance queued in synthesis
           → returns full text when stream ends

       [Rule-based path if LLM unavailable]:
         ACT.POSITION with flow='FLOW_SERVICE_DENTAL'
         _transToFlow('FLOW_SERVICE_DENTAL')
           → canTransition? DISCOVERY → FLOW_SERVICE_DENTAL (via INTENT_DETECTED bridge)
           → transition(INTENT_DETECTED) then transition(FLOW_SERVICE_DENTAL)
         sm.resetFlowStep() → flowStep=0
         flows.getStep('FLOW_SERVICE_DENTAL', 0)
           → { prompt: "Are you experiencing any tooth pain or sensitivity?", ... }
         sm.advanceFlowStep() → flowStep=1
         No KB insight to prepend
         returns "Are you experiencing any tooth pain or sensitivity?"

   4k. Post-pipeline:
       _trackGoalProgress('position_solution', ev) → _turnsSinceGoalProgress=0
       leads.hasMinimumData()? no (name not captured yet)
       sm.addToMemory({ role:'assistant', text: response })
       conversationLogger.log({ turn:1, role:'user', ... })
       conversationLogger.log({ turn:1, role:'assistant', ... })

5. Back in _processUserInput():
   response = "Are you experiencing any tooth pain or sensitivity?"
   _clearThinking()
   _addMessage('assistant', response)
   if (!streamedSpeech) speechIO.speak(response)   ← only if LLM didn't stream
   _setOrbState('idle')
```

---

## 19. Config JSON Schema Reference

Derived from `configs/medical-clinic.json` and `getEmergencyFallback()` in `loader.js`.

```jsonc
{
  // Identity
  "company_name":    "MedVoice Clinic",     // Required. Used in all UI and router responses.
  "assistant_name":  "Aria",                // Used in greeting and personality.
  "role":            "AI medical receptionist", // Injected into sidebar about text.
  "tone":            "warm, calm, professional", // Personality module initial tone.

  // Goals
  "primary_goal":    "book_appointment",    // 'book_appointment' → calendar close flow
                                            // 'capture_lead' → generic lead capture
  "secondary_goals": ["collect_patient_info", "answer_faq"],

  // Services (REQUIRED for intent routing)
  "services": [
    {
      "intent_key":     "DENTAL",           // Becomes STATES.FLOW_SERVICE_DENTAL
      "display_name":   "Dental Care",      // Used in service_summary and flow name
      "keywords":       ["dental", "teeth", "tooth"], // +0.15 per match
      "phrases":        ["tooth pain", "root canal"], // +0.40 per match
      "discovery_questions": [              // Used as flow steps if flow_steps absent
        "Are you experiencing tooth pain?",
        "Is this routine or specific issue?"
      ],
      "flow_steps": [                       // Preferred over discovery_questions
        { "id": "s1", "prompt": "...", "expect": "user_response" }
      ]
    }
  ],

  // Response pools (config-driven, all support {{company_name}} and {{service_summary}})
  "greetings":                 ["Hi! I'm {{assistant_name}}..."],
  "greeting_responses":        [...],       // For GREETING route
  "noise_responses":           [...],       // For NOISE route (unclearStreak < 2)
  "noise_escalated_responses": [...],       // For NOISE route (unclearStreak ≥ 2)
  "meta_responses":            [...],       // For META route
  "out_of_scope_responses":    [...],       // For OUT_OF_SCOPE route
  "meta_phrases":              [...],       // Extends router's meta detection patterns
  "cta_templates":             [...],       // Round-robin CTA injection (conversion anchor)

  // NLP / routing
  "service_domain_tokens": ["pain", "doctor", "appointment", ...],
  // ^ Used by ConversationRouter._hasDomainSignal() for CORE classification

  // LLM
  "ai_tier":        2,                      // 1=rule-based, 2=proxy, 3=local
  "llm_model":      "llama3.1:8b",
  "ollama_endpoint": "http://...",          // SERVER-SIDE ONLY — stripped before serving

  // Calendar
  "calendar_id":      "..@group.calendar.google.com",
  "calendar_enabled": false,                // true → CLOSE action uses booking flow
  "calendar_url":     "https://calendly.com/...",

  // Lead capture
  "qualification_fields": ["name", "patient_type", "dob", "reason_for_visit", "insurance_provider"],

  // Safety
  "emergency_keywords":  ["chest pain", "heart attack", ...],
  "emergency_response":  "🚨 Please call 911 immediately...",

  // Knowledge base
  "knowledge_base": {
    "general_consult": { "insight": "...", "outcome": "..." }
  },

  // Closing
  "closing_responses": {
    "soft":          ["Would you like to schedule?"],
    "direct":        ["Let's get you started."],
    "confirmations": ["Great! We will be in touch shortly."],
    "exit":          ["Thanks for chatting!"]
  },

  // Webhooks (injected server-side from env vars, not stored in JSON)
  "webhook_url":    "",
  "webhook_secret": ""
}
```

---

## 20. Component Dependency Graph

```
index.html
└── app.js (App class — root)
    ├── config/loader.js (AppContext — singleton, read by ALL modules)
    │   └── config/validator.js
    ├── state-machine.js (ConversationStateMachine)
    ├── speech-io.js (SpeechIO)
    └── response-orchestrator.js (ResponseOrchestrator)
        ├── [Pre-Pipeline]
        │   ├── modules/emergency-detector.js  ← runs FIRST, before router
        │   ├── router/conversation-router.js  ← CORE/non-CORE gate
        │   └── router/router-handlers.js      ← canned responses for non-CORE
        │
        ├── [Step 1: Intent]
        │   ├── nlp/nlp-core.js (NLPEngine)
        │   │   ├── nlp-preprocess.js
        │   │   ├── nlp-semantic.js
        │   │   ├── nlp-extractor.js
        │   │   ├── nlp-intent.js
        │   │   ├── nlp-user-model.js
        │   │   ├── nlp-confidence.js
        │   │   ├── nlp-temporal.js
        │   │   └── nlp-behavior.js
        │   ├── modules/intent-detector.js     ← keyword overlay on NLP
        │   └── knowledge/knowledge-engine.js  ← KB confidence boost
        │
        ├── [Step 2: Context]
        │   ├── modules/memory-synthesis.js    ← entity store
        │   ├── modules/lead-capture.js        ← field-by-field data
        │   └── nlp/nlp-temporal-extractor.js  ← ISO datetime from text
        │
        ├── [Steps 3–5: Evaluate + Goal + Action]
        │   ├── state-machine.js               ← state + context reads
        │   ├── modules/conversation-flows.js  ← flow step management
        │   ├── modules/objection-handler.js   ← isObjection check
        │   └── modules/personality.js         ← tone influence on goal
        │
        ├── [Step 6: Generate]
        │   ├── services/llm-adapter.js        ← Tier 2/3 LLM
        │   │   └── services/local-model-runner.js (Tier 3)
        │   ├── modules/discovery-engine.js    ← open discovery questions
        │   ├── modules/closing-engine.js      ← close/exit text
        │   ├── modules/objection-handler.js   ← rebuttal text
        │   ├── modules/fallback-recovery.js   ← fallback text
        │   ├── modules/personality.js         ← phrase assembly
        │   ├── modules/response-builder.js    ← KB-enriched response
        │   └── modules/conversation-flows.js  ← flow step prompts
        │
        └── [Post-Pipeline]
            ├── services/webhook-dispatcher.js ← LEAD_PARTIAL / LEAD_FINAL
            │   └── services/outbox-db.js      ← IndexedDB offline queue
            └── services/conversation-logger.js ← audit log → /api/log/conversation

server/index.js (Express)
├── routes/config.js          → GET  /api/config
├── routes/health.js          → GET  /health
├── routes/calendar.js        → POST /api/calendar/check, /api/calendar/book
├── routes/voice.js           → POST /api/voice/webhook (Twilio, SCAFFOLDED)
├── routes/llm-proxy.js       → POST /api/llm/chat, GET /api/llm/health
└── routes/log.js             → POST /api/log/conversation
```

---

## Known Issues & Active Gaps (Pass 8 state)

| ID | Component | Issue | Severity |
|---|---|---|---|
| SEC-11 | `server/routes/log.js` | Audit log writes to stdout only — not HIPAA-compliant | OPEN — blocks first medical client |
| P1-1 | `server/routes/llm-proxy.js` | `MEDICAL_SYSTEM_PROMPT` is hardcoded — not per-client | P1 |
| P1-5 | `js/speech-io.js:speakChunk()` | `_synthesis.speaking` check in `onend` has minor race condition | P1 |
| GAP-08 | All | No HIPAA BAA with any vendor (Twilio, Google, hosting) | Blocks first medical client |

---

*End of document. All facts sourced from files read at Pass 8 (2026-05-02).*
