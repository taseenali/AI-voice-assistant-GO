# Medical Voice Receptionist — Complete Research Plan & Prompts

> **12 tasks · 8 Perplexity · 4 Kimi · 6 sequential phases**
> Each task is self-contained. Prerequisite placeholders are marked `{{PASTE: TaskID}}`.
> Save each output as `/research/raw/<phase>/<TaskID>.md` before moving to the next phase.

---

## Folder Structure

```
/research
  /raw
    /phase-1-market/         P1.md  P2.md  P3.md
    /phase-2-domain/         K1.md  K2.md  P4.md
    /phase-3-tech-stack/     P5.md  P6.md  P7.md
    /phase-4-architecture/   K3.md  P8.md  P9.md
    /phase-5-product-gtm/    P10.md P11.md K4.md
    /phase-6-engineering/    K5.md  P12.md K6.md
  /synthesis/
    /final/                  master_brief.md
```

---

## Phase 1 — Market & Domain Foundation
> **Run all three in parallel. No prerequisites.**

---

### P1 · Market Landscape `[Perplexity]`

**Save to:** `/research/raw/phase-1-market/P1.md`

```
You are a senior market research analyst. I am building a B2B SaaS product: an AI-powered medical voice receptionist that handles inbound patient calls — scheduling appointments, answering FAQs, capturing intake information, and routing urgent calls to human staff.

Research and produce a comprehensive market landscape report covering ALL of the following sections. Be specific with numbers, cite sources with publication dates, and flag any conflicting data points.

---

SECTION 1 — Market Size & Growth
- Global and North America-specific TAM for AI-powered healthcare virtual assistants and voice AI in medical settings (2023–2028 projections)
- CAGR figures with source names and dates
- Breakdown by market segment: primary care, specialist clinics, hospitals, dental, mental health
- Key growth drivers (staff shortages, after-hours coverage, cost reduction)
- Key market inhibitors (adoption friction, trust, regulatory)

SECTION 2 — Customer Profile
- Who is the primary buyer? (Practice manager, CMO, IT director, clinic owner)
- Typical clinic sizes adopting voice AI today (solo practice vs. group vs. hospital system)
- Geographic concentration of early adopters (US states, countries)
- What pain point ranks #1 for front-desk staff in medical practices — cite survey data if available
- Average cost of a human medical receptionist (fully loaded, US market, 2023–2024)

SECTION 3 — Demand Signals
- Volume of missed calls in average medical practice (industry data)
- Patient no-show rates and the role of automated reminders
- After-hours call volume statistics in healthcare
- Survey data on patient willingness to interact with AI for appointment booking

SECTION 4 — Industry Trends (last 18 months)
- Recent funding rounds or acquisitions in healthcare voice AI (list company, amount, date)
- Health system RFP trends for AI front-office tools
- CMS or payer incentives that indirectly support automation adoption

Format: Use H2 headers for each section. Include a one-paragraph executive summary at the top. Flag data older than 2022 explicitly.
```

---

### P2 · Competitor Deep-Dive `[Perplexity]`

**Save to:** `/research/raw/phase-1-market/P2.md`

```
You are a competitive intelligence analyst. I am building a B2B SaaS AI medical voice receptionist. Research the competitive landscape in depth.

For EACH of the following known players, and any additional ones you find, provide a structured profile:

Known players to research: Nuance DAX, Suki AI, Nabla, Abridge, Hyro AI, Klara, Luma Health, Aloha, Replicant, PolyAI, Synthpop, Talkdesk Healthcare, Google CCAI (healthcare use cases), Amazon Connect + HealthLake.

For each competitor, document:
1. Core product offering (what exactly does it do — voice, chat, both)
2. Target customer segment (hospital, clinic, dental, specialty)
3. Pricing model and known price points (per seat, per minute, per practice, enterprise)
4. Key differentiators claimed on their website/marketing
5. Technology stack clues (own LLM, third-party, on-prem option)
6. EHR integrations supported (Epic, Cerner, athenahealth, etc.)
7. HIPAA/compliance posture (BAA availability, certifications mentioned)
8. Funding stage and total raised
9. Known weaknesses or customer complaints (G2, Capterra, Reddit, news)
10. Any recent product launches or pivots (last 12 months)

After all profiles, produce:
- A feature comparison matrix (rows = features, columns = competitors)
- A 3×3 positioning map description: X-axis = automation depth (low → high), Y-axis = price (low → high)
- Top 3 whitespace opportunities — gaps no competitor is addressing well

Format: structured markdown with a profile per competitor, then the comparison matrix, then opportunities.
```

---

### P3 · Regulatory & Compliance Landscape `[Perplexity]`

**Save to:** `/research/raw/phase-1-market/P3.md`

```
You are a healthcare regulatory compliance researcher. I am building a B2B SaaS AI voice receptionist for medical practices in the United States (with future expansion to UK/EU). It handles patient calls, captures PHI (names, DOB, reason for visit, insurance), schedules appointments, and integrates with EHR systems.

Research and document ALL of the following regulatory areas with current (2023–2025) requirements:

SECTION 1 — HIPAA (US)
- What constitutes PHI in voice interactions (audio recordings, transcripts, caller ID)
- Business Associate Agreement (BAA) requirements — when is our platform a BA?
- HIPAA Security Rule requirements for voice AI SaaS vendors (encryption in transit/at rest, access controls, audit logs)
- Breach notification timelines and obligations
- Specific requirements around AI-generated transcriptions of patient calls
- Does HIPAA apply to the phone call itself if it's handled by an AI?

SECTION 2 — FDA Software as Medical Device (SaMD)
- Does an AI voice scheduling tool fall under FDA SaMD classification?
- Current FDA guidance on AI/ML-based Software as a Medical Device (2023–2024 updates)
- Which specific functions would trigger FDA oversight vs. exempt (scheduling vs. clinical triage)
- De Novo pathway vs. 510(k) — which is relevant if applicable

SECTION 3 — Telehealth & State Regulations
- State-specific regulations that affect AI voice agents collecting patient data (California CMIA, Texas, New York)
- Consent requirements for recording patient calls — one-party vs. two-party consent states
- Any state laws restricting AI from conducting patient intake without human oversight

SECTION 4 — EU/UK (Forward-Looking)
- GDPR requirements for AI processing of health data (Article 9 special category data)
- EU AI Act classification for healthcare AI voice tools (prohibited, high-risk, limited-risk)
- UK ICO guidance on AI in healthcare settings

SECTION 5 — Practical Compliance Checklist
- List the minimum viable compliance requirements to launch in the US market
- What certifications/audits should we pursue (SOC 2 Type II, HITRUST, ISO 27001)
- Timeline and cost estimates for each certification

Format: Detailed sections with H2 headers. Include direct citations to regulation text where possible. Flag any areas where regulation is ambiguous or evolving.
```

