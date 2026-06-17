# Phase 2 Security Notes

Items consciously deferred — not bugs, but decisions to revisit before production PHI.

## JWT storage (`localStorage`)

**Current:** Dashboard stores JWT in `localStorage` (`medvoice_token`).

**Risk:** Any XSS on the dashboard origin can exfiltrate the token and access all tenant PHI via API.

**Mitigation before pilot with real PHI:**
- `httpOnly` + `Secure` + `SameSite` session cookie
- Short-lived access token + refresh rotation
- CSP headers on dashboard static assets

**Status:** Filed at Sprint 2.1. Dev-only acceptable for now.

## Tenant scope resolution

**Verified (see `tests/auth.test.js` hostile suite):**
- Clinic users: `req.tenantId` comes **only** from JWT; `?client=` is rejected on mismatch, ignored on match
- Super admins: `?client=` override is **role-gated** in `requireDashboardAuth` (clinic users cannot use super-admin branch)
- Dashboard GET handlers use `req.tenantId`, not `req.query.client`
- `GET /api/sessions/:id` returns **403** cross-tenant (not 200 with data)
- Leads / emergency: list-only APIs (no `:id` detail routes yet); list filtered by tenant

**Future hardening (optional):**
- Return **404** instead of **403** on cross-tenant session ID to reduce enumeration (low priority with UUIDv7 call IDs)
- `canAccessLead` / `canAccessEmergencyEvent` deny when `req.user` or `req.tenantId` cannot be established (fail-closed scaffolds in `clinic-auth.js`)

## Lead data quality (product, not security)

Spike captured `name: Jane`, `phone: null` — model only saved what caller said. Prompt/schema should nudge phone collection before marking lead complete.
