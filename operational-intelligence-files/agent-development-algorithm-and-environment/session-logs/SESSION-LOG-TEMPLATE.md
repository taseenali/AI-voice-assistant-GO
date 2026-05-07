# SESSION LOG TEMPLATE
## Copy this file, rename to: SESSION-[PASS NUMBER]-[DATE]-[AGENT].md

---

```
SESSION_ID          = [auto: PASS-DATE-AGENT abbreviation]
LOOP_PASS           = [NUMBER]
AGENT               = [Claude / ChatGPT / Gemini + model version]
SESSION_START       = [DATETIME]
SESSION_END         = [DATETIME]
RESUMED_FROM        = [T01 / or "new pass"]
ENDED_AT            = [T07 / or last completed template]
```

---

## TEMPLATE COMPLETION LOG

| Template | Status         | Time Spent | Notes                           |
|----------|----------------|------------|---------------------------------|
| T01      | [COMPLETE/SKIP/BLOCKED] | [HH:MM] | [key findings]        |
| T02      | [COMPLETE/SKIP/BLOCKED] | [HH:MM] | [key findings]        |
| T03      | [COMPLETE/SKIP/BLOCKED] | [HH:MM] | [modules audited, issues]  |
| T04      | [COMPLETE/SKIP/BLOCKED] | [HH:MM] | [contracts passing]   |
| T05      | [COMPLETE/SKIP/BLOCKED] | [HH:MM] | [files changed]       |
| T06      | [COMPLETE/SKIP/BLOCKED] | [HH:MM] | [gate result, iterations] |
| T07      | [COMPLETE/SKIP/BLOCKED] | [HH:MM] | [blueprint updated?]  |

---

## DECISIONS MADE THIS SESSION

> Record every non-obvious decision so future agents understand WHY, not just WHAT.

1. **Decision**: [WHAT was decided]  
   **Reason**: [WHY this was chosen over alternatives]  
   **Alternatives considered**: [LIST]

2. [repeat for each decision]

---

## FILES CHANGED

| File                    | Type of change       | Lines +/- | Related Bug/Goal |
|-------------------------|----------------------|-----------|------------------|
| [filename]              | [fix/add/refactor]   | [+X/-Y]   | [BUG-XX / G-XXX] |

---

## NEW ISSUES DISCOVERED

| Issue ID  | File        | Description                    | Priority |
|-----------|-------------|--------------------------------|----------|
| [BUG-XX]  | [file]      | [description]                  | [P0/P1/P2] |

---

## RESEARCH HIGHLIGHTS

Key external findings from T02/T07 that should persist:
- [FINDING + SOURCE URL]

---

## BLOCKERS AND OPEN ITEMS

Anything that could not be completed and must carry to next session:
- [ITEM + why it was blocked + what is needed to unblock]

---

## NEXT SESSION STARTING POINT

```
RESUME_AT_TEMPLATE  = [T01 for new pass / or template where session ended]
LOOP_PASS           = [NUMBER]
FIRST_PRIORITY      = [what to tackle first]
CONTEXT_NEEDED      = [any files the next agent must read before starting]
```
