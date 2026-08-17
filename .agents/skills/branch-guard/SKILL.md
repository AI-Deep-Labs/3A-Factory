---
name: branch-guard
description: "Git branch safety gate — runs in TWO phases: (A) pre-develop: verify/create a feature branch before the first develop call in a REQ; (B) post-review-commit: commit task-scoped code after each review PASSED. Never pushes. Never marks task done. Reports back to project-manager."
argument-hint: "[pre-develop | commit] [REQ-<NNNNNN>-<slug> or package path] [TASK-NNN for commit phase]"
---

# Branch Guard

## Purpose

Enforce Git hygiene at two mandatory checkpoints within the implement loop:

| Phase | Trigger | Action |
|---|---|---|
| **A — Pre-develop** | Before the first `develop` call for a REQ | Verify current branch is not a protected branch; create feature branch if needed |
| **B — Commit-per-task** | After `review` sub-agent returns PASSED for a task | Stage task-scoped files and create a conventional commit |

PM is the sole caller. This skill never pushes and never auto-deploys.

---

## Phase A — Pre-develop Branch Check

### 1. Read context

```text
manifest.yaml → id, slug, git.working_branch, git.branch_guard_status
raw.md + analysis.md → infer REQ type for branch prefix
```

### 2. Determine phase entry

- If `manifest.git.branch_guard_status == done` → **skip entirely**; report `BRANCH_OK` to PM.
- If `manifest.git.branch_guard_status == awaiting_user_action` → jump to **step 5b** (re-verify clean).

### 3. Detect current branch

Run: `git branch --show-current`

**Protected branches**: `main`, `staging`, `develop`

```text
If current branch IS NOT protected → BRANCH_OK:
  • Report to PM with current branch name.
  • But still run step 4 (check for unrelated feature branch with changes — apply same dirty-tree rules).
  
If current branch IS protected → continue to step 4.
```

> **Unrelated feature branch rule** (branch is not protected, but not the target REQ branch):  
> Apply the same dirty-check as step 4 below, then checkout `origin/main` and create REQ branch.

### 4. Check working tree status

Run: `git status --short`

| Status | Action |
|---|---|
| **Clean** (no output) | Go to step 6 (create branch) |
| **Committed / pushed / stashed** (no local diff, branch ahead OK) | Go to step 6 |
| **Dirty** (unstaged or staged changes present) | Go to step 5 |

### 5. Dirty-tree handler (BRANCH_DIRTY)

5a. Build report:
```text
BRANCH_DIRTY
Current branch: <branch>
Uncommitted changes:
<git status --short output>

Please stash, commit, or discard these changes before continuing.
```

5b. Set manifest (PM will write):
```yaml
git:
  branch_guard_status: awaiting_user_action
```

5c. Return `BRANCH_DIRTY` report to PM. **Stop.** PM stops and asks user to resolve, then re-calls branch-guard after user confirms.

5d. On re-entry (status was `awaiting_user_action`):
- Run `git status --short` again.
- Still dirty → return `BRANCH_DIRTY` again (do not proceed).
- Clean → continue to step 6.

### 6. Create feature branch

6a. **Infer REQ type** (read `raw.md` and `analysis.md`; use heuristics below):

| Signal in raw/analysis | Branch prefix |
|---|---|
| bug / lỗi / issue / hotfix / fix / sự cố | `fix/` |
| refactor / tái cấu trúc / clean up | `refactor/` |
| improve / cải thiện / tối ưu / optimize / enhancement | `imp/` |
| library / thư viện / vendor / chore / update dependency / upgrade package | `vendor/` |
| feature / tính năng / thêm mới / new / build / implement (default) | `feat/` |

If type is ambiguous after reading both files, **ask user one question**:
```
Prefix nhánh cho REQ này là gì? (feat / fix / refactor / imp / vendor)
```
Wait for answer; do not proceed until answered.

6b. Build branch name:
```
<prefix>/<manifest.id>-<manifest.slug>
Examples:
  feat/REQ-000003-user-auth
  fix/REQ-000007-login-500-error
  refactor/REQ-000010-payment-service
```

6c. Execute:
```bash
git fetch origin
git checkout origin/main
git checkout -b <branch-name>
```

6d. Report to PM:
```text
BRANCH_READY
Branch created: <branch-name>
```

PM writes to manifest:
```yaml
git:
  working_branch: <branch-name>
  branch_guard_status: done
```

---

## Phase B — Commit-per-Task

Called by PM immediately after reviewer reports PASSED for `TASK-NNN`.

### Input (from PM)

```text
- Package path
- TASK-NNN identifier
- Task title (from tasks.md)
- Expected File Scope (from tasks.md)
```

### Steps

1. **Stage scoped files only**

Read `tasks.md` → `TASK-NNN.expected_file_scope`.  
Run `git add` on those paths:
```bash
git add <file1> <file2> ...
```
> If `expected_file_scope` is empty or `*`, run `git add -A` as fallback (document in commit body).

2. **Check staged diff**

Run `git diff --cached --stat`.  
If nothing staged → report `COMMIT_NOTHING_STAGED` to PM; PM asks user if this is expected.

3. **Build commit message** (Conventional Commits format):

```
<type>(<REQ-ID>): <TASK-NNN> - <task title>

Refs: <requirement IDs from task>
Evidence: docs/tasks/<PACKAGE>/reviews/<TASK-NNN>-implementation.md
```

Type mapping (same as branch prefix, without `/`):
- `feat`, `fix`, `refactor`, `imp` (custom), `vendor`

Example:
```
feat(REQ-000003): TASK-001 - Implement login endpoint

Refs: FR-001, FR-002
Evidence: docs/tasks/REQ-000003-user-auth/reviews/TASK-001-implementation.md
```

4. **Commit**:
```bash
git commit -m "<message>"
```

5. **Do NOT push.**

6. **Report to PM**:
```text
COMMIT_DONE
Task: TASK-NNN
Commit: <short hash>
Branch: <working_branch>
Files: <list of staged files>
```

PM writes to manifest:
```yaml
git:
  commits:
    TASK-NNN: <short commit hash>
```

---

## Failure states

```text
BRANCH_DIRTY             → dirty working tree; awaiting user action
BRANCH_GUARD_SKIPPED     → manifest.git.branch_guard_status == done; branch already set
BRANCH_OK                → already on a non-protected branch; no new branch created
BRANCH_READY             → new feature branch created and checked out
COMMIT_DONE              → task code committed successfully
COMMIT_NOTHING_STAGED    → no staged changes found; PM asks user
BRANCH_TYPE_AMBIGUOUS    → asked user for prefix; waiting for answer
```

---

## Hard gates

- **Never** push (`git push`).
- **Never** merge branches.
- **Never** modify `manifest.yaml` directly — always return report; PM writes manifest.
- **Never** skip Phase A if `branch_guard_status != done`.
- **Never** commit code from multiple tasks in one commit.

---

## Output contract

Return a structured report to `project-manager`:
```text
STATUS: <BRANCH_DIRTY | BRANCH_OK | BRANCH_READY | COMMIT_DONE | COMMIT_NOTHING_STAGED>
Details: <…>
```

Do not invoke `develop`, `review`, `qa`, or any other skill.
