---
name: review
description: Review active changes against the approved SPEC and PLAN. Use for git diff audit, security review, business logic review, and release readiness.
disable-model-invocation: true
argument-hint: "[short-name or diff scope]"
---

# REVIEW Skill

## Gate
Read-only phase. Do not modify source code.

## Process
1. Inspect git status and git diff.
2. Compare implementation against SPEC acceptance criteria and PLAN scope.
3. Check correctness, business logic, security, performance, maintainability, and tests.
4. Save report under `.agents/reviews/REVIEW-[short-name].md` when possible.

## Output
1. **Summary**
2. **Correctness Issues**
3. **Business Logic Risks**
4. **Security Risks**
5. **Performance Risks**
6. **Maintainability**
7. **Test Coverage**
8. **Suggested Fixes**
9. **Release Checklist**

Use severity labels: Critical, High, Medium, Low, Nit.
