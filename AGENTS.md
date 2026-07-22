# 3A-Factory Agent Operating Rules

## Mission

Run an automated software-delivery pipeline:

`triage → (grill-me if unclear) → analyze → ADR? → design → spec → (user APPROVED) → Planning? → develop → review → qa` → stop; deploy is separate.

Supported tools: **Claude Code**, **Gemini**, **Cursor**.

## Hard gates

1. Do not modify application source code from a raw requirement. Develop only after `analyze` + `design` + `spec` (and `plan` when risk is high).
2. **After every `spec`:** the agent must self-review the new spec against all prior collected artifacts (raw / discovery / analysis / design / ADR), then **stop** and ask the user to verify. Spec must include **Acceptance Criteria**, **System Test Conditions**, and **UAT Conditions**. If the user requests changes → update the spec **and** related prior docs as needed, then stop again. Continue to plan/develop **only** after the user confirms with `APPROVED` (all risk levels).
3. **High** risk → Planning is mandatory + wait for `APPROVED` before develop (in addition to the post-spec `APPROVED`).
4. During develop, change only files/scope listed in Planning (if present) or Design; if scope drifts → stop and update design/plan first.
5. Stop and report before changing shared public API/contracts, DB schema with real data, auth/authorization, or production deploy/infra config — unless risk was classified and the matching gate was cleared.
6. **After QA:** write unit tests + `…-UT.md`, run them, verify System Test + UAT from the approved spec, and auto-fix/re-test until all Pass; then **stop for user review**. Never claim Pass with Fail/untested criteria.
7. **Never auto-deploy.** Every deploy requires an explicit deploy command + `APPROVED`.



## Dual entry

- `project-manager`: take a requirement → run the pipeline; if unclear → switch to `grill-me` automatically.
- `grill-me`: deep clarification (one question at a time). When clear enough, or the user says “execute now” / equivalent → write `REQ-<NNNNNN>-<slug>-discovery.md` and continue the pipeline (do **not** ask “run the pipeline?”).



## Risk levels (analyze)

- **High**: shared public API/contract change; DB schema change with real data; auth/authorization change; production deploy/infra change; (multi-repo) ≥3 repos impacted or shared-library breaking change.
- **Medium**: change existing business logic not in the high set.
- **Low**: localized addition that does not touch contract/schema/auth/deploy.

Payment/order changes are **not** high-risk by default.

## Workflow directives

- `APPROVED`: required after **every** spec before continuing; required before develop when risk is high; required before **every** deploy; also used when waiting on other artifact approval.
- `REJECTED`: reject the draft; stop and ask whether to re-analyze from scratch (y/n).
- `RE-EXECUTE` (or `re-excute`): refine the **current** artifact in place; do not create a parallel file for the same phase. After a post-spec change request, also update related prior docs so they stay consistent, then self-review and wait for `APPROVED` again.



## Canonical artifacts (`docs/` inside the target project)



### REQ / ADR identifiers (required for new files)

- **REQ id**: `REQ-<NNNNNN>-<slug>` — **6-digit** zero-padded number + short kebab-case slug (e.g. `REQ-000013-login-throttle`).
- **ADR id**: `ADR-<NNNNNN>-<slug>` — **separate** number series from REQ, also 6-digit padded (e.g. `ADR-000005-outbox-pattern`).
- **One shared id** for all REQ artifacts and the git branch: `feature/REQ-<NNNNNN>-<slug>`.



### File naming (shared id prefix)


