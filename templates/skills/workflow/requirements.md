---
name: requirements
description: Write Business Truth requirements.md inside a Spec Package from raw, discovery, and analysis. No design, tasks, or code.
disable-model-invocation: true
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
---

# Requirements

## Purpose
Transform `raw.md`, `discovery.md`, and `analysis.md` into authoritative `requirements.md` (Business Truth — WHAT and WHY).

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do **not**: choose architecture; write technical design; split implementation tasks; write code; invent scope absent from source artifacts; answer critical open questions unilaterally.

## Package resolution contract
1. Valid package path → use.
2. Else REQ id → exactly one `.specs/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND`.
4. Do not write new artifacts to legacy `docs/requirements|designs|qa|reviews`.
5. Do not move/delete legacy artifacts.

## Inputs
Mandatory:
- `manifest.yaml`
- `raw.md`
- `discovery.md`
- `analysis.md`
- `.agents/templates/REQUIREMENTS-template.md`
- Spec Package contract

If `analysis.md` missing → `REQUIREMENTS_BLOCKED`.

## Process
1. Resolve package; read inputs + contract + template.
2. If critical open questions remain in discovery/analysis → do not mark ready; add validation blockers; return to `grill-me` / `analyze`.
3. Write atomic, testable, unambiguous requirements with IDs: `US-001`, `FR-001`, `BR-001`, `NFR-001`.
4. Each item: priority, status, source, acceptance references (or clear placeholder for acceptance skill).
5. No file names, class names, frameworks, cache keys, SQL migrations, task ordering, or technical implementation.
6. Write `requirements.md` (Vietnamese body).
7. Update manifest `status: specifying`. Do **not** approve the package.

## Output contract
Follow REQUIREMENTS-template structure (Problem, Goals, Non-goals, Actors, Scenarios, FR/BR/NFR, Constraints, Assumptions, Edge Cases, Out of Scope, Open Questions, Summary table).

## Requirement quality checklist
- Atomic, testable, unambiguous, traceable to source
- No duplicates; priority + status present
- Acceptance reference or explicit deferred placeholder

## Manifest updates
```yaml
status: specifying
```
On blockers, also set:
```yaml
validation:
  status: pending
  blockers: ["…"]
```

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT`
- `REQUIREMENTS_BLOCKED` — missing analysis or critical open questions

## Stop condition
Report path + requirement ID summary + blockers. Do not call design/tasks unless orchestrated by `spec`.
