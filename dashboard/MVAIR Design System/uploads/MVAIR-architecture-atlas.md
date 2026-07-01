# MVAIR Architecture Atlas

*Layer-by-layer maps of the AI voice-receptionist product. Prepared 25 June 2026.*
*Format: Mermaid (text-based diagrams). Each section below is an individual map. The source is editable — you can tweak any node or edge directly. Styling is deliberately minimal; the priority is clarity, not decoration.*

**Research backing:** the layer content comes from the three-part research engagement (`01`–`03`). The runtime mechanics, event names, response budgets, and payload contents were re-verified for this task against Vapi's current documentation (Server events, List Assistants / ServerMessage schema, Custom Tools, Assistant hooks, End-of-Call Report).

---

## How to read these maps — legend

**Status tags** (in every node label): `[RENTED]` runs inside Vapi · `[CUSTOM]` your code · `[LIVE]` built and working today · `[GAP]` not built, blocks a sale · `[FUTURE]` planned, not blocking.

**Node shapes**
- `(["stadium"])` — a running service / process
- `["rectangle"]` — a code module / component
- `[("cylinder")]` — a datastore
- `{{"hexagon"}}` — an external system or trust boundary endpoint
- `[/"parallelogram"/]` — an event / message on the wire

**Edge meaning**
- solid `-->` — live runtime data or control flow
- dashed `-.->` — not-yet-built, planned, or cross-cutting/observing relationship
- an edge label in quotes names the payload or trigger that crosses it

```mermaid
flowchart LR
  a(["service / process"])
  b["code module"]
  c[("datastore")]
  d{{"external / boundary"}}
  e[/"event on the wire"/]
  a -->|"live flow"| b
  b -.->|"planned / gap"| c
  classDef rented fill:#eef2f7,stroke:#5b7aa6,color:#1f3550;
  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef store fill:#f3f0e9,stroke:#9a8c6a,color:#403821;
  classDef ext fill:#f5eef5,stroke:#996699,color:#3d273d;
  classDef gap fill:#faecec,stroke:#b35a5a,stroke-dasharray:4 3,color:#5a2020;
  class a rented; class b custom; class c store; class d ext; class e gap;
```

---

## Map 0 — Full-stack skeleton (the eight layers, edge to organs)

```mermaid
flowchart TB
  caller{{"Patient phone — PSTN caller [external]"}}

  subgraph L0["Layer 0 · Carrier edge"]
    l0["DID +18564402211 maps to tenant medical-clinic<br/>Carrier / SIP transport"]
  end
  subgraph L1["Layer 1 · Voice runtime [RENTED: Vapi]"]
    l1(["Real-time loop: STT · LLM · TTS · telephony<br/>VAD / endpointing / barge-in"])
  end
  subgraph L2["Layer 2 · Integration / app server [CUSTOM]"]
    l2["Webhook receiver · Assistant builder · 5 tool handlers<br/>Auth JWT-RBAC · Tenant resolver — localhost:3001 via ngrok"]
  end
  subgraph L3["Layer 3 · Persistence [CUSTOM]"]
    l3[("SQLite: sessions · leads · appointments · tenants · users")]
  end
  subgraph L4["Layer 4 · External actuators"]
    l4["Google Calendar [LIVE] · PMS/EHR [GAP] · CRM/SMS [FUTURE]"]
  end
  subgraph L7["Layer 7 · Product surfaces [CUSTOM]"]
    l7["Dashboard:5173 · Config · Landing / · Design system · Aria persona"]
  end

  l5{{"Layer 5 · Compliance immune system — BAA chain · encryption · audit · retention [GAP]"}}
  l6(["Layer 6 · Observability — Live Monitor:3000 · System Health [LIVE] / simulation · metrics [GAP]"])

  caller --> l0 --> l1
  l1 ==>|"TRUST BOUNDARY: rented to custom<br/>assistant-request · tool-calls · end-of-call-report"| l2
  l2 --> l3
  l2 --> l4
  l3 -.-> l7
  l2 -.-> l7
  l5 -. "wraps every PHI hop" .- l1
  l5 -. "wraps every PHI hop" .- l2
  l5 -. "wraps every PHI hop" .- l3
  l6 -. "observes" .- l1
  l6 -. "observes" .- l2

  classDef rented fill:#eef2f7,stroke:#5b7aa6,color:#1f3550;
  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef store fill:#f3f0e9,stroke:#9a8c6a,color:#403821;
  classDef ext fill:#f5eef5,stroke:#996699,color:#3d273d;
  classDef gap fill:#faecec,stroke:#b35a5a,stroke-dasharray:4 3,color:#5a2020;
  class caller ext; class l0 rented; class l1 rented; class l2 custom; class l3 store; class l4 custom; class l7 custom; class l5 gap; class l6 rented;
```

