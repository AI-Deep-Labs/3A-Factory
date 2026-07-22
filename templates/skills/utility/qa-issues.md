---
name: qa-issues
description: Conversational QA session — file ISSUE markdown under .agents/issues. Utility outside the pipeline (does not replace qa-testing).
disable-model-invocation: false
argument-hint: [bug description]
---

# QA Issues (utility)

## Gate
Does not replace pipeline `qa`. Use when the user wants conversational issue filing.

## Process
1. Listen; ask at most 2–3 questions (expected vs actual, repro steps, frequency).
2. Explore the codebase for domain language — **do not** put paths/line numbers in the issue body.
3. One issue or split into multiple ISSUE files if independent.
4. Write `.agents/issues/ISSUE-[short-name].md`.

### Single-issue template
```markdown
# ISSUE: [Title]
## What happened
## What I expected
## Steps to reproduce
1. ...
## Additional context
```

### Child template (breakdown)
Add Parent issue, Blocked by.

5. Ask: “Next issue, or are we done?”

Prefer **Vietnamese** for issue bodies when the user works in Vietnamese.
