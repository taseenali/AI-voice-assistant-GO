# MedVoice AI — Intelligent Medical Receptionist Platform
### Complete Project Documentation & Development Context
**Version**: 1.0.0 | **Date**: April 2026 | **Status**: Pass 2 Complete — Pass 3 Active | **Classification**: Internal — Confidential

---

# 1. Executive Summary

> **What We Are Building**: MedVoice AI is a multi-channel, AI-powered medical receptionist platform that handles inbound patient communications across web, phone, and messaging channels — 24/7. It replaces or augments the front-desk reception function for medical practices, dental clinics, and allied health providers.

## 1.1 Product Vision

A medical practice should never miss a patient call, lose a booking opportunity, or leave a patient waiting. MedVoice AI answers every inbound contact instantly, collects patient information accurately, schedules appointments, and escalates to a human when judgment is required.

## 1.2 Current Development State

| Pass 1 ✓ | Pass 2 ✓ | Pass 3 ← ACTIVE |
|---|---|---|
| Foundation + Security | Security Hardening | Reliability + Intelligence |
| Full codebase audit | HMAC webhook auth | ServiceWorker sync |
| 3 critical bugs fixed | Input sanitization | LLM Adapter (Ollama) |
| EU AI Act compliance | TCPA consent gate | Emergency Detector |
| Tenant isolation enforced | Speech privacy disclosure | Medical patient fields |

## 1.3 Strategic Direction

The product is pivoting from a generic SMB lead capture widget to a specialized Medical AI Receptionist platform. This vertical focus opens a defensible market position against generic competitors while aligning with HIPAA compliance requirements that create natural barriers to entry.

**Intelligence: Ollama First** — Local Ollama replaces the rule-based engine now. Stable → swap to Claude/GPT-4o via adapter pattern. Zero architectural change required.

**Market: Healthcare Vertical** — Doctors, dentists, allied health. Clear pain point, defined budget, and willingness to pay for HIPAA-compliant solutions.

---

# 2. Complete Product Scope

## 2.1 Receiving Channels

| Channel | Technology | Phase | Status |
|---|---|---|---|
| Web Widget | Browser JS + Web Speech / Deepgram | Phase 1 | ✓ In Development |
| Phone (Inbound) | Twilio Voice + Deepgram STT | Phase 2 | Planned |
| SMS | Twilio SMS | Phase 2 | Planned |
| WhatsApp | Twilio WhatsApp API | Phase 3 | Planned |
| Patient Portal | React Web App | Phase 4 | Planned |

## 2.2 Patient Data Collection

**Required Fields:**
- Full name
- Contact number
- Email address
- Reason for visit / chief complaint
- New or returning patient
- Preferred appointment date and time

**Returning Patient Verification:**
- Date of birth confirmation
- Last visit approximate date
- Treating doctor name (if known)

**Optional / Contextual Fields:**
- Date of birth
- Insurance provider and member ID
- Preferred doctor or practitioner
- Urgency level (routine / urgent / emergency)
- Language preference
- Referral source

**Emergency Detection — Bypass Booking Flow:**
- Chest pain, difficulty breathing, severe bleeding
- Immediate escalation — provide 911 info
- End booking session

## 2.3 Core Conversation Flows

**New Patient Booking**
> Greeting → AI disclosure → New/returning check → Collect details → Reason for visit → Preferred time → Confirm → Webhook

**Returning Patient Booking**
> Greeting → Returning ID → DOB verification → Reason for visit → Preferred time → Confirm → Webhook

**General Inquiry**
> Greeting → Intent detection → Knowledge base response → Offer booking if appropriate

**After-Hours**
> Greeting → After-hours disclosure → Urgent triage → Emergency escalation or callback scheduling

**Emergency Detection**
> Any emergency symptom mention → Immediate escalation → Emergency services info → End booking flow

---

# 3. Intelligence Layer

## 3.1 Why Ollama First