---

## Phase 2 — Medical Domain & EHR Research
> **Prerequisites: P1, P2, P3 must be completed. Paste relevant sections as noted.**

---

### K1 · Clinical Workflow Synthesis `[Kimi]`

**Save to:** `/research/raw/phase-2-domain/K1.md`
**Prerequisites:** Paste P1.md (full) + P2.md (competitor profiles section only)

```
You are a clinical workflow analyst and product designer with deep expertise in ambulatory care and medical practice operations.

I am building an AI voice receptionist for medical practices. Below I have attached:
1. Market research covering practice pain points and customer profiles [P1.md]
2. Competitor product profiles showing what existing solutions offer [P2.md — competitor profiles]

{{PASTE: P1.md — full content}}

{{PASTE: P2.md — competitor profiles section only}}

---

Using the above context AND your own domain knowledge, produce a comprehensive clinical workflow analysis:

SECTION 1 — Inbound Call Taxonomy
- Categorize ALL types of inbound calls a medical practice receives
- For each category: frequency (% of total calls), average handle time, complexity, can it be fully automated vs. needs human handoff
- Specifically cover: appointment scheduling, cancellations/reschedules, prescription refill requests, test result inquiries, referral requests, billing questions, urgent/clinical questions, new patient registration, insurance verification
- Flag which call types involve PHI and at what depth

SECTION 2 — Appointment Scheduling Logic
- Map the full decision tree for scheduling a new patient appointment
- Variables the AI must capture: specialty, insurance, urgency, provider preference, time preference, new vs. returning patient
- Conflict scenarios: double booking, no available slots, provider on leave
- How practices currently handle scheduling: own system, third-party (Zocdoc, etc.), EHR-native scheduler

SECTION 3 — Patient Intake Flow
- What information is captured before a first appointment (demographics, insurance, reason for visit, medical history)
- Standard intake form fields across primary care, specialist, dental, mental health
- At what point does intake data become PHI requiring HIPAA-grade handling
- Identify which intake steps can happen via voice vs. require a web form

SECTION 4 — Human Handoff Triggers
- Define a prioritized list of scenarios that MUST transfer to a human agent immediately
- Distinguish between: urgent clinical (chest pain, suicidal ideation), administrative escalations, and patient preference escalations
- What context must be passed to the human agent at handoff (call summary, caller ID, reason)

SECTION 5 — Practice Workflow Variations
- How do workflows differ across: solo GP practice, 5–20 physician group, hospital outpatient clinic, dental practice, mental health practice, urgent care
- Which variations are material enough to require separate product configurations vs. handled by settings

SECTION 6 — Feature Priority Matrix
- Based on the above, rank the top 10 features for v1 of the AI voice receptionist by: patient impact, practice staff impact, implementation complexity, and competitive differentiation
- Format as a table

Output format: Structured markdown with H2 sections. Be exhaustive and specific — this document becomes our product requirements foundation.
```

---

### K2 · Compliance Deep-Read `[Kimi]`

**Save to:** `/research/raw/phase-2-domain/K2.md`
**Prerequisites:** Paste P3.md (full)

```
You are a HIPAA compliance architect and healthcare data privacy attorney with expertise in AI/SaaS product design.

I have attached a regulatory research document covering HIPAA, FDA SaMD, state laws, and EU/UK regulations relevant to an AI voice receptionist for medical practices.

{{PASTE: P3.md — full content}}

---

Your task is to translate this regulatory landscape into precise, actionable engineering and product design requirements.

SECTION 1 — Data Classification Map
- For an AI voice receptionist handling patient calls, classify every data element by sensitivity tier:
  - Tier 1: PHI (HIPAA-regulated)
  - Tier 2: PII (non-PHI personal data)
  - Tier 3: Operational metadata (non-personal)
- Data elements to classify: caller phone number, caller name, DOB, reason for call, insurance ID, recording audio, ASR transcript, appointment slot booked, provider name, prescription mentioned, payment info

SECTION 2 — Technical Compliance Requirements
Translate each regulation into specific engineering controls. For each requirement, specify:
- What must be built
- At what layer (network, application, database, AI model)
- Acceptance criteria

Cover: encryption at rest and in transit standards, key management, access control (RBAC minimum), audit logging (what events, retention period), data residency, deletion/de-identification, consent capture and storage, BAA workflow with customers, incident response automation

SECTION 3 — AI-Specific Compliance Risks
- What happens if the AI mishears a patient name and books under the wrong record?
- What is the liability profile for AI-generated transcription errors in a clinical context?
- How should we handle audio recordings: retain, delete after transcription, offer customer choice?
- PHI in LLM prompts: what are the risks and mitigations of sending PHI to third-party LLM APIs?
- Consent language required before an AI answers a patient call

SECTION 4 — Minimum Viable Compliance for US Launch
- Define the exact minimum set of controls required to sign BAAs and legally operate in the US
- Separate into: must-have before first customer, must-have before enterprise customers, nice-to-have
- Identify which controls can be inherited from HIPAA-compliant cloud providers (AWS, GCP) vs. must be built

SECTION 5 — Compliance Implementation Roadmap
- Sequence the compliance work items in order of dependency
- Estimate engineering effort (S/M/L/XL) for each item
- Flag which items require third-party legal review or external audit

Format: Structured markdown. Be precise and engineering-ready — this feeds directly into our technical architecture decisions.
```

---

### P4 · EHR Integration Landscape `[Perplexity]`

**Save to:** `/research/raw/phase-2-domain/P4.md`

