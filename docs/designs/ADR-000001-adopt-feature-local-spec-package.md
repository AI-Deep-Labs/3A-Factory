# Architectural Decision Record: Adopt Feature-local Spec Package

> Body: Vietnamese. Technical terminology giữ English khi phù hợp.

*   **Status**: Accepted
*   **Author**: Principal Solution Architect / AI Agent Workflow Architect (Phase 0)
*   **Date**: 2026-07-23
*   **Accepted date**: 2026-07-23
*   **Decision owner**: repository maintainers (chấp thuận qua lệnh thực hiện Phase 1)
*   **Decision Code**: ADR-000001-adopt-feature-local-spec-package
*   **Related REQ**: (không có — quyết định kiến trúc package-level của 3A-Factory)
*   **Target major version (khuyến nghị)**: `3.0.0` (hiện `package.json` = `3.0.0-rc.6` pre-release; GA `3.0.0` sau RC)
*   **Implementation note**: Phase 1 bắt đầu triển khai Spec Package contract, manifest schema, templates và governance. Không thay đổi nội dung quyết định kiến trúc đã chốt.

---

## 1. Context

### 1.1 Workflow hiện tại (đã xác minh)

Pipeline chuẩn được tuyên bố nhất quán tại:

- `README.md` (Pipeline)
- `AGENTS.md` (Mission + Hard gates)
- `CLAUDE.md` / `GEMINI.md`
- `templates/WORKFLOW.md`
- `templates/.cursor/rules/ai-workflow.mdc`
- `templates/skills/workflow/project-manager.md`

Thứ tự hiện tại:

```text
triage → (grill-me if unclear) → analyze → ADR? → design → spec
  → (user APPROVED) → Planning? → develop → review → qa
  → stop for user review
```

Deploy tách biệt: `/deploy` + `APPROVED` (`templates/skills/workflow/deploy.md`).

### 1.2 Trách nhiệm skill hiện tại (đã xác minh từ `templates/skills/workflow/`)

| Skill | Artifact / vai trò |
|---|---|
| `triage` | `docs/requirements/REQ-…-raw.md` |
| `grill-me` | `docs/requirements/REQ-…-discovery.md` |
| `analyze` | `docs/designs/REQ-…-analysis.md` + risk |
| `adr` | `docs/designs/ADR-….md` (optional) |
| `design` | `docs/designs/REQ-…-design.md` (How) |
| `spec` | `docs/requirements/REQ-…-spec.md` (What + AC + System Test + UAT) |
| `plan` | `docs/designs/REQ-…-plan.md` (bắt buộc nếu high risk) |
| `develop` | Sửa source theo plan hoặc design scope |
| `review` | `docs/reviews/REQ-…-review.md` |
| `qa` | `docs/qa/REQ-…-UT.md` + `…-qa.md` + test sources |
| `deploy` | `docs/release-notes/REQ-…-release.md` |
| `project-manager` | Orchestrate toàn pipeline; không gọi deploy |

### 1.3 Artifact layout phân tán (đã xác minh)

Canonical layout trong `AGENTS.md` / `README.md` và scaffold installer (`scripts/install.js` → `sharedDirs`):

```text
docs/
├── requirements/   # raw, discovery, spec
├── designs/        # analysis, design, plan, ADR
├── reviews/
├── qa/             # qa, UT, run logs
├── release-notes/
└── misc/…
```

Một feature bị tách theo **loại lifecycle folder**, không theo **feature package**. Agent phải tự ráp execution context từ nhiều path.

### 1.4 Approval gate hiện tại

- Keyword duy nhất: `APPROVED` (`AGENTS.md` Workflow directives; `templates/WORKFLOW.md`).
- Dùng cho nhiều ngữ cảnh khác nhau: sau spec (mọi risk), trước develop khi high risk, trước mọi deploy.
- Không có machine-readable approval state; phụ thuộc conversation context (`develop.md`, `deploy.md`).

### 1.5 Develop / Review / QA đang dựa vào gì

