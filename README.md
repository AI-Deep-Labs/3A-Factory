# 3a-factory

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)](package.json)

AI agent workflow template for **Claude Code**, **Gemini CLI**, and **Cursor**.
## Pipeline

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
├── misc/
│   ├── compact/    # HANDOFF-*.md
│   └── issues/     # ISSUE-*.md
└── project_overview.md   # from /onboarding
```

Shared id with branch: `feature/REQ-<NNNNNN>-<slug>` (6-digit zero-padded; legacy unpadded/slug-less files still count when allocating the next number).

## Install

Shared files always install (`docs/`, `AGENTS.md`, `WORKFLOW.md`, `.agents/…`).  
Agent adapters install **only for the agent(s) you select**.

### By agent (recommended)

```bash
# Claude Code only
npx 3a-factory --agent=claude

# Gemini CLI only
npx 3a-factory --agent=gemini

# Cursor only
npx 3a-factory --agent=cursor

# Multiple
npx 3a-factory --agent=claude,cursor --force

# Flags form
npx 3a-factory --claude
npx 3a-factory --claude --force
```

Env (handy for npm scripts / CI):

```bash
THREEA_AGENT=claude npx 3a-factory --force
# or
npm_config_3a_agent=gemini npx 3a-factory --force
```

Default with **no** `--agent` flag: install **all** agents (backward compatible).

### NPM dependency

```bash
npm install --save-dev 3a-factory
# postinstall defaults to all agents; re-run selectively:
npx 3a-factory --agent=cursor --force
```

### Scripts
- Windows: `powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1 --agent=claude`
- macOS/Linux: `bash ./scripts/install.sh --agent=gemini`

Use `--force` to overwrite (creates `.bak.*` unless `--no-backup`).  
`npx 3a-factory --help` lists all options.

### What each agent gets

| Selection | Extra paths |
|---|---|
| shared (always) | `docs/*` (incl. `misc/compact`, `misc/issues`), `AGENTS.md`, `WORKFLOW.md`, `.agents/templates` |
| `claude` | `CLAUDE.md`, `.claude/skills`, `.claude/commands` |
| `gemini` | `GEMINI.md`, `.gemini/skills`, `.gemini/commands` |
| `cursor` | `.cursor/skills`, `.cursor/rules/ai-workflow.mdc` |
## Onboarding one repo
From the target repo, install the template then run **`/onboarding`**: scaffold `docs/`, fill `CLAUDE.md` / `GEMINI.md` / `AGENTS.md` context, explore the codebase, write `docs/project_overview.md`. Create nothing outside the current repo.

## Breaking changes
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

Installer emits **agent-native** skill paths only:
- Claude → `.claude/skills/<name>/` + `.claude/commands/`
- Gemini → `.gemini/skills/<name>/` + `.gemini/commands/`
- Cursor → `.cursor/skills/<name>/` (slash commands) + `.cursor/rules/ai-workflow.mdc`

## Internal docs
Read `AGENTS.md` and `WORKFLOW.md` after install.

## License
MIT — see [LICENSE](LICENSE).
