---
name: triage
description: Classify a request, allocate REQ id, and initialize a Feature-local Spec Package under .specs/ with manifest.yaml and raw.md.
disable-model-invocation: true
argument-hint: "[raw requirement text]"
---

# Triage

## Purpose
Classify a raw request, allocate `REQ-<NNNNNN>-<slug>`, and (when engineering lifecycle applies) initialize the Spec Package.

## Gate
Do not modify application source code.  
Do not implement feature code.  
Only create or update Spec Package artifacts.  
Do **not** write requirements, design, tasks, acceptance, or code.  
Do **not** invent a solution.

## Package resolution contract
1. If user/context provides a valid package path under `.specs/`, use it.
2. Else if a `REQ ID` is given, find exactly one directory `.specs/REQ-<NNNNNN>-*/`.
3. Exactly one match → use it. Multiple → stop with `PACKAGE_CONFLICT`.
4. None found and this skill may initialize → create `.specs/REQ-<NNNNNN>-<slug>/`.
5. Do not invent a new REQ ID when one is already provided.
6. Do not reuse a different REQ ID with a similar slug.
7. Do **not** write new artifacts under legacy `docs/requirements`, `docs/designs`, `docs/qa`, or `docs/reviews`.
8. Do not move or delete legacy artifacts.

## Naming & numbering
1. Scan existing ids under `.specs/**` and legacy `docs/**` for `REQ-*` / `ADR-*`.
2. Parse numeric part after `REQ-` (legacy unpadded / slug-less allowed). `next = max+1`, pad **6 digits**. Do not rename old files. If none → `000001`.
3. Slug: 2–5 ASCII kebab-case words from the request; fixed for the REQ lifetime.
4. Canonical folder: `.specs/REQ-<NNNNNN>-<slug>/`.
5. Branch (later): `feature/REQ-<NNNNNN>-<slug>`.

## Inputs
- Raw requirement text / user request
- Optional existing package path or REQ id
- Contract: `.agents/contracts/spec-package.md` (or `templates/.agents/contracts/spec-package.md` in this repo)
- Manifest template: `.agents/templates/SPEC-PACKAGE-MANIFEST-template.yaml`
- Raw template guidance: `.agents/templates/RAW-REQ-template.md`

## Process
1. Classify request type: `feature` | `bug` | `change` | `question` | `explanation` | other.
2. If the request is explanation-only / no engineering lifecycle → answer without creating a package; stop.
3. Otherwise allocate or reuse REQ id + slug.
4. If package missing → create:
   - `.specs/REQ-<NNNNNN>-<slug>/`
   - `decisions/`, `reviews/`, `qa/`, `qa/runs/`, `release/`
   - `manifest.yaml` from manifest template (`{{REQ_ID}}` = `REQ-<NNNNNN>` without slug, `{{SLUG}}`, `{{TITLE}}`, `{{RISK}}`)
5. Write `raw.md` (Vietnamese body).
6. Set initial risk estimate (`low` | `medium` | `high`) using AGENTS.md rubric (preliminary; analyze may refine).
7. Update manifest: `status: triaged`, `risk: …`.
8. If basic description is too unclear to classify → ask **one** question; do not invent content.
9. Route: unclear → hand off to `grill-me`; clear enough → ready for `analyze` / `project-manager` sequencing.

## Output contract — `raw.md`
Only:
- Metadata (REQ ID, package path, created at, source)
- Verbatim / faithful original request
- Request source
- Initial classification (type, urgency, preliminary risk)
- **No** solution, normalized requirements, or design

## Manifest updates
```yaml
status: triaged
risk: low | medium | high
```

## Failure states
- `PACKAGE_CONFLICT` — multiple packages for same REQ number
- Stop and ask one clarifying question when classification is impossible

## Stop condition
Print package path + full id `REQ-<NNNNNN>-<slug>` + next suggested skill (`grill-me` or `analyze`). Do not jump to design/spec/develop.
