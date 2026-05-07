# SKILL: Emergency Detector Rules
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-009"
SKILL_NAME        = "Emergency Detector — Safety Guardrail Rules"
SKILL_CATEGORY    = "medical"
SKILL_VERSION     = "1.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-04-30"
SKILL_LAST_USED   = "2026-04-30"
APPLIES_TO_PASS   = "all"
RELEVANT_FILES    = "js/modules/emergency-detector.js, js/response-orchestrator.js"
```

---

## WHAT THIS SKILL IS FOR

The EmergencyDetector is the most safety-critical module in the entire platform. It intercepts patient inputs before ANY other processing and detects life-threatening situations. Getting this wrong means a patient describing a heart attack gets routed through the LLM for a conversational response instead of being immediately directed to emergency services. This skill defines the inviolable rules that protect this module.

---

## WHEN TO USE THIS SKILL

Use this skill when:
- Modifying `js/modules/emergency-detector.js` for any reason
- Modifying `processInput()` in `js/response-orchestrator.js`
- Adding new conversation flows that might intercept before emergency detection
- Reviewing any code that sits between user input and response generation

Do NOT use this skill for general conversation flow work.

---

## THE RULES — ALL ARE ABSOLUTE

---

### Rule 1 — Emergency Detection ALWAYS Runs First

**Rule**: The EmergencyDetector runs at the very top of `processInput()` in `response-orchestrator.js`, before the ConversationRouter, before the 6-step pipeline, before the LLM. Nothing intercepts before it.

**WRONG — anything placed before emergency check:**
```javascript
async processInput(userInput, onToken = null) {
  // ❌ WRONG: Router runs before emergency check
  const quickRoute = this.router.route(input, null, this._unclear);
  if (quickRoute.type !== ROUTE_TYPE.CORE) { ... }
  
  // Emergency check is too late
  const emergencyResult = this.emergency.scan(input);
}
```

**CORRECT — emergency check is the very first operation:**
```javascript
async processInput(userInput, onToken = null) {
  if (!userInput || !userInput.trim()) return null;
  const input = userInput.trim();

  // ═══ EMERGENCY DETECTOR — runs FIRST, before all routing ═══
  // Deterministic keyword guardrail. Bypasses entire pipeline on match.
  // NEVER rely on LLM for safety-critical paths.
  const emergencyResult = this.emergency.scan(input);
  if (emergencyResult.detected) {
    this.sm.addToMemory({ role: 'user', text: input });
    this.sm.addToMemory({ role: 'assistant', text: emergencyResult.response });
    if (onToken) onToken(emergencyResult.response);
    return emergencyResult.response;
  }

  // Only after emergency check passes does anything else run
  const quickRoute = this.router.route(input, null, this._unclear);
  // ...
}
```

---

### Rule 2 — Emergency Detection Is ALWAYS Deterministic

**Rule**: Emergency detection uses keyword matching only. It never calls the LLM. It never uses NLP confidence scoring. It never uses intent detection. A keyword match triggers the emergency response — always, without exception, without confidence thresholds.

**WRONG — any LLM involvement in emergency detection:**
```javascript
// ❌ NEVER DO THIS
async scan(input) {
  // Using LLM to determine if something is an emergency
  const llmResult = await this.llm.generate(input, [], null);
  if (llmResult.includes('emergency')) {
    return { detected: true, response: this.emergencyResponse };
  }
}
```

**CORRECT — pure keyword matching:**
```javascript
scan(input) {
  const lower = input.toLowerCase().trim();
  
  for (const keyword of this._keywords) {
    if (lower.includes(keyword.toLowerCase())) {
      return {
        detected: true,
        keyword: keyword,
        response: this._emergencyResponse,
        voiceResponse: this._voiceEmergencyResponse
      };
    }
  }
  
  return { detected: false };
}
```

---

### Rule 3 — Emergency Response Contains No Booking Language

**Rule**: The emergency response must contain ONLY emergency service information and a 911 directive. It must not contain any appointment booking language, any lead capture prompts, any CTAs, and no suggestion to call back later.

**WRONG:**
```javascript
// ❌ Contains booking language
emergencyResponse = "This sounds serious. Please call 911 immediately. " +
  "Once you're feeling better, would you like to schedule a follow-up appointment?";
```

**CORRECT:**
```javascript
// ✅ Pure emergency directive only
emergencyResponse = "🚨 This sounds like a medical emergency. " +
  "Please call 911 immediately or have someone take you to the nearest emergency room. " +
  "Do not wait. Your safety is the priority.";
```

**Verification at T06**: Grep emergency responses for "appointment", "schedule", "book", "follow-up" — zero results required.

---

### Rule 4 — Emergency Keywords Must Cover All Crisis Categories

**Rule**: The keyword list must cover at minimum these 6 categories. Missing categories create liability gaps.

```javascript
const EMERGENCY_CATEGORIES = {
  cardiac:        ['chest pain', 'heart attack', 'heart pounding', 'chest tightness'],
  respiratory:    ["can't breathe", 'difficulty breathing', 'not breathing', 'choking'],
  neurological:   ['stroke', 'seizure', 'unconscious', 'loss of consciousness', 'head injury'],
  hemorrhagic:    ['severe bleeding', 'bleeding heavily', 'blood loss', 'blood everywhere'],
  mental_health:  ['suicide', 'kill myself', 'want to die', 'end my life', 'hurt myself'],
  obstetric:      ['labor', 'baby coming', 'water broke', 'contractions', 'giving birth'],
  pediatric:      ['baby not breathing', 'child unconscious', 'infant not moving'],
  trauma:         ['car accident', 'fell down stairs', 'severe burn', 'poisoning', 'overdose']
};
```

---

## REAL EXAMPLE FROM THIS CODEBASE

**Pass 3, T05, G-028 — Emergency Detector Built**

The detector was built at the top of `processInput()` in `response-orchestrator.js`. Pre-Pass 5 manual testing confirmed:

Input: `"I've been having chest pain for two days"`
Result: Immediate emergency response — `"🚨 This sounds like a medical emergency. Please call 911 immediately..."` — before any LLM or pipeline processing.

The test confirmed the detector intercepted correctly before the orchestrator pipeline ran.

---

## GOTCHAS

1. **Adding new conversation entry points**: If a new input path is added to the system (e.g., a Twilio voice transcription handler), the EmergencyDetector must be the FIRST thing called in that handler too. The check in `processInput()` only covers the existing path.

2. **Keyword updates require config sync**: If `emergency_keywords` is added to the config schema (SK-003 Pattern 3), the EmergencyDetector must be updated to read from `AppContext.getConfig().emergency_keywords` in addition to its hardcoded list. Hardcoded keywords are the safety fallback — config keywords extend them.

3. **Voice response vs text response**: The detector returns both `response` (text for UI) and `voiceResponse` (shorter for TTS). Keep voice response under 30 words — TTS of long emergency messages causes dangerous delays.

---

## SYNC CONTRACTS AFFECTED

- No SYNC contracts — this module has no sync dependencies by design
- It must remain isolated from all other modules
- Any attempt to make it depend on config, NLP, or LLM is a violation of this skill

---

## SKILL SIGN-OFF

| Pass | Date | Agent | Files Modified | Outcome |
|------|------|-------|----------------|---------|
| 3 | 2026-04-29 | Claude Sonnet | js/modules/emergency-detector.js, js/response-orchestrator.js | G-028 complete — deterministic guardrail live |
| 5 | 2026-04-30 | Antigravity | — | Pre-pass test confirmed: chest pain intercepted correctly |
