---
name: onboarding
description: "Onboard ONE repo into 3A-Factory — create docs/, agent context (CLAUDE/GEMINI/AGENTS), explore codebase, write docs/project_overview.md. Create nothing outside the current repo."
argument-hint: "[optional hints about stack/repo role]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/onboarding/SKILL.md.
  Arguments: {{args}}
---

