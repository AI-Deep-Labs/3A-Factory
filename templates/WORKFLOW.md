# 3A Factory

## Lifecycle
```mermaid
flowchart TD
  R[Raw requirement] --> E{Entry}
  E -->|project-manager| I[triage]
  E -->|grill-me| G[grill-me]
  I --> V{Clear enough?}
  V -->|No| G
  V -->|Yes| A[analyze]
  G --> D[discovery + continue pipeline]
  D --> A
  A --> ADR{ADR?}
  ADR -->|optional| AD[ADR]
  ADR --> DES[design How]
  AD --> DES
  DES --> S[spec What]
  S --> SR[Self-review vs prior docs]
  SR --> UR[User review — stop]
  UR -->|changes requested| FIX[Update spec + related docs]
  FIX --> SR
  UR -->|APPROVED| P{Planning?}
  P -->|high risk: required| PL[plan]
  P -->|low/med: optional| CG{High risk?}
  PL --> CG
  CG -->|Yes| AP[Wait APPROVED]
  CG -->|No| C[develop]
  AP -->|APPROVED| C
  C --> Vw[review ≤2]
  Vw --> Q[qa ≤2]
  Q -->|Pass| Stop[Stop]
  Stop --> Dep[User /deploy + APPROVED]
```

## Dual mode
- **`/project-manager`**: auto-run pipeline; if unclear → `grill-me`; when clear or “execute now” → continue without asking again. **Exception:** always stop after spec for user `APPROVED`.
- **`/grill-me`**: deep clarification; same handoff rules into the pipeline.

## Deploy
Always separate from PM. After QA Pass, user runs `/deploy <env>` and must **`APPROVED`** before execution.

## Directives
- **`APPROVED`**: after **every** spec (all risk levels) before plan/develop; before develop when risk is **high**; before every deploy.
- **`REJECTED`** / **`RE-EXECUTE`**: approval gate / refine current artifact (and related prior docs when adjusting after spec review).

## Spec review gate
After writing `…-spec.md`, the agent must:
1. Self-evaluate the spec against raw / discovery / analysis / design / ADR.
2. Ask the user to verify and point out adjustments if needed.
3. Apply updates to the spec and related prior documents when requested.
4. Continue only after explicit `APPROVED`.

## Artifacts
`docs/requirements|designs|reviews|qa|release-notes` — see `AGENTS.md`.  
Generated artifact **content** must be **Vietnamese**; this workflow file stays English.

## Tool mapping
| Tool | Native files | Notes |
|---|---|---|
| Claude Code | `.claude/skills`, `.claude/commands`, `CLAUDE.md` | Skills first-class; commands are wrappers |
| Gemini CLI | `.gemini/skills`, `.gemini/commands/*.toml`, `GEMINI.md` | Skills + TOML slash commands |
| Cursor | `.cursor/skills`, `.cursor/rules/ai-workflow.mdc` | Skills = slash commands (`/project-manager`, …); `ai-workflow` rule always applies |
