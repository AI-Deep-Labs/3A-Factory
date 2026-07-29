---
name: deploy
description: "Deploy only after Spec Package status done + APPROVED_DEPLOY. Never called by project-manager. Writes release notes under package release/."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path] [dev|staging|production]"
cursorAlwaysApply: false
cursorBodyFromSkill: true
prompt: |
  Read AGENTS.md first, then read and execute .agents/skills/deploy/SKILL.md.
  Arguments: {{args}}
---