Ollama runs open-source LLMs locally — no per-call cost, no data leaving your infrastructure. Once conversation flows are validated and stable, the LLM adapter pattern allows a single config change to switch to Claude or GPT-4o with zero architectural changes.

## 3.2 Recommended Models

| Model | RAM | Use Case | Notes |
|---|---|---|---|
| llama3.2:3b | ~2GB | Dev / Testing | Fast, good instruction following, local dev |
| llama3.1:8b | ~5GB | Recommended | Strong medical terminology, stays on-role |
| mistral:7b | ~5GB | Alternative | Excellent instruction following, consistent |
| phi3:14b | ~8GB | Higher Quality | Better nuance, stronger empathy simulation |
| Claude API | Cloud | Production | Swap via adapter — BAA available for HIPAA |

## 3.3 System Prompt Architecture

The LLM receives a dynamically constructed system prompt built from the client config at runtime. This is how the same model becomes a different AI receptionist for each medical practice.

```
// System prompt built from config at runtime

You are {assistant_name}, the AI receptionist for {clinic_name}.
Role: {role_description}

PERSONALITY:
- Warm, calm, professional at all times
- Empathetic when patients describe symptoms or anxiety
- NEVER diagnose. NEVER give medical advice.
- Emergency symptoms detected → provide 911 immediately

CURRENT STATE: {conversation_state}
COLLECTED SO FAR: {partial_patient_data}
NEXT FIELD NEEDED: {next_required_field}
SERVICES OFFERED: {services_list}
```

## 3.4 LLM Adapter Pattern — Provider Switching

```javascript
// js/services/llm-adapter.js
class LLMAdapter {
  constructor(config) {
    this.provider = config.ai_tier;  // 'ollama' | 'claude' | 'openai'
    this.model    = config.llm_model;
    this.endpoint = config.ollama_endpoint || 'http://localhost:11434';
  }

  async generateResponse(history, systemContext, state) {
    switch(this.provider) {
      case 'ollama': return this._callOllama(history, systemContext);
      case 'claude': return this._callClaude(history, systemContext);
      case 'openai': return this._callOpenAI(history, systemContext);
    }
  }
}
```

---

# 4. Complete Tech Stack

## 4.1 Current Stack (Passes 1–3)

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Vanilla JS + ES Modules | Widget, conversation UI, speech I/O |
| Build | Vite | Module bundling, development server |
| Voice Input | Web Speech API → Deepgram (Phase 2) | Speech recognition, transcription |
| Voice Output | Browser TTS → ElevenLabs (Phase 2) | Text-to-speech synthesis |
| Intelligence | Ollama (local) → Claude API (production) | LLM conversation engine — Pass 3 |
| State Management | Custom state machine | Conversation flow control |
| Data Persistence | IndexedDB + ServiceWorker | Reliable offline-capable delivery |
| Webhook Delivery | Transactional outbox + HMAC auth | Secure event delivery to n8n |
| Automation | n8n | CRM, calendar, notification routing |
| Compliance | TCPA + EU AI Act + HIPAA path | Legal compliance layer |

## 4.2 Production Stack (Phase 2+)

| Layer | Technology | Purpose |
|---|---|---|
| Telephony | Twilio Voice | Inbound phone call handling |
| STT | Deepgram Nova-2 Medical | Medical-grade transcription accuracy |
| TTS | ElevenLabs or Azure Neural | Natural voice output |
| LLM | Claude API with HIPAA BAA | HIPAA-eligible AI intelligence |
| Backend | Node.js / FastAPI | Conversation orchestration server |
| Real-time | WebSocket | Live voice streaming |
| Session State | Redis | Conversation context management |
| Database | PostgreSQL (encrypted) | Patient records, appointments, audit logs |
| Storage | AWS S3 (HIPAA-eligible) | Call recordings, transcripts |
| Infrastructure | AWS / Azure HIPAA | HIPAA-eligible cloud infrastructure |
| Calendar | Google Calendar / MS Bookings API | Real appointment scheduling |

---

# 5. Platform Modules

## 5.1 Module Map

