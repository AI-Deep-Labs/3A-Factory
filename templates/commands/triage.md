---
name: triage
description: "Classify a request, allocate REQ id, and initialize a Feature-local Spec Package under docs/tasks/ with manifest.yaml and raw.md."
argument-hint: "[raw requirement text]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/triage/SKILL.md.
  Arguments: {{args}}
---

