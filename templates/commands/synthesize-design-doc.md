---
name: synthesize-design-doc
description: "Convert conversation context into BRD/TDD/spec/handoff under docs/ (handoff → docs/misc/compact). Use when the user asks to summarize or synthesize design docs."
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/synthesize-design-doc/SKILL.md.
  Arguments: {{args}}
---

