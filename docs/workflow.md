# Workflow 3A-Factory (Feature-local Spec Package)

Tài liệu vận hành cho phiên bản **3.0.0**. Spec = package dưới `docs/tasks/`, không phải single document.

## 1–11. Producer (intake → Spec Package approval)

| # | Phase | Skill / action | Kết quả chính |
|---|---|---|---|
| 1 | Request intake | User mô tả nhu cầu | Input thô |
| 2 | Triage | `/triage` | Package + `raw.md`, status `triaged` |
| 3 | Clarification | `/grill-me` nếu unclear | `discovery.md`, có thể `clarifying` |
| 4 | Analysis | `/analyze` | `analysis.md`, risk, `analyzed` |
| 5 | Requirements | `/requirements` | `requirements.md` (Business Truth) |
| 6 | ADR | `/adr` nếu cần | `decisions/ADR-…` hoặc `ADR_NOT_REQUIRED` |
| 7 | Design | `/design` | `design.md` (Technical Truth) |
| 8 | Tasks | `/tasks` | `tasks.md` (Execution Truth) |
| 9 | Acceptance | `/acceptance` | `acceptance.md` (Verification Truth) |
| 10 | Spec review | `/spec-review` | `spec-review.md`, `validating` → `awaiting_approval` |
| 11 | Spec approval | User `APPROVED_SPEC_PACKAGE` | `approved` |

Orchestrator `/spec` điều phối các bước 5–10.

## 12–21. Execution (task loop → done → deploy)

| # | Phase | Skill / action | Kết quả chính |
|---|---|---|---|
| 12 | Task selection | `/project-manager` | Chọn task ready (dependency OK) |
| 13 | Develop | `/develop` | Implement đúng 1 task; evidence |
| 14 | Review | `/review` | Pass → task `done`; Fail → quay develop |
| 15 | Repeat | PM + develop + review | Đến khi mọi task `done` |
| 16 | QA | `/qa` | Verify AC/UT/ST/UAT |
| 17 | QA repair | develop → review → qa | Max **3** attempts; ownership theo loại defect |
| 18 | Converge | `/converge` | Evidence check → `awaiting_user_review` |
| 19 | User review | `APPROVED_USER_REVIEW` | `done` |
| 20 | Done | — | Feature closed về workflow |
| 21 | Deploy | `/deploy` + `APPROVED_DEPLOY` | Deploy riêng; không gộp với bước 19 |

## State transition table

| From | To | Trigger |
|---|---|---|
| `new` | `triaged` | triage |
| `triaged` | `clarifying` | grill-me / unclear |
| `clarifying` | `analyzed` | analyze sau discovery |
| `triaged` | `analyzed` | analyze (clear) |
| `analyzed` | `specifying` | requirements/design/tasks/acceptance |
| `specifying` | `validating` | spec-review start |
| `validating` | `awaiting_approval` | spec-review PASSED |
| `awaiting_approval` | `approved` | `APPROVED_SPEC_PACKAGE` |
| `approved` | `implementing` | develop task |
| `implementing` | `reviewing` | develop xong task |
| `reviewing` | `implementing` | review FAIL |
| `reviewing` | `implementing` / next | review PASS + còn task |
| `reviewing` | `qa` | review PASS + mọi task done |
| `qa` | `implementing` | QA fail (implementation) |
| `qa` | `converging` | QA PASS |
| `converging` | `awaiting_user_review` | converge PASS |
| `awaiting_user_review` | `done` | `APPROVED_USER_REVIEW` |
| `*` | `blocked` / `rejected` / `cancelled` | policy / reject / cancel |

## Approval gate table

| Gate | Token | Precondition | Effect |
|---|---|---|---|
| Spec Package | `APPROVED_SPEC_PACKAGE` | validation + spec-review PASSED, no blockers | `approved`; mở develop |
| Develop (high risk) | `APPROVED_DEVELOP` | policy yêu cầu | Cho phép develop |
| User review | `APPROVED_USER_REVIEW` | converge PASS, `awaiting_user_review` | `done` |
| Deploy | `APPROVED_DEPLOY` | user gọi deploy | Cho phép deploy |

Một token **không** thay thế token khác.

## Failure ownership

| Failure | Owner skill / action |
|---|---|
| Ambiguous requirements | grill-me / requirements |
| Design gap | design (+ ADR nếu cần) |
| Task incomplete / wrong scope | develop + review |
| Implementation bug (QA) | develop → review → qa |
| Spec defect (QA) | update Spec Package → có thể invalidate approval |
| Missing evidence | converge FAIL |
| Deploy không đủ approval | deploy BLOCKED |

## Re-approval rule

Thay đổi material trên package đã approved (requirements/design/tasks/acceptance/trace) → invalidate `APPROVED_SPEC_PACKAGE` → quay producer + spec-review → chờ approve lại trước develop tiếp.

## QA loop limit

`qa.attempts` tối đa **3**. Vượt giới hạn → `blocked` / stop cho user; **không** infinite loop.

## Stop conditions

- Chờ approval (spec / develop / user review / deploy).
- Blocker / reject / cancel.
- QA loop exhausted.
- Converge FAIL (thiếu evidence).
- Scope drift ngoài design/tasks → dừng, cập nhật package trước.

## Greenfield notes

Không `/plan`. Không legacy `docs/requirements` / `docs/designs` feature output. Không migration.
