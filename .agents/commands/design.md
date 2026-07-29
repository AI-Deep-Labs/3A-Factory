---
name: design
description: "Write Technical Truth design.md inside a Spec Package with Design IDs and requirement/ADR traceability. No tasks or code."
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
---

# Design (How)

## Purpose
Produce package-local `design.md` — Technical Truth (HOW) with Design IDs and traceability to requirements/ADRs.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do not invent business requirements.  
Do not write execution task lists (`tasks.md` owns that).  
Do not replace acceptance / requirements ownership.

## Package resolution contract
1. Valid package path → use.
2. Else REQ id → exactly one `docs/tasks/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND`.
4. Do not write new artifacts to legacy `docs/designs` (no `…-design.md` for new packages).
5. Do not move/delete legacy artifacts.

## Inputs
Mandatory:
- `manifest.yaml`
- `analysis.md`
- `requirements.md`
- `decisions/*.md` (all feature ADRs)
- `.agents/templates/DESIGN-template.md`
- Spec Package contract

## Process
1. Resolve package; read inputs.
2. If analysis says `ADR_REQUIRED` and any required ADR is not **Accepted** → `DESIGN_BLOCKED`.
3. Design to cover requirements that need coding; use IDs:
   `DES-ARCH-001`, `DES-API-001`, `DES-DATA-001`, `DES-FLOW-001`, `DES-SEC-001`, `DES-OBS-001`, `DES-MIG-001`, `DES-TEST-001`.
4. Each important section references `FR/BR/NFR` and ADR ids when applicable.
5. Include minimum file/module scope notes for later tasks — **not** ordered task execution.
6. Write `design.md` (Vietnamese).
7. If technical blockers remain → `Design Status: BLOCKED` + manifest blockers. Else `Design Status: READY_FOR_TASKS`.
8. Keep manifest in `specifying` (or leave as-is if already specifying); do not approve.

## Output contract
Minimum:

```markdown
# Technical Design

## Metadata
## Design Goals
## Architecture
## Components
## Data Design
## API and Interface Contracts
## Main Flows
## Error Handling
## Security
## Performance and Reliability
## Observability
## Migration and Backward Compatibility
## Testability
## Requirement Traceability
## Open Technical Questions
## Design Status
```

Forbidden in design: task ordering, effort estimates, current execution state, new business requirements.

## Manifest updates
On blockers:
```yaml
validation:
  blockers: ["DESIGN_BLOCKED: …"]
```
Clear design-related blockers when `READY_FOR_TASKS`.

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT`
- `DESIGN_BLOCKED` — ADR_REQUIRED without Accepted ADR, or missing requirements/analysis

## Stop condition
Report design path, Design Status, traceability summary. Hand off to `tasks` when ready (or `spec` orchestrator).
