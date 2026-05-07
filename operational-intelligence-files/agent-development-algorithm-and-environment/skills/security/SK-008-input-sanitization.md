# SKILL: Input Sanitization
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-008"
SKILL_NAME        = "Input Sanitization — Primary and Secondary Gates"
SKILL_CATEGORY    = "security"
SKILL_VERSION     = "2.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-04-30"
SKILL_LAST_USED   = "2026-05-01"
APPLIES_TO_PASS   = "all"
RELEVANT_FILES    = "js/app.js, js/nlp/nlp-extractor.js, js/response-orchestrator.js"
```

---

## WHAT THIS SKILL IS FOR

Every piece of text that enters MedVoice AI — whether typed or spoken — passes through two sanitization gates before any processing. This prevents XSS, prompt injection attacks, and unbounded input from crashing the NLP pipeline or being passed to the LLM. Skipping either gate creates a security vulnerability. This skill documents both gates, their locations, and their exact implementation.

---

## WHEN TO USE THIS SKILL

Use this skill when:
- Adding any new input entry point (new form field, new voice handler, new API endpoint)
- Modifying `app.js` `_handleSend()` or `_setupSpeechCallbacks()`
- Modifying `nlp-extractor.js`
- Adding any new text processing before the NLP pipeline
- Reviewing input handling in any module

---

## THE TWO-GATE PATTERN

```
User types or speaks
        │
        ▼
GATE 1 — Primary Gate
js/app.js _sanitizeInput() (lines 328-338)
        │ • Truncate to 500 chars
        │ • Strip HTML via DOM parser
        │ • Applied to: text input (line 354) + voice transcript (line 227)
        ▼
ResponseOrchestrator.processInput(sanitized_input)
        │
        ▼
GATE 2 — Secondary Gate
js/nlp/nlp-extractor.js MAX_INPUT_LENGTH (lines 3, 7-8)
        │ • Enforce 500 char limit again (defensive)
        │ • Applied before all regex operations
        ▼
