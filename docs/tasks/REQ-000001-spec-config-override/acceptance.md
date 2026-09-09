# Acceptance: Cơ chế `spec_config.json` Override Path

> Authoritative: **Verification Truth** and Definition of Done.
> Contract: `.agents/contracts/spec-package.md`

## Metadata

- REQ ID: REQ-000001
- Feature: Cải tiến cơ chế tạo spec với spec_config.json override path
- Package: `docs/tasks/REQ-000001-spec-config-override/`
- Status: ready
- Last updated: 2026-09-09

## Definition of Done

- [ ] Tất cả AC liên quan Pass (AC-001 đến AC-005)
- [ ] Unit tests (UT) Pass với evidence
- [ ] System Test (ST) Pass với evidence
- [ ] UAT Pass với evidence
- [ ] Không còn blocker verification

## Acceptance Criteria

### AC-001 — Khởi tạo file cấu hình mặc định khi install
- Requirement References:
  - FR-001
  - BR-001
  - NFR-001

```gherkin
Given trình cài đặt 3a-factory được chạy trên một repository mới
When lệnh `node scripts/install.js --agent=all --apply` hoàn thành
Then file `.agents/configs/spec_config.json` phải tồn tại trong repository
And nội dung file phải chứa JSON hợp lệ với:
  """
  {
    "override": false,
    "project": "",
    "path": ""
  }
  """
And nếu file đã tồn tại và không có cờ `--force`, installer không được phép ghi đè mất cấu hình hiện tại
```

### AC-002 — Phân giải đường dẫn tài liệu theo cấu hình override
- Requirement References:
  - FR-002
  - BR-001
  - NFR-002

```gherkin
Given hệ thống đang chạy một kỹ năng trong quy trình SDLC (như triage hoặc spec)
When `.agents/configs/spec_config.json` có `override: false` (hoặc file không tồn tại)
Then đường dẫn `docs_root` phải được phân giải là `<repo_root>/docs/tasks/`

When `.agents/configs/spec_config.json` có `override: true`, `project: "skyorder-api"`, `path: "C:\\Documents\\knowledge"`
And thư mục `C:\Documents\knowledge` tồn tại và có quyền ghi
Then đường dẫn `docs_root` phải được phân giải là `C:\Documents\knowledge\skyorder-api\tasks\`
And gói spec REQ-000001 phải được tạo hoặc đọc tại `C:\Documents\knowledge\skyorder-api\tasks\REQ-000001-<slug>/`
```

### AC-003 — Onboarding gán tên project và bảo vệ tính bất biến
- Requirement References:
  - FR-003
  - BR-002

```gherkin
Given một repository mới được clone và chưa từng onboarding
And file `.agents/configs/spec_config.json` có `project: ""`
When kỹ năng `onboarding` được thực thi và xác nhận tên dự án là "skyorder-api"
Then trường `project` trong `.agents/configs/spec_config.json` phải được cập nhật thành "skyorder-api"

Given một repository đã hoàn thành onboarding trước đó
And file `.agents/configs/spec_config.json` đã có `project: "skyorder-api"`
When kỹ năng `onboarding` chạy lại trên repository này
Then trường `project` vẫn giữ nguyên giá trị "skyorder-api"
And agent ghi nhận thông báo cảnh báo `PROJECT_ALREADY_SET` mà không sửa đổi giá trị
```

### AC-004 — Xử lý lỗi cấu hình và dừng an toàn (Fail-Fast)
- Requirement References:
  - FR-004

```gherkin
Given `.agents/configs/spec_config.json` được thiết lập `override: true`
When trường `project` để trống `""`
Then hệ thống phải dừng xử lý và trả về mã lỗi `PROJECT_NOT_SET`

When trường `path` để trống hoặc trỏ tới thư mục không tồn tại / không có quyền truy cập
Then hệ thống phải dừng xử lý và trả về mã lỗi `CONFIG_PATH_INVALID`

When file `.agents/configs/spec_config.json` bị lỗi cú pháp JSON
Then hệ thống phải dừng xử lý hoặc phát cảnh báo `CONFIG_MALFORMED` và an toàn rơi về fallback
```

### AC-005 — Đồng bộ hóa đầy đủ 20 file trong pipeline
- Requirement References:
  - FR-005
  - NFR-001

```gherkin
Given toàn bộ các thay đổi được áp dụng vào kho mã nguồn 3a-factory
When kiểm tra nội dung của:
  - 1 template file (.agents/configs/spec_config.json)
  - 1 installer script (scripts/install.js)
  - 1 contract document (.agents/contracts/spec-package.md)
  - 15 skill documents (triage, analyze, requirements, design, tasks, acceptance, adr, spec, spec-review, develop, review, qa, converge, project-manager, onboarding)
  - 3 root governance documents (AGENTS.md, GEMINI.md, CLAUDE.md)
Then tất cả các file phải nhất quán tham chiếu về mục § 5.9 Path Resolution
And không có bất kỳ mâu thuẫn nào về quy tắc đặt tên hay cấu trúc thư mục
```

## Unit Test Requirements

### UT-001 — Kiểm tra Installer scaffolding `spec_config.json`
- Requirement References:
  - FR-001
- Design References:
  - DES-DATA-001
