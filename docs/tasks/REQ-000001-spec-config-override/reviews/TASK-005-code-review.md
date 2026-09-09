# Code Review

> When filled: write the body in **Vietnamese**. Keep severities/IDs in English.  
> Path: `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-005-code-review.md`  
> Review does **not** silently fix application code.

## Metadata

- REQ ID: REQ-000001
- Package: docs/tasks/REQ-000001-spec-config-override/
- Task ID: TASK-005
- Reviewer: reviewer
- Reviewed at: 2026-09-09

## Review Result

- Result: PASSED
- Blocking findings: 0

## Task Compliance

- Mục tiêu của TASK-005 là cập nhật phần `Package resolution` và đường dẫn ghi nhận bằng chứng (`reviews/`, `qa/`) trong nhóm 5 kỹ năng thực thi, kiểm thử và điều phối quản lý (`develop`, `review`, `qa`, `converge`, `project-manager`) nhằm tuân thủ chuẩn phân giải đường dẫn theo hợp đồng § 5.9.
- Đã kiểm tra trực tiếp mã nguồn và git diff của cả 5 file kỹ năng:
  1. `.agents/skills/develop/SKILL.md`:
     - Bổ sung tiểu mục chuẩn `### Path resolution (spec_config override)` tham chiếu trực tiếp đến hợp đồng § 5.9 với đầy đủ các bước kiểm tra cờ `override`, tính hợp lệ của `project` (`PROJECT_NOT_SET`), tính hợp lệ của `path` (`CONFIG_PATH_INVALID`), xác định `docs_root = <path>/<project>/tasks/` và fallback về `<repo_root>/docs/tasks/`.
     - Cập nhật mục `## Package resolution` bước 2: `Else REQ id → exactly one docs_root/REQ-<NNNNNN>-*/.` (thay vì cố định `docs/tasks/`).
     - Cập nhật mục `## Evidence output`: trỏ đến `docs_root/<PACKAGE>/reviews/TASK-<NNN>-implementation.md`.
     - Cập nhật mục `## Output contract`: trỏ đến `docs_root/<PACKAGE>/reviews/TASK-<NNN>-implementation.md`.
  2. `.agents/skills/review/SKILL.md`:
     - Bổ sung tiểu mục chuẩn `### Path resolution (spec_config override)` theo hợp đồng § 5.9.
     - Cập nhật mục `## Package resolution`: `Same as other execution skills (docs_root/REQ-…/, PACKAGE_CONFLICT / PACKAGE_NOT_FOUND).`
     - Cập nhật mục `## Output`: trỏ đến `docs_root/<PACKAGE>/reviews/TASK-<NNN>-code-review.md`.
  3. `.agents/skills/qa/SKILL.md`:
     - Bổ sung tiểu mục chuẩn `### Path resolution (spec_config override)` theo hợp đồng § 5.9.
     - Cập nhật mục `## Package resolution`: `docs_root/REQ-…/ only for new packages; PACKAGE_CONFLICT / PACKAGE_NOT_FOUND as usual.`
     - Cập nhật mục `## Evidence outputs`: trỏ đến `Under docs_root/<PACKAGE>/qa/:`.
  4. `.agents/skills/converge/SKILL.md`:
     - Bổ sung tiểu mục chuẩn `### Path resolution (spec_config override)` theo hợp đồng § 5.9.
     - Cập nhật mục `## Package resolution`: `docs_root/REQ-…/; PACKAGE_CONFLICT / PACKAGE_NOT_FOUND.`
     - Cập nhật mục `## Output`: trỏ đến `docs_root/<PACKAGE>/qa/converge-report.md`.
  5. `.agents/skills/project-manager/SKILL.md`:
     - Bổ sung tiểu mục chuẩn `### Path resolution (spec_config override)` theo hợp đồng § 5.9.
     - Cập nhật mục `## Slash invocation (mandatory)`: quy định không tạo artifacts bên ngoài `docs_root/REQ-*`, và khi không có tham số thì phân giải từ context hoặc liệt kê `docs_root`.
     - Bổ sung ghi chú quan trọng tại mục `## Onboarded detection`: giải thích rõ vai trò phân tách giữa thư mục `docs/` bắt buộc trong repo dành cho tài liệu cấp repo (như `docs/project_overview.md`) và `docs_root` dành cho các Spec Package tasks (trỏ ra `<path>/<project>/tasks/` khi override bật).
     - Cập nhật mục `## Package resolution`: bước 1 `Valid package path under docs_root → use`, bước 2 `Else REQ id → exactly one docs_root/REQ-<NNNNNN>-*/`.
- Toàn bộ 5 file kỹ năng đều tuân thủ chặt chẽ cấu trúc văn bản, logic phân giải đường dẫn và quy tắc an toàn.

## Requirement Compliance

