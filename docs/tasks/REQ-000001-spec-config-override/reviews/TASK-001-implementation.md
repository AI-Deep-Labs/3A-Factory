# Task Implementation Evidence

> When filled: write the body in **Vietnamese**. Keep IDs in English.  
> Path: `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-001-implementation.md`

## Metadata

- REQ ID: REQ-000001
- Package: docs/tasks/REQ-000001-spec-config-override/
- Task ID: TASK-001
- Author: developer
- Created at: 2026-09-09
- Branch: feat/REQ-000001-spec-config-override

## Task

- Title: Khởi tạo template spec_config.json và cập nhật Installer
- Objective: Tạo file cấu hình mẫu .agents/configs/spec_config.json với giá trị mặc định (override: false, project: "", path: "") và cập nhật danh sách sharedFiles trong scripts/install.js để tự động sao chép file này khi cài đặt 3a-factory.
- Status after handoff: review

## Files Changed

| Path | Change | Reason |
|---|---|---|
| `.agents/configs/spec_config.json` | Create | Template cấu hình mặc định cho cơ chế spec override (FR-001) |
| `scripts/install.js` | Modify | Thêm `spec_config.json` vào danh sách `sharedFiles` để installer tự động scaffold (FR-001) |

## Implementation Summary

- Đã tạo file template `.agents/configs/spec_config.json` với cấu trúc JSON chuẩn:
  ```json
  {
    "override": false,
    "project": "",
    "path": ""
  }
  ```
- Đã cập nhật mảng `sharedFiles` trong file `scripts/install.js`, thêm entry `{ src: '.agents/configs/spec_config.json', dest: '.agents/configs/spec_config.json' }` ngay sau `{ src: '.agents/configs/subagents.json', dest: '.agents/configs/subagents.json' }`.
- Xác minh installer hỗ trợ đầy đủ việc scaffold file cấu hình mới mà không làm ảnh hưởng các file hiện có nếu không có `--force`.

## Requirement Coverage

| Requirement ID | How addressed |
|---|---|
| FR-001 | Tạo file template `.agents/configs/spec_config.json` với các trường mặc định và tích hợp vào `scripts/install.js` |
| BR-001 | Cấu hình mặc định `override: false` đảm bảo toàn bộ pipeline fallback an toàn về repo cục bộ |
| NFR-001 | Đảm bảo tương thích ngược 100%, không phá vỡ bất kỳ hành vi cài đặt hoặc luồng thực thi nào |

## Design Compliance

| Design ID | Compliance notes |
|---|---|
| DES-ARCH-001 | Cung cấp file cấu hình mẫu chuẩn hóa cho kiến trúc Centralized Contract-Driven Path Resolver |
| DES-DATA-001 | Đúng cấu trúc JSON schema với 3 trường bắt buộc: override (boolean), project (string), path (string) |
| DES-MIG-001 | Tự động tạo file khi cài đặt mới/nâng cấp, bảo vệ file đã tồn tại nếu không dùng `--force` |

## Acceptance Coverage

| Acceptance / Test ID | Notes |
|---|---|
| AC-001 | Installer dry-run và apply đã xác nhận file `.agents/configs/spec_config.json` được scaffold với nội dung JSON chính xác |
| UT-001 | Đã chạy kiểm tra cú pháp node -c, kiểm tra cú pháp JSON, và test install vào thư mục tạm |

## Verification Commands

```bash
# Kiểm tra tính hợp lệ cú pháp JSON của template
node -e "JSON.parse(require('fs').readFileSync('.agents/configs/spec_config.json', 'utf8')); console.log('JSON VALID');"

# Kiểm tra cú pháp script install.js
node -c scripts/install.js

# Kiểm tra dry-run installer ở repo hiện tại
node scripts/install.js --dry-run

# Kiểm tra dry-run installer với JSON report trên thư mục đích tạm
node scripts/install.js --agent=all --dry-run --json --cwd C:\Users\ADMIN\AppData\Local\Temp\test-3a-install

# Kiểm tra apply installer thực tế trên thư mục đích tạm
node scripts/install.js --agent=all --apply --cwd C:\Users\ADMIN\AppData\Local\Temp\test-3a-install-apply
```

## Verification Results

- Result: Pass
- Evidence:
  - `node -e ...`: JSON VALID (exit code 0).
  - `node -c scripts/install.js`: Exit code 0, không có lỗi cú pháp.
  - `node scripts/install.js --dry-run`: Exit code 0, phát hiện dev repo và bỏ qua an toàn (`INSTALL_SKIP_DEV_REPO`).
  - `node scripts/install.js --agent=all --dry-run --json --cwd <temp>`: Exit code 0, `.agents/configs/spec_config.json` nằm trong danh sách `installedFiles`.
  - `node scripts/install.js --agent=all --apply --cwd <temp>`: Exit code 0, file được tạo và xác nhận nội dung đúng chuẩn `{ "override": false, "project": "", "path": "" }`.

## Scope Deviations

- None

## Known Limitations

- Không có. File template cấu hình và installer đã sẵn sàng cho các task tiếp theo (TASK-002 đến TASK-006).

## Handoff to Review

- Ready for `/review`: yes
- Notes for reviewer:
  - Kiểm tra 2 file thay đổi: `.agents/configs/spec_config.json` và `scripts/install.js`.
  - Không có thay đổi nào ngoài phạm vi Expected File Scope (ngoại trừ file evidence này).
  - Tuân thủ quy định không tự ý sửa đổi `manifest.yaml`.
