# 3a-factory

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0.0--rc.4-blue.svg)](package.json)

**3A-Factory** là bộ workflow template cho AI agent (Claude Code, Gemini CLI, Cursor) nhằm vận hành vòng đời phát triển phần mềm theo kiến trúc **Feature-local Spec Package** (greenfield).

## Giới thiệu

- **Mục tiêu:** Chuẩn hóa cách agent thu thập yêu cầu, thiết kế, chia task, implement, review, QA và nghiệm thu — với traceability và approval rõ ràng.
- **Đối tượng:** Team dùng AI coding agents để giao hàng feature có kiểm soát.
- **Supported agents:** Claude Code, Gemini CLI, Cursor.
- **Kiến trúc:** Greenfield — không hỗ trợ legacy workflow / migration / `/plan`.

## Core Principle

```text
Spec is a Feature-local Spec Package, not a single document.
```

## Canonical Package Structure

```text
docs/tasks/
└── REQ-000013-sync-masterdata/
    ├── manifest.yaml
    ├── raw.md
    ├── discovery.md
    ├── analysis.md
    ├── requirements.md
    ├── design.md
    ├── tasks.md
    ├── acceptance.md
    ├── spec-review.md
    ├── decisions/
    ├── reviews/
    ├── qa/
    └── release/
```

Project-wide ADR: `docs/decisions/` (tạo khi `/adr` project-wide ghi file). Global misc: `docs/misc/` (tạo khi handoff / qa-issues ghi file). Overview: `docs/project_overview.md` (onboarding).

## Artifact Ownership

```text
requirements.md = Business Truth
design.md       = Technical Truth
tasks.md        = Execution Truth
acceptance.md   = Verification Truth
manifest.yaml   = Package State Truth
```

## Canonical Workflow

```text
triage
→ grill-me if unclear
→ analyze
→ build/refine Spec Package
→ spec-review
→ APPROVED_SPEC_PACKAGE
→ project-manager
→ develop task-by-task
→ review per task
→ repeat until all tasks done
→ qa
→ bounded repair loop (max 3)
→ converge
→ APPROVED_USER_REVIEW
→ done
→ deploy only with APPROVED_DEPLOY
```

## Quick Start

1. Cài tooling vào repo đích: `npx 3a-factory --agent=cursor` (hoặc `claude` / `gemini` / `all`).
2. Chạy `/onboarding` nếu repo mới.
3. `/triage` yêu cầu → tạo package dưới `docs/tasks/`.
4. `/grill-me` nếu còn ambiguity → `/analyze`.
5. `/spec` (orchestrator) hoàn thiện requirements → ADR? → design → tasks → acceptance → spec-review.
6. User: `APPROVED_SPEC_PACKAGE`.
7. `/project-manager` chọn task → `/develop` → `/review` (lặp đến hết task).
8. `/qa` → (repair loop nếu cần) → `/converge`.
9. User: `APPROVED_USER_REVIEW` → `done`.
10. Deploy chỉ khi user gọi `/deploy` + `APPROVED_DEPLOY`.

## Commands

```text
/triage
/grill-me
/analyze
/requirements
/adr
/design
/tasks
/acceptance
/spec-review
/spec
/project-manager
/develop
/review
/qa
/converge
/deploy
```

**Không có:** `/plan`, migration/resolver commands.

## Approval Tokens

| Token | Khi nào |
|---|---|
| `APPROVED_SPEC_PACKAGE` | Sau spec-review PASSED — bắt buộc trước Develop |
| `APPROVED_DEVELOP` | Khi high-risk policy yêu cầu |
| `APPROVED_USER_REVIEW` | Sau converge PASSED — chuyển `done` |
| `APPROVED_DEPLOY` | Trước mọi deploy — tách biệt user review |

Chi tiết: [docs/approvals.md](docs/approvals.md).

## Safety Guarantees

- Không code trước `APPROVED_SPEC_PACKAGE`.
- Không auto-approve / auto-deploy.
- Không commit/push mặc định.
- Installer không tạo feature package (`docs/tasks/`), không pre-create `docs/decisions` / `docs/misc`, và không ghi `.3a-factory/`.
- Greenfield: không legacy workflow, không migration tooling.

## Development Commands

```bash
npm run build
npm test
npm run validate
npm run test:installer
npm run test:workflow
npm run ci
```

## Tài liệu thêm

- [Architecture](docs/architecture/spec-package.md)
- [Workflow](docs/workflow.md)
- [Commands](docs/commands.md)
- [Approvals](docs/approvals.md)
- [Breaking changes](BREAKING-CHANGES.md)
- [Changelog](CHANGELOG.md)
- [Release notes 3.0.0-rc.4](release-notes/3.0.0-rc.4.md)
- [Release checklist](RELEASE-CHECKLIST.md)
- [Example package](examples/spec-packages/REQ-000001-example-feature/)

## Install (agents)

```bash
npx 3a-factory --agent=claude
npx 3a-factory --agent=gemini,cursor --force
npx 3a-factory --target=all --dry-run
```

| Selection | Paths |
|---|---|
| shared | `AGENTS.md`, `WORKFLOW.md`, `.agents/{templates,contracts,schemas,skills}`, `docs/` |
| claude | `CLAUDE.md`, `.claude/skills`, `.claude/commands` |
| gemini | `GEMINI.md`, `.gemini/commands` → `.agents/skills` |
| cursor | `.cursor/rules/*.mdc` (skills) + `ai-workflow.mdc`; body in `.agents/skills` |

## License

MIT — see [LICENSE](LICENSE).