*The one structural fact to hold: the heavy edge between Layer 1 and Layer 2 is the only seam between what you rent and what you own. Everything below that line is your product; everything above it is commodity.*

---

## Map 1 — Layer 0 · Carrier edge

```mermaid
flowchart LR
  patient{{"Patient phone<br/>(PSTN caller) [external]"}}
  did["Inbound DID<br/>+18564402211"]
  carrier(["Carrier / SIP transport<br/>(Twilio-class, Vapi-managed)"])
  tmap["Number to tenant map<br/>+18564402211 to medical-clinic"]
  ingress(["Vapi call ingress<br/>(hands off to Layer 1)"])

  patient -->|"places call"| did
  did -->|"1 to 2 rings"| carrier
  carrier -->|"bridges live audio"| ingress
  did -.->|"resolved by"| tmap
  tmap -.->|"selects tenant context"| ingress

  classDef rented fill:#eef2f7,stroke:#5b7aa6,color:#1f3550;
  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef ext fill:#f5eef5,stroke:#996699,color:#3d273d;
  class patient ext;
  class did rented;
  class carrier rented;
  class ingress rented;
  class tmap custom;
```

*Endpoints: one inbound number, one tenant today. Multi-tenant capable — additional numbers map to additional tenants without touching the engine.*

---

## Map 2 — Layer 1 · Voice runtime (the real-time loop, inside Vapi)

```mermaid
flowchart LR
  audioIn[/"caller audio in"/]
  stt(["STT / transcriber<br/>(partial + final transcripts)"])
  vad["VAD / endpointing<br/>(turn detection ~1450ms default)"]
  llm(["LLM<br/>(decides reply or tool call)"])
  tts(["TTS / voice<br/>(Elliot native [LIVE] · ElevenLabs wired, key absent)"])
  audioOut[/"assistant audio out"/]
  barge["barge-in / user-interrupted<br/>(interruption handling)"]

  audioIn --> stt
  stt -->|"transcript"| vad
  vad -->|"turn complete"| llm
  llm -->|"reply text"| tts
  tts --> audioOut
  barge -.->|"cancels current turn"| tts
  audioIn -.->|"speech detected"| barge

  startEvt[/"assistant-request event (fires at call start)"/]
  endEvt[/"end-of-call-report event (fires at call end)"/]
  llm -.->|"only escape to your code"| startEvt
  llm -.->|"only escape to your code"| endEvt

  classDef rented fill:#eef2f7,stroke:#5b7aa6,color:#1f3550;
  classDef gap fill:#faecec,stroke:#b35a5a,stroke-dasharray:4 3,color:#5a2020;
  class stt rented; class llm rented; class tts rented; class vad rented; class barge rented;
  class audioIn rented; class audioOut rented; class startEvt gap; class endEvt gap;
```

*Critical: this entire loop runs inside Vapi. There is no per-turn hook into your code. Your only two synchronous touch-points with a live call are the start event and the end event (next map).*

---

## Map 3 — Layer 1b · The Vapi server-event surface (every message that reaches your webhook)