| Kind         | Example path                                               |
| ------------ | ---------------------------------------------------------- |
| Raw          | `docs/requirements/REQ-000013-login-throttle-raw.md`       |
| Discovery    | `docs/requirements/REQ-000013-login-throttle-discovery.md` |
| Spec         | `docs/requirements/REQ-000013-login-throttle-spec.md`      |
| Analysis     | `docs/designs/REQ-000013-login-throttle-analysis.md`       |
| Design       | `docs/designs/REQ-000013-login-throttle-design.md`         |
| Plan         | `docs/designs/REQ-000013-login-throttle-plan.md`           |
| ADR          | `docs/designs/ADR-000005-outbox-pattern.md`                |
| Review       | `docs/reviews/REQ-000013-login-throttle-review.md`         |
| QA           | `docs/qa/REQ-000013-login-throttle-qa.md`                  |
| Unit tests   | `docs/qa/REQ-000013-login-throttle-UT.md`                  |
| Run log      | `docs/qa/REQ-000013-login-throttle-run-YYYYMMDD-HHMM.md`   |
| Release      | `docs/release-notes/REQ-000013-login-throttle-release.md`  |
| Handoff      | `docs/misc/compact/HANDOFF-YYYYMMDD-HHMM.md`               |
| Filed issues | `docs/misc/issues/ISSUE-[short-name].md`                   |




### Number allocation (backward-compatible)

1. Scan all `REQ-*-*.md` / `REQ-*.md` under `docs/` (and `ADR-*` under `docs/designs/`).
2. Parse the numeric part after `REQ-` / `ADR-` (accept legacy unpadded / slug-less names, e.g. `REQ-013-raw.md`, `REQ-13.md`, `ADR-5.md`).
3. `next = max + 1`; format as **6 digits**. **Do not rename** existing files.
4. Choose the slug once at triage (or when creating an ADR); lowercase ASCII kebab-case; reuse verbatim for every file + branch of that id.

In skill text, `REQ-…` / `ADR-…` means `REQ-<NNNNNN>-<slug>` unless explicitly reading a legacy file.

## Phase meanings


| Phase    | Question                 | Output                                                                       |
| -------- | ------------------------ | ---------------------------------------------------------------------------- |
| Design   | How will we build it?    | Solution design                                                              |
| Spec     | What must be done?       | Specification (AC, System Test Conditions, UAT Conditions) |
| Planning | In what technical order? | Repo/module/file order, dependencies, milestones (**not** people assignment) |


Planning is **mandatory** when risk is high; optional for low/medium if Design already lists files/order.

## Review / QA loops

- Review “needs fixes” → auto-fix ≤ **2** rounds.
- **QA** → write unit tests (`…-UT.md` + test sources), run them, and verify **System Test Conditions** + **UAT Conditions** from the approved spec. **Auto-fix and re-test until all Pass** (no fixed round cap). Stop for **user review** when green (or when blocked). Do not mark Pass if any criterion is Fail/untested.



## Skill loading

Package source (templates only):


| Folder                       | Skills                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `templates/skills/workflow/` | `project-manager`, `triage`, `grill-me`, `analyze`, `adr`, `design`, `spec`, `plan`, `develop`, `review`, `qa`, `deploy` |
| `templates/skills/utility/`  | `onboarding`, `handoff`, `caveman`, `synthesize-design-doc`, `qa-issues`                                                 |


**Runtime paths (agent-native — installer writes only what you selected):**


| Agent       | Read skills from                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| Claude Code | `.claude/skills/<name>/SKILL.md` (+ `/commands`)                                                         |
| Gemini CLI  | `.gemini/skills/<name>/SKILL.md` (+ `.gemini/commands/*.toml`)                                           |
| Cursor      | `.cursor/skills/<name>/SKILL.md` (slash commands) + `.cursor/rules/ai-workflow.mdc` (always-on pipeline) |


Shared always: `AGENTS.md`, `WORKFLOW.md`, `docs/`, `.agents/templates/` (doc templates only — not skills).

## Language rules

- **Skill / rule / template instruction files** in this package: **English** (precise, unambiguous for agents).
- **Chat with the user**: prefer the user’s language when they write in that language.
- **Generated workspace artifacts** under `docs/` (REQ/ADR/QA/release/`project_overview.md`, etc.): **Vietnamese**. Keep technical terms in English when clearer.

