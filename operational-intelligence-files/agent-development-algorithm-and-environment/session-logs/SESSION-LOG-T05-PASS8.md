# Session Log T05-PASS8
Date: 2026-05-02
Loop Pass: 8
Template: T05 Build
Agent: Claude Sonnet 4.6

## Pass Goal (Redirected by Owner)
Original G-044 Calendar goal redirected to: **P0 Enterprise Ship Blockers** — all 5 actionable
items from the enterprise improvement plan.

---

## Build Items Completed

### P0-1 — Tap-to-Start Overlay (Chrome TTS Autoplay Gate)
**Problem**: `_startConversation()` called on boot with no user gesture → Chrome TTS autoplay
policy blocked the greeting utterance silently every time.
**Fix**:
- Added full-page `#tap-to-start-overlay` div to `index.html` — shows company name (from config)
  and a "Tap to Begin" CTA button.
- Replaced `_startConversation()` call in `_boot()` with `_bindTapToStart()`.
- `_bindTapToStart()` calls `speechIO.unlockAudio()` synchronously inside the click handler
  (satisfies Chrome's user-gesture gate), then calls `_startConversation()`.
- Greeting TTS now fires reliably on first session open.

**Files changed**: `index.html`, `js/app.js`

---

### P0-2 — service_summary Always "medical care" Bug
**Problem**: `router-handlers.js:_buildServiceSummary()` mapped `s.name` but config uses
`display_name`. All configs have `display_name` only → names array was always empty → hardcoded
"medical care" fallback every time.
**Fix**: Changed `s.name` to `s.display_name || s.name` at `js/router/router-handlers.js:149`.

**Files changed**: `js/router/router-handlers.js`

---

### P0-3 — LLM Closing Flow (SKIPPED — SK-014 Conflict)
SK-014 DO NOT rule #6 explicitly prohibits LLM-generated ACT.CLOSE / ACT.EXIT / ACT.ENDED
responses for medical/legal safety. The enterprise plan item to expand LLM into closing contradicts
this. **Decision: keep closing deterministic. P0-3 not implemented. Deviation logged here.**

---

### P0-4 — Backend LLM Proxy (Browser → /api/llm/chat → Ollama)
**Problem**: Browser called `http://localhost:11434/api/chat` directly, exposing `ollama_endpoint`
in the public config payload — a security issue for production deployments.
**Fix**:
- Created `server/routes/llm-proxy.js` — POST `/api/llm/chat` proxies to Ollama using
  server-side `OLLAMA_ENDPOINT` env var; GET `/api/llm/health` for availability check.
  Supports both streaming (SSE, `stream: true`) and non-streaming modes.
- Registered route in `server/index.js`.
- Stripped `ollama_endpoint` from public config response in `server/routes/config.js`.
- Replaced `OllamaProvider` in `js/services/llm-adapter.js` with `ProxyProvider` — all LLM
  calls now go to `/api/llm/chat`; browser never touches Ollama directly.

**Files changed**: `server/routes/llm-proxy.js` (new), `server/index.js`, `server/routes/config.js`,
`js/services/llm-adapter.js`

---

### P0-5 — LLM Streaming TTS (onToken → speakChunk)
**Problem**: `orchestrator.processInput()` accepts `onToken` but app.js always passed `null`.
LLM responses were never streamed to TTS — they waited for full response then called `speak()`.
**Fix**:
- Added `speakChunk(text)` to `SpeechIO` — queues a single utterance immediately without
  resetting the active speech token (so sequential chunks play in order).
- Wired `onToken` callback in `_processUserInput()` in `app.js` — fires `speakChunk()` per
  punctuation-buffered chunk from the LLM proxy.
- Added `streamedSpeech` flag — skips `speak()` call if streaming already handled TTS.

**Files changed**: `js/speech-io.js`, `js/app.js`

---

### P0-6 — Conversation Audit Logging
**Problem**: No server-side record of conversation turns — zero auditability, no HIPAA trail.
**Fix**:
- Created `server/routes/log.js` — POST `/api/log/conversation`, validates payload, writes
  structured JSON line to stdout (swap for DB/SIEM in production).
- Registered route in `server/index.js`.
- Created `js/services/conversation-logger.js` — `ConversationLogger` singleton; assigns a
  `sessionId` per page load; `log()` fires-and-forgets POST (failures are silent — must not
  block conversation pipeline).
- Wired into `response-orchestrator.js` after each pipeline turn — logs both user input and
  assistant response with state/intent metadata.

**Files changed**: `server/routes/log.js` (new), `server/index.js`, `js/services/conversation-logger.js` (new),
`js/response-orchestrator.js`

---

## New Files Created
| File | Purpose |
|------|---------|
| `server/routes/llm-proxy.js` | Backend Ollama proxy — P0-4 |
| `server/routes/log.js` | Conversation audit log endpoint — P0-6 |
| `js/services/conversation-logger.js` | Client-side log dispatcher — P0-6 |

## Security Changes
| Change | Impact |
|--------|--------|
| `ollama_endpoint` stripped from `/api/config` response | Browser no longer leaks internal Ollama address |
| All LLM calls proxied through `/api/llm/chat` | `OLLAMA_ENDPOINT` is now a server-only secret |

## Sync Contract Impact
| Contract | Status |
|----------|--------|
| SYNC-01 (config shape) | Unaffected — `ollama_endpoint` removed from payload but was never a required client field |
| SSYNC-03 (sensitive fields not public) | IMPROVED — `ollama_endpoint` now removed from public config |

---

### **T05 COMPLETION SIGN-OFF**
```
T05_COMPLETED           = YES
T05_DATE                = 2026-05-02
T05_P0_ITEMS            = 5/5 actionable (P0-3 skipped per SK-014)
T05_NEW_FILES           = 3
T05_MODIFIED_FILES      = 7
T05_SEC_REGRESSIONS     = 0
T05_SYNC_REGRESSIONS    = 0
ADVANCE_TO_T06          = YES
```
