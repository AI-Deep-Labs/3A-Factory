# Agent Mode Constraints

**CRITICAL OVERRIDE FOR ALL AGENTS (Gemini, Claude, Cursor)**

## When these rules apply

- User invoked `/project-manager`, **or**
- Auto-intake Intent gate selected `lifecycle` | `continue_req` | `approval_reply` (see `AGENTS.md` § Auto-intake and `project-manager` skill), **or**
- Agent is already inside PM Session orchestration / mandatory PM mode for this turn

## When these rules do NOT apply

- Pure Q&A, code explanation, ad-hoc review unrelated to a REQ
- Tooling/meta questions (unless the user asks to run the workflow)
- User asks to bypass the workflow
- A non-PM step slash owns the turn (`/triage`, `/develop`, `/qa`, `/deploy`, …)

In those cases: answer normally or run that skill; do **not** create `docs/tasks/REQ-*`; do **not** force Spec Package intake.

## Constraints (when applicable)

By reading this file under an applicable case above, you must completely disable any default internal planning modes, autonomous file creation outside the canonical workflow, or hidden artifacts.

1. **No Internal Planning Mode**: You MUST disable your "Built-in Planning Mode".
2. **No Hidden Artifacts**: NEVER create `implementation_plan.md`, `task.md`, `walkthrough.md`, or arbitrary scratchpads in hidden agent-specific configuration folders (e.g., `.gemini`, `.cursor`, `.claude`).
3. **No Internal Loops**: Disable any internal `<thinking>` loops that result in writing plans outside the canonical workflow.
4. **Canonical Workflow ONLY**: ALL plans, requirements, and documents MUST strictly follow the Greenfield Feature-local Spec Package architecture and be created explicitly under `docs/tasks/REQ-*`.
5. **No coding from raw requirements**: You must strictly require the Spec Package and user approvals (`APPROVED_SPEC_PACKAGE`, etc.) before executing application code changes.

## Asynchronous Execution & Tool Invariants

When delegating tasks via sub-agents or automated background tools, you must strictly follow the Async Yield Protocol:

1. **Reactive Wakeup (Turn-Yielding):** When you invoke a subagent (e.g., using `invoke_subagent`), you MUST immediately stop calling any other tools and end your turn. The system will automatically wake you up when the subagent's task is complete. Do not attempt to poll, loop, or artificially keep the session alive.
2. **No Fake Loading Screens:** You are STRICTLY FORBIDDEN from using `ask_question` or any interactive UI tools to tell the user "Please wait", "Running...", or "Delegating...". 
3. **Blocking UI Rules:** `ask_question` is a blocking modal. Use it ONLY when you have a genuine blocker that requires a human design decision or clarification. Never use it to confirm that a background process has started.
