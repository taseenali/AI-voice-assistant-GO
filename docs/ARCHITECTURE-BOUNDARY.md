# Architecture Boundary — Legacy vs Platform

Quick reference. Full plan: [CONTRACT-FIRST-PLAN.md](./CONTRACT-FIRST-PLAN.md)

## Platform (active development)

| Path | Purpose |
|------|---------|
| `server/platform/` | Control plane: auth, tenants, tools, Vapi handler |
| `server/routes/vapi.js` | Vapi webhook entry |
| `server/routes/tools.js` | Standalone tool testing |
| `server/routes/auth.js` | JWT login |
| `contracts/vapi/` | Official payload fixtures |

## Legacy (frozen — demo only)

| Path | Purpose | Rule |
|------|---------|------|
| `js/response-orchestrator.js` | Browser conversation FSM | No new features |
| `js/speech-io.js` | Web Speech API | No phone use |
| `server/routes/voice.js` | Twilio ConversationRelay | Do not extend |
| `configs/*.json` | Seed data only | DB is source of truth |

## Phone call path (target)

```
Twilio → Vapi → POST /api/vapi/webhook → server/platform/tools/* → SQLite
```

Never: `Twilio → voice.js → WebSocket → js/speech-io.js`

## Current gate

**Phase 1.5 live spike** must pass before Phase 2 dashboard work.  
See [PHASE-3-SPIKE.md](./PHASE-3-SPIKE.md).
