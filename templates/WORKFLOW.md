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

### Auto-intake (default in onboarded repos)

Describe requirements in natural language — no slash required. Agent reads `.agents/skills/project-manager/SKILL.md`; PM routes by `manifest.status`. See `AGENTS.md` § Auto-intake.

### Slash overrides

- **`/project-manager`**: **mandatory PM mode** — fully execute skill § Slash invocation (mandatory); Session orchestration; no skipping phases
- **`/grill-me`**: deep clarification into package `discovery.md`.
- Other workflow skills (`/triage`, `/develop`, `/qa`, …) remain available as manual overrides.

### Approvals (natural language)

At each gate, agent asks a confirmation question; user replies yes/no, có/không, đồng ý/từ chối, or natural language. Gate IDs (`APPROVED_*`) are internal; exact tokens still work. Contract § 5.4.1 · `.agents/templates/APPROVAL-CONFIRMATION-template.md`.

## Deploy
Separate from PM. Requires `manifest.status == done` and deploy confirmation (natural language or `APPROVED_DEPLOY`).

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
