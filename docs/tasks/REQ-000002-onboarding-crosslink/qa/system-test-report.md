# Báo cáo Kiểm thử Hệ thống (System Test Report)

> Authoritative: **QA System Test Evidence**  
> Package: `docs/tasks/REQ-000002-onboarding-crosslink/`  
> Acceptance reference: `acceptance.md` (AC-001, AC-002, Mục 3 - Kết quả mong đợi)  
> Contract reference: `.agents/contracts/spec-package.md` § 5.9  

## Metadata

- **REQ ID**: REQ-000002
- **Feature**: Bổ sung Cross-link vào docs/project_overview.md
- **Package Path**: `docs/tasks/REQ-000002-onboarding-crosslink/`
- **QA Engineer**: QA Automation Engineer
- **Thời gian thực hiện**: 2026-09-10T23:25:30+07:00
- **Kết quả tổng thể System Test**: **PASSED** (2/2 scenarios đạt)

---

## Mục tiêu và Phạm vi Kiểm thử Hệ thống

Đánh giá tính tương thích và khả năng phối hợp của kỹ năng `onboarding` sau khi được bổ sung mục cross-link đối với toàn bộ hệ sinh thái 3A-Factory:
1. **Khả năng sinh tài liệu đúng quy chuẩn trong kịch bản repo thông thường**: Đảm bảo `docs/project_overview.md` chỉ điểm chính xác `docs/tasks/REQ-*` khi `override: false`.
2. **Khả năng sinh tài liệu đúng quy chuẩn trong kịch bản Knowledge Base tập trung ngoài repo**: Đảm bảo `docs/project_overview.md` chỉ điểm chính xác `<path>/<project>/tasks/REQ-*` khi `override: true`.
3. **Tính nhất quán giữa các kỹ năng và hợp đồng Spec Package § 5.9**.

---

## Chi tiết Kịch bản Kiểm thử Hệ thống

### ST-001 — Kiểm định tính nhất quán của Onboarding khi `spec_config.json` ở chế độ mặc định (`override: false`)

- **Yêu cầu liên kết**: REQ-000002 Yêu cầu 1 & 2
- **Tiêu chí nghiệm thu**: AC-001, AC-002, AC-Kết quả mong đợi
- **Bối cảnh thử nghiệm**:
  - Repo có cấu hình `.agents/configs/spec_config.json` mặc định:
    ```json
    {
      "override": false,
      "project": "my-app",
      "path": ""
    }
    ```
- **Các bước thực hiện**:
  1. Tác tử Onboarding được kích hoạt cho dự án mới hoặc dự án hiện có.
  2. Tác tử tiến hành thu thập thông tin và tạo/cập nhật `docs/project_overview.md` theo hướng dẫn Phase D tại [.agents/skills/onboarding/SKILL.md](file:///c:/Users/ADMIN/Documents/4_AI/1_Projects/3a-factory/.agents/skills/onboarding/SKILL.md#L147-L151).
  3. Tác tử đọc mục 13 "Knowledge Base & Feature Specs" trong hướng dẫn Phase D.
  4. Vì `spec_config.json` có `override: false`, tác tử tạo section 13 chỉ điểm tài liệu đặc tả chức năng (Spec Packages) nằm tại `docs/tasks/REQ-*`.
- **Kết quả kỳ vọng**:
  - File `docs/project_overview.md` có đầy đủ mục "13. Knowledge Base & Feature Specs" hướng dẫn rõ đường dẫn lưu trữ nội bộ `docs/tasks/REQ-*`.
  - Các lập trình viên hoặc AI Agent tiếp theo khi đọc `docs/project_overview.md` đều xác định được ngay thư mục chứa đặc tả tính năng trong repo.
- **Đánh giá ST-001**: **PASSED**.

---

### ST-002 — Kiểm định tính nhất quán của Onboarding khi `spec_config.json` kích hoạt chế độ tập trung (`override: true`)

- **Yêu cầu liên kết**: REQ-000002 Yêu cầu 1 & 2
- **Tiêu chí nghiệm thu**: AC-001, AC-002, AC-Kết quả mong đợi
- **Bối cảnh thử nghiệm**:
  - Repo có cấu hình kho tri thức tập trung:
    ```json
    {
      "override": true,
      "project": "skyorder-api",
      "path": "C:\\KnowledgeBase"
    }
    ```
- **Các bước thực hiện**:
  1. Tác tử Onboarding được kích hoạt cho dự án `skyorder-api`.
  2. Tác tử đọc cấu hình `spec_config.json`, phát hiện `override: true`, `project: "skyorder-api"`, `path: "C:\\KnowledgeBase"`.
  3. Khi sinh `docs/project_overview.md`, tác tử áp dụng chỉ dẫn mục 13:
     - Đường dẫn tài liệu Spec Packages được chỉ định là ngoài repo: `C:\KnowledgeBase\skyorder-api\tasks\REQ-*`.
- **Kết quả kỳ vọng**:
  - File `docs/project_overview.md` cung cấp thông tin liên kết cross-link chính xác trỏ ra kho tri thức ngoài mà không làm sai lệch tài liệu nội bộ trong repo.
  - Phù hợp hoàn toàn với quy tắc Contract § 5.9.6 (Repo-level documentation: `docs/project_overview.md` nằm trong repo cục bộ nhưng trỏ đúng sang kho Spec Package ngoài).
- **Đánh giá ST-002**: **PASSED**.

---

## Bảng Tổng hợp Kết quả System Test

| Scenario ID | Tên kịch bản | Yêu cầu | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| **ST-001** | Onboarding Cross-link với `override: false` | REQ-000002 Yêu cầu 1 & 2 | Chỉ điểm chính xác `docs/tasks/REQ-*` trong `docs/project_overview.md` | Hướng dẫn rõ ràng, logic nhất quán | **PASSED** |
| **ST-002** | Onboarding Cross-link với `override: true` | REQ-000002 Yêu cầu 1 & 2 | Chỉ điểm chính xác `<path>/<project>/tasks/REQ-*` trong `docs/project_overview.md` | Hướng dẫn rõ ràng, đúng chuẩn Contract § 5.9 | **PASSED** |
