---
name: design
description: Solution design (How) for REQ-<NNNNNN>-<slug> — write docs/designs/…-design.md. Runs after analyze, before spec.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# Design (How)

## Gate
Do not modify application source code. Do not replace SPEC (What).

## Phase question
**How will we build it?** → solution design.

## Preconditions
`docs/designs/REQ-<NNNNNN>-<slug>-analysis.md` exists. Optional ADR handled if needed.

## Steps
1. Read analysis (+ ADR if any) and discovery/raw.
2. Describe the approach: modules, flows, API/DB/config (if touched), alternatives considered.
3. **Required:** minimum file/module scope that will change (so develop/Planning can follow).
4. Short risks & rollback (refer to analysis).
5. Write `docs/designs/REQ-<NNNNNN>-<slug>-design.md` (DESIGN template).

**File body: Vietnamese.**

## Output
`…-design.md` sufficient to write SPEC (What) and optional Planning.
