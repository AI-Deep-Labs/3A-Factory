# Requirements: Cơ chế `spec_config.json` Override Path

> Authoritative: **Business Truth — WHAT and WHY**
> Contract: `.agents/contracts/spec-package.md`

## Metadata

- REQ ID: REQ-000001
- Feature: Cải tiến cơ chế tạo spec với spec_config.json override path
- Package: `docs/tasks/REQ-000001-spec-config-override/`
- Status: ready
- Risk: medium
- Last updated: 2026-09-09

## Problem Statement

Hiện tại, toàn bộ tài liệu Spec Package trong 3a-factory pipeline được cố định ghi tại thư mục `docs/tasks/REQ-*` bên trong kho mã nguồn (repo) hiện tại. Điều này gây ra các hạn chế lớn:
1. **Thiếu tập trung hóa tri thức (Knowledge Base)**: Mỗi repository quản lý tài liệu độc lập, dẫn đến phân mảnh tri thức giữa các microservices hoặc các dự án trong cùng tổ chức.
2. **Khó khăn trong đa dự án**: Doanh nghiệp cần quản lý một knowledge base trung tâm (centralized repo/storage) cho nhiều dự án để tiện tra cứu, liên kết chéo và chia sẻ tài liệu nghiệp vụ/kỹ thuật.
3. **Pha trộn mã nguồn và tri thức**: Một số đội ngũ muốn tách biệt hoàn toàn mã nguồn (source code) khỏi kho tri thức kiến trúc và quy trình nghiệp vụ (knowledge docs).

Do đó, cần cải tiến pipeline để hỗ trợ một cơ chế cấu hình linh hoạt thông qua file `spec_config.json` đặt trong `.agents/configs/`, cho phép tùy chọn chuyển hướng (redirect) toàn bộ tài liệu Spec Package sang đường dẫn bên ngoài theo cấu trúc `<path>/<project>/tasks/REQ-*`, đồng thời bảo toàn hoàn toàn hành vi mặc định khi không kích hoạt override.

## Goals

