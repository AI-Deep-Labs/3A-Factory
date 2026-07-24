---
name: analyze
description: Impact and risk analysis into docs/tasks/.../analysis.md; set risk and ADR recommendation; status analyzed.
disable-model-invocation: true
argument-hint: "[REQ-<NNNNNN>-<slug> or package path]"
---

# Analyze (Impact & Risk)

## Purpose
Produce package-local `analysis.md`: current state, impact, dependencies, risk, constraints, feasibility, and ADR recommendation.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do not write ADR bodies, technical design, requirements, tasks, or acceptance.  
Do not invent answers to critical open questions.

## Package resolution contract
1. Valid package path → use.
2. Else REQ id → exactly one `docs/tasks/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND`.
4. Do not write new artifacts to legacy `docs/*` lifecycle folders.
5. Do not move/delete legacy artifacts.

## Inputs
Mandatory:
- `manifest.yaml`
- `raw.md`
- `discovery.md` (if missing and raw is clear enough, note gap; if discovery has critical open questions → block)
- Related codebase
- Contract + ANALYSIS template (`.agents/templates/ANALYSIS-template.md`)

## Process
1. Resolve package; read inputs.
2. If `discovery.md` has **critical** open questions → stop with `ANALYSIS_BLOCKED`; route to `grill-me`.
3. Survey related code; assess impact, dependencies, constraints, feasibility.
4. Apply risk rubric (AGENTS.md): `low` | `medium` | `high`.
5. Decide ADR recommendation: `ADR_REQUIRED` | `ADR_NOT_REQUIRED` | `ADR_DEFERRED` — do **not** write the ADR here.
6. Write `analysis.md` (Vietnamese).
7. Update manifest risk + `status: analyzed`.

## Output contract — `analysis.md`
Minimum sections:

```markdown
# Analysis

## Metadata
## Problem Analysis
## Current State
## Business Impact
## Technical Impact
## Data Impact
## Security Impact
## Operational Impact
## Dependencies
## Constraints
## Risks
## Options Requiring ADR
## Recommended Direction
## Open Blockers
## Analysis Result
```

`Analysis Result` must include risk and explicit `ADR_REQUIRED` | `ADR_NOT_REQUIRED` | `ADR_DEFERRED`.

## Manifest updates
```yaml
risk: low | medium | high
status: analyzed
```

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT`
- `ANALYSIS_BLOCKED` — critical open questions in discovery

## Stop condition
Report analysis path, risk, ADR recommendation, blockers. Do not call design/requirements unless orchestrated by `spec` / PM.
