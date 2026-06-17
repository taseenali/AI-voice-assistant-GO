# Spike Discrepancy Log

Record every difference between `captures/*.json` (reality) and `contracts/vapi/*.json` (fixtures).

**Format per entry:**

```
## [date] — [event type]

| Field (fixture) | Fixture value | Capture value | Action taken |
|-----------------|---------------|---------------|--------------|
| message.toolCallList | [...] | ... | Updated fixture + normalize-tool-calls.js |
```

---

## Entries

## 2026-06-16 — assistant-request (live call #1–4)

| Field (fixture) | Fixture value | Capture value | Action taken |
|-----------------|---------------|---------------|--------------|
| `message.call.phoneNumber` | `{ number: "+15559876543" }` | `null` | Fixture updated: `call.phoneNumber` is null on live Vapi SIP calls |
| `message.phoneNumber.number` | *(missing)* | `"+18564402211"` | Fixture updated: dialed number lives at message-level `phoneNumber` |
| `message.customer.number` | *(missing)* | caller E.164 (varies) | Fixture updated with placeholder caller |
| `phone_numbers` seed | `+15559876543` only | live dialed `+18564402211` | Seeded `+18564402211` → `medical-clinic` |

**Handler path:** `message.call.phoneNumber.number` \|\| `message.phoneNumber.number` — second path is correct for live calls; failure was missing DB mapping, not wrong field path.

**Server log:** `No tenant mapped for this phone number` (before fix; now logs attempted E.164).

## 2026-06-16 — tool-calls (live call, Spike Receptionist, 1m58s)

| Field (fixture) | Fixture value | Capture value | Action taken |
|-----------------|---------------|---------------|--------------|
| Array path | `message.toolCallList[]` only | **Both** `message.toolCalls[]` and `message.toolCallList[]` (mirrored) | `normalize-tool-calls.js` already prefers `toolCallList` then `toolCalls` — no handler change |
| Item shape | flat `{ id, name, arguments }` | nested `{ id, type, function: { name, arguments } }` | Normalizer reads `nested.function.name` / `nested.function.arguments` — works |
| `arguments` type (webhook) | object | **object** `{ name: "Jane", reason_for_visit: "checkup" }` | `parseArguments` handles object; also handles string in artifact transcript path |
| `arguments` type (artifact transcript) | *(n/a)* | **string** `'{"name": "Jane", "reason_for_visit": "checkup"}'` | Only in `artifact.messages[]`; webhook payload uses object |
| Tool name | `check_availability` (fixture) | `capture_lead` | Spike fixture still tests `check_availability`; live validated via `contracts/vapi/tool-calls.capture.json` |
| `tenant_id` source | `message.assistant.metadata` | `message.assistant.metadata.tenant_id` + `message.call.assistant.metadata` | `extractTenantId` reads both — works |
| Extra arrays | *(none)* | `toolWithToolCallList[]` | Normalizer fallback path exists; not needed this call |

**toolCallId:** `call_5uPHkWX1whWn1HGJ8rB6tina`  
**DB proof:** `leads` row `lead_id=5`, `name=Jane`, `reason_for_visit=checkup`, `session_id=019ed232-18df-7000-8a28-b475bde2143e`  
**Response shape:** Handler returned `{ results: [{ toolCallId, result }] }` — call continued 1m58s; Vapi log shows success.

## 2026-06-16 — end-of-call-report (same call)

| Field | Fixture | Capture | Notes |
|-------|---------|---------|-------|
| Transcript location | `message.artifact.transcript` (string) | `message.artifact.messages[]` (rich array) + analysis | Handler reads both paths |
| Phone on call | `call.phoneNumber.number` | `message.phoneNumber.number` (call.phoneNumber often null) | Same drift as assistant-request |

**Spike status:** Full loop proven — `assistant-request` → `tool-calls` → DB write → `end-of-call-report`.

**Wire-shape traps (do not forget):**
- Webhook `tool-calls`: `function.arguments` is an **object**
- `artifact.messages[]` transcript replay: `arguments` is a **JSON string**
- Fixtures dated 2026-06-16 in `_fixtureMeta`; re-capture after Vapi changes