```
You are a healthcare interoperability specialist. I am building an AI voice receptionist that needs to read and write to EHR systems to: check appointment availability, book appointments, retrieve patient demographics, and update call notes.

Research the current EHR integration landscape in depth:

SECTION 1 — EHR Market Share
- Current US market share by EHR system: Epic, Oracle Cerner, athenahealth, eClinicalWorks, Modernizing Medicine, DrChrono, Kareo/Tebra, Practice Fusion, Greenway Health, NextGen
- Market share segmented by practice size (solo, small group, large group, hospital)
- Which EHRs are most common in: primary care, specialty, dental, mental health, urgent care

SECTION 2 — FHIR & Interoperability Standards
- Current state of FHIR R4 adoption across major EHRs (2024)
- CMS Interoperability Rule requirements and deadlines
- What FHIR resources are relevant for our use case: Patient, Appointment, Slot, Schedule, Practitioner, Location
- Known limitations of FHIR implementations across Epic, Cerner, athenahealth
- SMART on FHIR for third-party app authorization — how it works and its limitations

SECTION 3 — EHR-Specific Integration Options
For each of the top 5 EHRs (Epic, Cerner, athenahealth, eClinicalWorks, Kareo/Tebra):
- API availability: REST/FHIR vs. proprietary
- Sandbox/developer access: free vs. paid, how to get access
- Appointment booking API: does it support real-time slot checking and booking?
- Patient lookup: by phone number, DOB, name
- Authentication: OAuth 2.0, API key, SMART on FHIR
- Rate limits and known API reliability issues
- Certification requirements to go live (Epic App Orchard, etc.)
- Estimated integration complexity (S/M/L/XL)

SECTION 4 — Integration Middleware & Abstraction Layers
- Health Gorilla, Redox, Rhapsody, MuleSoft Healthcare, Particle Health, 1upHealth — what do they offer?
- Build vs. buy decision: when does using a middleware layer make sense vs. direct EHR API?
- Cost structure of middleware solutions (per API call, per patient, monthly)

SECTION 5 — Scheduling-Specific APIs
- Does any EHR expose a real-time availability API that supports slot locking (hold slot while patient confirms)?
- How do EHRs handle appointment types (new patient, follow-up, procedure) in their APIs?
- Waitlist management API support across EHRs

Format: Structured markdown with H2 sections. Include specific API endpoint names where known. Flag information that may be outdated.
```

---

## Phase 3 — Technology Stack Research
> **Prerequisites: P1, P2, P3, P4, K1, K2 must be completed. Run P5, P6, P7 in parallel.**

---

### P5 · Voice AI & STT/TTS Stack `[Perplexity]`

**Save to:** `/research/raw/phase-3-tech-stack/P5.md`

```
You are a voice AI engineer and architect. I am building a real-time AI voice receptionist for medical practices. The system must: answer inbound phone calls, transcribe speech in real time with high accuracy for medical terminology, understand natural language intent, generate natural-sounding voice responses, and operate with end-to-end latency under 1.5 seconds.

Research the current (2024–2025) landscape of voice AI components:

SECTION 1 — Speech-to-Text (STT) Solutions
Compare the following for a healthcare voice AI use case:
- OpenAI Whisper (hosted vs. self-hosted)
- Deepgram (Nova-2, Nova-3, medical model)
- AssemblyAI
- Google Speech-to-Text (v2, Chirp model)
- AWS Transcribe Medical
- Azure Speech Services
- Gladia
- Speechmatics

For each, evaluate:
- Real-time streaming latency (time to first token, end-to-end)
- Medical vocabulary accuracy (has a medical model or domain adaptation?)
- Speaker diarization support
- HIPAA compliance / BAA availability
- Pricing per minute (with volume tiers)
- Language support beyond English
- SDK availability (Python, Node.js)
- Known accuracy issues (accents, phone audio quality, medical terms)

SECTION 2 — Text-to-Speech (TTS) Solutions
Compare: ElevenLabs, OpenAI TTS (tts-1, tts-1-hd), Google Cloud TTS (WaveNet, Neural2, Studio), AWS Polly (Neural), Azure Neural TTS, PlayHT, LMNT, Cartesia

For each:
- Voice naturalness (MOS score or subjective benchmark)
- Latency (time to first audio byte in streaming mode)
- HIPAA/BAA availability
- Pricing per character or per minute
- Custom voice cloning support
- Emotional/prosody control
- Phone-optimized audio output (8kHz, G.711 codec support)

SECTION 3 — Voice Activity Detection & Interruption Handling
- Best current solutions for VAD in a phone call context
- How to handle barge-in (patient interrupts the AI mid-sentence)
- End-of-utterance detection accuracy
- Silence detection and timeout handling
- Open source options: Silero VAD, WebRTC VAD, py-webrtcvad

SECTION 4 — Real-Time Voice Pipeline Architecture
- What is the current industry standard architecture for a real-time voice AI bot?
- How does LiveKit, Daily.co, or Pipecat fit into this?
- What is the role of WebSockets vs. WebRTC in voice streaming?
- Latency budget breakdown: STT → LLM → TTS — what are realistic targets for each component?
- How do leading solutions handle overlapping speech, crosstalk, hold music?

SECTION 5 — HIPAA-Compliant Voice Processing
- Which STT/TTS vendors have signed BAAs?
- Risks of sending audio/transcripts to third-party APIs for PHI processing
- Options for on-premise or VPC-deployed voice AI to avoid third-party PHI exposure
- Redaction tools for PHI in transcripts before sending to non-HIPAA-compliant services

Format: Structured markdown with comparison tables where appropriate. Include current pricing as of 2024–2025. Flag deprecated or rapidly changing information.
```

---

### P6 · LLM & NLU Evaluation for Medical Voice `[Perplexity]`

**Save to:** `/research/raw/phase-3-tech-stack/P6.md`

