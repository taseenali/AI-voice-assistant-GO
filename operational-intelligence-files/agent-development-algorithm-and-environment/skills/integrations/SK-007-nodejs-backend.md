# SKILL: Node.js Backend Architecture
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-007"
SKILL_NAME        = "Node.js Backend Architecture"
SKILL_CATEGORY    = "integrations"
SKILL_VERSION     = "1.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-04-30"
SKILL_LAST_USED   = "2026-04-30"
APPLIES_TO_PASS   = "5 onwards"
RELEVANT_FILES    = "server/index.js, api/config.js, api/llm-proxy.js, package.json"
```

---

## WHAT THIS SKILL IS FOR

The MedVoice AI platform requires a Node.js backend server to solve three problems the browser cannot: serving config secrets without exposing them publicly (SEC-02/SSYNC-03), proxying Ollama so clients do not need local model setup, and handling Twilio webhooks for phone integration in future passes. This skill governs how that backend is structured, what it must and must not do, and how the frontend communicates with it.

---

## WHEN TO USE THIS SKILL

Use this skill when:
- Building any file in `server/` or `api/`
- Modifying how `loadConfig()` fetches configuration
- Adding any server-side endpoint
- Setting up environment variables for production

Do NOT use this skill when:
- Modifying browser-side JS modules (use SK-001)
- Working on config file structure (use SK-003, SK-011)
- Working on security patterns (use SK-005)

---

## THE PATTERNS

---

### Pattern 1 — Server Structure

**Rule**: The Node.js backend is a thin API server. It does not contain business logic. All conversation logic stays in the browser. The backend handles only: config serving, secret injection, LLM proxying, and external webhooks.

**Correct folder structure:**
```
server/
├── index.js          ← Express/Fastify entry point
├── routes/
│   ├── config.js     ← GET /api/config?client=medical-clinic
│   ├── llm-proxy.js  ← POST /api/llm (proxies to Ollama)
│   └── health.js     ← GET /health (uptime check)
├── middleware/
│   ├── auth.js       ← API key validation
│   └── cors.js       ← CORS for widget embedding
└── .env              ← NEVER commit — contains real secrets
```

---

### Pattern 2 — Config Serving Endpoint (G-043 / SSYNC-03)

**Rule**: The config endpoint merges the public config JSON with secrets from environment variables. The browser never receives secrets directly. The public config files contain only non-sensitive fields.

**WRONG — browser fetches config directly:**
```javascript
// js/config/loader.js — BEFORE (exposes secrets)
const res = await fetch(`/configs/${clientId}.json`);
// webhook_secret is in the JSON file — publicly readable
```

**CORRECT — browser fetches from backend endpoint:**
```javascript
// js/config/loader.js — AFTER
const res = await fetch(`/api/config?client=${clientId}`);
// Backend merges public config with secrets from env vars
```

**Server-side config endpoint:**
```javascript
// server/routes/config.js
import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';

const router = express.Router();

router.get('/config', (req, res) => {
  const clientId = req.query.client || 'medical-clinic';
  
  // Validate clientId — prevent path traversal
  if (!/^[a-z0-9-]+$/.test(clientId)) {
    return res.status(400).json({ error: 'Invalid client ID' });
  }
  
  try {
    // Read public config (no secrets)
    const configPath = path.join(process.cwd(), 'configs', `${clientId}.json`);
    const publicConfig = JSON.parse(readFileSync(configPath, 'utf8'));
    
    // Inject secrets from environment variables
    const secureConfig = {
      ...publicConfig,
      webhook_url:    process.env[`${clientId.toUpperCase()}_WEBHOOK_URL`]    || '',
      webhook_secret: process.env[`${clientId.toUpperCase()}_WEBHOOK_SECRET`] || '',
      ollama_endpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434'
    };
    
    res.json(secureConfig);
  } catch (err) {
    console.error('[Config] Failed to load config:', err.message);
    res.status(404).json({ error: 'Config not found' });
  }
});

export default router;
```

**Environment variables required (.env):**
```
MEDICAL_CLINIC_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxx
MEDICAL_CLINIC_WEBHOOK_SECRET=your-real-hmac-secret-here
OLLAMA_ENDPOINT=http://localhost:11434
PORT=3001
```

---

### Pattern 3 — LLM Proxy Endpoint

**Rule**: In production, the browser cannot call `localhost:11434` because Ollama is not running on the client's machine. The Node.js backend proxies LLM requests so the browser talks to the server, not directly to Ollama.

```javascript
// server/routes/llm-proxy.js
import express from 'express';

