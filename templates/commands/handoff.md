---
name: handoff
description: "Compact the current conversation into a handoff document for another agent."
argument-hint: "What will the next session be used for?"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/handoff/SKILL.md.
  Arguments: {{args}}
---

