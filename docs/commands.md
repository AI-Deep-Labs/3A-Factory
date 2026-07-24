# Command Reference

Chỉ document command tồn tại trong runtime (skills/workflow). Version **3.0.0-rc.4**. Không có `/plan`.

---

## `/triage`

| Field | Content |
|---|---|
| Purpose | Phân loại yêu cầu thô; tạo Spec Package skeleton |
| When to use | Request mới |
| Inputs | Mô tả user |
| Outputs | Package id, slug, risk hint |
| Artifacts changed | `docs/tasks/REQ-…/manifest.yaml`, `raw.md` |
| Manifest transitions | → `triaged` |
| Approval required | No |
| Failure states | Id conflict / invalid slug |
| Stop condition | Package created; báo bước tiếp |
| Example | `/triage Thêm sync master data nightly` |

---

## `/grill-me`

| Field | Content |
|---|---|
| Purpose | Làm rõ ambiguity (một câu hỏi / lượt) |
| When to use | Sau triage khi chưa đủ rõ |
| Inputs | Package đang clarifying |
| Outputs | Câu trả lời ghi vào discovery |
| Artifacts changed | `discovery.md`, manifest |
| Manifest transitions | `clarifying` (và related) |
| Approval required | No |
| Failure states | Không có package |
| Stop condition | Enough clarity hoặc user “execute now” → tiếp pipeline |
| Example | `/grill-me` |

---

## `/analyze`

| Field | Content |
|---|---|
| Purpose | Impact / risk analysis |
| When to use | Sau triage hoặc discovery |
| Inputs | raw (+ discovery) |
| Outputs | Risk level, scope |
| Artifacts changed | `analysis.md` |
| Manifest transitions | → `analyzed` |
| Approval required | No |
| Failure states | Missing inputs |
| Stop condition | Analysis written |
| Example | `/analyze` |

---

## `/requirements`

| Field | Content |
|---|---|
| Purpose | Business Truth — FR/BR/NFR |
| When to use | Sau analyze |
| Inputs | analysis (+ discovery) |
| Outputs | Requirements IDs |
| Artifacts changed | `requirements.md` |
| Manifest transitions | `specifying` |
| Approval required | No |
| Failure states | Incomplete IDs |
| Stop condition | Requirements draft ready |
| Example | `/requirements` |

---

## `/adr`

| Field | Content |
|---|---|
| Purpose | Architectural Decision Record khi cần |
| When to use | Quyết định kiến trúc lớn |
| Inputs | Context + options |
| Outputs | ADR hoặc `ADR_NOT_REQUIRED` |
| Artifacts changed | `decisions/ADR-…` hoặc note trong design/analysis |
| Manifest transitions | (specifying) |
| Approval required | No (ADR status riêng) |
| Failure states | Missing decision criteria |
| Stop condition | ADR written hoặc explicitly not required |
| Example | `/adr` |

---

## `/design`

| Field | Content |
|---|---|
| Purpose | Technical Truth — DES-* |
| When to use | Sau requirements (+ ADR nếu cần) |
| Inputs | requirements, analysis |
| Outputs | Design IDs, file/module scope |
| Artifacts changed | `design.md` |
| Manifest transitions | `specifying` |
| Approval required | No |
| Failure states | Trace gaps |
| Stop condition | Design draft ready |
| Example | `/design` |

---

## `/tasks`

| Field | Content |
|---|---|
| Purpose | Execution Truth — TASK-* + dependencies |
| When to use | Sau design |
| Inputs | design, requirements |
| Outputs | Ordered tasks |
| Artifacts changed | `tasks.md`, manifest execution fields |
| Manifest transitions | `specifying` |
| Approval required | No |
| Failure states | Circular dependency |
| Stop condition | Tasks draft ready |
| Example | `/tasks` |

---

## `/acceptance`

| Field | Content |
|---|---|
| Purpose | Verification Truth — AC/UT/ST/UAT |
| When to use | Sau tasks (hoặc song song cuối specifying) |
| Inputs | requirements, design, tasks |
| Outputs | Acceptance criteria + test conditions |
| Artifacts changed | `acceptance.md` |
| Manifest transitions | `specifying` |
| Approval required | No |
| Failure states | Missing AC links |
| Stop condition | Acceptance draft ready |
| Example | `/acceptance` |

---

## `/spec-review`

