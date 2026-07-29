---
name: acceptance
description: "Write Verification Truth acceptance.md inside a Spec Package; sync PENDING_ACCEPTANCE references in tasks.md without changing task scope."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
---

# Acceptance

## Purpose
Create package-local `acceptance.md` — Verification Truth and Definition of Done.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do **not** invent new business scope.  
Do **not** change technical design.  
Do **not** create requirements.

## Package resolution contract
1. Valid package path → use.
2. Else REQ id → exactly one `docs/tasks/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND`.
4. Do not write new legacy `docs/requirements/…-spec.md`.
5. Do not move/delete legacy artifacts.

## Inputs
Mandatory:
- `manifest.yaml`
- `requirements.md`
- `design.md`
- `.agents/templates/ACCEPTANCE-template.md`
- Spec Package contract
Optional: `tasks.md`

## Process
1. Resolve package; read inputs.
2. Author AC / UT / ST / UAT / PERF / SEC with IDs `AC-001`, `UT-001`, `ST-001`, `UAT-001`, `PERF-001`, `SEC-001`.
3. Every acceptance item references requirements; include positive, negative, and edge cases as appropriate.
4. Include System Test + UAT when the feature needs them; PERF/SEC when related NFRs exist.
5. Build coverage matrix Requirement → AC/UT/ST/UAT/PERF/SEC.
6. Write `acceptance.md` (Vietnamese).
7. **Task synchronization:** if `tasks.md` exists, replace `PENDING_ACCEPTANCE` with real IDs only — do not change objectives or technical scope; do not invent tasks solely for coverage; if a real task gap exists, add a validation blocker for `tasks` skill.

## Output contract
Follow ACCEPTANCE-template (DoD, AC with Gherkin, UT/ST/UAT/PERF/SEC, Coverage Matrix, Open Verification Questions).

## Manifest updates
Keep `status: specifying` (or current specifying/validating flow). Clear acceptance-related blockers when coverage is complete enough for review.

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT`
- Missing requirements or design → stop and route to producer skill

## Stop condition
Report acceptance path + coverage summary + whether tasks were synchronized. Next: `spec-review` or `spec` orchestrator.