```
You are an AI/ML engineer specializing in LLM evaluation for production voice applications. I am building an AI voice receptionist for medical practices. The LLM layer must: understand patient intent from transcribed speech (noisy, informal), extract structured data (dates, names, insurance IDs), manage multi-turn conversation state, follow strict rules (never give clinical advice, always escalate safety concerns), and respond in under 500ms.

SECTION 1 — LLM Evaluation for Voice Use Case
Evaluate the following LLMs specifically for a medical voice receptionist task (low latency, structured extraction, instruction-following, safety):
- GPT-4o (including gpt-4o-mini)
- GPT-4.1
- Claude 3.5 Haiku / Claude 3.5 Sonnet
- Llama 3.1 (8B, 70B) — self-hosted
- Llama 3.3 70B
- Mistral 7B / Mixtral 8x7B
- Gemini 1.5 Flash / Flash-8B
- Medical-specific fine-tunes: BioMistral, Med-Llama, Meditron

For each, evaluate:
- Latency for short prompts (< 500 tokens input, < 200 tokens output)
- Instruction-following reliability (does it stick to rules?)
- Medical terminology comprehension
- Structured output / JSON mode reliability
- HIPAA/BAA availability for API access
- Pricing per 1M tokens (input/output)
- Self-hosting viability (model size, GPU requirements, throughput)
- Context window (relevant for multi-turn call history)

SECTION 2 — Conversation State Management
- Best patterns for managing multi-turn conversation state in a voice bot
- How to represent a "call session" with structured state (caller intent, collected slots, call stage)
- Slot-filling architectures vs. free-form LLM conversation — tradeoffs for this use case
- LangGraph, LlamaIndex, custom state machines — which is most appropriate?

SECTION 3 — Intent Classification & Entity Extraction
- Best approach for extracting structured entities from noisy voice transcripts: appointment date/time, patient name, DOB, insurance ID, reason for visit, provider preference
- Fine-tuning vs. few-shot prompting vs. function calling for entity extraction
- Handling ASR errors in downstream NLU (e.g., "three PM" vs. "3 PM", "Doctor Smith" vs. "Doctor Schmidt")
- Confidence scoring for extracted entities — when to ask for confirmation

SECTION 4 — Safety & Guardrails
- How to reliably prevent an LLM from giving clinical/medical advice in a voice context
- Current best approaches: system prompt rules, output classifiers, constitutional AI methods
- Specific safety scenarios to handle: suicidal ideation, chest pain, anaphylaxis — how should the AI respond and escalate?
- Hallucination risks in medical context — how to constrain the LLM to only use verified practice data

SECTION 5 — Hybrid Architecture Recommendation
- When to use LLM for intent/NLU vs. traditional NLP (regex, slot-filling, decision trees)
- Recommended architecture: rule-based safety layer + LLM intent + structured slot-filling
- Retrieval-Augmented Generation (RAG) for practice-specific information (FAQs, hours, providers)
- Estimated GPU/compute cost to self-host a 7B model for this use case at 100 concurrent calls

Format: Structured markdown with comparison tables. Prioritize practical production experience over benchmark scores.
```

---

### P7 · Telephony & VoIP Infrastructure `[Perplexity]`

**Save to:** `/research/raw/phase-3-tech-stack/P7.md`

```
You are a telephony and VoIP architect. I am building a SaaS AI voice receptionist that intercepts inbound calls to medical practices, processes them with AI, and either resolves or transfers to a human agent. The system must integrate with practices' existing phone numbers (no number porting required ideally), handle high call volumes, be HIPAA-compliant, and support call transfer/warm transfer.

SECTION 1 — Telephony Platform Comparison
Compare the following for a healthcare AI voice SaaS use case:
- Twilio (Programmable Voice, Media Streams, ConversationRelay)
- Vonage / Vonage AI Studio
- Bandwidth.com
- Telnyx
- SignalWire
- Amazon Connect
- Google CCAI (Dialogflow CX + telephony)
- Plivo

For each:
- Inbound call handling: can we intercept calls forwarded from the practice's existing number?
- Media streaming: real-time audio streaming to our AI (WebSocket, GRPC?)
- Latency characteristics: audio stream start latency
- HIPAA BAA availability
- Pricing: per-minute inbound, per-minute outbound, phone number rental
- SIP trunking support for practices with existing PBX systems
- Warm transfer capability: transfer call to human agent with context
- Geographic availability and redundancy
- SDK quality (Python, Node.js)
- Concurrent call limits and scaling model

SECTION 2 — Call Forwarding Integration Models
- Model A: Conditional call forwarding (practice forwards unanswered calls to our number)
- Model B: Full forwarding (all calls go to us, we transfer back if human needed)
- Model C: SIP trunk replacement (we become the practice's phone provider)
- Model D: PBX integration (SIP/PSTN integration with existing phone system)
- Pros, cons, and technical requirements of each model
- Which model requires least practice-side IT involvement?

SECTION 3 — Audio Quality & Codec Handling
- PSTN audio quality constraints (8kHz, G.711 μ-law/A-law) — impact on STT accuracy
- Audio enhancement options: noise cancellation, echo cancellation, volume normalization
- How to handle hold music, IVR prompts, conference bridges
- Codec negotiation in SIP environments

SECTION 4 — Call Transfer & Handoff
- How to execute a warm transfer (AI briefs human agent before connecting patient)
- How to pass structured context (call summary, patient name, intent) to the receiving agent
- Integration with practice's existing phone system for transfer (soft phone, desk phone, cell)
- Fallback handling: what happens if human agent doesn't answer the transfer?

SECTION 5 — Outbound Call Capabilities
- Automated appointment reminder calls: regulations (TCPA compliance)
- Outbound calling for missed call callbacks
- Preview dialing vs. automated dialing — compliance requirements
- Voicemail detection and handling

Format: Structured markdown with comparison tables. Include 2024–2025 pricing. Flag HIPAA BAA availability explicitly for each vendor.
```

---

## Phase 4 — Architecture & Open Source Components
> **Prerequisites: P5, P6, P7 must be completed. K3 synthesizes them first, then P8/P9 run in parallel.**

---

### K3 · Technology Stack Synthesis `[Kimi]`

**Save to:** `/research/raw/phase-4-architecture/K3.md`
**Prerequisites:** Paste P5.md + P6.md + P7.md (all three, full content)

```
You are a principal engineer and solutions architect with deep expertise in voice AI systems and healthcare SaaS.

I have completed research on three technology domains for an AI medical voice receptionist. All three research documents are attached:

1. Voice AI stack (STT, TTS, VAD, pipeline architecture) [P5.md]
2. LLM and NLU evaluation [P6.md]
3. Telephony and VoIP infrastructure [P7.md]

{{PASTE: P5.md — full content}}

{{PASTE: P6.md — full content}}

{{PASTE: P7.md — full content}}

---

Your task is to synthesize these into a definitive, opinionated technology stack recommendation for our v1 product.

SECTION 1 — Recommended Technology Stack (v1)
Produce a single recommended stack for each component, with primary choice and fallback:

| Component | Primary Choice | Fallback | Rationale |
For: Telephony layer, STT engine, TTS engine, VAD, LLM/NLU, conversation state management, EHR integration layer, database (call records, session state), queue/messaging, API framework

Justify every choice based on: HIPAA compliance, latency, cost at scale, engineering effort, vendor risk.

SECTION 2 — System Architecture Design
Design the complete real-time voice call processing pipeline:
- Inbound call flow: from PSTN → telephony platform → our system → STT → LLM → TTS → PSTN
- Latency budget allocation per component (must total < 1.5s end-to-end)
- Where state lives during a call session
- How the EHR integration fits into the call flow (async lookup while AI is speaking)
- Human handoff flow: detection trigger → context packaging → transfer execution

SECTION 3 — Hosting & Deployment Architecture
- Services to deploy on AWS (with HIPAA BAA)
- Containerization strategy (Docker, Kubernetes or ECS)
- How to handle real-time audio stream processing at scale (stateful vs. stateless workers)
- Geographic deployment for low latency (US regions)
- Estimated infrastructure cost at: 10 customers / 1,000 calls/day, 100 customers / 10,000 calls/day

SECTION 4 — Build vs. Buy Decisions
For each component, make an explicit build vs. buy decision:
- Voice pipeline orchestration (Pipecat, LiveKit Agents, custom)
- Conversation engine (LangGraph, Rasa, custom FSM)
- EHR integration (direct FHIR, Redox, Health Gorilla)
- Admin dashboard (build from scratch vs. use a template)
- Billing/usage metering (Stripe Billing, custom)

SECTION 5 — Technical Risk Register
- Top 5 technical risks for this product
- For each: probability, impact, mitigation strategy, owner (engineering vs. vendor)
- Special focus on: LLM hallucination in a clinical context, STT failures on accented speech, telephony reliability, EHR API instability

SECTION 6 — MVP Engineering Scope
- Define the minimum set of components required to handle a real patient call end-to-end
- What can be mocked or hardcoded for MVP (e.g., one EHR integration, one practice type)
- Estimated engineering team size and time to MVP (weeks)

Format: Structured markdown. Be opinionated and decisive — this is an architecture decision document, not a research summary.
```

