# Release Checklist — 3.2.1

## Architecture

- [x] ADR `adopt-feature-local-spec-package` Accepted
- [x] Contract consistent với schema + skills
- [x] Schema valid (`schema_version: 1`)
- [x] No active legacy references (`/plan`, SPEC/PLAN templates, migration)
- [x] Auto-intake Intent gate documented (`AGENTS.md` + PM skill)
- [x] `agent-mode.md` scoped (When apply / do NOT apply)

## Skills

- [x] Producer skills complete
- [x] Execution skills complete
- [x] `project-manager` allows model invocation; step skills keep `disable-model-invocation: true`
- [x] No `/plan`
- [x] No migration skill

## Build

- [x] `npm run build` reproducible
- [x] Build manifest valid
- [x] Required artifacts bundled
- [x] Orphan templates removed from tree

## Installer

- [x] Claude passed
- [x] Gemini passed
- [x] Cursor passed
- [x] Idempotent
- [x] Backup tested
- [x] No workflow side effects (no `docs/tasks/` create)

## Validation

- [x] Manifest schema
- [x] Package layout
- [x] Traceability
- [x] Skills
- [x] Templates
- [x] Governance (Intent gate + scoped agent-mode)
- [x] Adapter parity
- [x] Build output
- [x] State / greenfield checks

## Tests

- [x] Unit (`npm test`)
- [x] Installer (`npm run test:installer`)
- [x] Workflow regression (`npm run test:workflow`)
- [x] Security/path tests covered in suite

## Documentation

- [x] README (badge 3.2.1 + Quick Start Intent gate)
- [x] Architecture
- [x] Workflow
- [x] Commands
- [x] Approvals
- [x] Breaking changes (no new break in 3.2.1)
- [x] Changelog (`[3.2.1] - 2026-07-30`)
- [x] Release notes `release-notes/3.2.1.md`
- [x] Example package
- [x] Stale `templates/.agents/` path strings cleaned

## Release Safety

- [x] Version `3.2.1`
- [x] Publish content correct (`npm pack --dry-run`)
- [x] No secrets in bundle
- [x] No local `docs/tasks/` in package
- [x] No test fixtures in runtime bundle
- [x] No accidental publish/tag/push from automation

## Sign-off

| Check | Result | Date | Reviewer |
| --- | --- | --- | --- |
| Final e2e report | | | |
| Final repository review | | | |
| Verdict | | | |
