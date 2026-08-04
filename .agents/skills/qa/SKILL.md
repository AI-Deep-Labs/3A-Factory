---
name: qa
description: Acceptance-driven QA for Spec Packages — unit/system/UAT(+PERF/SEC) with evidence under docs/tasks/.../qa/; bounded auto-loop (max 3); routes implementation vs spec defects. Does not deploy.
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
---

# QA (acceptance-driven)

## Purpose
Verify implementation against `acceptance.md` with real evidence. Bounded auto-fix loop. Does not mark package `done` or deploy.

## Gate
Do not invent acceptance criteria.  
Do not hide spec defects by only patching code.  
Do not auto-approve or deploy.  
Do not write new QA reports under legacy `docs/qa` for Spec Package features.  
Do not install new dependencies just to test.

## Package resolution
`docs/tasks/REQ-…/` only for new packages; `PACKAGE_CONFLICT` / `PACKAGE_NOT_FOUND` as usual.

## Preconditions
```text
all required tasks == done
manifest.status == qa   # or set to qa when entering if all tasks done and reviews passed
acceptance.md exists
review evidence PASSED for every required task
```
Else → `QA_BLOCKED`.

## Inputs
```text
manifest.yaml, requirements.md, design.md, tasks.md, acceptance.md
reviews/*, implementation evidence, relevant code, test config
```

## Verification scope
Evaluate (create reports only when applicable):
```text
Unit Test, System Test, UAT, Performance, Security, Regression impact
```
Item results: `PASSED` | `FAILED` | `BLOCKED` | `NOT_REQUIRED`.

## Evidence outputs
Under `docs/tasks/<PACKAGE>/qa/`:
```text
unit-test-report.md
system-test-report.md
uat-report.md
performance-report.md      # if applicable
security-report.md         # if applicable
qa-summary.md              # required
```
Each report references Requirement IDs, Acceptance/Test IDs, Task IDs, review evidence, commands, results.  
Templates: `QA-SUMMARY-template.md` (package-local UT/ST/UAT reports as needed).  
Vietnamese bodies.

## Auto-loop (max 3)
Increment `qa.attempts` at the start of each QA cycle. Default **max = 3**.

### Implementation defect
Token: `QA_IMPLEMENTATION_BUG`  
Route: `qa` → `develop` → `review` → `qa`  
Manifest on fail: `status: implementing`

### Spec defect
Token: `QA_SPEC_DEFECT`  
Route: `qa` → owning producer (`requirements`/`design`/`acceptance`/`tasks`) → `spec-review` → invalidate approval → user re-approval  
```yaml
status: specifying
validation.status: pending
approval.spec_package.status: invalidated
```

### Loop limit
If `qa.attempts > 3` (or attempt starts above max):
```text
QA_LOOP_LIMIT_REACHED
```
```yaml
status: blocked
qa:
  blockers: ["QA_LOOP_LIMIT_REACHED"]
```
Stop infinite loops.

## Manifest updates
On start:
```yaml
status: qa
qa.attempts: <increment>
qa.last_run_at: <ISO-8601>
```
PASSED:
```yaml
status: converging
qa.unit_test: passed | not_required
qa.system_test: passed | not_required
qa.uat: passed | not_required
# clear qa.blockers
```
Return a PASS report to `project-manager`. Do **not** update `manifest.yaml` yourself.

## Failure states
```text
QA_BLOCKED
QA_IMPLEMENTATION_BUG
QA_SPEC_DEFECT
QA_LOOP_LIMIT_REACHED
```

## Stop condition
Return to `project-manager` with qa-summary path + result + next route. Never deploy.

## Compatibility
Legacy `docs/qa/REQ-*-qa.md` path is not used for new Spec Package features.