```mermaid
flowchart TB
  vapi(["Vapi runtime"])

  subgraph LC["Lifecycle — needs a response"]
    e1[/"assistant-request — return assistant, transient, or transfer within 7.5s"/]
    e2[/"tool-calls — return result keyed by toolCallId"/]
    e3[/"transfer-destination-request"/]
    e4[/"handoff-destination-request"/]
  end
  subgraph LN["Conversation — notify only"]
    n1[/"conversation-update"/]
    n2[/"transcript (partial or final)"/]
    n3[/"speech-update"/]
    n4[/"model-output"/]
    n5[/"user-interrupted"/]
    n6[/"assistant.speechStarted (opt-in)"/]
  end
  subgraph LS["Status / close — notify only"]
    s1[/"status-update"/]
    s2[/"hang (no reply timeout)"/]
    s3[/"assistant.started"/]
    s4[/"end-of-call-report: transcript · recording URLs · analysis · costs"/]
  end

  vapi --> e1
  vapi --> e2
  vapi --> e3
  vapi --> e4
  vapi --> n1
  vapi --> n2
  vapi --> n3
  vapi --> n4
  vapi --> n5
  vapi --> n6
  vapi --> s1
  vapi --> s2
  vapi --> s3
  vapi --> s4

  classDef rented fill:#eef2f7,stroke:#5b7aa6,color:#1f3550;
  classDef act fill:#fff4e6,stroke:#c98a3a,color:#5a3a12;
  classDef note fill:#f4f4f4,stroke:#999,color:#333;
  class vapi rented;
  class e1 act; class e2 act; class e3 act; class e4 act;
  class n1 note; class n2 note; class n3 note; class n4 note; class n5 note; class n6 note;
  class s1 note; class s2 note; class s3 note; class s4 note;
```

*Orange = events that require a meaningful synchronous reply (these are where your server must be fast and correct). Grey = fire-and-forget notifications you persist or display. MVAIR uses `assistant-request`, `tool-calls`, and `end-of-call-report` as its load-bearing three.*

---

## Map 4 — Layer 2 · Integration / app server (your custom layer)

```mermaid
flowchart TB
  tunnel{{"ngrok public URL<br/>genre-remote-trapezoid... [boundary]"}}
  recv["Webhook receiver / router<br/>localhost:3001"]

  subgraph BLD["Assistant provisioning"]
    builder["Assistant builder<br/>(builds Aria per tenant + date injection)"]
    budget["Constraint: respond under 7.5s"]
  end
  subgraph TOOLS["Tool handlers (the 5 tools)"]
    t1["check_availability"]
    t2["get_available_slots"]
    t3["book_appointment"]
    t4["capture_lead"]
    t5["log_emergency"]
    seam["static parameters<br/>(server-trusted values, hidden from LLM)"]
  end
  subgraph SEC["Access + tenancy"]
    auth["Auth: JWT login/logout · RBAC admin/super_admin"]
    resolver["Tenant resolver<br/>(configs/*.json seed DB on boot)"]
  end

  db[("SQLite [datastore]")]
  gcal{{"Google Calendar [LIVE]"}}

  tunnel --> recv
  recv -->|"assistant-request"| builder
  builder -.-> budget
  recv -->|"tool-calls (toolCallId)"| t1
  recv -->|"tool-calls"| t2
  recv -->|"tool-calls"| t3
  recv -->|"tool-calls"| t4
  recv -->|"tool-calls"| t5
  seam -.->|"guards"| t3
  t1 -->|"reads"| gcal
  t2 -->|"reads"| gcal
  t3 -->|"writes booking"| gcal
  t3 -->|"persists appointment"| db
  t4 -->|"persists lead"| db
  t5 -->|"persists emergency"| db
  recv -->|"end-of-call-report"| db
  auth -.->|"scopes"| resolver
  resolver -.->|"feeds"| builder
  resolver -.-> db

  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef store fill:#f3f0e9,stroke:#9a8c6a,color:#403821;
  classDef ext fill:#f5eef5,stroke:#996699,color:#3d273d;
  class recv custom; class builder custom; class budget custom; class t1 custom; class t2 custom; class t3 custom; class t4 custom; class t5 custom; class seam custom; class auth custom; class resolver custom;
  class db store; class gcal ext; class tunnel ext;
```

*Every edge into `db` and `gcal` is a place PHI may travel — cross-reference Map 7.*

---

## Map 5 — Layer 3 · Persistence (data model)

```mermaid
erDiagram
  TENANTS ||--o{ USERS : "has"
  TENANTS ||--o{ SESSIONS : "scopes"
  SESSIONS ||--o{ LEADS : "captures"
  SESSIONS ||--o{ APPOINTMENTS : "books"
  SESSIONS ||--o| RECORDINGS : "may have"

  TENANTS {
    string tenant_id PK
    string name
    string calendar_id
    bool   calendar_enabled
    json   config "assistant name, first msg, hours, services"
  }
  USERS {
    string user_id PK
    string tenant_id FK
    string role "admin | super_admin"
  }
  SESSIONS {
    string session_id PK
    string tenant_id FK
    string call_status
    string transcript
  }
  LEADS {
    string lead_id PK
    string session_id FK
    string caller_info
  }
  APPOINTMENTS {
    string appt_id PK
    string session_id FK
    string slot
    string calendar_ref
  }
  RECORDINGS {
    string session_id FK
    string recording_url
  }
```