- **Develop** (`develop.md`): bắt buộc `analysis` + `design` + `spec` đã `APPROVED`; high risk thêm `plan` + develop `APPROVED`; boundary = Files Expected To Change (plan) hoặc file/module scope (design).
- **Review** (`review.md`): diff so với AC trong spec + scope design/plan.
- **QA** (`qa.md`): AC + System Test Conditions + UAT Conditions trong `*-spec.md` là nguồn xác minh chính.

### 1.6 Duplicated truth (đã xác minh từ templates)

So sánh `SPEC-template.md`, `DESIGN-template.md`, `PLAN-template.md`:

| Nội dung | Spec | Design | Plan |
|---|---|---|---|
| Modules / affected modules | §9 | Modules / main flows | Scope + architecture |
| Data / API / Config | §10 | API / DB / Config | §8–10 |
| File/module change list | Affected Modules (mô tả) | Minimum file/module scope (required) | Files Expected To Change (develop boundary) |
| Approach / How | Expected Behavior + Flow | Solution approach | Design Approach + Step-by-step |
| Verification | AC + ST + UAT | (không) | Test Plan |

Hệ quả: cùng một truth nghiệp vụ/kỹ thuật có thể xuất hiện ở nhiều file; không có rule “một thông tin chỉ một authoritative artifact”; khi sửa sau approval dễ lệch giữa spec/design/plan.

### 1.7 Khó khăn vận hành đã quan sát từ mô hình hiện tại

1. **Trạng thái feature không machine-readable** — Status nằm trong markdown metadata rời (`SPEC-template` Status; `PLAN-template` Status); không có package-level state machine.
2. **Trace Requirement → Design → Task → Acceptance → Test yếu** — Spec có AC/ST/UAT ids; Design/Plan không bắt buộc ID; Plan không bắt buộc map task → AC/design.
3. **Develop phải suy luận execution context** — đọc nhiều file phân tán; plan optional với low/medium (`plan.md`, `AGENTS.md` Phase meanings) nên đôi khi thiếu execution truth rõ ràng.
4. **`spec` vừa là phase vừa là file** — dễ nhầm “đã có spec” với “đã sẵn sàng develop”.
5. **Multi-agent compatibility** — Claude / Gemini / Cursor nhận cùng shared `docs/` + skill source (`scripts/install.js`, `scripts/build.js` bundle `templates/`); mọi thay đổi layout/skill semantics phải đồng bộ ba adapter.

### 1.8 Ràng buộc Phase 0

Phase này **chỉ** tạo ADR này. Không sửa skill, template, README, AGENTS, WORKFLOW, rules, installer, build, version; không migration; không commit/push; không tự sang Phase 1.

---

## 2. Goals

1. **Một feature = một package duy nhất.**
2. **Spec là Spec Package**, không còn đồng nghĩa với một file `*-spec.md`.
3. Mỗi artifact có **một authoritative responsibility**.
4. Develop có **execution entry point thống nhất** (`manifest.yaml` → `tasks.md` → current task → references).
5. **Traceability** Requirement → ADR/Design → Task → Acceptance → Test/Review evidence.
6. **Package validation** trước approval.
7. **Machine-readable state** trong `manifest.yaml`.
8. **Approval rõ ràng** theo type (`APPROVED_SPEC_PACKAGE` / `APPROVED_DEVELOP` / `APPROVED_DEPLOY`).
9. Có **migration strategy** từ layout `docs/{requirements,designs,…}` hiện tại.
10. Tiếp tục hỗ trợ **Claude Code**, **Gemini CLI**, và **Cursor**.

---

## 3. Non-goals (Phase 0)

Phase 0 **không** triển khai:

- Skill mới hoặc refactor skill hiện có
- Template mới / sửa template
- Manifest schema implementation thực tế
- Migration tool / migration skill
- Refactor installer (`scripts/install.js`) hoặc build (`scripts/build.js`)
- Coding workflow mới trong runtime agents
- Version bump (`package.json` giữ nguyên)
- Sửa README / AGENTS / WORKFLOW / Cursor rules
- Tự động bắt đầu Phase 1

---

## 4. Options considered

### Option 1 — Giữ nguyên kiến trúc hiện tại

Spec là file riêng (`docs/requirements/…-spec.md`); `adr` / `design` / `spec` / `plan` là phase độc lập; artifact tiếp tục nằm trong global lifecycle folders.

