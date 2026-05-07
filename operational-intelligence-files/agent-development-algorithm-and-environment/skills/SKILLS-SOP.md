# SKILLS SOP
## Standard Operating Procedure — Skills Library Governance

> **This document governs how skills are created, used, improved, and retired. All agents must read this file alongside ENVIRONMENT.md at every session start. Skills are institutional memory — they exist to prevent repeated mistakes and enforce proven patterns.**

---

## WHAT A SKILL IS

A skill is a documented, proven pattern specific to this codebase. It is not generic advice. It contains:
- The exact problem it solves in this project
- The exact code pattern to follow with real file names and line numbers
- Hard DO NOT rules with consequences
- The sync contract it protects
- A real example from actual pass history
- A sign-off table updated every time it is applied

Skills are **living documents**. They grow with the project. A thin skill is a liability — it gives false confidence without real guidance.

---

## WHEN TO USE SKILLS

### Mandatory Use Points
Skills are not optional suggestions. An agent MUST consult the skills library at these points:

| Point | Action Required |
|-------|----------------|
| T03 Module Audit | Check `SKILLS-INDEX.md` — any skill whose `RELEVANT_FILES` overlaps with files being audited must be read |
| T05 Build Directive — before writing any code | Read every skill file relevant to FILES_ALLOWED_TO_MODIFY |
| T05 Build Directive — when a new pattern is introduced | Check if a skill covers it; if not, trigger skill creation (see below) |
| T06 Quality Gate | Re-read relevant skills and verify the implementation matches the skill pattern |
| Any time an error or unexpected behavior is encountered | Check if an existing skill covers the failure mode |

### Proactive Use Points
An agent SHOULD consult skills proactively when:
- Modifying a file that has had bugs in previous passes
- Implementing a pattern that was learned through a previous failure
- Working on security-sensitive code (always read `security-hardening.md`)
- Working on medical domain logic (always read `medical-config.md`)
- Working on LLM integration (always read `ollama-integration.md`)

---

## HOW TO CREATE A NEW SKILL

### Trigger Conditions
A new skill MUST be created when any of the following occur:

1. **A new architectural pattern is introduced in T05** that does not exist in any current skill
2. **A bug is found in T03/T06** that could have been prevented by a documented pattern
3. **A new module or service is built** that future agents will need to modify
4. **A security fix is implemented** that establishes a new hardening pattern
5. **A new integration is built** (Twilio, Deepgram, Node.js backend, etc.)

### Creation Process — Never Create Thin Skills

Every new skill must go through this process before being written:

**Step 1 — Research Phase** (do this before writing the skill file)
- Search for current best practices for this pattern (web search if T02/T07)
- Read all existing skills to confirm no overlap
- Read the actual code that implements the pattern
- Identify every DO NOT case from the implementation experience

**Step 2 — Collect These Elements** (all are mandatory — skip none)
- Exact file paths and line numbers where the pattern lives
- The complete code snippet showing the correct implementation
- The complete code snippet showing the WRONG implementation
- The sync contract(s) this pattern protects
- The specific failure mode if this pattern is violated
- A real example from the pass where it was built or discovered

**Step 3 — Write Using the SKILL-TEMPLATE.md**
- Fill every section — no placeholders
- The "Real Example" section must reference actual pass, template, file, and line number
- The "Gotchas" section must list at least 2 real edge cases
- The "DO NOT" section must be specific — never generic

**Step 4 — Register in SKILLS-INDEX.md**
- Add the skill to the correct category
- Update `SKILL_ID` sequentially
- Note which pass created it

**Step 5 — Update at T07**
- Add to the skill's sign-off table
- If the skill was used, note what happened
- If the skill prevented a mistake, note that explicitly

---

## HOW TO IMPROVE AN EXISTING SKILL

A skill must be improved when:
- It was used in a pass and the agent found gaps in the guidance
- A new failure mode was discovered that the skill did not cover
- The pattern evolved (new library version, new architectural decision)
- The "Real Example" is outdated relative to current code

