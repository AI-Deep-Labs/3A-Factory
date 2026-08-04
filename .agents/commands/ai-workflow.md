---
name: ai-workflow
description: "3A-Factory workflow — Spec Package greenfield pipeline (Claude/Gemini/Cursor)"
cursorAlwaysApply: true
---

# 3A-Factory Workflow (Cursor)

Read `AGENTS.md` before making changes.

**Spec is a Feature-local Spec Package, not a single document.**

Canonical path: `docs/tasks/REQ-<NNNNNN>-<slug>/`

Canonical workflow:

```text
triage → grill-me if unclear → analyze → build/refine Spec Package
→ spec-review → APPROVED_SPEC_PACKAGE → project-manager
→ develop task-by-task → review per task → qa → converge
→ APPROVED_USER_REVIEW → done → deploy with APPROVED_DEPLOY
```

Artifact truth:

```text
requirements.md = Business Truth
design.md       = Technical Truth
tasks.md        = Execution Truth
acceptance.md   = Verification Truth
manifest.yaml   = Package State Truth
```

## Greenfield

- Feature artifacts only under `docs/tasks/`.
- Project-wide ADR: `docs/decisions/` (create when writing).
- No legacy lifecycle folders for new work.
- No migration tooling.
- Never auto-deploy.

## Hard gates

**CRITICAL**: When the turn is lifecycle / continue-REQ / approval / `/project-manager` / already in PM, read and obey `.agents/rules/agent-mode.md` (see **When these rules apply**). Do not force Spec Package for Q&A / explain code / meta / bypass / non-PM step slash.

- No coding from raw requirements.
- Develop requires spec package approval (+ develop approval when high-risk). User confirms at each gate — see contract § 5.4.1.
- Review alone marks tasks `done`.
- QA max 3 auto-fix attempts; converge then user review confirmation.
- Deploy needs explicit deploy confirmation; never auto-deploy.

## Auto-intake

See `AGENTS.md` § Auto-intake for the full contract (Intent gate).

- **Not onboarded** (missing `AGENTS.md`, `.agents/contracts/spec-package.md`, or `docs/`) → read `.agents/skills/onboarding/SKILL.md`
- **Onboarded** + Intent `lifecycle` / `continue_req` / `approval_reply` → read and execute `.agents/skills/project-manager/SKILL.md` — PM routes by `manifest.status` (no `/project-manager` required)
- Q&A / explain code / step slash / bypass → do **not** open PM
- Slash commands remain manual overrides
- **`/project-manager`**: mandatory PM mode — fully execute `.agents/skills/project-manager/SKILL.md` § Slash invocation (mandatory); no skipping workflow phases

## Skills / slash commands

- **Rules (slash / Rules UX):** `.cursor/rules/<skill>.mdc` with `alwaysApply: false`
- **Skill body (single source):** `.agents/skills/<skill>/SKILL.md` (Cursor discovers `.agents/skills`)
- Pipeline rule always on: `.cursor/rules/ai-workflow.mdc`
- Installer does **not** create `.cursor/skills/` (avoid duplicate mirrors)
- Use **Agent** chat. After reinstall, start a new chat if the `/` list is stale.

New repos: run onboarding first (`/onboarding` or natural language). Onboarded repos: lifecycle NL → PM auto-routes; Q&A does not.
