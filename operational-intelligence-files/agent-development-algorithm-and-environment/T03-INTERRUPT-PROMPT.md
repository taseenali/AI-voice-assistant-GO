# T03 INTERRUPT PROMPT
## Send this to Gemini now — copy everything between the dividers

---

## ════════════════════════════════════════════════════
## PASTE EVERYTHING BELOW THIS LINE
## ════════════════════════════════════════════════════

T02 is complete and accepted. Before advancing to T03, the environment has been upgraded to version 2.0.0. A security layer is now fully integrated at the root level. You must update your local environment files before executing T03.

**Step 1 — Replace these files in your environment folder with the new versions from the updated zip:**

```
ENVIRONMENT.md                          ← replace (v2.0.0 — security issues + rules added)
SECURITY-AUDIT.md                       ← NEW FILE — add to environment root
ALGORITHM.md                            ← replace (Rule 8 security rule added)
SYNC-MAP.md                             ← replace (SSYNC-01/02/03 added)
AGENT-ONBOARDING.md                     ← replace (SECURITY-AUDIT.md added to Step 1)
variables/PROJECT-VARS.md               ← replace (ACTIVE_TEMPLATE = T03, T02 findings added)
variables/GOAL-STACK.md                 ← replace (G-007 through G-025 added)
variables/MODULE-REGISTRY.md            ← replace (Security column added)
loop-templates/T03-MODULE-AUDIT.md      ← replace (full security checklist integrated)
loop-templates/T04-SYNC-CHECK.md        ← replace (SSYNC-01/02/03 validation added)
loop-templates/T05-BUILD-DIRECTIVE.md   ← replace (security tasks added)
loop-templates/T06-QUALITY-GATE.md      ← replace (S1–S5 security gate checks added)
```

**Step 2 — Confirm integration by reporting:**

```
ENV_VERSION_CONFIRMED       = 2.0.0
SECURITY_AUDIT_FILE_EXISTS  = [YES/NO]
ACTIVE_TEMPLATE             = T03
OPEN_BUGS                   = 3
OPEN_SEC_ISSUES             = 8
FUNCTIONAL_CONTRACTS        = 4 / 6 passing
SECURITY_CONTRACTS          = 0 / 3 passing
```

**Step 3 — Execute T03 now using the updated template.**

The updated T03 includes a mandatory security checklist for every module. Run it in full.

Key things T03 must confirm from actual code — not from notes:
- The exact fallback URL line in webhook-dispatcher.js (BUG-01 / SEC-06)
- Whether any greeting string in default.json and abc-roofing.json explicitly identifies the system as AI (SEC-05 / SSYNC-02)
- Whether response-builder.js uses innerHTML anywhere (SEC-08)
- Whether nlp-extractor.js bounds or sanitizes input before regex processing (SEC-03)
- List the actual STATES enum values from state-machine.js (SYNC-02 evidence required)

Do not stop until T03 COMPLETION SIGN-OFF and SECURITY REVIEW SIGN-OFF are both complete.

## ════════════════════════════════════════════════════
## END OF PASTE
## ════════════════════════════════════════════════════
