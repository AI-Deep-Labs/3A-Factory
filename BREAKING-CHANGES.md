# Breaking Changes

## 3.2.1

**Không breaking.** Patch trên dòng 3.2.0: Intent gate auto-intake, scoped `agent-mode`, PM model-invocation, cleanup template orphan. Consumer: `npx 3a-factory@3.2.1 --agent=<agent> --force`.

---

## 3.2.0

**Consumer runtime:** không breaking — cài đặt qua `npx 3a-factory@3.2.0 --agent=<agent> --force` như bình thường.

**Authoring / fork:** nếu bạn maintain fork hoặc custom skill/command source:

- Path cũ `templates/skills/`, `templates/commands/`, `templates/.agents/` → `.agents/skills/`, `.agents/commands/`, `.agents/{contracts,rules,schemas,templates}/`
- Thư mục `templates/` wrapper đã xóa
- Slash command files chứa full body (không còn pointer-only prompt)

---

## 3.0.0

Kiến trúc **Feature-local Spec Package** (greenfield). Không có migration path từ 2.x.

Áp dụng cho **3.0.0** GA (và các bản rc.1–rc.6 trước GA).

## Breaking

- Spec chuyển từ single document sang **Spec Package** dưới `docs/tasks/REQ-<NNNNNN>-<slug>/`.
- Canonical package root là **`docs/tasks/`** (không dùng `.specs/`).
- Artifact path feature **không** còn ghi dưới `docs/requirements` / `docs/designs` / `docs/reviews` / `docs/qa` (feature-local).
- `manifest.yaml` **bắt buộc** cho mỗi package.
- Develop yêu cầu `APPROVED_SPEC_PACKAGE` trước khi code.
- Develop chạy **task-by-task** (một task mỗi lần).
- Chỉ **review** được đánh dấu task `done`.
- QA dựa trên `acceptance.md` (AC/UT/ST/UAT), không thay bằng “smoke tự do”.
- **Converge** bắt buộc trước user review; không auto-`done`.
- Deploy approval **tách biệt** (`APPROVED_DEPLOY` ≠ `APPROVED_USER_REVIEW`).
- Version: **3.0.0** (GA).
## Removed

- `/plan` (skill + alias).
- Legacy SPEC template (`SPEC-template.md`).
- Legacy PLAN template (`PLAN-template.md`).
- Legacy feature artifact output paths như trên.
- Migration tooling / legacy resolver / compatibility window.
- Giả định tương thích workflow 2.x.

## New

- Skills: `requirements`, `tasks`, `acceptance`, `spec-review`, `converge`.
- Spec orchestrator `/spec` cho producer chain.
- Multi-agent validation + adapter parity.
- CI gates: build, test, validate (manifest, layout, traceability, skills, templates, governance, adapters, build output).
- Installer greenfield: không tạo `docs/tasks/`, không chạy workflow.
- Approval tokens: `APPROVED_SPEC_PACKAGE`, `APPROVED_DEVELOP`, `APPROVED_USER_REVIEW`, `APPROVED_DEPLOY`.

## Changed

- `analyze` / `design` / `adr` / `develop` / `review` / `qa` / `deploy` / `project-manager` / `triage` / `grill-me` ghi vào Spec Package + manifest.
- Project-wide ADR mới: `docs/decisions/` (ADR kiến trúc package vẫn có tại `docs/designs/ADR-000001-…` như artifact lịch sử Phase 0).
- Governance docs (`AGENTS.md`, `WORKFLOW.md`, Cursor rule) mô tả greenfield only.
- Package description / keywords phản ánh Spec Package.

## Deprecated

- Không có deprecation soft cho legacy — **removed** ngay trong greenfield.

## Security

- Build/install path + symlink safety.
- Installer không side-effect workflow.
- Publish content không gồm local `docs/tasks/`, fixtures, coverage.

## Migration

**Không hỗ trợ.** Repo đích phải dùng workflow mới từ đầu (greenfield).
