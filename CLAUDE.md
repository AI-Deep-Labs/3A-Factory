# CLAUDE.md

Read `AGENTS.md` first. Follow ALEX workflow: GRILL-ME -> SPEC -> PLAN -> CODE -> REVIEW.

Claude-specific usage:
- Prefer project skills in `.claude/skills/<skill-name>/SKILL.md`.
- Compatibility slash command wrappers may live in `.claude/commands/*.md`.
- Use `/grill-me`, `/spec`, `/plan`, `/code`, `/review`, `/init-ai-workflow`, `/project-overview`, `/adr`, `/caveman`, `/handoff`, `/qa` when available.

Project context is filled by `/init-ai-workflow`:
- Project type: `[DETECTED_PROJECT_TYPE]`
- Primary language: `[DETECTED_PRIMARY_LANGUAGE]`
- Architecture: `[DETECTED_ARCHITECTURE]`
- Build command: `[BUILD_COMMAND]`
- Test command: `[TEST_COMMAND]`
- Run command: `[RUN_COMMAND]`
