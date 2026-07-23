---
name: grill-me
description: Deep clarification (one question at a time) into .specs/.../discovery.md; update manifest status clarifying until READY_FOR_ANALYSIS.
disable-model-invocation: true
argument-hint: "[requirement or REQ-<NNNNNN>-<slug> or package path]"
---

# Grill-me

## Purpose
Resolve ambiguity through codebase-first exploration and one question per turn. Write package-local `discovery.md`.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do not write a full implementation plan / tasks.  
Do not write requirements, design, or acceptance as authoritative truth.

## Package resolution contract
1. Valid package path from user/context → use it.
2. Else REQ id → find exactly one `.specs/REQ-<NNNNNN>-*/`.
3. One match → use. Multiple → `PACKAGE_CONFLICT`.
4. None found → this skill does **not** invent a new REQ; stop with `PACKAGE_NOT_FOUND` and ask for `/triage` first (or create minimal package only if triage already implied the same id).
5. Never write new artifacts to legacy `docs/requirements|designs|qa|reviews`.
6. Do not move/delete legacy artifacts.

## Inputs
Mandatory:
- `manifest.yaml`
- `raw.md`
- Related codebase
- Contract: Spec Package contract
Optional: prior `discovery.md`

## Process
1. Resolve package; read `manifest.yaml` + `raw.md`.
2. Restate understanding (business + technical).
3. **Explore the codebase first** — only ask what cannot be deduced from the repo.
4. Ask **exactly one** question per turn; update `discovery.md` after each answer (same file, never parallel discovery files).
5. Capture clarifications, assumptions, constraints, edge cases, open questions, acceptance direction.
6. Iterate until no critical ambiguity remains, or user says “execute now” / equivalent.

## Output contract — `discovery.md`
Vietnamese body. Structure:

```markdown
# Discovery

## Metadata
## Current Understanding
## Business Goal
## Codebase Findings
## Clarifications
## Assumptions
## Constraints
## Edge Cases
## Open Questions
## Acceptance Direction
## Discovery Status
```

`Discovery Status`:
- While questions remain: `IN_PROGRESS`
- When ready: `READY_FOR_ANALYSIS`

## Manifest updates
While clarifying:
```yaml
status: clarifying
```
When `READY_FOR_ANALYSIS`: leave status for analyze to move to `analyzed` (may remain `clarifying` until analyze starts, or set `clarifying` → ready handoff). Prefer keeping `status: clarifying` until analyze runs if questions were active this session; if already clear on entry, proceed handoff without inventing analysis.

## Failure states
- `PACKAGE_NOT_FOUND` / `PACKAGE_CONFLICT`
- Critical info still missing for later requirements/design → ask one more question, then stop

## Pipeline handoff
- Clear enough **or** “execute now” → do **not** ask “run the pipeline?”; continue to `analyze` (or return to `project-manager`).
- “Execute now” does **not** bypass `APPROVED_SPEC_PACKAGE`, high-risk develop approval, or deploy approval.
- Do **not** start Develop.

## Stop condition
Each turn output: Current Understanding, Business Goal, Codebase Findings, Assumptions & Edge Cases, **one** Current Focus Question, Acceptance Direction, Discovery Status, package path.