- Expected coverage:
  - Chạy `install.js` trong môi trường kiểm thử tạm thời và xác minh file `.agents/configs/spec_config.json` được tạo đúng định dạng và đúng giá trị mặc định.

### UT-002 — Kiểm tra thuật toán phân giải đường dẫn (Path Resolution Logic)
- Requirement References:
  - FR-002
  - NFR-002
- Design References:
  - DES-FLOW-001
- Expected coverage:
  - Trường hợp 1: file không tồn tại -> fallback repo_root.
  - Trường hợp 2: override = false -> fallback repo_root.
  - Trường hợp 3: override = true, path và project hợp lệ -> trả về `<path>/<project>/tasks`.
  - Chuẩn hóa dấu phân cách trên Windows và POSIX.

### UT-003 — Kiểm tra logic Onboarding Immutability Guard
- Requirement References:
  - FR-003
  - BR-002
- Design References:
  - DES-FLOW-002
- Expected coverage:
  - Hàm kiểm tra trạng thái của `project`: rỗng cho phép ghi, có giá trị từ chối ghi và trả về cảnh báo `PROJECT_ALREADY_SET`.

### UT-004 — Kiểm tra các trường hợp lỗi Validation
- Requirement References:
  - FR-004
- Design References:
  - DES-SEC-001
  - DES-OBS-001
- Expected coverage:
  - Báo lỗi khi `override: true` mà `project: ""` -> `PROJECT_NOT_SET`.
  - Báo lỗi khi `override: true` mà `path` không tồn tại -> `CONFIG_PATH_INVALID`.

## System Test Scenarios

### ST-001 — Kiểm thử toàn trình vòng đời Spec Package với `override: false` (Regression Test)
- Requirement References:
  - FR-002
  - NFR-001
- Preconditions: Repository có `.agents/configs/spec_config.json` với `override: false`.
- Steps:
  1. Chạy triage tạo package mới `REQ-000002-test-feature`.
  2. Xác minh package nằm tại `<repo_root>/docs/tasks/REQ-000002-test-feature/`.
  3. Chạy các skill tiếp theo (analyze, spec) và xác minh tất cả file tạo trong thư mục đó.
- Expected Result: Hệ thống hoạt động bình thường như phiên bản trước, không có sự sai lệch.

### ST-002 — Kiểm thử toàn trình vòng đời Spec Package với `override: true`
- Requirement References:
  - FR-002
  - FR-005
- Preconditions:
  - Tạo thư mục ngoài tạm thời `C:\temp_kb`.
  - Cấu hình `spec_config.json`: `override: true`, `project: "test-app"`, `path: "C:\\temp_kb"`.
- Steps:
  1. Chạy triage tạo package mới `REQ-000003-external-feature`.
  2. Kiểm tra vị trí package tạo ra.
- Expected Result:
  - Package được tạo tại `C:\temp_kb\test-app\tasks\REQ-000003-external-feature\`.
  - Trong repo hiện tại không xuất hiện thư mục `docs/tasks/REQ-000003-external-feature`.

## UAT Scenarios

### UAT-001 — Khách hàng cấu hình Knowledge Base tập trung cho nhiều repo
- Actor: Platform Engineer
- Requirement References:
  - FR-001
  - FR-002
  - FR-003
- Business Scenario:
  - Đội ngũ quản lý 2 repo microservices: `order-service` và `billing-service`.
  - Cả 2 repo đều cấu hình trỏ về chung `D:\EnterpriseKB` và lần lượt đặt `project: "order-service"`, `project: "billing-service"`.
- Expected Result:
  - Thư mục `D:\EnterpriseKB` chứa 2 namespace rõ ràng: `order-service/tasks/` và `billing-service/tasks/`.
  - Tài liệu của 2 service không bị xung đột hay lẫn lộn mã package.

### UAT-002 — Người dùng chạy onboarding lại repo cũ
- Actor: Developer
- Requirement References:
  - FR-003
  - BR-002
- Business Scenario:
  - Developer vô tình chạy lại lệnh `/onboarding` trên repo đã hoạt động ổn định với project `skyorder-api`.
- Expected Result:
  - Hệ thống cảnh báo giá trị project đã được cố định, giữ nguyên `skyorder-api`, tiếp tục hoàn thành các pha kiểm tra khác mà không làm hỏng cấu hình knowledge base.

## Coverage Matrix

| Requirement | AC | UT | ST | UAT | PERF | SEC |
|---|---|---|---|---|---|---|
| FR-001 | AC-001 | UT-001 | ST-001 | UAT-001 | — | — |
| FR-002 | AC-002 | UT-002 | ST-001, ST-002 | UAT-001 | — | — |
| FR-003 | AC-003 | UT-003 | ST-002 | UAT-001, UAT-002 | — | — |
| FR-004 | AC-004 | UT-004 | — | — | — | — |
| FR-005 | AC-005 | — | ST-001, ST-002 | UAT-001 | — | — |
| BR-001 | AC-002 | UT-002 | ST-001 | — | — | — |
| BR-002 | AC-003 | UT-003 | — | UAT-002 | — | — |
| NFR-001 | AC-001 | — | ST-001 | — | — | — |
| NFR-002 | AC-002 | UT-002 | — | — | — | — |

## Open Verification Questions

Không có câu hỏi mở nào gây chặn (0 blockers).
