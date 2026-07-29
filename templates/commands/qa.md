---
name: qa
description: "Acceptance-driven QA for Spec Packages — unit/system/UAT(+PERF/SEC) with evidence under docs/tasks/.../qa/; bounded auto-loop (max 3); routes implementation vs spec defects. Does not deploy."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/qa/SKILL.md.
  Arguments: {{args}}
---

