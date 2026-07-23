# Kiến trúc Feature-local Spec Package

## Context

3A-Factory **3.0.0-rc.1** (dòng 3.0.0) vận hành vòng đời feature quanh một **Spec Package** dưới `.specs/REQ-<NNNNNN>-<slug>/`, thay cho một file spec đơn lẻ và các artifact phân tán dưới `docs/requirements` / `docs/designs`.

## Problem statement

- Single-document spec khó giữ ownership và traceability khi chia task / review / QA.
- Artifact path phân tán dễ drift và khó gate approval.
- Legacy `/plan` và migration làm mơ hồ contract greenfield.

## Design goals

- Một package = một feature request.
- Ownership rõ: business / technical / execution / verification / state.
- Manifest là nguồn trạng thái duy nhất.
- Producer skills tạo package; execution skills chạy task-by-task.
- Approval tách biệt: Spec Package / Develop / User Review / Deploy.
- Multi-agent parity (Claude, Gemini, Cursor).
- Build + installer + validation + CI bắt buộc.

## Non-goals

- Legacy workflow compatibility.
- Migration tooling / resolver.
- `/plan` alias.
- Auto-create `.specs/` qua installer.
- Auto-approve / auto-deploy / auto-commit.
- Phase 4 runtime (intentionally skipped).

## Greenfield decision

Xem ADR `docs/designs/ADR-000001-adopt-feature-local-spec-package.md` (Accepted). Breaking change → dòng **3.0.0** (hiện `3.0.0-rc.1`). Không hỗ trợ migration từ layout cũ.

## Package structure

```text
.specs/REQ-<NNNNNN>-<slug>/
  manifest.yaml
  raw.md | discovery.md | analysis.md
  requirements.md | design.md | tasks.md | acceptance.md | spec-review.md
  decisions/ | reviews/ | qa/ | release/
```

Project-wide ADR: `docs/decisions/`. Global: `docs/misc/`, `docs/project_overview.md`.

## Artifact ownership

| Artifact | Truth |
|---|---|
| `requirements.md` | Business |
| `design.md` | Technical |
| `tasks.md` | Execution |
| `acceptance.md` | Verification |
| `manifest.yaml` | Package state |

Không được nhân bản “truth” sang path khác.

## State machine (tóm tắt)

`new` → `triaged` → `clarifying?` → `analyzed` → `specifying` → `validating` → `awaiting_approval` → `approved` → `implementing` ↔ `reviewing` → `qa` → (`implementing` nếu repair) → `converging` → `awaiting_user_review` → `done`

Terminal / special: `blocked`, `rejected`, `cancelled`, `archived`.

Chi tiết: `docs/workflow.md`.

## Approval model

| Token | Mục đích |
|---|---|
| `APPROVED_SPEC_PACKAGE` | Bắt buộc trước Develop |
| `APPROVED_DEVELOP` | High-risk policy |
| `APPROVED_USER_REVIEW` | Sau converge → `done` |
| `APPROVED_DEPLOY` | Deploy riêng |

Không auto-approve. Reject → dừng / hỏi re-analyze.

## Traceability model

IDs bắt buộc liên kết: `FR-*` / `BR-*` / `NFR-*` ↔ `DES-*` ↔ `TASK-*` ↔ `AC-*` / `UT-*` / `ST-*` / `UAT-*`.

Validators: package layout, traceability, state consistency.

## Producer skill architecture

`triage` → `grill-me?` → `analyze` → `requirements` → `adr?` → `design` → `tasks` → `acceptance` → `spec-review`  
Orchestrator: `/spec`.

Output dưới `.specs/…`. Dừng cho `APPROVED_SPEC_PACKAGE`.

## Execution skill architecture

`project-manager` chọn task → `develop` (một task) → `review` (chỉ review đánh dấu task `done`) → lặp → `qa` (acceptance-driven, max 3 attempts) → `converge` → user review → `deploy` (riêng).

## Review / QA / converge

- **Review:** gate task completion; fail → quay develop cùng task.
- **QA:** verify AC/UT/ST/UAT; defect → repair loop có giới hạn.
- **Converge:** kiểm evidence đầy đủ; chỉ chuyển `awaiting_user_review`, không tự `done`.

## Multi-agent adapter model

Cùng skill semantic; path khác nhau:

| Target | Skills / commands |
|---|---|
| Claude | `.claude/skills`, `.claude/commands` |
| Gemini | `.gemini/skills`, `.gemini/commands` |
| Cursor | `.cursor/skills`, rule `ai-workflow.mdc` |

Shared: `AGENTS.md`, `WORKFLOW.md`, `.agents/{templates,contracts,schemas}`.

## Build and installer model

- `npm run build` → `dist/` + `bundle.json` + `build-manifest.json` (deterministic).
- Installer: dry-run/apply, backup khi overwrite, idempotent, **không** tạo `.specs/`, **không** chạy workflow.

## Validation and CI model

`npm run validate` gồm: schema, package layout, traceability, skills, templates, governance, adapter parity, build output, greenfield checks.

CI: `.github/workflows/ci.yml` — build, test, validate (không `continue-on-error` trên critical).

## Security boundaries

- Path/symlink safety trong build & install.
- Không shell injection từ user path.
- `--force` có giới hạn an toàn.
- Không bundle secrets / local `.specs/` / test fixtures vào runtime publish content.

## Known limitations

- Phase 4 runtime không có (greenfield).
- Không migrate package cũ.
- Agent vẫn phải tuân thủ skill (validator bắt structure, không thay thế judgment LLM).
- Deploy luôn manual + `APPROVED_DEPLOY`.

## Future extension points

- Schema versioning (`schema_version` > 1) khi cần field mới.
- Thêm validator domain-specific.
- Mở rộng evidence templates / report formats.
