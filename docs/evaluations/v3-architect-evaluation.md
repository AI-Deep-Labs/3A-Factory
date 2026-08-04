# Đánh giá & Đề xuất Kiến trúc: 3A-Factory v3 Agentic Workflow

> **Bản thảo được ghi nhận vào: 2026-08-04** (Phiên bản v3.3.0)
> **Mục tiêu:** Đối chiếu tham khảo và làm tài liệu căn cứ để cải tiến các phiên bản tiếp theo.

Dưới góc nhìn của một **Expert AI Agent Architect**, cấu trúc thư mục, tệp luật `AGENTS.md`, các bảng ánh xạ kỹ năng (Skills & Tool Mapping) và quy trình hoạt động (Workflow) của bộ 3A-Factory v3 đã được phân tích.

Dưới đây là bảng đánh giá toàn diện về độ tối ưu, kèm theo những **khuyến nghị kiến trúc cấp cao** để nâng cấp trong tương lai.

---

## 1. Những điểm sáng giá (Strengths - Rất Tối Ưu)

Kiến trúc v3 của 3A-Factory đã vượt xa các template thông thường, áp dụng xuất sắc các khái niệm của hệ thống Agentic:

- **State Machine thông qua Files:** Sử dụng `manifest.yaml` kết hợp với các artifact (`requirements.md`, `design.md`, v.v.) làm "State Truth" và "Verification Truth" là một bước đi cực kỳ thông minh. LLM làm việc rất tốt với Text/Markdown, giúp quá trình theo dõi trạng thái minh bạch tuyệt đối.
- **Single Source of Truth:** Hợp nhất `WORKFLOW.md` vào `AGENTS.md` giúp giảm tải Cognitive Load cho LLM. Agent chỉ cần nạp 1 file Rule gốc duy nhất.
- **Intent Gate & Auto-Intake:** Cơ chế phân luồng tự nhiên (NLP Routing) thay thế cho việc gõ lệnh Slash cứng nhắc mang lại UX tuyệt vời.
- **Decoupled Supervisor/Worker:** Việc giấu 13 lệnh nội bộ (`develop`, `qa`, `triage`) xuống làm Native Tools và để `project-manager` điều phối là chuẩn mực của mô hình **Supervisor-Worker Agentic Pattern**.

---

## 2. Các điểm nghẽn & Đề xuất cải thiện (Bottlenecks & Proposals)

Mặc dù quy trình đã rất tinh gọn, nhưng dưới góc độ Scale-up (mở rộng cho dự án lớn) và Context Management (quản lý ngữ cảnh của LLM), vẫn còn 4 rào cản cần giải quyết:

### A. Rủi ro "Ô nhiễm Ngữ cảnh" (Context Contamination)
**Hiện trạng:** `/project-manager` đang đóng vai trò Supervisor, nhưng nó lại phải **đọc** tệp `SKILL.md` của các bước con (như `develop`, `qa`, `review`) và **tự thực thi** trên cùng một Session/Conversation. Khi REQ lớn, việc này sẽ ngốn sạch Context Window và làm LLM dễ bị "ảo giác" (nhầm lẫn giữa vai trò Code và vai trò Review).

**Đề xuất Cải thiện (Multi-Agent Sub-spawning):**
- Thay vì để PM ôm đồm thực thi, hãy nâng cấp PM thành một thuần Supervisor.
- Khi cần `qa` hoặc `develop`, PM sẽ sử dụng tính năng **Spawn Sub-agent** (nếu IDE hỗ trợ, ví dụ qua `invoke_subagent` tool) với một System Prompt riêng biệt, ngữ cảnh trắng (blank context) chỉ chứa Spec của Task đó.
- *Lợi ích:* Code an toàn hơn, Review khắt khe hơn vì Agent Review không bị dính "thiên kiến" của Agent Develop (do khác Session).

### B. Đột biến Trạng thái YAML (State Mutation Fragility)
**Hiện trạng:** LLM đang chỉnh sửa `manifest.yaml` (ví dụ chuyển đổi các Gate ID `APPROVED_SPEC_PACKAGE`) bằng kỹ thuật thay thế chuỗi văn bản thuần túy (Text Replace Tools). YAML rất nhạy cảm với thụt lề (indentation). LLM đôi lúc sẽ làm hỏng file manifest, khiến toàn bộ pipeline bị kẹt.

**Đề xuất Cải thiện (Tool-Calling State API):**
- Xây dựng một script nhỏ (hoặc MCP Server) cấp quyền Tool Calling: `update_manifest_status(req_id, new_status, new_gate)`. 
- Agent không sửa file YAML bằng text nữa mà chỉ cần gọi hàm JSON này, hệ thống bên dưới sẽ parse và update YAML an toàn.

### C. Thiếu "Trí nhớ Dài hạn" (Long-term Semantic Memory)
**Hiện trạng:** Khi cần tham chiếu `ADR-xxx` hoặc REQ cũ, Agent hiện tại phải dùng lệnh `grep` hoặc đọc lướt thư mục `docs/decisions/`. Nếu dự án có hàng chục REQ, LLM không thể đọc hết và sẽ bỏ lỡ bối cảnh cũ (Dẫn đến lặp lại lỗi hoặc thiết kế kiến trúc trùng lặp).

**Đề xuất Cải thiện (RAG / Embeddings Integration):**
- Bổ sung một kỹ năng/công cụ (ví dụ `/knowledge-retriever`) cho phép Agent thực hiện **Semantic Search** (Tìm kiếm theo ngữ nghĩa) toàn bộ thư mục `docs/`. 
- Khi làm REQ mới, PM có thể tự động search: *"Các quyết định kiến trúc nào liên quan đến Authentication trong quá khứ?"* trước khi viết `design.md`.

### D. Sandbox & An toàn Môi trường ở khâu QA
**Hiện trạng:** Bước QA (Bounded repair loop max 3) đang cho phép Agent tự do chạy lệnh test trên môi trường máy chủ host hiện tại (PowerShell/Bash). Điều này ẩn chứa rủi ro Agent chạy sai lệnh gây ảnh hưởng đến hệ thống local.

**Đề xuất Cải thiện (Dockerized QA Tools):**
- Nên thiết kế bước QA chạy trong môi trường Container. Agent gửi lệnh test vào một công cụ `run_test_in_sandbox` thay vì `run_command` gốc.

---

## 3. Tổng kết

Hệ thống 3A-Factory v3 hiện tại xứng đáng với điểm số **8.5/10** về mặt Agentic Design. Nó đáp ứng hoàn hảo cho các dự án cỡ vừa và nhỏ (Greenfield SMBs).

Tuy nhiên, để đưa bộ Framework này lên mức **Enterprise Grade (10/10)** trong phiên bản v4, ưu tiên cao nhất là giải quyết **Mục A (Sub-agent Orchestration)** và **Mục B (MCP/API State Mutation)**.
