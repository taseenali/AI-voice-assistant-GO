# AGENT ONBOARDING
## The First Prompt — Copy This Exactly When Starting Any Session

> Paste this entire prompt at the start of every session with any agent. Do not summarize. Do not paraphrase. Paste in full.

---

## ════════════════════════════════════════════════════
## PASTE EVERYTHING BELOW THIS LINE TO START A SESSION
## ════════════════════════════════════════════════════

You are operating inside a structured development environment for the **MedVoice AI** project — a multi-tenant, browser-native AI Medical Receptionist platform. This environment has a defined algorithm, a loop of templates, a security audit framework, and a skills library. You must follow all of them exactly.

**Before you respond to anything else, do the following in order:**

---

**STEP 1 — Read the environment files.**

Read these files completely before doing anything else:

1. `ENVIRONMENT.md` — project truth, all variables, known issues, sync contracts, rules
2. `SECURITY-AUDIT.md` — security domains, known SEC-XX issues, security sync contracts
3. `ALGORITHM.md` — the loop logic, execution rules, quality standards, skills rules
4. `skills/SKILLS-SOP.md` — how skills are created, used, and improved
5. `skills/SKILLS-INDEX.md` — master registry of all available skills
6. `variables/PROJECT-VARS.md` — current loop state, allowed/forbidden files
7. `variables/GOAL-STACK.md` — prioritized goals
8. `SYNC-MAP.md` — all functional and security sync contracts
9. The most recent file in `session-logs/` — where we left off
10. `PRODUCT-CAPABILITY-MATRIX.md` — actual product state
11. `AGENT-FAILURE-LOG.md` — known failure patterns to avoid

---

**STEP 2 — Report your starting state.**

After reading, respond with exactly this block filled in:

```
AGENT                   = [your model name and version]
LOOP_PASS               = [from ENVIRONMENT.md: ACTIVE_LOOP_PASS]
RESUMING_FROM           = [template name from ACTIVE_TEMPLATE]
OPEN_BUGS               = [BUG-XX count from ENVIRONMENT.md]
OPEN_SEC_ISSUES         = [SEC-XX count from ENVIRONMENT.md]
CONTRACTS_PASSING       = [functional: X/6 + security: X/3]
PASS_PRIMARY_GOAL       = [from PROJECT-VARS.md]
SKILLS_AVAILABLE        = [count from SKILLS-INDEX.md — COMPLETE only]
FIRST_ACTION            = [what you will do first — must be the active template]
```

Do not proceed until you have filled this block from the actual files.

---

**STEP 3 — Execute the active template.**

The active template is defined by `ACTIVE_TEMPLATE` in `PROJECT-VARS.md`.

Before executing T05, state which skills you have read:
```
SKILLS_READ = [list skill IDs relevant to this pass's FILES_ALLOWED_TO_MODIFY]
```

Execute the template now. Follow every instruction in it. Fill every bracket. Do not skip sections.

---

**STANDING RULES (apply for the entire session):**

1. Never modify files in `FILES_FORBIDDEN_TO_MODIFY` from `PROJECT-VARS.md`
2. Only write code during T05
3. Every claim about the code must reference a specific file and line number
4. New bugs → add to `ENVIRONMENT.md` immediately
5. New security findings → add to `SECURITY-AUDIT.md` immediately
6. HIGH severity SEC-XX findings block T06 without a documented mitigation plan
7. If a sync contract fails, do not advance past T04 until T05 can fix it
8. End every template with its COMPLETION SIGN-OFF block filled
9. Write to `session-logs/` at session end using SESSION-LOG-TEMPLATE.md
10. Never say "I assume" or "I believe the code does X" — read the file, state what it does
11. EU AI Act: any greeting string not disclosing AI identity is a P0 blocker
12. Emergency detector: NEVER route through LLM — read SK-009 before any changes to emergency-detector.js
13. Skills: read relevant skills before T05 — violations are caught at T06
14. Skills: if no skill covers a new pattern in T05, create a DRAFT skill immediately
15. Skills: no pass closes at T07 with uncompleted DRAFT skills
16. **Product Capability Matrix is truth.** Never claim a capability is COMPLETE unless PRODUCT-CAPABILITY-MATRIX.md shows it as VERIFIED.
17. **Agent failures must be logged.** Any provably wrong output must be added to AGENT-FAILURE-LOG.md before T07 closes.
18. **E2E Verification is required.** user-facing features built in T05 need T06E before goal is marked COMPLETED.

---

**THE PROJECT FILES ARE LOCATED AT:**
```
C:\Users\Public\OFFICIAL PROJECTS (DEVELOPMENT)\ai-voice-assistent\
```

**THE ENVIRONMENT FILES ARE LOCATED AT:**
```
C:\Users\Public\OFFICIAL PROJECTS (DEVELOPMENT)\ai-voice-assistent\operational-intelligence-files\agent-development-algorithm-and-environment\
```

---

**You may now begin. Start with STEP 1.**

## ════════════════════════════════════════════════════
## END OF PASTE
## ════════════════════════════════════════════════════

---

## MULTI-AGENT STRATEGY (Recommended)

```
T01–T02 — Gemini / Antigravity (fast scan + real-time research)
T03–T04 — Claude (precise code reading, security audit)
T05      — Claude (complex builds) or Antigravity (guided by skills)
T06      — Claude (validation against detailed rules)
T07      — Gemini / Either (research + synthesis + skills update)
```

## LOOP PASS QUICK REFERENCE

```
Current pass:     [check ENVIRONMENT.md — ACTIVE_LOOP_PASS]
Current template: [check PROJECT-VARS.md — ACTIVE_TEMPLATE]
Last session:     [check session-logs/ most recent file]
Blueprint:        blueprint/BLUEPRINT-CURRENT.md
All issues:       ENVIRONMENT.md — KNOWN ISSUES REGISTER
Security issues:  SECURITY-AUDIT.md — KNOWN SECURITY ISSUES
All modules:      variables/MODULE-REGISTRY.md
All syncs:        SYNC-MAP.md
Skills library:   skills/SKILLS-INDEX.md
Skills SOP:       skills/SKILLS-SOP.md
```
