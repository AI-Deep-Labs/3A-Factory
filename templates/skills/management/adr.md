---
name: adr
description: Analyze architectural problems, technical options, pros/cons, and record them as a professional Architectural Decision Record (ADR) file. Use when the user requests technical analysis, option comparisons, package evaluations, or database/architecture designs before coding.
disable-model-invocation: false
---

# ADR (Architectural Decision Record) Skill

## Purpose

This skill guides an agent to analyze a technical design problem, compare different options, and document the selected option in a high-quality Architectural Decision Record (ADR) file named `.agents/decisions/ADR-[short-name].md`.

---

## Output Contract

The agent must output a single markdown file under `.agents/decisions/`:

```text
.agents/decisions/ADR-[short-name].md
```

### Language Rule
All contents inside the generated `.agents/decisions/ADR-[short-name].md` file **must be written in Vietnamese**, keeping technical terminology clean, accurate, and professional.

---

## Required Workflow

### Phase 1: Context & Requirements Gathering
*   Identify the exact technical issue, business context, and constraints.
*   Clearly define what success looks like (e.g., performance, developer velocity, ease of maintenance, cost).

### Phase 2: Design Options Enumeration
*   Formulate at least 2 distinct technical options (e.g., Option A vs Option B).
*   For each option, detail its core mechanism, implementation complexity, and dependencies.
*   Identify Pros (Ưu điểm) and Cons (Nhược điểm) with concrete arguments.

### Phase 3: Evaluation & Trade-offs
*   Compare options side-by-side using key architectural criteria.
*   Provide a clear technical rationale for why the chosen option is superior, and why the other options were rejected.

### Phase 4: Implementation & Risks Mapping
*   Provide a detailed folder structure representation or mermaid sequence diagram of how the chosen design works.
*   Enumerate potential risks (e.g., performance bottlenecks, security holes, scalability limits) and their exact mitigations.
*   Define the checklist of next steps to execute.

---

## Required ADR Structure

The output file `.agents/decisions/ADR-[short-name].md` must strictly follow this structure:

```markdown
# Architectural Decision Record: [Short Architectural Decision Title]

*   **Status**: [Proposed (Draft) | Accepted (Approved)]
*   **Author**: [Author Name / AI Assistant]
*   **Date**: YYYY-MM-DD
*   **Decision Code**: ADR-[short-name]

---

## 1. Context & Goals

---

## 2. Options Considered

---

## 3. Decision & Rationale

---

## 4. Detailed Technical Design

---

## 5. Risks & Mitigations

---

## 6. Next Steps Plan
```
