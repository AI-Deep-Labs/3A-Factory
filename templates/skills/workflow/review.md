---
name: review
description: Task-scoped code compliance review against requirements/design/ADR/acceptance; writes TASK-NNN-code-review.md; alone may mark task done. Does not silently fix application code.
disable-model-invocation: true
argument-hint: "[REQ-<NNNNNN>-<slug> or package path] [optional TASK-NNN]"
---

# Review (code compliance)

## Purpose
Task-scoped compliance gate. Not Spec Package validation (`spec-review`) and not QA.

## Gate
Default: do **not** modify application source code.  
Do not silently fix code.  
May only fix formatting of the review evidence markdown itself.  
Do not invent requirements/architecture.  
Do not approve package/deploy.  
Do not write new reviews under legacy `docs/reviews` for Spec Package features.

## Package resolution
Same as other execution skills (`.specs/REQ-…/`, `PACKAGE_CONFLICT` / `PACKAGE_NOT_FOUND`).

## Inputs
```text
manifest.yaml
tasks.md
current TASK (status should be review)
requirement / design / ADR / acceptance references
implementation evidence (reviews/TASK-NNN-implementation.md)
git diff + relevant sources/tests
```
Do not vaguely review the whole repo when a current task is set.

## Review dimensions
1. Task compliance  
2. Requirement compliance  
3. Design compliance  
4. ADR compliance  
5. Acceptance coverage  
6. Scope compliance  
7. Code correctness  
8. Error handling  
9. Security  
10. Performance  
11. Maintainability  
12. Test quality  
13. Backward compatibility  
14. Observability impact  
15. Migration impact (if any)

## Severity
```text
BLOCKER
MAJOR
MINOR
WARNING
```
- Any `BLOCKER` or `MAJOR` → review **FAILED**
- `MINOR`: require fix before QA unless explicitly waived in report
- `WARNING`: record; does not fail alone

## Output
```text
.specs/<PACKAGE>/reviews/TASK-<NNN>-code-review.md
```
Template: `.agents/templates/CODE-REVIEW-template.md` (Vietnamese body).  
Result: `PASSED` | `FAILED`.

## Manifest / task transitions
On start:
```yaml
status: reviewing
review:
  status: pending
  current_task: TASK-xxx
```
FAILED:
```text
task.status: in_progress
manifest.status: implementing
review.status: failed
```
Route back to `develop` (`REVIEW_BLOCKER`).

PASSED:
```text
task.status: done
execution.completed_tasks += TASK-xxx
execution.current_task: null
review.status: passed
review.reviewed_at: <ISO-8601>
```
Then:
- If any task still not done / ready remains → leave `status: implementing` (or `approved` if none in progress) for PM to select next task.
- If **all** required tasks are `done` → `manifest.status: qa` and hand off to `qa` (do not silently run QA unless PM orchestration continues).

**Only this skill** may move task `review` → `done`.

## Failure states
```text
REVIEW_FAILED
REVIEW_BLOCKER
TASK_REFERENCE_INVALID
PACKAGE_NOT_FOUND
PACKAGE_CONFLICT
```

## Stop condition
Print review path + PASSED/FAILED + next skill. Do not deploy. Do not mark package `done`.
