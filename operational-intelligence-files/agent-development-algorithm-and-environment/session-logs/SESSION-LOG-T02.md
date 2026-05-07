# T02 — DOMAIN RESEARCH
## Template: External Intelligence Injection

---

## SECTION 1 — COMPETITIVE LANDSCAPE

| Competitor      | Price/month | Key Feature       | Weakness              | Source |
|-----------------|-------------|-------------------|-----------------------|--------|
| MyAIFrontDesk   | $49–$99     | Voice reception   | Generic routing       | Web Search |
| WotNot          | $49–$299    | Omni-channel bot  | Complex setup         | Web Search |
| Emitrr          | $150–$250   | Dental specific   | Pricey for small SMB  | Web Search |

**Key insight for this project**: Most reliable SMB solutions start around $150/month for comprehensive AI voice. Our Tier 1 pricing at $29-59/month offers a significant blue ocean advantage for entry-level voice/chat lead capture.

---

## SECTION 2 — TECHNICAL STANDARDS RESEARCH

### 2A — Transactional Outbox Pattern
- **Finding**: Standard best practice utilizes the Service Worker Background Sync API alongside IndexedDB to process queues when network connection is restored, ensuring offline resilience.
- **Source**: Web Search ("transactional outbox pattern client side IndexedDB")

### 2B — Web Speech API Current State
- **Finding**: Chromium-only support for recognition. Relying on Google/Azure cloud breaks strict local data privacy and limits enterprise use.
- **Source**: Web Search ("Web Speech API browser support enterprise limitation 2025")

### 2C — Local LLM in Browser (for future Tier 2)
- **Finding**: WebLLM via WebGPU achieves 25–35 tokens/s for Phi-3.5-mini on high-end hardware. Llama.cpp WASM serves as a robust CPU fallback. Very viable for local Tier 2.
- **Source**: Web Search ("WebLLM browser local LLM Phi-3-mini")

### 2D — Intent Classification — Lightweight Models
- **Finding**: DistilBERT running via ONNX Runtime Web is highly effective for fast, on-device intent classification.
- **Source**: Web Search ("lightweight intent classification browser javascript")

---

## SECTION 3 — MARKET SEGMENT RESEARCH

### 3A — SMB Local Services (Roofing, HVAC, Dental)
- **Finding**: AI adoption is ~77% among SMBs. 24/7 availability and speed-to-lead are the primary buying triggers.
- **Source**: Web Search ("AI chatbot adoption small business ROI statistics 2025")

### 3B — HIPAA + AI Chat
- **Finding**: "Privacy by Architecture" (on-device processing without external API transmission) minimizes compliance burden and avoids Business Associate Agreement (BAA) requirements.
- **Source**: Web Search ("HIPAA compliant AI chatbot browser local processing BAA requirements")

### 3C — Pricing Benchmarks
- **Finding**: Market rate for capable SMB chatbots is $150–$800. Entry-level is $0–150. Our proposed pricing sits perfectly at the aggressive entry-level segment.
- **Source**: Web Search ("SaaS chatbot pricing SMB 2025")

---

## SECTION 4 — OPEN SOURCE INTELLIGENCE

| Tool/Dataset    | Purpose                           | License  | Stars/Adoption | Source |
|-----------------|-----------------------------------|----------|----------------|--------|
| WebLLM (MLC-AI) | In-browser WebGPU LLM inference   | Apache 2 | High           | Web Search |
| Wllama          | Llama.cpp WASM fallback port      | MIT      | Growing        | Web Search |

**Most relevant find for this loop pass**: WebLLM proves that building an entirely local, in-browser Tier 2 system is technically viable.

---

## SECTION 5 — REGULATORY / COMPLIANCE WATCH

**Findings**:
- **TCPA**: AI-generated voices are classified as "artificial or prerecorded" and require "prior express written consent."
- **EU AI Act & State Laws**: Explicit disclosure that the consumer is speaking to an AI is mandatory. The FTC is aggressively enforcing deceptive bot practices.
- **Source**: Web Search ("FTC AI disclosure requirements chatbot TCPA voice AI compliance 2025")

---

## SECTION 6 — RESEARCH SYNTHESIS

**Top 3 insights from this research that should influence T05 build decisions**:

1. **EU AI Act & FTC Compliance** → **Action for T05**: Ensure all greetings across configs explicitly state "I am an AI / virtual assistant" to resolve SEC-05.
2. **Web Speech API Privacy Limits** → **Action for T05**: Log SEC-04 mitigation plan to eventually implement a disclaimer or provide a strict text-only path for privacy-sensitive segments.
3. **WebLLM Feasibility** → **Action for T05**: The local Tier 2 architecture (G-006) should target WebLLM / WebGPU as the primary inference engine to bypass cloud costs and privacy risks.

**Anything that changes the product strategy or pricing**:
"Privacy by architecture" through local browser processing validates our strategy and opens up the HIPAA-constrained market segment entirely without complex legal overhead.

**New risks identified**:
Strict TCPA and State-level AI disclosure laws mandate immediate compliance (P0 severity).

---

## T02 COMPLETION SIGN-OFF

```
T02_COMPLETED         = YES
T02_DATE              = 2026-04-28
T02_AGENT             = Antigravity
T02_RESEARCH_GAPS     = none
ADVANCE_TO_T03        = YES
```
