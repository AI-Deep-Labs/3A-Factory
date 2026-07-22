# CLAUDE.md

Read `AGENTS.md` first. Follow the 3A-Factory pipeline:

`triage → (grill-me) → analyze → ADR? → design → spec → Planning? → develop → review → qa` → stop; `/deploy` is separate + requires `APPROVED`.

Claude-specific:
- Skills: `.claude/skills/<skill-name>/SKILL.md`
- Commands: `.claude/commands/*.md`
- Recommended: `/onboarding`, `/project-manager`, `/grill-me`, `/triage`, `/analyze`, `/design`, `/spec`, `/plan`, `/develop`, `/review`, `/qa`, `/deploy`, `/qa-issues`, …

**Generated docs under `docs/` must be written in Vietnamese** (see `AGENTS.md` language rules).

Project context (filled by `/onboarding`):
- Project type: `[DETECTED_PROJECT_TYPE]`
- Primary language: `[DETECTED_PRIMARY_LANGUAGE]`
- Architecture: `[DETECTED_ARCHITECTURE]`
- Build command: `[BUILD_COMMAND]`
- Test command: `[TEST_COMMAND]`
- Run command: `[RUN_COMMAND]`
- Deploy notes: `[DEPLOY_NOTES]`
