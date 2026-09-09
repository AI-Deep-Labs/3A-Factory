# Tasks: Cơ chế `spec_config.json` Override Path

> Authoritative: **Execution Truth**
> Contract: `.agents/contracts/spec-package.md`

## Metadata

- REQ ID: REQ-000001
- Feature: Cải tiến cơ chế tạo spec với spec_config.json override path
- Package: `docs/tasks/REQ-000001-spec-config-override/`
- Status: ready
- Last updated: 2026-09-09

## Execution Rules

- Chỉ thực hiện current task (`manifest.execution.current_task`).
- Không bỏ qua dependency.
- Không mở rộng file scope khi chưa cập nhật task.
- Không tự thay đổi requirement hoặc design.
- Khi reference thiếu hoặc mâu thuẫn, chuyển task sang `blocked` và trả về producer skill.

## Dependency Graph

```text
TASK-001 (Config Template & Installer Update)
└── TASK-002 (Contract Update § 5.9 Path Resolution)
    ├── TASK-003 (Onboarding Skill Update & Immutability Guard)
    └── TASK-004 (Spec Creation Skills Path Resolution Update)
        └── TASK-005 (Execution & Governance Skills Path Resolution Update)
            └── TASK-006 (Root Docs Coordination Update: AGENTS/GEMINI/CLAUDE)
```

## Tasks

### TASK-001 — Khởi tạo template `spec_config.json` và cập nhật Installer

- Status: done
- Priority: must
- Owner: developer
- Risk: low

#### Objective
Tạo file cấu hình mẫu `.agents/configs/spec_config.json` với giá trị mặc định (`override: false`, `project: ""`, `path: ""`) và cập nhật danh sách `sharedFiles` trong `scripts/install.js` để tự động sao chép file này khi cài đặt 3a-factory.

#### Requirement References
- FR-001
- BR-001
- NFR-001

#### Design References
- DES-ARCH-001
- DES-DATA-001
- DES-MIG-001

#### Acceptance References
- AC-001
- UT-001

#### Dependencies
- None

#### Expected File Scope
- `.agents/configs/spec_config.json`
- `scripts/install.js`

#### Implementation Notes
- Thêm file `.agents/configs/spec_config.json` với nội dung chuẩn:
  ```json
  {
    "override": false,
    "project": "",
    "path": ""
  }
  ```
- Cập nhật mảng `sharedFiles` trong `scripts/install.js` để bao gồm `{ src: '.agents/configs/spec_config.json', dest: '.agents/configs/spec_config.json' }`.
- Đảm bảo installer không ghi đè nếu file đã tồn tại và không bật `--force`.

#### Verification
- Chạy thử lệnh kiểm tra installer bằng `--dry-run` hoặc inspect file được thêm vào danh sách file cài đặt.

#### Definition of Done
- File `.agents/configs/spec_config.json` tồn tại với định dạng JSON hợp lệ.
- `scripts/install.js` chứa khai báo `spec_config.json` trong `sharedFiles`.

---

### TASK-002 — Cập nhật Hợp đồng Spec Package mục § 5.9

- Status: done
- Priority: must
- Owner: developer
- Risk: medium

#### Objective
Bổ sung mục `§ 5.9 Path Resolution (spec_config override)` vào tài liệu chuẩn `.agents/contracts/spec-package.md`, quy định chi tiết thuật toán phân giải đường dẫn, tính bất biến của trường `project`, cấu trúc thư mục `<path>/<project>/tasks/REQ-*`, và các token báo lỗi chuẩn.

#### Requirement References
- FR-002
- FR-003
- FR-004
- BR-001
- BR-002
- NFR-002

#### Design References
- DES-ARCH-001
- DES-FLOW-001
- DES-FLOW-002
- DES-SEC-001
- DES-OBS-001

#### Acceptance References
- AC-002
- AC-003
- AC-004
- UT-002

#### Dependencies
- TASK-001

#### Expected File Scope
- `.agents/contracts/spec-package.md`

