---
name: review
description: Review diff against spec/design/plan; write docs/reviews/REQ-<NNNNNN>-<slug>-review.md. Auto-fix ≤2 rounds when needed (in pipeline).
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# REVIEW

## Gate
Default read-only while reviewing. In the pipeline, if “Needs fixes” → may edit code per checklist and re-review, max **2** rounds.

## Process
1. `git status` / `git diff` (or REQ-scoped diff).
2. Compare to AC in spec + design/plan scope.
3. Check correctness, business logic, security, performance, maintainability, tests.
4. Write `docs/reviews/REQ-<NNNNNN>-<slug>-review.md` (REVIEW template) — **Vietnamese** body.
5. Conclusion: Clean | Needs fixes. If needs fixes and rounds remain → fix → re-review. After 2 rounds → stop and report.

## Output sections
Summary, Correctness, Business Logic, Security, Performance, Maintainability, Test Coverage, Suggested Fixes, Release Checklist.

Severity: Critical, High, Medium, Low, Nit.
