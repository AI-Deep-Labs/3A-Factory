# Báo cáo Kiểm thử Chấp nhận Người dùng (User Acceptance Test Report)

> Authoritative: **QA UAT Evidence**  
> Package: `docs/tasks/REQ-000001-spec-config-override/`  
> Acceptance reference: `acceptance.md` (UAT-001, UAT-002)  
> Contract reference: `.agents/contracts/spec-package.md` § 5.9  

## Metadata

- **REQ ID**: REQ-000001
- **Feature**: Cải tiến cơ chế tạo spec với spec_config.json override path
- **Package Path**: `docs/tasks/REQ-000001-spec-config-override/`
- **QA Engineer**: QA Automation Engineer
- **Thời gian thực hiện**: 2026-09-09T16:36:45+07:00
- **Kết quả tổng thể UAT**: **PASSED** (2/2 scenarios đạt)

---

## Mục tiêu Nghiệm thu Nghiệp vụ (Business Goals)

Kiểm chứng tính hữu dụng và giá trị thực tế của cơ chế `spec_config.json` override path từ góc nhìn của người dùng nghiệp vụ và đội ngũ quản trị nền tảng:
1. **Khả năng quy hoạch kho tri thức dùng chung (Enterprise Knowledge Base)** cho mô hình đa dịch vụ (microservices/multi-repo).
2. **Khả năng bảo vệ dữ liệu và tính nhất quán (Data Integrity & Safety Guard)**, ngăn chặn các thao tác nhầm lẫn làm hỏng cấu hình tri thức của dự án.

---

## Chi tiết Kịch bản Kiểm thử Chấp nhận Người dùng (UAT Scenarios)

### UAT-001 — Khách hàng cấu hình Knowledge Base tập trung cho nhiều repo

- **Vai trò người dùng (Actor)**: Platform Engineer / Kiến trúc sư Hệ thống (Enterprise Architect)
- **Yêu cầu liên kết**: FR-001, FR-002, FR-003, BR-001
- **Tiêu chí nghiệm thu**: AC-001, AC-002, AC-003
- **Bối cảnh thực tế của doanh nghiệp**:
  - Doanh nghiệp sở hữu nhiều repository mã nguồn độc lập tương ứng với các microservice khác nhau, ví dụ:
    - Kho mã nguồn 1: `order-service`
    - Kho mã nguồn 2: `billing-service`
  - Đội ngũ muốn toàn bộ tài liệu kiến trúc, quy trình nghiệp vụ và các gói Spec Package (`REQ-*`) được lưu trữ tập trung về một kho tri thức chung (đặt tại `D:\EnterpriseKB`), cho phép lãnh đạo và các nhóm dễ dàng liên kết, tìm kiếm chéo (cross-service search) và tra cứu toàn diện.
- **Thiết lập thử nghiệm**:
  1. *Tại repository `order-service`*:
     - File `.agents/configs/spec_config.json` được thiết lập:
       ```json
       {
         "override": true,
         "project": "order-service",
         "path": "D:\\EnterpriseKB"
       }
       ```
  2. *Tại repository `billing-service`*:
     - File `.agents/configs/spec_config.json` được thiết lập:
       ```json
       {
         "override": true,
         "project": "billing-service",
         "path": "D:\\EnterpriseKB"
       }
       ```