---

### P8 · Open Source & Reusable Components `[Perplexity]`

**Save to:** `/research/raw/phase-4-architecture/P8.md`

```
You are a senior open-source software engineer and B2B SaaS architect. I am building an AI medical voice receptionist SaaS platform. Research the best free, open-source, or freemium production-ready components available in 2024–2025 for each layer of the stack.

Evaluate all options for: license (MIT, Apache 2.0, AGPL — flag AGPL explicitly as it has SaaS implications), production-readiness, community activity (GitHub stars, last commit), and HIPAA considerations.

SECTION 1 — Voice AI Pipeline Frameworks
- Pipecat (Daily.co) — architecture, use cases, limitations, HIPAA posture
- LiveKit Agents — architecture, use cases, limitations
- Vocode — status, viability
- Botkit / Rasa for voice — viability in 2024
- Recommendation: which framework to use as the voice pipeline foundation and why

SECTION 2 — Telephony & WebSocket Handling
- Open source SIP stacks: FreeSWITCH, Asterisk, Kamailio — production viability for SaaS
- Media server options: Janus, mediasoup, Pion (Go WebRTC)
- When to use open-source SIP vs. commercial telephony API (Twilio/Telnyx)

SECTION 3 — LLM Orchestration & Conversation
- LangChain / LangGraph — production viability, latency overhead, when to avoid
- LlamaIndex — best use case (RAG for practice FAQs)
- Haystack — comparison to LangChain
- Semantic Kernel — Microsoft's option
- Raw LLM API calls with custom state — when this beats frameworks
- Recommended approach for a low-latency voice bot

SECTION 4 — Scheduling & Calendar
- Open source appointment scheduling engines: Cal.com (AGPL — flag!), Calendso
- Cal.com API — can it be used headlessly as a scheduling backend?
- Building a custom slot management system vs. using an OSS scheduler
- Integration patterns with EHR-native schedulers vs. maintaining a shadow calendar

SECTION 5 — Authentication & Authorization
- Auth0, Clerk, Supabase Auth, Keycloak, AWS Cognito — comparison for B2B SaaS
- Multi-tenant architecture for clinic onboarding
- RBAC requirements: platform admin, practice admin, staff user, read-only
- HIPAA considerations for authentication (MFA requirements, session timeout)

SECTION 6 — Queue, Async Processing & Real-Time Infrastructure
- Message queues: Bull/BullMQ (Redis), RabbitMQ, AWS SQS — use case fit for call processing
- Real-time event streaming: Redis Pub/Sub, Kafka (overkill?), AWS EventBridge
- WebSocket server: ws (Node.js), Socket.io, Centrifuge — for admin dashboard live updates

SECTION 7 — Observability & Logging
- OpenTelemetry for distributed tracing across voice pipeline
- Logging: Pino (Node.js), structlog (Python) — HIPAA-safe log practices (no PHI in logs)
- Metrics: Prometheus + Grafana vs. managed (Datadog, New Relic) — cost comparison at scale
- Call quality monitoring: MOS score calculation, jitter, packet loss tracking

SECTION 8 — Admin Dashboard Frontend
- shadcn/ui + Next.js — component library recommendation for internal SaaS dashboard
- Recharts vs. Chart.js vs. Tremor for analytics dashboard
- Data tables for call logs: TanStack Table recommendation
- Real-time call monitoring UI patterns

Format: Structured markdown with one section per layer. Include GitHub links, license types, and a final recommended OSS stack table.
```

---

### P9 · Cloud Infrastructure & HIPAA Hosting `[Perplexity]`

**Save to:** `/research/raw/phase-4-architecture/P9.md`

```
You are a cloud infrastructure architect specializing in HIPAA-compliant SaaS on AWS. I am building a B2B SaaS AI voice receptionist for medical practices that will handle PHI. Research the infrastructure landscape:

SECTION 1 — HIPAA-Eligible AWS Services
- Current list of AWS services covered under the AWS BAA (2024)
- Specifically confirm: EC2, ECS/EKS, Lambda, RDS (PostgreSQL), ElastiCache (Redis), S3, CloudWatch Logs, SQS, API Gateway, Cognito, Transcribe Medical, Bedrock
- Services NOT covered by AWS BAA that we must avoid for PHI workloads
- AWS GovCloud vs. standard regions for HIPAA — when is GovCloud required?

SECTION 2 — Database & Storage Architecture for PHI
- PostgreSQL on RDS (encrypted) vs. Aurora — comparison for our use case
- Encryption at rest: AWS KMS configuration for HIPAA workloads
- S3 for audio recording storage: encryption, access controls, lifecycle policies (auto-delete after X days)
- Redis (ElastiCache) for session state: is it HIPAA-eligible? Can it store PHI temporarily?
- Database audit logging requirements for HIPAA

SECTION 3 — Network Security Architecture
- VPC design for HIPAA: public subnets, private subnets, NAT gateway, VPC endpoints
- Security groups and NACLs: principle of least privilege for voice processing services
- WAF configuration for API endpoints
- PrivateLink for keeping traffic off public internet
- Secrets management: AWS Secrets Manager vs. Parameter Store for API keys, DB credentials

SECTION 4 — Container & Compute Strategy
- ECS Fargate vs. EKS vs. EC2 Auto Scaling for voice processing workloads
- Spot instances viability for real-time voice processing (latency sensitivity)
- Right-sizing for voice AI workloads (CPU vs. GPU instances, if self-hosting LLM)
- Auto-scaling strategy for call volume spikes (medical office opening time surges)
- Cost optimization: reserved instances, savings plans at MVP scale

SECTION 5 — Monitoring, Audit & Incident Response
- CloudTrail configuration for HIPAA audit log requirements
- CloudWatch alarms for HIPAA-relevant events (unauthorized access attempts, encryption failures)
- Automated incident detection and notification (GuardDuty, Security Hub)
- Backup and disaster recovery: RTO/RPO targets for a healthcare SaaS, backup strategy for PostgreSQL

SECTION 6 — Cost Modeling
Provide estimated monthly AWS costs for two scenarios:
- Scenario A: MVP (10 practices, ~1,000 calls/day, single region)
- Scenario B: Growth (100 practices, ~10,000 calls/day, multi-AZ)

Include: compute (ECS/EC2), database (RDS), storage (S3), data transfer, telephony API costs (Twilio estimate), STT API costs (Deepgram estimate), LLM API costs (GPT-4o-mini estimate)

Format: Structured markdown. Include specific AWS service names and current pricing (2024). Flag any services where pricing has changed significantly recently.
```

