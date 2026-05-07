# SKILL: Response Orchestrator
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-014"
SKILL_NAME        = "Response Orchestrator — 6-Step Pipeline and Hook Points"
SKILL_CATEGORY    = "core"
SKILL_VERSION     = "1.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-05-01"
SKILL_LAST_USED   = "2026-05-01"
APPLIES_TO_PASS   = "all"
RELEVANT_FILES    = "js/response-orchestrator.js, js/state-machine.js"
```

---

## WHAT THIS SKILL IS FOR

`response-orchestrator.js` is the brain of MedVoice AI. It is the most frequently modified file and the most dangerous to get wrong. A mistake in this file can break conversation flow, bypass security guardrails, or cause silent failures that appear as graceful fallbacks. This skill maps every hook point, every critical path, and every DO NOT rule for this file.

---

## WHEN TO USE THIS SKILL

Use this skill when:
- Modifying any part of `response-orchestrator.js`
- Adding a new conversation state
- Adding a new action type to the ACT enum
- Hooking in a new service (calendar, Twilio, new LLM provider)
- Debugging unexpected conversation behavior
- Writing tests that involve the orchestrator

Do NOT use this skill when working only on config files, lead capture, or UI — those have their own skills.

---

## THE ARCHITECTURE

### The 6-Step Pipeline

Every user input runs through this exact sequence — no shortcuts:

```
processInput(userInput)
    │
    ├── [0] EMERGENCY DETECTOR ← ALWAYS FIRST — never skip
    │       ↓ if detected: return immediately, bypass all steps
    │
    ├── [1] _step1_detectIntent(input)
    │       → NLP analysis + keyword intent detection
    │       → Returns: ir (intent result) with intent, confidence, multiIntents
    │
    ├── [2] _step2_updateContext(input, ir)
    │       → Stores entities (name, DOB, insurance) in state machine
    │       → Updates engagement score
    │       → Adds to conversation memory
    │
    ├── [3] _step3_evaluateState(input, ir)
    │       → Reads current state, flags, engagement level
    │       → Returns: ev object with flags (fastTrack, isObjection, hasLead, etc.)
    │
    ├── [4] _step4_chooseGoal(ev)
    │       → Decision tree based on state + flags
    │       → Returns: goal string (e.g. 'capture_lead', 'booking_confirmation')
    │
    ├── [5] _step5_selectAction(goal, ev, ir)
    │       → Maps goal to action
    │       → Returns: act object with type (ACT.CAPTURE, ACT.CLOSE, etc.)
    │
    └── [6] _step6_generateResponse(act, ir, input, onToken)
            → Routes to correct response generator
            → If LLM enabled: calls llmAdapter first
            → Falls back to template-based responses
            → Returns: response string
