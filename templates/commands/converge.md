---
name: converge
description: "Final Spec Package consistency gate after QA — compares requirements/design/tasks/acceptance/code/evidence/manifest; writes converge-report.md; sets awaiting_user_review on PASSED. Does not mark done or deploy."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/converge/SKILL.md.
  Arguments: {{args}}
---

