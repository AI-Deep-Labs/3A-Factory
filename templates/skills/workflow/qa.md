---
name: qa
description: Pipeline QA — write unit tests (…-UT.md), run them, verify System Test + UAT from spec, auto-fix until all Pass, then stop for user review. Also write …-qa.md.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# QA Testing (pipeline)

## Goal
Prove the implementation matches the **approved** spec: unit tests + System Test conditions + UAT conditions all **Pass** with real evidence. Then **stop for user review** (do not deploy).

## Preconditions
- `docs/requirements/REQ-<NNNNNN>-<slug>-spec.md` exists and was user-`APPROVED`.
- Spec must contain **Acceptance Criteria**, **System Test Conditions**, and **UAT Conditions**.
- Develop (+ review) already ran.

## Required outputs
1. `docs/qa/REQ-<NNNNNN>-<slug>-UT.md` — unit-test plan + mapping + results (**Vietnamese** body).
2. Unit-test **source files** in the project’s normal test locations (Jest/pytest/xUnit/… — follow existing project conventions).
3. `docs/qa/REQ-<NNNNNN>-<slug>-qa.md` — QA report covering System Test + UAT + overall conclusion (**Vietnamese** body).

## Steps
1. Read the approved spec; extract AC, **System Test Conditions**, and **UAT Conditions**. If any of these sections are missing/empty → **stop** and ask to update the spec (do not invent criteria).
2. **Author unit tests** covering the change; prefer automated tests in the repo. Document each case in `…-UT.md` (id, target, scenario, expected, linked AC/System/UAT ids, result).
3. **Run** the project’s unit-test / build-test commands; record real stdout/stderr and exit codes — **do not guess**.
4. **Evaluate System Test Conditions** from the spec (automated where possible; else concrete steps with observed evidence). Record Pass/Fail in `…-qa.md`.
5. **Evaluate UAT Conditions** from the spec the same way. Record Pass/Fail in `…-qa.md`.
6. **Auto-fix loop (mandatory):** while any unit test, System Test, or UAT condition is Fail / blocked / untested:
   - Fix application code and/or tests within plan/design scope.
   - Re-run unit tests and re-check System Test + UAT.
   - Update `…-UT.md` and `…-qa.md` each round.
   - Continue until **all** criteria are **Pass** and evidence matches the spec — **no fixed round cap**.
   - If blocked (missing secrets/env, no runnable test harness, out-of-scope infra) → stop, explain the blocker, and ask the user; do not mark Pass.
7. When everything Passes: finalize both `…-UT.md` and `…-qa.md` with conclusion **Ready for user review**.
8. **Stop for user review** — present UT + QA paths and a short Pass summary. Ask the user to verify. Remind that `/deploy` is separate and still needs `APPROVED`. Do **not** call deploy.

## Rules
- Do not mark Pass / Ready for user review if any AC-linked System Test or UAT row is Fail, skipped, or untested.
- Unit tests must be real executable tests when the project has a test framework; if none exists, propose a minimal harness **or** document why and use the closest runnable verification — still record evidence.
- Stay within develop boundaries (plan/design file scope) when fixing.
- Conversational issue filing → skill **`qa-issues`**, not this skill.
