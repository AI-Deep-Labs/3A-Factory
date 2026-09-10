# Tasks: Bổ sung Cross-link vào docs/project_overview.md

> Authoritative: **Execution Truth**
> Contract: `.agents/contracts/spec-package.md`

## Metadata

- REQ ID: REQ-000002
- Feature: Bổ sung Cross-link vào docs/project_overview.md
- Package: `docs/tasks/REQ-000002-onboarding-crosslink/`
- Status: ready
- Last updated: 2026-09-10

## Execution Rules

- Chỉ thực hiện current task (`manifest.execution.current_task`).
- Không bỏ qua dependency.
- Không mở rộng file scope khi chưa cập nhật task.
- Không tự thay đổi requirement hoặc design.

## Dependency Graph

```text
TASK-001 (Cập nhật onboarding SKILL.md với mục Knowledge Base & Feature Specs)
```

## Tasks

### TASK-001 — Cập nhật onboarding SKILL.md với mục Knowledge Base & Feature Specs

- Status: done
- Priority: must
- Owner: developer
- Risk: low

#### Objective
Cập nhật file `.agents/skills/onboarding/SKILL.md` tại mục `Phase D — Knowledge base docs/project_overview.md`, bổ sung mục "13. Knowledge Base & Feature Specs" vào danh sách cấu trúc tối thiểu của `docs/project_overview.md`. Cung cấp chỉ dẫn rõ ràng: chỉ điểm vị trí lưu trữ toàn bộ tài liệu chi tiết về tính năng (Spec Packages) của project (theo cấu hình `spec_config.json` nếu có override, hoặc mặc định `docs/tasks/` trong repo).

#### Requirement References
- REQ-000002 Yêu cầu 1 & 2

#### Design References
- REQ-000002 Design Section

#### Acceptance References
- AC-001, AC-002

#### Dependencies
- None

#### Expected File Scope
- `.agents/skills/onboarding/SKILL.md`

#### Implementation Notes
- Mở file `.agents/skills/onboarding/SKILL.md`.
- Tại phần `Phase D — Knowledge base docs/project_overview.md`:
  Trong danh sách `Minimum structure (keep short for small repos):`, thêm:
  `13. Knowledge Base & Feature Specs (chỉ rõ vị trí Spec Packages lưu tại <path>/<project>/tasks/REQ-* nếu spec_config.json có override: true, hoặc docs/tasks/REQ-* nếu override: false)`
- Đảm bảo giữ nguyên các phần còn lại của file.

#### Verification
- Đọc lại `.agents/skills/onboarding/SKILL.md` để xác nhận markdown hợp lệ và cấu trúc rõ ràng.

#### Definition of Done
- `Phase D` của `.agents/skills/onboarding/SKILL.md` có mục 13: "Knowledge Base & Feature Specs".

---

## Execution Summary

| Task | Status | Dependencies | Requirements | Acceptance |
|---|---|---|---|---|
| TASK-001 | done | None | Yêu cầu 1 & 2 | AC-001, AC-002 |