*Attributes shown are representative of the described build; confirm exact column names against the live schema. The shape matters more than the names: this model is strikingly **niche-agnostic** — `sessions / leads / appointments / tenants / users` carry no dental- or medical-specific assumptions, which is why a second niche reuses it unchanged.*

---

## Map 6 — Layer 4 · External actuators (the hands' reach)

```mermaid
flowchart LR
  srv["App server (tool handlers)"]
  gcal{{"Google Calendar [LIVE]<br/>book + check availability"}}
  pms{{"PMS / EHR [GAP]<br/>Dentrix · Eaglesoft · Open Dental (dental)<br/>Epic · athenahealth (medical)"}}
  crm{{"CRM / SMS / insurance eligibility [FUTURE]"}}

  srv -->|"read/write today"| gcal
  srv -.->|"buyer Gate 2 — biggest moat gap"| pms
  srv -.->|"later niches"| crm

  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef ext fill:#f5eef5,stroke:#996699,color:#3d273d;
  classDef gap fill:#faecec,stroke:#b35a5a,stroke-dasharray:4 3,color:#5a2020;
  classDef future fill:#f0f0f0,stroke:#999,stroke-dasharray:2 2,color:#444;
  class srv custom; class gcal ext; class pms gap; class crm future;
```

*This single map is the difference between a demo and a sellable medical product. Calendar = "takes a message / side calendar" tier; PMS write-back = the tier funded competitors occupy.*

---

## Map 7 — Layer 5 · Compliance immune system (BAA chain + PHI flow)

```mermaid
flowchart TB
  clinic{{"Clinic (covered entity)"}}
  mvair["MVAIR (business associate)"]
  vapi{{"Vapi (subprocessor)"}}
  stt{{"STT provider"}}
  llm{{"LLM provider"}}
  tts{{"TTS provider"}}
  tel{{"Telephony provider"}}
  store[("PHI at rest: SQLite + recordings")]

  clinic -.->|"BAA 1 [GAP]"| mvair
  mvair -.->|"BAA 2 [GAP]"| vapi
  vapi -.->|"flow-down BAA [GAP]"| stt
  vapi -.->|"flow-down BAA [GAP]"| llm
  vapi -.->|"flow-down BAA [GAP]"| tts
  vapi -.->|"flow-down BAA [GAP]"| tel

  clinic ==>|"PHI: voice"| vapi
  vapi ==>|"PHI: transcript / audio"| stt
  vapi ==>|"PHI: text"| llm
  vapi ==>|"PHI: text"| tts
  vapi ==>|"PHI: transcript + recording URLs"| mvair
  mvair ==>|"PHI: stored"| store

  enc["Controls required:<br/>TLS 1.3 in transit · AES-256 at rest [PARTIAL]<br/>RBAC + tamper-proof audit log [GAP]<br/>data minimisation + retention policy [GAP]"]
  enc -. "must hold across every solid PHI edge" .- vapi
  enc -. .- store

  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef ext fill:#f5eef5,stroke:#996699,color:#3d273d;
  classDef store fill:#f3f0e9,stroke:#9a8c6a,color:#403821;
  classDef gap fill:#faecec,stroke:#b35a5a,stroke-dasharray:4 3,color:#5a2020;
  class clinic ext; class vapi ext; class stt ext; class llm ext; class tts ext; class tel ext; class mvair custom; class store store; class enc gap;
```

*Dashed edges = the BAA chain (the legal flow-down). Thick edges = the actual PHI data path. A sale is legally possible only when every dashed edge on a thick PHI path is signed. This is Gate 1 drawn as a system, not a checkbox.*

---

## Map 8 — Layer 6 · Observability / evaluation

