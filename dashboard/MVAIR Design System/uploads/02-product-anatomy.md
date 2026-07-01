# Concern 2 — The Complete Internal Anatomy of an AI Voice-Receptionist Product

*Information-gathering only; no visual. Prepared 25 June 2026. Throughout: **(C)** = canonical anatomy any product in this category has; **(M)** = MVAIR's specific instance today. Every *should-we* question (modularity, swapping parts) is deferred to Concern 3.*

---

## The governing fact

A voice agent is **stateless at its core**. The LLM holds no memory between turns; the conversation does. Every turn the system replays who the caller is, what they have said, which slots are filled (name, phone, reason, urgency), and which actions are pending — **state lives in the prompt, not in the model** (NextPhone wire-level breakdown). Almost every structural decision below exists to manage that fact.

---

## The layered body plan (edge to organs)

### Layer 0 — Carrier edge (the mouth/ear to the outside world)
- **(C)** A PSTN number (DID) and carrier/SIP layer (Twilio, Telnyx, Vonage) bridging live audio into the voice runtime within 1–2 rings.
- **(M)** `+18564402211`, mapped to the `medical-clinic` tenant, on Vapi's native telephony.
- **Role:** the only part the *patient* ever touches.

### Layer 1 — Voice runtime / orchestration (the brainstem — rented from Vapi)
The involuntary nervous system: the real-time loop turning sound → text → decision → sound. Four rented organs plus reflexes:
- **STT / transcription (ears)** — streams partial transcripts while the caller is still talking; per-turn latency ~200–400ms.
- **LLM (cortex)** — receives partial transcript + running state; decides what to say or which tool to call.
- **TTS (voice)** — converts reply to speech. **(M)** Vapi-native Elliot today; ElevenLabs wired but key not in env.
- **Telephony transport (vocal cords/eardrum)** — carries audio both ways.
- **Reflexes / turn-taking** — VAD + endpointing (when the caller has finished), barge-in/interruption handling, denoising, background sound. Vapi's default VAD sits ~1450ms vs ~700ms on Retell; total round-trip should stay under ~1.5s (over 3s feels broken). Median 2026 production latency ~680ms; natural human turn-taking 200–500ms.

**Critical structural property:** this layer has **no per-turn hook to your code.** Vapi fires an HTTP event at call start (`assistant-request`) and another at call end (`end-of-call-report`); context is injected once at start and reconciled once at end. This is the single biggest constraint on what your custom layer can do *live*.

### Layer 2 — Integration / application server (the spinal cord and hands — your custom layer)
This is the part that is *yours* — where the actual product lives. Four structurally distinct jobs:

1. **Webhook receiver** — the listening post for Vapi server events: `conversation-update`, `end-of-call-report`, `function-call`, `hang`, `speech-update`, `status-update`, `tool-calls`, `transfer-destination-request`, `handoff-destination-request`, `user-interrupted`, `assistant.started`.
2. **Assistant builder** — on `assistant-request`, constructs the assistant dynamically and returns it. **(M)** = "Aria built dynamically per tenant and returned to Vapi on every call." Hard constraint: **you must respond within ~7.5 seconds end-to-end** (telephony enforces a 15s cap; Vapi reserves ~7.5s for setup). Recommended pattern: return a minimal assistant fast, enrich asynchronously.
3. **Tool execution handlers (the hands)** — when the LLM decides to act, your server receives an HTTP request containing the tool call, executes the function, and returns JSON keyed by `toolCallId` so the result is matched to the call and context preserved. **(M)** = the five tools: `check_availability`, `get_available_slots`, `book_appointment`, `capture_lead`, `log_emergency`. Security seam available here: **static parameters** can merge server-trusted values into the tool body without the LLM ever seeing them (relevant for PHI handling).
4. **Auth + tenant resolution** — **(M)** JWT login/logout, RBAC (admin vs super_admin), multi-tenant resolver loading `configs/*.json` and seeding the DB on boot, and date injection into the system prompt.