- **Ưu**: Không breaking; installer/skills hiện tại (`2.3.x`) giữ nguyên.
- **Nhược**: Duplicated truth; khó xác định package readiness; Develop thiếu execution contract thống nhất; approval keyword mơ hồ; traceability yếu.

### Option 2 — Monolithic Implementation Spec

Gộp requirements, design, tasks, acceptance vào **một file lớn**.

- **Ưu**: Một file = một feature; dễ “đã đọc xong chưa”.
- **Nhược**: Conflict review lớn; khó ownership theo skill chuyên môn; khó machine-validate từng phần; không khớp multi-agent specialist skills đã có trong `templates/skills/workflow/`.

### Option 3 — Feature-local Spec Package (chọn)

Mỗi feature một thư mục package dưới `docs/tasks/`, gồm artifact chuyên trách + `manifest.yaml`.

- **Ưu**: Single package truth; ownership rõ; validation/gate được; Develop deterministic; phù hợp refactor dần specialist skills.
- **Nhược**: Nhiều file hơn; cần manifest/validator; cần migration và compatibility layer; breaking change → major version.

**Quyết định lựa chọn: Option 3.**

---

## 5. Decision

**3A-Factory sử dụng Feature-local Spec Package làm kiến trúc chuẩn cho lifecycle của một feature.**

Spec Package là tập hợp các artifact:

- Yêu cầu nghiệp vụ
- Phân tích
- Quyết định kiến trúc (feature-local ADR)
- Thiết kế kỹ thuật
- Task thực thi
- Điều kiện nghiệm thu
- Trạng thái (manifest)
- Review evidence
- QA evidence
- Release evidence

**Spec không còn đồng nghĩa với một file `*-spec.md`.**

---

## 6. Canonical target structure

```text
docs/tasks/
└── REQ-000001-example-feature/
    ├── manifest.yaml
    ├── raw.md
    ├── discovery.md
    ├── analysis.md
    ├── requirements.md
    ├── design.md
    ├── tasks.md
    ├── acceptance.md
    ├── decisions/
    │   └── ADR-000001-example.md
    ├── reviews/
    │   └── code-review.md
    ├── qa/
    │   ├── unit-test-report.md
    │   ├── system-test-report.md
    │   ├── uat-report.md
    │   └── runs/
    └── release/
        └── release-notes.md
```

### Nguyên tắc

- Một feature ↔ một package.
- Artifact của feature **không** ghi phân tán trong các global lifecycle folder kiểu `docs/requirements|designs|reviews|qa|release-notes` (layout hiện tại trong `AGENTS.md` / installer).
- Global project documentation (ví dụ `docs/project_overview.md` từ onboarding) **vẫn có thể** tồn tại ngoài `docs/tasks/`.
- Feature-specific ADR nằm trong `decisions/`.
- Project-wide ADR cần **canonical global location riêng** (ví dụ tiếp tục `docs/designs/ADR-*.md` hoặc `docs/decisions/` — chốt chi tiết ở Phase 1 governance; Phase 0 chỉ yêu cầu có location global tách khỏi feature package).

---

## 7. Artifact ownership

| Artifact | Authoritative responsibility |
|---|---|
| `raw.md` | Yêu cầu gốc |
| `discovery.md` | Q&A, clarification, assumptions |
| `analysis.md` | Current state, impact, dependency, risk |
| `requirements.md` | Business Truth — WHAT và WHY |
| `decisions/*.md` | Decision Truth — options, trade-offs, rationale |
| `design.md` | Technical Truth — HOW |
| `tasks.md` | Execution Truth |
| `acceptance.md` | Verification Truth và Definition of Done |
| `manifest.yaml` | Package State Truth |
| `reviews/*` | Review evidence |
| `qa/*` | Test evidence |
| `release/*` | Release evidence |

### Quy tắc ownership

- Một thông tin chỉ có **một** authoritative artifact.
- Artifact khác chỉ **tham chiếu bằng ID** (không copy lại nội dung authoritative).
- Design không tự tạo business requirement.
- Tasks không tự tạo technical decision.
- Develop không tự thay đổi requirement hoặc architecture.

---

## 8. Skill architecture