**Core Engine:**
- Conversation State Machine
- Response Orchestrator (6-step pipeline)
- LLM Adapter (Ollama / Claude / GPT-4o)
- Intent Detector
- NLP Suite (extract, classify, temporal)
- Emergency Detector — NEW

**Patient Data:**
- Patient Capture (expanded for medical)
- New vs Returning Identifier
- Field Validator
- Consent Manager (TCPA)

**Delivery:**
- Webhook Dispatcher (HMAC authenticated)
- Transactional Outbox (IndexedDB)
- ServiceWorker Background Sync
- Dead-letter Queue

**Voice / Speech:**
- Speech I/O (Web Speech API)
- Privacy Disclosure Manager
- Text Fallback Handler
- iOS / Non-Chromium Fallback

**Configuration:**
- Multi-tenant Config Loader
- Config Validator
- Emergency Fallback Defaults

**Admin Platform (Planned — Pass 5):**
- Practice Dashboard
- Call Analytics
- Patient Queue View
- Config Editor UI
- Recording Playback
- Compliance Reports

## 5.2 Module Health Status

| Module | Status | Security | Next Action |
|---|---|---|---|
| Webhook Dispatcher | ✓ STABLE | ✓ SECURED | Pass 3: ServiceWorker integration |
| State Machine | ✓ STABLE | ✓ CLEAN | No action required |
| Patient Capture | ✓ FUNCTIONAL | ✓ SECURED | Pass 3: Medical field expansion |
| Config System | ✓ STABLE | ✓ SECURED | Pass 5: Admin UI |
| Response Orchestrator | ⚠ FUNCTIONAL | ⚠ AUDIT | Pass 3: LLM adapter hook-in |
| Speech I/O | ⚠ FUNCTIONAL | ✓ SECURED | Pass 3: iOS fallback |
| NLP Suite | ⚠ FUNCTIONAL | ✓ SECURED | Pass 4: ONNX ML classifier |
| LLM Adapter | ⬜ PLANNED | N/A | Pass 3: Ollama — P0 |
| Emergency Detector | ⬜ PLANNED | N/A | Pass 3: New module — P0 |
| Admin Dashboard | ⬜ PLANNED | N/A | Pass 5 |
| Phone Integration | ⬜ PLANNED | N/A | Phase 2 — Twilio |

---

# 6. Development Roadmap

## 6.1 Loop Pass Plan

### Pass 3 — ACTIVE: Reliability + Intelligence Foundation
- G-015: ServiceWorker Background Sync for outbox retry
- G-027: LLM Adapter with Ollama provider — **P0 NEW**
- G-028: Emergency Detector module — **P0 NEW** for medical vertical
- G-029: Medical patient fields expansion in lead-capture.js
- G-014: SEC-08 response-builder.js final verification
- G-016: iOS / non-Chromium speech fallback

### Pass 4 — PLANNED: Intelligence Hardening + Phone
- ONNX ML intent classifier replaces keyword NLP
- Ollama → Claude API swap (configuration only)
- Twilio Voice — inbound phone calls
- Deepgram STT — production medical transcription
- Conversation memory for returning patients

### Pass 5 — PLANNED: Operations Platform
- Admin UI — practice configuration editor
- SEC-02 fix — config sensitive field protection
- Calendar API integration (Google / Microsoft Bookings)
- Patient data dashboard
- Multi-practice management

### Pass 6 — PLANNED: Analytics + Observability
- Analytics event layer across all modules
- Call analytics dashboard
- Recording playback and transcript search
- HIPAA compliance audit trail reporting
- Alerting and incident response system

### Pass 7 — PLANNED: Production Hardening
- CI/CD pipeline automated deployment
- Automated test suite (Jest)
- SLA documentation and performance benchmarks
- Load testing and optimization
- Disaster recovery procedures

---

# 7. Compliance & Legal

> **Medical Sector Compliance Is Non-Negotiable.** Healthcare AI products operate in a heavily regulated environment. These requirements are the price of entry into the medical market. Non-compliance is not a risk to manage — it is a product-ending liability.

