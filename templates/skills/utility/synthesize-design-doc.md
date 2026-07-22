---
name: synthesize-design-doc
description: Convert conversation context into BRD/TDD/spec/handoff under docs/ (or .agents/compact for handoff). Use when the user asks to summarize or synthesize design docs.
disable-model-invocation: false
---

# Synthesize Design Document

## Purpose
Analyze the full client–AI conversation (scattered Q&A, unfinished technical decisions), then normalize it into a professional design/requirements document for Business, Product, Dev, QA, and Architect stakeholders.

Save Markdown files in the project so later agents can reuse them.

## Output contract
- **Document body language: Vietnamese** (unless the user explicitly requests English). Keep standard technical terms in English when clearer.
- Paths:
  - Requirements / discovery / spec: `docs/requirements/REQ-<NNNNNN>-<slug>-*.md`
  - Analysis / design / plan: `docs/designs/REQ-<NNNNNN>-<slug>-*.md`
  - ADR: `docs/designs/ADR-<NNNNNN>-<slug>.md`
  - Review / QA / release: `docs/reviews/`, `docs/qa/`, `docs/release-notes/`
  - Compact handoff: `.agents/compact/HANDOFF-*.md`

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