```text
project-manager
└── Spec Package lifecycle
    ├── triage
    ├── grill-me
    ├── analyze
    ├── spec                 # package orchestrator
    ├── requirements
    ├── adr
    ├── design
    ├── tasks                # thay plan
    ├── acceptance
    ├── spec-review
    ├── develop
    ├── review
    ├── qa
    ├── converge
    └── deploy
```

### Chốt

- `spec` trở thành **package orchestrator** — điều phối specialist skills; **không** biến thành skill khổng lồ tự làm mọi việc.
- Specialist skills vẫn độc lập (phù hợp model cài đặt hiện tại: mỗi skill một file nguồn trong `templates/skills/workflow/`, emit ra `.claude` / `.gemini` / `.cursor`).
- `plan` được thay bằng `tasks`.
- `/plan` có thể là **deprecated alias** của `/tasks` trong compatibility period.
- `tasks.md` **bắt buộc** cho mọi feature (feature nhỏ có thể chỉ một task).
- `acceptance.md` là nguồn chính của QA (thay vai trò ST/UAT/AC đang nằm trong `*-spec.md`).
- `converge` kiểm tra đồng bộ giữa package, code và evidence trước khi kết thúc lifecycle.

---

## 9. Target workflow

```text
triage
→ grill-me if unclear
→ analyze
→ build/refine Spec Package
    ├── requirements
    ├── ADR if needed
    ├── design
    ├── tasks
    └── acceptance
→ spec-review
→ user APPROVED_SPEC_PACKAGE
→ develop task-by-task
→ review
→ qa
    ├── Unit Test
    ├── System Test
    └── UAT auto-loop
→ converge
→ user review
→ deploy only by explicit approval (APPROVED_DEPLOY)
```

Requirements, ADR, Design, Tasks và Acceptance là **thành phần trong lifecycle của Spec Package**, không phải các phase nằm ngoài Spec Package.

---

## 10. Approval model

| Approval type | Khi nào |
|---|---|
| `APPROVED_SPEC_PACKAGE` | Bắt buộc trước Develop |
| `APPROVED_DEVELOP` | Có thể bắt buộc thêm khi high-risk |
| `APPROVED_DEPLOY` | Mọi deploy; kèm explicit deploy command |

### Quy tắc

- Không Develop khi chưa `APPROVED_SPEC_PACKAGE`.
- High-risk có thể yêu cầu thêm `APPROVED_DEVELOP` (tương thích tinh thần gate hiện tại trong `develop.md` / `AGENTS.md`).
- Deploy luôn cần explicit command + `APPROVED_DEPLOY` (tương thích `deploy.md`: không bao giờ auto-deploy từ PM).
- Approval **ghi trong `manifest.yaml`**.
- Nếu requirement / design / task / acceptance thay đổi đáng kể sau approval → phải validate và approve lại.
- Compatibility period: có thể chấp nhận keyword `APPROVED` cũ, nhưng **internal state phải map rõ** sang approval type cụ thể.

---

## 11. Develop execution contract

Develop Agent đọc theo thứ tự:

```text
manifest.yaml
→ tasks.md
→ current TASK
→ referenced requirements
→ referenced design
→ referenced ADR
→ referenced acceptance
→ code
```

### Develop không được

- Code khi package chưa approved
- Tự chọn task ngoài `execution.current_task`
- Bỏ qua dependency giữa tasks
- Tự tạo requirement
- Tự thay đổi architecture
- Mở rộng scope ngoài task/design references
- Tự đoán khi reference bị thiếu

Khi thiếu hoặc mâu thuẫn → trả `TASK_BLOCKED` và chuyển về đúng producer skill (requirements / design / adr / tasks / acceptance / spec-review).

---

## 12. Traceability contract

### ID chuẩn

- `FR-001`, `BR-001`, `NFR-001`
- `DES-ARCH-001`, `DES-API-001`, `DES-DATA-001`, `DES-FLOW-001`
- `TASK-001`
- `AC-001`
- `UT-001`, `ST-001`, `UAT-001`
- `PERF-001`, `SEC-001`

### Chuỗi truy vết

```text
Requirement → ADR/Design → Task → Acceptance → Test Evidence → Review Evidence
```

