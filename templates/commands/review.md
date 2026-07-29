---
name: review
description: "Task-scoped code compliance review against requirements/design/ADR/acceptance; writes TASK-NNN-code-review.md; alone may mark task done. Does not silently fix application code."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path] [optional TASK-NNN]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/review/SKILL.md.
  Arguments: {{args}}
---

