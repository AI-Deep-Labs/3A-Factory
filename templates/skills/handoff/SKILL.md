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
2. Save under `docs/misc/compact/` in the current project workspace. Create `docs/misc/compact/` only when writing the handoff file (do not leave empty scaffold dirs).
3. Filename: `HANDOFF-YYYYMMDD-HHMM.md` (e.g. `HANDOFF-20260601-1430.md`).
4. Stay focused. Do not duplicate content already in Spec Package artifacts. Link paths like `[tasks.md](file:///docs/tasks/REQ-000001-example-feature/tasks.md)`.
5. Redact secrets, passwords, API keys, PII.
6. If arguments were passed, treat them as the next session’s objective.

## Output
Write `docs/misc/compact/HANDOFF-YYYYMMDD-HHMM.md` with:
1. **Objective**
2. **Current State**
3. **Session Progress**
4. **Key Reference Artifacts** (prefer `docs/tasks/REQ-…/` paths)
5. **Next Actions**
6. **Suggested Skills** (e.g. `onboarding`, `project-manager`, `grill-me`, `analyze`, `spec`, `develop`, `review`, `qa`, `converge`, `deploy`)

Confirm the saved path to the user.

Handoff body language: prefer **Vietnamese** if the session was in Vietnamese; otherwise English is acceptable.