## HIPAA (US Healthcare)
- Patient data = Protected Health Information (PHI)
- BAA required with all vendors handling PHI
- BAA vendors: LLM provider, cloud host, recording storage
- Encryption at rest and in transit mandatory
- Audit logs for all data access required
- Minimum necessary data collection principle

## TCPA (Voice / SMS)
- AI-generated voices classified as artificial/prerecorded
- Prior express written consent required
- Consent gate already implemented in codebase
- Per-state rules vary — some stricter than federal

## EU AI Act (Article 50)
- Must disclose AI identity at conversation start
- Already implemented — all greeting strings compliant
- Human escalation path must be available

## Call Recording Laws
- US Federal: one-party consent (varies by state)
- California, Florida, others: two-party consent required
- Must announce recording at call start in two-party states

## Current Compliance Status
- ✓ EU AI Act Article 50 — IMPLEMENTED (Pass 1)
- ✓ TCPA consent gate — IMPLEMENTED (Pass 2)
- ✓ HMAC webhook auth — IMPLEMENTED (Pass 2)
- ⚠ HIPAA BAA — Required before first medical client
- ⚠ Recording disclosure — Required for phone (Phase 2)

---

# 8. Agent Environment — Ollama Integration Guide

## 8.1 Environment Updates Required Before Pass 3

These changes must be made to the environment files before sending the onboarding prompt to any agent.

**1. `ENVIRONMENT.md` — Add to KNOWN ISSUES REGISTER:**
```
GAP-04 | js/services/llm-adapter.js       | LLM Adapter not built — Ollama pending      | ARCH | OPEN
GAP-05 | js/modules/emergency-detector.js  | Emergency Detector not built — medical P0   | HIGH | OPEN
```

**2. `variables/PROJECT-VARS.md` — Update Pass 3 Goals:**
```
PASS_PRIMARY_GOAL = "ServiceWorker sync + LLM Adapter (Ollama) + Emergency Detector"

FILES_ALLOWED_TO_MODIFY += [
  "js/services/llm-adapter.js",
  "js/modules/emergency-detector.js",
  "js/response-orchestrator.js"    // needed to hook in LLM adapter
]
```

**3. `variables/GOAL-STACK.md` — Add Active Goals:**
```
G-027 | Build LLM Adapter — Ollama provider       | P0 | Pass 3 | T05
G-028 | Build Emergency Detector module            | P0 | Pass 3 | T05
G-029 | Expand patient fields for medical vertical | P1 | Pass 3 | T05
```

## 8.2 Ollama Local Setup

| Step | Command |
|---|---|
| 1 | Install Ollama from ollama.com/download |
| 2 | `ollama pull llama3.1:8b` |
| 3 | `ollama run llama3.1:8b` |
| 4 | API endpoint: `http://localhost:11434/api/chat` |
| 5 | Test: `curl http://localhost:11434/api/tags` |
| 6 | For production server: `set OLLAMA_HOST=0.0.0.0` |

## 8.3 Pass 3 Agent Assignment

| Template | Agent | Reason | Key Focus |
|---|---|---|---|
| T01–T02 | Gemini / Antigravity | Fast scan + real-time research | Medical AI market research |
| T03–T04 | Claude | Precise code + security audit | LLM adapter audit prep |
| T05 | Claude | Complex new module build | Ollama + Emergency Detector build |
| T06 | Claude | Full-flow gate validation | New module verification + full-flow |
| T07 | Gemini / Either | Research + synthesis | Pass 4 planning |

## 8.4 Pass 3 Success Criteria

Pass 3 is complete when all of the following are verified at T06:

- ServiceWorker Background Sync implemented and verified
- LLM Adapter built — Ollama provider functional, Claude provider stubbed
- Emergency Detector integrated — bypasses booking on emergency symptoms
- Medical patient fields operational in lead-capture.js
- iOS / non-Chromium speech fallback functional
- T06 quality gate passed — all full-flow security checks passing
- T07 blueprint updated — product described as Medical AI Receptionist