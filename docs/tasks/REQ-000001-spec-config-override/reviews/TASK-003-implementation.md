# Task Implementation Evidence

> When filled: write the body in **Vietnamese**. Keep IDs in English.  
> Path: `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-003-implementation.md`

## Metadata

- REQ ID: REQ-000001
- Package: docs/tasks/REQ-000001-spec-config-override/
- Task ID: TASK-003
- Author: developer
- Created at: 2026-09-09
- Branch: feat/REQ-000001-spec-config-override

## Task

- Title: Cập nhật Kỹ năng onboarding và Khóa Bất biến Project Name
- Objective: Cập nhật `.agents/skills/onboarding/SKILL.md` (tại Phase B) để khi onboarding repository, agent sẽ điền tên dự án vào trường `project` của `spec_config.json` nếu trường này đang rỗng, và áp dụng guard logic không được phép ghi đè nếu đã có giá trị.
- Status after handoff: review

## Files Changed

| Path | Change | Reason |
|---|---|---|
| `.agents/skills/onboarding/SKILL.md` | Modify | Bổ sung mục 4 vào Phase B và cập nhật Output checklist nhằm thiết lập `spec_config.json` project identifier và khóa bất biến theo chuẩn § 5.9.4 (FR-003, FR-004, BR-002, DES-FLOW-002, DES-OBS-001) |

## Implementation Summary

- Đã cập nhật Phase B (`## Phase B — Scaffold workflow in-repo`) trong file `.agents/skills/onboarding/SKILL.md`, bổ sung mục `4. Configure spec_config.json project identifier:`
  1. Đọc nội dung file `.agents/configs/spec_config.json`.
  2. Nếu trường `project` đang rỗng (`""`):
     - Gán `project` bằng tên repository/dự án được phát hiện hoặc xác nhận từ repo context (package.json, tên thư mục hoặc user declaration).
     - Ghi cập nhật trở lại vào `.agents/configs/spec_config.json`.
  3. Nếu trường `project` đã có giá trị khác rỗng:
     - Tuyệt đối **KHÔNG** ghi đè giá trị này nhằm bảo vệ tính bất biến theo quy định của hợp đồng § 5.9.4.
     - Xuất cảnh báo (warning token): `PROJECT_ALREADY_SET: project is already set to '<current_value>'. Preserving existing value.`
     - Tiếp tục quy trình onboarding với giá trị project hiện hữu.
- Đã cập nhật `## Output checklist`:
  - Bổ sung mục kiểm tra: `- [ ] spec_config.json project identifier configured (or preserved if already set)`.

## Requirement Coverage

| Requirement ID | How addressed |
|---|---|
| FR-003 | Bổ sung chỉ dẫn vào Phase B của kỹ năng onboarding để điền trường `project` khi rỗng và cấm ghi đè khi đã có giá trị |
| FR-004 | Sử dụng failure/warning token chuẩn `PROJECT_ALREADY_SET` khi phát hiện trường `project` đã được thiết lập từ trước |
| BR-002 | Khóa bất biến định danh `project` của repo trong cấu hình knowledge base |

## Design Compliance

| Design ID | Compliance notes |
|---|---|
| DES-FLOW-002 | Hiện thực chính xác lưu đồ luồng xử lý: kiểm tra `project != ""` -> nếu rỗng thì ghi tên dự án, nếu có giá trị thì giữ nguyên và cảnh báo `PROJECT_ALREADY_SET` |
| DES-OBS-001 | Sử dụng token cảnh báo `PROJECT_ALREADY_SET` đúng định dạng và mức độ quy định trong bảng quan sát hệ thống |

## Acceptance Coverage

| Acceptance / Test ID | Notes |
|---|---|
| AC-003 | Hướng dẫn onboarding đáp ứng cả hai kịch bản: điền tên dự án lần đầu và bảo toàn giá trị cũ kèm cảnh báo trong các lần chạy sau |
| UT-003 | Cung cấp đặc tả hành vi chuẩn cho việc kiểm thử guard logic bất biến của `project` |

## Verification Commands

```powershell
# Kiểm tra diff của file onboarding/SKILL.md
git diff .agents/skills/onboarding/SKILL.md
```

## Verification Results

- Result: Pass
- Evidence:
  - Lệnh `git diff .agents/skills/onboarding/SKILL.md` xác nhận:
    - Mục `4. Configure spec_config.json project identifier:` được thêm đầy đủ các nhánh kiểm tra `""` và khác rỗng.
    - Cảnh báo `PROJECT_ALREADY_SET: project is already set to '<current_value>'. Preserving existing value.` được quy định rõ ràng.
    - Dòng `- [ ] spec_config.json project identifier configured (or preserved if already set)` xuất hiện trong `Output checklist`.

## Scope Deviations

- None. Chỉ chỉnh sửa duy nhất file `.agents/skills/onboarding/SKILL.md` nằm trong Expected File Scope của TASK-003 và tạo file evidence này.

## Known Limitations

- Không có.

## Handoff to Review

- Ready for `/review`: yes
- Notes for reviewer:
  - File sửa đổi: `.agents/skills/onboarding/SKILL.md`.
  - Không tự ý cập nhật trạng thái trong `manifest.yaml` theo đúng quy tắc của developer sub-agent.
