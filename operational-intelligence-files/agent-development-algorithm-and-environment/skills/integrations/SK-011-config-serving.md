# SKILL: Config Serving Pattern
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-011"
SKILL_NAME        = "Config Serving — Secret Injection Pattern"
SKILL_CATEGORY    = "integrations"
SKILL_VERSION     = "1.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-04-30"
SKILL_LAST_USED   = "2026-04-30"
APPLIES_TO_PASS   = "5 onwards"
RELEVANT_FILES    = "api/config.js, js/config/loader.js, configs/*.json, vite.config.js"
```

---

## WHAT THIS SKILL IS FOR

Config files in MedVoice AI must be split into two parts: a public part (safe to fetch from the browser) and a secret part (webhook URLs, HMAC secrets, API keys). This skill defines the exact pattern for implementing SSYNC-03 Option A — serving merged configs from the Node.js backend with secrets injected from environment variables. It resolves SEC-02 and SEC-09 permanently.

---

## WHEN TO USE THIS SKILL

Use this skill when:
- Implementing G-043 (config serving migration)
- Adding any new sensitive field to a config file
- Modifying `js/config/loader.js` fetch logic
- Setting up Netlify/Vercel deployment environment

---

## THE PATTERN

### What Stays in the JSON File (Public — Safe)
```json
{
  "company_name": "MedVoice Clinic",
  "assistant_name": "Aria",
  "role": "AI medical receptionist",
  "tone": "warm, calm, professional",
  "primary_goal": "book_appointment",
  "ai_tier": 2,
  "llm_model": "llama3.1:8b",
  "greetings": ["..."],
  "services": [...],
  "emergency_keywords": [...],
  "service_domain_tokens": [...]
}
```

### What Moves to Environment Variables (Private — Server Only)
```
MEDICAL_CLINIC_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/xxx
MEDICAL_CLINIC_WEBHOOK_SECRET=your-real-256-bit-secret
OLLAMA_ENDPOINT=http://localhost:11434
```

### The Merge Happens Server-Side Only
The browser never sees `webhook_url` or `webhook_secret` in the network response. They are injected at the server and used only by the backend webhook dispatcher proxy.

---

## REAL EXAMPLE FROM THIS CODEBASE

**Pass 1, T05 — SSYNC-03 Decision**

The decision to use Option A was made in Pass 1 and documented in `SYNC-MAP.md`. The implementation was deferred to Pass 5. This skill captures the implementation of that decision.

Before: `configs/abc-roofing.json` contained `"webhook_url": ""` and `"webhook_secret": "test_secret_123"` in a publicly accessible JSON file — visible to any user who inspected network traffic.

After: JSON files contain only non-sensitive fields. Backend endpoint injects secrets from environment at request time. Browser never receives sensitive values.

---

## GOTCHAS

1. **loader.js must be updated on both paths** — it has two fetch paths (client-specific and default fallback). Both must be updated to call the backend endpoint. Missing one path means the default config still exposes secrets.

2. **Vite dev server proxy** — add to `vite.config.js` so local development works without CORS errors. Without it, the browser cannot reach the backend during development.

3. **Netlify redirects file** — on Netlify, add `_redirects` file: `/api/* https://your-backend.railway.app/api/:splat 200`. Without this, `/api/config` returns 404 on the deployed widget.

---

## SYNC CONTRACTS AFFECTED

- **SSYNC-03**: RESOLVED when this pattern is fully implemented
- **SEC-02**: RESOLVED — config files no longer contain sensitive fields
- **SEC-09**: RESOLVED — placeholder secret replaced with real env var

---

## SKILL SIGN-OFF

| Pass | Date | Agent | Files Modified | Outcome |
|------|------|-------|----------------|---------|
| 5 | 2026-04-30 | — | api/config.js, js/config/loader.js | G-043 target |
