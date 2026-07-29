---
name: tasks
description: "Write Execution Truth tasks.md inside a Spec Package with TASK IDs, dependencies, file scope, and requirement/design/acceptance references."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
---

# Tasks

## Purpose
Produce package-local `tasks.md` — Execution Truth and the Develop entry point (Phase 3). Every feature needs ≥1 task.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do not invent architecture decisions or new requirements.  
Do not mark tasks `done`.  
Do not write acceptance criteria bodies (acceptance skill owns `acceptance.md`).

## Package resolution contract
1. Valid package path → use.
2. Else REQ id → exactly one `docs/tasks/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND`.
4. Do not create legacy `docs/designs/…-plan.md` for new packages.
5. Do not move/delete legacy artifacts.

## Inputs
Mandatory:
- `manifest.yaml`
- `requirements.md`
- `design.md`
- `decisions/*.md`
- `.agents/templates/TASKS-template.md`
- Spec Package contract
Optional: `acceptance.md` (if present, use real AC/UT ids; else `PENDING_ACCEPTANCE`)

## Process
1. Resolve package; read inputs.
2. If Design Status is not `READY_FOR_TASKS` (or design missing/blocked) → `TASKS_BLOCKED`.
3. Break work into controlled tasks with IDs `TASK-001`…
4. Each task includes: Title, Status (`draft`|`ready` only from this skill), Objective, Requirement/Design/ADR/Acceptance refs, Dependencies, Expected File Scope, Implementation Notes, Verification, Definition of Done.
5. No circular dependencies; no references to non-existent IDs; no scope outside requirements/design.
6. If acceptance missing → acceptance refs may be `PENDING_ACCEPTANCE` (spec-review must fail until resolved).
7. Write `tasks.md` (Vietnamese). Keep manifest `status: specifying` unless already further along in orchestration.

## Output contract
Follow TASKS-template: Execution Rules, Dependency Graph, Tasks, Execution Summary.

Task status enum: `draft` | `ready` | `in_progress` | `blocked` | `review` | `done` | `cancelled` — producer sets only `draft` or `ready`.

## Manifest updates
Do not set `execution.current_task` for Develop yet (Phase 3). May leave execution fields unchanged.  
On blockers, append `validation.blockers`.

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT`
- `TASKS_BLOCKED` — design not ready

## Stop condition
Report tasks path + dependency graph summary. Prefer next: `acceptance` then `spec-review` (or `spec` orchestrator).
