---
name: qa-issues
description: "Conversational QA session — file ISSUE markdown under docs/misc/issues. Utility outside the pipeline (does not replace qa-testing)."
argument-hint: "[bug description]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/qa-issues/SKILL.md.
  Arguments: {{args}}
---