---

## Phase 5 — Product & GTM
> **Prerequisites: All Phase 1–4 research must be completed. Run P10, P11 in parallel; K4 after both.**

---

### P10 · Pricing & Monetization Models `[Perplexity]`

**Save to:** `/research/raw/phase-5-product-gtm/P10.md`
**Prerequisites:** Paste P2.md (pricing section only)

```
You are a B2B SaaS pricing strategist with expertise in healthcare technology and usage-based pricing models.

I am building an AI medical voice receptionist that replaces or augments front-desk staff. The product handles inbound calls, schedules appointments, and captures patient intake. Competitor pricing data is attached for reference.

{{PASTE: P2.md — pricing section only (competitor pricing column from comparison matrix)}}

---

Research and design the optimal pricing strategy:

SECTION 1 — Healthcare SaaS Pricing Benchmarks
- What pricing models are standard in healthcare SaaS (per seat, per provider, per location, per patient, usage-based)?
- Average ARR per customer for comparable healthcare SaaS products (EHR, telemedicine, practice management)
- Price sensitivity by practice size: solo practice vs. small group vs. enterprise health system
- Benchmark: what does a human medical receptionist cost annually (fully loaded) vs. what practices pay for automation tools?

SECTION 2 — Value-Based Pricing Analysis
- Quantify the value delivered: calls handled per month, staff hours saved, missed calls recovered, after-hours coverage
- What is the ROI calculation a practice manager would use to justify purchase?
- Price anchoring to receptionist cost savings: what % of replaced labor cost is a reasonable SaaS fee?
- Secondary value: after-hours booking revenue capture, patient no-show reduction

SECTION 3 — Pricing Model Options
Evaluate the following pricing models for our product:
- Per practice/location per month (flat fee)
- Per provider per month
- Per call/minute handled by AI (usage-based)
- Hybrid: base platform fee + per-minute overage
- Outcome-based: per appointment booked
- Tiered by call volume (up to 500 calls/month, up to 2,000, unlimited)

For each model: pros, cons, predictability for us, predictability for customer, sales cycle impact, churn risk.

SECTION 4 — Recommended Pricing Structure
- Design a 3-tier pricing structure (Starter / Growth / Enterprise)
- Define what features and limits belong in each tier
- Set specific price points justified by competitive positioning and value analysis
- Define a free trial or pilot program structure (14-day, 30-day, limited calls)

SECTION 5 — Revenue Modeling
- At recommended pricing, model monthly recurring revenue at: 10 / 50 / 100 / 500 customers
- What is the natural upsell path from Starter to Growth to Enterprise?
- Key pricing metrics to track: ACV, NRR, payback period, LTV:CAC target for healthcare SaaS

Format: Structured markdown. Include specific dollar amounts and model the numbers — don't just describe pricing frameworks.
```

---

### P11 · GTM Channels & Sales Strategy `[Perplexity]`

**Save to:** `/research/raw/phase-5-product-gtm/P11.md`
**Prerequisites:** Paste P1.md (customer profile section) + P2.md (competitor positioning section)

```
You are a B2B SaaS go-to-market strategist with experience in healthcare technology sales.

I am building an AI medical voice receptionist targeting independent medical practices and small group practices in the US. Context from market research is attached.

{{PASTE: P1.md — Section 2 (Customer Profile) only}}

{{PASTE: P2.md — competitor positioning section only}}

---

Research and design a complete GTM strategy:

SECTION 1 — Sales Channel Analysis
For each of the following channels, evaluate fit, realistic CAC, sales cycle length, and scalability for our product:
- Direct outbound sales (SDR-led, cold outreach to practice managers)
- Inbound content marketing (SEO, healthcare practice management blogs)
- EHR marketplace / app stores (Epic App Orchard, athenahealth Marketplace, Cerner App Market)
- Healthcare IT resellers and VARs (value-added resellers who sell to practices)
- Medical association partnerships (AAFP, AMA, specialty societies)
- GPO (Group Purchasing Organizations) — what are the major ones in healthcare tech?
- Practice management consultants and healthcare consultants
- Phone system vendors / telecom resellers
- MSO (Management Service Organizations) — structure and how to access them

SECTION 2 — Ideal Customer Profile (ICP) Refinement
Based on market data, define the highest-propensity-to-buy ICP:
- Practice type (primary care, specialty — which specialty has highest pain?)
- Practice size (# of providers, # of exam rooms, call volume)
- Geography (any regional concentration of independent practices?)
- Tech adoption profile (already using EHR API integrations, cloud phone systems)
- Budget indicators (independently owned vs. PE-backed vs. hospital-affiliated)
- Negative ICP: who NOT to target initially

SECTION 3 — Sales Motion Design
- Product-led vs. sales-led vs. hybrid — what works for healthcare SaaS at this price point?
- Recommended outbound sequence: touchpoints, channels, messaging by role (practice manager, physician owner, office manager)
- Pilot/POC structure: how to structure a 30-day paid pilot that converts to annual contract
- Demo script outline: what does the ideal live demo of an AI voice receptionist look like?

SECTION 4 — Healthcare-Specific Sales Considerations
- Who signs the contract in a medical practice? (Physician owner, practice manager, both?)
- Common objections and how competitors handle them: HIPAA concerns, AI accuracy, patient experience, staff pushback
- Reference customer / case study importance in healthcare — how to get first 5 reference customers
- Conference and event strategy: HIMSS, MGMA, AAP, specialty society conferences

SECTION 5 — First 90 Days GTM Plan
- Define the specific actions for the first 30/60/90 days post-launch
- Target: first 10 paying customers — specific tactics to get there
- Content and credibility assets needed before outbound sales begins

Format: Structured markdown. Be specific with tactics, not generic frameworks. Healthcare sales has unique dynamics — address them directly.
```

