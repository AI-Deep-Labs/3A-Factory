---
name: analyze
description: Impact and risk analysis for REQ-<NNNNNN>-<slug>; write docs/designs/…-analysis.md. Required before design in the pipeline.
disable-model-invocation: false
argument-hint: [REQ-<NNNNNN>-<slug>]
---

# Analyze (Impact & Risk)

## Gate
Do not modify application source code.

## Preconditions
`docs/requirements/REQ-<NNNNNN>-<slug>-raw.md` and/or `…-discovery.md` exist (or matching legacy files for the same REQ number).

## Risk rubric
- **High** if any: shared public API/contract change; DB schema change with real data; auth/authorization change; production deploy/infra change; (multi-repo) ≥3 repos or shared-library breaking change.
- **Medium**: change existing logic not in the high set.
- **Low**: localized addition; no contract/schema/auth/deploy.
- Payment/order is **not** automatically high.

## Steps
1. Read raw (+ discovery if any); survey related code.
2. Identify impacted modules/repos, change type, risk level, suggested rollout order, rough effort (S/M/L).
3. Write `docs/designs/REQ-<NNNNNN>-<slug>-analysis.md` (ANALYSIS template). Keep triage id/slug.
4. If high risk or very large scope → mark that confirmation may be needed before design (PM will stop if needed).

**File body: Vietnamese.**

## Output
Analysis file + explicit risk level (low|medium|high).
