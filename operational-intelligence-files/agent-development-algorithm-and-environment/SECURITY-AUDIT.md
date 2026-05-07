# SECURITY AUDIT
## Mandatory Security Checklist — Runs as Part of Every T03 Module Audit

> **AGENT INSTRUCTIONS**: This file is not optional. Every T03 execution must complete this checklist in full for every module. Security findings are treated as P0 bugs — they block T06 the same as functional bugs. Add all new findings to ENVIRONMENT.md issues register with prefix SEC-XX.

---

## SECURITY DOMAIN REGISTRY

```
DOMAIN-01   Input Sanitization
DOMAIN-02   Webhook Authentication
DOMAIN-03   Config Exposure
DOMAIN-04   Tenant Data Isolation
DOMAIN-05   XSS / Injection Vectors
DOMAIN-06   Data Persistence Privacy
DOMAIN-07   Speech API Privacy Leakage
DOMAIN-08   EU AI Act Compliance (Article 50)
DOMAIN-09   Dependency & Supply Chain
DOMAIN-10   Error Message Information Leakage
```

---

## KNOWN SECURITY ISSUES

| ID     | Domain     | File                          | Description                                                        | Severity | Status |
|--------|------------|-------------------------------|--------------------------------------------------------------------|----------|--------|
| SEC-01 | DOMAIN-02  | webhook-dispatcher.js         | No auth token on webhook POST — unauthenticated endpoint           | HIGH     | OPEN   |
| SEC-02 | DOMAIN-03  | configs/*.json                | Config files publicly fetchable — exposes webhook URLs             | MEDIUM   | OPEN   |
| SEC-03 | DOMAIN-01  | nlp/nlp-extractor.js          | No input sanitization on raw user speech/text                      | MEDIUM   | OPEN   |
| SEC-04 | DOMAIN-07  | speech-io.js                  | Web Speech API sends voice to Google/Azure cloud                   | HIGH     | OPEN   |
| SEC-05 | DOMAIN-08  | configs/*.json (greetings)    | EU AI Act Article 50 — greetings may not disclose AI identity      | HIGH     | OPEN   |
| SEC-06 | DOMAIN-04  | webhook-dispatcher.js         | BUG-01 tenant isolation failure = security issue                   | HIGH     | OPEN   |
| SEC-07 | DOMAIN-06  | lead-capture.js               | localStorage key is predictable company_name                       | LOW      | OPEN   |
| SEC-08 | DOMAIN-05  | response-builder.js           | XSS audit PASSED — no innerHTML usage confirmed in T03             | MEDIUM   | RESOLVED |

---

## MODULE SECURITY CHECKLIST

Run this for every module during T03.

**DOMAIN-01 — Input Sanitization**
- Does this module accept user-supplied text?
- Is input length bounded before processing?
- Are special characters stripped or escaped before use?
- Result: [PASS / FAIL / N/A]

**DOMAIN-02 — Webhook Authentication**
- Does this module send HTTP requests?
- Is X-Webhook-Secret HMAC header included per SSYNC-01?
- Result: [PASS / FAIL / N/A]

**DOMAIN-03 — Config Exposure**
- Does this module read from config?
- Does it ever log or expose config data to external systems?
- Result: [PASS / FAIL / N/A]

**DOMAIN-04 — Tenant Data Isolation**
- Does this module handle tenant-specific data?
- Is tenant ID always explicitly scoped — never inferred from current state?
- Result: [PASS / FAIL / N/A]

**DOMAIN-05 — XSS / Injection**
- Does this module write to the DOM?
- Does it use textContent/createElement (safe) or innerHTML/document.write (unsafe)?
- Result: [PASS / FAIL / N/A]

**DOMAIN-06 — Data Persistence Privacy**
- Does this module write to localStorage, IndexedDB, sessionStorage, or cookies?
- Is the key structure unpredictable (includes UUID)?
- Is sensitive data encrypted at rest?
- Result: [PASS / FAIL / N/A]

**DOMAIN-07 — Speech API Privacy**
- Does this module use Web Speech API?
- Is the user warned that voice data exits the browser?
- Is there a text-only fallback for privacy-sensitive clients?
- Result: [PASS / FAIL / N/A]

**DOMAIN-08 — EU AI Act Article 50**
- Does this module initiate or manage conversation greeting?
- Does the greeting explicitly identify the system as AI before any data collection?
- Result: [PASS / FAIL / N/A]

**DOMAIN-10 — Error Message Leakage**
- Do error messages expose internal file paths, config values, or stack traces?
- Result: [PASS / FAIL / N/A]

---

## SECURITY SYNC CONTRACTS

### SSYNC-01 — Webhook Authentication
**Contract**: Every outbound POST must include:
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-Webhook-Secret': config.webhook_secret
}
```
**Config requirement**: `webhook_secret` field must exist in all config files and validator.js REQUIRED_FIELDS.
**Status**: IN PROGRESS

### SSYNC-02 — EU AI Act Greeting Compliance
**Contract**: Every greeting string in every config file must explicitly identify the system as AI.
```json
"greetings": ["Hi! I'm [NAME], an AI assistant for [COMPANY]. How can I help you today?"]
```
**Status**: RESOLVED

### SSYNC-03 — Config Sensitive Field Protection
**Contract**: webhook_url and webhook_secret must not be exposed in publicly accessible files in production.
**Options**: Environment variables at hosting layer, thin backend endpoint, or runtime decryption.
**Status**: DECISION MADE — Option A

---

## FULL-FLOW SECURITY VALIDATION

Security tasks must be validated across their full flow, not just at the module boundary. Apply these mappings during T03, T04, and T06:

| Task | Must Validate Across |
|------|----------------------|
| HMAC | request → verification → rejection path |
| Sanitization | input → NLP → output |
| TCPA | UI → consent capture → mic unlock |
| Privacy disclosure | voice + fallback text |
| localStorage | key generation → isolation |

---

## SECURITY ESCALATION RULES

- HIGH severity findings block T05 for that module until a mitigation plan is documented
- A mitigation plan = documented approach + target pass number (full fix not required this pass)
- SEC-01 mitigation plan required before T07 closes Pass 1
- SEC-05 must be fully resolved in T05 Pass 1 — it is a config edit, not engineering work
- SSYNC-01 full implementation target: Pass 2

---

## SECURITY REVIEW SIGN-OFF (Add to T03 completion)

```
SEC_AUDIT_COMPLETED     = [YES/NO]
SEC_NEW_FINDINGS        = [NUMBER beyond already-known SEC-01 through SEC-08]
SEC_HIGH_SEVERITY       = [COUNT]
SEC_MEDIUM_SEVERITY     = [COUNT]
SEC_LOW_SEVERITY        = [COUNT]
SEC_BLOCKING_T05        = [YES/NO]
```
