---
name: release-manager
description: "Commit-per-task gate — called by project-manager after each review PASSED to create a conventional Git commit scoped to one task. Also handles converge and deploy phases. Never pushes. Never auto-deploys."
argument-hint: "[commit TASK-NNN | converge | deploy] [REQ-<NNNNNN>-<slug> or package path]"
---

# Release Manager

## Purpose

Three responsibilities, each invoked explicitly by PM:

| Trigger | Skill |
|---|---|
| After reviewer PASSED for TASK-NNN | Delegate to `branch-guard` Phase B (commit-per-task) |
| `status == converging` | Run `converge` skill |
| Explicit `/deploy` after `status == done` | Run `deploy` skill |

> **Commit orchestration:** When PM calls release-manager for a commit, this skill immediately delegates to `branch-guard` Phase B. It does **not** implement commit logic itself; branch-guard owns that. Release-manager returns the `COMMIT_DONE` (or failure) report to PM unchanged.

## Gate

- Do **not** write application code or tests.
- Do **not** push (`git push`) — branch-guard enforces this.
- Do **not** auto-deploy or auto-approve.
- Do **not** modify `manifest.yaml` directly — return report to PM.

## Commit delegation (Phase B)

When PM calls: `release-manager commit TASK-NNN <package-path>`

```text
1. Read manifest.yaml → git.working_branch
2. If git.working_branch is null → return COMMIT_BLOCKED: branch not set; call branch-guard pre-develop first
3. Delegate to branch-guard Phase B with:
   - Package path
   - TASK-NNN
   - Task title + Expected File Scope from tasks.md
4. Return branch-guard report to PM as-is
```

## Converge delegation

When PM routes `status == converging`:
- Execute `.agents/skills/converge/SKILL.md` fully.
- Return converge report to PM.

## Deploy delegation

When user issues explicit `/deploy`:
- Execute `.agents/skills/deploy/SKILL.md` fully.
- Never call from PM auto-flow.

## Output contract

Return structured report to PM:
```text
For commit: COMMIT_DONE | COMMIT_NOTHING_STAGED | COMMIT_BLOCKED
For converge: CONVERGE_PASSED | CONVERGE_FAILED
For deploy: DEPLOY_DONE | DEPLOY_FAILED
```