---

### K4 · Product Specification Synthesis `[Kimi]`

**Save to:** `/research/raw/phase-5-product-gtm/K4.md`
**Prerequisites:** Paste K1.md + P10.md + P11.md (all three, full content)

```
You are a senior product manager and product strategist with deep expertise in B2B healthcare SaaS.

I have completed research on clinical workflows, pricing strategy, and GTM channels. All three documents are attached:

1. Clinical workflow analysis — call taxonomy, scheduling logic, intake flows, feature priority [K1.md]
2. Pricing and monetization strategy [P10.md]
3. GTM channels and sales strategy [P11.md]

{{PASTE: K1.md — full content}}

{{PASTE: P10.md — full content}}

{{PASTE: P11.md — full content}}

---

Synthesize this into a complete Product Specification for v1:

SECTION 1 — Product Vision & Positioning Statement
- One-sentence product description (for sales)
- One-paragraph product vision (for internal alignment)
- Positioning: who it's for, what it does, why it's better than alternatives

SECTION 2 — v1 Feature Set (Scoped)
Based on the clinical workflow research and pricing tiers:
- Define the complete v1 feature set — every feature that will be built before first customer
- Separate into: core (must-have for any customer), Starter tier, Growth tier, Enterprise tier
- For each feature: user story, acceptance criteria, priority (P0/P1/P2)

SECTION 3 — User Personas & Jobs-to-Be-Done
Define 3 key personas:
1. The practice manager (primary buyer)
2. The front-desk staff (primary user)
3. The patient (end user of the voice interaction)
For each: goals, pain points, success metrics, fears about AI adoption

SECTION 4 — Product Metrics & KPIs
- Define the North Star metric for this product
- Define leading indicators (weekly active practices, calls handled, booking rate)
- Define lagging indicators (NPS, churn rate, ACV expansion)
- What does "success" look like at 3 months, 6 months, 12 months post-launch?

SECTION 5 — v1 Onboarding Flow
- Design the complete onboarding journey for a new practice:
  Step 1: Sign up and account creation
  Step 2: Practice configuration (providers, hours, services, call script)
  Step 3: EHR integration setup
  Step 4: Phone number configuration / call forwarding setup
  Step 5: Test call and go-live
- Estimated time to value (first call handled by AI)
- What can be self-serve vs. requires human onboarding support at v1?

SECTION 6 — Risk & Assumption Register
- Top 10 product assumptions that must be validated in the first 90 days
- For each assumption: what it is, why it matters, how to test it, and what we do if it's wrong

Format: This is a formal Product Requirements Document (PRD). Use H2 headers, tables for feature lists, and be specific with acceptance criteria. It should be directly usable by engineering for sprint planning.
```

---

## Phase 6 — Engineering SDLC
> **Prerequisites: All phases 1–5 must be completed. Run K5 and P12 in parallel; K6 is final.**

---

### K5 · System Architecture Document `[Kimi]`

**Save to:** `/research/raw/phase-6-engineering/K5.md`
**Prerequisites:** Paste K3.md + K2.md + P4.md + K4.md (all four, full content)

```
You are a principal software architect. You are producing the definitive system architecture document for an AI medical voice receptionist SaaS product.

Attached research documents:
1. Technology stack synthesis and architecture decisions [K3.md]
2. Compliance engineering requirements [K2.md]
3. EHR integration landscape [P4.md]
4. Product specification v1 [K4.md]

{{PASTE: K3.md — full content}}

{{PASTE: K2.md — full content}}

{{PASTE: P4.md — full content}}

{{PASTE: K4.md — full content}}

---

Produce a complete System Architecture Document:

SECTION 1 — Architecture Overview
- System context diagram description (our system, external systems, actors)
- High-level component inventory: all services, their responsibilities, their interfaces
- Architectural style: event-driven microservices? Modular monolith first? Justify the choice for a 3–5 engineer team.

SECTION 2 — Service Decomposition
Define each service/module with:
- Name and single responsibility
- Technology (language, framework)
- External dependencies
- API surface (REST, gRPC, WebSocket, event)
- Data owned
- Scaling characteristics

Services to define at minimum:
- Call Ingestion Service (telephony webhook handling)
- Voice Pipeline Orchestrator (STT → LLM → TTS coordination)
- Conversation Engine (state management, intent processing)
- EHR Adapter Service (FHIR client, per-EHR adapters)
- Scheduling Service (slot management, booking)
- Practice Configuration Service (hours, providers, FAQs, call script)
- Notification Service (SMS/email confirmations)
- Admin API (dashboard backend)
- Auth Service (multi-tenant, RBAC)
- Audit & Compliance Service (immutable log, PHI access tracking)
- Billing Service (usage metering, Stripe integration)

SECTION 3 — Data Architecture
- Complete data model: all entities, key fields, relationships
  Entities: Practice, Provider, Patient (reference only), CallSession, Appointment, AuditLog, CallRecording, PracticeConfiguration, User, Subscription
- Database per service or shared? Justify.
- PHI data flows: which services touch PHI, how it's encrypted, how long it's retained
- Event schema for inter-service communication (key events: CallStarted, IntentDetected, AppointmentBooked, CallTransferred, CallEnded)

SECTION 4 — Real-Time Voice Pipeline (Detailed)
- Step-by-step data flow for a complete call (from PSTN ring to call end)
- Sequence diagram description: every message exchange between components
- Latency measurement points and targets
- Error handling at each step (STT failure, LLM timeout, EHR unreachable)
- Graceful degradation: what does the AI do if EHR is down? If LLM is slow?

SECTION 5 — API Design
- External API: REST API spec outline for admin dashboard and future third-party integrations
- Webhook spec: events we emit to customer systems
- EHR adapter interface: abstract interface all EHR adapters must implement
- Internal API conventions: versioning, error format, authentication

SECTION 6 — Engineering Standards & SDLC
- Repository structure recommendation (monorepo vs. polyrepo)
- CI/CD pipeline design: test → build → staging → production
- Testing strategy: unit, integration, voice pipeline E2E tests
- Code review and branching strategy (trunk-based recommended?)
- Documentation standards (ADRs for architecture decisions)
- Sprint structure recommendation for a 3–5 engineer team

Format: This is a formal technical architecture document. Use H2 sections, tables for service definitions, and numbered lists for sequences. It should be the reference document for all engineering decisions.
```

