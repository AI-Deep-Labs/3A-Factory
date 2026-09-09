# Task Implementation Evidence

> When filled: write the body in **Vietnamese**. Keep IDs in English.  
> Path: `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-005-implementation.md`

## Metadata

- REQ ID: REQ-000001
- Package: docs/tasks/REQ-000001-spec-config-override/
- Task ID: TASK-005
- Author: developer
- Created at: 2026-09-09
- Branch: feat/REQ-000001-spec-config-override

## Task

- Title: Cập nhật Nhóm Kỹ năng Thực thi, Kiểm thử và Quản lý
- Objective: Cập nhật phần `Package resolution` và đường dẫn ghi nhận bằng chứng (`reviews/`, `qa/`) trong các kỹ năng thực thi (`develop`, `review`, `qa`, `converge`, `project-manager`) để tuân thủ § 5.9.
- Status after handoff: review

## Files Changed

| Path | Change | Reason |
|---|---|---|
| `.agents/skills/develop/SKILL.md` | Modify | Thêm `### Path resolution (spec_config override)` vào `Package resolution`; cập nhật đường dẫn bằng chứng tại `Evidence output` và `Output contract` sang `docs_root/<PACKAGE>/reviews/TASK-<NNN>-implementation.md` |
| `.agents/skills/review/SKILL.md` | Modify | Thêm `### Path resolution (spec_config override)` vào `Package resolution`; cập nhật đường dẫn output tại `Output` sang `docs_root/<PACKAGE>/reviews/TASK-<NNN>-code-review.md` |
| `.agents/skills/qa/SKILL.md` | Modify | Thêm `### Path resolution (spec_config override)` vào `Package resolution`; cập nhật đường dẫn báo cáo tại `Evidence outputs` sang `Under docs_root/<PACKAGE>/qa/:` |
| `.agents/skills/converge/SKILL.md` | Modify | Thêm `### Path resolution (spec_config override)` vào `Package resolution`; cập nhật đường dẫn kết quả tại `Output` sang `docs_root/<PACKAGE>/qa/converge-report.md` |
| `.agents/skills/project-manager/SKILL.md` | Modify | Thêm `### Path resolution (spec_config override)` vào `Package resolution`; cập nhật phân giải package và danh sách spec sang `docs_root`; bổ sung ghi chú tại `Onboarded detection` phân biệt `docs/` nội bộ repo và `docs_root` |

## Implementation Summary

- Đã cập nhật toàn bộ 5 file kỹ năng thuộc nhóm thực thi, kiểm thử và quản lý:
  1. `.agents/skills/develop/SKILL.md`
  2. `.agents/skills/review/SKILL.md`
  3. `.agents/skills/qa/SKILL.md`
  4. `.agents/skills/converge/SKILL.md`
  5. `.agents/skills/project-manager/SKILL.md`
- Trong cả 5 file, tại phần `## Package resolution`, đã bổ sung tiểu mục chuẩn:
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
- Cập nhật các đường dẫn ghi nhận bằng chứng và báo cáo đầu ra (evidence / outputs) theo `docs_root`:
  - `develop/SKILL.md`: Cập nhật `Evidence output` thành `docs_root/<PACKAGE>/reviews/TASK-<NNN>-implementation.md` và `Output contract` thành `Implementation evidence at docs_root/<PACKAGE>/reviews/TASK-<NNN>-implementation.md`.
  - `review/SKILL.md`: Cập nhật `Output` thành `docs_root/<PACKAGE>/reviews/TASK-<NNN>-code-review.md`.
  - `qa/SKILL.md`: Cập nhật `Evidence outputs` thành `Under docs_root/<PACKAGE>/qa/:`.
  - `converge/SKILL.md`: Cập nhật `Output` thành `docs_root/<PACKAGE>/qa/converge-report.md`.
  - `project-manager/SKILL.md`: Cập nhật `Package resolution` giải quyết các package theo `docs_root`, cập nhật lệnh kiểm tra/liệt kê package sang `docs_root`, và thêm ghi chú giải thích tại `Onboarded detection`: làm rõ thư mục `docs/` vẫn bắt buộc tồn tại trong repository cho tài liệu chung cấp dự án (như `docs/project_overview.md`), trong khi các Spec Package tasks sẽ nằm tại `docs_root` (trỏ ra `<path>/<project>/tasks/` khi override được kích hoạt).

## Requirement Coverage

| Requirement ID | How addressed |
|---|---|
| FR-002 | Đồng bộ hóa logic phân giải `docs_root` theo contract § 5.9 trên cả 5 kỹ năng thực thi, kiểm thử và điều phối quản lý |
| FR-004 | Bổ sung quy định fail-fast với các mã lỗi `PROJECT_NOT_SET` và `CONFIG_PATH_INVALID` trong toàn bộ 5 kỹ năng |
| FR-005 | Cập nhật đồng nhất trên nhóm 5 kỹ năng thuộc giai đoạn thực thi, nâng tổng số kỹ năng được chuẩn hóa lên 15 |
| BR-001 | Bảo toàn cơ chế an toàn tự động fallback về `<repo_root>/docs/tasks/` khi file config vắng mặt, JSON sai định dạng hoặc `override == false` |

