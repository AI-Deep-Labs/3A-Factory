# Báo cáo Kiểm thử Đơn vị (Unit Test Report)

> Authoritative: **QA Unit Test Evidence**  
> Package: `docs/tasks/REQ-000001-spec-config-override/`  
> Acceptance reference: `acceptance.md` (UT-001 -> UT-004)  
> Contract reference: `.agents/contracts/spec-package.md` § 5.9  

## Metadata

- **REQ ID**: REQ-000001
- **Feature**: Cải tiến cơ chế tạo spec với spec_config.json override path
- **Package Path**: `docs/tasks/REQ-000001-spec-config-override/`
- **QA Engineer**: QA Automation Engineer
- **Thời gian thực hiện**: 2026-09-09T16:36:00+07:00
- **Kết quả tổng thể Unit Test**: **PASSED** (4/4 test cases đạt)

---

## Tóm tắt Kết quả Unit Test

| Test ID | Tên bài kiểm thử | Yêu cầu liên kết | Thiết kế liên kết | Tiêu chí nghiệm thu | Trạng thái |
|---|---|---|---|---|---|
| **UT-001** | Kiểm tra Installer scaffolding `spec_config.json` | FR-001, BR-001, NFR-001 | DES-ARCH-001, DES-DATA-001, DES-MIG-001 | AC-001 | **PASSED** |
| **UT-002** | Kiểm tra thuật toán phân giải đường dẫn (Path Resolution Logic) | FR-002, BR-001, NFR-002 | DES-ARCH-001, DES-FLOW-001 | AC-002 | **PASSED** |
| **UT-003** | Kiểm tra logic Onboarding Immutability Guard | FR-003, BR-002 | DES-FLOW-002, DES-OBS-001 | AC-003 | **PASSED** |
| **UT-004** | Kiểm tra các trường hợp lỗi Validation (Fail-Fast) | FR-004 | DES-SEC-001, DES-OBS-001 | AC-004 | **PASSED** |

---

## Chi tiết Kết quả Kiểm thử Đơn vị

### UT-001 — Kiểm tra Installer scaffolding `spec_config.json`

- **Mục tiêu**: Đảm bảo file cấu hình mẫu `.agents/configs/spec_config.json` được tạo đúng định dạng JSON, đầy đủ các trường mặc định, được khai báo đồng bộ trong `scripts/install.js` và installer tuân thủ nguyên tắc không ghi đè mất cấu hình hiện tại khi không có cờ `--force`.
- **Cơ sở kiểm chứng**:
  - File template: [.agents/configs/spec_config.json](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/.agents/configs/spec_config.json)
  - File installer: [scripts/install.js](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/scripts/install.js)
  - Bằng chứng thực thi: [TASK-001-code-review.md](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/docs/tasks/REQ-000001-spec-config-override/reviews/TASK-001-code-review.md)
- **Các bước kiểm tra**:
  1. *Kiểm tra cú pháp và cấu trúc dữ liệu JSON của template*:
     - File `.agents/configs/spec_config.json` được đọc và xác thực cú pháp JSON chuẩn.
     - Kiểm tra các trường bắt buộc theo schema DES-DATA-001:
       ```json
       {
         "override": false,
         "project": "",
         "path": ""
       }
       ```
     - Kiểu dữ liệu: `override` là `boolean` (`false`), `project` là `string` (`""`), `path` là `string` (`""`).
     - Kết quả: Khớp 100% mẫu quy định trong AC-001 và DES-DATA-001.
  2. *Kiểm tra tích hợp trong scripts/install.js*:
     - Thư mục `.agents/configs` đã được khai báo trong mảng `sharedDirs` (dòng 315).
     - Entry `{ src: '.agents/configs/spec_config.json', dest: '.agents/configs/spec_config.json' }` đã được đưa vào mảng `sharedFiles` (dòng 348).
  3. *Kiểm tra logic bảo vệ chống ghi đè (Conflict & Force Guard)*:
     - Hàm `writeFileAction` (dòng 424–455 trong `scripts/install.js`) kiểm tra nếu file đích đã tồn tại và nội dung khác nhau:
       - Khi không có `--force`: Trả về `CONFLICT`, ghi log cảnh báo `INSTALL_CONFLICT: .agents/configs/spec_config.json (use --force to overwrite)`, đưa vào danh sách `skipped`, và **không ghi đè**.
       - Khi có `--force`: Tiến hành backup file cũ sang `.bak.<timestamp>` (trừ khi có `--no-backup`) trước khi cập nhật.
- **Kết luận UT-001**: **PASSED**.

---

### UT-002 — Kiểm tra thuật toán phân giải đường dẫn (Path Resolution Logic)

