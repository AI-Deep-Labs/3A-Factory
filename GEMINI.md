# GEMINI.md

Read `AGENTS.md` first. Follow ALEX workflow: GRILL-ME -> SPEC -> PLAN -> CODE -> REVIEW.

Gemini-specific usage:
- **Language**: Follow `AGENTS.md` strictly and generate all workspace documents and outputs in Vietnamese (tiếng Việt).
- Gemini CLI custom commands should live in `.gemini/commands/*.toml`.
- For Gemini Advanced / AI Studio, use `.agents/skills/*/SKILL.md` as copy-paste prompts.
- If slash commands are unavailable, treat `/grill-me`, `/spec`, `/plan`, `/code`, `/review`, `/init-ai-workflow`, `/project-overview`, `/adr`, `/caveman`, `/handoff`, `/qa` as natural-language phase requests.

Project context is filled by `/init-ai-workflow`:
- Project type: `[DETECTED_PROJECT_TYPE]`
- Primary language: `[DETECTED_PRIMARY_LANGUAGE]`
- Architecture: `[DETECTED_ARCHITECTURE]`
- Build command: `[BUILD_COMMAND]`
- Test command: `[TEST_COMMAND]`
- Run command: `[RUN_COMMAND]`
