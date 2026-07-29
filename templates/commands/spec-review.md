---
name: spec-review
description: "Validate a Feature-local Spec Package for completeness, traceability, and readiness; write spec-review.md; set awaiting_approval on PASSED. Does not approve or write code."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/spec-review/SKILL.md.
  Arguments: {{args}}
---