## Design Compliance

| Design ID | Compliance notes |
|---|---|
| DES-ARCH-001 | Tuân thủ kiến trúc phân giải đường dẫn tập trung contract-driven từ file cấu hình chuẩn `.agents/configs/spec_config.json` |
| DES-FLOW-001 | Hiện thực hóa lưu đồ phân giải: kiểm tra cờ override, kiểm tra tính hợp lệ của project và path, trỏ về `docs_root` tương ứng |
| DES-OBS-001 | Tích hợp đầy đủ các failure token `PROJECT_NOT_SET` và `CONFIG_PATH_INVALID` vào contract phân giải đường dẫn của các kỹ năng |

## Acceptance Coverage

| Acceptance / Test ID | Notes |
|---|---|
| AC-002 | Toàn bộ 5 kỹ năng thực thi phân giải đúng `docs_root = <path>/<project>/tasks/` khi `override: true` và an toàn rơi về mặc định khi `override: false` |
| AC-004 | Toàn bộ 5 kỹ năng định nghĩa rõ ràng các điểm dừng báo lỗi `PROJECT_NOT_SET` và `CONFIG_PATH_INVALID` |
| AC-005 | Đồng bộ hóa nhất quán nhóm kỹ năng thực thi, đánh giá code, kiểm thử chấp nhận, hội tụ chất lượng và quản lý dự án |
| UT-002 | Chuẩn hóa quy tắc xử lý đường dẫn trên mọi kỹ năng đảm bảo đáp ứng kiểm thử đơn vị giải mã đường dẫn |
| ST-001 | Đảm bảo khả năng tương thích ngược và kiểm thử hồi quy cho quy trình khi `override: false` |

## Verification Commands

```text
# Kiểm tra nội dung các mục Package resolution, Evidence output, và Onboarded detection trên 5 file kỹ năng:
- .agents/skills/develop/SKILL.md
- .agents/skills/review/SKILL.md
- .agents/skills/qa/SKILL.md
- .agents/skills/converge/SKILL.md
- .agents/skills/project-manager/SKILL.md
```

## Verification Results

- Result: Pass
- Evidence:
  - `.agents/skills/develop/SKILL.md`:
    - Mục `Package resolution` đã có tiểu mục `### Path resolution (spec_config override)` theo § 5.9.
    - Đường dẫn bằng chứng trong `Evidence output` và `Output contract` đã chuyển sang `docs_root/<PACKAGE>/reviews/TASK-<NNN>-implementation.md`.
  - `.agents/skills/review/SKILL.md`:
    - Mục `Package resolution` đã có tiểu mục `### Path resolution (spec_config override)` theo § 5.9.
    - Đường dẫn trong mục `Output` đã chuyển sang `docs_root/<PACKAGE>/reviews/TASK-<NNN>-code-review.md`.
  - `.agents/skills/qa/SKILL.md`:
    - Mục `Package resolution` đã có tiểu mục `### Path resolution (spec_config override)` theo § 5.9.
    - Đường dẫn trong mục `Evidence outputs` đã chuyển sang `Under docs_root/<PACKAGE>/qa/:`.
  - `.agents/skills/converge/SKILL.md`:
    - Mục `Package resolution` đã có tiểu mục `### Path resolution (spec_config override)` theo § 5.9.
    - Đường dẫn trong mục `Output` đã chuyển sang `docs_root/<PACKAGE>/qa/converge-report.md`.
  - `.agents/skills/project-manager/SKILL.md`:
    - Mục `Package resolution` đã có tiểu mục `### Path resolution (spec_config override)` theo § 5.9.
    - `Package resolution` và các chỉ dẫn liên quan đã trỏ về `docs_root`.
    - Mục `Onboarded detection` đã bổ sung ghi chú làm rõ vai trò của `docs/` (in-repo) và `docs_root` (external khi override bật).
  - Toàn bộ thay đổi nằm chính xác trong Expected File Scope, không có file ngoài phạm vi.

## Scope Deviations

- None. Chỉ thực hiện chỉnh sửa trên 5 file kỹ năng thuộc Expected File Scope của TASK-005 và tạo file bằng chứng này.

## Known Limitations

- Không có.

## Handoff to Review

- Ready for `/review`: yes
- Notes for reviewer:
  - 5 file kỹ năng đã được cập nhật đồng bộ, đầy đủ và chính xác theo yêu cầu nhiệm vụ.
  - Sẵn sàng bàn giao cho Reviewer đánh giá code review cho TASK-005.
  - Không tự ý sửa đổi trạng thái task trong `manifest.yaml` theo đúng quy định.
