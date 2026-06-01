---
name: init-ai-workflow
description: Initialize or repair the ALEX workflow files, detect project stack, commands, architecture, and sync cross-agent rules.
disable-model-invocation: true
---

# INIT Skill

## Goal
Make the repository ready for Claude, Gemini, Cursor, and generic agents.

## Process
1. Verify/create directories: `.agents/{requirements,specs,plans,decisions,reviews,runs,templates,skills}`, `.claude/skills`, `.gemini/commands`, `.cursor/rules`, `docs`.
2. Detect stack from marker files: `package.json`, `*.sln`, `*.csproj`, `pyproject.toml`, `requirements.txt`, `pom.xml`, `build.gradle`, `go.mod`, `Cargo.toml`, Docker files.
3. Detect build/test/run commands from project files, not guesses when possible.
4. Update placeholders in `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and Cursor rule files.
5. Copy/sync skills to `.agents/skills` and `.claude/skills`.
6. Create Gemini `.toml` commands and Cursor `.mdc` rules.

## Output
1. **Detected Project Type**
2. **Detected Commands**
3. **Paths Created/Repaired**
4. **Files Updated**
5. **Risks / Manual Follow-up**
6. **Next Command Recommendation**
