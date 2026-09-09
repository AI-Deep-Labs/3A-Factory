# Code Review

> When filled: write the body in **Vietnamese**. Keep severities/IDs in English.  
> Path: `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-002-code-review.md`  
> Review does **not** silently fix application code.

## Metadata

- REQ ID: REQ-000001
- Package: docs/tasks/REQ-000001-spec-config-override/
- Task ID: TASK-002
- Reviewer: reviewer
- Reviewed at: 2026-09-09

## Review Result

- Result: PASSED
- Blocking findings: 0

## Task Compliance

- Mục tiêu của TASK-002 là cập nhật hợp đồng đặc tả Spec Package `.agents/contracts/spec-package.md`, bổ sung toàn diện mục `§ 5.9 Path Resolution (spec_config override)` làm nền tảng kỹ thuật (Single Source of Truth) cho cơ chế chuyển hướng tài liệu spec ra kho tri thức ngoài.
- Tiến hành kiểm tra trực tiếp mã nguồn và git diff của `.agents/contracts/spec-package.md`:
  1. **Mục § 5.9 Path Resolution (spec_config override)**: Đã được bổ sung chuẩn xác ngay trước mục `## Related artifacts (Phase 1–3)` (dòng 356–424).
  2. **Tiểu mục 5.9.1 Configuration file**: Xác định chính xác đường dẫn `.agents/configs/spec_config.json` và khối JSON scaffold chuẩn (`override: false`, `project: ""`, `path: ""`).
  3. **Tiểu mục 5.9.2 Configuration fields**: Khai báo đầy đủ bảng 3 trường dữ liệu (`override`, `project`, `path`), kiểu dữ liệu và mô tả ngữ nghĩa rõ ràng.
  4. **Tiểu mục 5.9.3 Resolution algorithm**: Thuật toán phân giải đường dẫn 4 bước phản ánh chuẩn xác lưu đồ kiến trúc:
     - Đọc cấu hình.
     - Fallback về `<repo_root>/docs/tasks/` khi thiếu file, JSON lỗi (`CONFIG_MALFORMED`), hoặc `override == false`.
     - Kiểm tra điều kiện khi `override == true`: validate `project` (báo `PROJECT_NOT_SET` nếu rỗng), validate `path` (báo `CONFIG_PATH_INVALID` nếu rỗng/không tồn tại/không truy cập được), chuẩn hóa đường dẫn loại bỏ trailing slash, gán `docs_root = <path>/<project>/tasks/` và tự động tạo thư mục nếu chưa tồn tại.
     - Quy định layout thư mục package `docs_root/REQ-<NNNNNN>-<slug>/` và giải thuật cấp phát ID tuần tự `next = max + 1`.
  5. **Tiểu mục 5.9.4 Project immutability**: Đặc tả chặt chẽ nguyên tắc gán tên dự án 1 lần duy nhất tại Phase B của `/onboarding`. Khi đã có giá trị khác rỗng, từ chối mọi thao tác ghi đè tự động, bảo lưu giá trị hiện có, phát warning token `PROJECT_ALREADY_SET` và tiếp tục luồng xử lý.
  6. **Tiểu mục 5.9.5 Failure tokens**: Bảng tra cứu 4 token lỗi chuẩn hóa (`CONFIG_PATH_INVALID`, `CONFIG_MALFORMED`, `PROJECT_NOT_SET`, `PROJECT_ALREADY_SET`) kèm phân loại mức độ và hành động xử lý.
  7. **Tiểu mục 5.9.6 Invariants**: Xác lập 4 nguyên tắc bất biến nền tảng:
     - Relative artifact references: Manifest artifact references giữ nguyên dạng tương đối trong package.
     - Repository containment: Thư mục `.agents/` luôn nằm trong repository, không chuyển ra ngoài.
     - Selective redirection: Chỉ chuyển hướng tài liệu tasks/REQ-*, toàn bộ review/qa evidence vẫn nằm trong package tại `docs_root/REQ-*`.
     - Repo-level documentation: Thư mục `docs/` cục bộ của repo vẫn tồn tại cho tài liệu tổng quan.
  8. **Mục § 5.8 Failure ownership matrix**: Đã đồng bộ bổ sung đủ 4 failure token mới (`CONFIG_PATH_INVALID`, `CONFIG_MALFORMED`, `PROJECT_NOT_SET`, `PROJECT_ALREADY_SET`) kèm người sở hữu tương ứng.
  9. **Mục Related artifacts (Phase 1–3)**: Đã bổ sung mục `Spec config template | .agents/configs/spec_config.json`.

## Requirement Compliance