Mỗi task phải trace được về requirement + design (khi cần coding) + acceptance. Mỗi acceptance/test nên trace ngược về requirement.

---

## 13. Manifest contract

`manifest.yaml` là machine-readable package state.

Minimum semantic contract (Phase 0 chốt semantics; **không** implement schema):

```yaml
schema_version:
id:
slug:
title:
risk:
status:

artifacts:
  raw:
  discovery:
  analysis:
  requirements:
  design:
  tasks:
  acceptance:

decisions: []

validation:
  status:
  reviewed_at:
  blockers: []
  warnings: []

approval:
  spec_package:
    status:
    approved_by:
    approved_at:
  develop:
    status:
    approved_by:
    approved_at:
  deploy:
    status:
    approved_by:
    approved_at:

execution:
  current_task:
  completed_tasks: []
  blocked_tasks: []

qa:
  unit_test:
  system_test:
  uat:
  converge:
```

---

## 14. State machine

```text
new
→ triaged
→ clarifying
→ analyzed
→ specifying
→ validating
→ awaiting_approval
→ approved
→ implementing
→ reviewing
→ qa
→ converging
→ awaiting_user_review
→ done
```

### Exceptional states

- `blocked`
- `rejected`
- `superseded`
- `cancelled`

**Chỉ** `approved` hoặc các trạng thái execution hợp lệ **sau** approval mới cho phép Develop.

---

## 15. Validation gate (`spec-review`)

`spec-review` phải kiểm tra tối thiểu:

1. Không còn critical open question
2. Requirements đủ rõ để implement/verify
3. Requirement cần coding có design coverage
4. Task trace được về requirement và design
5. Task có acceptance reference
6. Không có task ngoài scope
7. ADR liên quan có trạng thái hợp lệ
8. Không có duplicated authoritative truth
9. Manifest hợp lệ
10. Không còn blocker trong `validation.blockers`

Fail bất kỳ mục critical → không được chuyển `awaiting_approval` / không được nhận `APPROVED_SPEC_PACKAGE`.

---

## 16. Backward compatibility

Chiến lược chuyển tiếp (chốt hướng; implement ở Phase 4):

1. Feature **mới** chỉ ghi vào `docs/tasks/`.
2. **Không** tự động xóa artifact cũ dưới `docs/…`.
3. Có **legacy read-only resolver** trong giai đoạn chuyển tiếp (map `docs/requirements|designs|reviews|qa|release-notes` → logical package view).
4. Có migration tool hoặc migration skill.
5. `*-spec.md` cũ được tách thành `requirements.md` + `acceptance.md`.
6. `*-plan.md` cũ được migrate thành `tasks.md`.
7. Conflict phải được **ghi nhận** (không tự động chọn im lặng).
8. `/plan` giữ tạm như **deprecated alias** của `/tasks`.

Phù hợp precedent breaking-change đã có trong `README.md` (artifacts từng chuyển từ `.agents/{specs,plans,…}` → `docs/...`).

---

## 17. Versioning

Đây là **breaking change**.

Khuyến nghị target major version: **`3.0.0`**.

### Lý do

- Đổi artifact layout (`docs/…` lifecycle folders → `docs/tasks/<REQ>/…`)
- Đổi trách nhiệm skill (`spec` orchestrator; `plan` → `tasks`; thêm requirements/acceptance/spec-review/converge)
- Đổi command semantics (`/plan` deprecated alias)
- Đổi approval semantics (typed approvals + manifest)
- Đổi Develop execution contract
- Đổi installer output expectation (`scripts/install.js` hiện scaffold `docs/requirements|designs|…` và copy template set cũ)

**Phase 0 không sửa `package.json` (hiện `2.3.1`).** Version bump thuộc Phase 6.

---

## 18. Consequences

### Lợi ích

- Single Source of Truth rõ hơn theo feature package
- Traceability mạnh hơn nhờ ID contract
- Develop deterministic hơn (manifest + current task)
- Giảm duplicated truth nhờ ownership table
- Dễ validate (spec-review + manifest)
- Dễ migrate / archive / audit theo thư mục feature
- Review và QA có nguồn đối chiếu rõ (`acceptance.md` + evidence folders)
- Hỗ trợ multi-agent tốt hơn: cùng một package path cho Claude / Gemini / Cursor

