---
name: onboarding
description: Onboard ONE repo into 3A-Factory — create docs/, agent context (CLAUDE/GEMINI/AGENTS), explore codebase, write docs/project_overview.md. Create nothing outside the current repo.
disable-model-invocation: true
argument-hint: "[optional hints about stack/repo role]"
---

# Onboarding (repo → 3A-Factory)

## Goal

1. Bring **one repo** onto the full 3A-Factory workflow.
2. Provide enough **project context** for later agent work (`project-manager` / `grill-me` / …).
3. Create `docs/` **inside the current repo**.
4. Create / extend / update `CLAUDE.md` and/or `GEMINI.md` and other agent-readable files **in the same repo** (do not wipe user-authored content — only add missing sections).

## Hard scope

- Operate only in the **current repo** (cwd / user-specified repo).
- **Do not** create repos, folders, or files **outside** that repo.
- **Do not** replace `project-manager` — finish onboarding before running a REQ pipeline.



## When to use

- Repo is new to 3A-Factory / missing Spec Package tooling (`.agents/contracts`, governance) or `docs/`.
- User runs `/onboarding`, or asks to apply the workflow / onboard the project.
- `triage` / `project-manager` detects missing onboarding → recommend this skill first.

---



## Phase A — Gather context (≤1–2 batched questions + read code)

Batch questions (not one-at-a-time grilling), while scanning the repo:


| Topic                                                   | Preferred source                           |
| ------------------------------------------------------- | ------------------------------------------ |
| Repo role (what it does, who it serves)                 | User + README                              |
| Stack (language, framework, ORM…)                       | Marker files + user                        |
| Internal repo / shared-lib deps (if any)                | User declaration — **do not invent**       |
| Build / test / run commands                             | package.json, *.csproj, Makefile, … + user |
| Deploy per env (dev/staging/production), who may run it | User + CI/CD if present                    |
| Primary agent tools for this repo                       | Claude / Gemini / Cursor (can be several)  |


**Codebase survey:** read entry points, folder layout, main flows — **state only facts** backed by files; if unsure → `needs confirmation`.

---



## Phase B — Scaffold workflow in-repo

1. Create if missing:
  ```text
   docs/
  ```
   Do **not** pre-create `docs/decisions/` or `docs/misc/` — those appear when skills write files (`/adr` project-wide, `/handoff`, `/qa-issues`).
   Do **not** create legacy feature lifecycle folders (`docs/requirements|designs|reviews|qa`). Feature work uses `docs/tasks/` via triage — installer must not pre-create `docs/tasks/`.
2. Agent tooling (if not present after package install):
  - Prompt / run 3a-factory install **into this repo** (`npx 3a-factory` or equivalent) for skills/commands/rules — **do not** clone extra repos.
  - Ensure agent-native folders exist via installer: `.claude/skills|commands`, `.gemini/commands` → `.agents/skills`, `.cursor/rules/*.mdc` + `ai-workflow.mdc` — plus shared `AGENTS.md` / `.agents/{templates,contracts,schemas,skills}` / `docs/`. Do not expect `.cursor/skills` or `.gemini/skills` mirrors.
3. Do not create `docs/` or workflow files in parent/sibling directories.

---



## Phase C — Agent context files

Update **at the root of the repo being onboarded**:

### `CLAUDE.md` (Claude or multi-tool)

- Create or **append** missing sections; do not delete user-written content.
- Fill: repo role, stack, internal deps, build/test/run, deploy notes, optional safety thresholds, pointer to `AGENTS.md` + 3A-Factory pipeline.
- Replace `[DETECTED_*]` placeholders with confirmed values / labeled inferences.



### `GEMINI.md` (if Gemini is used)

- Same idea as `CLAUDE.md` — enough for Gemini CLI to know stack, commands, deploy.



### `AGENTS.md` / `WORKFLOW.md`

- If installer copied them: **fill** project context; do not break 3a-factory hard gates / lifecycle.
- If missing: install the package first (Phase B), then fill.



### Cursor

- Ensure `.cursor/rules/ai-workflow.mdc` (and skill rules) exist after install; do not invent rules that contradict `AGENTS.md`.

Instruction/skill language stays English. **Content written into** `docs/` **(including overview) must be Vietnamese.**

---



## Phase D — Knowledge base `docs/project_overview.md`

Create/update `docs/project_overview.md` for future agents.

**Rules:** evidence only; gaps → `Status: needs confirmation` / `Confidence: low|medium|high`.

**Minimum structure (keep short for small repos):**

1. Executive Summary
2. Repository Map
3. Architecture Overview
4. Technology Stack
5. Project Structure
6. Main domains / features (if evidenced)
7. Services / Modules
8. Configuration & Common Commands (build/test/run/deploy)
9. Testing Overview
10. Risks and Unknowns
11. Recommendations for Future Agents
12. Evidence Index (files read)

Larger repos: add communication, data, API, security when evidenced.

**File language: Vietnamese.**

---



## Phase E — User-facing summary (chat)

Keep it short:

1. **1-line**: what this repo is
2. **5-minute**: tasks / inputs / outputs / key files
3. **Scaffolded**: `docs/` paths + agent files created/updated
4. **Next**: `/project-manager "<requirement>"` or `/grill-me`

---



## Output checklist

- [ ] `docs/{requirements,designs,reviews,qa,release-notes}/` exist in this repo  
- [ ] `CLAUDE.md` and/or `GEMINI.md` (and AGENTS if present) contain project context  
- [ ] `docs/project_overview.md` created/updated (**Vietnamese**)  
- [ ] No artifacts outside the current repo  
- [ ] User knows the next command



## Do not

- Do not run the full REQ pipeline (triage→…→qa).
- Do not invent DB tables / APIs / services not seen in code or confirmed by the user.
- Do not onboard another repo unless the user is in that repo and invokes this skill again.

