---
name: converge
description: Final Spec Package consistency gate after QA — compares requirements/design/tasks/acceptance/code/evidence/manifest; writes converge-report.md; sets awaiting_user_review on PASSED. Does not mark done or deploy.
disable-model-invocation: true
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
---

# Converge

## Purpose
Final consistency gate before user review: package ↔ code ↔ evidence.

## Gate
Do not modify application source code.  
Do not invent large requirement/architecture changes.  
Do not approve deploy.  
Do not mark `done` if evidence is incomplete.  
Do not ignore mismatches.  
May fix obvious broken references / non-semantic metadata / simple manifest summary mismatches — record every correction in the report.

## Package resolution
`docs/tasks/REQ-…/`; `PACKAGE_CONFLICT` / `PACKAGE_NOT_FOUND`.

## Preconditions
- `manifest.status == converging` (or QA just PASSED and handed off)
- QA summary PASSED
- All required tasks `done` with PASSED reviews

Else → `CONVERGENCE_BLOCKED` / route appropriately.

## Inputs
Entire package + relevant git diff / sources + QA/review evidence.

## Validation checklist
1. Every requirement has implementation evidence  
2. Every design item needing code is implemented  
3. Every required task is `done`  
4. Every acceptance item has test evidence  
5. Every task review PASSED  
6. QA summary PASSED  
7. No unexplained out-of-scope files  
8. No code behavior outside requirements  
9. No omitted requirements  
10. No stale design references  
11. No invalidated approvals left unresolved  
12. Manifest matches reality  
13. No remaining blockers  
14. No orphan artifacts  
15. No missing evidence  

## Output
```text
docs/tasks/<PACKAGE>/qa/converge-report.md
```
Template: `.agents/templates/CONVERGE-REPORT-template.md` (Vietnamese).  
Result: `PASSED` | `FAILED`.

## Manifest updates
FAILED:
```yaml
qa.converge: failed
# status: blocked or route to owner; record blockers
```
Token: `CONVERGENCE_FAILURE` — route via failure ownership matrix.

PASSED:
```yaml
status: awaiting_user_review
qa.converge: passed
```
Ask **user review confirmation question** (contract § 5.4.1; `.agents/templates/APPROVAL-CONFIRMATION-template.md`).  
Do **not** set `done`. Do **not** deploy.

## Failure states
```text
CONVERGENCE_FAILURE
CONVERGENCE_BLOCKED
PACKAGE_NOT_FOUND
PACKAGE_CONFLICT
```

## Stop condition
Print converge-report path + result. On PASSED, stop for user review approval.