```

---

## CRITICAL HOOK POINTS

### Hook Point 1 — Emergency Detector (Lines ~121-135)

The absolute first thing that runs. Never move this.

```javascript
// CORRECT position — before everything
async processInput(userInput, onToken = null) {
  const input = userInput.trim();
  
  // STEP 0: Emergency check — ALWAYS FIRST
  const emergencyResult = this.emergency.scan(input);
  if (emergencyResult.detected) {
    // Return immediately — bypass all pipeline steps
    return emergencyResult.response;
  }
  
  // Only after emergency check — proceed with pipeline
  if (this.sm.getState() === STATES.ENDED) { ... }
```

### Hook Point 2 — LLM Adapter (Lines ~897-920 in _step6_generateResponse)

The LLM intercepts BEFORE the template switch statement. Returns null if unavailable → falls through to templates.

```javascript
async _step6_generateResponse(act, ir, input, onToken) {
  // LLM intercepts first if enabled
  if (this.llm.isEnabled) {
    if (act.type !== ACT.EXIT && act.type !== ACT.ENDED) {
      const llmResponse = await this.llm.generate(input, history, onToken);
      if (llmResponse) return llmResponse;  // LLM wins
    }
  }
  
  // Template fallback — switch on act.type
  switch (act.type) {
    case ACT.CLOSE: { ... }  // ← line ~899
    case ACT.CAPTURE: { ... }
    // etc.
  }
}
```

### Hook Point 3 — ACT.CLOSE (Lines ~899-909)

This is where calendar booking hooks in. Modified in Pass 7.

```javascript
case ACT.CLOSE: {
  // Pass 7 addition: check if booking is required
  if (config.primary_goal === 'book_appointment' && config.calendar_enabled) {
    this._transTo(STATES.BOOKING_CONFIRMATION);
    return "Before I confirm, can I verify: [name], [date], [time] — is that correct?";
  }
  // Original close path
  const cl = this.closing.getClose(level);
  this._transTo(STATES.CLOSING);
  this._dispatchFinalLead('final');
  return cl.response;
}
```

### Hook Point 4 — _step4_chooseGoal switch (Lines ~292-450)

When adding a new state, add its case HERE first. Then add the ACT mapping in _step5, then the response handler in _step6. This order prevents orphaned states.

---

## THE ACT ENUM

Current action types as of Pass 7. Add new types here before implementing:

```javascript
const ACT = {
  ASK:              'ask_question',
  CLARIFY:          'clarify',
  POSITION:         'position_solution',
  CAPTURE:          'capture_data',
  OBJECTION:        'handle_objection',
  CLOSE:            'close',
  CLOSE_TRANSITION: 'close_transition',
  BOOKING_CONFIRM:  'booking_confirm',    // Added Pass 7
  FALLBACK:         'fallback',
  REROUTE:          'reroute',
  RESUME:           'resume_flow',
  EXIT:             'exit',
  ENDED:            'ended',
  CTA:              'cta_injection',
};
```

**Rule**: Every new ACT type needs a case in BOTH `_step5_selectAction()` AND `_step6_generateResponse()`. Missing one causes silent fallback to default case.

---

## THE PATTERN — Adding a New Service Integration

When adding a new external service (calendar, Twilio, CRM), follow this exact order:

**Step 1** — Add config field check in ACT.CLOSE or relevant action:
```javascript
if (config.new_service_enabled === true) { ... }
```

**Step 2** — Add new ACT type to the enum

**Step 3** — Add case to `_step4_chooseGoal()`:
```javascript
case STATES.NEW_STATE:
  return 'new_goal';
```

**Step 4** — Add case to `_step5_selectAction()`:
```javascript
case 'new_goal':
  return { type: ACT.NEW_ACTION };
```

**Step 5** — Add case to `_step6_generateResponse()`:
```javascript
case ACT.NEW_ACTION: {
  // Call backend service via fetch to /api/new-service
  // Never call external APIs directly from orchestrator
  // Always use server-side route
}
```

**Step 6** — Add new state to `state-machine.js` STATES enum and transitions (see SK-010)

---

## DO NOT RULES

1. **DO NOT move the emergency detector.** It must remain at the very top of `processInput()` before any other logic. See SK-009.

2. **DO NOT call external APIs directly from the orchestrator.** All external calls (Google Calendar, Twilio, n8n) go through `server/` routes via `fetch('/api/...')`. The orchestrator is a browser module — it cannot hold API keys.

3. **DO NOT add state transitions without updating `_step4_chooseGoal()`.** An unreachable state creates a silent routing failure — the orchestrator cannot transition to it and falls to FALLBACK.

4. **DO NOT add an ACT type without adding it to both `_step5` and `_step6`.** Missing `_step5` means the action is never selected. Missing `_step6` means it falls to the default case silently.

5. **DO NOT modify `_step2_updateContext()` to store PHI in ways that persist beyond the session.** Context memory is in-memory only — never write patient data to localStorage from the orchestrator. Use `lead-capture.js` for structured PHI storage.

6. **DO NOT let the LLM intercept EXIT, ENDED, or CLOSE actions.** These have legal/safety implications — they must follow deterministic paths. The current LLM guard at line ~897 excludes these action types. Do not remove that exclusion.

---

## REAL EXAMPLE FROM THIS CODEBASE

**Pass 3, T05, G-028 — Emergency Detector Integration**

The emergency detector was hooked into the very top of `processInput()` at the start of the method body. Before this, there was no interception — a patient saying "I have chest pain" would route through the full NLP pipeline and potentially get a conversational response about scheduling. After the fix, it immediately returns the 911 directive.

The key architectural decision: emergency check runs before `this.sm.getState() === STATES.ENDED` check and before the ConversationRouter. Nothing runs before it.

**Pass 7, T05, G-044 — Calendar Hook at ACT.CLOSE**

The `ACT.CLOSE` case was modified to check `config.primary_goal === 'book_appointment'` and `config.calendar_enabled`. If true, it transitions to `BOOKING_CONFIRMATION` instead of `CLOSING`. This is the correct pattern for conditional routing based on config — the orchestrator checks config, never hardcodes clinic-specific behavior.

---

## GOTCHAS

1. **The `FLOW_CTX` map** at lines 59-66 maps state names to context strings used by discovery questions. If you add a new service flow state, add it here too or discovery questions will have no context.

2. **`_webhookSentPartial` and `_webhookSentFinal` flags** — these prevent double-firing the webhook. If you add a new webhook trigger point, check these flags before dispatching. The orchestrator already fires webhooks — adding more without checking these creates duplicate deliveries.

3. **The 6-step pipeline is synchronous in intent but async in execution** — `_step6_generateResponse` is async due to LLM calls. All steps before it are sync. Do not add async operations in steps 1-5 without careful handling of the `inputId` stale protection pattern.

4. **`onToken` callback** — passed from `app.js` for LLM streaming. If a rule-based response is returned from `_step6`, `onToken` is not called — speech happens in `app.js` after response returns. If an LLM response is returned, `onToken` was already called during streaming. The TTS sentence buffer in `app.js` handles the distinction. Do not call `onToken` from both paths.

---

## SYNC CONTRACTS AFFECTED

- **SYNC-02**: STATES enum in `state-machine.js` must match all `STATES.X` references in this file
- **SYNC-01**: All `AppContext.getConfig()` field accesses must reference fields that exist in the config shape

---

## SKILL SIGN-OFF

| Pass | Date | Agent | Files Modified | Outcome |
|------|------|-------|----------------|---------|
| 7 | 2026-05-01 | — | js/response-orchestrator.js | Calendar hook at ACT.CLOSE, BOOKING_CONFIRMATION state |
