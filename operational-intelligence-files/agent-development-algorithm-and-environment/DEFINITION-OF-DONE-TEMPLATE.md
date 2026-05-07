# DEFINITION OF DONE — TEMPLATE
## MedVoice AI — Per-Pass Completion Criteria

> **Usage**: Copy this template into `variables/PROJECT-VARS.md` at the START of every pass (T01), before any work begins. Fill in the DONE criteria based on the pass goals. At T06, verify every criterion is met. A goal is only COMPLETED when ALL its criteria are TRUE.
>
> **Rule**: A pass cannot close at T07 if any P0 or P1 goal lacks a DONE definition written at T01.

---

## TEMPLATE — COPY INTO PROJECT-VARS.md AT T01

```
## DEFINITION OF DONE — PASS [N]
## Written at T01. Verified at T06. All criteria must be TRUE for goal to be COMPLETED.

### G-[ID] — [Goal Name] — Priority: [P0/P1/P2]

DONE WHEN:
  [ ] 1. [Specific, testable condition — not "code exists" but "behavior verified"]
  [ ] 2. [Second condition]
  [ ] 3. [Third condition — include "no regression" check]

EVIDENCE REQUIRED AT T06:
  - [What file/log/screenshot/test output proves each condition]

RUNTIME VERIFIED:
  [ ] YES — tested with real credentials/services
  [ ] NO  — code only, not tested end-to-end (mark goal as SCAFFOLDED not COMPLETED)
```

---

## REAL EXAMPLES — CORRECT DONE DEFINITIONS

### Example 1 — G-044 Google Calendar Integration (Pass 7)

**WRONG (too vague):**
```
DONE WHEN: Calendar route is built and deployed
```

**CORRECT:**
```
DONE WHEN:
  [ ] 1. POST /api/calendar/check returns available/busy for a real Google Calendar ID
  [ ] 2. POST /api/calendar/book creates a real calendar event visible in Google Calendar
  [ ] 3. freebusy.query runs BEFORE events.insert on every booking (no race condition)
  [ ] 4. Booking confirmation response returned to patient with date and time
  [ ] 5. 16/16 existing tests still passing after change

EVIDENCE REQUIRED AT T06:
  - Console log showing freebusy.query response
  - Google Calendar screenshot showing created event
  - Test output showing 16/16 pass

RUNTIME VERIFIED: NO — code written but not tested with real Google credentials
→ Status: SCAFFOLDED (not COMPLETED)
```

### Example 2 — G-031 Vitest Test Suite (Pass 6)

**WRONG:**
```
DONE WHEN: Test files created
```

**CORRECT:**
```
DONE WHEN:
  [ ] 1. npm test -- --run exits with 0 failures
  [ ] 2. Emergency detector tests cover all 8 crisis categories
  [ ] 3. Lead capture tests verify medical field schema
  [ ] 4. Config validator tests verify emergency_keywords required
  [ ] 5. No test passes by mocking the module under test

EVIDENCE REQUIRED AT T06:
  - npm test -- --run output showing X/X passing
  - Test file contents showing crisis categories covered

RUNTIME VERIFIED: YES — npm test runs in real browser mode
→ Status: COMPLETED ✅
```

---

## GOAL STATUS DEFINITIONS

These are the only valid statuses for goals at T07:

| Status | Definition |
|--------|------------|
| `COMPLETED` | All DONE criteria met, RUNTIME VERIFIED = YES, T06 passed |
| `SCAFFOLDED` | Code exists, RUNTIME VERIFIED = NO — never tested with real services |
| `PARTIAL` | Some DONE criteria met, documented which ones remain |
| `BLOCKED` | Cannot proceed due to external dependency (BAA, credentials, etc.) |
| `DEFERRED` | Moved to future pass with explicit reason |
| `CANCELLED` | No longer needed, removed from goal stack with reason |

**Note**: `SCAFFOLDED` is NOT `COMPLETED`. A scaffold that has never been tested with real credentials is speculative code. Do not mark it COMPLETED at T07.

---

## PASS-LEVEL DONE CRITERIA

In addition to individual goal criteria, a pass itself is DONE when:

```
PASS DONE WHEN:
  [ ] All P0 goals: COMPLETED or BLOCKED (with documented blocker)
  [ ] All P1 goals: COMPLETED, PARTIAL (documented), or DEFERRED (to specific pass)
  [ ] T06 quality gate: PASS
  [ ] 0 unread skills violations at T06
  [ ] 0 DRAFT skills uncompleted at T07
  [ ] PRODUCT-CAPABILITY-MATRIX.md updated at T07
  [ ] AGENT-FAILURE-LOG.md updated if any agent error was caught this pass
  [ ] ENVIRONMENT.md ACTIVE_LOOP_PASS incremented
  [ ] No [BRACKET] placeholders unfilled in ENVIRONMENT.md
```

---

## CURRENT PASS — FILL THIS IN AT T01

```
## DEFINITION OF DONE — PASS [FILL IN PASS NUMBER]
## Written: [DATE]
## Written by: [AGENT]

### G-[ID] — [Goal] — Priority: P0

DONE WHEN:
  [ ] 1. 
  [ ] 2. 
  [ ] 3. 

EVIDENCE REQUIRED AT T06:
  - 

RUNTIME VERIFIED: [ ] YES  [ ] NO

---

### G-[ID] — [Goal] — Priority: P1

DONE WHEN:
  [ ] 1. 
  [ ] 2. 

EVIDENCE REQUIRED AT T06:
  - 

RUNTIME VERIFIED: [ ] YES  [ ] NO
```
