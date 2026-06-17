# Emergency Detection — Phone Channel Design

> **Decision required.** This documents the fork consciously, not by default.

## The conflict

| Channel | Emergency path | Deterministic? |
|---------|----------------|----------------|
| **Web widget (legacy)** | `js/modules/emergency-detector.js` runs **before** LLM on every message | ✅ Yes |
| **Phone (Vapi)** | `log_emergency` tool fires only when **LLM decides** to call it | ❌ No (unless supplemented) |

Outsourcing orchestration to Vapi reintroduces probabilistic emergency detection unless we add a layer we control.

## Decision (current)

**Hybrid — deterministic scan on transcript events + LLM tool as backup.**

1. **`transcript` / `speech-update` webhooks** → `server/platform/safety/transcript-scanner.js` keyword-scans every caller utterance
2. On match → log to `emergency_events`, mark session, optionally inject escalation (future: Vapi Live Call Control)
3. **`log_emergency` tool** remains as LLM-initiated backup, not primary safety gate

This preserves the principle: *safety-critical paths must not rely solely on generative AI reasoning.*

## What we explicitly accept

- Phone channel emergency detection is **less immediate** than web (depends on transcript event latency)
- Until Live Call Control is wired, deterministic scan **logs** but cannot interrupt mid-utterance
- LLM may still miss emergencies that don't match keywords — keyword list must be maintained per tenant

## What we do NOT accept

- Emergency safety relying **only** on `log_emergency` tool calls
- Importing from `js/modules/emergency-detector.js` into platform (isolation boundary) — patterns are duplicated in `transcript-scanner.js`

## Future hardening

- [ ] Vapi Live Call Control: inject emergency message + transfer on deterministic match
- [ ] Per-tenant keyword list from `tenant_config.emergency_keywords`
- [ ] Audit log entry on every deterministic trigger

## Web channel

Unchanged. Legacy `emergency-detector.js` remains the gate for browser widget. Frozen, not extended.
