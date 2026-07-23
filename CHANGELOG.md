# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0-rc.2] - Unreleased

Pre-release (release candidate) of the 3.0.0 greenfield Feature-local Spec Package line. Final GA will be `3.0.0` after RC validation.

### Changed

- Package version set to **3.0.0-rc.2**.
- Installer no longer writes `.3a-factory/install-manifest.json` (report remains on stdout / `--json` only).
- Installer scaffolds `docs/` only; does not pre-create `docs/decisions` or `docs/misc` (skills create those paths when writing files).

### Fixed

- `npm test` on Linux CI: replace fragile `tests/**/*.test.js` glob with explicit test file list and `--test-concurrency=1`.

### Documentation

- README, architecture, onboarding/ADR/handoff/qa-issues skills, contract, and release notes updated for installer behavior and **3.0.0-rc.2**.

## [3.0.0-rc.1]

Initial release candidate of the 3.0.0 greenfield Feature-local Spec Package line.

### Added

- Feature-local Spec Package under `.specs/REQ-<NNNNNN>-<slug>/` with mandatory `manifest.yaml`.
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
- Migration tooling, legacy resolver, compatibility window.

### Fixed

- Documentation drift vs greenfield contract (Phase 6 audit).
- Traceability validator: duplicate ID check applies to heading definitions only (cross-references allowed); task cycle check uses Dependencies sections.
- Utility skills / QA-UT templates: remove active legacy `docs/requirements|designs` output paths.
- Build tests: serialize suite to avoid race when temporarily renaming a required skill.

### Security

- Path/symlink-safe build and installer; no workflow side effects on install; publish content excludes local packages and fixtures.

## [2.3.1] - Prior

See git history for 2.x releases. 2.x workflow is **not** supported in the 3.0.0 line (including `3.0.0-rc.2`).
