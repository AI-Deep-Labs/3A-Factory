# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2026-08-04

Enterprise Grade Sub-Agent Orchestration — transformed `project-manager` into a pure Supervisor that delegates to 6 distinct Sub-agents for complete context isolation and zero bias.

### Added

- **DevCrew Personas:** Created `.agents/agents/` containing 6 specialized personas (`business-analyst`, `architect`, `developer`, `reviewer`, `qa-engineer`, `release-manager`) acting as System Prompts.
- **Sub-Agent Registry:** Added `.agents/configs/subagents.json` to map personas to workflow skills (`inherit` model configuration).
- **Architecture Documentation:** Added `docs/architecture/v4-subagent-orchestration.md` detailing the new multi-agent design.

### Changed

- **Delegated Orchestration:** `project-manager` now operates as a pure Supervisor, utilizing `invoke_subagent` (or IDE role-play) to spawn isolated sub-agents rather than executing tasks monolithicly.
- **Manifest Mutator Restriction:** Sub-agents (`develop`, `review`, `qa`) are now strictly forbidden from mutating `manifest.yaml`. They only return pass/fail reports. `project-manager` is the sole state mutator.
- **Installer Automation:** Updated `install.js` and `build.js` to automatically bundle and scaffold the new `agents` and `configs` directories into target projects.
- Package version bumped to **4.0.0**.

### Notes

- Upgrade: `npx 3a-factory@4.0.0 --agent=<agent> --force`.
- Details: [release-notes/4.0.0.md](release-notes/4.0.0.md).

## [3.3.0] - 2026-08-04

Minor architectural cleanup — removed 13 redundant user-invoked slash commands and integrated `WORKFLOW.md` into primary Agent governance files.

### Changed

- **Removed Commands:** Deleted 13 redundant slash commands for internal workflow steps (`triage`, `analyze`, `spec`, `develop`, etc.) to clean up the user command interface. Only entry points and utility commands (`project-manager`, `deploy`, `onboarding`, `handoff`, `caveman`, `qa-issues`, `specification-synthesizer`, `grill-me`) remain.
- **Enabled Model Invocation:** Removed the `disable-model-invocation: true` flag from the 13 internal skills, allowing the AI agent to natively invoke these workflow steps as tools under `project-manager`.
- **Consolidated Governance:** Removed `.agents/WORKFLOW.md` and integrated its Tool Mapping section into `AGENTS.md` to reduce token overhead and provide a single source of truth.
- **Installer and Validation:** Updated build scripts, validation scripts, and tests to accommodate the removal of internal slash commands and `WORKFLOW.md`.
- Package version set to **3.3.0**.

### Notes

- Upgrade: `npx 3a-factory@3.3.0 --agent=<agent> --force`.
- Details: [release-notes/3.3.0.md](release-notes/3.3.0.md).

## [3.2.3] - 2026-08-03

Patch on the 3.2.0 GA line — significantly improved `specification-synthesizer` with strict declarative structure.

### Changed

- **Specification Synthesizer:** Refactored the prompt to use a highly structured, declarative architecture focusing on Mission, Execution Modes, Input/Output Contracts, Constraints (Anti-Hallucination, Traceability Rules), Error Handling, and Quality Gates.
- Package version set to **3.2.3**.

### Notes

- No breaking change to consumer runtime paths or Spec Package contract semantics.
- Upgrade: `npx 3a-factory@3.2.3 --agent=<agent> --force`.
- Details: [release-notes/3.2.3.md](release-notes/3.2.3.md).

## [3.2.2] - 2026-08-03

Patch on the 3.2.0 GA line — upgraded `synthesize-design-doc` to `specification-synthesizer` with declarative architecture.

### Changed

- **Specification Synthesizer:** Upgraded from `synthesize-design-doc` with a declarative architecture separating Conversation Synthesis (Mode 1) and Specification Consolidation (Mode 2) to prevent overwriting existing spec packages.
- All references updated in build scripts, documentation, and skill commands.
- Package version set to **3.2.2**.

### Notes

- No breaking change to consumer runtime paths or Spec Package contract semantics.
- Upgrade: `npx 3a-factory@3.2.2 --agent=<agent> --force`.
- Details: [release-notes/3.2.2.md](release-notes/3.2.2.md).

## [3.2.1] - 2026-07-30

Patch on the 3.2.0 GA line — auto-intake Intent gate, scoped `agent-mode`, PM model-invocation. Spec Package workflow unchanged.