#### Implementation Notes
- Viết rõ các trường hợp: file vắng mặt, `override == false`, `override == true`.
- Ghi rõ cấu trúc thư mục khi override: `<path>/<project>/tasks/REQ-<NNNNNN>-<slug>/`.
- Định nghĩa các failure token: `CONFIG_PATH_INVALID`, `PROJECT_NOT_SET`, `PROJECT_ALREADY_SET`, `CONFIG_MALFORMED`.
- Nhấn mạnh quy tắc: `manifest.yaml` bên trong package luôn giữ relative paths.

#### Verification
- Đọc lại `.agents/contracts/spec-package.md` để đảm bảo văn bản rõ ràng, không mâu thuẫn với các phần khác.

#### Definition of Done
- Mục § 5.9 hoàn chỉnh, định nghĩa đầy đủ thuật toán và quy tắc phân giải đường dẫn.

---

### TASK-003 — Cập nhật Kỹ năng `onboarding` và Khóa Bất biến Project Name

- Status: done
- Priority: must
- Owner: developer
- Risk: low

#### Objective
Cập nhật `.agents/skills/onboarding/SKILL.md` (tại Phase B) để khi onboarding repository, agent sẽ điền tên dự án vào trường `project` của `spec_config.json` nếu trường này đang rỗng, và áp dụng guard logic không được phép ghi đè nếu đã có giá trị.

#### Requirement References
- FR-003
- FR-004
- BR-002

#### Design References
- DES-FLOW-002
- DES-OBS-001

#### Acceptance References
- AC-003
- UT-003

#### Dependencies
- TASK-002

#### Expected File Scope
- `.agents/skills/onboarding/SKILL.md`

#### Implementation Notes
- Bổ sung chỉ dẫn vào Phase B của `onboarding`:
  1. Đọc `.agents/configs/spec_config.json`.
  2. Nếu `project == ""`: điền tên repository/dự án đã được người dùng xác nhận.
  3. Nếu `project != ""`: giữ nguyên, xuất cảnh báo `PROJECT_ALREADY_SET` và tiếp tục các bước tiếp theo mà không ghi đè.

#### Verification
- Kiểm tra nội dung markdown của `onboarding/SKILL.md` đảm bảo rõ ràng, logic chặt chẽ.

#### Definition of Done
- Kỹ năng `onboarding` có hướng dẫn cụ thể về việc điền `project` và bảo vệ tính bất biến.

---

### TASK-004 — Cập nhật Nhóm Kỹ năng Tạo và Điều phối Spec

- Status: done
- Priority: must
- Owner: developer
- Risk: medium

#### Objective
Cập nhật phần `Package resolution contract` trong các kỹ năng tạo và điều phối Spec Package (`triage`, `analyze`, `requirements`, `design`, `tasks`, `acceptance`, `adr`, `spec`, `spec-review`) để tuân thủ thuật toán phân giải đường dẫn § 5.9.

#### Requirement References
- FR-002
- FR-004
- FR-005
- BR-001

#### Design References
- DES-ARCH-001
- DES-FLOW-001
- DES-OBS-001

#### Acceptance References
- AC-002
- AC-004
- AC-005
- UT-002

#### Dependencies
- TASK-002

#### Expected File Scope
- `.agents/skills/triage/SKILL.md`
- `.agents/skills/analyze/SKILL.md`
- `.agents/skills/requirements/SKILL.md`
- `.agents/skills/design/SKILL.md`
- `.agents/skills/tasks/SKILL.md`
- `.agents/skills/acceptance/SKILL.md`
- `.agents/skills/adr/SKILL.md`
- `.agents/skills/spec/SKILL.md`
- `.agents/skills/spec-review/SKILL.md`

#### Implementation Notes
- Thêm block quy định `Path resolution (spec_config override)` theo hợp đồng § 5.9 vào mỗi file SKILL.md.
- Riêng kỹ năng `triage`: cập nhật thêm bước khởi tạo thư mục và các thư mục con tại `docs_root` tương ứng (nếu override thì tạo tại `<path>/<project>/tasks/REQ-*`).

#### Verification
- Kiểm tra toàn bộ 9 file skill trên đã có đoạn văn bản phân giải đồng nhất.

#### Definition of Done
- Toàn bộ 9 skill tạo spec phản ánh đúng quy tắc tìm kiếm và khởi tạo package theo `docs_root`.