const router = express.Router();

router.post('/llm', async (req, res) => {
  const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
  
  try {
    const response = await fetch(`${ollamaEndpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    // Stream the response back to the browser
    res.setHeader('Content-Type', 'application/x-ndjson');
    response.body.pipeTo(
      new WritableStream({
        write(chunk) { res.write(chunk); },
        close() { res.end(); }
      })
    );
  } catch (err) {
    console.error('[LLM Proxy] Ollama unavailable:', err.message);
    res.status(503).json({ error: 'LLM unavailable' });
  }
});

export default router;
```

**Frontend adapter update** — `js/services/llm-adapter.js`:
```javascript
// Instead of calling Ollama directly:
const endpoint = config.ollama_endpoint || 'http://localhost:11434';

// In production, call the backend proxy:
const endpoint = process.env.NODE_ENV === 'production'
  ? '/api/llm'
  : (config.ollama_endpoint || 'http://localhost:11434');
```

---

### Pattern 4 — Server Entry Point

```javascript
// server/index.js
import express from 'express';
import cors from 'cors';
import configRouter from './routes/config.js';
import llmRouter from './routes/llm-proxy.js';
import healthRouter from './routes/health.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Routes
app.use('/api', configRouter);
app.use('/api', llmRouter);
app.use('/', healthRouter);

// Start
app.listen(PORT, () => {
  console.log(`[MedVoice Server] Running on port ${PORT}`);
});
```

---

### Pattern 5 — Frontend Config Loader Update

When the backend is live, update `js/config/loader.js` to fetch from the backend:

```javascript
// BEFORE (direct file fetch — exposes secrets)
const res = await fetch(`/configs/${clientId}.json`);

// AFTER (backend fetch — secrets injected server-side)
const apiBase = import.meta.env.VITE_API_BASE || '';
const res = await fetch(`${apiBase}/api/config?client=${clientId}`);
```

Add to `vite.config.js` for local development:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

---

## REAL EXAMPLE FROM THIS CODEBASE

**Pass 5, G-042/G-043 — First Backend Build**

SEC-02 was identified in Pass 1 as MEDIUM severity: config files publicly fetchable. SSYNC-03 decision (Option A — Netlify/Vercel edge function) was made in Pass 1 T05 but deferred to Pass 5. This skill codifies the implementation pattern for that decision.

The problem before this skill:
- `configs/abc-roofing.json` contained `webhook_url` and `webhook_secret` in plaintext
- Any user who inspected network traffic could see the n8n webhook URL
- Anyone who found the URL could POST fake patient data to n8n

The solution this skill establishes:
- Public config files contain only non-sensitive fields
- Backend endpoint injects secrets from environment variables at request time
- Browser never receives `webhook_secret` — only the backend uses it for HMAC signing

---

## GOTCHAS

1. **`loader.js` must be updated in sync with the backend route** — if you add the backend but do not update `loader.js` to call `/api/config` instead of `/configs/*.json`, the browser will still fetch the exposed config file directly. Both must change together.

2. **Vite proxy is for development only** — in production (Netlify/Vercel), configure redirects to point `/api/*` to your backend. The Vite proxy config does not affect the production build.

3. **Environment variable naming convention** — use `CLIENTID_WEBHOOK_SECRET` format (uppercased client ID). If the client ID is `medical-clinic`, the env var is `MEDICAL_CLINIC_WEBHOOK_SECRET`. Dashes become underscores.

4. **CORS must be configured for the widget embed domain** — if a clinic embeds the widget on `www.citymedical.com`, that domain must be in `ALLOWED_ORIGINS`. Without it, the browser blocks all API calls.

5. **`sec-09` placeholder secret** — `configs/medical-clinic.json` currently contains `"webhook_secret": "test_secret_123"`. When the backend is live, this field should be removed from the JSON entirely and served only from the environment variable.

---

## SYNC CONTRACTS AFFECTED

- **SSYNC-03**: Config sensitive fields no longer in public files — PASS when backend is live
- **SEC-02**: Config exposure resolved — RESOLVED when backend is live
- **SEC-09**: Placeholder secret replaced — RESOLVED when real env var is set
- **SYNC-01**: Config shape must remain identical — backend endpoint returns same shape as file

---

## SKILL SIGN-OFF

| Pass | Date | Agent | Files Modified | Outcome |
|------|------|-------|----------------|---------|
| 5 | 2026-04-30 | Antigravity | server/index.js, server/routes/config.js | G-042/G-043 complete |