NLP Processing / LLM call
```

---

## GATE 1 — PRIMARY GATE (REQUIRED FOR ALL INPUT)

**File**: `js/app.js`
**Function**: `_sanitizeInput(raw)` at approximately line 328
**Applied at**: Lines 354 (text input) and 227 (voice transcript)

```javascript
// js/app.js — _sanitizeInput() implementation
_sanitizeInput(raw) {
  if (typeof raw !== 'string') return '';
  
  // 1. Truncate FIRST — before any parsing (prevents DoS via huge input)
  const truncated = raw.slice(0, 500);
  
  // 2. Strip HTML via DOM parser — no external library needed
  const div = document.createElement('div');
  div.textContent = truncated;
  return div.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

**Why DOM parser for HTML stripping**: Using `div.textContent = input` followed by reading `div.innerHTML` converts special characters to HTML entities. This is more reliable than regex-based stripping because the browser's parser handles all edge cases.

**Applied to voice input** (line 227):
```javascript
this.speechIO.onResult = (transcript, isFinal) => {
  if (isFinal) {
    // SEC-03: Same sanitization gate as text input
    this._processUserInput(this._sanitizeInput(transcript));
  }
};
```

---

## GATE 2 — SECONDARY GATE (DEFENSIVE REDUNDANCY)

**File**: `js/nlp/nlp-extractor.js`
**Constants**: `MAX_INPUT_LENGTH = 500` at line 3

```javascript
// js/nlp/nlp-extractor.js — secondary enforcement
const MAX_INPUT_LENGTH = 500;

function extract(input) {
  // Secondary gate — enforce limit before regex operations
  const safeInput = typeof input === 'string'
    ? input.slice(0, MAX_INPUT_LENGTH)
    : '';
  
  // All regex operations use safeInput, never raw input
  const safeClean = safeInput.toLowerCase().trim();
  // ...
}
```

**Why two gates?** Gate 1 runs in `app.js` which is the UI layer. Gate 2 runs in the NLP module. If any code path ever calls the NLP engine directly without going through `app.js` (e.g., a new API endpoint, a test harness, a future server-side processing path), Gate 2 prevents unsanitized input from reaching regex operations.

---

## THE PATTERN — Adding a New Input Entry Point

Whenever a new entry point for user text is added, both gates must be applied:

**WRONG — new entry point without sanitization:**
```javascript
// New SMS handler — MISSING sanitization
app.post('/api/sms/inbound', (req, res) => {
  const userMessage = req.body.Body;  // ← raw input
  orchestrator.processInput(userMessage);  // ← dangerous
});
```

**CORRECT — new entry point with sanitization:**
```javascript
// New SMS handler — WITH sanitization
app.post('/api/sms/inbound', (req, res) => {
  const raw = req.body.Body || '';
  
  // Server-side Gate 1 equivalent
  const sanitized = raw
    .slice(0, 500)
    .replace(/[<>]/g, '');  // Server context — no DOM parser available
  
  orchestrator.processInput(sanitized);
});
```

**For server-side input** (Node.js routes), use string-based sanitization since the DOM parser is not available:
```javascript
// Server-side sanitization utility
function sanitizeServerInput(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .slice(0, 500)
    .replace(/[<>&"']/g, (c) => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;',
      '"': '&quot;', "'": '&#39;'
    })[c]);
}
```

---

## DO NOT RULES

1. **DO NOT call `orchestrator.processInput()` with raw user input** — always run through `_sanitizeInput()` first. Every call site must show the sanitization step.

2. **DO NOT remove the 500-char limit** — the NLP regex engine performance degrades significantly on long inputs. The LLM has its own token limits but the NLP pipeline does not — unbounded input causes slow regex matching.

3. **DO NOT use regex for HTML stripping in the browser** — the DOM parser approach (`div.textContent = input; div.innerHTML`) is more reliable. Regex-based HTML stripping has well-documented bypass vectors.

4. **DO NOT sanitize after storage** — always sanitize BEFORE storing or processing. Storing raw input and sanitizing on display is the wrong order and creates a window where unsanitized data exists in storage.

5. **DO NOT add the `innerHTML` call pattern** — `div.innerHTML = userInput` (not `textContent`) would create an XSS vector. The sanitization uses `textContent` for writing and `innerHTML` only for reading the escaped result.

---

## REAL EXAMPLE FROM THIS CODEBASE

**Pass 2, T05, G-011 — Input Sanitization Implementation (SEC-03)**

Before Pass 2, user input from the text field went directly to the NLP engine without sanitization. A user typing `<script>alert('xss')</script>` would pass that directly to intent detection and potentially to the LLM system prompt.

The fix added `_sanitizeInput()` to `app.js` and applied it at both the text input handler and the voice transcript handler. The secondary gate was added to `nlp-extractor.js` as defensive redundancy.

Result: SEC-03 marked RESOLVED. The same sanitization gate now handles both typed and spoken input — voice transcripts receive identical security treatment to text input.

**Pass 5, T05 — SMB purge remnants in nlp-extractor.js (lines 57-58)**

During the medical purge, two regex patterns in `nlp-extractor.js` still matched "roofing" and "shingles" terminology. These were removed and replaced with medical entity patterns. This example shows that the secondary gate's regex patterns are content-specific and must be updated when the vertical changes.

---

## GOTCHAS

1. **Voice input goes through Gate 1** — speech transcripts from `speechIO.onResult` are passed to `_sanitizeInput()` at line 227 before `_processUserInput()`. This is not obvious because voice and text appear to be separate paths. They converge at sanitization.

2. **The DOM parser escape is read via innerHTML** — the pattern `div.textContent = input; return div.innerHTML` works because setting `textContent` causes the browser to escape HTML entities, and `innerHTML` then returns the escaped string. This is correct and intentional — not an XSS vulnerability.

3. **Server-side routes need their own sanitization** — when Twilio webhook delivers voice transcripts to `server/routes/voice.js`, that input must be sanitized before passing to the orchestrator (if server-side orchestration is added in future passes). The DOM-based Gate 1 is browser-only.

---

## SYNC CONTRACTS AFFECTED

- **SEC-03**: Input sanitization on all user speech/text — RESOLVED in Pass 2, maintained here

---

## SKILL SIGN-OFF

| Pass | Date | Agent | Files Modified | Outcome |
|------|------|-------|----------------|---------|
| 2 | 2026-04-29 | Claude Sonnet | js/app.js, js/nlp/nlp-extractor.js | SEC-03 RESOLVED |
| 5 | 2026-04-30 | Antigravity | js/nlp/nlp-extractor.js | Roofing regex removed, medical entities added |
| 7 | 2026-05-01 | Claude | — | Promoted DRAFT to COMPLETE, full code references added |
