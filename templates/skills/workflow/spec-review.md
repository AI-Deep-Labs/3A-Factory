---
name: spec-review
description: Validate a Feature-local Spec Package for completeness, traceability, and readiness; write spec-review.md; set awaiting_approval on PASSED. Does not approve or write code.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug> or package path]
---

# Spec Review (package validator)

## Purpose
Validate the Spec Package against the contract and manifest schema semantics. This is **not** code review.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do **not** invent large requirement/architecture changes.  
Do **not** auto-approve the package (`approval.spec_package.status` must stay non-approved).  
Do **not** ignore blockers.  
May fix trivial format / obvious broken-reference / non-conflicting metadata issues — record every fix in the report.

## Package resolution contract
1. Valid package path → use.
2. Else REQ id → exactly one `.specs/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND`.
4. Do not migrate or delete legacy artifacts.

## Inputs
Read entire package:
- `manifest.yaml`, `raw.md`, `discovery.md`, `analysis.md`, `requirements.md`
- `decisions/*.md`, `design.md`, `tasks.md`, `acceptance.md`
- Spec Package contract
- Manifest schema: `.agents/schemas/spec-package-manifest.schema.json`
- Template: `.agents/templates/SPEC-REVIEW-template.md`

## Process
1. Resolve package.
2. Set manifest:
```yaml
status: validating
validation:
  status: pending
```
3. Run mandatory checks (below).
4. Write `spec-review.md` at package root (Vietnamese body; enums in English).
5. Update manifest per result. **Never** set `approval.spec_package.status: approved`.

## Mandatory validation checklist
1. Artifact completeness  
2. Manifest semantic validity (required fields, enums, id/slug patterns)  
3. No critical open questions  
4. Requirement quality  
5. Requirement → ADR/Design coverage  
6. Requirement → Task coverage  
7. Requirement → Acceptance coverage  
8. Task dependency validity (no cycles)  
9. Task file scope present  
10. ADR status (required ADRs Accepted)  
11. Scope consistency  
12. Duplicate authoritative truth  
13. Broken references  
14. Orphan IDs  
15. No remaining `PENDING_ACCEPTANCE`  
16. Package readiness vs contract §5.5 (except user approval)  
17. High-risk policy note (`APPROVED_DEVELOP` may be required later — warn, do not approve)  
18. No out-of-scope tasks  

## Result
Only `PASSED` or `FAILED`.

`PASSED` requires: Blocking Issues = 0, Manifest valid = Yes, Critical open questions = 0, Coverage complete = Yes.  
Warnings allowed if recorded.

## Manifest updates
FAILED:
```yaml
status: specifying
validation:
  status: failed
  blockers: ["…"]
```
PASSED:
```yaml
status: awaiting_approval
validation:
  status: passed
  blockers: []
  reviewed_at: <ISO-8601>
```

## Output contract
Follow SPEC-REVIEW-template; Final Decision must be PASSED or FAILED.

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT`
- Result `FAILED` with actionable blockers routed to owning skills

## Stop condition
Print review path + result. If PASSED → ask user for `APPROVED_SPEC_PACKAGE` (via `spec` or chat). Do **not** call Develop.
