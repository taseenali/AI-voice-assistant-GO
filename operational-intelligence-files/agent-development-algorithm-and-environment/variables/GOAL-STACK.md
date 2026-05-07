# GOAL STACK
## Prioritized objectives across all loop passes

---

## ACTIVE GOALS (Pass 5)

| Priority | Goal ID | Description                                                       | Owner Template | Source     |
|----------|---------|-------------------------------------------------------------------|----------------|------------|
| P0       | G-034   | Implement SSYNC-03 Option A — Netlify/Vercel edge function serves config | T05 | T07 Pass 4 |
| P0       | G-042   | Build Node.js backend server — config serving, LLM proxy, webhook routing | P0 | Pass 5 |
| P0       | G-043   | Migrate config serving to Node.js backend — solves SEC-02/SSYNC-03 | P0 | Pass 5 |
| P1       | G-035   | Admin UI scaffold — practice configuration editor                 | T05            | GAP-03     |
| P1       | G-036   | HIPAA BAA documentation checklist — vendors, requirements, status | T05            | GAP-08     |
| P2       | G-037   | Clean up dead code — this._enabled in llm-adapter.js line 166     | T05            | Pass 4     |

---

## BACKLOG (Future Passes)

| Goal ID | Description                                                        | Target Pass | Source      |
|---------|--------------------------------------------------------------------|-------------|-------------|
| G-010   | Fix SEC-02 — move sensitive config fields off public files         | COMPLETED     | SEC-02 (replaced by G-034) |
| G-017   | Build LLM API integration in orchestrator (Tier 2)                 | TBD           | GAP-01      |
| G-018   | Build admin UI for config editing                                  | COMPLETED     | GAP-03 (replaced by G-035) |
| G-019   | Build analytics event layer                                        | 6           | GAP-02      |
| G-021   | ML intent classifier training pipeline                             | TBD         | —           |
| G-022   | Production hardening + SLA documentation                           | 7           | —           |
| G-023   | Sales materials + demo environment                                 | 8           | —           |

---

## COMPLETED GOALS

| Goal ID | Description | Completed Pass | Notes |
|---------|-------------|----------------|-------|
| G-042   | Build Node.js backend server — config serving, LLM proxy, webhook routing | 6 | Live on port 3001 |
| G-043   | Migrate config serving to Node.js backend — solves SEC-02/SSYNC-03 | 6 | loader.js wired to /api |
| G-037   | Clean up dead code — llm-adapter.js cleanup | 6 | Complete |
| G-034   | Implement SSYNC-03 Option A | 6 | Option A deployed via Node.js |
| G-020   | Build ONNX / WebLLM local model option for Tier 2                 | 4 | Scaffold live |
| G-032   | Fix LLM adapter initialization — make isEnabled dynamic           | 4 | Dynamic getter active |
| G-033   | Medical vertical language sweep — configs, discovery, closing, personality, UI | 4 | Complete |
| G-015   | ServiceWorker Background Sync upgrade for outbox retry            | 3 | Completed |
| G-027   | Build LLM Adapter — Ollama provider                               | 3 | Completed |
| G-028   | Build Emergency Detector module                                   | 3 | Completed |
| G-029   | Expand patient fields for medical vertical                        | 3 | Completed |
| G-014   | Fix SEC-08 — verify response-builder.js uses textContent          | 3 | Completed |
| G-016   | iOS / non-Chromium speech fallback path                           | 3 | Completed |
| G-001   | Fix BUG-01 — webhook URL fallback (also SEC-06)                   | 1 | Hard throw added |
| G-002   | Fix BUG-02 — tenure field in lead-capture.js                      | 1 | Shape identical |
| G-003   | Fix BUG-03 — stale dist build (npm run build)                     | 1 | Built successfully |
| G-007   | Fix SEC-05 — EU AI Act compliance in all greeting strings         | 1 | AI assistant disclosure added |
| G-008   | Document mitigation plan for SEC-01 (webhook auth)               | 1 | Added to T05 log |
| G-025   | Document architectural decision for SSYNC-03 (config protection) | 1 | Option A decided |
| G-004   | Generate full project blueprint                                   | 1 | Created BLUEPRINT-CURRENT.md |
| G-005   | Audit all 6 functional + 3 security sync contracts               | 1 | Completed |
| G-006   | Define LLM tier architecture (Tier 2 design sketch)              | 1 | Completed |
| G-024   | Add `webhook_secret` and `ai_tier` to config schema + validator    | 1 | Scaffolded for Pass 2 |
| G-009   | Implement SSYNC-01 — webhook HMAC authentication full build       | 2 | Full-flow validated in T06 |
| G-011   | Fix SEC-03 — input sanitization in nlp-extractor.js               | 2 | Secondary gate added |
| G-012   | Fix SEC-04 — Web Speech API disclosure + text-only fallback       | 2 | Privacy notice + handler added |
| G-013   | Fix SEC-07 — unpredictable localStorage key for lead data         | 2 | av_leads_v1 namespace active |
| G-026   | TCPA compliance — voice consent mechanism before mic activation   | 2 | Banner + gate enforced |
---

## GOAL RULES

- P0 goals block loop advancement — must be resolved before T07
- P1 goals are required for loop completion
- P2 goals are best-effort, carry forward if not completed
- Security goals (SEC-XX source) are never downgraded below P0 for HIGH severity
- A goal is COMPLETED only when T06 quality gate validates the output
