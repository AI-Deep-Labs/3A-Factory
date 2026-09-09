# Task Implementation Evidence

> When filled: write the body in **Vietnamese**. Keep IDs in English.  
> Path: `docs/tasks/REQ-000001-spec-config-override/reviews/TASK-006-implementation.md`

## Metadata

- REQ ID: REQ-000001
- Package: docs/tasks/REQ-000001-spec-config-override/
- Task ID: TASK-006
- Author: developer
- Created at: 2026-09-09
- Branch: feat/REQ-000001-spec-config-override

## Task

- Title: Cập nhật Tài liệu Điều phối Cấp cao (Governance Docs)
- Objective: Cập nhật các tài liệu điều phối gốc của pipeline (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`) để phản ánh cơ chế `spec_config.json` override path, cập nhật phần mô tả Canonical path từ cố định sang có hỗ trợ cấu hình chuyển hướng theo hợp đồng § 5.9.
- Status after handoff: review

## Files Changed

| Path | Change | Reason |
|---|---|---|
| `AGENTS.md` | Modify | Cập nhật `## Canonical path` sang `docs_root/REQ-<NNNNNN>-<slug>/` kèm mô tả đường dẫn mặc định trong repo và đường dẫn override; cập nhật bullet đầu tiên của `## Greenfield policy` sang `docs_root` |
| `GEMINI.md` | Modify | Cập nhật dòng 7 `Canonical path` phản ánh mặc định trong repo và chuyển hướng ra knowledge base ngoài khi `spec_config.json` override được bật (contract § 5.9) |
| `CLAUDE.md` | Modify | Cập nhật dòng 7 `Canonical path` phản ánh mặc định trong repo và chuyển hướng ra knowledge base ngoài khi `spec_config.json` override được bật (contract § 5.9) |

## Implementation Summary

- Đã cập nhật đầy đủ 3 tài liệu điều phối cấp cao gốc của hệ thống:
  1. `AGENTS.md`:
     - Tại mục `## Canonical path`, thay thế giá trị cố định bằng:
       ```text
       docs_root/REQ-<NNNNNN>-<slug>/
       ```
       Kèm theo hai định nghĩa tường minh:
       - Default (in-repo): `docs/tasks/REQ-<NNNNNN>-<slug>/`
       - Override (external knowledge base): `<path>/<project>/tasks/REQ-<NNNNNN>-<slug>/` khi `.agents/configs/spec_config.json` có `override: true` (contract § 5.9).
     - Tại mục `## Greenfield policy`, cập nhật nội dung bullet đầu tiên:
       `- New feature artifacts live only under `docs_root/REQ-<NNNNNN>-<slug>/` (default `docs/tasks/REQ-*` in repo, or `<path>/<project>/tasks/REQ-*` when spec_config override is enabled per contract § 5.9).`
     - Toàn bộ các quy định bất biến (Tool-Level Hard Invariants, Hard Gates, Approvals, Auto-intake) được giữ nguyên vẹn.
  2. `GEMINI.md`:
     - Tại dòng 7, cập nhật dòng khai báo `Canonical path`:
       `Canonical path: docs/tasks/REQ-<NNNNNN>-<slug>/ (default in-repo) or <path>/<project>/tasks/REQ-<NNNNNN>-<slug>/ when spec_config.json override is enabled (contract § 5.9)`
  3. `CLAUDE.md`:
     - Tại dòng 7, cập nhật dòng khai báo `Canonical path`:
       `Canonical path: docs/tasks/REQ-<NNNNNN>-<slug>/ (default in-repo) or <path>/<project>/tasks/REQ-<NNNNNN>-<slug>/ when spec_config.json override is enabled (contract § 5.9)`

## Requirement Coverage

| Requirement ID | How addressed |
|---|---|
| FR-005 | Đồng bộ hóa tài liệu điều phối cấp cao (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`) khớp với các cập nhật trước đó trên contract và 15 kỹ năng |
| NFR-001 | Đảm bảo tính tương thích ngược hoàn toàn, làm rõ quy tắc mặc định cục bộ trong repo khi không kích hoạt override |

## Design Compliance

| Design ID | Compliance notes |
|---|---|
| DES-ARCH-001 | Thống nhất khái niệm `docs_root` và trích dẫn chuẩn hóa về Hợp đồng điều phối `contract § 5.9` |
| Minimum File Scope | Chỉ chỉnh sửa 3 file tài liệu điều phối gốc được định nghĩa trong kiến trúc (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`) |

## Acceptance Coverage

| Acceptance / Test ID | Notes |
|---|---|
| AC-005 | Hoàn tất bước đồng bộ hóa cuối cùng cho 20/20 file trong toàn bộ pipeline 3a-factory (1 template, 1 installer, 1 contract, 15 skills, 3 root docs) |
| ST-002 | Tài liệu điều phối phản ánh chính xác vị trí lưu trữ khi cấu hình override hoạt động (`<path>/<project>/tasks/REQ-*`) |

## Verification Commands

```bash
git diff AGENTS.md GEMINI.md CLAUDE.md
```

## Verification Results

- Result: Pass
- Evidence:
  - `git diff AGENTS.md GEMINI.md CLAUDE.md` hiển thị các thay đổi tối thiểu, chính xác và không có tác dụng phụ ngoài phạm vi:
    - `AGENTS.md`: Canonical path đổi sang `docs_root/REQ-<NNNNNN>-<slug>/` kèm hai dòng chú thích default/override; bullet đầu tiên của Greenfield policy đã phản ánh `docs_root` và spec_config override.
    - `GEMINI.md`: Dòng 7 đã được cập nhật chính xác nội dung Canonical path theo contract § 5.9.
    - `CLAUDE.md`: Dòng 7 đã được cập nhật chính xác nội dung Canonical path theo contract § 5.9.
  - Toàn bộ thay đổi nằm trong Expected File Scope.

## Scope Deviations

- None. Chỉ thực hiện cập nhật 3 file nằm trong Expected File Scope (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`) và tạo file bằng chứng này.

## Known Limitations

- Không có.

## Handoff to Review

- Ready for `/review`: yes
- Notes for reviewer:
  - TASK-006 đã hoàn tất việc cập nhật các tài liệu điều phối cấp cao theo đúng yêu cầu đề ra.
  - Đây là task cuối cùng trong dependency graph của REQ-000001, hoàn tất bao phủ toàn bộ 20 file theo AC-005.
  - Không tự ý cập nhật trạng thái trong `manifest.yaml` theo đúng quy định.
