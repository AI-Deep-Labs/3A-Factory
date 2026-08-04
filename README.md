# 3a-factory

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.3.0-blue.svg)](package.json)

**3A-Factory** là bộ workflow template cho AI Agent (Claude Code, Gemini CLI, Cursor) nhằm vận hành vòng đời phát triển phần mềm theo kiến trúc **Feature-local Spec Package** (SDLC greenfield).

## Giới thiệu

- **Mục tiêu:** Chuẩn hóa cách agent thu thập yêu cầu, thiết kế, chia task, implement, review, QA và nghiệm thu — với traceability và approval rõ ràng.
- **Đối tượng:** Team dùng AI coding agents để giao hàng feature có kiểm soát.
- **Supported agents:** Claude Code, Gemini CLI, Cursor, Antigravity, Other Agents
- **Kiến trúc:** Agentic Supervisor / Worker Workflow. Các Agent sẽ tự động chuyển trạng thái nội bộ, người dùng chỉ cần ra lệnh ở cấp độ High-level.

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

Project-wide ADR: `docs/decisions/`. Global misc: `docs/misc/`. Overview: `docs/project_overview.md` (onboarding).

## Artifact Ownership

```text
requirements.md = Business Truth
design.md       = Technical Truth
tasks.md        = Execution Truth
acceptance.md   = Verification Truth
manifest.yaml   = Package State Truth
```

## Agentic Workflow (Supervisor / Worker)

Khác với các workflow thủ công, 3A-Factory vận hành theo cơ chế **điều phối tự động (Orchestration)** thông qua Supervisor là `project-manager`. 

```text
Mô tả yêu cầu tự nhiên (Auto-intake) / `/project-manager`
├── Triage (Phân loại)
├── Phân tích & Lập Spec Package (Requirements → ADR → Design → Tasks → Acceptance)
├── Chờ Approval (Xác nhận cấu trúc Spec)
├── Phát triển theo từng Task (Develop ↔ Review)
├── Đảm bảo chất lượng (QA & Repair Loops)
├── Hội tụ (Converge)
└── Chờ User Approval
    └── Done → Deploy (Chỉ khi User gọi `/deploy`)
```

## Quick Start

1. Cài tooling vào repo đích: `npx 3a-factory --agent=cursor` (hoặc `claude` / `gemini` / `all`).
2. Chạy `/onboarding` (hoặc mô tả "onboard repo này") nếu repo mới.
3. **Bắt đầu công việc mới:** Chỉ cần **mô tả yêu cầu bằng ngôn ngữ tự nhiên** (feature/bug/change…). Khối Intent Gate sẽ tự động kích hoạt `project-manager` để điều phối toàn bộ vòng đời.
4. `/grill-me` nếu bạn muốn Agent chủ động "chất vấn" để làm rõ các yêu cầu mơ hồ.
5. Tại mỗi chốt chặn (Gate), Agent sẽ dừng lại hỏi ý kiến. Bạn chỉ cần trả lời **có/không** (hoặc đồng ý/từ chối).
6. Khi mọi Task đã hoàn thiện và QA pass, Agent sẽ yêu cầu nghiệm thu (User Approval).
7. Giao hàng: Gọi `/deploy` + xác nhận.

## Commands (Lệnh cho Người Dùng)

Người dùng chỉ cần tương tác qua các **Entry Point & Utility Commands** dưới đây. Toàn bộ các bước kỹ thuật nội bộ (như viết spec, chia task, code, review) đều do `project-manager` gọi dưới dạng Native Tools.

```text
/project-manager           # Ép buộc khởi động luồng Supervisor (Dành cho session mới)
/deploy                    # Triển khai hệ thống (Chỉ chạy khi đã qua nghiệm thu)
/onboarding                # Đưa 1 Repo mới vào quy trình 3A-Factory
/handoff                   # Bàn giao bối cảnh hiện tại cho Session/Agent khác
/caveman                   # Kích hoạt chế độ trả lời siêu ngắn gọn (Tiết kiệm token)
/qa-issues                 # Mở danh sách theo dõi QA Issues
/specification-synthesizer # Phân tách, hợp nhất tài liệu Spec bằng cấu trúc Declarative
/grill-me                  # Yêu cầu Agent chất vấn người dùng để làm rõ yêu cầu
```

## Approval gates

Tại mỗi gate, agent **hỏi xác nhận**; user trả lời có/không, đồng ý/từ chối, hoặc ngôn ngữ tự nhiên. 

| Gate (internal) | Khi nào |
|---|---|
| Spec package | Sau spec-review PASSED — trước khi bắt đầu code (develop) |
| Develop | (Tùy chọn) Khi thay đổi chạm vào High-risk policy |
| User review | Sau converge PASSED (Nghiệm thu toàn bộ) |
| Deploy | Trước mọi hành động deploy (Tách biệt hoàn toàn với code) |

## Safety Guarantees

- Không code trước khi user xác nhận Spec package approval.
- Không auto-approve / auto-deploy.
- Không commit/push mặc định.
- Installer không tạo feature package (`docs/tasks/`), không pre-create `docs/decisions` / `docs/misc`.

## Tài liệu thêm

- [Architecture](docs/architecture/spec-package.md)
- [Workflow](docs/workflow.md)
- [Commands](docs/commands.md)
- [Approvals](docs/approvals.md)
- [Breaking changes](BREAKING-CHANGES.md)
- [Changelog](CHANGELOG.md)
- [Release notes 3.3.0](release-notes/3.3.0.md)
- [Release notes 3.2.3](release-notes/3.2.3.md)
- [Release notes 3.2.0](release-notes/3.2.0.md)
- [Release notes 3.0.0](release-notes/3.0.0.md)
- [Example package](examples/spec-packages/REQ-000001-example-feature/)

## Install (agents)

```bash
npx 3a-factory --agent=claude
npx 3a-factory --agent=gemini,cursor --force
npx 3a-factory --target=all --dry-run
```

Luôn truyền `--agent=…` (hoặc `--target=all`) khi muốn scaffold. npm `postinstall` **không** tự động ghi file vào repo.

### Skills & Tool Mapping

Kiến trúc phân bổ thư mục khi bạn cài đặt:

| Tool | Native files | Notes |
|---|---|---|
| Mặc định (Tất cả) | `AGENTS.md`, `docs/`, `.agents/{contracts, schemas}` | Share Context Rule gốc. |
| Claude Code | `.claude/skills`, `.claude/commands`, `CLAUDE.md` | Skill + Slash commands + System Prompt. |
| Gemini CLI | `.gemini/commands/*.toml` → trỏ tới `.agents/skills`, `GEMINI.md` | Single skill body (Dùng chung ruột với Cursor). |
| Cursor | `.cursor/rules/*.mdc` + `ai-workflow.mdc` | Đọc rule qua Prompt, không có native folder skill. |

## License

MIT — see [LICENSE](LICENSE).
