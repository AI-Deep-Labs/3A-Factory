---
name: code
description: Implement the approved plan, run build/tests, and report results. Use only after APPROVED confirmation (case-insensitive).
disable-model-invocation: true
argument-hint: "[short-name]"
---

# CODE Skill

## Hard gate
Stop unless the user has provided a case-insensitive `APPROVED` directive in the current task context.

## Required inputs
- Approved SPEC: `.agents/specs/SPEC-[short-name].md`
- Approved PLAN: `.agents/plans/PLAN-[short-name].md`

## Boundaries
- Modify only files listed in PLAN section **Files Expected To Change**.
- If a new file is required but not listed, stop and request plan update.
- Do not add dependencies, schema changes, public API changes, auth changes, payment/order logic changes, or deployment config changes unless explicitly present in SPEC and PLAN.

## Process
1. Re-read SPEC and PLAN.
2. Implement atomic changes in plan order.
3. Run formatting/lint if configured.
4. Run build command.
5. Run tests; if impossible, explain why and provide manual verification.
6. Save a run summary under `.agents/runs/` when possible.

## Output
1. **Files Changed**
2. **What Changed**
3. **Build/Test Result**
4. **How To Test**
5. **Risks**
6. **Remaining TODO**