### Changed

- **Auto-intake Intent gate:** call `project-manager` only for lifecycle / continue-REQ / active-gate approval; not for Q&A, code explanation, meta tooling, bypass, or an already-invoked step slash. Soft-confirm when ambiguous.
- **`project-manager` skill:** allow model invocation (removed `disable-model-invocation: true`); `description` includes AUTO-ACTIVATE / DO NOT activate + trigger examples (nowx-style).
- **`agent-mode.md`:** scoped **When these rules apply / do NOT apply** so Spec Package constraints no longer override pure Q&A.
- Hub blurbs aligned: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `ai-workflow`, `WORKFLOW.md`, onboarding Next, README Quick Start, `docs/*`.
- Validation and tests assert Intent gate, scoped agent-mode, and PM invocation flag.
- Package version set to **3.2.1**.

### Removed (library cleanup)

- Orphan templates not installed by the installer: `REVIEW-template.md`, `QA-REPORT-template.md`, `UT-REPORT-template.md`.
- One-off `docs/reports/` artifacts from the 3.0.0 GA review.
- Stale `templates/.agents/…` path strings → `.agents/…`.

### Notes

- No breaking change to consumer runtime paths or Spec Package contract semantics.
- Upgrade: `npx 3a-factory@3.2.1 --agent=<agent> --force`.
- Details: [release-notes/3.2.1.md](release-notes/3.2.1.md).

## [3.2.0] - 2026-07-29

General availability — consolidates the 3.1.0-rc line into a stable release.

### Added

- **Auto-intake:** onboarded repos accept natural-language requirements; agent executes `project-manager` and routes by `manifest.status` (`AGENTS.md` § Auto-intake).
- **Natural language approvals:** contract § 5.4.1 — confirmation questions at each gate; yes/no, có/không, or natural language (tokens optional).
- **`/project-manager` mandatory PM mode:** slash binds PM mode — full skill execution, session orchestration PM → child → PM, no phase skip.
- **Core Rules Hub:** `.agents/rules/agent-mode.md` with CRITICAL overrides (no internal planning mode, no hidden artifacts).

### Changed

- **Authoring layout:** removed `templates/` wrapper; skills, commands, contracts, rules, schemas, document templates, and `WORKFLOW.md` live under `.agents/` as the single source tree.
- **Slash commands embed full body:** Claude / Gemini / Cursor receive complete command content from `.agents/commands/<name>.md` — commands are source of truth and can be customized independently of skills.
- **Onboarding:** only creates/updates the agent context file for the **current agent** (Claude → `CLAUDE.md`, Gemini → `GEMINI.md`, Cursor → rules only).
- Installer, build, validation, tests aligned for `.agents/` paths.
- Package version set to **3.2.0**.

### Notes

- Consumer runtime paths unchanged (`.agents/skills`, `.claude/commands`, `.gemini/commands`, `.cursor/rules`).
- Upgrade from 3.0.0 or 3.1.0-rc.x: `npx 3a-factory@3.2.0 --agent=<agent> --force`.

## [3.1.0-rc.4] - 2026-07-29

### Changed

- **Flatten authoring layout:** removed the `templates/` wrapper. Skills, commands, contracts, rules, schemas, document templates, and `WORKFLOW.md` now live under `.agents/` as the single source tree.
- **Slash commands embed full body:** Claude `.md` and Gemini `.toml` (like Cursor `.mdc`) receive the full command body from `.agents/commands/<name>.md` — no longer pointer-only “read SKILL.md” prompts. Commands and skills can be customized independently.
- Installer / build / validation / tests updated for `.agents/` paths; bundle keys use `.agents/skills/…`, `.agents/commands/…`, etc.
- Package version set to **3.1.0-rc.4**.

### Notes

- Consumer runtime paths unchanged (`.agents/skills`, `.claude/commands`, `.gemini/commands`, `.cursor/rules`).
- Upgrade: `npx 3a-factory@3.1.0-rc.4 --agent=<agent> --force`.

## [3.1.0-rc.3] - 2026-07-29

### Fixed

- **Onboarding skill:** only creates/updates the agent context file for the **current agent** (Claude → `CLAUDE.md`, Gemini → `GEMINI.md`, Cursor → rules only). Previously created all three regardless of which agent was running.
- Added § Agent detection to `.agents/skills/onboarding/SKILL.md` with explicit "Do not create" guards per agent.

### Changed

- Package version set to **3.1.0-rc.3**.

