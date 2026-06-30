---
name: qa
description: Interactive QA session where user reports bugs or issues conversationally, and the agent files local ISSUE markdown documents. Explores the codebase in the background for context and domain language. Use when user wants to report bugs, do QA, file issues conversationally, or mentions "QA session".
---

# QA Session Skill

## Gate
None. Active utility skill to transform the AI into a QA Lead + Product Analyst.

## Process
For each issue the user raises:

### 1. Listen and Lightly Clarify
Let the user describe the problem in their own words. Ask **at most 2-3 short clarifying questions** focused on:
- What they expected vs what actually happened.
- Steps to reproduce (if not obvious).
- Whether it's consistent or intermittent.

Do NOT over-interview. If the description is clear enough to document, move on.

### 2. Explore the Codebase in the Background
Explore the codebase to understand the relevant area. The goal is NOT to find a fix — it's to:
- Learn the domain language used in that area (check existing code).
- Understand what the feature is supposed to do.
- Identify the user-facing behavior boundary.

This context helps you write a better issue — but the issue itself should NOT reference specific files, line numbers, or internal implementation details.

### 3. Assess Scope: Single Issue or Breakdown?
Before documenting, decide whether this is a **single issue** or needs to be **broken down** into multiple issues.

Break down when:
- The fix spans multiple independent areas (e.g., "the form validation is wrong AND the success message is missing AND the redirect is broken").
- There are clearly separable concerns that different people could work on in parallel.
- The user describes something that has multiple distinct failure modes or symptoms.

Keep as a single issue when:
- It's one behavior that's wrong in one place.
- The symptoms are all caused by the same root behavior.

### 4. File the Issue Document
Create a Markdown file under `.agents/issues/` directory in the current project workspace.
- Format the filename: `.agents/issues/ISSUE-[short-name].md` (e.g., `.agents/issues/ISSUE-login-validation.md`).

#### For a Single Issue
Use this template:

```markdown
# ISSUE: [Issue Title]

## What happened
[Describe the actual behavior the user experienced, in plain language]

## What I expected
[Describe the expected behavior]

## Steps to reproduce
1. [Concrete, numbered steps a developer can follow]
2. [Use domain terms from the codebase, not internal module names]
3. [Include relevant inputs, flags, or configuration]

## Additional context
[Any extra observations from the user or from codebase exploration that help frame the issue]
```

#### For a Breakdown (Multiple Issues)
Create a parent tracking issue document (e.g., `ISSUE-[parent-short-name].md`) and link to child sub-issues.
For each sub-issue, create its own file `ISSUE-[sub-short-name].md` using this template:

```markdown
# ISSUE: [Sub-Issue Title]

## Parent issue
[Link to parent issue path] (e.g. `[ISSUE-parent.md](file:///.agents/issues/ISSUE-parent.md)`)

## What's wrong
[Describe this specific behavior problem — just this slice, not the whole report]

## What I expected
[Expected behavior for this specific slice]

## Steps to reproduce
1. [Steps specific to THIS issue]

## Blocked by
- [Link to blocking issue path] (e.g., `[ISSUE-blocker.md](file:///.agents/issues/ISSUE-blocker.md)`) or "None - can start immediately"

## Additional context
[Any extra observations relevant to this slice]
```

### 5. Continue the Session
Print the created file paths (with blocking relationships summarized) and ask: "Next issue, or are we done?"
Keep going until the user says they're done.
