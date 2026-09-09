# Phân tích - REQ-000001-spec-config-override

## Metadata

- Package: `docs/tasks/REQ-000001-spec-config-override/`
- Analyzed by: Architect (sub-agent)
- Analyzed at: 2026-09-09T14:54:00+07:00
- Source: `raw.md`

## Problem Analysis

### Bài toán

Hiện tại, 3a-factory pipeline luôn ghi tất cả artifact (Spec Package docs) dưới `docs/tasks/REQ-*` **trong chính repo đang đứng**. Điều này hoạt động tốt cho single-project nhưng gặp hạn chế khi:

1. **Multi-project**: nhiều dự án muốn dùng chung 1 knowledge repository trung tâm
2. **Separation of concerns**: tách biệt knowledge/docs ra khỏi codebase source
3. **Reuse**: cho phép cross-project reference và centralized knowledge management

### Giải pháp đề xuất

Thêm file cấu hình `spec_config.json` trong `.agents/configs/` với cơ chế `override`:
- `override: false` → giữ nguyên behavior hiện tại (ghi vào repo)
- `override: true` → ghi docs vào external path được chỉ định

## Current State

### Codebase structure liên quan

| Component | Path | Vai trò |
|---|---|---|
| Installer | `scripts/install.js` | Scaffold files khi install |
| Spec Package Contract | `.agents/contracts/spec-package.md` | Source of truth cho layout/rules |
| Manifest Schema | `.agents/schemas/spec-package-manifest.schema.json` | Validate manifest |
| Manifest Template | `.agents/templates/SPEC-PACKAGE-MANIFEST-template.yaml` | Khởi tạo manifest |
| Configs | `.agents/configs/` | Hiện chỉ có `subagents.json` |
| AGENTS.md | `AGENTS.md` | Canonical path = `docs/tasks/REQ-*` |
| GEMINI.md / CLAUDE.md | Root | Canonical path reference |

### Skills bị ảnh hưởng (tất cả skill ghi file dưới `docs/tasks/`)

| Skill | File tạo/sửa | Loại tác động |
|---|---|---|
| `triage` | `manifest.yaml`, `raw.md`, thư mục REQ | Khởi tạo package + tạo subfolder |
| `analyze` | `analysis.md` | Ghi file |
| `requirements` | `requirements.md` | Ghi file |
| `design` | `design.md` | Ghi file |
| `tasks` | `tasks.md` | Ghi file |
| `acceptance` | `acceptance.md` | Ghi file |
| `adr` | `decisions/ADR-*.md` | Ghi file |
| `spec` | Orchestrator — gọi skill con | Không trực tiếp tạo file |
| `spec-review` | `spec-review.md` | Ghi file |
| `develop` | `reviews/TASK-*-implementation.md` | Ghi file evidence |
| `review` | `reviews/TASK-*-code-review.md` | Ghi file evidence |
| `qa` | `qa/*.md` | Ghi nhiều file report |
| `converge` | `qa/converge-report.md` | Ghi file |
| `project-manager` | `manifest.yaml` (chỉ update fields) | Sửa file |
| `onboarding` | `.agents/configs/spec_config.json` (set project) | Set project field 1 lần, immutable guard |
| `branch-guard` | Không tạo docs | Không bị ảnh hưởng |
| `release-manager` | Git commits only | Không bị ảnh hưởng |

### Package resolution pattern hiện tại

Tất cả skill đều dùng pattern:
```text
1. Valid package path → use
2. Else REQ id → exactly one docs/tasks/REQ-<NNNNNN>-*/
3. Multiple → PACKAGE_CONFLICT. None → PACKAGE_NOT_FOUND
```

Canonical path: `docs/tasks/REQ-<NNNNNN>-<slug>/` — hardcoded trong contract, AGENTS.md, và mọi skill.

## Business Impact

- **Positive**: Cho phép centralized knowledge management, multi-project sharing
- **Breaking change risk**: THẤP nếu `override: false` là default (backward compatible)
- **User experience**: Không thay đổi khi override=false; khi override=true user cần setup external path trước

## Technical Impact

### Phạm vi thay đổi

**Rất rộng nhưng có pattern lặp lại** — 14+ skill files đều dùng cùng 1 pattern resolution.

#### Layer 1: Infrastructure (core change)
1. **Installer** (`scripts/install.js`): Tạo `spec_config.json` default khi install
2. **Spec Package Contract** (`.agents/contracts/spec-package.md`): Thêm section về override mechanism
3. **Manifest Schema** (`.agents/schemas/spec-package-manifest.schema.json`): Không cần thay đổi schema manifest (manifest nằm trong package dù ở đâu)

#### Layer 2: Path resolution (mọi skill)
Tất cả 14 skill cần thêm logic:
```text
1. Đọc .agents/configs/spec_config.json
2. Nếu override == true:
   - base_path = spec_config.path (thay vì repo_root)
   - Canonical path: <base_path>/docs/tasks/REQ-*/
3. Nếu override == false hoặc file không tồn tại:
   - Giữ nguyên behavior hiện tại
```

