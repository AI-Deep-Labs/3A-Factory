# Agent Mode Constraints

**CRITICAL OVERRIDE FOR ALL AGENTS (Gemini, Claude, Cursor)**

By reading this file, you must completely disable any default internal planning modes, autonomous file creation outside the canonical workflow, or hidden artifacts.

1. **No Internal Planning Mode**: You MUST disable your "Built-in Planning Mode".
2. **No Hidden Artifacts**: NEVER create `implementation_plan.md`, `task.md`, `walkthrough.md`, or arbitrary scratchpads in hidden agent-specific configuration folders (e.g., `.gemini`, `.cursor`, `.claude`).
3. **No Internal Loops**: Disable any internal `<thinking>` loops that result in writing plans outside the canonical workflow.
4. **Canonical Workflow ONLY**: ALL plans, requirements, and documents MUST strictly follow the Greenfield Feature-local Spec Package architecture and be created explicitly under `docs/tasks/REQ-*`.
5. **No coding from raw requirements**: You must strictly require the Spec Package and user approvals (`APPROVED_SPEC_PACKAGE`, etc.) before executing application code changes.
