# GEMINI.md

Read `AGENTS.md` first. Follow the 3A-Factory pipeline:

`triage → (grill-me) → analyze → ADR? → design → spec → Planning? → develop → review → qa` → stop; `/deploy` is separate + requires `APPROVED`.

Gemini-specific:
- Skills: `.gemini/skills/<skill-name>/SKILL.md`
- Commands: `.gemini/commands/*.toml` (slash: `/project-manager`, `/grill-me`, …)
- If slash commands are unavailable, invoke phases in natural language (`project-manager`, `grill-me`, …).

**Generated docs under `docs/` must be written in Vietnamese** (see `AGENTS.md` language rules). Chat may follow the user’s language.

Project context (filled by `/onboarding`):
- Project type: `[DETECTED_PROJECT_TYPE]`
- Primary language: `[DETECTED_PRIMARY_LANGUAGE]`
- Architecture: `[DETECTED_ARCHITECTURE]`
- Build command: `[BUILD_COMMAND]`
- Test command: `[TEST_COMMAND]`
- Run command: `[RUN_COMMAND]`
- Deploy notes: `[DEPLOY_NOTES]`
