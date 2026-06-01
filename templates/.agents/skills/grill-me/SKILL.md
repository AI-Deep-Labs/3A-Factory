---
name: grill-me
description: Clarify raw requirements before any specification, planning, or coding. Use for new feature requests, bugs, vague changes, or business workflows that need analysis.
disable-model-invocation: false
---

# Grill-me Skill

## Gate
Do not modify source code. Do not produce an implementation plan. Do not create files unless the user explicitly asks to save the clarification.

## Process
1. **Restate the requirement**: Translate the raw request into clear business and technical language.
2. **Identify goals**: Outline the business goal and success signal.
3. **Codebase Exploration First**: Before formulating or asking any question, actively explore and search the codebase. If any question or detail can be answered, verified, or deduced by analyzing existing files, schemas, endpoints, or patterns in the workspace, do it locally instead of asking the user.
4. **Extract constraints**: Outline impacted users, data entities, system dependencies, and risk areas.
5. **Interactive Single-Question Loop**: Ask critical questions **one at a time**. Do not present multiple questions at once. Analyze the user's response to the previous question before presenting the next focus question.
6. **Iterate to Clarity**: Continue this interactive single-question loop until all core ambiguities, business requirements, and architectural gaps are completely resolved.
7. **Document assumptions**: State assumptions and edge cases clearly so that the `SPEC` phase can proceed smoothly once the user agrees.

## Output
For each iteration of the clarification process, present:
1. **Current Understanding**: Concise summary of what has been clarified so far.
2. **Business Goal**: The target goal of the feature or bug fix.
3. **Explored Codebase Findings**: Revelations from searching the codebase that help answer or narrow down the problem.
4. **Assumptions & Edge Cases**: Key assumptions being made to proceed.
5. **Current Focus Question**: Ask exactly **one** critical question to proceed further.
6. **Acceptance Direction**: Summary of what will define a successful SPEC phase once Q&A completes.
