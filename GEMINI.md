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
- **Auto-intake**: in an onboarded repo, NL **lifecycle / continue REQ / approval** → `project-manager` (`AGENTS.md` § Auto-intake Intent gate). Q&A / explain code / step slash → do **not** open PM
- **Approvals**: confirmation questions at each gate; natural language or `APPROVED_*` tokens — contract § 5.4.1
- **`/project-manager`**: mandatory PM mode — fully execute skill § Slash invocation (mandatory)
- Utility slashes: `/onboarding`, `/handoff`, `/caveman`, `/specification-synthesizer`, `/qa-issues`

**CRITICAL**: When the turn is lifecycle / continue-REQ / approval / `/project-manager` / already in PM, read `.agents/rules/agent-mode.md` (scoped — see **When these rules apply**). Skip Spec Package-forcing rules for Q&A / explain code / meta / bypass / non-PM step slash.

**Generated docs under `docs/tasks/` must be Vietnamese** (see `AGENTS.md`). Chat may follow the user’s language.

Project context (filled by `/onboarding`):
- Project type: `[DETECTED_PROJECT_TYPE]`
- Primary language: `[DETECTED_PRIMARY_LANGUAGE]`
- Architecture: `[DETECTED_ARCHITECTURE]`
- Build command: `[BUILD_COMMAND]`
- Test command: `[TEST_COMMAND]`
- Run command: `[RUN_COMMAND]`
- Deploy notes: `[DEPLOY_NOTES]`