---

### P12 · Security, Fraud & Pen-Testing `[Perplexity]`

**Save to:** `/research/raw/phase-6-engineering/P12.md`

```
You are a healthcare security engineer and penetration tester. I am building a HIPAA-compliant AI voice receptionist SaaS. Research the specific security landscape for voice AI systems in healthcare:

SECTION 1 — Voice AI Threat Model
- What are the specific attack vectors for an AI voice receptionist?
  - Voice spoofing / deepfake caller impersonation
  - Prompt injection via patient speech (adversarial inputs to LLM through voice)
  - Social engineering the AI to bypass safety rules
  - Call flooding / telephony DDoS
  - Man-in-the-middle on audio streams
  - EHR API credential theft
- For each threat: likelihood, impact, current state-of-the-art mitigations

SECTION 2 — HIPAA Security Rule — Technical Safeguard Checklist
Map each HIPAA technical safeguard to specific controls we must implement:
- Access control (unique user identification, automatic logoff, encryption/decryption)
- Audit controls (hardware, software, procedural mechanisms for activity in PHI systems)
- Integrity controls (PHI alteration/destruction protection)
- Transmission security (encryption in transit — specify TLS versions, cipher suites)
- Authentication mechanisms

SECTION 3 — Penetration Testing for Healthcare SaaS
- What pen-testing scope is required before signing enterprise BAAs?
- OWASP Top 10 — which are most relevant for our architecture (API, voice pipeline, admin dashboard)?
- OWASP API Security Top 10 — map to our API surface
- Voice-specific security tests: what does a pen-test for a voice AI system look like?
- Recommended pen-testing vendors/tools for healthcare SaaS (2024)
- SOC 2 Type II vs. HITRUST — which to pursue first and why?

SECTION 4 — LLM-Specific Security
- Prompt injection via speech: can a patient say something that hijacks the AI's behavior?
- LLM jailbreaking in a medical voice context — known attack patterns
- Data poisoning risks if we fine-tune on practice call data
- PII/PHI leakage risks in LLM context windows (cross-tenant contamination)
- Output validation: how to prevent the LLM from saying something harmful or inaccurate

SECTION 5 — Telephony Fraud & Abuse
- TCPA compliance for outbound automated calls (appointment reminders)
- SIM swapping and caller ID spoofing — how to detect that a caller is who they claim to be
- Vishing (voice phishing) risk: bad actors calling the AI to extract patient data
- STIR/SHAKEN protocol — how it helps and its limitations
- Call flooding mitigation: rate limiting at the telephony layer

SECTION 6 — Security Development Lifecycle
- Security requirements to integrate into our sprint process
- Automated security scanning tools for CI/CD (SAST, DAST, dependency scanning)
- Secret detection pre-commit hooks
- Container image scanning (Trivy, Snyk)
- Recommended security review cadence before each major release

Format: Structured markdown. Include specific tooling recommendations and current (2024) CVE references where relevant.
```

---

### K6 · Master Research Synthesis `[Kimi]`

**Save to:** `/research/synthesis/final/master_brief.md`
**Prerequisites:** ALL previous research files (P1–P12, K1–K5)

```
You are a senior product and engineering strategist. You have been given the complete research output for a new B2B SaaS product: an AI medical voice receptionist.

All research documents are attached. They cover: market analysis, competitive intelligence, regulatory compliance, clinical workflows, EHR integrations, technology stack, architecture, OSS components, cloud infrastructure, pricing, GTM strategy, product specification, system architecture, and security.

{{PASTE: P1.md}} {{PASTE: P2.md}} {{PASTE: P3.md}}
{{PASTE: K1.md}} {{PASTE: K2.md}} {{PASTE: P4.md}}
{{PASTE: P5.md}} {{PASTE: P6.md}} {{PASTE: P7.md}}
{{PASTE: K3.md}} {{PASTE: P8.md}} {{PASTE: P9.md}}
{{PASTE: P10.md}} {{PASTE: P11.md}} {{PASTE: K4.md}}
{{PASTE: K5.md}} {{PASTE: P12.md}}

---

Produce the Master Briefing Document — the single source of truth that any new team member, investor, or engineering lead can read to understand the entire product:

SECTION 1 — Executive Summary (1 page)
- What the product is and who it's for
- Market opportunity in 3 bullet points
- Core technology approach in 3 bullet points
- v1 scope in 3 bullet points
- Go-to-market in 3 bullet points
- Top 3 risks and mitigations

SECTION 2 — Key Decisions Log
For every major decision made across all research phases, document:
- Decision: what was decided
- Rationale: why
- Tradeoffs accepted: what we're giving up
- Revisit trigger: what would cause us to reconsider

Cover: technology stack choices, architecture style, build vs. buy decisions, pricing model, first ICP, first EHR integration target, compliance approach.

SECTION 3 — Consolidated Risk Register
Merge all risks from all research phases into a single prioritized register:
- Rank by: (probability × impact) score
- Top 10 risks with owner (Product / Engineering / Compliance / GTM) and mitigation

SECTION 4 — 12-Month Execution Roadmap
- Month 1–2: Foundation (infra, compliance framework, MVP call pipeline)
- Month 3–4: MVP with first EHR integration, closed beta with 2–3 practices
- Month 5–6: Beta learnings, v1 launch, first paying customers
- Month 7–9: Growth features, second EHR integration, sales motion
- Month 10–12: Enterprise features, SOC 2 completion, scale

SECTION 5 — Open Questions & Research Gaps
- What questions remain unanswered after all this research?
- What assumptions have we not yet validated?
- What requires talking to actual customers/prospects before building?

Format: Executive-quality markdown document. Crisp, decisive, no filler. This is the document that gets shared with investors and senior hires.
```

---

## Quick Reference — Task Sequence

```
PHASE 1 (parallel)     P1 → P2 → P3
PHASE 2 (sequential)   P1+P2+P3 → K1, K2, P4
PHASE 3 (parallel)     K1+K2+P4 → P5, P6, P7
PHASE 4 (sequential)   P5+P6+P7 → K3, then K3+P4 → P8, P9
PHASE 5 (mixed)        K3+P8+P9 → P10, P11 → K4
PHASE 6 (sequential)   K4+K3+K2+P4 → K5, P12 → K6 (master)
```

---

*Generated for: Medical Voice Receptionist — SDLC Research Plan*
*Total tasks: 12 (8 Perplexity · 4 Kimi) across 6 phases*
