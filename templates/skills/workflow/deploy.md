---
name: deploy
description: Deploy only after Spec Package status done + APPROVED_DEPLOY. Never called by project-manager. Writes release notes under package release/.
disable-model-invocation: true
argument-hint: "[REQ-<NNNNNN>-<slug> or package path] [dev|staging|production]"
---

# Deploy

## Purpose
Execute an **explicit** user deploy request after the package is `done` and deploy approval is recorded.

## Gate
1. Run only when the user **explicitly** requests deploy — never from `project-manager` auto-flow.
2. Do not treat `APPROVED_USER_REVIEW` or `APPROVED_SPEC_PACKAGE` as deploy approval.
3. Do not invent deploy commands — use project notes / user-provided commands.
4. Do not commit/push unless the user explicitly asked as part of deploy procedure.

## Hard gates
```text
manifest.status == done
approval.deploy.status == approved
explicit deploy command / env provided
qa.converge == passed (expected prior to done)
```
If deploy approval missing → `DEPLOY_APPROVAL_REQUIRED`.

On recording deploy approval:
```yaml
approval:
  deploy:
    status: approved
    approved_by: user
    approved_at: <ISO-8601>
```

## Process
1. Resolve Spec Package under `.specs/`.
2. Confirm env + gates.
3. List deploy order from design/tasks/analysis.
4. Prepare rollback per step.
5. Execute via project conventions.
6. Write `.specs/<PACKAGE>/release/release-notes.md`.

## Failure states
```text
DEPLOY_APPROVAL_REQUIRED
PACKAGE_NOT_FOUND
PACKAGE_INVALID
DEPLOY_BLOCKED
```

## Stop condition
Print result token and paths. Never auto-deploy after success.

## Inputs
- Spec Package `manifest.yaml`
- Explicit deploy env/command from user
- Project deploy notes

## Output contract
Release notes under `.specs/<PACKAGE>/release/release-notes.md` + deploy result summary.
