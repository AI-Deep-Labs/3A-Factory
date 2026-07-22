---
name: plan
description: Technical implementation plan (repo/module/file order). Required if high risk; optional if low/medium. Write docs/designs/REQ-<NNNNNN>-<slug>-plan.md.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# Planning (technical Who/When)

## Gate
Do not modify source code. Only create/update `docs/designs/REQ-<NNNNNN>-<slug>-plan.md`.

## Phase question
**Technical order?** — which repo/module/file first, dependencies, milestones. **Not** people assignment.

## When required
- Risk **high** (from analysis) → required.
- Low/medium → optional if design already lists files/order; if missing → create a plan.

## Inputs
- `…-spec.md`, `…-design.md`, `…-analysis.md` (same `REQ-<NNNNNN>-<slug>`)
- Template: `.agents/templates/PLAN-template.md`

## Process
1. Read spec/design/analysis + survey code.
2. List **Files Expected To Change** (develop boundary).
3. Data/API/Config impact, test plan, rollback.
4. Write `docs/designs/REQ-<NNNNNN>-<slug>-plan.md`.

**File body: Vietnamese.**

## Develop boundary
With plan → develop follows plan. Without plan → develop follows design.

## Directives
High risk: after plan, `APPROVED` is required before develop (enforced by develop skill / PM).  
`REJECTED` / `RE-EXECUTE` while awaiting approval.