### Layer 3 — Persistence (the memory / system of record)
- **(C)** The datastore holding durable facts: who called, what they wanted, what was booked, who the tenants/users are.
- **(M)** SQLite — `sessions`, `leads`, `appointments`, `tenants`, `users`, plus recording-URL references. 31 real sessions, active leads table.
- **Structural note:** SQLite is single-file, single-node. The data *model* is portable; the *engine* (SQLite-on-laptop) does not survive horizontal scaling. (Implication = the "no production deployment" gap, treated in Concern 1.)

### Layer 4 — External actuators (the hands' reach into the world)
- **(C)** Systems the agent writes into to make something real happen: calendars, PMS/EHR, CRM, SMS, insurance eligibility.
- **(M)** Google Calendar only (real `calendar_id`, booking live). The PMS/EHR limb (Dentrix, Eaglesoft, Open Dental write-back) is absent — the limb buyers check first (Concern 1, Gate 2).

### Layer 5 — Compliance / security / trust (the immune system)
Not a panel — a property running through *every* layer that touches PHI, which is why it is an immune system, not an organ. Components:
- **The BAA chain** — a flow-down BAA with every subprocessor that touches PHI. On Vapi: clinic ↔ MVAIR ↔ Vapi ↔ (STT, LLM, TTS, telephony) — a chain, not a single signature.
- **Encryption** — TLS 1.3 in transit; AES-256 at rest.
- **Access control + audit** — RBAC and tamper-proof logs of every PHI access/modification/transmission.
- **Data minimisation + retention** — collect only the PHI needed; BAA must explicitly cover recordings and transcripts with defined retention.
- **Disclosure** — AB-3030-type rules; mostly excluded for scheduling/admin but jurisdiction-dependent.
- **(M) today:** TLS via HTTPS exists; RBAC exists in the app; the BAA chain, formal audit logging, and a retention policy are not in place. This is Gate 1 seen as a cross-cutting anatomical system rather than a checkbox.

### Layer 6 — Observability / evaluation (the senses and diagnostic nervous system)
The market has a mature four-part shape; MVAIR currently has the first part only:
- **Live monitoring** — **(M)** Live Monitor (port 3000) + System Health panel: real-time active-call state.
- **Production observability** — trace logging; golden-call health checks every few minutes to detect drift/outages; alerting on threshold breaches; version tagging to compare prompt/model versions; feeding low-scoring conversations back into the eval set (Hamming).
- **Pre-production simulation + regression gating** — end-to-end conversation simulation across diverse caller behaviours, accents, edge cases, wired into CI/CD so every prompt/logic change is validated before deploy (Coval, Cekura).
- **The metric framework** — a 4-layer model: Infrastructure → Agent Execution → User Reaction → Business Outcome, where **task completion** (did the caller achieve the objective) is the best business-value indicator, above raw latency. Healthcare-specific: gate every deploy on a simulation suite that verifies HIPAA-grade privacy boundaries hold under adversarial pressure (Twin Health pattern).
- **(M)** Live monitoring + call-log/recording playback exist; simulation, regression gating, drift detection, and business-outcome scoring do not. (Flagged as anatomy only — what to *build* is roadmap/Concern 3.)

### Layer 7 — Product surfaces (the flesh and skin — what humans see)
- **Admin dashboard** — **(M)** React/Vite/Tailwind (port 5173): Sessions, Leads, Appointments, Emergency Log, System Health, Configuration; super-admin tenant switching; editable tenant config; recording playback.
- **Configuration surface** — editable assistant name, first message, business hours, services, calendar toggle. The seam between human operator and assistant behaviour.
- **Marketing landing page** — **(M)** React at `/`.
- **Design system** — **(M)** `--mvair-*` tokens; Hanken Grotesk + Newsreader.
- **The Aria persona itself** — first message, name, tone, scope. The "face": the only part of the body the caller experiences as a personality.
- **Multi-tenancy** is the *skin* — the membrane keeping one clinic's data/config/view from touching another's. **(M)** enforced by `configs/*.json` seeding + RBAC scoping.

