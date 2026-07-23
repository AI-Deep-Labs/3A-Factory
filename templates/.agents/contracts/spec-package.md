# Spec Package Contract

> Instruction / machine-readable identifiers: **English**.  
> Generated artifact bodies under `.specs/` (when filled): **Vietnamese**.  
> Canonical decision: `ADR-000001-adopt-feature-local-spec-package`.

This file is the **single source of truth** for the Feature-local Spec Package contract (Phase 1+).  
Producer / validation skills (`triage`…`spec-review`, `spec` orchestrator) are available from Phase 2.  
Execution skills (`project-manager`, `develop`, `review`, `qa`, `converge`, `deploy` integration) migrate in later phases — see Transitional notice in governance docs.

---

## 5.1 Definition — Spec Package

**Spec Package** is a linked, traceable set of artifacts that describes the full lifecycle of one feature: from raw request, analysis, requirements, architectural decisions, technical design, execution tasks, acceptance, review, QA, through release evidence.

### Canonical layout

```text
.specs/
└── REQ-000013-sync-masterdata/
    ├── manifest.yaml
    ├── raw.md
    ├── discovery.md
    ├── analysis.md
    ├── requirements.md
    ├── design.md
    ├── tasks.md
    ├── acceptance.md
    ├── spec-review.md
    ├── decisions/
    │   └── ADR-000005-example.md
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

### Rules

- One feature ↔ one package.
- Folder format: `REQ-<6 digits>-<kebab-case-slug>` (example: `REQ-000013-sync-masterdata`).
- New feature artifacts **must** live inside the package.
- Global project documentation may remain outside `.specs/` (for example `docs/project_overview.md`).
- Feature-specific ADR lives under `decisions/`.
- Project-wide ADR lives at `docs/decisions/ADR-*.md` (create `docs/decisions/` only when writing the first such file; installer must not pre-create it).
- Do not create the same feature in multiple packages.
- Greenfield: do not write new feature artifacts under `docs/requirements|designs|reviews|qa`.

---

## 5.2 Artifact ownership

| Artifact | Authoritative responsibility |
|---|---|
| `raw.md` | Original unnormalized request |
| `discovery.md` | Q&A, clarification, assumptions, and edge cases |
| `analysis.md` | Current state, impact, dependency, and risk |
| `requirements.md` | Business Truth — WHAT and WHY |
| `decisions/*.md` | Decision Truth — options, trade-offs, and rationale |
| `design.md` | Technical Truth — HOW |
| `tasks.md` | Execution Truth — actionable work |
| `acceptance.md` | Verification Truth and Definition of Done |
| `manifest.yaml` | Package State Truth |
| `reviews/*` | Review evidence |
| `qa/*` | Test evidence |
| `release/*` | Release evidence |

### Mandatory rules

- Each kind of information has **exactly one** authoritative artifact.
- Other artifacts only **reference by ID**.
- Do not copy a full business rule into multiple files.
- `design.md` must not invent new business requirements.
- `tasks.md` must not invent new architecture decisions.
- `acceptance.md` must not expand scope.
- Develop must not change requirements or design on its own.
- When information is missing, return control to the correct **producer** artifact / skill.

---

## 5.3 Traceability contract

### ID convention

```text
FR-001
BR-001
NFR-001

DES-ARCH-001
DES-API-001
DES-DATA-001
DES-FLOW-001
DES-SEC-001
DES-OBS-001
DES-MIG-001

TASK-001

AC-001
UT-001
ST-001
UAT-001
PERF-001
SEC-001
```

### Traceability flow

```text
Requirement
→ ADR or Design
→ Task
→ Acceptance
→ Test Evidence
→ Review Evidence
```

### Rules

- Requirements that need coding must have Design coverage.
- Design items must reference Requirements.
- Tasks must reference Requirements, Design, and Acceptance.
- Acceptance items must reference Requirements.
- QA evidence must reference Acceptance / Test IDs.
- Review evidence must reference Tasks and Requirements.
- No orphan IDs.
- No references to non-existent IDs.

---

## 5.4 Approval contract

### Approval types

```text
APPROVED_SPEC_PACKAGE
APPROVED_DEVELOP
APPROVED_USER_REVIEW
APPROVED_DEPLOY
```

### Rules

- `APPROVED_SPEC_PACKAGE` is mandatory before Develop.
- `APPROVED_DEVELOP` may be mandatory for high-risk features.
- `APPROVED_USER_REVIEW` is mandatory to move from `awaiting_user_review` → `done` (after converge PASSED).
- `APPROVED_DEPLOY` is always mandatory before deploy.
- Approvals must be recorded in `manifest.yaml` under `approval.spec_package|develop|user_review|deploy`.
- Each approval record must include: `status`, `approved_by`, `approved_at`.
- Material changes to Requirements, ADR, Design, Tasks, or Acceptance must **invalidate** prior approvals (at least `spec_package`; re-run validation).
- Do not use one approval keyword for multiple gates.
- Legacy keyword `APPROVED` may be accepted only during a compatibility period; internal state must map to a concrete approval type.

---

## 5.5 Package readiness (implementation-ready)

A package is implementation-ready only when **all** of the following hold:

- No critical open questions remain.
- Requirements are complete and free of blocking ambiguity.
- Required ADRs are Accepted.
- Requirements that need implementation have Design coverage.
- Tasks have complete dependencies and references.
- Acceptance coverage is complete.
- Manifest is valid against the schema.
- Spec review result is `PASSED`.
- No blockers remain.
- User has issued `APPROVED_SPEC_PACKAGE`.
- High-risk features also have `APPROVED_DEVELOP` when policy requires it.

---

## 5.6 State machine

### Canonical states

```text
new
triaged
clarifying
analyzed
specifying
validating
awaiting_approval
approved
implementing
reviewing
qa
converging
awaiting_user_review
done
blocked
rejected
superseded
cancelled
```

### Happy-path transitions

```text
new
→ triaged
→ clarifying or analyzed
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

### Exceptional transitions

- Any valid phase may transition to `blocked`.
- User rejects the package → `rejected`.
- Feature replaced → `superseded`.
- Feature cancelled → `cancelled`.
- Requirement change after approval → return to `specifying`.
- Validation failure → return to `specifying`.
- QA finds implementation defect → return to `implementing`.
- QA finds requirement/design defect → return to `specifying`.

Develop is allowed only in `approved` or a valid post-approval execution state (`implementing`, and related execution flow states after an approved package).

---

## 5.7 Execution contract (Phase 3)

Execution read order:

```text
manifest.yaml
→ tasks.md
→ current task
→ referenced requirements
→ referenced design
→ referenced ADR
→ referenced acceptance
→ source code changes
→ tests
→ review evidence
→ QA evidence
→ converge
```

A task may execute only when:

```text
package.status ∈ {approved, implementing}
validation.status == passed
approval.spec_package.status == approved
task.status ∈ {ready, in_progress}
all dependencies == done
task references valid
```

High-risk: if policy requires develop approval → `approval.develop.status == approved`.

Task lifecycle:

```text
ready → in_progress → review → done
```

Exceptions: `blocked`, `cancelled`.  
Only the **review** skill may move a task from `review` → `done`.

### QA auto-loop

- Default max QA auto-fix attempts: **3** (`qa.attempts`).
- Implementation defect → `QA_IMPLEMENTATION_BUG` → develop → review → qa.
- Spec defect → `QA_SPEC_DEFECT` → producer skill → spec-review → invalidate `approval.spec_package` → user re-approval.
- Exceeding max → `QA_LOOP_LIMIT_REACHED` → `status: blocked`.

### Evidence paths (new packages)

```text
.specs/<PACKAGE>/reviews/TASK-<NNN>-implementation.md
.specs/<PACKAGE>/reviews/TASK-<NNN>-code-review.md
.specs/<PACKAGE>/qa/unit-test-report.md
.specs/<PACKAGE>/qa/system-test-report.md
.specs/<PACKAGE>/qa/uat-report.md
.specs/<PACKAGE>/qa/performance-report.md
.specs/<PACKAGE>/qa/security-report.md
.specs/<PACKAGE>/qa/qa-summary.md
.specs/<PACKAGE>/qa/converge-report.md
```

Do not write new feature review/QA evidence under legacy `docs/reviews` or `docs/qa`.

---

## 5.8 Failure ownership matrix

| Failure | Owner |
|---|---|
| `BUSINESS_AMBIGUITY` | grill-me |
| `ANALYSIS_GAP` | analyze |
| `REQUIREMENT_DEFECT` | requirements |
| `ADR_REQUIRED` | adr |
| `DESIGN_DEFECT` | design |
| `TASK_DEFECT` | tasks |
| `ACCEPTANCE_DEFECT` | acceptance |
| `SPEC_INCONSISTENCY` | spec-review |
| `TASK_SCOPE_CHANGE_REQUIRED` | tasks/design |
| `IMPLEMENTATION_FAILED` | develop |
| `REVIEW_BLOCKER` | develop |
| `QA_IMPLEMENTATION_BUG` | develop |
| `QA_SPEC_DEFECT` | spec producer |
| `QA_LOOP_LIMIT_REACHED` | user/project-manager |
| `CONVERGENCE_FAILURE` | owner per mismatch |
| `DEPLOY_APPROVAL_REQUIRED` | user |

---

## Related artifacts (Phase 1–3)

| Kind | Path |
|---|---|
| Manifest JSON Schema | `templates/.agents/schemas/spec-package-manifest.schema.json` |
| Manifest template | `templates/.agents/templates/SPEC-PACKAGE-MANIFEST-template.yaml` |
| Requirements template | `templates/.agents/templates/REQUIREMENTS-template.md` |
| Tasks template | `templates/.agents/templates/TASKS-template.md` |
| Acceptance template | `templates/.agents/templates/ACCEPTANCE-template.md` |
| Spec-review template | `templates/.agents/templates/SPEC-REVIEW-template.md` |
| Implementation evidence | `templates/.agents/templates/IMPLEMENTATION-EVIDENCE-template.md` |
| Code review evidence | `templates/.agents/templates/CODE-REVIEW-template.md` |
| QA summary | `templates/.agents/templates/QA-SUMMARY-template.md` |
| Converge report | `templates/.agents/templates/CONVERGE-REPORT-template.md` |
| Package template README | `templates/.agents/templates/SPEC-PACKAGE-README.md` |