### Hạn chế

- Nhiều artifact hơn mỗi feature
- Cần manifest + validator
- Cần migration và compatibility layer
- Cần refactor skill, template, installer, build (Phases 1–5)
- Nguy cơ stale reference giữa IDs
- Có thể over-engineering với task rất nhỏ (mitigation: cho phép một task duy nhất)

---

## 19. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Over-engineering cho feature nhỏ | `tasks.md` bắt buộc nhưng cho phép 1 task; template tối giản cho low risk |
| Package drift (artifact lệch nhau) | `spec-review` + `converge`; re-approval khi thay đổi đáng kể |
| Broken references | Validation gate bắt buộc ID links; `TASK_BLOCKED` khi thiếu reference |
| Migration data loss | Không auto-delete legacy; conflict report; dry-run migration |
| Legacy incompatibility | Legacy read-only resolver + deprecated aliases |
| Agent bỏ qua manifest | Develop hard-gate đọc manifest trước; PM enforce state machine |
| Installer thiếu artifact mới | Phase 5: cập nhật `sharedDirs` / `sharedFiles` / adapters + smoke test |
| Hành vi không đồng nhất Claude/Gemini/Cursor | Một skill source trong `templates/skills/`; build bundle; parity checklist ba agent |
| Approval ambiguity | Typed approvals trong manifest; map `APPROVED` cũ → type cụ thể |
| Context package quá lớn | Develop chỉ load current task + referenced slices; không dump cả package |
| Circular dependency (task/design/req) | Validation từ chối cycle; ownership rule cấm producer vượt quyền |
| Đổi Design sau Develop | State → re-validate; thu hồi/require lại `APPROVED_SPEC_PACKAGE`; tasks bị ảnh hưởng → `blocked` |

---

## 20. Implementation roadmap

### Phase 1 — Contracts, templates và governance

- Manifest schema
- Requirements / Tasks / Acceptance / Spec-review templates
- Governance documentation (global ADR location, ID rules, approval keywords)

### Phase 2 — Spec Package producer skills

- Refactor `spec` (orchestrator)
- Tạo `requirements`
- Update `adr`, `design`
- Thay `plan` bằng `tasks` (+ alias)
- Tạo `acceptance`, `spec-review`

### Phase 3 — Execution skills

- Update `project-manager`, `develop`, `review`, `qa`
- Tạo `converge`

### Phase 4 — Compatibility và migration

- Legacy aliases, package resolver, migration tool, conflict reporting

### Phase 5 — Build, installer và CI

- Claude / Gemini / Cursor adapters
- Bundle validation (`scripts/build.js`)
- Installer smoke test
- Schema validation

### Phase 6 — Documentation và release

- README, upgrade guide, example package, breaking changes, release notes
- Version bump → `3.0.0`

**Phase 1 chỉ bắt đầu sau khi ADR này được Accepted.**

---

## 21. ADR status

- **Status**: `Accepted` (2026-07-23)
- **Decision owner**: repository maintainers
- **Điều kiện chuyển `Accepted`**: đã thỏa — lệnh thực hiện Phase 1 của người dùng được xem là chấp thuận ADR
- **Phase 1**: đang triển khai contract, schema, templates và governance (không refactor workflow skills)
- **Phase 0**: đã hoàn tất (chỉ tạo ADR)

---

## Phụ lục A — Decision & Rationale (tóm tắt)

Chọn Feature-local Spec Package vì nó giải quyết trực tiếp các điểm yếu đã xác minh của mô hình phân tán `docs/{requirements,designs,reviews,qa}` + file `*-spec.md` đơn lẻ, trong khi vẫn giữ được mô hình specialist skills cần thiết cho ba runtime agent (Claude / Gemini / Cursor) mà installer hiện tại đang emit từ cùng một `templates/skills/` source.

## Phụ lục B — Next Steps Plan

1. User/maintainers review ADR-000001.
2. Nếu Accepted → bắt đầu Phase 1 (contracts/templates/governance only).
3. Nếu Rejected / cần chỉnh → refine ADR **in place** (không tạo ADR song song cho cùng quyết định), giữ status phù hợp cho đến khi Accepted.
