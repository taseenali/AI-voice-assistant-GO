# Phase 2 — Keep Notes (deferred / filed)

Items consciously skipped or deferred. Check here before assuming something was forgotten.

---

## Security & auth

| Item | Status | Notes |
|------|--------|-------|
| JWT in `localStorage` | **Deferred** | XSS-readable. Move to `httpOnly` cookie before production PHI. See `PHASE-2-SECURITY-NOTES.md`. |
| Cross-tenant session ID → 404 | **Low priority** | 403 confirms row exists; UUIDv7 call IDs are unguessable. Fine to keep 403. |
| Recording proxy through backend | **Before production** | Do not expose raw `storage.vapi.ai` URLs in the browser. Spike HEAD 200 proves URLs are currently **public** — PHI risk, not a green light. Proxy via tenant-scoped `/api/recordings/:sessionId` so Play inherits JWT regardless of whether Vapi gates them. |
| `PLATFORM_REQUIRE_AUTH=true` in prod | **Pending** | Flip when all dashboard routes wired. |
| Deprecate `?client=` on write routes | **Pending** | Widget POSTs still use `client_id` in body. |

## Product / conversation design

| Item | Status | Notes |
|------|--------|-------|
| `phone` required on `capture_lead` | **High — conversation design** | Jane lead `phone: null` + scoring allows 50% (name+reason) without phone. Agent must ask for callback number; consider required in tool schema. |
| Session `phoneNumber` vs lead `phone` | **Verified 2.2** | Session row = caller E.164 from `call.customer.number` (end-of-call). Lead row = what patient said. UI uses `session.phoneNumber` only — do not cross-wire. |

## Dashboard / UI

| Item | Status | Notes |
|------|--------|-------|
| Super-admin UI `/admin/*` | **Sprint 2.4 done** | Thin client: `GET /api/admin/tenants` + sidebar tenant switcher sets `?client=` scope on existing clinic routes. No new privileged queries. |
| Super-admin `viewingTenantId` in localStorage | **Think before writes** | Stale-scope mistake risk (admin thinks they're on B, persisted A). Consider persistent banner when scoped; fresh session default vs restore last tenant. Sharpens when super-admin gets write paths. |
| Editable tenant config | **Phase 2+** | Read-only from `tenant_config` DB. |
| Call recording playback proxy | **Before production** | Raw Vapi URLs are publicly fetchable today. Proxy through backend; never ship direct links to clinic owners in prod. |
| Mobile dashboard | **Out of scope v1** | Desktop 1200px+ only. |
| RBAC UI (admin vs staff) | **Later** | Same API scope for now. |

## Vapi / phone runtime

| Item | Status | Notes |
|------|--------|-------|
| Spike mode (`VAPI_SPIKE_MODE`) | **Active** | `capture_lead` only assistant. Full tools after call #2. |
| Calendar call #2 latency spike | **Not done** | Measure `check_availability` + `book_appointment` on live call. |
| Fixture refresh | **Ongoing** | `_fixtureMeta.capturedAt` on contracts; re-capture after Vapi drift. |
| `arguments` object vs string | **Documented** | Webhook = object; `artifact.messages[]` = string. |

## Calendar / appointments

| Item | Status | Notes |
|------|--------|-------|
| `calendar_enabled: false` on medical-clinic | **Current** | Enable when Google SA + shared calendar ready. |
| Appointments write from dashboard | **Read-only v1** | Book via phone agent only. |
| Calendar tool error path on live call | **Sprint 2.3 done** | `tests/calendar-tool-errors.test.js` — unavailable slot, API down, handleToolCalls 200-shaped strings. Live call #2 still pending. |
| Appointments dashboard panel | **Sprint 2.3 done** | Read-only `GET /api/appointments`; disabled state when `calendar_enabled: false`. |
| Local `appointments` SQLite table | **Optional later** | v1 lists Google Calendar events directly. |

## Infrastructure / later phases

| Item | Status | Notes |
|------|--------|-------|
| HIPAA hosting + BAAs | **Phase 4** | |
| Stripe / billing UI | **Phase 4** | |
| PostgreSQL migration | **Before 10+ clinics** | |
| Server-side outbound webhook worker | **Phase 3** | |
| Audit log on PHI reads | **Phase 3+** | Schema exists, no dashboard API. |

## Previously missed (caught during spike — do not regress)

1. **Phone → tenant mapping** — live Vapi number must be in `phone_numbers` seed; fixture used dev number.
2. **`message.phoneNumber.number`** — dialed line; `call.phoneNumber` null on SIP.
3. **Nested `function.arguments` object** — live tool-calls shape; fixture was flat.
4. **Auth GET handlers** — must never use `req.query.client` as scope (invariant test in `auth.test.js`).
5. **Tool errors** — Vapi requires HTTP 200 + `results[].result` error string, not 5xx.

---

*Last updated: Phase 2 closed; post-2.4 notes*
