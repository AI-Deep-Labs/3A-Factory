---
name: spec
description: "Spec Package orchestrator — coordinates requirements, ADR, design, tasks, acceptance, and spec-review under docs/tasks/; stops for APPROVED_SPEC_PACKAGE. Does not write *-spec.md or application code."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/spec/SKILL.md.
  Arguments: {{args}}
---

