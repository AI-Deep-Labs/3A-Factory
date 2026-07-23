---
name: synthesize-design-doc
description: Convert conversation context into BRD/TDD/spec/handoff under docs/ (handoff → docs/misc/compact). Use when the user asks to summarize or synthesize design docs.
disable-model-invocation: false
---

# Synthesize Design Document

## Purpose
Analyze the full client–AI conversation (scattered Q&A, unfinished technical decisions), then normalize it into a professional design/requirements document for Business, Product, Dev, QA, and Architect stakeholders.

Save Markdown files in the project so later agents can reuse them.

## Output contract
- **Document body language: Vietnamese** (unless the user explicitly requests English). Keep standard technical terms in English when clearer.
- Paths (Feature-local Spec Package — greenfield):
  - Feature package: `.specs/REQ-<NNNNNN>-<slug>/` (`raw.md`, `discovery.md`, `requirements.md`, `analysis.md`, `design.md`, `tasks.md`, `acceptance.md`, …)
  - Package ADR: `.specs/REQ-<NNNNNN>-<slug>/decisions/ADR-<NNNNNN>-<slug>.md`
  - Project-wide ADR: `docs/decisions/ADR-<NNNNNN>-<slug>.md`
  - Review / QA evidence: under the same package (`reviews/`, `qa/`) or package `release/`
  - Compact handoff: `docs/misc/compact/HANDOFF-*.md`
- Do **not** write new feature artifacts under legacy `docs/requirements|designs|reviews|qa`.
- Do **not** create `/plan` artifacts.

## Document modes

### Mode 1: BRD / Functional Specification
For Client / PO / BA:
- Business context & goals
- Scope (In / Out)
- Actors & permissions
- User flows / workflows
- Functional requirements (measurable “The system shall…”)
- Business rules (detailed tables)
- Open questions & acceptance criteria

### Mode 2: Technical Design Document (TDD)
For Developers / Architects / Tech Leads:
- Architecture & system boundaries
- Data model / entities
- API / service design (endpoints, idempotency, validations)
- State management
- Error handling, retry, reliability
- Concurrency
- Technical risks & mitigations

### Mode 3: Development Handoff
- Feature list to build
- Service responsibilities
- API and data-structure changes
- Business rules & edge cases
- Suggested task breakdown

### Mode 4: QA / Test planning input
- Testable requirements checklist
- Suggested scenarios (happy path, validation, permission, state, concurrency, failover)
- Regression hotspots

### Mode 5: Client confirmation checklist
- Confirmed decisions
- Assumptions
- Open questions (Yes/No or short answers)

## Default combined structure (when mode is unspecified)

```markdown
# 1. Executive Summary
# 2. Background and Context
# 3. Problem Statement
# 4. Business Objectives
# 5. Scope
## 5.1 In Scope
## 5.2 Out of Scope
# 6. Stakeholders and Actors
# 7. Current Workflow
# 8. Proposed Workflow
# 9. Functional Requirements
# 10. Business Rules
# 11. Edge Cases and Exception Handling
# 12. Data Model / Entities
# 13. API / Service Design
# 14. State Management
# 15. Non-Functional Requirements
# 16. Technical Design Considerations
# 17. Risks and Constraints
# 18. Assumptions
# 19. Open Questions
# 20. Recommended Solution
# 21. Appendix
```

*(Section titles in the saved file may be Vietnamese equivalents; keep structure and precision.)*

## Requirement writing rules
- Prefer measurable, unambiguous statements over vague phrasing.
- Label certainty: **Confirmed** / **Assumption** / **Open Question**.