### Improvement Process
1. Read the current skill file completely
2. Identify exactly what is thin, missing, or outdated
3. Research the gap (current best practice, actual code state)
4. Add the missing content — do not replace, augment
5. Update `SKILL_LAST_USED` and `SKILL_VERSION` (increment minor version)
6. Add a row to the sign-off table noting the improvement

---

## SKILL QUALITY STANDARDS

A skill is considered COMPLETE only when it meets all of these:

| Standard | Requirement |
|----------|-------------|
| Specificity | References actual file paths and line numbers from this codebase |
| DO NOT rules | At least 2 explicit DO NOT rules with consequences |
| Code pattern | Complete code snippet — never truncated |
| Real example | References actual pass number, template, and outcome |
| Gotchas | At least 2 edge cases documented |
| Contract reference | At least 1 SYNC-* or SSYNC-* contract listed |
| Sign-off table | Updated every time the skill is applied |

A skill that does not meet all 7 standards is marked `STATUS = INCOMPLETE` and must be completed before it can be used in T05.

---

## SKILL STATUS VALUES

```
COMPLETE    = Meets all 7 quality standards. Ready for use.
INCOMPLETE  = Missing one or more required sections. Must be completed before T05 use.
DEPRECATED  = Pattern no longer applies. Kept for historical reference only.
DRAFT       = Skill created at runtime during T05. Must be completed at T07.
```

---

## RUNTIME SKILL CREATION (During T05)

If an agent begins implementing a pattern in T05 and realizes no skill covers it:

1. **Do not stop the build** — create a DRAFT skill file immediately
2. Name it `SK-[NEXT_ID]-[pattern-name]-DRAFT.md`
3. Fill only: SKILL_ID, SKILL_NAME, SKILL_CATEGORY, the Rule, and the Code Pattern
4. Mark `STATUS = DRAFT`
5. Register it in `SKILLS-INDEX.md` as DRAFT
6. Complete it fully at T07 before closing the pass
7. A pass cannot close at T07 if any DRAFT skill has not been promoted to COMPLETE

---

## AGENT BEHAVIOR RULES FOR SKILLS

These rules are enforced at T06:

1. **Never implement a pattern covered by a skill without reading that skill first**
2. **Never write code that violates a skill's DO NOT rules** — if you must deviate, document why in the session log and create/update the skill
3. **Never close a pass with a DRAFT skill** — complete it at T07
4. **Never create a skill without a real example** — generic skills are banned
5. **Always improve a skill when you discover it was incomplete** — do not just work around it

---

## SKILLS DIRECTORY STRUCTURE

```
skills/
├── SKILLS-INDEX.md          ← Master registry (always read first)
├── SKILLS-SOP.md            ← This file
├── SKILL-TEMPLATE.md        ← Template for new skills
│
├── core/
│   ├── SK-001-js-refactoring.md
│   ├── SK-002-vitest-patterns.md
│   └── SK-010-state-machine.md
│
├── medical/
│   ├── SK-003-medical-config.md
│   └── SK-009-emergency-detector.md
│
├── integrations/
│   ├── SK-004-ollama-integration.md
│   ├── SK-007-nodejs-backend.md
│   └── SK-011-config-serving.md
│
└── security/
    └── SK-005-security-hardening.md
```

---

## SKILLS REVIEW AT T07 (Mandatory Section)

Every T07 must include a Skills Review section:

```
SKILLS_USED_THIS_PASS     = [list skill IDs used]
SKILLS_IMPROVED           = [list skill IDs improved]
SKILLS_CREATED            = [list skill IDs created]
DRAFT_SKILLS_COMPLETED    = [list skill IDs promoted from DRAFT to COMPLETE]
SKILLS_NEEDED_NEXT_PASS   = [list patterns that will need skills before next T05]
```

This section is verified at T06 — a pass cannot advance to T07 if skills used in T05 were not read before implementation.
