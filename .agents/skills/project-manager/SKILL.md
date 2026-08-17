---
name: project-manager
description: "AUTO-ACTIVATE in an onboarded repo (AGENTS.md + .agents/contracts/spec-package.md + docs/) when the user describes a new engineering lifecycle request in natural language instead of a slash command: feature, bug, change, enhancement; continues an existing REQ / docs/tasks/ path; or replies to an active approval gate (yes/no, có/không, APPROVED_*). Trigger examples: pasted customer email; 'khách muốn…'; 'cần thêm tính năng…'; 'có bug…'; 'sếp yêu cầu đổi…'; 'tiếp tục REQ-000012…'; 'làm tiếp package docs/tasks/REQ-…'. DO NOT activate when: pure Q&A; explain existing code; tooling/meta questions; user asks to bypass the workflow; OR user already invoked a step slash (/triage /grill-me /analyze /requirements /adr /design /tasks /acceptance /spec-review /spec /develop /review /qa /converge /deploy /qa-issues /onboarding /handoff /caveman /specification-synthesizer …) — those run exactly one step without project-manager. /project-manager alone still binds mandatory PM mode for the session. Routes triage→spec→APPROVED_SPEC_PACKAGE→task-by-task develop/review→qa→converge→APPROVED_USER_REVIEW. NEVER auto-deploy; deploy is explicit /deploy only."
argument-hint: "[requirement text or REQ-<NNNNNN>-<slug> or package path]"
---

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

Natural-language entry (no `/project-manager` prefix). Same routing/gates as slash once entered; does **not** bind mandatory session mode unless the user used `/project-manager`. Details also in `AGENTS.md` § Auto-intake.

### Intent gate (run BEFORE Onboarded detection / Package resolution)

Classify the user message:

| Intent | Action |
|---|---|
| `lifecycle` — feature / bug / change / enhancement to build or change the product | Continue → onboarded → PM |
| `continue_req` — REQ id, `docs/tasks/…`, “tiếp tục REQ…” | Continue → PM |
| `approval_reply` — confirm/reject at an **active** gate | Continue → PM (active gate only) |
| `step_slash` — message is / primarily a workflow slash other than `/project-manager` | **Stop.** Do not run PM. Let that command/skill own the turn. |
| `qa_explain` — pure Q&A, code explanation, ad-hoc review unrelated to a REQ | **Stop.** Answer normally. Do **not** force Spec Package. |
| `meta_tooling` — how 3a-factory / skills work, unless the user asks to run the pipeline | **Stop.** Answer normally. |
| `bypass` — user asks to skip the workflow | **Stop.** Honor; do not open/create a package. |
| `ambiguous` — could be lifecycle or Q&A | Ask **one** yes/no: open Spec Package workflow, or answer only? Do not triage until they choose workflow. |

Only `lifecycle` | `continue_req` | `approval_reply` (after confirm if ambiguous) proceed.

### Then

1. Run **Onboarded detection**.
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

**Sub-Agent Orchestration Loop (v4 Enterprise):**
Instead of executing tasks yourself, PM delegates to specific Sub-agents mapped in `.agents/configs/subagents.json`.

```text
PM → Read manifest → Determine next phase (e.g. 'develop') → Read subagents.json
   → Check IDE capability:
      - If `invoke_subagent` tool exists (Gemini/Claude): PM calls tool, passing the mapped `.agents/agents/persona.md` as System Prompt and `.agents/skills/.../SKILL.md` as Task Prompt.
      - If Cursor IDE: PM role-plays by loading the Persona + Skill into context and uses Composer/Agent mode to execute.
   → Wait for Sub-agent to return a pass/fail report → PM updates `manifest.yaml` → Loop ...
```

**CRITICAL ANTI-BYPASS RULES FOR PM:**
- **STRICTLY FORBIDDEN:** You MUST NOT execute the logic of child skills (e.g., `develop`, `review`, `qa`) yourself. Even if you have the ability or tools to do so, you MUST delegate.
- **ZERO BIAS ENFORCEMENT:** You are a Supervisor. You read state, you spawn Sub-agents, you wait for reports, and you update the state. You DO NOT write application code or perform code reviews yourself.

- **PM is the sole mutator:** Sub-agents only return reports. PM is the ONLY agent allowed to modify `manifest.yaml` statuses.
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

## Branch Guard (pre-develop) — mandatory

**Trigger:** Before spawning the `developer` sub-agent for **the first time** in a REQ session.

**Check condition:** `manifest.git.branch_guard_status != done`

If condition is true:
1. Spawn `release_manager` sub-agent (persona: `.agents/agents/release-manager.md`, skill: `.agents/skills/branch-guard/SKILL.md`) with task: **Phase A — pre-develop branch check** for this package.
2. Wait for report:
   - `BRANCH_READY` or `BRANCH_OK` → write manifest (PM writes):
     ```yaml
     git:
       working_branch: <branch name from report, or current branch if BRANCH_OK>
       branch_guard_status: done
     ```
     Then proceed to spawn `developer` sub-agent.
   - `BRANCH_DIRTY` → write manifest:
     ```yaml
     git:
       branch_guard_status: awaiting_user_action
     ```
     **Stop.** Ask user (one message):
     > "Working tree có thay đổi chưa commit. Vui lòng stash, commit hoặc discard trước khi tiếp tục. Xác nhận khi xử lý xong."
     When user confirms → re-spawn `release_manager` branch-guard Phase A. Do not proceed past a dirty tree.
   - `BRANCH_TYPE_AMBIGUOUS` → relay the type-selection question to user; collect answer; re-invoke branch-guard with answer.
3. If `branch_guard_status == awaiting_user_action` at session resume → immediately re-spawn branch-guard Phase A; do not skip.

**If condition is false** (`branch_guard_status == done`): skip this block entirely; go directly to `developer`.

## Manifest updates (allowed)
```text
manifest.status
execution.current_task
execution.last_activity_at
execution.last_activity_by
tasks.<TASK_ID>.status
git.working_branch
git.branch_guard_status
git.commits.<TASK_ID>
```
May set `status: implementing` when starting a task handoff to develop.  
**PM is now the ONLY agent allowed to set task status to `done`** (based on a PASS report from the `Reviewer` sub-agent).

## Commit Gate (post-review) — mandatory

**Trigger:** Immediately after `reviewer` sub-agent returns a **PASSED** report for `TASK-NNN`, before picking the next task or changing task status to `done`.

1. Spawn `release_manager` sub-agent (persona: `.agents/agents/release-manager.md`, skill: `.agents/skills/release-manager/SKILL.md`) with task: **commit TASK-NNN** for this package.
2. Wait for report:
   - `COMMIT_DONE` → write manifest:
     ```yaml
     git:
       commits:
         TASK-NNN: <short commit hash>
     ```
     Then set `task.status: done` and continue to next task.
   - `COMMIT_NOTHING_STAGED` → ask user one question:
     > "Không có file nào được stage cho TASK-NNN. Đây có phải task không thay đổi code không? (có / không)"
     - User xác nhận không có code → set `task.status: done`, note in manifest, continue.
     - User nói có code → re-spawn `release_manager` commit.
   - `COMMIT_BLOCKED` → log error; route to `branch-guard` Phase A first; then retry commit.

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
- `BRANCH_DIRTY` reported by branch-guard — waiting for user to resolve working tree
- User says stop

## Output contract
Progress line + next skill invoked + package/task status summary. No direct requirement/design/code/test authoring.

## Stop condition
Stop on approval wait, blocked package, awaiting_user_review, no ready task, conflicts, or user stop.
