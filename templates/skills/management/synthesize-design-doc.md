---
name: synthesize-design-doc
description: Convert full client-AI discussion context into a professional BRD, TDD, Functional Spec, Handoff, QA input, or analysis summary under .agents/. Use when user asks to summarize, consolidate, document, or transform a conversation into requirement or design documents.
disable-model-invocation: false
---

# Synthesize Design Document Skill

## Purpose

Kỹ năng này giúp Agent phân tích toàn bộ ngữ cảnh cuộc hội thoại (đặc biệt là các cuộc thảo luận rời rạc, Q&A, quyết định kỹ thuật dở dang) giữa Client và AI, sau đó tổng hợp, chuẩn hóa và đóng gói thành tài liệu đặc tả thiết kế chuyên nghiệp phục vụ cho các bên liên quan (Business, Product, Dev, QA, Architect).

Tài liệu được tạo ra sẽ được lưu trữ cục bộ dưới dạng các tệp tin Markdown (.md) trong dự án để các Agent tiếp theo có thể dễ dàng tái sử dụng.

---

## Output Contract

Tất cả các tài liệu được tạo ra từ kỹ năng này **phải được viết bằng tiếng Việt** (hoặc tiếng Anh nếu người dùng yêu cầu rõ ràng), giữ nguyên các thuật ngữ kỹ thuật tiêu chuẩn để đảm bảo tính chuyên nghiệp và chính xác.

Tệp tin đầu ra sẽ được lưu vào:
*   Yêu cầu nghiệp vụ / Đặc tả chức năng: `.agents/requirements/REQ-[short-name].md`
*   Đặc tả kỹ thuật / Kiến trúc / Thiết kế hệ thống: `.agents/specs/SPEC-[short-name].md` (hoặc định dạng kết hợp nếu không chỉ định rõ).
*   Biên bản phân tích / Handoff / Quyết định: `.agents/decisions/ADR-[short-name].md` hoặc `.agents/compact/HAN-*.md` tùy thuộc vào nội dung.

---

## Các Chế độ Tài liệu (Document Modes)

Tùy vào yêu cầu của người dùng, Agent sẽ chọn một trong các chế độ tối ưu sau:

### Chế độ 1: Tài liệu Yêu cầu Nghiệp vụ (BRD / Functional Specification)
Tập trung vào khía cạnh sản phẩm, phù hợp cho Client, Product Owner (PO), Business Analyst (BA):
*   Bối cảnh & Mục tiêu kinh doanh
*   Phạm vi (In Scope / Out of Scope)
*   Tác nhân & Phân quyền (Actors & Roles)
*   Luồng người dùng (User Flows / Workflows)
*   Yêu cầu chức năng (Functional Requirements - Viết rõ ràng, đo lường được dạng: *"Hệ thống phải..."*)
*   Quy tắc nghiệp vụ (Business Rules - Trình bày dạng bảng chi tiết)
*   Các câu hỏi mở (Open Questions) & Tiêu chí nghiệm thu (Acceptance Criteria)

### Chế độ 2: Thiết kế Kỹ thuật (Technical Design Document - TDD)
Phù hợp cho Developers, Architects, Tech Leads:
*   Kiến trúc & Ranh giới hệ thống (System Boundaries)
*   Sơ đồ thực thể & Thiết kế dữ liệu (Data Model / Entities)
*   Thiết kế API / Dịch vụ (Endpoint, Request/Response, Idempotency, Validations)
*   Quản lý trạng thái (State Transitions, locking rules)
*   Xử lý lỗi, retry & tính tin cậy (Error Handling & Reliability)
*   Xử lý đồng thời (Concurrency, race conditions)
*   Rủi ro kỹ thuật & Giải pháp giảm thiểu (Technical Risks & Mitigations)

### Chế độ 3: Bàn giao Phát triển (Development Handoff Document)
Phù hợp khi chuyển giao công việc cho đội phát triển:
*   Danh sách tính năng cần xây dựng
*   Trách nhiệm của từng dịch vụ (Service Responsibilities)
*   Danh sách API và thay đổi cấu trúc dữ liệu cần thiết
*   Quy tắc nghiệp vụ & Biên độ xử lý (Edge Cases)
*   Phân rã tác vụ đề xuất (Suggested task breakdown)

