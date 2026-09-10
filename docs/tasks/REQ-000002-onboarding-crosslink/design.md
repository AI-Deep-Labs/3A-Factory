# Technical Design

## 1. Quyết định kiến trúc (Architecture Decisions)
- **ADR**: Không yêu cầu (ADR_NOT_REQUIRED). Sự thay đổi chỉ ở mức độ cập nhật văn bản hướng dẫn/prompt cho Agent, không thay đổi luồng hệ thống hay kiến trúc phần mềm nào.

## 2. Thiết kế chi tiết
- **Target File**: `.agents/skills/onboarding/SKILL.md`
- **Vị trí sửa đổi**: Tìm kiếm phần `# Phase D — Knowledge base docs/project_overview.md` trong file.
- **Nội dung thay đổi cụ thể**: Cập nhật danh sách "The resulting file must include at minimum the following sections:" để bổ sung thêm phần số 13.
  - `13. Knowledge Base & Feature Specs: Chỉ dẫn nơi lưu trữ tài liệu đặc tả (Spec Packages - REQ-*).`

## 3. Tác động hệ thống
- Skill onboarding sẽ sử dụng danh sách này làm hướng dẫn để sinh ra file `project_overview.md`. Khi danh sách được cập nhật, file kết quả cũng sẽ tự động mang theo thông tin về nơi lưu tài liệu.
