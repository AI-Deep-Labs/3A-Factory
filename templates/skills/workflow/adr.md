---
name: adr
description: Optional Architectural Decision Record — feature-local under docs/tasks/.../decisions/ or project-wide under docs/decisions/. Register feature ADRs in package manifest.
disable-model-invocation: true
argument-hint: "[slug or REQ id or package path] [feature|project]"
---

# ADR

## Purpose
Compare ≥2 architecture options and record a decision. Optional — only when warranted.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package / ADR artifacts.  
Do not write requirements, tasks, acceptance, or full design as a substitute for this ADR.  
Do **not** auto-Accept an ADR when user/maintainer review is required.

## Package resolution contract (feature scope)
1. Valid package path → use.
2. Else REQ id → exactly one `docs/tasks/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None → `PACKAGE_NOT_FOUND`.
4. Feature ADR path: `docs/tasks/<PACKAGE>/decisions/ADR-<NNNNNN>-<slug>.md`
5. Project-wide ADR path: `docs/decisions/ADR-<NNNNNN>-<slug>.md` (canonical global location). Create `docs/decisions/` only when writing the first project-wide ADR file.
6. Do not place project-wide ADRs inside a random package.
7. Do not write feature lifecycle artifacts outside `docs/tasks/`.
8. Do not create migration/legacy paths.
9. Do not pre-create empty `docs/decisions/` or `docs/misc/` during install/onboarding.

## When to create
Create ADR only if: significant options, real trade-offs, hard to reverse, multi-component impact, or security/data/reliability/ops impact.

Do **not** create ADR for: minor naming, local refactor, easily reversible implementation detail, task sequencing.

## Naming
The agent allocates ADR ids itself — **no helper script**.

1. List `ADR-*.md` file basenames under:
   - `docs/tasks/**/decisions/`
   - `docs/decisions/`
   - Legacy: `docs/designs/` (if present)
2. Parse the numeric part after `ADR-`. Compute **`next = max + 1`**. If none → **`000001`**.
3. **Never** count illustrative ADR ids in contracts/skills/templates (examples use `ADR-000001-…` only).
4. Id = `ADR-<NNNNNN>-<slug>`. ADR series is independent of REQ series. Do not rename old files.

Template: `.agents/templates/ADR-template.md`.

## Inputs
Feature ADR must read:
- `manifest.yaml`, `analysis.md`, `requirements.md` (if present)
- Related ADRs
- Spec Package contract

Project ADR: read relevant analysis/context; package path may be `n/a`.

## Process
1. Determine `Scope: feature | project`.
2. Resolve package when feature-scoped.
3. Draft options (≥2), drivers, decision, consequences, risks, follow-up.
4. Write ADR with status **`Proposed`** (Vietnamese body).
5. Feature ADR: ensure `decisions/` exists; append manifest `decisions` entry (no duplicates):

```yaml
decisions:
  - id: ADR-000001-example-slug
    path: decisions/ADR-000001-example-slug.md
    status: Proposed
```

6. Do not invent Design IDs; leave Related Design IDs empty or TBD until design exists.

## Output contract
Must include: ADR ID, Title, Status, Scope, Package Path, Related Requirement IDs, Related Design IDs, Context, Decision Drivers, Options, Decision, Consequences, Risks, Follow-up (align with ADR template sections).

## Manifest updates
Feature: register under `decisions[]` as above. Do not change `approval.*`.  
Package is **not** ready while required ADRs remain `Proposed` (spec-review / design gates enforce Accepted).

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT` (feature scope)
- Stop if ADR is not warranted — explain why `ADR_NOT_REQUIRED`

## Stop condition
Print ADR path + status `Proposed` + whether user Accept is needed before design can proceed. Next usually → `design` after Accept when `ADR_REQUIRED`.
