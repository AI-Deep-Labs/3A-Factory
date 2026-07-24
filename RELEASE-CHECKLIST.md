# Release Checklist — 3.0.0-rc.5

## Architecture

- [x] ADR `adopt-feature-local-spec-package` Accepted
- [x] Contract consistent với schema + skills
- [x] Schema valid (`schema_version: 1`)
- [x] No active legacy references (`/plan`, SPEC/PLAN templates, migration)

## Skills

- [x] Producer skills complete
- [x] Execution skills complete
- [x] No `/plan`
- [x] No migration skill

## Build

- [x] `npm run build` reproducible
- [x] Build manifest valid
- [x] Required artifacts bundled

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
- [x] Governance
- [x] Adapter parity
- [x] Build output
- [x] State / greenfield checks



## Tests

- [x] Unit (`npm test`)
- [x] Installer (`npm run test:installer`)
- [x] Workflow regression (`npm run test:workflow`)
- [x] Security/path tests covered in suite



## Documentation

- [x] README
- [x] Architecture
- [x] Workflow
- [x] Commands
- [x] Approvals
- [x] Breaking changes
- [x] Changelog (`[3.0.0-rc.5] - Unreleased` until RC publish date is set)
- [x] Release notes
- [x] Example package



## Release Safety

- [x] Version `3.0.0-rc.5`
- [x] Publish content correct (`npm pack --dry-run`)
- [x] No secrets in bundle
- [x] No local `docs/tasks/` in package
- [x] No test fixtures in runtime bundle
- [x] No accidental publish/tag/push from automation



## Sign-off


| Check                   | Result | Date | Reviewer |
| ----------------------- | ------ | ---- | -------- |
| Final e2e report        |        |      |          |
| Final repository review |        |      |          |
| Verdict                 |        |      |          |


