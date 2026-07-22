---
name: qa
description: Pipeline QA testing — map AC, run/guide build-test, write docs/qa/REQ-<NNNNNN>-<slug>-qa.md. Fail → fix ≤2 rounds. Pass → stop for deploy.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# QA Testing (pipeline)

## Goal
Every acceptance criterion in the spec is tested with Pass/Fail evidence.

## Preconditions
`docs/requirements/REQ-<NNNNNN>-<slug>-spec.md` has AC (Given/When/Then). Develop + review already ran.

## Steps
1. Map each AC → test case (automated if framework exists; else concrete manual checklist).
2. Run build/test with project commands; record real results — do not guess.
3. Write `docs/qa/REQ-<NNNNNN>-<slug>-qa.md` (QA-REPORT template) — **Vietnamese** body.
4. **Fail** → fix code, max **2** rounds, then QA again. After rounds exhausted → stop and report.
5. **Pass / Ready for release** → stop the pipeline; remind the user to manually verify then `/deploy` + `APPROVED`.

## Rules
Do not mark “Ready for release” if any AC is Fail or untested.

## Note
Conversational issue filing → skill **`qa-issues`**, not this skill.
