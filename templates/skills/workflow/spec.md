---
name: spec
description: Spec Package orchestrator — coordinates requirements, ADR, design, tasks, acceptance, and spec-review under .specs/; stops for APPROVED_SPEC_PACKAGE. Does not write *-spec.md or application code.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug> or package path]
---

# Spec (Package Orchestrator)

## Purpose
Composite skill that completes a Feature-local Spec Package from analysis through validation, then **stops** for `APPROVED_SPEC_PACKAGE`.

**Spec is a package, not a single `*-spec.md` file.**  
Do **not** create legacy `docs/requirements/REQ-*-spec.md` for new packages.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do not auto-approve the package.  
Do not bypass specialist skill contracts.  
Do not merge all artifacts into one file.  
Do not invent requirements or architecture to paper over blockers.

## Package resolution contract
1. Valid package path → use.
2. Else REQ id → exactly one `.specs/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND` (ask `/triage`).
4. Never write new legacy `*-spec.md` / `*-design.md` / `*-plan.md` under `docs/`.
5. Do not move/delete legacy artifacts.

## Inputs
- `manifest.yaml`, `raw.md`, `discovery.md`, `analysis.md`
- Spec Package contract + related templates
- Specialist skills: `requirements`, `adr`, `design`, `tasks`, `acceptance`, `spec-review`

## Orchestration flow
Execute in order (invoke / follow each specialist skill’s full contract):

```text
resolve package
→ verify discovery/analysis readiness
→ requirements
→ ADR if required
→ design
→ tasks draft
→ acceptance
→ synchronize task acceptance references
→ spec-review
→ request APPROVED_SPEC_PACKAGE
→ stop
```

### Readiness checks before producers
- Discovery critical open questions → route `grill-me` (`ANALYSIS`/`REQUIREMENTS` blocked patterns).
- Missing `analysis.md` or not analyzed → route `analyze`.

### ADR decision (from `analysis.md`)
- `ADR_REQUIRED` → run `adr` (feature scope); **stop** if required ADR not yet **Accepted** (`DESIGN_BLOCKED`).
- `ADR_NOT_REQUIRED` → do not create empty ADR; record rationale in design metadata when design runs.
- `ADR_DEFERRED` → document deferral; do not block unless later design proves ADR is mandatory — then fail with blocker.

## Failure routing (ownership)
| Blocker type | Route to |
|---|---|
| Business ambiguity | `grill-me` |
| Analysis gap | `analyze` |
| Requirement defect | `requirements` |
| Architecture decision | `adr` |
| Technical design gap | `design` |
| Execution breakdown | `tasks` |
| Verification gap | `acceptance` |
| Cross-artifact mismatch | `spec-review` |

Do not fix by violating ownership.

## Approval handling (producer phase)
When the user says `APPROVED_SPEC_PACKAGE` in this package context:

**Allow** update only if:
- `validation.status == passed`
- `spec-review.md` Final Decision = `PASSED`
- No blockers in manifest

Then set:
```yaml
status: approved
approval:
  spec_package:
    status: approved
    approved_by: user
    approved_at: <ISO-8601>
```

Otherwise return `APPROVAL_REJECTED` and do not change approval.

Do **not** process `APPROVED_DEVELOP` or `APPROVED_DEPLOY` beyond preserving schema fields.

Legacy keyword `APPROVED` in this skill context maps to `APPROVED_SPEC_PACKAGE` only when validation has passed; still record typed approval in manifest.

## Output (when review PASSED)
Print:
- Package summary (id, slug, risk, status)
- Artifact paths under `.specs/REQ-…/`
- Validation result
- Explicit request for user to reply: `APPROVED_SPEC_PACKAGE`

**Stop. Do not call Develop, review, qa, or deploy.**

## Manifest updates
Orchestration may move status through `specifying` → `validating` → `awaiting_approval` via specialist skills. Approval only per section above.

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT`
- Specialist failure tokens (`REQUIREMENTS_BLOCKED`, `DESIGN_BLOCKED`, …)
- `APPROVAL_REJECTED`

## Stop condition
Always stop after PASSED review pending approval, or on any blocker after reporting the owning skill. Never start Develop in Phase 2 / this skill.
