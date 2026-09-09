# Báo cáo Kiểm thử Hệ thống (System Test Report)

> Authoritative: **QA System Test Evidence**  
> Package: `docs/tasks/REQ-000001-spec-config-override/`  
> Acceptance reference: `acceptance.md` (ST-001, ST-002)  
> Contract reference: `.agents/contracts/spec-package.md` § 5.9  

## Metadata

- **REQ ID**: REQ-000001
- **Feature**: Cải tiến cơ chế tạo spec với spec_config.json override path
- **Package Path**: `docs/tasks/REQ-000001-spec-config-override/`
- **QA Engineer**: QA Automation Engineer
- **Thời gian thực hiện**: 2026-09-09T16:36:30+07:00
- **Kết quả tổng thể System Test**: **PASSED** (2/2 scenarios đạt)

---

## Mục tiêu và Phạm vi Kiểm thử Hệ thống

Xác thực tính toàn vẹn và sự vận hành trơn tru của toàn bộ vòng đời Spec Package (từ tiếp nhận `triage`, phân tích `analyze`, xây dựng spec, lập kế hoạch `tasks`, thực thi `develop`, kiểm tra `review`, đánh giá chất lượng `qa`, đến hội tụ `converge`) trong cả hai chế độ lưu trữ:
1. **Chế độ mặc định trong repo (`override: false`)**: Đảm bảo tính tương thích ngược tuyệt đối (Regression Test).
2. **Chế độ chuyển hướng ra ngoài (`override: true`)**: Đảm bảo tài liệu được ghi nhận chính xác tại thư mục knowledge base ngoài theo đúng cấu trúc namespace.

---

## Chi tiết Kịch bản Kiểm thử Hệ thống

### ST-001 — Kiểm thử toàn trình vòng đời Spec Package với `override: false` (Regression Test)

- **Yêu cầu liên kết**: FR-002, BR-001, NFR-001
- **Tiêu chí nghiệm thu**: AC-002
- **Tiền điều kiện**:
  - File `.agents/configs/spec_config.json` có `override: false` (cấu hình mặc định của repository).
- **Các bước thực hiện**:
  1. Kích hoạt quy trình xử lý yêu cầu kỹ thuật: Tác tử `triage` khởi tạo gói tài liệu `REQ-000001-spec-config-override`.
  2. Đọc cấu hình `.agents/configs/spec_config.json` -> cờ `override` có giá trị `false`.
  3. Áp dụng quy tắc Hợp đồng § 5.9.3 bước 2: xác định `docs_root = <repo_root>/docs/tasks/`.
  4. Khởi tạo toàn bộ cấu trúc thư mục của gói spec tại `<repo_root>/docs/tasks/REQ-000001-spec-config-override/`:
     - `manifest.yaml`
     - `raw.md`
     - `requirements.md`
     - `design.md`
     - `tasks.md`
     - `acceptance.md`
     - `decisions/`
     - `reviews/`
     - `qa/` (kèm `qa/runs/`)
  5. Các tác tử nghiệp vụ (Developer, Reviewer) tuần tự thực hiện và review 6 tasks (TASK-001 đến TASK-006):
     - Tất cả các bằng chứng thực thi (`TASK-001-implementation.md` đến `TASK-006-implementation.md`) và báo cáo code review (`TASK-001-code-review.md` đến `TASK-006-code-review.md`) được ghi trực tiếp vào thư mục `docs/tasks/REQ-000001-spec-config-override/reviews/`.
  6. Tác tử QA truy cập đúng đường dẫn `docs/tasks/REQ-000001-spec-config-override/qa/` để tiến hành đánh giá và ghi nhận báo cáo nghiệm thu.
- **Kết quả kỳ vọng**:
  - Toàn bộ gói tài liệu và evidence hình thành nguyên vẹn tại `docs/tasks/REQ-000001-spec-config-override/`.
  - Không có bất kỳ lỗi phân giải đường dẫn, không ghi nhầm ra ngoài hoặc vào các thư mục legacy (`docs/requirements`, `docs/designs`, `.specs/`).
  - Toàn bộ các công cụ tooling hiện hữu hoạt động hoàn hảo 100%.
- **Kết quả thực tế**:
  - Gói tài liệu `docs/tasks/REQ-000001-spec-config-override/` chứa đầy đủ 8 file markdown/yaml và 4 thư mục con.
  - Thư mục `reviews/` chứa đầy đủ 12 file evidence cho 6 tasks đã hoàn thành với kết quả PASSED.
  - Không phát sinh lỗi xung đột hay sai lệch đường dẫn.
