---
name: deploy
description: Deploy REQ-<NNNNNN>-<slug> after QA Pass. Only when the user explicitly asks. Every environment requires APPROVED. Write docs/release-notes/…-release.md.
disable-model-invocation: true
argument-hint: [REQ-<NNNNNN>-<slug>] [dev|staging|production]
---

# Deploy

## Hard gates
1. Run only when the user **explicitly** requests deploy — never called automatically by `project-manager`.
2. `docs/qa/REQ-<NNNNNN>-<slug>-qa.md` must conclude **Ready for release** (Pass).
3. **`APPROVED`** (case-insensitive) must be present in the current context **for every environment** (including `dev`). If missing → stop and request approval.
4. Do not invent deploy commands — take them from `CLAUDE.md` / project notes / the user.

## Steps
1. Confirm env + REQ id + QA Pass + `APPROVED`.
2. List deploy order (from plan/design/analysis).
3. Prepare concrete rollback per step.
4. Execute via project conventions (or step-by-step guidance if the agent cannot run commands).
5. Write `docs/release-notes/REQ-<NNNNNN>-<slug>-release.md` (RELEASE template) — **Vietnamese** body.

## Output
Release notes + deploy result / remaining manual steps.
