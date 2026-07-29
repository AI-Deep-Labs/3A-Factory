---
name: analyze
description: "Impact and risk analysis into docs/tasks/.../analysis.md; set risk and ADR recommendation; status analyzed."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/analyze/SKILL.md.
  Arguments: {{args}}
---

