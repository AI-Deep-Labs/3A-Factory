# Task Implementation Evidence

> When filled: write the body in **Vietnamese**. Keep IDs in English.  
> Path: `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-002-implementation.md`

## Metadata

- REQ ID: REQ-000001
- Package: docs/tasks/REQ-000001-spec-config-override/
- Task ID: TASK-002
- Author: developer
- Created at: 2026-09-09
- Branch: feat/REQ-000001-spec-config-override

## Task

- Title: Cập nhật Hợp đồng Spec Package mục § 5.9
- Objective: Bổ sung mục § 5.9 Path Resolution (spec_config override) vào tài liệu chuẩn .agents/contracts/spec-package.md, quy định chi tiết thuật toán phân giải đường dẫn, tính bất biến của trường project, cấu trúc thư mục <path>/<project>/tasks/REQ-*, và các token báo lỗi chuẩn.
- Status after handoff: review

## Files Changed

| Path | Change | Reason |
|---|---|---|
| `.agents/contracts/spec-package.md` | Modify | Bổ sung mục § 5.9 Path Resolution (spec_config override), đồng bộ bảng Failure ownership matrix và Related artifacts (FR-002, FR-003, FR-004, BR-001, BR-002, NFR-002) |

## Implementation Summary

- Đã bổ sung mục `## 5.9 Path Resolution (spec_config override)` vào ngay trước `## Related artifacts (Phase 1–3)` trong file hợp đồng `.agents/contracts/spec-package.md`.
- Chi tiết các tiểu mục đã quy định trong § 5.9:
  1. `5.9.1 Configuration file`: Xác định đường dẫn chuẩn `.agents/configs/spec_config.json`, giá trị khởi tạo scaffold mặc định `{ "override": false, "project": "", "path": "" }`.
  2. `5.9.2 Configuration fields`: Định nghĩa kiểu dữ liệu và ý nghĩa của 3 trường: `override` (boolean), `project` (string, thiết lập khi onboarding, bất biến), `path` (string, đường dẫn base knowledge).
  3. `5.9.3 Resolution algorithm`: Đặc tả thuật toán phân giải đường dẫn cho mọi agent/skill:
     - Đọc cấu hình từ `.agents/configs/spec_config.json`.
     - Trường hợp fallback / mặc định (file vắng mặt, JSON parse error `CONFIG_MALFORMED`, hoặc `override == false`): gán `docs_root = <repo_root>/docs/tasks/`.
     - Trường hợp override (`override == true`):
       - Kiểm tra `project` không rỗng -> nếu rỗng dừng báo lỗi `PROJECT_NOT_SET`.
       - Kiểm tra `path` không rỗng và thư mục tồn tại / truy cập được -> nếu lỗi dừng báo `CONFIG_PATH_INVALID`.
       - Chuẩn hóa loại bỏ trailing slash (`/` hoặc `\`).
       - Thiết lập `docs_root = <path>/<project>/tasks/`.
       - Tự động tạo thư mục recursively nếu chưa tồn tại.
     - Cấu trúc thư mục package: `docs_root/REQ-<NNNNNN>-<slug>/`, cấp phát ID tuần tự `next = max + 1`.
  4. `5.9.4 Project immutability`: Gán tên dự án 1 lần duy nhất tại `/onboarding` Phase B. Khi đã có giá trị khác rỗng, từ chối mọi thao tác ghi đè, giữ nguyên giá trị hiện hữu, phát warning token `PROJECT_ALREADY_SET`.
  5. `5.9.5 Failure tokens`: Bảng 4 token lỗi chuẩn hóa: `CONFIG_PATH_INVALID`, `CONFIG_MALFORMED`, `PROJECT_NOT_SET`, `PROJECT_ALREADY_SET` kèm mức độ và hành động xử lý.
  6. `5.9.6 Invariants`: 4 nguyên tắc bất biến: artifact references trong `manifest.yaml` luôn tương đối; thư mục `.agents/` luôn nằm trong repo; chỉ chuyển hướng tài liệu tasks/REQ-*; thư mục `docs/` nội bộ của repo vẫn tồn tại cho tài liệu chung của dự án.
- Đã đồng bộ bổ sung 4 failure tokens mới vào bảng `## 5.8 Failure ownership matrix` và thêm `.agents/configs/spec_config.json` vào bảng `## Related artifacts (Phase 1–3)`.

## Requirement Coverage

| Requirement ID | How addressed |
|---|---|
| FR-002 | Đặc tả chuẩn hóa thuật toán phân giải đường dẫn `docs_root` theo cờ `override` |
| FR-003 | Quy định tính bất biến của trường `project` sau khi được onboarding thiết lập |
| FR-004 | Định nghĩa cơ chế fail-fast và các mã lỗi `CONFIG_PATH_INVALID`, `PROJECT_NOT_SET`, `CONFIG_MALFORMED`, `PROJECT_ALREADY_SET` |
| BR-001 | Quy định nguyên tắc an toàn ưu tiên fallback về `<repo_root>/docs/tasks/` khi thiếu cấu hình hoặc override tắt |
| BR-002 | Khẳng định tính bất biến tuyệt đối của định danh dự án trong knowledge base |
| NFR-002 | Quy định chuẩn hóa đường dẫn (loại bỏ trailing slash), đảm bảo tương thích đường dẫn Windows và Linux/macOS |

## Design Compliance

| Design ID | Compliance notes |
|---|---|
| DES-ARCH-001 | Thiết lập Contract as Single Source of Truth cho toàn bộ 14+ kỹ năng |
| DES-FLOW-001 | Thuật toán phân giải phản ánh chính xác sơ đồ lưu đồ DES-FLOW-001 |
| DES-FLOW-002 | Quy tắc bất biến phản ánh đúng quy trình onboarding DES-FLOW-002 |
| DES-SEC-001 | Yêu cầu kiểm tra tính truy cập của thư mục và lưu giữ thư mục `.agents/` an toàn trong repo |
| DES-OBS-001 | Đồng bộ đầy đủ 4 failure tokens vào hợp đồng theo bảng quan sát DES-OBS-001 |

## Acceptance Coverage

| Acceptance / Test ID | Notes |
|---|---|
| AC-002 | Đặc tả hợp đồng cho hành vi phân giải khi override false và override true |
| AC-003 | Đặc tả hợp đồng cho việc onboarding gán project và bảo vệ tính bất biến |
| AC-004 | Đặc tả các điều kiện kiểm tra hợp lệ và sinh mã lỗi chuẩn |
| UT-002 | Cung cấp tài liệu quy chuẩn kỹ thuật cho việc triển khai unit test phân giải đường dẫn |

## Verification Commands

```text
# Kiểm tra nội dung contract bằng view_file
# Xác minh vị trí mục § 5.9 nằm ngay trước ## Related artifacts (Phase 1–3)
# Xác minh bảng Markdown hợp lệ, không có lỗi định dạng
```

## Verification Results

- Result: Pass
- Evidence:
  - Mục `## 5.9 Path Resolution (spec_config override)` tồn tại tại dòng 356 trong `.agents/contracts/spec-package.md`.
  - Đầy đủ 6 tiểu mục: 5.9.1 Configuration file, 5.9.2 Configuration fields, 5.9.3 Resolution algorithm, 5.9.4 Project immutability, 5.9.5 Failure tokens, 5.9.6 Invariants.
  - Bảng `## 5.8 Failure ownership matrix` đã có 4 token mới.
  - Bảng `## Related artifacts (Phase 1–3)` đã có entry `.agents/configs/spec_config.json`.
  - Định dạng bảng và markdown hợp lệ 100%.

## Scope Deviations

- None. Chỉ chỉnh sửa duy nhất file `.agents/contracts/spec-package.md` nằm trong Expected File Scope của TASK-002 và tạo file evidence này.

## Known Limitations

- Không có.

## Handoff to Review

- Ready for `/review`: yes
- Notes for reviewer:
  - File thay đổi: `.agents/contracts/spec-package.md`.
  - Không tự ý cập nhật trạng thái trong `manifest.yaml` theo đúng quy định dành cho developer sub-agent.
