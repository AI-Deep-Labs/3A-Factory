---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
---

# Handoff Skill

## Gate
None. This is an active utility skill for session consolidation.

## Process
1. Summarize the progress, key decisions, active issues, and pending actions from the current conversation.
2. Save the handoff summary directly into the `.agents/compact/` directory of the current project workspace.
3. Name the file using the format: `HANDOFF-YYYYMMDD-HHMM.md` (e.g., `HANDOFF-20260601-1430.md`).
4. Keep the summary highly focused. Do not duplicate content already captured in other artifacts (such as requirements, specs, plans, ADRs, reviews, or run logs). Instead, reference them using clickable workspace paths (e.g., `[PLAN-xyz.md](file:///.agents/plans/PLAN-xyz.md)`).
5. Redact any sensitive information, such as API keys, secrets, passwords, or PII.
6. If the user passed arguments, treat them as the defined objective of the next session and customize the handoff goals accordingly.

## Output
Produce a beautifully formatted Markdown handoff document inside `.agents/compact/HANDOFF-YYYYMMDD-HHMM.md` containing:
1. **Objective**: Description of the next session's focus (incorporating user arguments if provided).
2. **Current State**: Where the codebase and tasks stand.
3. **Session Progress**: High-level summary of achievements in this turn.
4. **Key Reference Artifacts**: Direct links to plans, ADRs, and modified files in the workspace.
5. **Next Actions**: Actionable list of steps for the incoming agent.
6. **Suggested Skills**: Explicit recommendation of which ALEX skills to run next (e.g., `init-ai-workflow`, `project-overview`, `grill-me`, `spec`, `plan`, `code`, `review`).

Confirm the exact file path where the handoff document was saved to the user when finished.
