# Task Implementation Evidence

> When filled: write the body in **Vietnamese**. Keep IDs in English.  
> Path: `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-004-implementation.md`

## Metadata

- REQ ID: REQ-000001
- Package: docs/tasks/REQ-000001-spec-config-override/
- Task ID: TASK-004
- Author: developer
- Created at: 2026-09-09
- Branch: feat/REQ-000001-spec-config-override

## Task

- Title: Cập nhật Nhóm Kỹ năng Tạo và Điều phối Spec
- Objective: Cập nhật phần `Package resolution contract` trong các kỹ năng tạo và điều phối Spec Package (`triage`, `analyze`, `requirements`, `design`, `tasks`, `acceptance`, `adr`, `spec`, `spec-review`) để tuân thủ thuật toán phân giải đường dẫn § 5.9.
- Status after handoff: review

## Files Changed

| Path | Change | Reason |
|---|---|---|
| `.agents/skills/triage/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract`; cập nhật `## Naming & numbering` step 1 và `## Process` step 4 để sử dụng `docs_root` thay vì hardcoded `docs/tasks/` |
| `.agents/skills/analyze/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract` |
| `.agents/skills/requirements/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract` |
| `.agents/skills/design/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract` |
| `.agents/skills/tasks/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract` |
| `.agents/skills/acceptance/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract` |
| `.agents/skills/adr/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract (feature scope)` |
| `.agents/skills/spec/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract` |
| `.agents/skills/spec-review/SKILL.md` | Modify | Thêm mục `### Path resolution (spec_config override)` vào `Package resolution contract` |

## Implementation Summary

- Đã cập nhật toàn bộ 9 file kỹ năng thuộc nhóm khởi tạo và điều phối Spec Package:
  1. `.agents/skills/triage/SKILL.md`
  2. `.agents/skills/analyze/SKILL.md`
  3. `.agents/skills/requirements/SKILL.md`
  4. `.agents/skills/design/SKILL.md`
  5. `.agents/skills/tasks/SKILL.md`
  6. `.agents/skills/acceptance/SKILL.md`
  7. `.agents/skills/adr/SKILL.md`
  8. `.agents/skills/spec/SKILL.md`
  9. `.agents/skills/spec-review/SKILL.md`
- Trong mỗi file, tại phần `Package resolution contract` (hoặc `Package resolution contract (feature scope)` đối với `adr`), đã bổ sung tiểu mục chuẩn:
  ```markdown
  ### Path resolution (spec_config override)
  Follow contract § 5.9:
  - Read `.agents/configs/spec_config.json`.
  - If file exists, JSON valid, and `override == true`:
    - Validate `project` is non-empty string; if empty -> fail with `PROJECT_NOT_SET`.
    - Validate `path` exists and is accessible; if invalid -> fail with `CONFIG_PATH_INVALID`.
    - Resolve `docs_root = <path>/<project>/tasks/`.
  - Otherwise (missing file, JSON parse error, or `override == false`):
    - Use default `docs_root = <repo_root>/docs/tasks/`.
  - Package directory: `docs_root/REQ-<NNNNNN>-<slug>/`.
  ```
- Riêng đối với kỹ năng `.agents/skills/triage/SKILL.md`:
  - Cập nhật bước 1 trong `## Naming & numbering`: `1. List directory names under docs_root matching REQ-*.`
  - Cập nhật bước 4 trong `## Process`: `docs_root/REQ-<NNNNNN>-<slug>/` khi khởi tạo spec package mới.

## Requirement Coverage

| Requirement ID | How addressed |
|---|---|
| FR-002 | Đồng bộ hóa logic phân giải `docs_root` theo § 5.9 trên cả 9 kỹ năng tạo và điều phối spec |
| FR-004 | Bổ sung quy định fail-fast với các error token `PROJECT_NOT_SET` và `CONFIG_PATH_INVALID` trong tất cả các kỹ năng |
| FR-005 | Cập nhật nội dung đồng nhất trên 9 kỹ năng thuộc giai đoạn phân tích, thiết kế và điều phối spec |
| BR-001 | Bảo toàn cơ chế fallback an toàn về `<repo_root>/docs/tasks/` khi file config thiếu, lỗi cú pháp hoặc `override == false` |

## Design Compliance

| Design ID | Compliance notes |
|---|---|
| DES-ARCH-001 | Cấu hình kiến trúc phân giải `docs_root` từ `.agents/configs/spec_config.json` theo đúng định dạng |
| DES-FLOW-001 | Hiện thực hóa lưu đồ phân giải: kiểm tra cờ override, validate tính hợp lệ của project và path, trỏ về `docs_root` tương ứng |
| DES-OBS-001 | Tích hợp đầy đủ các failure token `PROJECT_NOT_SET` và `CONFIG_PATH_INVALID` vào contract phân giải đường dẫn của các kỹ năng |

## Acceptance Coverage

| Acceptance / Test ID | Notes |
|---|---|
| AC-002 | Toàn bộ 9 skill phân giải đúng `docs_root = <path>/<project>/tasks/` khi `override: true` và rơi về mặc định khi `override: false` |
| AC-004 | Toàn bộ 9 skill định nghĩa rõ ràng các điểm dừng báo lỗi `PROJECT_NOT_SET` và `CONFIG_PATH_INVALID` |
| AC-005 | Đồng bộ hóa nhất quán nhóm kỹ năng phân tích, thiết kế, lập kế hoạch và điều phối spec |
| UT-002 | Chuẩn hóa quy tắc xử lý đường dẫn trên mọi kỹ năng đảm bảo đáp ứng kiểm thử đơn vị giải mã đường dẫn |

## Verification Commands

```powershell
# Kiểm tra diff của toàn bộ 9 file skills vừa cập nhật
git diff .agents/skills/
```

## Verification Results

- Result: Pass
- Evidence:
  - Lệnh `git diff .agents/skills/` xác nhận:
    - Cả 9 file `.agents/skills/{acceptance, adr, analyze, design, requirements, spec-review, spec, tasks, triage}/SKILL.md` đều có block `### Path resolution (spec_config override)` chuẩn xác theo đúng hợp đồng § 5.9.
    - File `.agents/skills/triage/SKILL.md` cập nhật chính xác `docs_root` ở mục Naming & numbering (bước 1) và Process (bước 4).
    - Không có bất kỳ thay đổi ngoài phạm vi quy định của TASK-004.

## Scope Deviations

- None. Chỉ thực hiện chỉnh sửa trên 9 file kỹ năng thuộc Expected File Scope của TASK-004 và tạo file bằng chứng này.

## Known Limitations

- Không có.

## Handoff to Review

- Ready for `/review`: yes
- Notes for reviewer:
  - 9 file kỹ năng đã được cập nhật đồng bộ.
  - Sẵn sàng bàn giao cho Reviewer đánh giá code review cho TASK-004.
  - Không tự ý sửa đổi trạng thái task trong `manifest.yaml` theo đúng quy định.
