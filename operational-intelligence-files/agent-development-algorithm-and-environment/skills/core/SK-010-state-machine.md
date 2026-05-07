# SKILL: State Machine Rules
## MedVoice AI — Skills Library

```
SKILL_ID          = "SK-010"
SKILL_NAME        = "State Machine — What Can and Cannot Change"
SKILL_CATEGORY    = "core"
SKILL_VERSION     = "1.0.0"
SKILL_STATUS      = "COMPLETE"
SKILL_CREATED     = "2026-04-30"
SKILL_LAST_USED   = "2026-05-01"
RELEVANT_FILES    = "js/state-machine.js, js/response-orchestrator.js"
```

## THE PATTERN

### 1. Enum Extension
Always add new states to the `STATES` enum first.
```javascript
export const STATES = {
  // ...
  LEAD_CAPTURE: 'LEAD_CAPTURE',
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION', // [NEW]
  CLOSING: 'CLOSING'
};
```

### 2. Transition Mapping
Define strict bidirectional paths.
```javascript
[STATES.LEAD_CAPTURE]: [STATES.CLOSING, STATES.BOOKING_CONFIRMATION],
[STATES.BOOKING_CONFIRMATION]: [STATES.ENDED, STATES.CLOSING]
```

### 3. Orchestrator Logic (The Goal Switch)
The `_step4_chooseGoal` function must handle the logic for the new state.
```javascript
case STATES.LEAD_CAPTURE:
  return ev.hasLead ? 'booking_confirmation' : 'capture_lead';
```

## REAL EXAMPLE: BOOKING_CONFIRMATION (Pass 7)
In Pass 7, we injected `BOOKING_CONFIRMATION` between `LEAD_CAPTURE` and `CLOSING`.
- **Reason**: SK-012 requires verbal confirmation of appointment details before the API call.
- **Hook**: `ACT.CLOSE` was intercepted to check for `primary_goal: book_appointment`.

---

## DO NOT
- **DO NOT** add a state without a corresponding case in `selectAction`.
- **DO NOT** skip transition definition — it will cause `Invalid transition` warnings.
- **DO NOT** mutate `TRANSITIONS` at runtime without clear static documentation.
