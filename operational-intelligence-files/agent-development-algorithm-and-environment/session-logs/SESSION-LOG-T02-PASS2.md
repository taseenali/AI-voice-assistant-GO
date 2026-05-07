# T02 — DOMAIN RESEARCH (PASS 2)
## Template: External Intelligence Injection

> **AGENT INSTRUCTIONS**: This is one of two research templates in the loop. Search open-source, industry, and technical sources. Record findings with sources. This intelligence informs T05 build decisions. Do not build anything here — research and document only.
> 
> **CRITICAL MINDSET RULE**: You are in implementation mode, not explanation mode. Do not write generic explanations of concepts (e.g., "Here is what HMAC is"). You must collect direct, actionable technical inputs for T05 implementation (e.g., "Use Web Crypto API `crypto.subtle.sign()` for HMAC-SHA256, attach to `X-Signature` header, verify using constant-time comparison"). Your research MUST directly fuel code changes.

---

## RESEARCH DOMAINS (Pass 2 Targeted)

---

## SECTION 1 — SEC-01 (HMAC AUTHENTICATION IMPLEMENTATION)

**Research prompt**: "HMAC SHA256 Web Crypto API webhook signature JS code" and "n8n crypto verify HMAC signature node JS"

**Implementation Inputs for T05**:
- **Sender Side (webhook-dispatcher.js)**:
  - DO NOT USE external libraries; use `window.crypto.subtle`.
  - Use `new TextEncoder().encode(secret)` to import the key with `{ name: 'HMAC', hash: 'SHA-256' }`.
  - Generate a timestamp: `const timestamp = Date.now().toString()`.
  - Sign a combined payload: `timestamp + '.' + rawStringifiedBody`.
  - Convert the ArrayBuffer to a hex string, and attach it to `X-Webhook-Signature`.
  - Attach the timestamp to `X-Webhook-Timestamp`.
- **Receiver Side (n8n)**:
  - The n8n Webhook node must be set to capture **Raw Body** and headers.
  - In a Code Node, use Node.js built-in `crypto`.
  - **Replay Protection**: Read `X-Webhook-Timestamp`. Reject immediately if timestamp is older than 5 minutes (`Date.now() - timestamp > 300000`).
  - Reconstruct signature: `crypto.createHmac('sha256', secret).update(timestamp + '.' + $json.rawBody).digest('hex')`.
  - **CRITICAL**: Use `crypto.timingSafeEqual(Buffer.from(headerSig, 'hex'), Buffer.from(computedSig, 'hex'))`. Reject strictly if false.

---

## SECTION 2 — SEC-03 (INPUT SANITIZATION IMPLEMENTATION)

**Research prompt**: "DOMPurify input sanitization text length bounding implementation"

**Implementation Inputs for T05**:
- **Truncation Pattern**: Do not rely on DOMPurify for length bounding. Truncate the input *before* DOMPurify to prevent CPU exhaustion.
- **Code Injection**: 
  - `const MAX_LENGTH = 500;`
  - `let safeInput = rawInput.slice(0, MAX_LENGTH);`
  - `safeInput = DOMPurify.sanitize(safeInput, { ALLOWED_TAGS: [] });` // Strip all HTML
- **Where to apply**: In `app.js` immediately after grabbing `textInput.value` or speech transcript, BEFORE passing to `ResponseOrchestrator`.

---

## SECTION 3 — TCPA (CONSENT IMPLEMENTATION)

**Research prompt**: "TCPA voice AI consent UI banner implementation code"

**Implementation Inputs for T05**:
- **UI Element (`index.html`)**: Add an overlay/banner with an un-checked checkbox: "I agree to interact via AI-generated voice...".
- **State Blocking (`app.js`)**: 
  - Add `this.hasConsent = false;` to App state.
  - The Mic button (`$micBtn`) must be structurally disabled or intercept clicks to show the consent banner if `this.hasConsent === false`.
- **Validation Path**: If the user clicks "Decline" or attempts to bypass, route them to the text-only chat input.

---

## SECTION 4 — SEC-07 (LOCALSTORAGE ISOLATION IMPLEMENTATION)

**Research prompt**: "tenant isolation localStorage UUID pattern implementation"

**Implementation Inputs for T05**:
- **Storage Wrapper (`lead-capture.js`)**: 
  - Do not use `company_name` directly as the key.
  - Implement a namespaced key pattern: `tenant_v1_[client_id]:leads`.
  - If `client_id` is missing or "default", generate a session-only UUID or use a strict `default_isolate` key.
- **Read Path Fix**: The `load()` method must strictly request the namespaced key. If it attempts to iterate over all `localStorage` keys (which breaks tenant isolation), rewrite it to `localStorage.getItem(namespacedKey)`.

---

## SECTION 5 — SEC-04 (PRIVACY DISCLOSURE & FALLBACK)

**Implementation Inputs for T05**:
- **Disclosure UI (`index.html`)**: Include a persistent visual footer or modal stating: "Voice interactions are processed securely. [Switch to Text-Only]".
- **Fallback Execution (`speech-io.js` / `app.js`)**:
  - If Web Speech API throws `error` (e.g., `not-allowed` or `network`), automatically toggle `_voiceMode = false`, disable the orb, and focus the text input.
  - Ensure the fallback UI explicitly tells the user: "Voice disabled. Using secure text mode."

---

## SECTION 6 — RESEARCH SYNTHESIS

**Top 3 actionable insights for T05**:
1. **HMAC Requires Raw Body + Constant-Time Eval**: T05 must implement `crypto.subtle` on the frontend and document the exact `timingSafeEqual` script needed for n8n.
2. **Sanitization is a Pre-NLP Gate**: T05 must inject the length-bounding logic *before* `DOMPurify`, and apply both before the orchestrator even sees the string.
3. **TCPA is a Hard State Block**: T05 must physically disconnect the microphone API in `app.js` unless `hasConsent === true`.

**Anything that changes the product strategy**:
TCPA and EU AI Act disclosures must be visibly rendered in the DOM, meaning we will need to inject UI elements in T05, not just backend logic.

---

## T02 COMPLETION SIGN-OFF

```
T02_COMPLETED         = YES
T02_DATE              = 2026-04-28
T02_AGENT             = Antigravity
T02_RESEARCH_GAPS     = None (Targeted specific implementation patterns for Pass 2 goals)
ADVANCE_TO_T03        = YES
```
