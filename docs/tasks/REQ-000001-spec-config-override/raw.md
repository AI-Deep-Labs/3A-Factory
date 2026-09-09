# REQ-000001-spec-config-override (raw)

- Id: REQ-000001-spec-config-override
- Received date: 2026-09-09
- Requested by: User
- Channel: Chat
- Type: feature
- Urgency: medium

## Verbatim content

Tôi muốn cải tiến cơ chế tạo spec trong bộ Agentic SDLC Pipeline này theo hướng như sau:

- Khi cài đặt bộ Agentic SDLC Pipeline 3a-factory, sẽ có 1 file `spec_config.json` trong folder `./agents/configs`. File `spec_config.json` này sẽ có cấu trúc như sau:

```json
{
  "override": false,
  "project": "skyorder-api",
  "path": "C:\\Documents\\knowledge"
}
```

Chú thích:
- `project`: tên project
- `path`: đường dẫn chứa các tập tin file docs knowledge base được tạo khi project onboarding và thực hiện các task theo quy trình SDLC của 3a-factory
- `override`: cho phép áp dụng tạo các file docs theo path được cấu hình

Logic override:
- Nếu tham số `override` được set = `false`, mọi ứng xử tạo các file trong folder docs vẫn sẽ tạo trong chính repo đang đứng (behavior hiện tại, không thay đổi)
- Nếu `override` được thiết lập là `true`, mọi file liên quan được tạo theo quy trình spec sẽ phải tạo đúng path được chỉ định thay vì `docs/tasks/` trong repo hiện tại

Mục đích: cho phép centralize knowledge base ra ngoài repo, phục vụ đa dự án dùng chung 1 knowledge repository.

## Additional notes

- Phạm vi ảnh hưởng: installer (install.js), tất cả các skill tạo file dưới docs/tasks/ (triage, analyze, requirements, design, tasks, acceptance, spec, spec-review, develop, review, qa, converge), manifest template, spec-package contract, AGENTS.md, GEMINI.md, CLAUDE.md
- Đây là thay đổi cơ chế core của pipeline, cần thiết kế đồng bộ

## Bổ sung từ user (2026-09-09T15:42)

- Khi `override: true`, cấu trúc path là: `<path>/<project>/tasks/REQ-*` (KHÔNG phải `<path>/docs/tasks/REQ-*`)
- Giá trị `project` trong `spec_config.json` sẽ được bổ sung khi thực hiện onboarding lần đầu
- Nếu `project` đã được set giá trị trước đó, thì KHÔNG được phép chỉnh sửa giá trị của `project` (immutable once set)