## [3.1.0-rc.2] - 2026-07-29

Pre-release candidate: **workflow UX (auto-intake, natural approvals, mandatory PM slash) + flat skills/commands + repo cleanup**.

### Added

- **Auto-intake:** onboarded repos accept natural-language requirements; agent executes `project-manager` and routes by `manifest.status` (`AGENTS.md` § Auto-intake).
- **Natural language approvals:** contract § 5.4.1 — confirmation questions at each gate; yes/no, có/không, or natural language (tokens optional). Template `APPROVAL-CONFIRMATION-template.md`.
- **`/project-manager` mandatory PM mode:** slash binds MANDATORY PM MODE — full skill execution, session orchestration PM → child → PM, no phase skip (`.agents/commands/project-manager.md`).

### Changed

- **Authoring layout:** `.agents/skills/<name>/SKILL.md` + canonical `.agents/commands/<name>.md` (flat).
- Installer: copy-only skills; agent command adapters (`scripts/install/command-adapters.js`) emit `.mdc` / `.md` / `.toml`.
- Removed legacy template trees and `templates/` wrapper directory; all authoring content now under `.agents/`.
- Build bundle **70 files** (was 48 in 3.1.0-rc.1).
- Package version set to **3.1.0-rc.2**.
- Docs, validation, tests aligned; `.gitignore` adds `.vs/`; repo cleanup (legacy dirs, one-shot migration script).

### Notes

- No breaking change to consumer runtime paths or Spec Package contract semantics.
- Upgrade: `npx 3a-factory@3.1.0-rc.2 --agent=<agent> --force`.

## [3.1.0-rc.1] - 2026-07-28

Pre-release candidate: **Core Rules Hub + Agent Pointers** (Phase 1) — centralize agent override constraints so all agents follow the established workflow instead of default internal planning modes.

### Added

- Shared rule hub: `.agents/rules/agent-mode.md` with CRITICAL overrides: disable built-in planning mode, forbid hidden scratch artifacts, enforce canonical `docs/tasks/REQ-*` workflow.
- Installer scaffolds `.agents/rules/` alongside existing shared `.agents/*` paths.
- Governance, adapter-parity, build-output, installer, and build tests assert hub presence and entry-point pointers.

### Changed

- Package version set to **3.1.0-rc.1**.
- Entry points (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `ai-workflow.mdc`) add **CRITICAL** pointers to `.agents/rules/agent-mode.md` before planning or execution actions.
- Build bundle includes `.agents/rules/agent-mode.md`.

### Notes

- Phase 1 scope only: agent override constraints. Canonical workflow docs, hard-gates consolidation, and approval gates SSOT are planned for Phase 2–3.

## [3.0.0] - 2026-07-27

First stable (GA) release of the greenfield **Feature-local Spec Package** line for Claude, Gemini, and Cursor.

### Added

- Feature-local Spec Package under `docs/tasks/REQ-<NNNNNN>-<slug>/` with mandatory `manifest.yaml`.
- Producer skills (`requirements`, `tasks`, `acceptance`, `spec-review`) and orchestrator `/spec`.
- Execution: task-by-task `develop`, review-owned completion, acceptance-driven `qa`, `converge`.
- Approval tokens: `APPROVED_SPEC_PACKAGE`, `APPROVED_DEVELOP`, `APPROVED_USER_REVIEW`, `APPROVED_DEPLOY`.
- Contract, JSON Schema, templates, validation suite, installer (dry-run / backup / idempotency), CI gates.
- Docs: architecture, workflow, commands, approvals; example Spec Package.

### Changed

- **Breaking:** Spec is a package, not a single document. Canonical path `docs/tasks/` (not `.specs/`).
- Multi-agent installer: Claude, Gemini, Cursor with shared `.agents/skills` body.

### Fixed

- Installer npm lifecycle no longer scaffolds all agents into consumer repo (`INSTALL_SKIPPED_LIFECYCLE`).
- REQ/ADR numbering: agent scans real `docs/tasks/` basenames only (`next = max + 1`; none → `000001`).

### Removed

- `/plan` skill; legacy SPEC/PLAN templates; migration tooling; 2.x workflow compatibility.

## [3.0.0-rc.6] - 2026-07-24

Final release candidate before GA.

### Changed

