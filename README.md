# 3a-factory

AI agent workflow template for **Claude Code**, **Gemini CLI**, and **Cursor**.

Instruction files in this package are **English**. Generated project artifacts under `docs/` must be **Vietnamese**.

## Pipeline (v1.1+)

```text
triage → (grill-me if unclear) → analyze → ADR? → design → spec → Planning? → develop → review → qa
```

Deploy is **separate**: `/deploy <env>` only after QA Pass and always requires **`APPROVED`**.

### Two entry points
- **`/project-manager "<requirement>"`** — auto-run the pipeline.
- **`/grill-me`** — deep clarification; when clear or user says “execute now” → write discovery and continue.

### Artifacts
Inside the target project:

```text
docs/
├── requirements/   # REQ-<NNNNNN>-<slug>-{raw,discovery,spec}.md
├── designs/        # …-analysis|design|plan.md ; ADR-<NNNNNN>-<slug>.md
├── reviews/
├── qa/
├── release-notes/
└── project_overview.md   # from /onboarding
```

Shared id with branch: `feature/REQ-<NNNNNN>-<slug>` (6-digit zero-padded; legacy unpadded/slug-less files still count when allocating the next number).

## Install

### NPM
```bash
npm install --save-dev 3a-factory
```

### npx
```bash
npx 3a-factory
```

### Scripts
- Windows: `powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1`
- macOS/Linux: `bash ./scripts/install.sh`

Use `--force` to overwrite (creates `.bak.*` unless `--no-backup`).

## Onboarding one repo
From the target repo, install the template then run **`/onboarding`**: scaffold `docs/`, fill `CLAUDE.md` / `GEMINI.md` / `AGENTS.md` context, explore the codebase, write `docs/project_overview.md`. Create nothing outside the current repo.

## Breaking changes (1.0.x → 1.1.0)
- Lifecycle artifacts move from `.agents/{specs,plans,...}` → `docs/...`.
- Phase order changes (design before spec); adds analyze / deploy / project-manager.
- `APPROVED` is not required for every SPEC/PLAN before develop — only for **high** risk (and every deploy).
- `/qa` = pipeline QA testing; conversational issue filing → `/qa-issues`.

## Skill layout (package source)
```text
templates/skills/
├── workflow/     # pipeline skills (triage → … → qa, plus project-manager)
└── utility/      # onboarding, handoff, caveman, synthesize-design-doc, qa-issues
```

Installer still generates flat runtime paths: `.agents/skills/<name>/`, `.claude/skills/<name>/`, etc.

## Internal docs
Read `AGENTS.md` and `WORKFLOW.md` after install.