#### Layer 3: Documentation
- `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`: Thêm mô tả về override mechanism
- Contract: Update canonical path rule

### Thiết kế suggested: Centralized Path Resolver

Thay vì sửa từng skill, tạo một **path resolution contract section** mới trong `spec-package.md` mà mọi skill đều follow:

```text
## Path Resolution (with spec_config override)

1. Read .agents/configs/spec_config.json
2. If file missing or override == false:
   - docs_root = <repo_root>/docs/tasks/
3. If override == true:
   - Validate: path exists, is accessible
   - Validate: project is non-empty
   - docs_root = <spec_config.path>/<spec_config.project>/tasks/
4. All package operations use docs_root as base
5. Package resolution: docs_root/REQ-<NNNNNN>-<slug>/
```

### Project field immutability

- `project` field trong `spec_config.json` được set **1 lần duy nhất** khi onboarding
- Nếu `project` đã có giá trị (non-empty) → KHÔNG được phép sửa đổi
- Guard logic: skill `onboarding` kiểm tra `spec_config.project != ""` trước khi ghi
- Failure token: `PROJECT_ALREADY_SET` nếu cố ghi đè

### Rủi ro kỹ thuật

| Rủi ro | Mức | Giải pháp |
|---|---|---|
| External path không tồn tại | Medium | Validate khi đọc config; fail fast nếu invalid |
| Permission lỗi trên external path | Medium | Check write permission; report rõ lỗi |
| Cross-OS path format | Low | Đã dùng path.resolve() trong installer |
| Inconsistency giữa override vs non-override | Medium | Manifest phải self-contained; relative paths trong manifest không thay đổi |
| Skill quên apply override | High | Centralize logic vào contract/instruction duy nhất |

## Data Impact

- Không có database hay schema change
- Chỉ ảnh hưởng file system path cho docs artifacts
- Manifest vẫn dùng relative path cho artifact references (không cần sửa schema)

## Security Impact

- `spec_config.path` cho phép ghi file ra ngoài repo → cần validate path không chứa path traversal (`..`)
- Không ảnh hưởng auth/authorization

## Operational Impact

- Installer cần tạo `spec_config.json` default (override: false)
- Khi user muốn centralize, chỉ cần sửa override=true + path
- Không ảnh hưởng CI/CD pipeline hiện tại (nếu override=false)

## Dependencies

- Không có dependency ngoài
- Mọi thay đổi nằm trong repo 3a-factory
- Không cần thay đổi package.json hay dependencies

## Constraints

1. **Backward compatibility**: `override: false` PHẢI giữ nguyên behavior hiện tại 100%
2. **Fail-safe**: Nếu `spec_config.json` không tồn tại → behavior default (không override)
3. **Skill uniformity**: Tất cả skill phải apply cùng path resolution logic
4. **Manifest independence**: `manifest.yaml` artifacts dùng relative paths, không hardcode absolute path

## Risks

| # | Risk | Level | Mitigation |
|---|---|---|---|
| R1 | Số lượng skill files cần sửa lớn (14+) | Medium | Pattern lặp lại → batch update |
| R2 | Skill mới trong tương lai quên apply override | Medium | Centralize vào contract + skill template |
| R3 | User misconfigure path → silent failure | Medium | Validate + clear error messages |
| R4 | Relative vs absolute path confusion | Low | Contract quy định rõ |

## Options Requiring ADR

**ADR_NOT_REQUIRED**

Lý do: Thay đổi này là **additive** — thêm 1 cấu hình mới mà khi disabled (default) thì hệ thống hoạt động y hệt cũ. Không phải:
- Shared public API/contract change (chỉ nội bộ pipeline)
- DB schema change
- Auth/authorization change
- Production deploy/infra change

Approach khá rõ ràng (1 config file + path resolver logic). Không cần ADR formal.

## Recommended Direction

1. Thêm `spec_config.json` vào installer shared files (default: override=false, project="", path="")
2. Update `spec-package.md` contract với path resolution section mới (dùng `<path>/<project>/tasks/`)
3. Update mọi skill SKILL.md thêm "read spec_config → resolve docs_root"
4. Update `onboarding` skill: set `project` field khi onboarding lần đầu, guard immutability
5. Update `AGENTS.md`, `GEMINI.md`, `CLAUDE.md` với thông tin override
6. Update installer `scripts/install.js` để scaffold `spec_config.json`
7. Thêm validation vào path resolution: path tồn tại, project non-empty khi override=true
8. Không cần sửa manifest schema (manifest nằm trong package, dùng relative paths)

## Open Blockers

Không có blocker. Yêu cầu đủ rõ ràng để tiến hành spec.

## Analysis Result

- **Risk**: `medium`
- **ADR**: `ADR_NOT_REQUIRED`
- **Recommended**: Proceed to `spec` (requirements → design → tasks → acceptance → spec-review)
- **Key insight**: Mặc dù ảnh hưởng nhiều file (14+ skills + contract + installer + root docs), pattern sửa lại rất đồng nhất — cùng 1 logic path resolution. Cách tiếp cận: centralize instruction vào contract, mỗi skill chỉ cần 1-2 dòng reference.
