---
name: project-manager
description: "Spec Package state-machine orchestrator — routes triage→spec→APPROVED_SPEC_PACKAGE→task-by-task develop/review→qa→converge→APPROVED_USER_REVIEW. Never auto-deploy."
argument-hint: "[requirement text or REQ-<NNNNNN>-<slug> or package path]"
---

**MANDATORY PM MODE** — `/project-manager` binds Project Manager mode for this session.

1. Read `.agents/rules/agent-mode.md`, then `AGENTS.md`.
2. Read and **fully execute** `.agents/skills/project-manager/SKILL.md` (§ Slash invocation (mandatory)).
3. Follow Session orchestration: PM → child skill SKILL.md → PM; route only via manifest state; do not skip phases.
4. Do not implement, plan, or write artifacts outside canonical child skills and `docs/tasks/REQ-*`.

# Project Manager

## Purpose
State-machine orchestrator for Feature-local Spec Packages. Routes to the correct skill; does **not** write requirements, design, application code, or tests itself.

## Gate
Do not modify application source code except by invoking `develop` / related skills.  
Do not invent requirements or architecture.  
Do not auto-approve.  
Do not call `deploy`.  
Do not commit or push.  
Do not mark tasks `done` (only `review` may).

## Auto-intake entry

Invoked when the user describes a requirement in natural language (no `/project-manager` prefix) per `AGENTS.md` § Auto-intake.

1. Run **Onboarded detection** first.
2. If not onboarded → `ONBOARDING_REQUIRED`; read `.agents/skills/onboarding/SKILL.md` and stop.
3. Input = full user message (requirement text, REQ id, package path, approval response at active gate, or continue intent).
4. Apply **Package resolution** below, then **Session orchestration**.

Slash invocation (`/project-manager`) uses the same contract as auto-intake **plus** § **Slash invocation (mandatory)** below — binding PM mode for the session.

## Slash invocation (mandatory)

When the user invokes **`/project-manager`** (Cursor rule, Claude command, or Gemini command):

**Binding:** You are in **Project Manager mode** until a PM stop condition. Do **not** exit PM mode for generic answers, ad-hoc planning, or implementation outside routed child skills.

**Before any action:**
1. Read `.agents/rules/agent-mode.md`
2. Read `AGENTS.md` and `.agents/contracts/spec-package.md`
3. Read and **fully execute** this skill (not a summary)

**Mandatory behavior:**
- Run **Onboarded detection**; if not onboarded → `ONBOARDING_REQUIRED` and stop
- Follow **Session orchestration**: PM → read and execute `.agents/skills/<child>/SKILL.md` → re-read `manifest.yaml` → PM → …
- Route **only** via routing table + `manifest.yaml` status; **do not skip phases** (triage → … → qa → converge as state requires)
- Do **not** write requirements, design, application code, or tests directly (PM updates manifest execution fields only)
- Do **not** use built-in planning mode or create artifacts outside `docs/tasks/REQ-*`
- Do **not** auto-approve, auto-deploy, commit, or push
- Do **not** call `deploy` from PM; deploy is explicit `/deploy` only
- Do **not** mark tasks `done` (only `review` may)

**Arguments:** slash args / user message = requirement text, REQ id, package path, approval response at active gate, or continue intent.

If the user only typed `/project-manager` with no args, resolve package from context or list `docs/tasks/` and continue from manifest state — still follow the routing table.

## Onboarded detection

```text
onboarded = AGENTS.md exists
         AND .agents/contracts/spec-package.md exists
         AND docs/ is a directory
```

If any check fails → `ONBOARDING_REQUIRED` (do not triage or create packages).

## Session orchestration

PM decides the next step **by manifest state** (routing table below — no extra logic).

Loop until a stop condition:

```text
PM → read and execute child skill SKILL.md → PM → …
```

- After each child skill completes, return to PM and re-read `manifest.yaml` before the next route.
- Natural stops: approval wait, `grill-me` (one question per turn), `awaiting_user_review`, `blocked`, `PACKAGE_CONFLICT`, `ONBOARDING_REQUIRED`, user stop.
- Do **not** auto-deploy; do **not** auto-approve.

## Package resolution
1. Valid `docs/tasks/` package path → use.
2. Else REQ id → exactly one `docs/tasks/REQ-<NNNNNN>-*/`.
3. Multiple → `PACKAGE_CONFLICT`. None + new requirement text → start with `triage`.
4. Do not write new feature artifacts under legacy `docs/requirements|designs|reviews|qa`.

## Inputs
- `manifest.yaml`, `tasks.md`, `spec-review.md`
- `reviews/`, `qa/`
- User intent / arguments
- Spec Package contract

## Routing table