- Package version set to **3.0.0-rc.6**.
- Triage / ADR skills and AGENTS/WORKFLOW: agent allocates ids by listing real path basenames under `docs/tasks/` (and ADR folders), then `next = max + 1` (none → `000001`). REQ and ADR series are independent. **No allocator script.**
- Illustrative examples normalized to `REQ-000001-…` / `ADR-000001-…` (removed `REQ-000013` / `ADR-000005-example` from contracts, skills, README).

### Fixed

- First REQ in an empty consumer repo no longer jumps to `000014` when agents read example `REQ-000013` from installed contracts/skills.

### Documentation

- Naming & allocation rules documented in AGENTS.md, WORKFLOW.md, architecture docs, and **3.0.0-rc.6** release notes.

## [3.0.0-rc.5]

Pre-release candidate: installer npm lifecycle skip.

### Changed

- Package version set to **3.0.0-rc.5**.

### Fixed

- Installer no longer scaffolds a consumer project during npm `postinstall` / `install` / `preinstall` / `prepare`. Those lifecycles exit with `INSTALL_SKIPPED_LIFECYCLE` so `npx 3a-factory@… --agent=gemini` cannot accidentally install all three agents via default-all + `INIT_CWD`. Scaffolding runs only on explicit CLI/bin invocation.
- Added installer regression tests simulating the npx/postinstall flow.

### Documentation

- README, release notes, and help text updated for the lifecycle skip behavior and **3.0.0-rc.5**.

## [3.0.0-rc.4]

Pre-release candidate: canonical Spec Package path under `docs/tasks/`.

### Changed

- Package version set to **3.0.0-rc.4**.
- **Canonical Spec Package path:** `docs/tasks/REQ-<NNNNNN>-<slug>/` (replaces `.specs/`).

### Documentation

- Contract, skills, governance, validators, README, and release notes updated for `docs/tasks/` and **3.0.0-rc.4**.

## [3.0.0-rc.3]

Pre-release candidate with slim installer skill layout.

### Changed

- Package version set to **3.0.0-rc.3**.
- Installer slim skill layout: skill body only in `.agents/skills/`; Cursor `.cursor/rules/<skill>.mdc`; Gemini `.gemini/commands/*.toml` → `.agents/skills/` (no `.cursor/skills` / `.gemini/skills` mirrors).

## [3.0.0-rc.2]

Pre-release candidate with installer/CI hardening after rc.1.

### Changed

- Package version set to **3.0.0-rc.2**.
- Installer no longer writes `.3a-factory/install-manifest.json` (report remains on stdout / `--json` only).
- Installer scaffolds `docs/` only; does not pre-create `docs/decisions` or `docs/misc` (skills create those paths when writing files).
- Restored Cursor `.cursor/rules/<skill>.mdc` slash/Rules UX; Gemini commands point at `.agents/skills/`.

### Fixed

- `npm test` on Linux CI: replace fragile `tests/**/*.test.js` glob with explicit test file list and `--test-concurrency=1`.
- Skill frontmatter: quote `argument-hint` / `description` so YAML is valid (invalid hints previously caused Cursor to skip skills).

## [3.0.0-rc.1]

Initial release candidate of the 3.0.0 greenfield Feature-local Spec Package line.

### Added

- Feature-local Spec Package under `.specs/REQ-<NNNNNN>-<slug>/` with mandatory `manifest.yaml` (superseded by `docs/tasks/` from rc.4).
- Producer skills: `requirements`, `tasks`, `acceptance`, `spec-review`; orchestrator `/spec`.
- Execution: task-by-task `develop`, review-owned task completion, acceptance-driven `qa`, `converge`.
- Approval tokens: `APPROVED_SPEC_PACKAGE`, `APPROVED_DEVELOP`, `APPROVED_USER_REVIEW`, `APPROVED_DEPLOY`.
- Contract, JSON Schema, templates, evidence templates for package lifecycle.
- Build manifest, installer dry-run/backup/idempotency, validation suite, CI gates.
- Docs: architecture, workflow, commands, approvals; example Spec Package; release checklist.

### Changed

- Major architecture: Spec is a package, not a single document.
- Skills and governance rewritten for greenfield Feature-local Spec Package.

### Removed

- `/plan` skill and alias.
- Legacy SPEC and PLAN templates.
- Legacy feature outputs under `docs/requirements` / `docs/designs` (for feature packages).

### Security

- Path/symlink-safe build and installer; no workflow side effects on install; publish content excludes local packages and fixtures.

## [2.3.1] - Prior

See git history for 2.x releases. 2.x workflow is **not** supported in the 3.0.0 line.