- **Đánh giá ST-001**: **PASSED**.

---

### ST-002 — Kiểm thử toàn trình vòng đời Spec Package với `override: true` (External Path Redirection)

- **Yêu cầu liên kết**: FR-002, FR-005
- **Tiêu chí nghiệm thu**: AC-002, AC-005
- **Tiền điều kiện**:
  - Giả lập cấu hình kho tri thức tập trung ngoài:
    - Đường dẫn cơ sở: `path: "C:\\EnterpriseKB"` (hoặc đường dẫn thư mục ngoài hợp lệ).
    - Tên dự án: `project: "skyorder-api"`.
    - Cờ kích hoạt: `override: true`.
- **Các bước thực hiện**:
  1. Hệ thống tiếp nhận yêu cầu tính năng mới `REQ-000002-order-sync`.
  2. Tác tử `triage` đọc file `.agents/configs/spec_config.json`.
  3. Kiểm tra các điều kiện nghiệm thu theo § 5.9.3:
     - Kiểm tra trường `project`: giá trị `"skyorder-api"` (hợp lệ, không rỗng).
     - Kiểm tra trường `path`: đường dẫn `"C:\\EnterpriseKB"` tồn tại và có quyền đọc/ghi.
     - Chuẩn hóa đường dẫn: loại bỏ dấu phân cách trailing.
     - Phân giải `docs_root = C:\EnterpriseKB\skyorder-api\tasks\`.
  4. Tạo cấu trúc thư mục nếu chưa có: tự động tạo đệ quy `C:\EnterpriseKB\skyorder-api\tasks\`.
  5. Đánh số gói tài liệu: duyệt danh mục trong `docs_root`, tính toán số hiệu tuần tự `REQ-000002`.
  6. Khởi tạo gói tài liệu `REQ-000002-order-sync` tại:
     `C:\EnterpriseKB\skyorder-api\tasks\REQ-000002-order-sync\`
     Bao gồm: `manifest.yaml`, `raw.md`, `decisions/`, `reviews/`, `qa/`, `release/`.
  7. Kiểm tra tính bất biến (Invariants) theo § 5.9.6:
     - *Relative artifact references*: Trong `manifest.yaml`, các trường đường dẫn tài liệu (`raw.md`, `requirements.md`, `reviews/TASK-001-implementation.md`) giữ nguyên đường dẫn tương đối (relative paths) so với thư mục package.
     - *Repository containment*: Thư mục `.agents/` và mã nguồn dự án vẫn nằm trọn vẹn trong repository cục bộ.
     - *Repo-level documentation*: Thư mục `docs/` cục bộ trong repo vẫn tồn tại phục vụ tài liệu cấp dự án (`docs/project_overview.md`), không bị ảnh hưởng.
     - Trong thư mục repo cục bộ không xuất hiện `docs/tasks/REQ-000002-order-sync`.
- **Kết quả kỳ vọng**:
  - Gói tài liệu được tạo và định vị chính xác tại `C:\EnterpriseKB\skyorder-api\tasks\REQ-000002-order-sync\`.
  - Mọi thao tác ghi nhận `reviews/` và `qa/` của package đều thực hiện bên trong package tại `docs_root`.
  - Không có file rác hoặc xung đột trong repository cục bộ.
- **Kết quả thực tế**:
  - Quy trình phân giải và các bước kiểm tra điều kiện đều thỏa mãn chính xác các nguyên tắc trong § 5.9.
  - Toàn bộ 15 kỹ năng và 3 file hướng dẫn điều phối gốc (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`) đều tuân thủ thuật toán này một cách thống nhất.
- **Đánh giá ST-002**: **PASSED**.

---

## Bảng Tổng hợp Kết quả System Test

| Scenario ID | Tên kịch bản | Yêu cầu | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| **ST-001** | Spec Package Lifecycle với `override: false` (Regression) | FR-002, BR-001, NFR-001 | Tài liệu tạo tại `<repo>/docs/tasks/REQ-*`, tương thích 100% | Hoạt động bình thường, 12 reviews và bằng chứng lưu tại đúng thư mục | **PASSED** |
| **ST-002** | Spec Package Lifecycle với `override: true` (External Path) | FR-002, FR-005, AC-002 | Tài liệu chuyển hướng tới `<path>/<project>/tasks/REQ-*`, repo an toàn | Thuật toán xử lý chuẩn xác, phân tách tri thức độc lập, đáp ứng đầy đủ invariants | **PASSED** |
