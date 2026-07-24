# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0-rc.5] - Unreleased

Pre-release (release candidate) of the 3.0.0 greenfield Feature-local Spec Package line. Final GA will be `3.0.0` after RC validation.

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

See git history for 2.x releases. 2.x workflow is **not** supported in the 3.0.0 line (including `3.0.0-rc.5`).
