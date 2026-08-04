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

Gate IDs (internal; recorded in `manifest.yaml`):

```text
APPROVED_SPEC_PACKAGE
APPROVED_DEVELOP
APPROVED_USER_REVIEW
APPROVED_DEPLOY
```

Users **do not** need to type these tokens. At each active gate, ask a **confirmation question**; accept yes/no, có/không, đồng ý/từ chối, or equivalent natural language. Exact tokens remain valid for power users. See contract § **5.4.1** and `.agents/templates/APPROVAL-CONFIRMATION-template.md`.

Do not reuse one approval for another gate. Never auto-deploy. Never auto-approve.

## Auto-intake

In an **onboarded repo**, natural-language **lifecycle** requests can start the pipeline without a slash command. Hub rule: call `project-manager` only when Intent matches below; otherwise answer normally. Full Intent gate lives in `.agents/skills/project-manager/SKILL.md` § Auto-intake entry.

### Onboarded repo markers (all required)

- `AGENTS.md`
- `.agents/contracts/spec-package.md`
- `docs/` (directory)

If any marker is missing → `ONBOARDING_REQUIRED` → read `.agents/skills/onboarding/SKILL.md`; do **not** run the REQ pipeline.

### Intent gate (before opening PM)

| Call PM when | Do **not** call PM when |
|---|---|
| Feature / bug / change / enhancement | Pure Q&A, code explanation, ad-hoc review unrelated to a REQ |
| Continue an existing REQ / `docs/tasks/…` path | Meta questions about tooling (unless user asks to run the workflow) |
| Approval reply at an **active** gate (yes/no, có/không, `APPROVED_*`) | User already invoked a step slash (`/triage`, `/develop`, `/qa`, `/deploy`, `/qa-issues`, …) — that skill owns the turn |
| | User asks to bypass the workflow |
| | Ambiguous → ask one yes/no (open Spec Package vs answer only); do not triage until they choose workflow |

### After routing (Intent matched)

1. Read `.agents/rules/agent-mode.md` (applicable — see that file’s scope)
2. Read and execute `.agents/skills/project-manager/SKILL.md` with the user message as input
3. PM selects the child skill per routing table + `manifest.yaml`
4. After each child skill, **return to PM** until a PM stop condition
5. Slash commands remain available as manual overrides

### `/project-manager` (mandatory workflow mode)

Invoking **`/project-manager`** binds **Project Manager mode** for the session: read `.agents/rules/agent-mode.md`, then **fully execute** `.agents/skills/project-manager/SKILL.md` including § **Slash invocation (mandatory)**. Follow Session orchestration and routing table; do not skip phases or implement outside child skills.

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
When the turn is lifecycle / continue-REQ / approval / `/project-manager` / already in PM mode, read and obey `.agents/rules/agent-mode.md` (see that file’s **When these rules apply**). Do **not** apply Spec Package-forcing constraints to pure Q&A, code explanation, meta tooling, bypass, or a non-PM step slash.

1. No application coding from a raw requirement.
2. Develop only when `validation.status == passed` and spec package approval is recorded (plus develop approval when high-risk policy requires it).
3. Develop follows `tasks.md` / `execution.current_task` and referenced design/acceptance.
4. Only `review` may mark a task `done`.
5. QA is acceptance-driven with max **3** auto-fix attempts.
6. Converge does not mark `done`; user confirms user review (natural language or token).
7. Deploy requires explicit command + deploy confirmation (natural language or token).

## Risk levels (analyze)

- **High**: shared public API/contract change; DB schema change with real data; auth/authorization change; production deploy/infra change; (multi-repo) ≥3 repos or shared-library breaking change.
- **Medium**: change existing logic not in the high set.
- **Low**: localized addition; no contract/schema/auth/deploy.
- Payment/order is **not** automatically high.

## Skills & Tool Mapping

- `.agents/skills/<name>/SKILL.md`: Workflow + utility skill bodies (21 skills)
- `.agents/commands/<name>.md`: Canonical slash commands (8 commands for entry points and utilities)

| Tool | Native files | Notes |
|---|---|---|
| Claude Code | `.claude/skills`, `.claude/commands`, `CLAUDE.md` | Skills + slash commands |
| Gemini CLI | `.gemini/commands/*.toml` → `.agents/skills`, `GEMINI.md` | Slash entry; single skill body |
| Cursor | `.cursor/rules/*.mdc` + `ai-workflow.mdc`; skill body in `.agents/skills` | Requestable rules; no `.cursor/skills` mirror |


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
