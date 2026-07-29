---
name: grill-me
description: "Deep clarification (one question at a time) into docs/tasks/.../discovery.md; update manifest status clarifying until READY_FOR_ANALYSIS."
argument-hint: "[requirement or REQ-<NNNNNN>-<slug> or package path]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/grill-me/SKILL.md.
  Arguments: {{args}}
---