```mermaid
flowchart TB
  calls(["Live + historical calls"])

  subgraph HAVE["Built today [LIVE]"]
    lm["Live Monitor :3000<br/>(active call state)"]
    sh["System Health panel"]
    logs["Call logs + transcripts"]
    play["Recording playback"]
  end
  subgraph GAP1["Production observability [GAP]"]
    trace["trace logging + version tags"]
    golden["golden-call health checks (drift/outage)"]
    alert["threshold alerting"]
    feed["feed low-scoring calls back to eval set"]
  end
  subgraph GAP2["Pre-production [GAP]"]
    sim["conversation simulation (accents/edge cases)"]
    reg["regression gate in CI/CD before deploy"]
  end
  subgraph METRIC["Metric framework [GAP]"]
    m1["1 Infrastructure (latency)"]
    m2["2 Agent execution"]
    m3["3 User reaction"]
    m4["4 Business outcome = task completion"]
  end

  calls --> lm
  calls --> sh
  calls --> logs
  calls --> play
  calls -.-> trace
  trace -.-> golden -.-> alert
  logs -.-> feed -.-> sim
  sim -.-> reg
  m1 -.-> m2 -.-> m3 -.-> m4

  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef gap fill:#faecec,stroke:#b35a5a,stroke-dasharray:4 3,color:#5a2020;
  class calls custom; class lm custom; class sh custom; class logs custom; class play custom;
  class trace gap; class golden gap; class alert gap; class feed gap; class sim gap; class reg gap; class m1 gap; class m2 gap; class m3 gap; class m4 gap;
```

---

## Map 9 — Layer 7 · Product surfaces (flesh and skin)

```mermaid
flowchart TB
  subgraph DASH["Admin dashboard :5173 [LIVE]"]
    p1["Sessions"]
    p2["Leads"]
    p3["Appointments"]
    p4["Emergency Log"]
    p5["System Health"]
    p6["Configuration (editable tenant config)"]
  end
  ts["Tenant switch (super_admin only)"]
  skin{{"Multi-tenancy membrane<br/>RBAC scoping + configs/*.json"}}
  land["Marketing landing page /"]
  ds["Design system (--mvair-* tokens · Hanken Grotesk + Newsreader)"]
  aria(["Aria persona — first message · name · tone · scope<br/>(the only part the caller experiences)"])

  ts -.->|"controls"| DASH
  skin -.->|"isolates each tenant's view"| DASH
  p6 -->|"writes config that builds"| aria
  ds -.-> DASH
  ds -.-> land

  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef ext fill:#f5eef5,stroke:#996699,color:#3d273d;
  class p1 custom; class p2 custom; class p3 custom; class p4 custom; class p5 custom; class p6 custom; class ts custom; class land custom; class ds custom; class aria custom; class skin ext;
```

---

## Map 10 — Habitat (runtime topology — where each organ physically lives)

```mermaid
flowchart LR
  subgraph ENV1["Patient device"]
    phone{{"Patient phone"}}
  end
  subgraph ENV2["Carrier network"]
    car(["Twilio-class SIP"])
  end
  subgraph ENV3["Rented cloud — Vapi + subprocessors (near us-west-2)"]
    voice(["Voice loop: STT · LLM · TTS · telephony"])
  end
  subgraph ENV4["Your infrastructure — localhost today"]
    joint{{"ngrok tunnel<br/>(load-bearing joint) :4040 inspector"}}
    app(["App + webhook server :3001"])
    dash(["Dashboard :5173"])
    mon(["Live Monitor :3000"])
    sql[("SQLite file")]
  end
  gcloud{{"Google Calendar (Google cloud)"}}

  phone --> car --> voice
  voice ==>|"webhooks"| joint --> app
  app --> sql
  app --> gcloud
  app -.-> dash
  app -.-> mon

  classDef rented fill:#eef2f7,stroke:#5b7aa6,color:#1f3550;
  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef store fill:#f3f0e9,stroke:#9a8c6a,color:#403821;
  classDef ext fill:#f5eef5,stroke:#996699,color:#3d273d;
  class phone ext; class car rented; class voice rented; class app custom; class dash custom; class mon custom; class sql store; class joint ext; class gcloud ext;
```

*The single point of failure for personalised calls: if the tunnel or `:3001` is down, `assistant-request` fails inside 7.5s and the call cannot be built. This is the mechanical meaning of "still on ngrok / no production deploy."*

---

## Pipeline P1 — Call provisioning (start of every call)

```mermaid
sequenceDiagram
  participant C as Caller
  participant CA as Carrier
  participant V as Vapi
  participant S as App Server
  participant DB as SQLite
  C->>CA: dials +18564402211
  CA->>V: bridges audio
  V->>S: assistant-request (server event)
  S->>DB: resolve tenant from number
  S->>S: build Aria (config + tools + date injection)
  S-->>V: assistant config (must return under 7.5s)
  V-->>C: Aria first message
  Note over V,S: if server is unreachable, call falls back / cannot personalise
```

