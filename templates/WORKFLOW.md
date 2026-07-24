# 3A Factory

## Target architecture — Spec Package (greenfield)

**Spec is a Feature-local Spec Package, not a single document.**

Canonical path: `docs/tasks/REQ-<NNNNNN>-<slug>/`

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
- Installer does not create `docs/tasks/` and does not run workflow.
- Never auto-deploy.

## Dual mode
- **`/project-manager`**: state-machine orchestrator for the Spec Package lifecycle.
- **`/grill-me`**: deep clarification into package `discovery.md`.

## Deploy
Separate from PM. Requires `manifest.status == done` and `APPROVED_DEPLOY`.

## Naming & id allocation

Formats: `REQ-<NNNNNN>-<slug>`, `ADR-<NNNNNN>-<slug>`; folder `docs/tasks/REQ-<NNNNNN>-<slug>/`; `manifest.id` = `REQ-<NNNNNN>`.

REQ and ADR are **separate** series. **No allocator script.** The agent lists real package/ADR path names and applies `next = max + 1` (none → `000001`).

Count **only** basenames under `docs/tasks/REQ-*` (and legacy package roots if present) for REQ; ADR files under `docs/decisions/` / package `decisions/`. **Never** treat illustrative ids in `.agents/`, skills, or contracts as allocated. Examples in tooling use `REQ-000001-…` / `ADR-000001-…` only.

## Tool mapping
| Tool | Native files | Notes |
|---|---|---|
| Claude Code | `.claude/skills`, `.claude/commands`, `CLAUDE.md` | Skills + slash commands |
| Gemini CLI | `.gemini/commands/*.toml` → `.agents/skills`, `GEMINI.md` | Slash entry; single skill body |
| Cursor | `.cursor/rules/*.mdc` + `ai-workflow.mdc`; skill body in `.agents/skills` | Requestable rules; no `.cursor/skills` mirror |