1. Cung cấp file cấu hình `.agents/configs/spec_config.json` được tạo sẵn (scaffold) khi cài đặt pipeline với cấu hình mặc định (`override: false`).
2. Hỗ trợ chuyển hướng lưu trữ tài liệu Spec Package sang `<path>/<project>/tasks/REQ-*` khi `override: true`.
3. Đảm bảo tính bất biến (immutability) của trường `project`: được thiết lập duy nhất 1 lần khi onboarding dự án lần đầu, không được phép sửa đổi hoặc ghi đè sau đó.
4. Đảm bảo tương thích ngược 100%: khi `override: false` hoặc file cấu hình vắng mặt, mọi thao tác vẫn diễn ra tại `<repo>/docs/tasks/REQ-*`.
5. Đồng bộ hóa toàn bộ quy trình: từ hợp đồng (`spec-package.md`), các kỹ năng (14+ skills), quy trình `onboarding`, trình cài đặt (`install.js`), đến tài liệu điều phối (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`).

## Non-goals

1. Không thay đổi cấu trúc nội bộ của từng thư mục Spec Package (`manifest.yaml`, `raw.md`, `requirements.md`, `decisions/`, `reviews/`, `qa/`, v.v. giữ nguyên).
2. Không thay đổi định dạng schema của `manifest.yaml` (các đường dẫn artifacts trong manifest vẫn là relative paths).
3. Không di chuyển thư mục quản lý cấu hình pipeline `.agents/` ra ngoài repository (thư mục `.agents/` luôn nằm trong repository).
4. Không tự động di chuyển (migrate) các package cũ khi người dùng đổi cờ `override` giữa chừng.

## Actors

- **Developer / Platform Engineer**: Người cài đặt hoặc cấu hình 3a-factory vào dự án, cấu hình đường dẫn knowledge base tập trung.
- **AI Agents (BA, Architect, Developer, Reviewer, QA, PM)**: Các tác tử tự động đọc và tuân thủ đường dẫn phân giải tài liệu trong suốt vòng đời SDLC.
- **Project Stakeholder / Leader**: Người xem xét và tra cứu tài liệu spec tập trung tại một kho tri thức chung.

## User Scenarios

### US-001 — Sử dụng mặc định (In-repo documentation)
- Actor: Developer mới bắt đầu dự án đơn lẻ.
- Goal: Chạy quy trình SDLC chuẩn của 3a-factory trên repo hiện tại mà không cần thiết lập gì thêm.
- Outcome: Pipeline hoạt động bình thường, các file spec sinh ra trong `docs/tasks/REQ-*` của repo.

### US-002 — Tập trung hóa tài liệu ra Knowledge Base bên ngoài
- Actor: Platform Engineer tích hợp dự án `skyorder-api` vào kho tài liệu tập trung.
- Goal: Cấu hình `override: true`, chỉ định `path: "C:\\Documents\\knowledge"` và tên dự án `project: "skyorder-api"`.
- Outcome: Mọi tác tử khi tạo và xử lý spec package (triage, requirements, design, tasks, review, qa) sẽ tự động làm việc trên `C:\Documents\knowledge\skyorder-api\tasks\REQ-*`.

### US-003 — Onboarding tự động điền tên dự án
- Actor: Developer thực hiện lệnh `/onboarding`.
- Goal: Pipeline tự động phát hiện tên dự án và điền vào trường `project` trong `spec_config.json`.
- Outcome: Trường `project` được điền. Các lần onboarding sau hoặc thao tác khác không thể sửa đổi giá trị này.

## Functional Requirements

### FR-001 — Cấu trúc và Khởi tạo `spec_config.json`
- Description: Khi cài đặt bộ 3a-factory, installer phải tự động tạo file `.agents/configs/spec_config.json` nếu chưa tồn tại với nội dung mẫu:
  ```json
  {
    "override": false,
    "project": "",
    "path": ""
  }
  ```
- Rationale: Cung cấp điểm cấu hình chuẩn cho repository mà không gây lỗi hoặc bắt buộc cấu hình thủ công.
- Priority: must
- Source: raw
- Status: confirmed
- Acceptance references:
  - AC-001
  - UT-001

### FR-002 — Phân giải đường dẫn tài liệu theo cấu hình (Path Resolution)
- Description: Toàn bộ các skill trong quy trình SDLC phải phân giải đường dẫn gốc của tasks (`docs_root`) theo thuật toán:
  - Nếu file `.agents/configs/spec_config.json` không tồn tại, JSON lỗi, hoặc `override == false`: `docs_root = <repo_root>/docs/tasks/`
  - Nếu `override == true`: kiểm tra `path` và `project` hợp lệ, xác định `docs_root = <path>/<project>/tasks/`
- Rationale: Thống nhất logic xác định vị trí tài liệu trên toàn bộ 14+ kỹ năng.
- Priority: must
- Source: raw
- Status: confirmed
- Acceptance references:
  - AC-002
  - UT-002
  - ST-001

### FR-003 — Bổ sung tên dự án khi Onboarding và Khóa bất biến (Immutability)
- Description: Kỹ năng `onboarding` khi chạy trên repository:
  - Nếu trường `project` trong `spec_config.json` đang rỗng (`""`), tiến hành ghi tên dự án (được xác nhận hoặc nhận diện từ repo).
  - Nếu trường `project` đã có giá trị khác rỗng, kỹ năng `onboarding` hoặc bất kỳ thao tác nào khác KHÔNG được phép ghi đè.
- Rationale: Bảo vệ tính toàn vẹn của thư mục tri thức, tránh việc đổi tên dự án làm mất liên kết hoặc phân tán các tài liệu cũ đã tạo trong knowledge base.
- Priority: must
- Source: user supplement (2026-09-09T15:42)
- Status: confirmed
- Acceptance references:
  - AC-003
  - UT-003

### FR-004 — Kiểm tra hợp lệ và Báo lỗi rõ ràng (Validation & Fail-Fast)
- Description: Khi `override: true`:
  - Nếu `path` rỗng hoặc đường dẫn không tồn tại / không truy cập được: dừng với mã lỗi `CONFIG_PATH_INVALID`.
  - Nếu `project` rỗng: dừng với mã lỗi `PROJECT_NOT_SET`.
  - Nếu có hành động cố tình ghi đè `project` đã có giá trị: phát cảnh báo hoặc mã lỗi `PROJECT_ALREADY_SET`.
- Rationale: Ngăn chặn việc tạo file sai vị trí hoặc lỗi ngầm không xác định.
- Priority: must
- Source: analysis
- Status: confirmed
- Acceptance references:
  - AC-004
  - UT-004

### FR-005 — Đồng bộ hóa các kỹ năng và tài liệu điều phối
- Description: Cập nhật hướng dẫn trong contract (`spec-package.md`), 14 kỹ năng nghiệp vụ (`triage`, `analyze`, `requirements`, `design`, `tasks`, `acceptance`, `adr`, `spec`, `spec-review`, `develop`, `review`, `qa`, `converge`, `project-manager`), kỹ năng `onboarding`, cùng với `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`.
- Rationale: Đảm bảo tất cả agent persona và công cụ CLI hiểu và thực thi đồng nhất.
- Priority: must
- Source: analysis
- Status: confirmed
- Acceptance references:
  - AC-005
  - ST-002

## Business Rules

### BR-001 — Nguyên tắc ưu tiên Repo cục bộ (Default Safety)
- Rule: Khi có bất kỳ sự nghi ngờ nào (thiếu file config, JSON malformed, đường dẫn external không hợp lệ), hệ thống mặc định rơi về (fallback) `<repo_root>/docs/tasks/` hoặc dừng lại báo lỗi thay vì tự ý ghi vào một đường dẫn không xác định.
- Rationale: Đảm bảo mã nguồn và tài liệu không bị rò rỉ hoặc thất lạc.
- Source: contract
- Status: confirmed
- Acceptance references:
  - AC-002

### BR-002 — Tính bất biến của Project Identifier (Project Immutability)
- Rule: Giá trị của trường `project` trong `spec_config.json` một khi đã được thiết lập thì trở thành định danh duy nhất bất biến của repo trong knowledge base. Không một agent tự động nào được phép sửa đổi giá trị này.
- Rationale: Thư mục `<path>/<project>/tasks/` là không gian tên (namespace) chuyên biệt của dự án trong knowledge base. Đổi tên namespace sẽ làm gãy chuỗi lịch sử và liên kết.
- Source: user supplement
- Status: confirmed
- Acceptance references:
  - AC-003

## Non-functional Requirements

### NFR-001 — Tính tương thích ngược (Backward Compatibility)
- Requirement: Việc thêm tính năng này không được làm gián đoạn hay thay đổi bất kỳ hành vi nào của các dự án hiện tại đang sử dụng 3a-factory mà không kích hoạt override.
- Measurement: 100% các bài kiểm thử hiện hữu của bộ công cụ và các quy trình tạo spec cục bộ vẫn chạy thành công khi `override: false`.
- Priority: must
- Status: confirmed
- Acceptance references:
  - ST-001

### NFR-002 — Tính tương thích đa nền tảng hệ điều hành (Cross-Platform Path Handling)
- Requirement: Xử lý đường dẫn file (`path`) đúng chuẩn trên cả Windows (hỗ trợ dấu gạch chéo ngược `\` hoặc xuôi `/`, ký tự ổ đĩa `C:\`) và Linux/macOS.
- Measurement: Các hàm resolve đường dẫn xử lý normalize tương thích trên cả POSIX và win32.
- Priority: must
- Status: confirmed
- Acceptance references:
  - UT-002

## Constraints

1. File cấu hình bắt buộc đặt tại `.agents/configs/spec_config.json`.
2. Không thay đổi schema manifest để duy trì tính portable của từng package.
3. Không làm ảnh hưởng đến các file markdown không thuộc lifecycle REQ (như `docs/project_overview.md` trong repo).

## Assumptions

1. Người dùng có quyền đọc/ghi trên đường dẫn `path` được chỉ định khi cấu hình `override: true`.
2. Kho lưu trữ `path` có thể là thư mục trên ổ đĩa nội bộ, network drive, hoặc thư mục đồng bộ cloud/git.

## Edge Cases

1. **File `spec_config.json` bị lỗi cú pháp JSON**: Hệ thống phải fallback về in-repo hoặc báo `CONFIG_MALFORMED`, không crash agent.
2. **Đường dẫn `path` chứa dấu gạch chéo cuối cùng (trailing slash)**: Xử lý chuẩn hóa để tránh sinh ra đường dẫn lặp `//` hoặc `\\`.
3. **Thư mục `<path>/<project>/tasks` chưa tồn tại**: Agent/Skill khi tạo package mới (triage) phải tự động tạo các thư mục cha nếu chưa có.
4. **Onboarding chạy nhiều lần**: Lần 1 điền tên dự án; các lần tiếp theo giữ nguyên, không ghi đè.

## Out of Scope

- Giao diện UI/CLI riêng để chỉnh sửa `spec_config.json` (người dùng chỉnh sửa trực tiếp file JSON hoặc thông qua onboarding ban đầu).
- Tự động đồng bộ hóa Git từ `path` lên remote knowledge repo (thuộc trách nhiệm của hệ thống ngoài/user).

## Open Questions

Không còn câu hỏi mở nào gây chặn (0 blockers). Tất cả yêu cầu đã được làm rõ và thống nhất.

## Requirement Summary

| ID | Type | Title | Priority | Status |
|---|---|---|---|---|
| FR-001 | FR | Khởi tạo file spec_config.json mặc định | must | confirmed |
| FR-002 | FR | Phân giải đường dẫn tài liệu theo cấu hình | must | confirmed |
| FR-003 | FR | Onboarding gán tên project và khóa bất biến | must | confirmed |
| FR-004 | FR | Kiểm tra tính hợp lệ và fail-fast | must | confirmed |
| FR-005 | FR | Đồng bộ hóa toàn bộ kỹ năng và tài liệu điều phối | must | confirmed |
| BR-001 | BR | Ưu tiên fallback an toàn về repo cục bộ | must | confirmed |
| BR-002 | BR | Tính bất biến của Project Identifier | must | confirmed |
| NFR-001 | NFR | Tương thích ngược tuyệt đối khi override = false | must | confirmed |
| NFR-002 | NFR | Chuẩn hóa đường dẫn tương thích đa hệ điều hành | must | confirmed |
