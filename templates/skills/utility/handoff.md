---
name: handoff
description: Compact the current conversation into a handoff document for another agent.
argument-hint: "What will the next session be used for?"
---

# Handoff Skill

## Gate
None. Utility skill for session consolidation.

## Process
1. Summarize progress, key decisions, active issues, and pending actions from the current conversation.
2. Save under `docs/misc/compact/` in the current project workspace.
3. Filename: `HANDOFF-YYYYMMDD-HHMM.md` (e.g. `HANDOFF-20260601-1430.md`).
4. Stay focused. Do not duplicate content already in `docs/` artifacts. Link paths like `[REQ-000013-login-throttle-plan.md](file:///docs/designs/REQ-000013-login-throttle-plan.md)`.
5. Redact secrets, passwords, API keys, PII.
6. If arguments were passed, treat them as the next session’s objective.

## Output
Write `docs/misc/compact/HANDOFF-YYYYMMDD-HHMM.md` with:
1. **Objective**
2. **Current State**
3. **Session Progress**
4. **Key Reference Artifacts**
5. **Next Actions**
6. **Suggested Skills** (e.g. `onboarding`, `project-manager`, `grill-me`, `analyze`, `design`, `spec`, `develop`, `review`, `qa`, `deploy`)

Confirm the saved path to the user.

Handoff body language: prefer **Vietnamese** if the session was in Vietnamese; otherwise English is acceptable.
