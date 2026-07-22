---
name: project-manager
description: Orchestrate the 3A-Factory pipeline from a natural-language requirement — triage → (grill-me) → analyze → ADR? → design → spec → (user APPROVED) → Planning? → develop → review → qa. Never auto-deploy.
disable-model-invocation: false
argument-hint: [requirement text or REQ-<NNNNNN>-<slug>]
---

# Project Manager

## Goal
Turn a requirement into an auto-run pipeline through QA Pass, then **stop** and wait for the user to call `/deploy`.

All artifacts share id `REQ-<NNNNNN>-<slug>` (see `AGENTS.md`). Branch when needed: `feature/REQ-<NNNNNN>-<slug>`.

If the repo lacks standard `docs/` → stop and recommend `/onboarding` first.

**Generated docs under `docs/` must be Vietnamese.**

## Sequence (stop after QA — no deploy)
1. **triage** — create `…/REQ-<NNNNNN>-<slug>-raw.md`. If too vague → **grill-me**.
2. **grill-me** (if needed) — clarify until clear or user says “execute now”; write `…-discovery.md`; **do not** ask “run the pipeline?”; continue.
3. **analyze** — `…-analysis.md` + risk level. If heavy architecture review is needed → stop for confirmation.
4. **ADR** (optional) — `ADR-<NNNNNN>-<slug>.md` for major architecture decisions.
5. **design** — How → `…-design.md` (must include minimum file/module scope).
6. **spec** — What → `…-spec.md` (testable AC). Then **mandatory self-review** against prior artifacts + **stop for user review**. Ask if adjustments are needed; if yes → update spec and related prior docs, then stop again. Open blocking questions → stop and ask.
7. **Wait for `APPROVED`** on the spec (all risk levels) before continuing.
8. **plan** — required if risk is **high**; optional for low/medium when design already has order/files → `…-plan.md`.
9. **develop** — if high risk: wait for `APPROVED` before editing source (separate from spec approval). Boundary: plan (if any) or design.
10. **review** — `…-review.md`; auto-fix ≤ 2 rounds if needed.
11. **qa** — `…-qa.md`; Fail → fix ≤ 2 rounds. Pass → **STOP**, tell user to manually verify then `/deploy <env>` + `APPROVED`.

## Progress reporting
After each step: one short progress line (e.g. “Created REQ-000013-login-throttle, running analyze…”).

## Mandatory stops
- Missing critical information; security / breaking change without a plan; user says stop.
- **After spec** (always): self-review + user review; continue only on `APPROVED`.
- After QA (always).
- Before develop when risk is high and `APPROVED` is missing.

## Do not
- Do not call `deploy`.
- Do not invent role-based subagents — call phase skills only.
- Do not rename legacy REQ/ADR files.
- Do not start plan / develop before the user approves the spec.
