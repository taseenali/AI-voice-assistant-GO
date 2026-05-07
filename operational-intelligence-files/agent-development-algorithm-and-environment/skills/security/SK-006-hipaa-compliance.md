# SKILL: HIPAA Compliance
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-006"
SKILL_NAME        = "HIPAA Compliance for Medical AI Platform"
SKILL_CATEGORY    = "security"
SKILL_VERSION     = "2.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-04-30"
SKILL_LAST_USED   = "2026-05-01"
APPLIES_TO_PASS   = "all"
RELEVANT_FILES    = "js/modules/lead-capture.js, js/services/webhook-dispatcher.js, js/services/outbox-db.js, configs/*.json, server/routes/config.js"
```

---

## WHAT THIS SKILL IS FOR

MedVoice AI collects Protected Health Information (PHI) — patient names, dates of birth, reasons for visit, and insurance information. Under HIPAA, any software that handles PHI in the context of healthcare is a Business Associate and must meet Technical, Administrative, and Physical safeguards. This skill maps every HIPAA requirement to actual code in this codebase and defines what must be done before the first real medical client is onboarded.

---

## WHEN TO USE THIS SKILL

Use this skill when:
- Adding any new patient data field to `lead-capture.js`
- Modifying how patient data is stored or transmitted
- Adding any new external vendor or service
- Reviewing deployment configuration
- Writing HIPAA BAA documentation

---

## THE PHI DATA FLOW IN THIS CODEBASE

```
Patient speaks/types
        │
        ▼
app.js _sanitizeInput()         ← js/app.js lines 328-338
        │ Truncate 500 chars, strip HTML
        ▼
response-orchestrator.js        ← In-memory processing only
        │ _step2_updateContext() stores entities in sm context
        ▼
lead-capture.js _leadData       ← js/modules/lead-capture.js lines 37-50
        │ { name, patient_type, dob, reason_for_visit, insurance_provider, insurance_id, urgency }
        ▼
lead-capture.js save()          ← Lines 178-195
        │ ⚠️  localStorage — NOT encrypted at rest
        ▼
webhookDispatcher.dispatch()    ← js/services/webhook-dispatcher.js lines 46-75
        │ HMAC-signed POST
        ▼
outboxDB (IndexedDB)            ← js/services/outbox-db.js
        │ ⚠️  Browser storage — NOT encrypted at rest
        ▼
Node.js backend                 ← server/routes/config.js
        │ Secret injection only — PHI does not transit here currently
        ▼