- **Hành vi hệ thống ghi nhận**:
  - Khi tác tử trên repo `order-service` chạy triage/spec:
    - Đường dẫn tài liệu được phân giải thành `D:\EnterpriseKB\order-service\tasks\`.
    - Gói tài liệu `REQ-000001-create-order` được tạo tại `D:\EnterpriseKB\order-service\tasks\REQ-000001-create-order\`.
  - Khi tác tử trên repo `billing-service` chạy triage/spec:
    - Đường dẫn tài liệu được phân giải thành `D:\EnterpriseKB\billing-service\tasks\`.
    - Gói tài liệu `REQ-000001-generate-invoice` được tạo tại `D:\EnterpriseKB\billing-service\tasks\REQ-000001-generate-invoice\`.
- **Đánh giá kết quả nghiệp vụ**:
  - Thư mục tập trung `D:\EnterpriseKB` hình thành hai namespace hoàn toàn độc lập, rõ ràng:
    - `D:\EnterpriseKB\order-service\tasks\`
    - `D:\EnterpriseKB\billing-service\tasks\`
  - Số hiệu `REQ-000001` của hai service không bị đè lên nhau, không gây xung đột và giữ tính độc lập theo từng dự án.
  - Các công cụ quản lý tri thức (như Obsidian, Visual Studio Code) mở thư mục `D:\EnterpriseKB` có thể thấy cây thư mục tri thức hoàn chỉnh của cả tổ chức.
- **Kết luận UAT-001**: **PASSED**.

---

### UAT-002 — Người dùng chạy onboarding lại repo cũ (Onboarding Re-run Immutability)

- **Vai trò người dùng (Actor)**: Kỹ sư phát triển (Developer) / Kỹ sư DevOps
- **Yêu cầu liên kết**: FR-003, BR-002
- **Tiêu chí nghiệm thu**: AC-003
- **Bối cảnh thực tế của doanh nghiệp**:
  - Dự án `skyorder-api` đã được tích hợp 3a-factory và hoàn tất quá trình onboarding trước đó, với định danh `project: "skyorder-api"` trỏ đến kho tri thức ngoài.
  - Một lập trình viên mới tham gia dự án hoặc một lập trình viên vô tình thực thi lại lệnh `/onboarding` để kiểm tra môi trường hoặc cập nhật agent rules.
- **Thiết lập thử nghiệm**:
  - File `.agents/configs/spec_config.json` hiện hữu:
    ```json
    {
      "override": true,
      "project": "skyorder-api",
      "path": "D:\\EnterpriseKB"
    }
    ```
  - Developer gọi kỹ năng onboarding: `/onboarding`.
- **Hành vi hệ thống ghi nhận**:
  - Kỹ năng `onboarding` tiến hành thực thi đến Phase B (bước 4 — Configure `spec_config.json` project identifier).
  - Tác tử kiểm tra giá trị của trường `project`: nhận thấy trường này đã chứa giá trị khác rỗng (`"skyorder-api"`).
  - Tác tử tuân thủ nghiêm ngặt nguyên tắc bất biến (Immutability Guard theo Contract § 5.9.4):
    - **Không thực hiện ghi đè** hay xóa bỏ giá trị hiện tại.
    - Xuất thông báo cảnh báo rõ ràng trong log:
      `PROJECT_ALREADY_SET: project is already set to 'skyorder-api'. Preserving existing value.`
    - Tác tử tiếp tục hoàn thành các bước tiếp theo của Phase C, D, E (cập nhật context cho agent) một cách bình thường.
- **Đánh giá kết quả nghiệp vụ**:
  - Giá trị định danh `"skyorder-api"` được bảo vệ toàn vẹn tuyệt đối.
  - Loại bỏ hoàn toàn rủi ro đổi tên namespace khiến các gói tài liệu đã tạo trước đó trong kho tri thức dùng chung bị mất liên kết hoặc phân tán.
  - Trải nghiệm người dùng mượt mà, thông điệp cảnh báo rõ nghĩa và mang tính xây dựng.
- **Kết luận UAT-002**: **PASSED**.

---

## Bảng Tổng hợp Kết quả UAT

| Scenario ID | Tên kịch bản | Đối tượng sử dụng | Mục tiêu nghiệp vụ | Đánh giá giá trị mang lại | Trạng thái |
|---|---|---|---|---|---|
| **UAT-001** | Multi-repo Centralization Knowledge Base | Platform Engineer / Architect | Quản lý tài liệu tập trung cho nhiều repo microservices | Tách biệt namespace sạch sẽ, phân quyền linh hoạt, tra cứu tri thức tập trung | **PASSED** |
| **UAT-002** | Onboarding Re-run Immutability Guard | Developer / DevOps | Bảo vệ cấu hình project name khi chạy lại onboarding | Ngăn chặn việc ghi đè làm hỏng liên kết tri thức, tăng độ tin cậy và an toàn của pipeline | **PASSED** |
