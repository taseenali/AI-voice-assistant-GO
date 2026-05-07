This is a significant scope expansion and the right moment to define it properly. Let me give you a complete picture.

---

## What You're Actually Building

You are describing a **Medical AI Receptionist Platform** — not just a voice widget. The scope has moved from "SMB lead capture" to a specialized vertical SaaS product for healthcare. These are different products with different requirements, different buyers, and different compliance obligations.

Let me map this out completely.

---

## The Intelligence Question First

**Ollama vs API LLM — honest answer for medical sector:**

Ollama (local models) is not the right choice for this product right now. Here is why:

| Factor | Ollama (Local) | API LLM (Claude/GPT-4o) |
|---|---|---|
| Response quality | Adequate but inconsistent | Production-grade |
| Medical terminology handling | Weak on smaller models | Strong |
| HIPAA compliance path | Easier (data stays local) | Requires BAA agreement |
| Setup complexity | High — requires server | Low — API call |
| Latency for voice | 2-8 seconds on most hardware | 300-800ms with streaming |
| Cost at scale | Server cost + maintenance | $0.002-0.01 per conversation |
| Reliability | You own the uptime | Provider SLA |

**Recommendation**: Use Claude API (Anthropic offers BAA for HIPAA) or GPT-4o for the intelligence layer. The per-conversation cost is negligible against your subscription price. Ollama becomes relevant only if you land a client who requires fully on-premise deployment — treat it as an option, not the default.

---

## How the Intelligence Should Work

The current system has a rule-based engine that matches keywords and picks template responses. You replace the `generate_response` step in the orchestrator with an LLM call. Everything else — state machine, lead capture, webhook outbox — stays.

The LLM receives a **system prompt** built from the client's config:

```
You are [ASSISTANT_NAME], the AI receptionist for [CLINIC_NAME].
Your role is to warmly greet patients, collect their information, 
and help them schedule appointments.

Personality: Warm, calm, professional. You are empathetic when 
patients describe symptoms or express anxiety. You never diagnose. 
You never give medical advice. If a patient is in distress or 
describes an emergency, you immediately provide emergency contact 
information and end the appointment booking flow.

Current conversation state: [STATE]
Collected so far: [PARTIAL_PATIENT_DATA]
What you need to collect next: [NEXT_FIELD]
```

This keeps the LLM on-role, empathetic in the right moments, and constrained to the task. The state machine still controls the flow — the LLM only generates the language. This is the right architecture.

---

## Complete Product Scope — Medical AI Receptionist

### What "Good Enough" Actually Means for This Market

A product that a medical practice will pay for and trust needs to handle:

**Core Reception Workflow:**
- Inbound call / web chat greeting
- New vs returning patient identification
- Appointment booking with conflict checking
- Symptom triage (collect, never diagnose)
- Insurance / coverage inquiry routing
- After-hours emergency routing
- Callback scheduling

**Patient Data Collection:**
- Full name, date of birth
- Contact number, email
- Appointment type (new patient, follow-up, specific procedure)
- Primary complaint / reason for visit
- Insurance provider and member ID
- Preferred doctor if applicable
- First visit or returning — if returning, verify identity
- Preferred appointment time and day
- Language preference

**Practice Operations:**
- Multi-provider scheduling awareness
- Appointment confirmation and reminders (outbound)
- No-show follow-up
- Waitlist management
- After-hours message logging

---

## Complete Platform Architecture

