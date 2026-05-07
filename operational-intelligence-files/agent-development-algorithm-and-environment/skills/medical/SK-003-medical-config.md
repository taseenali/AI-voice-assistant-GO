# SKILL: Medical Configuration & HIPAA
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-003"
SKILL_NAME        = "Medical Configuration & HIPAA Compliance"
SKILL_CATEGORY    = "medical"
SKILL_VERSION     = "2.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-04-28"
SKILL_LAST_USED   = "2026-04-30"
APPLIES_TO_PASS   = "all"
RELEVANT_FILES    = "configs/*.json, js/modules/lead-capture.js, js/modules/emergency-detector.js, js/modules/discovery-engine.js, js/modules/closing-engine.js"
```

---

## WHAT THIS SKILL IS FOR

MedVoice AI operates in a healthcare context where configuration mistakes directly impact patient safety, legal compliance, and product trust. This skill governs how medical configs are structured, what data is collected, how it is protected, and what language is used throughout the platform. It prevents both safety failures (emergency routing through LLM) and compliance failures (collecting PHI without justification).

---

## WHEN TO USE THIS SKILL

Use this skill when:
- Creating or modifying any config file in `configs/`
- Modifying `lead-capture.js` field schema or capture order
- Modifying `discovery-engine.js` question banks
- Modifying `closing-engine.js` response language
- Adding any new data field to patient intake
- Writing or reviewing greeting strings

Do NOT use this skill when:
- Working on webhook delivery infrastructure (use SK-005)
- Working on NLP pattern matching (use SK-008)
- Working on the Node.js backend (use SK-007)

---

## THE PATTERNS

---

### Pattern 1 — PHI Minimization

**Rule**: Only collect the minimum patient data necessary for the specific triage purpose. Every field must have a documented clinical justification.

**WRONG:**
```javascript
// Collecting fields that have no clinical necessity
this._leadData = {
  name: null,
  dob: null,
  insurance_provider: null,
  insurance_id: null,
  reason_for_visit: null,
  patient_type: null,
  annual_income: null,       // ← NO JUSTIFICATION
  employer: null,            // ← NO JUSTIFICATION
  social_media_handle: null  // ← NEVER
};
```

**CORRECT:**
```javascript
// Only collect what is needed for triage
this._leadData = {
  name:               null,  // Required: identify the patient
  patient_type:       null,  // Required: new vs returning workflow
  dob:                null,  // Required: patient verification
  reason_for_visit:   null,  // Required: core triage
  insurance_provider: null,  // Required: billing routing
  insurance_id:       null,  // Optional: only if insurance verification needed
  urgency:            null   // Derived: from conversation context
};
```

**Verification**: Every field in `_leadData` must have a comment explaining its clinical necessity.

---

### Pattern 2 — EU AI Act Greeting Compliance (SSYNC-02)

**Rule**: Every greeting string in every config file must explicitly state the system is an AI before any patient data is collected. "Virtual assistant" alone is insufficient — must say "AI" explicitly.

**WRONG:**
```json
"greetings": [
  "Hi! I'm Aria, your virtual assistant for MedVoice Clinic.",
  "Hello! I'm here to help you with your healthcare needs."
]
```

**CORRECT:**
```json
"greetings": [
  "Hi! I'm Aria, an AI assistant for MedVoice Clinic. How can I help you today?",
  "Hello! I'm Aria, MedVoice Clinic's AI medical receptionist. What can I help you with?"
]
```

**Verification**: Grep all greeting arrays for the string "AI" — every greeting must contain it. Zero exceptions.

---

### Pattern 3 — Emergency Keywords Are Mandatory

**Rule**: Every config file must contain an `emergency_keywords` array. The EmergencyDetector reads this array. A config without it means emergencies route through the LLM — which is a medical liability.

**WRONG:**
```json
{
  "company_name": "City Medical Clinic",
  "assistant_name": "Aria",
  "services": [...]
  // ← NO emergency_keywords
}
```

**CORRECT:**
```json
{
  "company_name": "City Medical Clinic",
  "assistant_name": "Aria",
  "emergency_keywords": [
    "chest pain", "heart attack", "can't breathe", "difficulty breathing",
    "stroke", "unconscious", "not breathing", "severe bleeding", "overdose",
    "suicide", "kill myself", "want to die", "severe allergic reaction",
    "anaphylaxis", "seizure", "diabetic coma", "loss of consciousness",
    "head injury", "severe burn", "choking", "poisoning", "labor",
    "baby coming", "water broke", "severe abdominal pain"
  ],
  "emergency_response": "🚨 This sounds like a medical emergency. Please call 911 immediately or have someone take you to the nearest emergency room. Do not wait. Is there anything else I can help you with after you've called for help?",
  "services": [...]
}
```

**Verification**: Every config file must have `emergency_keywords` with at least 20 terms covering cardiac, respiratory, neurological, trauma, and mental health crises.

---

### Pattern 4 — Config Schema Required Fields

**Rule**: Every config file must contain all fields in `validator.js` REQUIRED_FIELDS. Missing fields cause the validator to fall back to emergency defaults which do not reflect the clinic's actual information.

**Required fields as of Pass 5:**
```json
{
  "company_name": "string — clinic legal name",
  "assistant_name": "string — AI persona name",
  "tone": "warm, calm, professional",
  "primary_goal": "book_appointment",
  "greetings": ["array — min 2 strings, all with AI disclosure"],
  "cta_templates": ["array — appointment focused"],
  "service_domain_tokens": ["medical", "health", "clinic", "appointment", "doctor"],
  "webhook_secret": "string — placeholder in dev, real secret in production",
  "llm_model": "llama3.1:8b",
  "ai_tier": 2,
  "ollama_endpoint": "http://localhost:11434",
  "emergency_keywords": ["array — min 20 terms"],
  "emergency_response": "string — 911 redirect message"
}
```

---

### Pattern 5 — Medical Role Language

**Rule**: All role descriptions, about text, and meta descriptions must use medical receptionist language. Business consultant, sales agent, and lead generation language is banned from all medical configs.

**BANNED TERMS in medical configs:**
- "business consultant", "business advisor", "sales agent"
- "lead generation", "client acquisition", "revenue"
- "grow your business", "business challenge", "ROI"
- "entrepreneur", "startup", "B2B"

**REQUIRED TONE:**
- Warm, empathetic, professional
- Patient-focused (not client-focused)
- Appointment and care-oriented (not sales-oriented)
- Calm in urgency (medical professionals de-escalate)

---

## REAL EXAMPLE FROM THIS CODEBASE

**Pass 4, T05, G-033 — Medical Vertical Pivot**

The problem — `configs/default.json` contained:
```json
{
  "role": "AI business consultant",
  "greetings": ["Hi! I help businesses find the right tech solutions..."],
  "services": [
    { "name": "Website Development", "intent_key": "FLOW_WEBSITE" },
    { "name": "SEO Services", "intent_key": "FLOW_SEO" }
  ]
}
```

The fix — `configs/medical-clinic.json`:
```json
{
  "role": "AI medical receptionist",
  "greetings": [
    "Hi! I'm Aria, an AI assistant for MedVoice Clinic. How can I help you today?"
  ],
  "services": [
    { "name": "General Consultation", "intent_key": "FLOW_GENERAL_CONSULT" },
    { "name": "Dental Appointment", "intent_key": "FLOW_DENTAL" },
    { "name": "Urgent Care", "intent_key": "FLOW_URGENT" }
  ]
}
```

Result: SSYNC-02 passed at T06, all 4 greeting strings compliant.

---

## GOTCHAS

1. **FLOW_CTX map must match config intent_keys**: If you add a new service to the config with a new `intent_key`, the `FLOW_CTX` map in `response-orchestrator.js` lines 59-66 must be updated to match. Mismatched keys cause silent routing failures — the orchestrator cannot find the flow and falls to FALLBACK state.

2. **validator.js REQUIRED_FIELDS must be updated when adding mandatory config fields**: If you add `emergency_keywords` as required, add it to `REQUIRED_FIELDS` in `js/config/validator.js` AND to `getEmergencyFallback()` in `js/config/loader.js`. Both sides must stay in sync (SYNC-04).

3. **`abc-roofing.json` was deleted in Pass 5** — do not reference it. If any test or module references this file, it will throw a 404. Use `medical-clinic.json` as the test config.

4. **ai_tier: 2 required for LLM activation** — if `ai_tier` is missing or set to `1`, the LLM adapter silently falls back to rule-based. Always verify after config changes.

---

## SYNC CONTRACTS AFFECTED

- **SSYNC-02**: Every greeting must identify system as AI — verified at T04 and T06
- **SYNC-03**: Lead data schema in config must match `lead-capture.js` `_leadData` shape
- **SYNC-04**: `validator.js` REQUIRED_FIELDS must match config schema

---

## SKILL SIGN-OFF

| Pass | Date | Agent | Files Modified | Outcome |
|------|------|-------|----------------|---------|
| 4 | 2026-04-29 | Gemini 3 Flash | configs/medical-clinic.json, js/modules/discovery-engine.js | G-033 complete, all SMB language removed |
| 5 | 2026-04-30 | Antigravity | configs/*.json | Medical purge verified, abc-roofing.json deleted |
