---
name: spec
description: Write the What specification after design — docs/requirements/REQ-<NNNNNN>-<slug>-spec.md. Always self-review and stop for user APPROVED before continuing.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# SPEC (What)

## Gate
Do not modify source code. Only create/update `docs/requirements/REQ-<NNNNNN>-<slug>-spec.md` (and related prior docs if the user requests adjustments).

## Phase question
**What must be done?** → testable specification with acceptance criteria.

## Preconditions
`docs/designs/REQ-<NNNNNN>-<slug>-design.md` (and analysis) exist. Pipeline: runs **after design**.

## Process
1. Read all prior artifacts for this REQ: raw, discovery (if any), analysis, ADR (if any), design.
2. Write the spec using the SPEC template — behavior/AC focus; do not replace Design How.
3. Write `docs/requirements/REQ-<NNNNNN>-<slug>-spec.md`.
4. If blocking open questions remain → list them and **stop**; do not invent AC.
5. **Mandatory self-review (before asking the user):** compare the new spec against **all** collected content above. Check for gaps, contradictions, missing AC, scope drift, and design/spec mismatches. Summarize findings briefly (pass / issues found).
6. **Mandatory stop — user review:** present the spec path + self-review summary; ask the user to verify and whether any adjustments are needed. **Do not** continue to plan / develop / later phases.
7. **If the user requests changes:** update the spec **and** any related prior docs already created for this REQ (raw / discovery / analysis / design / ADR as needed) so they stay consistent. Re-run self-review, then stop again for confirmation.
8. **Continue only after** the user confirms with `APPROVED` (or clear equivalent agreement). Then hand off to Planning / next PM step.

**File body: Vietnamese.**

## Suggested sections
Metadata, Goal, Context, Current/Expected Behavior, Business Rules, Flow, I/O, Modules, Data/API/Config impact, Edge Cases, Acceptance Criteria (Given/When/Then), Out of Scope, Open Questions.

## Directives
- After every new or revised spec: **always** self-review + stop for user review. Applies to **all** risk levels (low / medium / high).
- `APPROVED` → continue pipeline.
- `REJECTED` → stop; ask whether to re-analyze from scratch (y/n) per `AGENTS.md`.
- `RE-EXECUTE` → refine the current spec (and related docs) in place; then self-review and stop again.
