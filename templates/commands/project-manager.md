---
name: project-manager
description: "Spec Package state-machine orchestrator — routes triage→spec→APPROVED_SPEC_PACKAGE→task-by-task develop/review→qa→converge→APPROVED_USER_REVIEW. Never auto-deploy."
argument-hint: "[requirement text or REQ-<NNNNNN>-<slug> or package path]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
cursorPreamble: |
  **MANDATORY PM MODE** — `/project-manager` binds Project Manager mode for this session.
  
  1. Read `.agents/rules/agent-mode.md`, then `AGENTS.md`.
  2. Read and **fully execute** `.agents/skills/project-manager/SKILL.md` (§ Slash invocation (mandatory)).
  3. Follow Session orchestration: PM → child skill SKILL.md → PM; route only via manifest state; do not skip phases.
  4. Do not implement, plan, or write artifacts outside canonical child skills and `docs/tasks/REQ-*`.
prompt: |
  **MANDATORY PM MODE** — `/project-manager` binds Project Manager mode for this session.

  1. Read `.agents/rules/agent-mode.md`, then `AGENTS.md`.
  2. Read and **fully execute** `.agents/skills/project-manager/SKILL.md` (§ Slash invocation (mandatory)).
  3. Follow Session orchestration: PM → child skill SKILL.md → PM; route only via manifest state; do not skip phases.
  4. Do not implement, plan, or write artifacts outside canonical child skills and `docs/tasks/REQ-*`.

  Execute `.agents/skills/project-manager/SKILL.md` completely.
  Arguments: {{args}}
---

