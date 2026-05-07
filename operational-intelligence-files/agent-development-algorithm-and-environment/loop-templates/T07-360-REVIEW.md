# T07 — 360 REVIEW
## Template: Full Loop Closure + Next Pass Preparation

> **AGENT INSTRUCTIONS**: This is the final template of the loop. It looks backward (what was accomplished), looks outward (research synthesis), and looks forward (next pass setup). Completing this template closes the loop and increments ACTIVE_LOOP_PASS. This template also triggers a full project research scan — the most comprehensive of the loop.

---

## SECTION 1 — LOOP PASS RETROSPECTIVE

**Pass number being closed**: [NUMBER]  
**Date opened**: [DATE]  
**Date closed**: [DATE]  
**Agent(s) used**: [LIST]

### What was accomplished this pass

| Goal ID | Outcome    | Notes                                       |
|---------|------------|---------------------------------------------|
| G-001   | [COMPLETE/PARTIAL/DEFERRED] | [Evidence]                   |
| G-002   | [COMPLETE/PARTIAL/DEFERRED] | [Evidence]                   |
| [...]   |            |                                             |

### What was discovered that was not anticipated
[LIST — any new bugs, architectural insights, market info, or risks found during this pass]

### Quality of this pass
- Code changes made: [COUNT files, COUNT lines changed]
- Bugs resolved: [LIST]
- Sync contracts improved: [FROM X to Y passing]
- New issues introduced: [LIST or "none"]

---

## SECTION 2 — 360° PROJECT SCAN

> This is the deepest scan in the loop. Read every core file. Answer these questions from the code, not from previous notes.

### 2A — End-to-End Flow Integrity
Trace a complete conversation from user first message to webhook firing:

```
User types first message
    ↓
[TRACE: what code runs, in what order, with what state]
    ↓
Webhook fires to n8n
```

Is this flow intact and correct? [YES/NO + notes]

### 2B — Multi-Tenant Isolation
If client A and client B are loaded in two tabs simultaneously:
- Could client A's lead data go to client B's webhook? [YES/NO + evidence]
- Could client A's config affect client B's conversation? [YES/NO + evidence]
- Is this fully resolved after BUG-01 fix? [YES/NO]

### 2C — Failure Mode Analysis
What happens when:
- The webhook endpoint is unreachable for 2 hours? [TRACE what outbox does]
- The user closes the tab mid-conversation? [TRACE what is saved/lost]
- The config file returns a 404? [TRACE emergency fallback path]
- The Web Locks API is unavailable? [TRACE what happens to outbox]
- The browser is offline when a lead is captured? [TRACE]

Document any failure mode that is NOT handled gracefully:
[LIST or "all handled"]

### 2D — Scalability Ceiling
At what point does each component break under load?
- Outbox queue cap: [100 items — what happens at 101?]
- Config system: [Single JSON file — limitation when?]
- State machine: [Maximum services before performance degrades]
- Speech IO: [Browser API limitations]

---

## SECTION 3 — EXTERNAL RESEARCH SYNTHESIS (T07 Research Pass)

> Search for the most current information on each topic. This is the deepest research point of the loop.

### 3A — Product Positioning Update
- Search: "[your product category] market trends [current year]"
- Search: "AI voice agent SMB adoption rate [current year]"
- **Finding**: [FILL]
- **Impact on product**: [FILL]

### 3B — Technology Watchlist
What changed in the technical landscape since the last loop pass?
- Any new browser APIs relevant to this project?
- Any LLM cost changes that affect Tier 2 pricing?
- Any new local models that changed the "no API" calculus?
- **Findings**: [FILL]

### 3C — Competitive Intelligence Update
- Any new competitors entered the SMB voice agent space?
- Any pricing changes by existing competitors?
- **Findings**: [FILL]

### 3D — SOP Alignment Check
Search for:
- "ISO 9001 software development process"
- "SaaS product development best practices"
- "enterprise software SOP template"

**Gap between current process and international SOPs**: [FILL — what is missing from this environment to meet those standards?]

---

## SECTION 4 — BLUEPRINT UPDATE

> The blueprint is the living record of what this product IS and WHERE it is going.

Update `blueprint/BLUEPRINT-CURRENT.md` with:
- [ ] Architecture diagram (text-based) reflecting current state
- [ ] Module status summary (copy from MODULE-REGISTRY)
- [ ] Feature completion matrix (Tier 1 vs Tier 2)
- [ ] Known limitations and their planned resolution pass
- [ ] Next pass priority list

---

## SECTION 5 — NEXT LOOP PASS SETUP

**Increment**: ACTIVE_LOOP_PASS = [CURRENT + 1]

**Set in PROJECT-VARS.md**:
```
ACTIVE_LOOP_PASS    = [NEW NUMBER]
ACTIVE_TEMPLATE     = T01
PASS_PRIMARY_GOAL   = "[FILL based on GOAL-STACK backlog]"
PASS_SECONDARY_GOAL = "[FILL]"
FILES_ALLOWED_TO_MODIFY = [FILL for next pass]
FILES_FORBIDDEN_TO_MODIFY = [FILL for next pass]
```

**Update GOAL-STACK.md**:
- Move completed goals to COMPLETED section
- Promote backlog goals to ACTIVE based on priority
- Add any new goals discovered this pass

**Update ENVIRONMENT.md**:
- Update ACTIVE_LOOP_PASS
- Update ACTIVE_TEMPLATE to T01
- Update ENV_LAST_UPDATED
- Close resolved bugs, add new ones
- Update BUILD_IS_CURRENT

---

## SECTION 6 — INTERNATIONAL SOP ALIGNMENT

This section ensures the project meets professional development standards.

| SOP Domain                   | Current State              | Gap                        | Action |
|------------------------------|---------------------------|----------------------------|--------|
| Requirements documentation   | [FILL]                    | [FILL]                     | [FILL] |
| Change management            | [Loop pass = change record] | [Additional needed?]      | [FILL] |
| Testing protocol             | [None formal yet]         | No test suite              | Pass 4 |
| Deployment procedure         | [Manual vite build]       | No CI/CD                   | Pass 7 |
| Incident response            | [Dead letter queue]       | No alerting                | Pass 6 |
| Data handling documentation  | [Informal]                | No privacy policy artifact | Pass 8 |
| Client onboarding SOP        | [Config JSON only]        | No guided onboarding       | Pass 5 |

---

## T07 COMPLETION SIGN-OFF

```
T07_COMPLETED           = [YES/NO]
T07_DATE                = [DATE]
T07_LOOP_CLOSED         = [PASS NUMBER]
T07_BLUEPRINT_UPDATED   = [YES/NO]
T07_ENV_UPDATED         = [YES/NO]
T07_GOALS_UPDATED       = [YES/NO]
NEXT_LOOP_PASS          = [NUMBER]
NEXT_ACTIVE_TEMPLATE    = T01

LOOP [NUMBER] STATUS    = [COMPLETE / PARTIAL — list what was not finished]
```

---

> **Loop closed. Environment updated. Ready to begin Pass [NUMBER + 1] at T01.**
