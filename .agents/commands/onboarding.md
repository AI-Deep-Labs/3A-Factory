---
name: onboarding
description: "Onboard ONE repo into 3A-Factory — create docs/, agent context (CLAUDE/GEMINI/AGENTS), explore codebase, write docs/project_overview.md. Create nothing outside the current repo."
argument-hint: "[optional hints about stack/repo role]"
---

# Onboarding (repo → 3A-Factory)

## Goal

1. Bring **one repo** onto the full 3A-Factory workflow.
2. Provide enough **project context** for later agent work (`project-manager` / `grill-me` / …).
3. Create `docs/` **inside the current repo**.
4. Create / extend / update the agent context file **for the current agent only** (do not wipe user-authored content — only add missing sections).

## Agent detection

Determine which agent is running **this session**:

| Agent | Detection | Context file |
|---|---|---|
| **Claude** | Claude Code / `.claude/` present / user stated | `CLAUDE.md` |
| **Gemini** | Gemini CLI / `.gemini/` present / user stated | `GEMINI.md` |
| **Cursor** | Cursor IDE / `.cursor/` present / user stated | None (Cursor reads `AGENTS.md` + `.cursor/rules/`) |

**Rule:** Only create/update the context file for the **detected agent**. `AGENTS.md` is always shared (all agents read it). Do **not** create `CLAUDE.md` when running in Gemini, do **not** create `GEMINI.md` when running in Claude or Cursor, etc.

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

Update **at the root of the repo being onboarded**. Only create/update files relevant to the **current agent** (see § Agent detection above).

### `AGENTS.md` / `WORKFLOW.md` (always — shared by all agents)

- If installer copied them: **fill** project context; do not break 3a-factory hard gates / lifecycle.
- If missing: install the package first (Phase B), then fill.

### `CLAUDE.md` (only if current agent is Claude)

- Create or **append** missing sections; do not delete user-written content.
- Fill: repo role, stack, internal deps, build/test/run, deploy notes, optional safety thresholds, pointer to `AGENTS.md` + 3A-Factory pipeline.
- Replace `[DETECTED_*]` placeholders with confirmed values / labeled inferences.
- **Do not create** if agent is Gemini or Cursor.

### `GEMINI.md` (only if current agent is Gemini)

- Same idea as `CLAUDE.md` — enough for Gemini CLI to know stack, commands, deploy.
- **Do not create** if agent is Claude or Cursor.

### Cursor (only if current agent is Cursor)

- Ensure `.cursor/rules/ai-workflow.mdc` (and skill rules) exist after install; do not invent rules that contradict `AGENTS.md`.
- Cursor does **not** have a standalone context file like `CLAUDE.md` — it reads `AGENTS.md` + rules.
- **Do not create** `CLAUDE.md` or `GEMINI.md`.

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
4. **Next**: mô tả yêu cầu **lifecycle** bằng ngôn ngữ tự nhiên — `project-manager` route theo Intent gate (`AGENTS.md` § Auto-intake). Q&A / giải thích code không mở PM; slash (`/grill-me`, …) vẫn dùng khi cần override

---



## Output checklist

- [ ] `docs/` exists in this repo (no legacy lifecycle folders pre-created)
- [ ] `AGENTS.md` filled with project context
- [ ] Agent-specific context file created/updated **only for current agent** (Claude → `CLAUDE.md`, Gemini → `GEMINI.md`, Cursor → rules only)
- [ ] `docs/project_overview.md` created/updated (**Vietnamese**)
- [ ] No artifacts outside the current repo; no context files for other agents
- [ ] User knows how to start the next REQ (natural language or slash override)



## Do not

- Do not run the full REQ pipeline (triage→…→qa).
- Do not invent DB tables / APIs / services not seen in code or confirmed by the user.
- Do not onboard another repo unless the user is in that repo and invokes this skill again.
