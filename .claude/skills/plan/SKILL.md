---
name: plan
description: Build a grounded implementation plan by reading the approved SPEC and inspecting the codebase. Use after SPEC approval or when the user invokes /plan.
disable-model-invocation: true
argument-hint: "[short-name]"
---

# PLAN Skill

## Gate
Do not modify application source code. You may create or update `.agents/plans/PLAN-[short-name].md` only.

## Inputs
- Approved `.agents/specs/SPEC-[short-name].md`.
- Template: `.agents/templates/PLAN-template.md`.
- Actual codebase files inspected with read/search tools.

## Process
1. Match `[short-name]` with the SPEC.
2. Read the relevant code before planning.
3. List every file expected to change. This list becomes the CODE boundary.
4. Explicitly call out Data/API/Config impact.
5. Include automated, manual, and regression tests.
6. Include rollback instructions.

## Required sections
1. Metadata
2. Scope
3. Files Inspected
4. Files Expected To Change
5. Current Architecture Understanding
6. Design Approach
7. Step-by-step Implementation
8. Data Model Changes
9. API Changes
10. Config Changes
11. Test Plan
12. Risks & Mitigations
13. Rollback Plan
14. Code Approval

## Final prompt
Ask: "Do you approve coding?
- Reply **APPROVED** (case-insensitive) to start implementation.
- Reply **REJECTED** (case-insensitive) to reject. I will stop and ask if you want a complete re-analysis (yes/no).
- Reply **RE-EXECUTE** (case-insensitive, also accepts `re-excute`) to refine and improve the current plan. I will edit the existing PLAN file directly instead of creating a new one, and ask clarifying questions if needed."