| Requirement ID | Status | Notes |
|---|---|---|
| FR-002 | ok | Cả 5 kỹ năng đã tích hợp cơ chế phân giải `docs_root` theo cấu hình § 5.9 (`docs_root = <path>/<project>/tasks/` khi `override: true` và `<repo_root>/docs/tasks/` khi fallback). |
| FR-004 | ok | Tích hợp đầy đủ các điều kiện fail-fast với hai mã lỗi chuẩn: `PROJECT_NOT_SET` (khi `project` rỗng) và `CONFIG_PATH_INVALID` (khi `path` không tồn tại hoặc không thể truy cập). |
| FR-005 | ok | Đồng bộ hóa thành công toàn bộ 5 kỹ năng thuộc giai đoạn thực thi, đánh giá code, kiểm thử chấp nhận, hội tụ chất lượng và điều phối dự án. |
| BR-001 | ok | Cơ chế fallback an toàn về `<repo_root>/docs/tasks/` được bảo toàn khi file cấu hình vắng mặt, JSON sai định dạng hoặc `override == false`. |

## Design and ADR Compliance

| Design / ADR ID | Status | Notes |
|---|---|---|
| DES-ARCH-001 | ok | Tuân thủ kiến trúc phân giải tập trung: các kỹ năng tham chiếu trực tiếp đến Contract § 5.9 làm Single Source of Truth. |
| DES-FLOW-001 | ok | Hiện thực hóa lưu đồ phân giải: kiểm tra sự tồn tại của file cấu hình -> kiểm tra flag override -> validate project & path -> giải quyết docs_root và package path. |
| DES-OBS-001 | ok | Tích hợp đồng bộ hệ thống error token chuẩn (`PROJECT_NOT_SET`, `CONFIG_PATH_INVALID`) trên tất cả 5 kỹ năng. |

## Acceptance Coverage

| Acceptance / Test ID | Status | Notes |
|---|---|---|
| AC-002 | ok | Toàn bộ 5 kỹ năng thực thi phân giải đúng `docs_root = <path>/<project>/tasks/` khi `override: true` và an toàn rơi về mặc định khi `override: false`. |
| AC-004 | ok | Cả 5 kỹ năng đều định nghĩa rõ ràng các điểm dừng báo lỗi với error token chuẩn `PROJECT_NOT_SET` và `CONFIG_PATH_INVALID`. |
| AC-005 | ok | Đồng bộ hóa nhất quán nhóm kỹ năng thực thi, đánh giá code, kiểm thử chấp nhận, hội tụ chất lượng và quản lý dự án. |
| UT-002 | ok | Chuẩn hóa quy tắc xử lý đường dẫn trên mọi kỹ năng, bảo đảm tính nhất quán cho các kiểm thử đơn vị liên quan đến giải mã đường dẫn. |
| ST-001 | ok | Đảm bảo tính tương thích ngược tuyệt đối và khả năng hồi quy khi `override: false`. |

## Scope Review

- Expected File Scope honored: yes
  - Đã kiểm tra và xác nhận chỉ có 5 file kỹ năng sau được chỉnh sửa:
    1. `.agents/skills/develop/SKILL.md`
    2. `.agents/skills/review/SKILL.md`
    3. `.agents/skills/qa/SKILL.md`
    4. `.agents/skills/converge/SKILL.md`
    5. `.agents/skills/project-manager/SKILL.md`
- Unexplained out-of-scope files: none
  - Không có bất kỳ file ngoài phạm vi nào bị thay đổi. Các file liên quan duy nhất là tài liệu bằng chứng `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-005-implementation.md` và file báo cáo review này.

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

- Đã kiểm tra định dạng markdown, tính đồng bộ văn bản và tính nhất quán với contract § 5.9 trên cả 5 file kỹ năng.
- Đã xác nhận các đường dẫn xuất báo cáo bằng chứng trong `develop`, `review`, `qa`, `converge` đều đã chuyển sang dùng `docs_root` chuẩn hóa.
- Đã kiểm tra ghi chú tại `Onboarded detection` trong `project-manager/SKILL.md` đảm bảo giải thích rõ ràng sự khác biệt giữa `docs/` in-repo và `docs_root` cho tasks.

## Security Review

- Việc chuẩn hóa cơ chế kiểm tra `PROJECT_NOT_SET` và `CONFIG_PATH_INVALID` trước khi thực hiện ghi file bằng chứng ngăn ngừa các nguy cơ ghi đè ngoài ý muốn hoặc phát sinh lỗi phân quyền runtime.
- Cơ chế fallback an toàn (BR-001) ngăn ngừa rò rỉ hoặc thất lạc tài liệu ra ngoài môi trường repo khi cấu hình không hợp lệ.

## Performance Review

- Các khối chỉ dẫn được thêm vào ngắn gọn, súc tích và tuân thủ định dạng chuẩn, không gây lãng phí context window của mô hình ngôn ngữ lớn (LLM).

## Final Decision

- PASSED

## Required Actions

- Owner skill: project-manager
- Actions:
  1. Cập nhật trạng thái của TASK-005 thành `done` trong `docs/tasks/REQ-000001-spec-config-override/tasks.md` và `manifest.yaml`.
  2. Kích hoạt thực thi task tiếp theo theo Dependency Graph:
     - TASK-006: Cập nhật Tài liệu Điều phối Cấp cao (Governance Docs: `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`).
