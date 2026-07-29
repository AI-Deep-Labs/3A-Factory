---
name: develop
description: "Task executor for Spec Packages — implements one ready task under APPROVED_SPEC_PACKAGE with scope gates; writes implementation evidence; hands off to review. Never marks task done or deploys."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path] [optional TASK-NNN]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/develop/SKILL.md.
  Arguments: {{args}}
---

