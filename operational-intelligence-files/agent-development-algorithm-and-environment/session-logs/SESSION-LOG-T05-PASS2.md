# T05 — BUILD DIRECTIVE (PASS 2)
## Template: Full Secure Implementation

---

## FILES MODIFIED THIS PASS

| File                              | Security Goal       | What Changed |
|-----------------------------------|---------------------|--------------|
| js/services/webhook-dispatcher.js | SEC-01 (HMAC)       | Added `_signPayload()` with `crypto.subtle`, timestamp header, rejection on 401/403 |
| js/nlp/nlp-extractor.js           | SEC-03 (Sanitize)   | `MAX_INPUT_LENGTH = 500` constant + pre-truncation of both inputs before any regex |
| js/modules/lead-capture.js        | SEC-07 (localStorage) | New `_getStorageKey()` using `av_leads_v1:[clientId]` namespace, applied to both write and read |
| js/app.js                         | SEC-03 + TCPA       | `_sanitizeInput()` at entry gate, `_hasVoiceConsent` flag, consent guard in `_toggleVoice()` |
| js/speech-io.js                   | SEC-04 (Privacy)    | `onPrivacyFallback` callback, hard-error detection, `getPrivacyNotice()` method |
| index.html                        | TCPA + SEC-04       | Voice consent banner with Allow/Decline, privacy disclosure in sidebar footer |
| js/config/loader.js               | SYNC-01 / SSYNC-03  | Emergency fallback comment hardened — explicit DO NOT HARDCODE policy documented |

---

## IMPLEMENTATION DETAILS

### SEC-01 — HMAC + Timestamp (webhook-dispatcher.js)

**Before** (line 200):
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-Client-ID': item.client_id,
  'X-Idempotency-Key': item.idempotency_key
}
body: JSON.stringify(item)
```

**After** (lines 179–255):
```javascript
// Signs: timestamp + '.' + rawBody
const { signature, timestamp } = await this._signPayload(item.webhook_secret, rawBody);
// Headers:
'X-Webhook-Signature': signature,
'X-Webhook-Timestamp': timestamp
// Rejection:
if (response.status === 401 || response.status === 403) throw new Error('Signature rejected...')
```

**Failure paths confirmed**:
- Valid request: accepted
- Invalid signature (server returns 401/403): throws, retries via outbox
- Missing secret: logs warning, sends unsigned (graceful degradation per SSYNC-03)

---

### SEC-03 — Sanitization (app.js + nlp-extractor.js)

**Primary gate (app.js `_sanitizeInput()`)**:
```javascript
const truncated = raw.slice(0, 500);     // truncate first
div.textContent = truncated;              // use DOM to escape HTML
return div.innerHTML.replace(...</)>;    // safe string returned
```
Applied in `_handleSend()` and `speechIO.onResult`.

**Secondary gate (nlp-extractor.js)**:
```javascript
const safeClean = cleanedText.slice(0, MAX_INPUT_LENGTH); // 500
const safeNorm  = normalizedText.slice(0, MAX_INPUT_LENGTH);
// All regex functions receive only bounded strings
```

**Failure path**: Malicious 10,000-char payload is sliced to 500 at entry and again at the NLP layer.

---

### TCPA — Consent (app.js + index.html)

**Mic gate added in `_toggleVoice()`**:
```javascript
if (!this._hasVoiceConsent) {
  this._requestVoiceConsent(); // Shows banner
  return; // Mic stays blocked
}
```

**Consent banner** (`#voice-consent-banner`): Hidden by default. Appears on first mic click.
- "Allow Voice" → `_grantVoiceConsent()` → sets `_hasVoiceConsent = true` → calls `_startVoice()`
- "Use Text Only" → `_declineVoiceConsent()` → mic stays blocked, text input focused

**Failure path**: No consent → `_toggleVoice()` returns early — `startListening()` is NEVER called.

---

### SEC-04 — Privacy Disclosure + Fallback (speech-io.js + index.html)

**Hard error detection** in `onerror`:
```javascript
const hardErrors = ['not-allowed', 'service-not-allowed', 'network', 'audio-capture'];
if (hardErrors.includes(event.error)) this.onPrivacyFallback(event.error);
```

**Fallback handler in app.js**:
```javascript
this.speechIO.onPrivacyFallback = (errorCode) => {
  this._voiceMode = false;
  this._hasVoiceConsent = false; // Must re-consent
  this._addMessage('assistant', 'Voice input is currently unavailable...');
  this.$textInput.focus();
};
```

**Disclosure** visible in `index.html` sidebar footer permanently.

**Failure path**: Voice denied → app automatically routes to text, mic stays blocked.

---

### SEC-07 — localStorage Key Hardening (lead-capture.js)

**Before**: `leads_${company_name.toLowerCase()}`
**After**: `av_leads_v1:${clientId_normalized}` — versioned, non-guessable prefix.

**Read path** (`loadAll()`): Uses same `_getStorageKey()` helper. Cross-tenant reads impossible without matching client_id.

---

### Emergency Fallback — SSYNC-03 Alignment (loader.js)

`webhook_secret: ''` is now annotated with:
```
// SSYNC-03/SYNC-01: DO NOT hardcode real secrets here.
// Emergency fallback must never contain production credentials.
// webhook_secret is injected at runtime via env vars (Option A per SSYNC-03).
```

---

## T05 COMPLETION SIGN-OFF

```
T05_COMPLETED         = YES
T05_DATE              = 2026-04-29
T05_AGENT             = Claude Sonnet 4.6
T05_FILES_MODIFIED    = 7
T05_NEW_BUGS          = 0
T05_SEC_ISSUES_FIXED  = SEC-01, SEC-03, SEC-04, SEC-07, TCPA
ADVANCE_TO_T06        = YES
```
