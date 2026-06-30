---
name: spec
description: Create or update a formal technical specification from clarified requirements. Use after ASK is complete or when the user invokes /spec.
disable-model-invocation: true
argument-hint: "[short-name or requirement]"
---

# SPEC Skill

## Gate
Do not modify application source code. You may create or update `.agents/specs/SPEC-[short-name].md` only.

## Inputs
- User requirement and ASK answers.
- Existing requirement file if available in `.agents/requirements/`.
- Template: `.agents/templates/SPEC-template.md`.

## Process
1. Choose a kebab-case `[short-name]`.
2. Inspect existing docs if they affect the behavior.
3. Create or update `.agents/specs/SPEC-[short-name].md`.
4. Include Mermaid only when it clarifies flow/state.
5. Keep open questions explicit; do not silently invent high-risk rules.

## Required sections
1. Metadata
2. Goal
3. Background / Context
4. Current Behavior
5. Expected Behavior
6. Business Rules
7. System Flow
8. Input / Output Contract
9. Affected Modules
10. Data / API / Config Impact
11. Edge Cases
12. Acceptance Criteria
13. Out of Scope
14. Open Questions
15. Approval

## Final prompt
Ask: "Do you approve this SPEC?
- Reply **APPROVED** (case-insensitive) to continue to implementation planning.
- Reply **REJECTED** (case-insensitive) to reject. I will stop and ask if you want a complete re-analysis (yes/no).
- Reply **RE-EXECUTE** (case-insensitive, also accepts `re-excute`) to refine and improve the current spec. I will edit the existing SPEC file directly instead of creating a new one, and ask clarifying questions if needed."