### Chế độ 4: Đầu vào cho QA/Test (QA/Test Planning Input)
Tập trung hỗ trợ QA lập kế hoạch viết testcase:
*   Checklist các yêu cầu có thể kiểm thử (Testable Requirements)
*   Kịch bản kiểm thử đề xuất (Happy Path, Validation, Permission, State Transitions, Concurrency, Failover)
*   Các vùng ảnh hưởng hồi quy (Regression Areas)

### Chế độ 5: Biên bản xác nhận với khách hàng (Client Confirmation Checklist)
*   Quyết định đã thống nhất (Confirmed Decisions)
*   Các giả định kỹ thuật (Assumptions)
*   Câu hỏi mở cần khách hàng xác nhận dạng Yes/No hoặc trả lời ngắn

---

## Cấu trúc Tài liệu Mặc định (Combined BRD + TDD)

Khi người dùng không yêu cầu cụ thể một chế độ riêng biệt, hãy sử dụng cấu trúc tài liệu tổng hợp sau:

```markdown
# 1. Tóm tắt dự án (Executive Summary)

# 2. Bối cảnh & Khung nghiệp vụ (Background and Context)

# 3. Định vị vấn đề (Problem Statement)

# 4. Mục tiêu kinh doanh (Business Objectives)

# 5. Phạm vi giải pháp (Scope)
## 5.1 Nằm trong phạm vi (In Scope)
## 5.2 Nằm ngoài phạm vi (Out of Scope)

# 6. Tác nhân & Phân quyền (Stakeholders and Actors)

# 7. Luồng nghiệp vụ hiện tại (Current Workflow)

# 8. Luồng nghiệp vụ đề xuất (Proposed Workflow)

# 9. Yêu cầu chức năng (Functional Requirements)
*Viết rõ ràng dưới dạng "Hệ thống phải..." (The system shall...)*
| ID | Yêu cầu | Mô tả chi tiết | Độ ưu tiên | Ghi chú |
|----|---------|----------------|------------|---------|

# 10. Quy tắc nghiệp vụ (Business Rules)
| Rule ID | Quy tắc nghiệp vụ | Điều kiện / Tác nhân kích hoạt | Hành vi mong đợi của hệ thống |
|--------|-------------------|--------------------------------|------------------------------|

# 11. Các trường hợp biên & Xử lý ngoại lệ (Edge Cases and Exception Handling)

# 12. Thiết kế dữ liệu / Mô hình thực thể (Data Model / Entities)

# 13. Thiết kế API / Dịch vụ (API / Service Design)

# 14. Quản lý trạng thái (State Management)

# 15. Yêu cầu phi chức năng (Non-Functional Requirements)

# 16. Cân nhắc kỹ thuật & Kiến trúc (Technical Design Considerations)

# 17. Rủi ro & Ràng buộc (Risks and Constraints)

# 18. Các giả định (Assumptions)

# 19. Câu hỏi mở cần làm rõ (Open Questions)

# 20. Giải pháp đề xuất khuyên dùng (Recommended Solution)

# 21. Phụ lục (Appendix)
```

---

## Quy tắc Biên soạn Yêu cầu chuyên nghiệp (Requirement Writing Rules)

*   **Đo lường được & Rõ ràng**: Tránh các từ mơ hồ như *"hệ thống nên xử lý nhanh"*, *"giao diện đẹp"*. Thay vào đó dùng hành động chính xác: *"Hệ thống phải chặn giao dịch nếu số dư tài khoản nhỏ hơn số tiền thanh toán."*
*   **Phân định mức độ chắc chắn**:
    *   **Đã xác nhận (Confirmed)**: Thông tin đã được thống nhất rõ ràng trong chat.
    *   **Giả định (Assumption)**: Được suy luận từ b cảnh kỹ thuật, cần được xác nhận lại.
    *   **Câu hỏi mở (Open Question)**: Chưa có câu trả lời rõ ràng trong bối cảnh, cần quyết định từ PO/Client.
