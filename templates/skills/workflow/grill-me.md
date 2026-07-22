---
name: grill-me
description: Deep clarification (one question at a time). Write REQ-<NNNNNN>-<slug>-discovery.md; when clear or user says “execute now”, continue the pipeline.
disable-model-invocation: false
argument-hint: [requirement or REQ-<NNNNNN>-<slug>]
---

# Grill-me

## Gate
Do not modify source code. Do not write a full implementation plan (that is Planning).

## Process
1. Restate the requirement (business + technical).
2. Identify goal and success signal.
3. **Explore the codebase first** — only ask what cannot be deduced from the repo.
4. Constraints: users, entities, dependencies, risks.
5. Ask **exactly one** question per turn; analyze the answer before the next question.
6. Iterate until core ambiguity is resolved, or the user signals “execute now” / equivalent.
7. Write `docs/requirements/REQ-<NNNNNN>-<slug>-discovery.md` (same id as raw). If raw is missing → run/ask for triage first or create minimal raw per `AGENTS.md` naming.

**Discovery file body: Vietnamese.**

## Pipeline handoff
- Clear enough (agent judgment) **or** “execute now” → **do not** ask “run the pipeline?”; continue analyze→… (or return to `project-manager`).
- “Execute now” does **not** bypass `APPROVED` for high-risk develop / any deploy.
- If critical info is still missing so design/spec cannot be written → ask one more question, then stop.

## Output each turn
1. Current Understanding  
2. Business Goal  
3. Explored Codebase Findings  
4. Assumptions & Edge Cases  
5. Current Focus Question (exactly one)  
6. Acceptance Direction  
