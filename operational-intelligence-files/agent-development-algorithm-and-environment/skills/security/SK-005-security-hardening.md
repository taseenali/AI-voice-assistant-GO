# Skill: Security Hardening
Standard mitigations for the MedVoice AI platform.

## 1. Webhook Authentication (SEC-01)
- **Mechanism**: HMAC-SHA256.
- **Headers**: `X-Webhook-Signature` and `X-Webhook-Timestamp`.
- **Secret**: Must be injected from config (Pass 4) or env-vars (Pass 5).

## 2. XSS Prevention (SEC-08)
- **Rule**: Never use `.innerHTML` for user-sourced or config-sourced strings.
- **Pattern**: Always use `.textContent` or `document.createTextNode()`.

## 3. Secret Isolation (SEC-02/SSYNC-03)
- **Goal**: Keep `webhook_secret` out of client-side JSON files.
- **Pattern**: Serve config via Edge Function (Netlify/Vercel) that handles secrets server-side.

## 4. Input Sanitization (SEC-03)
- **Rule**: Sanitize all speech-to-text strings before intent detection.

## 5. Real Example From This Codebase
- **Scenario**: HMAC Webhook Authentication (SEC-01, Pass 2).
- **Issue**: Webhooks were sent unauthenticated to n8n.
- **Fix**: Implemented `_signPayload()` method using `crypto.subtle` to generate HMAC-SHA256 signatures for every POST.
- **Location**: `js/services/webhook-dispatcher.js` (Lines 145-165).
