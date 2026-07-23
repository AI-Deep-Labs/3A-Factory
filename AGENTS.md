# 3A-Factory Agent Operating Rules

## Mission

Run an automated software-delivery pipeline for **Claude Code**, **Gemini**, and **Cursor** using a **greenfield Feature-local Spec Package** architecture (`ADR-000001-adopt-feature-local-spec-package`).

**Spec is a Feature-local Spec Package, not a single document.**

## Canonical path

```text
.specs/REQ-<NNNNNN>-<slug>/
```

## Canonical workflow

```text
triage
→ grill-me if unclear
→ analyze
→ build/refine Spec Package
    ├── requirements
    ├── ADR if needed
    ├── design
    ├── tasks
    └── acceptance
→ spec-review
→ APPROVED_SPEC_PACKAGE
→ project-manager
→ develop task-by-task
→ review per task
→ (repeat until all tasks done)
→ qa
→ bounded auto-fix loop (max 3)
→ converge
→ APPROVED_USER_REVIEW
→ done
→ deploy only with APPROVED_DEPLOY
```

## Artifact truth

```text
requirements.md = Business Truth
design.md       = Technical Truth
tasks.md        = Execution Truth
acceptance.md   = Verification Truth
manifest.yaml   = Package State Truth
```

Contract: `.agents/contracts/spec-package.md`  
Schema: `.agents/schemas/spec-package-manifest.schema.json`

## Approvals

```text
APPROVED_SPEC_PACKAGE
APPROVED_DEVELOP
APPROVED_USER_REVIEW
APPROVED_DEPLOY
```

Do not reuse one approval for another gate. Never auto-deploy.

## Greenfield policy

- New feature artifacts live only under `.specs/REQ-<NNNNNN>-<slug>/`.
- Project-wide ADR location: `docs/decisions/`.
- Global docs may include `docs/project_overview.md` and `docs/misc/*`.
- **No** legacy lifecycle folders for new work (`docs/requirements`, `docs/designs` feature files, `docs/reviews`, `docs/qa`).
- **No** `/plan` command.
- **No** migration tooling or legacy resolver.
- Installer never creates `.specs/` and never runs the workflow.

## Hard gates

1. No application coding from a raw requirement.
2. Develop only when `validation.status == passed` and `APPROVED_SPEC_PACKAGE` (plus `APPROVED_DEVELOP` when high-risk policy requires it).
3. Develop follows `tasks.md` / `execution.current_task` and referenced design/acceptance.
4. Only `review` may mark a task `done`.
5. QA is acceptance-driven with max **3** auto-fix attempts.
6. Converge does not mark `done`; user issues `APPROVED_USER_REVIEW`.
7. Deploy requires explicit command + `APPROVED_DEPLOY`.

## Risk levels (analyze)

- **High**: shared public API/contract change; DB schema change with real data; auth/authorization change; production deploy/infra change; (multi-repo) ≥3 repos or shared-library breaking change.
- **Medium**: change existing logic not in the high set.
- **Low**: localized addition; no contract/schema/auth/deploy.
- Payment/order is **not** automatically high.

## Skills

| Folder | Skills |
|---|---|
| `templates/skills/workflow/` | `project-manager`, `triage`, `grill-me`, `analyze`, `requirements`, `adr`, `design`, `tasks`, `acceptance`, `spec-review`, `spec`, `develop`, `review`, `qa`, `converge`, `deploy` |
| `templates/skills/utility/` | `onboarding`, `handoff`, `caveman`, `synthesize-design-doc`, `qa-issues` |

Runtime paths: Claude `.claude/skills`, Gemini `.gemini/skills`, Cursor `.cursor/skills` + `.cursor/rules/ai-workflow.mdc`.

## Language

- Skill/rule/template instructions: **English**.
- Generated artifact bodies (`.specs/`, docs content): **Vietnamese**; IDs/status tokens: **English**.
