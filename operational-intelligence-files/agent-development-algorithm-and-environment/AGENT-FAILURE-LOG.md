# AGENT FAILURE LOG
## MedVoice AI — Pattern Catalog of Agent Errors and Countermeasures

> **Purpose**: When an agent produces output that is provably wrong (contradicted by actual file content, actual test results, or actual behavior), log it here. Over time, patterns emerge and countermeasures get built into the onboarding prompt and loop templates.
>
> **Rule**: Any agent failure caught in T03, T04, T06, or manual review must be logged here within the same pass. Failures not logged are failures that will repeat.

```
LOG_VERSION       = "1.0.0"
LAST_UPDATED      = "2026-05-01"
TOTAL_FAILURES    = 3
PATTERNS_IDENTIFIED = 3
COUNTERMEASURES_ACTIVE = 2
```

---

## FAILURE REGISTRY

---

### FAILURE-001
```
DATE              = 2026-04-30
PASS              = 4 (T03)
AGENT             = Gemini 3 Flash
TEMPLATE          = T03 — Module Audit
```

**What the agent claimed:**
`webhook-dispatcher.js` reported as RED with BUG-01 (fallback URL at line 142) and SEC-01 (no HMAC auth at line 155). Both reported as OPEN.

**What was actually true:**
BUG-01 was RESOLVED in Pass 1. SEC-01 was RESOLVED in Pass 2. Line 142 contained outbox processing code. Line 155 contained retry logic. Neither had any relationship to the reported issues.

**Root cause:**
Agent did not read the actual file before reporting. It likely interpolated from the ENVIRONMENT.md issues register (which listed the issues) without verifying their current status in code.

**How it was caught:**
Manual cross-reference during review. The re-verification prompt forced the agent to read the actual file, at which point it immediately corrected itself.

**Countermeasure added:**
Added explicit instruction to T03 prompt: "For every RESOLVED issue in ENVIRONMENT.md that touches files you are auditing — read the actual file and confirm the fix is present with line number evidence. Do not trust the status label alone."

**Status:** COUNTERMEASURE ACTIVE

---

### FAILURE-002
```
DATE              = 2026-04-30
PASS              = 4 (T03)
AGENT             = Gemini 3 Flash
TEMPLATE          = T03 — Module Audit
```

**What the agent claimed:**
`validator.js` SYNC-04 FAIL — `webhook_secret` missing from REQUIRED_FIELDS at lines 12-15.

**What was actually true:**
`webhook_secret` was present at line 18 as a result of Pass 1 T05 work.

**Root cause:**
Same pattern as FAILURE-001 — the agent reported from memory or inference without reading the actual file. The lines 12-15 reference was fabricated.

**How it was caught:**
Same re-verification prompt that caught FAILURE-001.

**Countermeasure added:**
Same countermeasure as FAILURE-001. The re-verification pattern is now standard protocol when T03 reports any PREVIOUSLY RESOLVED issue as still open.

**Status:** COUNTERMEASURE ACTIVE

---

### FAILURE-003
```
DATE              = 2026-04-30
PASS              = 5 (T07 equivalent)
AGENT             = Antigravity (Google Deepmind)
TEMPLATE          = Out-of-loop purge execution
```

**What the agent claimed:**
"The Medical Persona Purge is complete. The system is now ready for Pass 6."

**What was actually true:**
The agent had executed the purge outside the loop, skipping T01-T04 entirely, not writing proper session logs, not running T06 quality gate, and declaring the project ready for Pass 6 without any verification.

**Root cause:**
The agent was given a task (medical purge) and optimized for task completion over process compliance. Without a strict sequential gate, it took the shortest path to "done."

**How it was caught:**
The T07 sign-off referenced "Pass 6 ready" — which was incorrect because T06 had never run. The review caught this before Pass 6 started.

**Countermeasure added:**
Updated AGENT-ONBOARDING.md standing rules to include: "Any out-of-loop work done in a previous session must be treated as UNVERIFIED until T03 reads the actual files and T06 confirms quality. Never inherit 'complete' status from a session that did not follow the loop."

**Status:** COUNTERMEASURE ACTIVE (added to onboarding)

---

## PATTERN ANALYSIS

### Pattern A — Reporting from Memory Instead of File

**Frequency:** 2 of 3 failures (FAILURE-001, FAILURE-002)
**Risk:** HIGH — produces false audit results that propagate through T04 into T05
**Trigger:** Agent sees an issue ID in ENVIRONMENT.md and reports its status without reading the actual file
**Detection:** Re-verification request: "Read the actual file and show line content"
**Prevention:** Add to T03 template: mandatory "VERIFICATION EVIDENCE" column — agents must quote actual code, not status labels

---

### Pattern B — Loop Bypass Under Task Pressure

**Frequency:** 1 of 3 failures (FAILURE-003)
**Risk:** CRITICAL — produces unverified code changes with no quality gate
**Trigger:** Agent given a large, urgent-seeming task without explicit loop instruction
**Detection:** T07 sign-off references wrong pass number or claims advancement without T06
**Prevention:** Every prompt given to an agent must reference the active loop template. Never give a task without anchoring it to T0X.

---

### Pattern C — Thin Sign-Off (Emerging)

**Frequency:** Observed across multiple passes
**Risk:** MEDIUM — T06 appears to pass but evidence is thin
**Trigger:** Agent produces sign-off blocks with PASS without showing verification evidence
**Detection:** Manual review of sign-off blocks — evidence section is empty or generic
**Prevention:** T06 template should require evidence field for every check: "PASS — evidence: [file:line]". No evidence = no pass.

---

## COUNTERMEASURE STATUS

| ID | Countermeasure | Status | Added At |
|----|----------------|--------|----------|
| CM-001 | Re-verify RESOLVED issues with actual file reads in T03 | ACTIVE | Pass 4 |
| CM-002 | All out-of-loop work treated as UNVERIFIED until T03+T06 | ACTIVE | Pass 5 |
| CM-003 | T03 VERIFICATION EVIDENCE column required | PENDING | Add to T03 template |
| CM-004 | T06 evidence field required for every check | PENDING | Add to T06 template |

---

## HOW TO ADD A NEW FAILURE

Copy this template and fill in:

```
### FAILURE-[NEXT_NUMBER]
DATE              = 
PASS              = 
AGENT             = 
TEMPLATE          = 

**What the agent claimed:**
[exact quote or description]

**What was actually true:**
[what the file/test/behavior actually showed]

**Root cause:**
[why did the agent produce wrong output]

**How it was caught:**
[what mechanism caught it]

**Countermeasure added:**
[what was changed in environment/prompts/templates]

**Status:** [COUNTERMEASURE ACTIVE / PENDING / NO COUNTERMEASURE NEEDED]
```
