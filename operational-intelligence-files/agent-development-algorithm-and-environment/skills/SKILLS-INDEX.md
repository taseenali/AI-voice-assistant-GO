# SKILLS INDEX
## Master Registry — MedVoice AI Skills Library

> **Every agent reads this file at session start. Before T05, read every skill whose RELEVANT_FILES overlaps with FILES_ALLOWED_TO_MODIFY. Skills marked INCOMPLETE must be completed before use in T05.**

```
LIBRARY_VERSION   = "2.2.0"
LAST_UPDATED      = "2026-05-01"
TOTAL_SKILLS      = 14
COMPLETE          = 13
INCOMPLETE        = 0
DRAFT             = 1
```

---

## HOW TO USE THIS INDEX

1. At session start — scan the RELEVANT_FILES column for any file you will work on
2. Before T05 — read every COMPLETE skill whose files match your build targets
3. If a skill is DRAFT — complete it before using it in T05
4. If no skill exists for your pattern — create one using SKILL-TEMPLATE.md and SKILLS-SOP.md

---

## CORE DEVELOPMENT SKILLS

| Skill ID | Name | File | Status | Relevant Files | Protects |
|----------|------|------|--------|----------------|----------|
| SK-001 | JS Module Refactoring | core/SK-001-js-refactoring.md | COMPLETE | All JS modules | SYNC-01, SYNC-06 |
| SK-002 | Vitest Patterns | core/SK-002-vitest-patterns.md | COMPLETE | tests/*, vitest.config.js | All modules |
| SK-010 | State Machine Rules | core/SK-010-state-machine.md | COMPLETE | js/state-machine.js, js/response-orchestrator.js | SYNC-02 |
| SK-014 | Response Orchestrator | core/SK-014-response-orchestrator.md | COMPLETE | js/response-orchestrator.js | Core Logic |

---

## MEDICAL DOMAIN SKILLS

| Skill ID | Name | File | Status | Relevant Files | Protects |
|----------|------|------|--------|----------------|----------|
| SK-003 | Medical Configuration | medical/SK-003-medical-config.md | COMPLETE | configs/*.json, js/modules/lead-capture.js | SSYNC-02, SYNC-03 |
| SK-009 | Emergency Detector Rules | medical/SK-009-emergency-detector.md | DRAFT | js/modules/emergency-detector.js | Medical safety |

---

## INTEGRATION SKILLS

| Skill ID | Name | File | Status | Relevant Files | Protects |
|----------|------|------|--------|----------------|----------|
| SK-004 | Ollama Integration | integrations/SK-004-ollama-integration.md | COMPLETE | js/services/llm-adapter.js | SYNC-01, SYNC-06 |
| SK-007 | Node.js Backend | integrations/SK-007-nodejs-backend.md | COMPLETE | server/*.js, api/*.js | SSYNC-03, SEC-02 |
| SK-011 | Config Serving Pattern | integrations/SK-011-config-serving.md | COMPLETE | api/config.js, configs/*.json | SSYNC-03, SEC-02, SEC-09 |
| SK-012 | Calendar Integration | integrations/SK-012-calendar-integration.md | COMPLETE | server/routes/calendar.js, js/services/calendar-adapter.js | G-044 |
| SK-013 | Twilio Voice | integrations/SK-013-twilio-voice.md | COMPLETE | server/routes/voice.js | G-046 |

---

## SECURITY SKILLS

| Skill ID | Name | File | Status | Relevant Files | Protects |
|----------|------|------|--------|----------------|----------|
| SK-005 | Security Hardening | security/SK-005-security-hardening.md | COMPLETE | js/services/webhook-dispatcher.md, configs/*.json | SEC-01 through SEC-09, SSYNC-01 |
| SK-006 | HIPAA Compliance | security/SK-006-hipaa-compliance.md | COMPLETE | All data-handling modules | GAP-08, G-036 |
| SK-008 | Input Sanitization | security/SK-008-input-sanitization.md | COMPLETE | js/nlp/nlp-extractor.js, js/app.js | SEC-03 |

---

## QUICK REFERENCE — WHICH SKILL FOR WHICH TASK

| Task | Read These Skills |
|------|------------------|
| Modifying any JS module | SK-001 |
| Writing tests | SK-002 |
| Changing config files | SK-003, SK-011 |
| Emergency detector changes | SK-009 (NEVER route through LLM) |
| LLM adapter changes | SK-004 |
| Node.js backend work | SK-007, SK-011 |
| Security-related changes | SK-005 |
| Patient data handling | SK-003, SK-006 |
| Input processing | SK-008 |
| State machine changes | SK-010 |
| Webhook dispatcher changes | SK-005 |

---

## SKILLS CREATED PER PASS

| Pass | Skills Created | Skills Improved |
|------|---------------|-----------------|
| 4    | SK-001 through SK-006 (initial library) | — |
| 5    | SK-007 through SK-011 (added) | SK-001 through SK-005 (enhanced) |
| 6    | SK-012, SK-013 (added) | SK-002, SK-009, SK-007, SK-011 (promoted) |
| 7    | — | SK-012, SK-013 (planned promotion) |
