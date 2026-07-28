# 3A-Factory Agent Operating Rules

## Mission

Run an automated software-delivery pipeline for **Claude Code**, **Gemini**, and **Cursor** using a **greenfield Feature-local Spec Package** architecture (`ADR-000001-adopt-feature-local-spec-package`).

**Spec is a Feature-local Spec Package, not a single document.**

## Canonical path

```text
docs/tasks/REQ-<NNNNNN>-<slug>/
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

- New feature artifacts live only under `docs/tasks/REQ-<NNNNNN>-<slug>/`.
- Project-wide ADR location: `docs/decisions/` (create on first project-wide ADR write).
- Global docs may include `docs/project_overview.md` and `docs/misc/*` (create misc paths when handoff/qa-issues write).
- Installer scaffolds `docs/` only — not `docs/decisions` or `docs/misc`.
- **No** legacy lifecycle folders for new work (`docs/requirements`, `docs/designs` feature files, `docs/reviews`, `docs/qa`).
- **No** `/plan` command.
- **No** migration tooling or legacy resolver.
- Installer never creates `docs/tasks/` and never runs the workflow.

## Hard gates

**CRITICAL AGENT OVERRIDE**:
You MUST read and strictly obey all override rules defined in `.agents/rules/agent-mode.md` before taking any planning or execution actions.

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

Runtime paths: Claude `.claude/skills` + `.claude/commands`; Gemini `.gemini/commands` → `.agents/skills`; Cursor `.cursor/rules/*.mdc` + `ai-workflow.mdc` (skill body in `.agents/skills` only — no `.cursor/skills` / `.gemini/skills` mirrors).

## Language

- Skill/rule/template instructions: **English**.
- Generated artifact bodies (`docs/tasks/`, docs content): **Vietnamese**; IDs/status tokens: **English**.

## Naming & id allocation

### Formats

```text
Full id:     REQ-<NNNNNN>-<slug>     /  ADR-<NNNNNN>-<slug>
Folder:      docs/tasks/REQ-<NNNNNN>-<slug>/
Branch:      feature/REQ-<NNNNNN>-<slug>
manifest.id: REQ-<NNNNNN>            (digits only after prefix; no slug)
```

- `<NNNNNN>` = 6-digit zero-padded number.
- `<slug>` = 2–5 ASCII kebab-case words; fixed for the REQ lifetime.
- **REQ and ADR use separate number series.**
- **No allocator script** — the agent computes the next id itself.

### How the agent allocates

1. List **directory names** under `docs/tasks/` matching `REQ-*` (and, if present, legacy `.specs/REQ-*` / `docs/requirements/REQ-*` / `docs/designs/REQ-*` basenames).
2. Parse the numeric part after `REQ-`. Compute `next = max + 1`. If none exist → **`000001`**.
3. For ADR: list `ADR-*.md` under `docs/decisions/` and `docs/tasks/*/decisions/` (plus legacy `docs/designs/ADR-*.md` if present); same `next = max + 1` rule on the **ADR** series only.

**Never** take numbers from `.agents/`, skills, contracts, templates, README, or markdown body text. Illustrative examples in tooling always use `REQ-000001-…` / `ADR-000001-…` and are **not** real allocations. Do not rename existing ids.
