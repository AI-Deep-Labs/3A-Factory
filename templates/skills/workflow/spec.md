---
name: spec
description: Write the What specification after design — docs/requirements/REQ-<NNNNNN>-<slug>-spec.md. Must include System Test + UAT conditions. Always self-review and stop for user APPROVED before continuing.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# SPEC (What)

## Gate
Do not modify source code. Only create/update `docs/requirements/REQ-<NNNNNN>-<slug>-spec.md` (and related prior docs if the user requests adjustments).

## Phase question
**What must be done?** → testable specification with acceptance criteria, **System Test Conditions**, and **UAT Conditions**.

## Preconditions
`docs/designs/REQ-<NNNNNN>-<slug>-design.md` (and analysis) exist. Pipeline: runs **after design**.

## Process
1. Read all prior artifacts for this REQ: raw, discovery (if any), analysis, ADR (if any), design.
2. Write the spec using the SPEC template — behavior/AC focus; do not replace Design How.
3. **Mandatory test sections** (non-empty, concrete, verifiable):
   - **Acceptance Criteria** (Given/When/Then)
   - **System Test Conditions** — end-to-end / integration checks the system must satisfy (environment, data setup, steps, expected observable result). Each item should map to AC where possible.
   - **UAT Conditions** — user-facing acceptance checks (business scenarios, roles, success criteria from the user’s perspective). Each item should map to AC where possible.
4. Write `docs/requirements/REQ-<NNNNNN>-<slug>-spec.md`.
5. If blocking open questions remain → list them and **stop**; do not invent AC / System Test / UAT.
6. **Mandatory self-review (before asking the user):** compare the new spec against **all** collected content above. Check for gaps, contradictions, missing AC/System Test/UAT, scope drift, and design/spec mismatches. Summarize findings briefly (pass / issues found).
7. **Mandatory stop — user review:** present the spec path + self-review summary; ask the user to verify and whether any adjustments are needed. **Do not** continue to plan / develop / later phases.
8. **If the user requests changes:** update the spec **and** any related prior docs already created for this REQ (raw / discovery / analysis / design / ADR as needed) so they stay consistent. Re-run self-review, then stop again for confirmation.
9. **Continue only after** the user confirms with `APPROVED` (or clear equivalent agreement). Then hand off to Planning / next PM step.

**File body: Vietnamese.**

## Suggested sections
Metadata, Goal, Context, Current/Expected Behavior, Business Rules, Flow, I/O, Modules, Data/API/Config impact, Edge Cases, Acceptance Criteria (Given/When/Then), **System Test Conditions**, **UAT Conditions**, Out of Scope, Open Questions.

## Directives
- Spec is incomplete without System Test Conditions and UAT Conditions.
- After every new or revised spec: **always** self-review + stop for user review. Applies to **all** risk levels (low / medium / high).
- `APPROVED` → continue pipeline.
- `REJECTED` → stop; ask whether to re-analyze from scratch (y/n) per `AGENTS.md`.
- `RE-EXECUTE` → refine the current spec (and related docs) in place; then self-review and stop again.