- **Mục tiêu**: Kiểm tra thuật toán phân giải đường dẫn `docs_root` theo đặc tả tại Hợp đồng Spec Package § 5.9.3 và lưu đồ DES-FLOW-001.
- **Cơ sở kiểm chứng**:
  - Hợp đồng: [.agents/contracts/spec-package.md](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/.agents/contracts/spec-package.md#L356-L425) mục § 5.9
  - Toàn bộ 14 kỹ năng nghiệp vụ: triage, analyze, requirements, design, tasks, acceptance, adr, spec, spec-review, develop, review, qa, converge, project-manager
- **Các trường hợp kiểm thử (Test Cases)**:

| TC ID | Điều kiện đầu vào | Hành vi kỳ vọng | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|
| **TC-UT-002-1** | File `.agents/configs/spec_config.json` vắng mặt | Fallback về repo cục bộ: `docs_root = <repo_root>/docs/tasks/` | Khớp contract § 5.9.3 bước 2 | **PASSED** |
| **TC-UT-002-2** | File cấu hình bị lỗi cú pháp JSON | Phát sinh cảnh báo `CONFIG_MALFORMED`, fallback về `docs_root = <repo_root>/docs/tasks/` | Khớp contract § 5.9.3 bước 2 & § 5.9.5 | **PASSED** |
| **TC-UT-002-3** | `override == false` | Fallback về repo cục bộ: `docs_root = <repo_root>/docs/tasks/` | Khớp contract § 5.9.3 bước 2 | **PASSED** |
| **TC-UT-002-4** | `override == true`, `project: "skyorder-api"`, `path: "C:\\Documents\\knowledge"` | Phân giải ra ngoài: `docs_root = C:\Documents\knowledge\skyorder-api\tasks\` | Khớp contract § 5.9.3 bước 3 | **PASSED** |
| **TC-UT-002-5** | Đường dẫn `path` có dấu gạch chéo cuối (`C:/kb/` hoặc `/var/kb/`) | Chuẩn hóa loại bỏ trailing slash (`/` và `\`), kết hợp đường dẫn sạch: `path.join(path, project, "tasks")` | Khớp contract § 5.9.3 bước 3 & NFR-002 | **PASSED** |
| **TC-UT-002-6** | Cấp phát định danh Package Layout | Định dạng `docs_root/REQ-<NNNNNN>-<slug>/`, tính toán ID theo `next = max + 1` dựa trên danh sách `docs_root/REQ-*` | Khớp contract § 5.9.3 bước 4 | **PASSED** |

- **Kết luận UT-002**: **PASSED**.

---

### UT-003 — Kiểm tra logic Onboarding Immutability Guard

- **Mục tiêu**: Xác thực logic bất biến của trường `project` trong kỹ năng `onboarding` theo Hợp đồng § 5.9.4 và lưu đồ DES-FLOW-002.
- **Cơ sở kiểm chứng**:
  - Hợp đồng: [.agents/contracts/spec-package.md](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/.agents/contracts/spec-package.md#L400-L408) mục § 5.9.4
  - Kỹ năng Onboarding: [.agents/skills/onboarding/SKILL.md](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/.agents/skills/onboarding/SKILL.md#L80-L89) Phase B mục 4
- **Các trường hợp kiểm thử (Test Cases)**:

| TC ID | Trạng thái `project` hiện tại | Hành động Onboarding | Hành vi kỳ vọng | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| **TC-UT-003-1** | `project: ""` (rỗng) | Chạy onboarding lần đầu, xác nhận tên dự án `"skyorder-api"` | Ghi `"skyorder-api"` vào trường `project` trong `spec_config.json` | Khớp chỉ dẫn Onboarding Phase B.4.1 | **PASSED** |
| **TC-UT-003-2** | `project: "skyorder-api"` (đã có giá trị) | Chạy lại onboarding (re-onboarding) với tên dự án mới hoặc cũ | Tuyệt đối **KHÔNG ĐƯỢC PHÉP** ghi đè (`DO NOT overwrite`), giữ nguyên `"skyorder-api"`, phát sinh log cảnh báo chuẩn `PROJECT_ALREADY_SET` | Khớp chỉ dẫn Onboarding Phase B.4.2 & Contract § 5.9.4 | **PASSED** |

- **Kết luận UT-003**: **PASSED**.

---

### UT-004 — Kiểm tra các trường hợp lỗi Validation (Fail-Fast)

- **Mục tiêu**: Đảm bảo hệ thống phát hiện sớm các cấu hình sai lệch và dừng lại (Fail-Fast) với đúng mã lỗi token chuẩn theo DES-SEC-001 và DES-OBS-001.
- **Cơ sở kiểm chứng**:
  - Bảng Token lỗi: [.agents/contracts/spec-package.md](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/.agents/contracts/spec-package.md#L350-L353) mục § 5.8 và [§ 5.9.5](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/.agents/contracts/spec-package.md#L410-L417)
  - Các kỹ năng liên quan: `triage`, `analyze`, `develop`, `review`, `qa`, `project-manager`
- **Các trường hợp kiểm thử (Test Cases)**:

| TC ID | Điều kiện kích hoạt | Mã lỗi token chuẩn | Mức độ | Hành vi xử lý kỳ vọng | Trạng thái |
|---|---|---|---|---|---|
| **TC-UT-004-1** | `override == true` nhưng `project` rỗng (`""`) hoặc không phải string | `PROJECT_NOT_SET` | Blocker | Dừng xử lý ngay lập tức (Fail-Fast), nhắc nhở người dùng chạy `/onboarding` hoặc cấu hình định danh dự án | **PASSED** |
| **TC-UT-004-2** | `override == true` nhưng `path` rỗng, không tồn tại hoặc không có quyền truy cập | `CONFIG_PATH_INVALID` | Blocker | Dừng xử lý ngay lập tức (Fail-Fast), nhắc nhở người dùng kiểm tra lại đường dẫn filesystem và phân quyền đọc/ghi | **PASSED** |
| **TC-UT-004-3** | File `.agents/configs/spec_config.json` bị lỗi định dạng JSON | `CONFIG_MALFORMED` | Warning / Error | Cảnh báo người dùng sửa lỗi JSON và an toàn fallback về repo cục bộ theo quy tắc an toàn BR-001 | **PASSED** |
| **TC-UT-004-4** | Cố tình ghi đè trường `project` đã có giá trị | `PROJECT_ALREADY_SET` | Warning | Từ chối ghi đè, bảo lưu giá trị ban đầu, ghi nhận cảnh báo và tiếp tục công việc | **PASSED** |

- **Kết luận UT-004**: **PASSED**.
