# Breaking Changes — 3.0.0 (pre-release: 3.0.0-rc.3)

Kiến trúc **Feature-local Spec Package** (greenfield). Không có migration path từ 2.x.

Áp dụng cho dòng **3.0.0**, bao gồm pre-release **`3.0.0-rc.3`** (và rc.1–rc.2).

## Breaking

- Spec chuyển từ single document sang **Spec Package** dưới `.specs/REQ-<NNNNNN>-<slug>/`.
- Artifact path feature **không** còn ghi dưới `docs/requirements` / `docs/designs` / `docs/reviews` / `docs/qa` (feature-local).
- `manifest.yaml` **bắt buộc** cho mỗi package.
- Develop yêu cầu `APPROVED_SPEC_PACKAGE` trước khi code.
- Develop chạy **task-by-task** (một task mỗi lần).
- Chỉ **review** được đánh dấu task `done`.
- QA dựa trên `acceptance.md` (AC/UT/ST/UAT), không thay bằng “smoke tự do”.
- **Converge** bắt buộc trước user review; không auto-`done`.
- Deploy approval **tách biệt** (`APPROVED_DEPLOY` ≠ `APPROVED_USER_REVIEW`).
- Version major line: **3.0.0** (current package: **3.0.0-rc.3**).

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
- Installer greenfield: không tạo `.specs/`, không chạy workflow.
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
- Publish content không gồm local `.specs/`, fixtures, coverage.

## Migration

**Không hỗ trợ.** Repo đích phải dùng workflow mới từ đầu (greenfield).
