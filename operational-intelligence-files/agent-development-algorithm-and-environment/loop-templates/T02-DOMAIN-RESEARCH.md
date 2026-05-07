# T02 — DOMAIN RESEARCH
## Template: External Intelligence Injection

> **AGENT INSTRUCTIONS**: This is one of two research templates in the loop. Search open-source, industry, and technical sources. Record findings with sources. This intelligence informs T05 build decisions. Do not build anything here — research and document only.
> 
> **CRITICAL MINDSET RULE**: You are in implementation mode, not explanation mode. Do not write generic explanations of concepts (e.g., "Here is what HMAC is"). You must collect direct, actionable technical inputs for T05 implementation (e.g., "Use Web Crypto API `crypto.subtle.sign()` for HMAC-SHA256, attach to `X-Signature` header, verify using constant-time comparison"). Your research MUST directly fuel code changes.

---

## RESEARCH DOMAINS (Execute all sections)

---

## SECTION 1 — COMPETITIVE LANDSCAPE

**Research prompt**: Search for current voice agent / AI chatbot products targeting SMB markets. Find: pricing, features, tech stack where public, weaknesses mentioned in reviews.

**Target sources**: G2, Capterra, Product Hunt, Reddit (r/entrepreneur, r/SaaS), Hacker News

| Competitor      | Price/month | Key Feature       | Weakness              | Source |
|-----------------|-------------|-------------------|-----------------------|--------|
| [FILL]          | [FILL]      | [FILL]            | [FILL]                | [URL]  |
| [FILL]          | [FILL]      | [FILL]            | [FILL]                | [URL]  |
| [FILL]          | [FILL]      | [FILL]            | [FILL]                | [URL]  |

**Key insight for this project**: [What gap does this project fill that competitors miss?]

---

## SECTION 2 — TECHNICAL STANDARDS RESEARCH

**Research prompt**: Find current best practices for the specific technical patterns used in this project.

### 2A — Transactional Outbox Pattern
- Search: "transactional outbox pattern browser IndexedDB"
- Search: "reliable webhook delivery client-side javascript"
- **Finding**: [FILL — any improvements or alternatives to current implementation?]
- **Source**: [URL]

### 2B — Web Speech API Current State
- Search: "Web Speech API browser support 2025 2026"
- Search: "Web Speech API enterprise limitations"
- **Finding**: [FILL — what browsers support it, known issues, alternatives?]
- **Source**: [URL]

### 2C — Local LLM in Browser (for future Tier 2)
- Search: "WebLLM browser local LLM 2025"
- Search: "Phi-3 mini browser inference"
- Search: "Llama.cpp WebAssembly performance"
- **Finding**: [FILL — is this viable? What are the size/performance constraints?]
- **Source**: [URL]

### 2D — Intent Classification — Lightweight Models
- Search: "lightweight intent classification browser javascript 2025"
- Search: "DistilBERT ONNX browser intent detection"
- **Finding**: [FILL — what small models are production-viable for browser NLP?]
- **Source**: [URL]

---

## SECTION 3 — MARKET SEGMENT RESEARCH

**Research prompt**: Research the specific buyer segments identified in ENVIRONMENT.md.

### 3A — SMB Local Services (Roofing, HVAC, Dental)
- Search: "AI chatbot adoption small business 2025 statistics"
- Search: "lead capture automation ROI small business"
- **Finding**: [FILL — what % have adopted? What's the buying trigger?]
- **Source**: [URL]

### 3B — HIPAA + AI Chat
- Search: "HIPAA compliant AI chatbot requirements 2025"
- Search: "BAA requirement AI chat healthcare"
- **Finding**: [FILL — what is actually required? Does browser-local architecture satisfy it?]
- **Source**: [URL]

### 3C — Pricing Benchmarks
- Search: "SaaS chatbot pricing SMB 2025"
- **Finding**: [FILL — what is the market rate? Where is our proposed pricing?]
- **Source**: [URL]

---

## SECTION 4 — OPEN SOURCE INTELLIGENCE

**Research prompt**: Find open-source tools, datasets, or libraries that could improve this project.

| Tool/Dataset    | Purpose                           | License  | Stars/Adoption | Source |
|-----------------|-----------------------------------|----------|----------------|--------|
| [FILL]          | [FILL]                            | [FILL]   | [FILL]         | [URL]  |

**Most relevant find for this loop pass**: [DESCRIBE]

---

## SECTION 5 — REGULATORY / COMPLIANCE WATCH

**Research prompt**: Any new regulations affecting AI chatbots, voice agents, or lead capture in target markets?

- Search: "EU AI Act chatbot compliance 2025"
- Search: "FTC AI disclosure requirements chatbot"
- Search: "TCPA voice AI compliance 2025"

**Findings**:
- [FILL — any immediate compliance requirements for this product?]
- **Source**: [URL]

---

## SECTION 6 — RESEARCH SYNTHESIS

**Top 3 insights from this research that should influence T05 build decisions**:

1. [INSIGHT] → [Recommended action for T05]
2. [INSIGHT] → [Recommended action for T05]
3. [INSIGHT] → [Recommended action for T05]

**Anything that changes the product strategy or pricing**:
[FILL or "none"]

**New risks identified**:
[FILL or "none"]

---

## T02 COMPLETION SIGN-OFF

```
T02_COMPLETED         = [YES/NO]
T02_DATE              = [DATE]
T02_AGENT             = [AGENT]
T02_RESEARCH_GAPS     = [List any research areas where results were insufficient]
ADVANCE_TO_T03        = [YES/NO]
```
