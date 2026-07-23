# 3A Factory

## Target architecture — Spec Package (greenfield)

**Spec is a Feature-local Spec Package, not a single document.**

Canonical path: `.specs/REQ-<NNNNNN>-<slug>/`

Canonical workflow:

```text
triage → grill-me if unclear → analyze → build/refine Spec Package
→ spec-review → APPROVED_SPEC_PACKAGE → project-manager
→ develop task-by-task → review per task → (repeat)
→ qa → bounded auto-fix loop → converge
→ APPROVED_USER_REVIEW → done → deploy only with APPROVED_DEPLOY
```

Artifact truth:

```text
requirements.md = Business Truth
design.md       = Technical Truth
tasks.md        = Execution Truth
acceptance.md   = Verification Truth
manifest.yaml   = Package State Truth
```

Contract: `templates/.agents/contracts/spec-package.md`  
Schema: `templates/.agents/schemas/spec-package-manifest.schema.json`

## Greenfield policy

- No legacy feature paths under `docs/requirements|designs|reviews|qa`.
- Project-wide ADR: `docs/decisions/` (create when writing the first project-wide ADR).
- No migration tooling / legacy resolver.
- Installer does not create `.specs/` and does not run workflow.
- Never auto-deploy.

## Dual mode
- **`/project-manager`**: state-machine orchestrator for the Spec Package lifecycle.
- **`/grill-me`**: deep clarification into package `discovery.md`.

## Deploy
Separate from PM. Requires `manifest.status == done` and `APPROVED_DEPLOY`.

## Tool mapping
| Tool | Native files | Notes |
|---|---|---|
| Claude Code | `.claude/skills`, `.claude/commands`, `CLAUDE.md` | Skills first-class |
| Gemini CLI | `.gemini/skills`, `.gemini/commands/*.toml`, `GEMINI.md` | TOML slash commands |
| Cursor | `.cursor/skills`, `.cursor/rules/ai-workflow.mdc` | Slash via skills |
