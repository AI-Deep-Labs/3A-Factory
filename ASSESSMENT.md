# Assessment of current alex-agent-workflow.zip

## Overall verdict
Good foundation. The ASK -> SPEC -> PLAN -> CODE -> REVIEW lifecycle is clear and useful. The current template already has the right intent: prevent premature coding, force requirement clarification, make code changes traceable to an approved plan, and add review before merge.

## Main gaps found

| Area | Current state | Risk | Recommended fix |
|---|---|---|---|
| Installer | README references `install.sh` and `.ps1`, but uploaded zip does not include them. | User cannot bootstrap projects with the documented command. | Add scripts and keep README aligned with actual files. |
| Claude skills location | Uses `.agents/skills`; README says agents load it dynamically. | Claude Code natively discovers `.claude/skills`, not arbitrary `.agents/skills` unless explicitly told. | Keep `.agents/skills` as portable source, mirror to `.claude/skills`. |
| Gemini commands | Uses `.gemini/prompts/*.md`. | Gemini CLI custom slash commands are now `.gemini/commands/*.toml`; prompts are fallback only. | Add `.gemini/commands/*.toml`. |
| Cursor rules | Uses `.cursorrules`. | Modern Cursor project rules should be under `.cursor/rules/*.mdc`; `.cursorrules` is legacy/fallback. | Add `.cursor/rules/alex-workflow.mdc`; optionally generate `.cursorrules`. |
| Generic agent compatibility | No top-level `AGENTS.md`. | Cursor/other agents may not know the canonical workflow. | Add `AGENTS.md` as cross-agent source of truth. |
| Phase artifacts | Has specs and plans, but lacks decisions, reviews, run logs. | Harder to audit decisions, test results, and release readiness. | Add `.agents/decisions`, `.agents/reviews`, `.agents/runs`. |
| Approval semantics | Good, but not fully stateful. | Agent may confuse `APPROVED` across turns. | Each skill should re-read prior artifact and validate current phase. |
| CODE boundaries | Says only files in plan, but no handling for newly discovered files. | Agent may edit extra files silently. | If file not in plan, stop and request plan update. |
| Review output | Good, but severity labels missing. | Harder to prioritize findings. | Add Critical/High/Medium/Low/Nit. |
| Duplication | CLAUDE/GEMINI/Cursor contain repeated full workflow text. | Updates drift across tools. | Put canonical rules in `AGENTS.md` and skills; tool files become adapters. |

## Recommended v2 structure
See `README.md` and `templates/` in this package.