---

### TASK-005 — Cập nhật Nhóm Kỹ năng Thực thi, Kiểm thử và Quản lý

- Status: done
- Priority: must
- Owner: developer
- Risk: medium

#### Objective
Cập nhật phần `Package resolution` và đường dẫn ghi nhận bằng chứng (`reviews/`, `qa/`) trong các kỹ năng thực thi (`develop`, `review`, `qa`, `converge`, `project-manager`) để tuân thủ § 5.9.

#### Requirement References
- FR-002
- FR-004
- FR-005
- BR-001

#### Design References
- DES-ARCH-001
- DES-FLOW-001
- DES-OBS-001

#### Acceptance References
- AC-002
- AC-004
- AC-005
- UT-002
- ST-001

#### Dependencies
- TASK-004

#### Expected File Scope
- `.agents/skills/develop/SKILL.md`
- `.agents/skills/review/SKILL.md`
- `.agents/skills/qa/SKILL.md`
- `.agents/skills/converge/SKILL.md`
- `.agents/skills/project-manager/SKILL.md`

#### Implementation Notes
- Cập nhật quy tắc xác định vị trí package và ghi file evidence theo `docs_root`.
- Trong `project-manager`: cập nhật lưu ý về `Onboarded detection` (vẫn yêu cầu thư mục `docs/` tồn tại trong repo cho tài liệu chung, nhưng các REQ package sẽ nằm tại `docs_root` nếu override).

#### Verification
- Kiểm tra 5 file kỹ năng đảm bảo tính thống nhất trong việc đọc/ghi manifest và bằng chứng.

#### Definition of Done
- Toàn bộ 5 kỹ năng thực thi và quản lý đã được cập nhật đường dẫn phân giải.

---

### TASK-006 — Cập nhật Tài liệu Điều phối Cấp cao (Governance Docs)

- Status: done
- Priority: must
- Owner: developer
- Risk: low

#### Objective
Cập nhật các tài liệu điều phối gốc của pipeline (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`) để phản ánh cơ chế `spec_config.json` override path, cập nhật phần mô tả Canonical path từ cố định sang có hỗ trợ cấu hình chuyển hướng.

#### Requirement References
- FR-005
- NFR-001

#### Design References
- DES-ARCH-001
- Minimum File Scope

#### Acceptance References
- AC-005
- ST-002

#### Dependencies
- TASK-005

#### Expected File Scope
- `AGENTS.md`
- `GEMINI.md`
- `CLAUDE.md`

#### Implementation Notes
- Trong phần `Canonical path`: bổ sung ghi chú giải thích rằng `docs/tasks/REQ-*` là đường dẫn mặc định trong repo, và khi có cấu hình override trong `.agents/configs/spec_config.json`, tài liệu sẽ nằm tại `<path>/<project>/tasks/REQ-*`.
- Đảm bảo giữ nguyên các hard gates và quy định về sub-agent.

#### Verification
- Đọc lại 3 file root docs để xác minh tính chính xác và nhất quán.

#### Definition of Done
- `AGENTS.md`, `GEMINI.md`, `CLAUDE.md` đã đề cập đầy đủ và rõ ràng về cơ chế `spec_config.json`.

---

## Execution Summary

| Task | Status | Dependencies | Requirements | Acceptance |
|---|---|---|---|---|
| TASK-001 | done | None | FR-001, BR-001, NFR-001 | AC-001, UT-001 |
| TASK-002 | done | TASK-001 | FR-002, FR-003, FR-004, BR-001, BR-002, NFR-002 | AC-002, AC-003, AC-004, UT-002 |
| TASK-003 | done | TASK-002 | FR-003, FR-004, BR-002 | AC-003, UT-003 |
| TASK-004 | done | TASK-002 | FR-002, FR-004, FR-005, BR-001 | AC-002, AC-004, AC-005, UT-002 |
| TASK-005 | done | TASK-004 | FR-002, FR-004, FR-005, BR-001 | AC-002, AC-004, AC-005, UT-002, ST-001 |
| TASK-006 | done | TASK-005 | FR-005, NFR-001 | AC-005, ST-002 |
