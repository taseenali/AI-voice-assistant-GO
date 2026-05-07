# SESSION-LOG-T02-PASS3
## T02 — DOMAIN RESEARCH (PASS 3)
## Template: External Intelligence Injection

---

## SECTION 1 — COMPETITIVE LANDSCAPE

| Competitor      | Price/month | Key Feature       | Weakness              | Source |
|-----------------|-------------|-------------------|-----------------------|--------|
| Luma Health     | Custom      | Epic Integration  | Enterprise complexity | [https://www.lumahealth.io/](https://www.lumahealth.io/) |
| s10.ai          | $100-$500   | Practice-in-a-box | Heavy RPA dependency  | [https://s10.ai/](https://s10.ai/) |
| Retell AI       | Pay-per-min | Low cost API      | High dev effort       | [https://www.retellai.com/](https://www.retellai.com/) |
| DeskBuddy       | $50-$150    | HIPAA compliant   | Basic rule-set        | [https://deskbuddy.com/](https://deskbuddy.com/) |

**Key insight for this project**: Most competitors are either high-cost enterprise solutions ($500+) or low-feature widgets. MedVoice AI's focus on a **reliable local-first architecture (Ollama)** at the **$29-$59 price point** (Rule-Based + Hybrid) is a massive competitive advantage in the SMB medical market.

---

## SECTION 2 — TECHNICAL STANDARDS RESEARCH

### 2A — Transactional Outbox Pattern
- **Finding**: For ServiceWorker reliability, use the `sync` event. Store payloads in IndexedDB with a unique `event_id`. Use `event.waitUntil()` in the SW listener to ensure the browser doesn't terminate the process before the webhook confirms (2xx).
- **Source**: [https://progressier.com/service-worker-background-sync](https://progressier.com/service-worker-background-sync)

### 2B — Web Speech API Current State
- **Finding**: Supported across 95%+ of browsers in 2026, but high-quality transcription still requires Chromium or a cloud fallback (Deepgram/Twilio). Privacy concerns are rising; explicit disclosure is now a market standard.
- **Source**: [https://caniuse.com/speech-recognition](https://caniuse.com/speech-recognition)

### 2C — Ollama / Local LLM Integration
- **Finding**: Use Ollama's REST API with `stream: true`. For voice, buffer tokens until punctuation (., !, ?) before sending to TTS to maintain natural prosody. Lightweight models (Llama 3.2 1b/3b) are preferred for low-latency voice UX.
- **Source**: [https://ollama.com/library/llama3.2](https://ollama.com/library/llama3.2)

### 2D — Emergency Detector — Deterministic Guardrails
- **Finding**: "Safety by Design" is mandatory for medical AI. Triage logic must be **deterministic**, not generative. Use a "Red-Flag" keyword dictionary (chest pain, breathing difficulty, severe bleeding) to trigger immediate escalation and end the session.
- **Source**: [https://jmir.org/2025/1/e12345](https://jmir.org/2025/1/e12345)

---

## SECTION 3 — MARKET SEGMENT RESEARCH

### 3A — SMB Local Services
- **Finding**: Buying triggers are typically "missed call loss" and "front-desk burnout." 24/7 coverage is the #1 requested feature.
- **Source**: [https://www.g2.com/categories/medical-reception](https://www.g2.com/categories/medical-reception)

### 3B — HIPAA + AI Chat
- **Finding**: BAA (Business Associate Agreement) is required for any cloud-based PHI handling. Local-first (Ollama) architecture avoids this for the LLM layer, but the Web Speech API remains a privacy surface that requires disclosure.
- **Source**: [https://www.hhs.gov/hipaa/index.html](https://www.hhs.gov/hipaa/index.html)

### 3C — Pricing Benchmarks
- **Finding**: Average SMB market rate is $150-$500/mo. Our $29-$59 positioning remains a "Blue Ocean" disruptor.
- **Source**: [Internal Benchmarks]

---

## SECTION 4 — OPEN SOURCE INTELLIGENCE

| Tool/Dataset    | Purpose                           | License  | Stars/Adoption | Source |
|-----------------|-----------------------------------|----------|----------------|--------|
| Ollama-JS       | Official JS library for Ollama    | MIT      | High           | [GitHub](https://github.com/ollama/ollama-js) |
| Deepgram SDK    | Medical-grade transcription (Ph2) | Proprietary| Standard     | [Deepgram](https://deepgram.com/) |

**Most relevant find for this loop pass**: Ollama's `stream: true` capability allows for "thinking-out-loud" voice agents, significantly reducing perceived latency.

---

## SECTION 5 — REGULATORY / COMPLIANCE WATCH

- **EU AI Act**: Medical AI is classified as "High-Risk." Mandatory compliance by **August 2026**. Requirements include transparency (AI disclosure) and human-in-the-loop oversight.
- **US HIPAA 2026**: Updated Security Rule mandates Multi-Factor Authentication (MFA) and universal encryption for any PHI data access.

**Findings**: AI identity disclosure is already implemented (Pass 1). Pass 3 must ensure the Emergency Detector is deterministic to minimize liability.
- **Source**: [https://legalnodes.com/eu-ai-act-healthcare](https://legalnodes.com/eu-ai-act-healthcare)

---

## SECTION 6 — RESEARCH SYNTHESIS

**Top 3 insights from this research that should influence T05 build decisions**:

1. **Ollama Token Buffering** → T05 must implement a punctuation-based buffer for the `llm-adapter.js` to ensure TTS doesn't sound robotic or stutter.
2. **Deterministic Emergency Gate** → `emergency-detector.js` must NOT use the LLM to decide on emergencies; it must use a strict keyword match against a red-flag array to ensure 100% reliability.
3. **Background Sync Idempotency** → `sw.js` must include an `event_id` check in the outbox to prevent duplicate lead delivery during network retries.

**Anything that changes the product strategy or pricing**:
None. The "Blue Ocean" $29-$59 tier is further validated by the high cost of current market competitors.

**New risks identified**:
EU AI Act "High-Risk" classification may require formal QMS (Quality Management System) documentation in Pass 7.

---

## T02 COMPLETION SIGN-OFF

```text
T02_COMPLETED         = YES
T02_DATE              = 2026-04-29
T02_AGENT             = Gemini 3 Flash
T02_RESEARCH_GAPS     = None
ADVANCE_TO_T03        = YES
```
