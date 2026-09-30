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
2. Determine the save directory based on `.agents/configs/spec_config.json` and REQ context:
    - If `override` is `true`:
        - With active/specified REQ: `<path>/<project>/tasks/<REQ-slug>/misc/compact/`
        - Without REQ: `<path>/<project>/misc/compact/`
    - If `override` is `false` (or config not found):
        - With active/specified REQ: `docs/tasks/<REQ-slug>/misc/compact/`
        - Without REQ: `docs/misc/compact/`
    - Create the target directory only when writing the handoff file (do not leave empty scaffold dirs).
3. Determine the filename:
    - If the conversation is currently working on an active `REQ-<NNNNNN>-<slug>` task, or if the user explicitly provided one: `HANDOFF-<REQ-slug>-YYYYMMDD-HHMM.md` (e.g. `HANDOFF-REQ-000001-example-feature-20261001-1430.md`).
    - Otherwise, extract a short, kebab-case slug for the current topic and use: `HANDOFF-<topic-slug>-YYYYMMDD-HHMM.md`.
4. Stay focused. Do not duplicate content already in Spec Package artifacts. Link paths like `[tasks.md](file:///docs/tasks/REQ-000001-example-feature/tasks.md)`.
5. Redact secrets, passwords, API keys, PII.
6. If arguments were passed, treat them as the next session’s objective.

## Output
Write the handoff file to the determined path with:
1. **Objective**
2. **Current State**
3. **Session Progress**
4. **Key Reference Artifacts** (prefer `docs/tasks/REQ-…/` paths)
5. **Next Actions**
6. **Suggested Skills** (e.g. `onboarding`, `project-manager`, `grill-me`, `analyze`, `spec`, `develop`, `review`, `qa`, `converge`, `deploy`)

Confirm the saved path to the user.

Handoff body language: prefer **Vietnamese** if the session was in Vietnamese; otherwise English is acceptable.