---

## The complete data-pipelines map (the circulatory system)

Eight distinct flows cut across the layers above:

1. **Call-provisioning pipeline** — caller dials DID → carrier bridges to Vapi → Vapi fires `assistant-request` → tenant resolved from number → Aria built from tenant config + date injection → assistant config returned within the 7.5s window → call begins.
2. **Real-time conversation loop** — audio → STT (partial) → LLM with replayed state → TTS → audio, repeating each turn, governed by endpointing/barge-in. **Lives entirely inside Vapi; your code is not in this loop.**
3. **Tool-execution pipeline** — LLM emits a tool call → Vapi sends `tool-calls`/`function-call` to your server → handler runs (e.g. `book_appointment` → Google Calendar API) → JSON result returned by `toolCallId` → spoken back. **The only point during a call where your code acts.**
4. **Post-call ingestion pipeline** — call ends → `end-of-call-report` delivers transcript, recording URL, summary, analysis → server persists session/lead/appointment to SQLite.
5. **Config / seed pipeline** — `configs/*.json` → seed DB on boot → tenant config drives both dashboard and per-call assistant build.
6. **Auth / access pipeline** — login → JWT issued → RBAC scopes which tenant's data a user can see.
7. **Observability pipeline** — live call state → Live Monitor; persisted logs/recordings → dashboard panels.
8. **Compliance data-flow (the pipeline you should map explicitly)** — the path PHI travels: caller speech → carrier → Vapi → STT/LLM/TTS subprocessors → your server → SQLite → dashboard → recording storage. Every hop is a BAA-chain node and a retention/audit obligation. This is the map needed to *prove* Gate 1.

---

## The habitat (runtime topology — where each organ physically lives)

The body is distributed across four environments:

- **The patient's phone** — caller endpoint, outside your control.
- **The carrier network** — Twilio/Telnyx, Vapi-managed today.
- **Rented cloud (Vapi + subprocessors)** — the entire real-time voice loop, STT/LLM/TTS; ideally co-located near `us-west-2` (Vapi recommends hosting the webhook close to us-west-2 to stay within the assistant-request budget).
- **Your infrastructure** — **(M)** currently *all on localhost*: app/webhook server (3001), dashboard (5173), Live Monitor (3000), ngrok inspector (4040), exposed via the ngrok tunnel (`genre-remote-trapezoid…` → localhost:3001). SQLite is a local file here. Google Calendar lives in Google's cloud.

**The load-bearing joint:** the webhook tunnel. Vapi can only reach the assistant-builder and tool-handlers through that public URL. If the tunnel or local server is down, `assistant-request` fails — and a failed assistant-request inside 7.5s means the call cannot be personalised (it would fall back to a minimal/transferred assistant). The fact that this critical joint runs over an ngrok tunnel to a laptop is the precise mechanical meaning of "no production deployment."

---

## Structural observations (joints, seams, coupling — facts, not recommendations)

Three anatomical facts that matter for Concern 3, stated here only as structure:

- **Clean seam — the assistant config is data, not code.** Aria is built per-call from tenant JSON, so the persona/behaviour layer is already decoupled from the engine. Swapping the first message, tools list, or business rules is a config change, not a redeploy.
- **Coupled — the engine and the compliance chain.** Vapi's per-subprocessor BAA requirement welds your compliance posture to your choice of voice runtime. You cannot change the trust story without touching the engine vendor relationship.
- **Coupled — persistence and scale.** SQLite-as-system-of-record ties the memory organ to a single node. The data model is portable; the engine is not.

*Whether any of these seams should become deliberate plug-and-change boundaries — and how that bears on selling to multiple niches — is Concern 3.*
