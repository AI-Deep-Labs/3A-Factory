---
name: project-manager
description: Spec Package state-machine orchestrator — routes triage→spec→APPROVED_SPEC_PACKAGE→task-by-task develop/review→qa→converge→APPROVED_USER_REVIEW. Never auto-deploy.
disable-model-invocation: true
argument-hint: "[requirement text or REQ-<NNNNNN>-<slug> or package path]"
---

# Project Manager

## Purpose
State-machine orchestrator for Feature-local Spec Packages. Routes to the correct skill; does **not** write requirements, design, application code, or tests itself.

## Gate
Do not modify application source code except by invoking `develop` / related skills.  
Do not invent requirements or architecture.  
Do not auto-approve.  
Do not call `deploy`.  
Do not commit or push.  
Do not mark tasks `done` (only `review` may).

## Package resolution
1. Valid `docs/tasks/` package path → use.
2. Else REQ id → exactly one `docs/tasks/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None + new requirement text → start with `triage`.
4. Do not write new feature artifacts under legacy `docs/requirements|designs|reviews|qa`.

## Inputs
- `manifest.yaml`, `tasks.md`, `spec-review.md`
- `reviews/`, `qa/`
- User intent / arguments
- Spec Package contract

## Routing table

| Package state | Next action |
|---|---|
| `new` | `triage` |
| `triaged` | `grill-me` or `analyze` (unclear → grill-me) |
| `clarifying` | `grill-me` |
| `analyzed` | `spec` |
| `specifying` | `spec` or owning producer skill |
| `validating` | `spec-review` |
| `awaiting_approval` | request `APPROVED_SPEC_PACKAGE` |
| `approved` | select ready task → `develop` |
| `implementing` | continue current task or next ready → `develop` |
| `reviewing` | `review` |
| `qa` | `qa` |
| `converging` | `converge` |
| `awaiting_user_review` | stop; await `APPROVED_USER_REVIEW` |
| `done` | stop; remind deploy needs `APPROVED_DEPLOY` — never auto-deploy |
| `blocked` | route by blocker owner |
| `rejected` / `superseded` / `cancelled` | stop |

## Task selection
1. If `execution.current_task` exists and task status is `in_progress` → continue that task via `develop`.
2. If current task status is `review` → route `review`.
3. If current task is `blocked` and blocks the chain → do not pick unrelated tasks; route blocker owner.
4. Else pick one task with status `ready`, all dependencies `done`, highest priority, then lowest TASK id.
5. Phase 3: **no parallel tasks**. Do not skip. Do not mark `done`.

## Execution eligibility (before develop)
Require: `validation.status == passed`, `approval.spec_package.status == approved`, `status ∈ {approved, implementing}`, task ready/in_progress, deps done, references valid.  
High-risk + policy: `approval.develop.status == approved` else `APPROVAL_REQUIRED`.

Failure tokens: `EXECUTION_BLOCKED`, `APPROVAL_REQUIRED`, `TASK_NOT_READY`, `TASK_DEPENDENCY_BLOCKED`, `TASK_REFERENCE_INVALID`, `PACKAGE_INVALID`.

## Manifest updates (allowed)
```text
manifest.status
execution.current_task
execution.last_activity_at
execution.last_activity_by
```
May set `status: implementing` when starting a task handoff to develop.  
Must **not** set task status to `done`.

## Blocker routing
```text
BUSINESS_AMBIGUITY      → grill-me
ANALYSIS_GAP            → analyze
REQUIREMENT_DEFECT      → requirements
ADR_REQUIRED            → adr
DESIGN_DEFECT           → design
TASK_DEFECT             → tasks
ACCEPTANCE_DEFECT       → acceptance
SPEC_INCONSISTENCY      → spec-review
IMPLEMENTATION_DEFECT   → develop
REVIEW_BLOCKER          → develop
QA_IMPLEMENTATION_BUG   → develop
QA_SPEC_DEFECT          → spec
CONVERGENCE_FAILURE     → skill owner per mismatch
```

## User review completion
When user says `APPROVED_USER_REVIEW`:
- Require `status == awaiting_user_review` and `qa.converge == passed`.
- Then set:
```yaml
status: done
approval:
  user_review:
    status: approved
    approved_by: user
    approved_at: <ISO-8601>
```
- Else `USER_REVIEW_APPROVAL_REJECTED`.
- Do **not** treat as `APPROVED_DEPLOY`. Do not deploy.

## Progress reporting
One short line after each routed step.

## Stop conditions
- Need user approval (`APPROVED_SPEC_PACKAGE`, `APPROVED_DEVELOP`, `APPROVED_USER_REVIEW`, `APPROVED_DEPLOY`)
- Package `blocked` / rejected / cancelled / superseded
- `awaiting_user_review`
- No ready task while still implementing
- Manifest conflict / `PACKAGE_CONFLICT`
- User says stop

## Output contract
Progress line + next skill invoked + package/task status summary. No direct requirement/design/code/test authoring.

## Stop condition
Stop on approval wait, blocked package, awaiting_user_review, no ready task, conflicts, or user stop.
