# CLAUDE.md

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

Greenfield: no legacy `docs/*` feature lifecycle paths; no migration tooling.

Claude-specific:
- Skills: `.claude/skills/<skill-name>/SKILL.md`
- Commands: `.claude/commands/*.md`
- **Auto-intake**: in an onboarded repo, describe requirements in natural language — agent reads `.agents/skills/project-manager/SKILL.md` (see `AGENTS.md` § Auto-intake); slash optional for intake
- **Approvals**: at each gate, agent asks a confirmation question; reply yes/no, có/không, or natural language — see contract § 5.4.1 (tokens optional)
- Slash overrides (when needed): `/onboarding`, `/handoff`, `/caveman`, `/synthesize-design-doc`, `/qa-issues`, **`/project-manager`** (mandatory PM mode — full workflow orchestration), `/grill-me`, `/triage`, `/analyze`, `/requirements`, `/adr`, `/design`, `/tasks`, `/acceptance`, `/spec-review`, `/spec`, `/develop`, `/review`, `/qa`, `/converge`, `/deploy`

**CRITICAL**: Before taking any actions, you must read `.agents/rules/agent-mode.md` to understand your strict constraints regarding internal thinking loops.

**Generated docs under `docs/tasks/` must be Vietnamese** (see `AGENTS.md`).

Project context (filled by `/onboarding`):
- Project type: `[DETECTED_PROJECT_TYPE]`
- Primary language: `[DETECTED_PRIMARY_LANGUAGE]`
- Architecture: `[DETECTED_ARCHITECTURE]`
- Build command: `[BUILD_COMMAND]`
- Test command: `[TEST_COMMAND]`
- Run command: `[RUN_COMMAND]`
- Deploy notes: `[DEPLOY_NOTES]`
