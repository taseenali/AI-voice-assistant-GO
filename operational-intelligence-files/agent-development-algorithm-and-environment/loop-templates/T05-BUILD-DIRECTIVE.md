# T05 — BUILD DIRECTIVE
## Template: Controlled Construction Pass

> **AGENT INSTRUCTIONS**: Code is written ONLY here. Work from FILES_ALLOWED_TO_MODIFY in PROJECT-VARS.md. Fix every functional bug AND security issue flagged by T03/T04 for allowed files. Update MODULE-REGISTRY.md after each file change.

---

## PRE-BUILD CHECKLIST
- [ ] T01 HEALTH is AMBER or GREEN
- [ ] T02 research insights reviewed
- [ ] T03 module issues for allowed files all known
- [ ] T04 failing contracts for allowed files all known
- [ ] FILES_ALLOWED_TO_MODIFY confirmed from PROJECT-VARS.md
- [ ] FILES_FORBIDDEN_TO_MODIFY confirmed from PROJECT-VARS.md

**Allowed files this pass**:
```
js/services/webhook-dispatcher.js
js/modules/lead-capture.js
configs/default.json
configs/abc-roofing.json
js/config/validator.js
blueprint/BLUEPRINT-CURRENT.md
```

---

## TASK 1 — Fix P0 Functional Bugs

### BUG-01 + SEC-06: webhook-dispatcher.js — Remove fallback URL
- [ ] Locate fallback in `_attemptDelivery()` — the `AppContext.getConfig().webhook_url` line
- [ ] Replace with hard throw: `if (!url) throw new Error('No webhook_url captured at dispatch time — tenant isolation violation')`
- [ ] Verify `_processQueue()` handles the thrown error correctly
- [ ] Confirm SYNC-03 passes after fix
- Changes made: [DESCRIBE + line numbers]

### BUG-02: lead-capture.js — Fix tenure field
- [ ] Read constructor's initial `_leadData` object
- [ ] Read `reset()` method's `_leadData` object
- [ ] Add `tenure: null` to constructor OR remove from reset() — both shapes must be identical
- [ ] Confirm SYNC-03 payload shape unchanged
- Changes made: [DESCRIBE]

### BUG-03: Rebuild dist/
- [ ] Run `npm run build`
- [ ] Confirm dist/ file dates now match source dates
- Changes made: [DESCRIBE]

---

## TASK 2 — Fix P0 Security Issues

### SEC-05 + SSYNC-02: EU AI Act greeting compliance
- [ ] Read all greeting strings in configs/default.json
- [ ] Read all greeting strings in configs/abc-roofing.json
- [ ] For each non-compliant string, add explicit AI disclosure
- [ ] Format: "Hi! I'm [NAME], an AI assistant for [COMPANY]. [rest of greeting]"
- [ ] Confirm every greeting now satisfies SSYNC-02 contract
- Changes made: [QUOTE before/after for each string changed]

### SYNC-04 + SSYNC-01 prep: validator.js — Add webhook_secret
- [ ] Add `webhook_secret` to REQUIRED_FIELDS array in validator.js
- [ ] Add `webhook_secret: ''` to emergency fallback in loader.js (if in allowed files)
- Changes made: [DESCRIBE]

---

## TASK 3 — Document Mitigation Plans (G-008 + G-025)

### SEC-01 Mitigation Plan (webhook authentication)
Document in this T05 output — no code required yet:

```
SEC-01 MITIGATION PLAN:
Approach: HMAC-SHA256 signature on all webhook POST requests
Implementation:
  1. Add webhook_secret field to all config files (done above via validator)
  2. In webhook-dispatcher.js _attemptDelivery(), compute:
     const signature = await crypto.subtle.sign('HMAC', key, payload)
     headers['X-Webhook-Secret'] = btoa(signature)
  3. In n8n webhook node: add header validation step
Target pass: Pass 2 (G-009)
```

### SSYNC-03 Architectural Decision (config protection)
Document chosen approach:

```
SSYNC-03 DECISION:
Chosen approach: [SELECT ONE]
  Option A — Netlify/Vercel environment variables + thin API endpoint for config
  Option B — Runtime decryption with deployment-time key injected via build env
  Option C — Accept risk for now — Tier 1 clients are SMB, webhook URLs are low value
Rationale: [FILL]
Target pass for full implementation: [FILL]
```

---

## TASK 4 — Blueprint Update
- [ ] Update blueprint/BLUEPRINT-CURRENT.md with all changes from this pass

---

## CODE QUALITY CHECKLIST (per modified file)

**webhook-dispatcher.js**:
- [ ] All async functions have try/catch
- [ ] No hardcoded strings where enums exist
- [ ] BUG-01 fix: throw instead of fallback
- [ ] SYNC-03, SYNC-05, SYNC-06 pass

**lead-capture.js**:
- [ ] _leadData shape identical in constructor and reset()
- [ ] SYNC-03 payload shape unchanged

**configs/*.json**:
- [ ] All greetings include AI disclosure
- [ ] webhook_secret field added with placeholder value

**validator.js**:
- [ ] webhook_secret in REQUIRED_FIELDS

---

## BUILD SUMMARY

**Files modified**: [LIST]
**Bugs resolved**: [LIST by ID]
**Security issues addressed**: [LIST by ID]
**Mitigation plans documented**: [LIST]
**Deferred to next pass**: [LIST + reason]

---

## T05 COMPLETION SIGN-OFF

```
T05_COMPLETED         = [YES/NO]
T05_DATE              = [DATE]
T05_FILES_MODIFIED    = [LIST]
T05_BUGS_FIXED        = [LIST]
T05_SEC_FIXED         = [LIST]
T05_PLANS_DOCUMENTED  = [LIST]
T05_DEFERRED          = [LIST]
ADVANCE_TO_T06        = [YES/NO]
```
