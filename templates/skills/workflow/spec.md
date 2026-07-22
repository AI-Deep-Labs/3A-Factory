---
name: spec
description: Write the What specification after design — docs/requirements/REQ-<NNNNNN>-<slug>-spec.md.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# SPEC (What)

## Gate
Do not modify source code. Only create/update `docs/requirements/REQ-<NNNNNN>-<slug>-spec.md`.

## Phase question
**What must be done?** → testable specification with acceptance criteria.

## Preconditions
`docs/designs/REQ-<NNNNNN>-<slug>-design.md` (and analysis) exist. Pipeline: runs **after design**.

## Process
1. Read design (+ discovery/raw).
2. Write the spec using the SPEC template — behavior/AC focus; do not replace Design How.
3. Write `docs/requirements/REQ-<NNNNNN>-<slug>-spec.md`.
4. If blocking open questions remain → list them and **stop** (PM asks the user); do not invent AC.

**File body: Vietnamese.**

## Suggested sections
Metadata, Goal, Context, Current/Expected Behavior, Business Rules, Flow, I/O, Modules, Data/API/Config impact, Edge Cases, Acceptance Criteria (Given/When/Then), Out of Scope, Open Questions.

## Directives
In auto-run pipeline (low/medium risk): `APPROVED` after spec is not required.  
When invoked alone / waiting approval: `APPROVED` / `REJECTED` / `RE-EXECUTE` per `AGENTS.md`.