---

## Pipeline P2 — Real-time conversation loop (per turn, inside Vapi)

```mermaid
sequenceDiagram
  participant C as Caller
  participant STT as STT
  participant LLM as LLM
  participant TTS as TTS
  C->>STT: speaks (audio)
  STT->>LLM: transcript + replayed state
  LLM->>TTS: reply text
  TTS->>C: speech
  Note over C,TTS: state is replayed each turn — the model is stateless; no hook into your code here
```

---

## Pipeline P3 — Tool execution (the only in-call moment your code runs)

```mermaid
sequenceDiagram
  participant LLM as LLM (in Vapi)
  participant V as Vapi
  participant S as App Server
  participant G as Google Calendar
  participant DB as SQLite
  LLM->>V: wants to call book_appointment
  V->>S: tool-calls (with toolCallId)
  S->>G: create booking
  G-->>S: confirmation
  S->>DB: persist appointment
  S-->>V: result keyed by toolCallId
  V-->>LLM: tool result in context
  LLM->>V: speaks confirmation to caller
```

---

## Pipeline P4 — Post-call ingestion (end of every call)

```mermaid
sequenceDiagram
  participant V as Vapi
  participant S as App Server
  participant DB as SQLite
  V->>S: end-of-call-report
  Note right of V: transcript · recording URLs · analysis(summary,<br/>successEvaluation) · costs
  S->>DB: persist session
  S->>DB: upsert lead
  S->>DB: store recording URL
  S->>DB: store appointment (if booked)
```

---

## Pipeline P5 — Compliance data-flow (the path that must be mapped to prove Gate 1)

```mermaid
flowchart LR
  a[/"caller speech (PHI)"/] --> b{{"Carrier"}}
  b --> c{{"Vapi"}}
  c --> d{{"STT/LLM/TTS subprocessors"}}
  c --> e["App server"]
  e --> f[("SQLite + recordings")]
  f --> g["Dashboard view"]
  classDef node fill:#faecec,stroke:#b35a5a,color:#5a2020;
  class a,b,c,d,e,f,g node;
```

*Every box is a BAA-chain node and a retention/audit obligation. This is the explicit PHI map to hand to counsel.*

---

## Map 11 — Coupling map (seams vs welded joints)

```mermaid
flowchart TB
  subgraph CLEAN["Clean seam — safe to change per niche"]
    cfg["Assistant config is DATA not code<br/>(persona, first message, tools list, hours)"]
    model["Data model is niche-agnostic<br/>(sessions/leads/appointments/tenants/users)"]
  end
  subgraph WELD["Welded joints — change has a cost beyond code"]
    cw["Engine ↔ Compliance chain<br/>(swap Vapi = re-paper every BAA)"]
    pw["Persistence ↔ Scale<br/>(SQLite-on-laptop = single node)"]
    phi["Anything touching PHI<br/>(removal = a compliance event, not a code change)"]
  end

  cfg -.->|"add a tool + an integration to enter niche 2"| model
  cw -. "do not casually swap" .- phi

  classDef custom fill:#eef6ee,stroke:#5a8f5a,color:#234023;
  classDef gap fill:#faecec,stroke:#b35a5a,stroke-dasharray:4 3,color:#5a2020;
  class cfg custom; class model custom; class cw gap; class pw gap; class phi gap;
```

*This is the map to consult before any "plug-and-change" work: green seams are where modularity is cheap and safe; red joints are where it carries a compliance or scaling cost. Per Concern 3, extract modular boundaries from the green seams only, and only after a second concrete niche makes them necessary.*

---

### Index of maps

0. Full-stack skeleton — the eight layers
1. Layer 0 — Carrier edge
2. Layer 1 — Voice runtime loop
3. Layer 1b — Vapi server-event surface
4. Layer 2 — Integration / app server
5. Layer 3 — Persistence data model
6. Layer 4 — External actuators
7. Layer 5 — Compliance / BAA chain
8. Layer 6 — Observability
9. Layer 7 — Product surfaces
10. Habitat / runtime topology
11. Coupling map
- Pipelines P1–P5 (provisioning, conversation loop, tool execution, post-call ingestion, compliance data-flow)
