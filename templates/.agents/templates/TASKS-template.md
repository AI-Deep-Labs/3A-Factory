# Tasks

> When filled: write the body in **Vietnamese**. Keep IDs and machine fields in English.  
> Authoritative: **Execution Truth**. Do not invent requirements or architecture decisions.  
> Contract: `templates/.agents/contracts/spec-package.md`  
> Task status enum: `draft` | `ready` | `in_progress` | `blocked` | `review` | `done` | `cancelled`  
> Every feature must have at least one task.

## Metadata

- REQ ID: REQ-000001
- Feature:
- Package: `docs/tasks/REQ-000001-<slug>/`
- Status: draft | ready | in_progress | done
- Last updated: YYYY-MM-DD

## Execution Rules

- Chỉ thực hiện current task (`manifest.execution.current_task`).
- Không bỏ qua dependency.
- Không mở rộng file scope khi chưa cập nhật task.
- Không tự thay đổi requirement hoặc design.
- Khi reference thiếu hoặc mâu thuẫn, chuyển task sang `blocked` và trả về producer skill.

## Dependency Graph

```text
TASK-001
└── TASK-002
    └── TASK-003
```

## Tasks

### TASK-001 — Title

- Status: draft
- Priority: must | should | could
- Owner:
- Risk: low | medium | high

#### Objective

#### Requirement References

- FR-001
- BR-001

#### Design References

- DES-API-001
- DES-FLOW-001

#### ADR References

- ADR-000001

#### Acceptance References

- AC-001
- UT-001

#### Dependencies

- None

#### Expected File Scope

- `path/to/file`

#### Implementation Notes

#### Verification

#### Definition of Done

## Execution Summary

| Task | Status | Dependencies | Requirements | Acceptance |
|---|---|---|---|---|
| TASK-001 | draft | None | FR-001 | AC-001 |
