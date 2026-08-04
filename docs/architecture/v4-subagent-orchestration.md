# Kiến trúc v4: Sub-Agent Orchestration

## Mục tiêu (Mục đích)
Chuyển đổi 3A-Factory từ mô hình **Monolithic Execution** (một LLM Context tự chạy từ A-Z) sang mô hình **Delegated Sub-Agent Orchestration** (chia để trị với các Agent con chuyên biệt).

Kiến trúc này phản chiếu đúng mô hình tổ chức phát triển phần mềm Enterprise, áp dụng triệt để nguyên lý **Four-Eyes Principle** (Nguyên tắc 4 mắt) và **Context Isolation** (Cô lập ngữ cảnh).

## Tách biệt Vai trò (Persona) và Công việc (Task)
Kiến trúc v4 đưa ra một sự nâng cấp mạnh mẽ trong việc quản lý cấu trúc Agent:
- **Thư mục `.agents/agents/`**: Đóng vai trò là **System Prompt**. Định nghĩa "Ai" (Who) đang làm việc và tư duy của họ là gì (Ví dụ: Tư duy bảo thủ của Release Manager, hay tư duy tìm lỗi của QA).
- **Thư mục `.agents/skills/`**: Đóng vai trò là **Task Prompt**. Định nghĩa "Làm gì" (What/How) dựa trên quy trình của dự án.

## Đội ngũ 6 Sub-agents
Hệ thống sử dụng tệp registry `.agents/configs/subagents.json` để ánh xạ 6 Personas với các Skills tương ứng:

1. **Business Analyst (`business-analyst.md`)**
   - Phụ trách: `triage`, `grill-me`, `analyze`, `requirements`.
   - Đặc điểm: Tập trung vào giá trị kinh doanh (Business Value) và yêu cầu người dùng, không quan tâm mã nguồn.
2. **Software Architect (`architect.md`)**
   - Phụ trách: `adr`, `design`, `tasks`, `acceptance`.
   - Đặc điểm: Tư duy hệ thống (System Thinking), tránh phụ thuộc vòng tròn (circular dependencies).
3. **Software Engineer (`developer.md`)**
   - Phụ trách: `develop`.
   - Đặc điểm: "Thợ code". Bị cô lập khỏi quyền quyết định kiến trúc. Chỉ được viết code theo Spec.
4. **Code Reviewer (`reviewer.md`)**
   - Phụ trách: `review`, `spec-review`.
   - Đặc điểm: Nguyên tắc 4 mắt. Soi xét khắt khe code của Developer so với Acceptance Criteria.
5. **QA Automation Engineer (`qa-engineer.md`)**
   - Phụ trách: `qa`.
   - Đặc điểm: Tư duy bẻ gãy hệ thống (Negative Thinking).
6. **Release Manager (`release-manager.md`)**
   - Phụ trách: `converge`, `deploy`.
   - Đặc điểm: Gác cổng. Cực kỳ cẩn trọng, kiểm tra chéo 100% trước khi cho phép deploy.

## Luồng hoạt động (Workflow Engine)
`project-manager` được thăng cấp lên thành một **Pure Supervisor (Người điều phối thuần túy)**.
Nó là Agent duy nhất có quyền cập nhật trạng thái trong `manifest.yaml`. 

**Sơ đồ hoạt động:**
1. `project-manager` đọc `manifest.yaml`.
2. Xác định bước tiếp theo (VD: `develop`).
3. Dựa vào IDE Capability (Gemini CLI / Claude Code / Cursor) để spawn Sub-agent (hoặc role-play).
4. Sub-agent `developer` chạy xong, trả về báo cáo kết quả (PASS/FAIL) cho `project-manager`.
5. `project-manager` cập nhật `manifest.yaml` và chuyển trạng thái sang `review`.

## Tương thích IDE (IDE Compatibility)
- **Native Sub-agents (Gemini/Claude):** Sử dụng Native Tool `invoke_subagent` để tạo các luồng nhớ hoàn toàn mới và cô lập.
- **Role-play Sub-agents (Cursor):** Sử dụng năng lực Agent/Composer của Cursor để tự đóng vai (role-play) kết hợp với công cụ chỉnh sửa đa luồng. Cả 2 phương pháp đều không yêu cầu User phải thao tác tay.

## Kết luận
Bản nâng cấp này giúp 3A-Factory Scale-up hoàn hảo, trở thành một bộ máy hoạt động 24/7 không biết mệt mỏi với độ chính xác và bảo mật ngữ cảnh tuyệt đối.
