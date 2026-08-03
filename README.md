# 3a-factory

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.2.3-blue.svg)](package.json)

**3A-Factory** là bộ workflow template cho AI Agent (Claude Code, Gemini CLI, Cursor) nhằm vận hành vòng đời phát triển phần mềm theo kiến trúc **Feature-local Spec Package** (SDLC greenfield).

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
└── REQ-000001-example-feature/
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
2. Chạy `/onboarding` (hoặc mô tả "onboard repo này") nếu repo mới.
3. **Mô tả yêu cầu lifecycle bằng ngôn ngữ tự nhiên** (feature/bug/change…) — `project-manager` tự route theo Intent gate (`AGENTS.md` § Auto-intake). Q&A / giải thích code / slash bước → **không** mở PM.
4. `/grill-me` nếu còn ambiguity (PM cũng tự route khi cần).
5. `/spec` hoặc PM orchestrate: requirements → ADR? → design → tasks → acceptance → spec-review.
6. Agent hỏi xác nhận spec → user trả lời **có/không** (hoặc đồng ý/từ chối).
7. PM chọn task → develop → review (lặp đến hết task).
8. QA → (repair loop nếu cần) → converge.
9. Agent hỏi nghiệm thu → user xác nhận → `done`.
10. Deploy: `/deploy` + xác nhận deploy (có/không).

Slash commands (`/triage`, `/develop`, …) vẫn dùng được như **override thủ công** khi cần.

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
/onboarding
/handoff
/caveman
/specification-synthesizer
/qa-issues
```

**Không có:** `/plan`, migration/resolver commands.

## Approval gates

Tại mỗi gate, agent **hỏi xác nhận**; user trả lời có/không, đồng ý/từ chối, hoặc ngôn ngữ tự nhiên. Token `APPROVED_*` là ID nội bộ (vẫn dùng được nếu muốn).

| Gate (internal) | Khi nào |
|---|---|
| Spec package | Sau spec-review PASSED — trước develop |
| Develop | High-risk policy yêu cầu |
| User review | Sau converge PASSED |
| Deploy | Trước mọi deploy — tách biệt user review |

Chi tiết: [docs/approvals.md](docs/approvals.md).

## Safety Guarantees

- Không code trước khi user xác nhận spec package approval.
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
- [Release notes 3.2.3](release-notes/3.2.3.md)
- [Release notes 3.2.0](release-notes/3.2.0.md)
- [Release notes 3.0.0](release-notes/3.0.0.md)
- [Release checklist](RELEASE-CHECKLIST.md)
- [Example package](examples/spec-packages/REQ-000001-example-feature/)

## Install (agents)

```bash
npx 3a-factory --agent=claude
npx 3a-factory --agent=gemini,cursor --force
npx 3a-factory --target=all --dry-run
```

Luôn truyền `--agent=…` (hoặc `--target=all`) khi muốn scaffold. npm `postinstall` **không** ghi file vào repo — tránh `npx … --agent=gemini` vô tình cài cả ba agent.

Cấp số REQ/ADR: agent tự liệt kê thư mục `docs/tasks/REQ-*` rồi `next = max + 1` (không có → `000001`). Không chạy script phụ; không lấy số từ example trong `.agents/`.

| Selection | Paths |
|---|---|
| shared | `AGENTS.md`, `WORKFLOW.md`, `.agents/{templates,contracts,schemas,rules,skills}`, `docs/` |
| claude | `CLAUDE.md`, `.claude/skills`, `.claude/commands` |
| gemini | `GEMINI.md`, `.gemini/commands` → `.agents/skills` |
| cursor | `.cursor/rules/*.mdc` (from `.agents/commands/`); body in `.agents/skills` |

## License

MIT — see [LICENSE](LICENSE).
