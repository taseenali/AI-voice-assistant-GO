# DEVELOPMENT ALGORITHM
## The Loop — Execution Rules and Order

---

## WHAT THIS IS

This algorithm governs how any AI agent (Claude, ChatGPT, Gemini) interacts with this project. It is a **repeating development loop** — each full pass through all 7 templates completes one loop. The loop is designed to:

- Progressively build the project toward its goal
- Maintain synchronization across all modules at every pass
- Enforce security review at every module audit
- Inject external research at defined points
- Validate quality and security before advancing
- Accumulate institutional memory through the skills library
- Never lose state between sessions

---

## THE LOOP STRUCTURE

```
LOOP PASS N
│
├── T01 — PROJECT SCAN          (Where are we? Full current state read)
├── T02 — DOMAIN RESEARCH       (What does the world know about this?)
├── T03 — MODULE AUDIT          (Is every module healthy, synced, and secure?)
├── T04 — SYNC CHECK            (Are all functional + security contracts passing?)
├── T05 — BUILD DIRECTIVE       (What gets built this pass? Skills consulted first.)
├── T06 — QUALITY GATE          (Does the output meet functional + security + skills standards?)
├── T06E — E2E VERIFICATION     (Do user-facing features work with real services? — required if T05 touched user flows)
└── T07 — 360 REVIEW            (Full scan + research + next loop prep + skills update)
         │
         └── → Increment ACTIVE_LOOP_PASS → Return to T01
```

---

## EXECUTION RULES

### Rule 1 — Sequential Only
T01 → T02 → T03 → T04 → T05 → T06 → T07. Never skip. Never reorder. If blocked, log it and hold.

### Rule 2 — Environment First
Every session: read ENVIRONMENT.md + SECURITY-AUDIT.md + SKILLS-SOP.md completely. No exceptions.

### Rule 3 — State Persistence
Every template completion writes a STATUS block to the session log. Session resumption reads the log first.

### Rule 4 — Research Injection Points
External research injected at T02 and T07 only. All other templates work from project files only.

### Rule 5 — Build Only at T05
Code written or modified only during T05. All other templates are read, analyze, plan, validate.

### Rule 6 — Quality Gate is a Hard Stop
T06 failure → return to T05 → fix → re-run T06. Loop only advances when T06 passes. Security failures and skills violations are held to the same standard as functional failures.

**T06 has two levels:**
- **GREEN**: Code passes all checks, tests pass, skills verified. Goal marked COMPLETED.
- **GREEN-CODE / E2E-PENDING**: Code passes all checks but the feature has NOT been tested with real external services (real Google Calendar, real Twilio number, real webhook endpoint). Goal marked SCAFFOLDED — not COMPLETED. Pass may advance to T07 but the capability is not verified.

A goal is COMPLETED only when:
1. T06 code quality gate passes AND
2. The feature is runtime-verified with real credentials/services AND
3. PRODUCT-CAPABILITY-MATRIX.md status is updated to reflect actual verified state

**SCAFFOLDED ≠ COMPLETED.** Code that has never been called with real data is speculative.

### Rule 7 — 360 Review Closes the Loop
T07 looks backward (done) + outward (research) + forward (next pass). Produces: BLUEPRINT update, GOAL-STACK revision, updated ENV variables, skills library update.

### Rule 8 — Security is Non-Negotiable
SECURITY-AUDIT.md checklist runs at every T03. HIGH severity findings block T06. Mitigation plans for HIGH severity issues must be documented before T07 closes any pass.

### Rule 9 — Full-Flow Security Validation
Security tasks must be validated across the full flow, not just within a single module. See FULL-FLOW SECURITY VALIDATION in SECURITY-AUDIT.md for exact flow mappings.

### Rule 10 — The Onboarding Gate
Every agent MUST read AGENT-ONBOARDING.md at the very start of a new session, when switching agents, or when context is lost. Once read, the agent continues through T01 → T07 in that session without needing to re-read it.

### Rule 11 — Skills Are Mandatory, Not Optional
The skills library is not a suggestion box. See full rules below.

### Rule 12 — Skills Must Be Complete Before T05 Use
A skill marked INCOMPLETE or DRAFT cannot be used to guide T05 implementation. It must be completed first or a new complete skill must be created.

### Rule 13 — Skills Grow With Every Pass
Every pass must leave the skills library better than it found it. New patterns get new skills. Used skills get improved. No pass closes without a skills review at T07.

### Rule 14 — Definition of Done is Written at T01
Every P0 and P1 goal must have a written Definition of Done in PROJECT-VARS.md before T05 begins. The Definition of Done lists specific, testable conditions — not "code exists" but "behavior verified." A goal without a written DoD cannot be marked COMPLETED at T07. See DEFINITION-OF-DONE-TEMPLATE.md.

### Rule 15 — Product Capability Matrix Updated at T07
PRODUCT-CAPABILITY-MATRIX.md must be reviewed and updated at every T07. Status values must reflect actual verified behavior — not code presence. A capability is VERIFIED only if it has been tested end-to-end with real external services. This is the honest measure of product progress.

