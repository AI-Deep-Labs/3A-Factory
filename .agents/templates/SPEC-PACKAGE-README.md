# Spec Package Templates (greenfield)

Canonical templates for Feature-local Spec Package  
(`ADR-000001-adopt-feature-local-spec-package`).

## What is a Spec Package?

A **Spec Package** is the linked, traceable set of artifacts for **one** feature under:

```text
docs/tasks/REQ-<NNNNNN>-<slug>/
```

Spec is a **package**, not a single document.

Contract: `.agents/contracts/spec-package.md`
Manifest schema: `.agents/schemas/spec-package-manifest.schema.json`

## Template files

| File | Role |
|---|---|
| `SPEC-PACKAGE-README.md` | This guide |
| `SPEC-PACKAGE-MANIFEST-template.yaml` | `manifest.yaml` seed |
| `REQUIREMENTS-template.md` | Business Truth |
| `TASKS-template.md` | Execution Truth |
| `ACCEPTANCE-template.md` | Verification Truth |
| `SPEC-REVIEW-template.md` | Package validation record |
| `IMPLEMENTATION-EVIDENCE-template.md` | Develop evidence |
| `CODE-REVIEW-template.md` | Review evidence |
| `QA-SUMMARY-template.md` | QA summary |
| `CONVERGE-REPORT-template.md` | Converge report |

Also: `RAW-REQ`, `DISCOVERY`, `ANALYSIS`, `DESIGN`, `ADR`, `RELEASE` templates.

## Greenfield policy

- No legacy SPEC/PLAN templates.
- No `/plan` command.
- No migration tooling.
- Installer does not create `docs/tasks/`.

## Artifact creation order

```text
raw → discovery (if needed) → analysis
→ requirements → ADR (if needed) → design → tasks → acceptance
→ spec-review → APPROVED_SPEC_PACKAGE
→ develop/review loop → qa → converge → APPROVED_USER_REVIEW → done
```

## Approvals

```text
APPROVED_SPEC_PACKAGE
APPROVED_DEVELOP
APPROVED_USER_REVIEW
APPROVED_DEPLOY
```