| Package state | Next action |
|---|---|
| `new` | `triage` |
| `triaged` | `grill-me` or `analyze` (unclear → grill-me) |
| `clarifying` | `grill-me` |
| `analyzed` | `spec` |
| `specifying` | `spec` or owning producer skill |
| `validating` | `spec-review` |
| `awaiting_approval` | ask spec package confirmation (§ Approval gates) or process user confirm |
| `approved` | select ready task → `develop` (after develop gate if high-risk) |
| `implementing` | continue current task or next ready → `develop` |
| `reviewing` | `review` |
| `qa` | `qa` |
| `converging` | `converge` |
| `awaiting_user_review` | ask user review confirmation or process user confirm |
| `done` | stop; remind deploy needs confirmation via `deploy` skill — never auto-deploy |
| `blocked` | route by blocker owner |
| `rejected` / `superseded` / `cancelled` | stop |

## Task selection
1. If `execution.current_task` exists and task status is `in_progress` → continue that task via `develop`.
2. If current task status is `review` → route `review`.
3. If current task is `blocked` and blocks the chain → do not pick unrelated tasks; route blocker owner.
4. Else pick one task with status `ready`, all dependencies `done`, highest priority, then lowest TASK id.
5. Phase 3: **no parallel tasks**. Do not skip. Do not mark `done`.

## Execution eligibility (before develop)
Require: `validation.status == passed`, `approval.spec_package.status == approved`, `status ∈ {approved, implementing}`, task ready/in_progress, deps done, references valid.  
High-risk + policy: `approval.develop.status == approved` else stop and run **Develop approval** (§ Approval gates) before handoff to `develop`.

Failure tokens: `EXECUTION_BLOCKED`, `APPROVAL_REQUIRED`, `TASK_NOT_READY`, `TASK_DEPENDENCY_BLOCKED`, `TASK_REFERENCE_INVALID`, `PACKAGE_INVALID`.

## Manifest updates (allowed)
```text
manifest.status
execution.current_task
execution.last_activity_at
execution.last_activity_by
```
May set `status: implementing` when starting a task handoff to develop.  
Must **not** set task status to `done`.

## Blocker routing
```text
BUSINESS_AMBIGUITY      → grill-me
ANALYSIS_GAP            → analyze
REQUIREMENT_DEFECT      → requirements
ADR_REQUIRED            → adr
DESIGN_DEFECT           → design
TASK_DEFECT             → tasks
ACCEPTANCE_DEFECT       → acceptance
SPEC_INCONSISTENCY      → spec-review
IMPLEMENTATION_DEFECT   → develop
REVIEW_BLOCKER          → develop
QA_IMPLEMENTATION_BUG   → develop
QA_SPEC_DEFECT          → spec
CONVERGENCE_FAILURE     → skill owner per mismatch
```

## Approval gates (natural language)

Contract § **5.4.1** · prompts: `.agents/templates/APPROVAL-CONFIRMATION-template.md`.

Map user replies to the **active gate only**. Accept natural language (yes/no, có/không, đồng ý/từ chối) or exact `APPROVED_*` tokens. Ambiguous → one yes/no follow-up. Reject → do not set `approved`. Never auto-approve.

### Spec package (`APPROVED_SPEC_PACKAGE`)

**When:** `status == awaiting_approval`, spec-review PASSED, no blockers.

**If user has not confirmed:** ask confirmation question from template; stop.

**If user confirms** (natural language or token):
- Require gates above; then set `approval.spec_package` + `status: approved` (same as `spec` skill).
- Else `APPROVAL_REJECTED`.

### Develop (`APPROVED_DEVELOP`)

**When:** high-risk policy requires develop approval; `approval.develop.status != approved` before first develop handoff.

**If user has not confirmed:** ask confirmation question from template; stop.

**If user confirms:**
```yaml
approval:
  develop:
    status: approved
    approved_by: user
    approved_at: <ISO-8601>
```
Then handoff to `develop`. On reject → `APPROVAL_REJECTED`; stay blocked from develop.

### User review (`APPROVED_USER_REVIEW`)

**When:** `status == awaiting_user_review`, `qa.converge == passed`.

**If user has not confirmed:** ask confirmation question from template; stop.

**If user confirms** (natural language or token):
```yaml
status: done
approval:
  user_review:
    status: approved
    approved_by: user
    approved_at: <ISO-8601>
```
Else `USER_REVIEW_APPROVAL_REJECTED`. Do **not** treat as deploy approval. Do not deploy.

### Deploy

PM does **not** deploy. When `status == done`, remind user deploy requires explicit `/deploy` + confirmation via `deploy` skill.

## Progress reporting
One short line after each routed step.

## Stop conditions
- Need user confirmation at active approval gate (spec package, develop, user review)
- Package `blocked` / rejected / cancelled / superseded
- `awaiting_user_review`
- No ready task while still implementing
- Manifest conflict / `PACKAGE_CONFLICT`
- `ONBOARDING_REQUIRED`
- User says stop

## Output contract
Progress line + next skill invoked + package/task status summary. No direct requirement/design/code/test authoring.

## Stop condition
Stop on approval wait, blocked package, awaiting_user_review, no ready task, conflicts, or user stop.