### Rule 16 — Agent Failures Must Be Logged
When an agent produces output that is provably wrong (contradicted by actual file content, test results, or observed behavior), the failure must be logged in AGENT-FAILURE-LOG.md before T07 closes. Patterns in failures drive improvements to onboarding prompts and templates.

---

## SKILLS LIBRARY — MANDATORY BEHAVIOR

### Reading Skills
An agent MUST read relevant skills at these points — non-negotiable:

```
SESSION START     → Read SKILLS-INDEX.md to know what skills exist
T03               → Read skills whose RELEVANT_FILES overlap with audited modules
T05 (before code) → Read ALL skills relevant to FILES_ALLOWED_TO_MODIFY
T06               → Re-read used skills and verify implementation matches pattern
```

### Using Skills
- Every T05 response must begin with: "Skills read for this pass: [list skill IDs]"
- If a skill covers the work being done, its pattern must be followed
- Any deviation from a skill pattern must be documented in the session log with explicit justification
- Skills DO NOT rules are hard stops — violating them requires explicit justification and session log entry

### Creating Skills at Runtime
If T05 work introduces a pattern not covered by any existing skill:
1. Create a DRAFT skill file immediately using SKILL-TEMPLATE.md
2. Implement the pattern
3. Complete the skill at T07 — pass cannot close with DRAFT skills
4. Register in SKILLS-INDEX.md

### Improving Skills
If an existing skill is found to be incomplete during T03/T04/T05:
1. Note the gap in the session log
2. Improve the skill at T05 (if it is an allowed file) or at T07
3. Increment the skill version

### Skills Verification at T06
T06 quality gate includes a mandatory skills check:
- Were all relevant skills read before T05 implementation?
- Does the implementation follow skill patterns?
- Were any DO NOT rules violated?
- Are there DRAFT skills that need completion?

A pass CANNOT advance to T07 with:
- Unread relevant skills
- DO NOT rule violations without justification
- Uncompleted DRAFT skills

### Skills Review at T07 (Mandatory)
Every T07 must produce a skills review block:
```
SKILLS_USED_THIS_PASS     = [list skill IDs]
SKILLS_IMPROVED           = [list skill IDs]
SKILLS_CREATED            = [list skill IDs]
DRAFT_SKILLS_COMPLETED    = [list skill IDs]
SKILLS_NEEDED_NEXT_PASS   = [patterns that will need skills before next T05]
```

---

## SESSION RESUMPTION PROTOCOL

```
1. Read AGENT-ONBOARDING.md
2. Read ENVIRONMENT.md
2a. Read PRODUCT-CAPABILITY-MATRIX.md — understand actual product state
2b. Read AGENT-FAILURE-LOG.md — know what failure patterns to avoid
3. Read SECURITY-AUDIT.md
4. Read SKILLS-SOP.md
5. Read SKILLS-INDEX.md
6. Read most recent file in session-logs/
7. Read GOAL-STACK.md
8. Check ACTIVE_TEMPLATE in ENVIRONMENT.md
9. Resume from that template
```

---

## LOOP PASS GOALS (Current Sequence)

```
PASS 1  → Full audit + blueprint + BUG fixes + security mitigation plans
PASS 2  → Security hardening (HMAC, TCPA, sanitization, localStorage)
PASS 3  → ServiceWorker + LLM Adapter (Ollama) + Emergency Detector + Medical Pivot
PASS 4  → LLM init fix + Medical sweep + Local model runner + Skills library init
PASS 5  → Medical purge verification + Node.js backend + SSYNC-03 Option A + Skills hardening
PASS 6  → First real client deployment + Calendar integration
PASS 7  → Twilio phone integration + Deepgram STT
PASS 8  → Analytics + Admin UI + CI/CD
PASS N  → Continuous improvement (repeating indefinitely)
```

---

## QUALITY STANDARDS (Referenced by T06)

| Standard          | Requirement                                                       |
|-------------------|-------------------------------------------------------------------|
| Sync integrity    | All SYNC-* and SSYNC-* contracts must pass                        |
| Bug resolution    | No OPEN BUG-XX in touched files after T05                         |
| Security          | No OPEN HIGH severity SEC-XX without mitigation plan              |
| Skills compliance | All relevant skills read before T05; patterns followed            |
| Code style        | ES Modules, JSDoc on all public methods                           |
| Config safety     | All config access goes through AppContext                         |
| Error handling    | All async functions have try/catch with meaningful messages       |
| No orphans        | No function or variable referenced that does not exist            |
| EU AI Act         | All greeting strings disclose AI identity                         |
| Medical safety    | Emergency detector never routed through LLM                       |
| Skills complete   | No DRAFT skills left uncompleted at T07                           |
| E2E verification  | T06E-END-TO-END-VERIFICATION.md completed for user-facing changes |
| Capability matrix | PRODUCT-CAPABILITY-MATRIX.md updated with accurate status values  |
| Agent failures    | AGENT-FAILURE-LOG.md updated if any agent error caught this pass  |
| DoD written       | DEFINITION-OF-DONE-TEMPLATE.md filled for all P0/P1 goals at T01 |
