# 3a-factory

A cross-agent development workflow template for Claude Code, Gemini CLI/AI Studio, Cursor, and other agentic coding tools.

## Core lifecycle

GRILL-ME -> SPEC -> PLAN -> CODE -> REVIEW

The model must not modify application source code from a raw requirement. Coding is allowed only after an approved SPEC and PLAN phase, authorized by a single, case-insensitive `APPROVED` directive.

## Recommended target-project structure

```text
project-root/
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── .ai/
│   ├── requirements/
│   ├── specs/
│   ├── plans/
│   ├── decisions/
│   ├── reviews/
│   ├── runs/
│   └── templates/
├── .agents/
│   └── skills/
│       ├── grill-me/SKILL.md
│       ├── spec/SKILL.md
│       ├── plan/SKILL.md
│       ├── code/SKILL.md
│       ├── review/SKILL.md
│       ├── init-ai-workflow/SKILL.md
│       ├── project-overview/SKILL.md
│       └── adr/SKILL.md
├── .claude/
│   ├── skills/              # Claude-native skills; can mirror .agents/skills
│   └── commands/            # Optional compatibility wrappers
├── .gemini/
│   └── commands/            # Gemini CLI custom slash commands in TOML
├── .cursor/
│   ├── rules/               # Cursor modern project rules in MDC
│   └── prompts/             # Copy-paste prompt fallbacks
└── docs/
    └── AI_WORKFLOW.md
```

## Compatibility notes

- Claude Code: use `.claude/skills/<skill-name>/SKILL.md`. Optional `.claude/commands/*.md` wrappers can call skills for backward compatibility.
- Gemini CLI: use `.gemini/commands/*.toml` for slash commands. Plain markdown prompts remain useful for Gemini Advanced / AI Studio.
- Cursor: prefer `.cursor/rules/*.mdc` project rules. `.cursorrules` may be generated only as legacy fallback.
- Generic agents: read `AGENTS.md` and `.agents/skills/**/SKILL.md` as the portable source of truth.

## Installation

You have multiple cross-platform installation methods available:

### Method 1: Using NPM (Recommended & Automatic)
Add the package to your development dependencies. The installation triggers a `postinstall` hook that automatically populates the directory structures and templates in your project root:
```bash
npm install --save-dev 3a-factory
```

### Method 2: Zero-Dependency Run (`npx`)
If you want to initialize the workspace without adding it to `package.json`:
```bash
npx 3a-factory
```

### Method 3: Shell Scripts (Fallback)
Run the script from your project root:
*   **Windows**:
    ```powershell
    powershell -ExecutionPolicy Bypass -File .\install-ai-workflow.ps1
    ```
*   **macOS / Linux**:
    ```bash
    bash ./install-ai-workflow.sh
    ```
