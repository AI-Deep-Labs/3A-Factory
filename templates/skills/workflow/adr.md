---
name: adr
description: Optional Architectural Decision Record — docs/designs/ADR-<NNNNNN>-<slug>.md. Use for major architecture decisions.
disable-model-invocation: false
argument-hint: [slug or REQ id]
---

# ADR

## Goal
Compare ≥2 architecture options and record the decision. **Optional** in the pipeline — only when needed.

## Naming
1. Scan `docs/designs/ADR-*.md`; parse the number after `ADR-` (including legacy unpadded / slug-less). `next = max+1`, pad **6 digits**. Do not rename old files.
2. Choose a kebab-case slug; id = `ADR-<NNNNNN>-<slug>`.
3. Write `docs/designs/ADR-<NNNNNN>-<slug>.md`. Link related REQ as `REQ-<NNNNNN>-<slug>` if any.

Template: `.agents/templates/ADR-template.md`.

**File body: Vietnamese.** Instruction sections in this skill: English.

## Workflow
1. Context & goals  
2. ≥2 options with pros/cons  
3. Decision & rationale  
4. Technical design (mermaid/structure if useful)  
5. Risks & mitigations  
6. Next steps (usually → design skill)

## Required structure
Status, Author, Date, Decision Code (`ADR-<NNNNNN>-<slug>`), sections 1–6 as in the template.
