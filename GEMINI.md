# GEMINI.md

Read `AGENTS.md` first.

**Spec is a Feature-local Spec Package, not a single document.**

Canonical path: `docs/tasks/REQ-<NNNNNN>-<slug>/`

Canonical workflow:

```text
triage → grill-me if unclear → analyze → build/refine Spec Package
→ spec-review → APPROVED_SPEC_PACKAGE → project-manager
→ develop task-by-task → review per task → qa → converge
→ APPROVED_USER_REVIEW → done → deploy with APPROVED_DEPLOY
```

Artifact truth: `requirements.md` (Business) · `design.md` (Technical) · `tasks.md` (Execution) · `acceptance.md` (Verification) · `manifest.yaml` (State).

Greenfield: no legacy feature lifecycle under `docs/requirements|designs|reviews|qa`; no migration tooling.

Gemini-specific:
- Slash commands: `.gemini/commands/<name>.toml` → type `/name` (then `/commands reload` if newly installed)
- Skill body (single source): `.agents/skills/<name>/SKILL.md`
- Installer does **not** create `.gemini/skills/` (avoid duplicate mirrors)
- List: `/commands list` and `/skills list` (skills resolve from `.agents/skills`)
- If slash commands are unavailable, invoke phases in natural language (`project-manager`, `tasks`, `converge`, …).

**CRITICAL**: Before taking any actions, you must read `.agents/rules/agent-mode.md` to understand your strict constraints regarding Planning Mode.

**Generated docs under `docs/tasks/` must be Vietnamese** (see `AGENTS.md`). Chat may follow the user’s language.

Project context (filled by `/onboarding`):
- Project type: `[DETECTED_PROJECT_TYPE]`
- Primary language: `[DETECTED_PRIMARY_LANGUAGE]`
- Architecture: `[DETECTED_ARCHITECTURE]`
- Build command: `[BUILD_COMMAND]`
- Test command: `[TEST_COMMAND]`
- Run command: `[RUN_COMMAND]`
- Deploy notes: `[DEPLOY_NOTES]`
