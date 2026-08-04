---
name: develop
description: Task executor for Spec Packages — implements one ready task under APPROVED_SPEC_PACKAGE with scope gates; writes implementation evidence; hands off to review. Never marks task done or deploys.
argument-hint: "[REQ-<NNNNNN>-<slug> or package path] [optional TASK-NNN]"
---

# Develop

## Purpose
Execute **one** current task from `tasks.md`. Not a planner.

## Gate
Do not invent requirements or architecture.  
Do not expand business scope.  
Do not auto-approve.  
Do not deploy.  
Do not commit/push unless the user explicitly asked in this session (default: do not).  
Do not mark task `done` (review owns that).  
Do not write new evidence under legacy `docs/qa` or `docs/reviews` for Spec Package features.

## Package resolution
1. Valid package path → use.
2. Else REQ id → exactly one `docs/tasks/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND`.

## Hard gate (before any code change)
Verify all:
```text
manifest exists
validation.status == passed
approval.spec_package.status == approved
package.status ∈ {approved, implementing}
current task exists
task.status ∈ {ready, in_progress}
all dependencies == done
references valid
```
If `risk: high` and develop approval is required by policy/contract:
```text
approval.develop.status == approved
```
Else → `APPROVAL_REQUIRED` (no code changes). **Stop and return to `project-manager`** to ask develop confirmation (contract § 5.4.1); do not parse approval replies in this skill.

Other failure tokens: `EXECUTION_BLOCKED`, `TASK_NOT_READY`, `TASK_DEPENDENCY_BLOCKED`, `TASK_REFERENCE_INVALID`, `PACKAGE_INVALID`.

## Input order
```text
manifest.yaml
→ tasks.md
→ current TASK
→ referenced requirements
→ referenced design
→ referenced ADR
→ referenced acceptance
→ relevant codebase + tests
```

## Execution context (build before coding)
```text
Current Task, Objective, Requirement IDs, Design IDs, ADR IDs,
Acceptance IDs, Dependencies, Expected File Scope,
Existing Code Findings, Implementation Constraints, Verification Commands
```

## Scope gate
May edit:
- Files in Expected File Scope
- Necessary test files for the task
- Directly related files discovered in codebase **only after** updating `tasks.md` with reason; no architecture/business scope expansion

Significant scope growth → `TASK_SCOPE_CHANGE_REQUIRED` (stop; route tasks/design).

## Task lifecycle / manifest
On start:
```text
task.status: in_progress
manifest.status: implementing
execution.current_task: TASK-xxx
execution.attempts[TASK-xxx] += 1
execution.last_activity_at / last_activity_by updated
```
After implementation + local verification pass:
```text
task.status: review
manifest.status: reviewing
```
If blocked:
```text
task.status: blocked
manifest.status: blocked
execution.blocked_tasks += TASK-xxx
```

## Code behavior
- Follow existing conventions/patterns; no over-engineering
- Stay in scope; add/update unit tests as needed
- No secrets in code/logs; no unauthorized breaking changes
- Do not change requirement/design docs to fit code

## Verification
Run commands from the task; else project standard test/lint/build if they exist.  
Do not invent scripts or install dependencies.

## Evidence output
Create/update (Vietnamese body):
```text
docs/tasks/<PACKAGE>/reviews/TASK-<NNN>-implementation.md
```
Use `.agents/templates/IMPLEMENTATION-EVIDENCE-template.md`.

## Failure states
```text
TASK_BLOCKED
TASK_SCOPE_CHANGE_REQUIRED
TASK_REFERENCE_INVALID
IMPLEMENTATION_FAILED
VERIFICATION_FAILED
APPROVAL_REQUIRED
```

## Inputs
- `manifest.yaml`, `tasks.md`
- current TASK (+ references)
- relevant codebase and tests

## Output contract
Implementation evidence at `docs/tasks/<PACKAGE>/reviews/TASK-<NNN>-implementation.md` + handoff to review.

## Stop condition
Hand off to `review` with evidence path. Do not start QA. Do not mark `done`. Greenfield only — require Spec Package.