| Requirement ID | Status | Notes |
|---|---|---|
| FR-002 | ok | Định nghĩa tường minh thuật toán phân giải `docs_root` trong § 5.9.3 theo cờ `override`. |
| FR-003 | ok | Quy định tính bất biến của trường `project` và bảo vệ không cho ghi đè trong § 5.9.4. |
| FR-004 | ok | Quy chuẩn 4 token báo lỗi chuẩn hóa và cơ chế fail-fast trong § 5.9.5 và bảng § 5.8. |
| BR-001 | ok | Khẳng định quy tắc an toàn ưu tiên fallback về repo cục bộ `<repo_root>/docs/tasks/`. |
| BR-002 | ok | Khóa định danh dự án trong knowledge base thành giá trị bất biến sau khi onboarding. |
| NFR-002 | ok | Quy định chuẩn hóa đường dẫn (loại bỏ trailing slash `/` và `\`) tương thích Win32 và POSIX. |

## Design and ADR Compliance

| Design / ADR ID | Status | Notes |
|---|---|---|
| DES-ARCH-001 | ok | Triển khai Single Source of Truth thông qua hợp đồng § 5.9 cho toàn bộ 14+ skills. |
| DES-FLOW-001 | ok | Thuật toán trong § 5.9.3 khớp hoàn toàn với sơ đồ lưu đồ phân giải đường dẫn DES-FLOW-001. |
| DES-FLOW-002 | ok | Quy định tính bất biến trong § 5.9.4 khớp với quy trình onboarding DES-FLOW-002. |
| DES-SEC-001 | ok | Đưa yêu cầu kiểm tra tính truy cập của thư mục và nguyên tắc repository containment vào invariants. |
| DES-OBS-001 | ok | Bổ sung đầy đủ 4 token lỗi vào bảng § 5.8 và chi tiết hóa trong bảng § 5.9.5. |

## Acceptance Coverage

| Acceptance / Test ID | Status | Notes |
|---|---|---|
| AC-002 | ok | Hợp đồng quy định rõ ràng hành vi phân giải khi `override: false` (repo-local) và `override: true` (external path). |
| AC-003 | ok | Hợp đồng quy định rõ ràng việc onboarding gán project name và hành vi từ chối ghi đè khi đã tồn tại. |
| AC-004 | ok | Hợp đồng định nghĩa chi tiết các điều kiện kích hoạt `PROJECT_NOT_SET`, `CONFIG_PATH_INVALID`, `CONFIG_MALFORMED`. |
| UT-002 | ok | Nội dung hợp đồng cung cấp cơ sở đặc tả kỹ thuật chính xác để kiểm thử unit test cho thuật toán phân giải. |

## Scope Review

- Expected File Scope honored: yes
  - File được chỉnh sửa: `.agents/contracts/spec-package.md` (chính xác theo Expected File Scope của TASK-002).
- Unexplained out-of-scope files: none

## Findings

### BLOCKER

Không có (0 blocker).

### MAJOR

Không có (0 major).

### MINOR

Không có (0 minor).

### WARNING

Không có (0 warning).

## Test Review

- Việc xác minh được thực hiện thông qua:
  - Kiểm tra cú pháp Markdown, cấu trúc các bảng và thứ tự phân cấp đề mục.
  - Đối chiếu tính nhất quán giữa bảng § 5.8, nội dung mục § 5.9 và bảng Related artifacts.
  - So sánh logic thuật toán phân giải và xử lý ngoại lệ với các tài liệu nền tảng (`requirements.md`, `design.md`, `acceptance.md`).
- Kết quả: Tài liệu hợp đồng đạt độ chính xác cao, rõ ràng, không có mâu thuẫn hay điểm mơ hồ.

## Security Review

- Quy định về kiểm tra tính tồn tại và quyền truy cập thư mục (`path`) trong § 5.9.3 và § 5.9.5 giúp ngăn chặn lỗi runtime hoặc ghi file sai vị trí.
- Nguyên tắc bất biến (Repository containment) trong § 5.9.6 đảm bảo mã nguồn và cấu hình `.agents/` luôn được lưu giữ an toàn bên trong repo, không bị di dời ra ngoài.

## Performance Review

- Thuật toán phân giải đường dẫn được thiết kế đơn giản: đọc một file JSON nhỏ cục bộ, kiểm tra cờ boolean, chuẩn hóa chuỗi và kiểm tra thư mục. Không gây ảnh hưởng hay chậm trễ đến thời gian khởi tạo hoặc thực thi của các agents/skills.

## Final Decision

- PASSED

## Required Actions

- Owner skill: project-manager
- Actions:
  1. Cập nhật trạng thái TASK-002 thành `done` trong `docs/tasks/REQ-000001-spec-config-override/tasks.md` và `manifest.yaml`.
  2. Kích hoạt thực thi các task phụ thuộc tiếp theo theo Dependency Graph:
     - TASK-003: Cập nhật Kỹ năng `onboarding` và Khóa Bất biến Project Name (`.agents/skills/onboarding/SKILL.md`).
     - TASK-004: Cập nhật Nhóm Kỹ năng Tạo và Điều phối Spec (`triage`, `analyze`, `requirements`, `design`, `tasks`, `acceptance`, `adr`, `spec`, `spec-review`).
