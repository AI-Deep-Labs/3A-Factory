---
name: triage
description: Classify a raw requirement into docs/requirements/REQ-<NNNNNN>-<slug>-raw.md. Use for new requests or when project-manager starts the pipeline.
disable-model-invocation: false
argument-hint: [raw requirement text]
---

# Triage

## Gate
Do not modify source code. Do not invent a solution.

## Preconditions
Repo should have standard `docs/` (5 folders). If missing → recommend `/onboarding` first (or create `docs/{requirements,designs,reviews,qa,release-notes}`).

## Naming & numbering (see AGENTS.md)
1. **Next number**: scan `docs/**/REQ-*.md`. Parse the number after `REQ-` — support legacy unpadded / slug-less names. `next = max+1`, format **6 digits**. Do not rename old files. If none → `000001`.
2. **Slug**: short kebab-case from the request (2–5 ASCII lowercase words). Fixed for the REQ lifetime.
3. **Canonical id**: `REQ-<NNNNNN>-<slug>` (e.g. `REQ-000013-login-throttle`).
4. Later branch: `feature/REQ-<NNNNNN>-<slug>` — same id.

## Steps
1. Determine the id using the rules above.
2. Extract from the raw text: requester (if any), verbatim description, type (feature/bug/change/question), urgency (or “unspecified”).
3. If basic info is missing (unclear description) → ask **one** question; do not invent a solution.
4. Write `docs/requirements/REQ-<NNNNNN>-<slug>-raw.md` using `.agents/templates/RAW-REQ-template.md`.
5. Do not jump to spec — leave sequencing to `project-manager` / later steps.

**File body: Vietnamese.**

## Output
Raw file path + full id `REQ-<NNNNNN>-<slug>` (reuse for every artifact/branch).