n8n webhook endpoint            ← External — BAA required if cloud n8n
```

**⚠️ WARNING POINTS:**
- `localStorage` (lead-capture.js save) — unencrypted browser storage
- `IndexedDB` (outbox-db.js) — unencrypted browser storage
- Both are acceptable for development. NOT acceptable for production with real patient data.

---

## HIPAA REQUIREMENTS MAPPED TO CODE

### Technical Safeguards

| Requirement | Status | Code Location | Notes |
|------------|--------|---------------|-------|
| Encryption in transit | ✅ DONE | webhook-dispatcher.js HTTPS + HMAC | All webhook POSTs over HTTPS with signature |
| Encryption at rest | ⚠️ DEV ONLY | lead-capture.js, outbox-db.js | localStorage + IndexedDB not encrypted |
| Access controls | ❌ NOT BUILT | — | No authentication system |
| Audit logs | ❌ NOT BUILT | — | console.log only |
| Automatic logoff | ✅ DONE | app.js — 5-minute inactivity timer | Line ~285 |
| Unique user ID | ❌ NOT BUILT | — | No user authentication |
| Emergency access | ✅ DONE | emergency-detector.js | Deterministic 911 redirect |

### Administrative Safeguards

| Requirement | Status | Action Required |
|------------|--------|----------------|
| BAA with vendors | ❌ OPEN — GAP-08 | Must be signed before first client |
| Risk assessment | ❌ NOT DONE | Document PHI flow + threat model |
| Incident response | ❌ NOT DOCUMENTED | Define breach response procedure |

---

## BAA VENDOR CHECKLIST (G-036)

**Must be completed before onboarding first medical client:**

| Vendor | PHI Exposure | BAA Available | Status |
|--------|-------------|--------------|--------|
| Ollama (self-hosted) | No — local only | N/A | ✅ No BAA needed |
| n8n (self-hosted) | YES — receives lead data | N/A | ✅ No BAA needed |
| n8n (cloud) | YES — receives lead data | Enterprise tier | ❌ MUST get BAA |
| Anthropic (Claude API) | YES if used for LLM | Enterprise only | ❌ MUST get BAA if used |
| Google Calendar API | YES — appointment data | ✅ Google BAA via GSuite | ❌ MUST sign Google BAA |
| Twilio | YES — voice transcripts | ✅ Available | ❌ MUST get BAA for Phase 2 |
| Deepgram | YES — voice transcripts | ✅ Available | ❌ MUST get BAA for Phase 2 |
| Netlify/Vercel | Static hosting only | Limited | Check current status |
| Railway/Render | Backend hosting | Limited | ❌ Must verify or use AWS |
| AWS | Full stack | ✅ HIPAA eligible | ✅ Recommended for production |

---

## MINIMUM NECESSARY STANDARD

HIPAA requires collecting ONLY what is needed for the specific purpose.

**COLLECT — justified for intake:**
```
name              → patient identification
dob               → identity verification
patient_type      → workflow routing (new vs returning)
reason_for_visit  → clinical triage
insurance_provider → billing routing
urgency           → derived from conversation, not asked directly
contactMethod     → callback if needed
```

**DO NOT COLLECT:**
```
social_security_number  → never needed for receptionist function
full_medical_history    → beyond current visit
financial_information   → not a billing system
employment_information  → not relevant
medications             → beyond visit reason
previous_diagnoses      → beyond current complaint
```

**Verify in code**: `lead-capture.js` `_leadData` object should contain only the fields in the COLLECT list. Any additional field requires documented clinical justification.

---

## DO NOT RULES

1. **DO NOT store SSN, financial data, or full medical history** — these are never justified for a receptionist intake function

2. **DO NOT ship to production with localStorage for PHI** — localStorage is unencrypted and accessible to any JS on the page. Move to server-side encrypted storage before first real patient.

3. **DO NOT use cloud n8n without a signed BAA** — cloud n8n receives PHI via webhook. Without BAA, every webhook fire is a HIPAA violation.

4. **DO NOT use Google Calendar API without Google's BAA** — appointment data (patient name + reason for visit) is PHI when associated with a healthcare provider.

5. **DO NOT log PHI to console in production** — `console.log('[LeadCapture] Saved: ' + JSON.stringify(leadData))` would expose PHI in browser devtools and any logging infrastructure.

---

## REAL EXAMPLE FROM THIS CODEBASE

**Pass 1-3, Multiple templates — PHI field evolution**

The original `_leadData` in `lead-capture.js` contained SMB fields (`business`, `goal`, `tenure`) that were replaced with medical fields (`dob`, `insurance_provider`, `reason_for_visit`) in Pass 3 (G-029) and Pass 4 (G-033). The Minimum Necessary Standard justifies each medical field — none were added without a triage or booking purpose.

The `_getStorageKey()` function in `lead-capture.js` (lines 26-31) uses a namespaced, versioned key `av_leads_v1:[client_id]` to prevent cross-tenant data access — an important PHI isolation measure even within browser storage.

---

## GOTCHAS

1. **"Privacy by Architecture" reduces but does not eliminate HIPAA requirements** — Tier 1 (local-only, no cloud LLM) reduces the BAA surface but does not eliminate it. The hosting provider still serves the widget and could theoretically access localStorage through server logs or CDN.

2. **Google Calendar BAA is not automatic** — it requires using Google Workspace (paid) and signing the Business Associate Amendment in the Admin Console. Free Google accounts do not qualify.

3. **The 60-day breach notification rule** — HIPAA requires notifying affected patients within 60 days of discovering a breach. Before first client, document the breach response procedure even if it is simple.

4. **Audit logging is an expectation in 2026** — HHS enforcement is increasingly focused on immutable audit trails for AI-generated intake data. `console.log` does not satisfy this. Plan for structured logging to a tamper-evident store in production.

---

## SYNC CONTRACTS AFFECTED

- **GAP-08**: HIPAA BAA vendor checklist — must be completed before first client
- **SYNC-03**: PHI fields in `lead-capture.js` must match webhook payload schema

---

## SKILL SIGN-OFF

| Pass | Date | Agent | Action | Outcome |
|------|------|-------|--------|---------|
| 5 | 2026-04-30 | — | Initial DRAFT created | G-036 checklist established |
| 7 | 2026-05-01 | Claude | Promoted to COMPLETE | Full code references added, BAA table completed |