| Field | Content |
|---|---|
| Purpose | Self-review package vs prior artifacts |
| When to use | Khi package đủ artifacts producer |
| Inputs | Full package |
| Outputs | PASSED / blockers |
| Artifacts changed | `spec-review.md` |
| Manifest transitions | `validating` → `awaiting_approval` (nếu pass) |
| Approval required | No (chuẩn bị cho user approval) |
| Failure states | Blockers → không chuyển awaiting_approval |
| Stop condition | Stop for user `APPROVED_SPEC_PACKAGE` |
| Example | `/spec-review` |

---

## `/spec`

| Field | Content |
|---|---|
| Purpose | Orchestrator producer (requirements…spec-review) |
| When to use | Sau analyze khi muốn chạy chuỗi Spec Package |
| Inputs | analyzed package |
| Outputs | Complete Spec Package + review |
| Artifacts changed | Producer artifacts |
| Manifest transitions | specifying → validating → awaiting_approval |
| Approval required | Dừng chờ `APPROVED_SPEC_PACKAGE` |
| Failure states | Validation fail |
| Stop condition | Awaiting user approval |
| Example | `/spec` |

---

## `/project-manager`

| Field | Content |
|---|---|
| Purpose | Điều phối execution: chọn task, gọi develop/review/qa/converge |
| When to use | Sau `APPROVED_SPEC_PACKAGE` |
| Inputs | Approved package |
| Outputs | Next action |
| Artifacts changed | Manifest execution pointers |
| Manifest transitions | theo phase execution |
| Approval required | Spec package approved; develop approval nếu policy |
| Failure states | Not approved / blocked |
| Stop condition | Theo gate hiện tại |
| Example | `/project-manager` |

---

## `/develop`

| Field | Content |
|---|---|
| Purpose | Implement đúng **một** current task |
| When to use | Task ready, package approved |
| Inputs | tasks.md, design, current task id |
| Outputs | Code + implementation evidence |
| Artifacts changed | App source (scope), `reviews/` evidence, manifest |
| Manifest transitions | `implementing` → sẵn sàng review |
| Approval required | `APPROVED_SPEC_PACKAGE` (+ `APPROVED_DEVELOP` nếu high risk) |
| Failure states | Not approved / dependency blocked / wrong task |
| Stop condition | Task implement xong → gọi review |
| Example | `/develop` |

---

## `/review`

| Field | Content |
|---|---|
| Purpose | Code review task; **chỉ review** đánh dấu task `done` |
| When to use | Sau develop một task |
| Inputs | Diff vs design/tasks |
| Outputs | PASS/FAIL + evidence |
| Artifacts changed | review evidence, `tasks.md` status, manifest |
| Manifest transitions | `reviewing` → next implement / qa |
| Approval required | No (user token không thay review) |
| Failure states | FAIL → quay develop cùng task |
| Stop condition | PASS hoặc FAIL đã ghi |
| Example | `/review` |

---

## `/qa`

| Field | Content |
|---|---|
| Purpose | Acceptance-driven verification |
| When to use | Mọi task done |
| Inputs | acceptance.md + evidence |
| Outputs | QA summary Pass/Fail |
| Artifacts changed | `qa/`, manifest qa fields |
| Manifest transitions | `qa` → converging hoặc repair |
| Approval required | No |
| Failure states | Fail → repair (max 3); spec defect → invalidate |
| Stop condition | Pass hoặc loop exhausted |
| Example | `/qa` |

---

## `/converge`

| Field | Content |
|---|---|
| Purpose | Kiểm evidence đầy đủ trước user review |
| When to use | QA PASS |
| Inputs | Package + reviews/qa |
| Outputs | Converge report |
| Artifacts changed | converge report, status |
| Manifest transitions | `converging` → `awaiting_user_review` |
| Approval required | No (chuẩn bị `APPROVED_USER_REVIEW`) |
| Failure states | Missing evidence → FAIL, không auto-done |
| Stop condition | Stop for user review |
| Example | `/converge` |

---

## `/deploy`

| Field | Content |
|---|---|
| Purpose | Deploy có kiểm soát |
| When to use | User chủ động; thường sau `done` |
| Inputs | Release context |
| Outputs | Deploy result |
| Artifacts changed | release notes / deploy records theo skill |
| Manifest transitions | (deploy fields) |
| Approval required | **`APPROVED_DEPLOY` luôn** |
| Failure states | Missing approval → BLOCKED |
| Stop condition | Chờ approval hoặc sau deploy |
| Example | `/deploy` + user `APPROVED_DEPLOY` |

---

## Không hỗ trợ

```text
/plan
/migrate-spec-package
/resolve-spec-package
```