```
┌─────────────────────────────────────────────────────┐
│                  RECEIVING LAYER                     │
│                                                      │
│  Web Widget    Phone (Twilio)    WhatsApp    SMS     │
│       │              │              │          │     │
│       └──────────────┴──────────────┴──────────┘     │
│                       │                              │
│              Unified Conversation API                │
└───────────────────────┼──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                  INTELLIGENCE LAYER                   │
│                                                      │
│  LLM API (Claude/GPT-4o)                            │
│       │                                              │
│  Conversation State Machine                          │
│  Patient Data Extractor                              │
│  Intent Classifier                                   │
│  Emergency Detector                                  │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                  DATA LAYER                           │
│                                                      │
│  Patient Records      Appointment Calendar           │
│  Conversation Logs    Audit Trail                    │
│  Recording Storage    Transcript Storage             │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                INTEGRATION LAYER                      │
│                                                      │
│  EHR/EMR Systems     Calendar (Google/Outlook)       │
│  Practice Management  CRM / n8n Automation           │
│  SMS/Email Notify    Billing Systems                 │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                  ADMIN PLATFORM                       │
│                                                      │
│  Practice Dashboard   Call Analytics                 │
│  Patient Queue        Configuration UI               │
│  Recording Playback   Compliance Reports             │
└─────────────────────────────────────────────────────┘
```

---

## Complete Tech Stack

**Voice / Telephony:**
- Twilio Voice — inbound phone call handling, recording, transcription
- Twilio STT (Speech-to-Text) or Deepgram — faster and more accurate than Web Speech API, HIPAA-eligible
- ElevenLabs or Azure Neural TTS — natural voice output (not browser TTS)

**Intelligence:**
- Claude API (Anthropic) or GPT-4o — primary LLM, BAA available for HIPAA
- Prompt engineering layer — system prompt builder from client config
- LangChain or custom orchestration — conversation memory management

**Backend:**
- Node.js or Python (FastAPI) — conversation orchestration server
- WebSocket — real-time voice streaming
- Redis — session state, conversation context
- PostgreSQL — patient records, appointments, audit logs

**Frontend:**
- Web widget — embeddable on practice website (your current project as base)
- Admin dashboard — React
- Mobile-responsive patient portal

**Infrastructure:**
- AWS or Azure (both offer HIPAA-eligible infrastructure)
- Separate VPC for patient data
- Encryption at rest and in transit (mandatory)
- Audit logging — every data access logged

**Compliance:**
- HIPAA BAA with all vendors (Twilio, OpenAI/Anthropic, cloud provider)
- SOC 2 Type II certification path
- TCPA consent management (already in your codebase)
- Call recording disclosure (varies by state — some require two-party consent)

---

## What This Means for Your Current Codebase

Your current project is the **web widget component** of this larger platform. It is not wasted — it becomes the embedded chat/voice interface for practices that want website integration. The architecture decisions already made (transactional outbox, multi-tenant config, state machine) are the right foundations.

What needs to be added or replaced:

| Current | Replace/Add With | Why |
|---|---|---|
| Web Speech API | Deepgram or Twilio STT | Accuracy, HIPAA, non-Chromium support |
| Browser TTS | ElevenLabs or Azure Neural | Natural voice, consistent across devices |
| Rule-based responses | LLM API with system prompt | Actual intelligence |
| n8n webhook | Direct EHR/calendar API | Real appointment booking |
| localStorage | Encrypted server-side storage | HIPAA requirement |
| Static config JSON | Admin UI + database | Multi-practice management |

---

## Phased Development Path

**Phase 1 — Intelligent Web Widget (Pass 3-4 of current loop)**
Replace rule-based engine with LLM. Add Deepgram for STT. Deploy to first medical client as web chat only. Collect real conversations.

**Phase 2 — Phone Integration**
Add Twilio Voice. Same intelligence layer, new receiving channel. Practice can now give patients a phone number that routes to your AI receptionist.

**Phase 3 — Calendar Integration**
Direct integration with Google Calendar, Microsoft Bookings, or practice management software (Dentrix, Athenahealth, etc.). Real appointment booking rather than webhook-to-human.

**Phase 4 — Full Admin Platform**
Dashboard, analytics, call recording playback, patient data management, compliance reporting.

**Phase 5 — EHR Integration**
HL7 FHIR API integration with major EHR systems. This is the enterprise tier.

