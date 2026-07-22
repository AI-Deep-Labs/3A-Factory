---
name: develop
description: Implement per existing design/plan. High risk requires APPROVED before source changes. Boundary from plan or design. Suggested branch feature/REQ-<NNNNNN>-<slug>.
disable-model-invocation: true
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# Develop

## Hard gate
1. Required: `…-analysis.md`, `…-design.md`, `…-spec.md` (same `REQ-<NNNNNN>-<slug>`).
2. If risk is **high**: `…-plan.md` **and** `APPROVED` in the current context are required. Otherwise stop.
3. If risk is low/medium: `APPROVED` before develop is not required (unless in manual approval mode).

## Boundaries
- With plan → only edit **Files Expected To Change**.
- Without plan → only edit file/module scope in design.
- New file outside the list → stop; update design/plan first.
- Do not change public API / DB schema / auth / deploy config outside analyzed scope (and APPROVED if high risk).

## Git (recommended)
Branch: `feature/REQ-<NNNNNN>-<slug>` — same id as docs artifacts.

## Process
1. Read analysis (risk), design, spec, plan (if any).
2. Implement in plan/design order.
3. Lint/format if the project has them.
4. Build + test with project commands; if impossible → explain + manual steps.
5. Optionally write `docs/qa/REQ-<NNNNNN>-<slug>-run-YYYYMMDD-HHMM.md` (**Vietnamese** body).

## Output
Files Changed, What Changed, Build/Test Result, How To Test, Risks, Remaining TODO.
