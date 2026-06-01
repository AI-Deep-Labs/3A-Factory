#!/usr/bin/env bash

# 3A Factory Installer
# For macOS, Linux, WSL, and Git Bash
# Installs portable + native agent workflow files for Claude, Gemini, Cursor, and generic agents.

set -Eeuo pipefail
IFS=$'\n\t'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_ROOT="$(dirname "$SCRIPT_DIR")"
TARGET_ROOT="$(pwd)"
FORCE=0
DRY_RUN=0
NO_BACKUP=0
VERBOSE=0

usage() {
  cat <<USAGE
3A-Factory Installer

Usage:
  ./install.sh [options]

Options:
  --target <path>         Project directory to install into. Default: current directory.
  --template-root <path>  Directory containing AGENTS.md and templates/. Default: installer directory.
  --force                 Overwrite existing files. Existing files are backed up unless --no-backup is used.
  --no-backup             Do not create .bak timestamp files when overwriting.
  --dry-run               Print actions without writing files.
  --verbose               Print skipped optional files and identical files.
  -h, --help              Show this help.

Examples:
  ./install.sh
  ./install.sh --target /path/to/project
  ./install.sh --force --target .
USAGE
}

log() { printf '%s\n' "$*"; }
info() { log "[INFO] $*"; }
success() { log "[OK] $*"; }
warn() { log "[WARN] $*"; }
err() { log "[ERROR] $*" >&2; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      [[ $# -ge 2 ]] || { err "Missing value for --target"; exit 2; }
      TARGET_ROOT="$2"; shift 2 ;;
    --template-root)
      [[ $# -ge 2 ]] || { err "Missing value for --template-root"; exit 2; }
      TEMPLATE_ROOT="$2"; shift 2 ;;
    --force) FORCE=1; shift ;;
    --no-backup) NO_BACKUP=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --verbose) VERBOSE=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) err "Unknown option: $1"; usage; exit 2 ;;
  esac
done

TEMPLATE_ROOT="$(cd "$TEMPLATE_ROOT" && pwd)"
TARGET_ROOT="$(mkdir -p "$TARGET_ROOT" && cd "$TARGET_ROOT" && pwd)"

# Avoid polluting the template developer's repository root during local package install or run.
if [[ "$TARGET_ROOT" == "$TEMPLATE_ROOT" ]]; then
  success "Running in development repository. Skipping template installation to avoid root pollution."
  exit 0
fi

TEMPLATES_DIR="$TEMPLATE_ROOT/templates"

if [[ ! -d "$TEMPLATES_DIR" ]]; then
  err "Template directory not found: $TEMPLATES_DIR"
  err "Expected v2 layout: <template-root>/AGENTS.md and <template-root>/templates/..."
  exit 1
fi

# Required source files for v2. If any of these are missing, the installer should stop.
REQUIRED_FILES=(
  "AGENTS.md:AGENTS.md"
  "CLAUDE.md:CLAUDE.md"
  "GEMINI.md:GEMINI.md"
  "templates/WORKFLOW.md:WORKFLOW.md"
  "templates/.agents/templates/SPEC-template.md:.agents/templates/SPEC-template.md"
  "templates/.agents/templates/PLAN-template.md:.agents/templates/PLAN-template.md"
  "templates/.agents/templates/ADR-template.md:.agents/templates/ADR-template.md"
  "templates/.claude/commands/grill-me.md:.claude/commands/grill-me.md"
  "templates/.claude/commands/spec.md:.claude/commands/spec.md"
  "templates/.claude/commands/plan.md:.claude/commands/plan.md"
  "templates/.claude/commands/code.md:.claude/commands/code.md"
  "templates/.claude/commands/review.md:.claude/commands/review.md"
  "templates/.claude/commands/init-ai-workflow.md:.claude/commands/init-ai-workflow.md"
  "templates/.claude/commands/adr.md:.claude/commands/adr.md"
  "templates/.claude/commands/caveman.md:.claude/commands/caveman.md"
  "templates/.claude/commands/handoff.md:.claude/commands/handoff.md"
  "templates/.claude/commands/qa.md:.claude/commands/qa.md"
  "templates/.claude/commands/synthesize-design-doc.md:.claude/commands/synthesize-design-doc.md"
  "templates/.gemini/commands/grill-me.toml:.gemini/commands/grill-me.toml"
  "templates/.gemini/commands/spec.toml:.gemini/commands/spec.toml"
  "templates/.gemini/commands/plan.toml:.gemini/commands/plan.toml"
  "templates/.gemini/commands/code.toml:.gemini/commands/code.toml"
  "templates/.gemini/commands/review.toml:.gemini/commands/review.toml"
  "templates/.gemini/commands/init-ai-workflow.toml:.gemini/commands/init-ai-workflow.toml"
  "templates/.gemini/commands/project-overview.toml:.gemini/commands/project-overview.toml"
  "templates/.gemini/commands/adr.toml:.gemini/commands/adr.toml"
  "templates/.gemini/commands/caveman.toml:.gemini/commands/caveman.toml"
  "templates/.gemini/commands/handoff.toml:.gemini/commands/handoff.toml"
  "templates/.gemini/commands/qa.toml:.gemini/commands/qa.toml"
  "templates/.gemini/commands/synthesize-design-doc.toml:.gemini/commands/synthesize-design-doc.toml"
  "templates/.cursor/rules/ai-workflow.mdc:.cursor/rules/ai-workflow.mdc"
  "templates/.cursor/rules/init-ai-workflow.mdc:.cursor/rules/init-ai-workflow.mdc"
  "templates/.cursor/rules/project-overview.mdc:.cursor/rules/project-overview.mdc"
  "templates/.cursor/rules/grill-me.mdc:.cursor/rules/grill-me.mdc"
  "templates/.cursor/rules/spec.mdc:.cursor/rules/spec.mdc"
  "templates/.cursor/rules/plan.mdc:.cursor/rules/plan.mdc"
  "templates/.cursor/rules/code.mdc:.cursor/rules/code.mdc"
  "templates/.cursor/rules/review.mdc:.cursor/rules/review.mdc"
  "templates/.cursor/rules/adr.mdc:.cursor/rules/adr.mdc"
  "templates/.cursor/rules/caveman.mdc:.cursor/rules/caveman.mdc"
  "templates/.cursor/rules/handoff.mdc:.cursor/rules/handoff.mdc"
  "templates/.cursor/rules/qa.mdc:.cursor/rules/qa.mdc"
  "templates/.cursor/rules/synthesize-design-doc.mdc:.cursor/rules/synthesize-design-doc.mdc"
  "templates/.agents/skills/init-ai-workflow/SKILL.md:.agents/skills/init-ai-workflow/SKILL.md"
  "templates/.agents/skills/grill-me/SKILL.md:.agents/skills/grill-me/SKILL.md"
  "templates/.agents/skills/spec/SKILL.md:.agents/skills/spec/SKILL.md"
  "templates/.agents/skills/plan/SKILL.md:.agents/skills/plan/SKILL.md"
  "templates/.agents/skills/code/SKILL.md:.agents/skills/code/SKILL.md"
  "templates/.agents/skills/review/SKILL.md:.agents/skills/review/SKILL.md"
  "templates/.agents/skills/project-overview/SKILL.md:.agents/skills/project-overview/SKILL.md"
  "templates/.agents/skills/adr/SKILL.md:.agents/skills/adr/SKILL.md"
  "templates/.agents/skills/caveman/SKILL.md:.agents/skills/caveman/SKILL.md"
  "templates/.agents/skills/handoff/SKILL.md:.agents/skills/handoff/SKILL.md"
  "templates/.agents/skills/qa/SKILL.md:.agents/skills/qa/SKILL.md"
  "templates/.agents/skills/synthesize-design-doc/SKILL.md:.agents/skills/synthesize-design-doc/SKILL.md"
  "templates/.claude/skills/init-ai-workflow/SKILL.md:.claude/skills/init-ai-workflow/SKILL.md"
  "templates/.claude/skills/grill-me/SKILL.md:.claude/skills/grill-me/SKILL.md"
  "templates/.claude/skills/spec/SKILL.md:.claude/skills/spec/SKILL.md"
  "templates/.claude/skills/plan/SKILL.md:.claude/skills/plan/SKILL.md"
  "templates/.claude/skills/code/SKILL.md:.claude/skills/code/SKILL.md"
  "templates/.claude/skills/review/SKILL.md:.claude/skills/review/SKILL.md"
  "templates/.claude/skills/project-overview/SKILL.md:.claude/skills/project-overview/SKILL.md"
  "templates/.claude/skills/adr/SKILL.md:.claude/skills/adr/SKILL.md"
  "templates/.claude/skills/caveman/SKILL.md:.claude/skills/caveman/SKILL.md"
  "templates/.claude/skills/handoff/SKILL.md:.claude/skills/handoff/SKILL.md"
  "templates/.claude/skills/qa/SKILL.md:.claude/skills/qa/SKILL.md"
  "templates/.claude/skills/synthesize-design-doc/SKILL.md:.claude/skills/synthesize-design-doc/SKILL.md"
)

# Optional legacy/fallback files. Missing files are skipped.
OPTIONAL_FILES=(
  ".cursorrules:.cursorrules"
  "templates/.gemini/prompts/grill-me.md:.gemini/prompts/grill-me.md"
  "templates/.gemini/prompts/spec.md:.gemini/prompts/spec.md"
  "templates/.gemini/prompts/plan.md:.gemini/prompts/plan.md"
  "templates/.gemini/prompts/code.md:.gemini/prompts/code.md"
  "templates/.gemini/prompts/review.md:.gemini/prompts/review.md"
  "templates/.gemini/prompts/init-ai-workflow.md:.gemini/prompts/init-ai-workflow.md"
  "templates/.gemini/prompts/adr.md:.gemini/prompts/adr.md"
)

TARGET_DIRS=(
  ".agents/requirements"
  ".agents/specs"
  ".agents/plans"
  ".agents/decisions"
  ".agents/reviews"
  ".agents/runs"
  ".agents/templates"
  ".agents/skills/init-ai-workflow"
  ".agents/skills/grill-me"
  ".agents/skills/spec"
  ".agents/skills/plan"
  ".agents/skills/code"
  ".agents/skills/review"
  ".agents/skills/project-overview"
  ".agents/compact"
  ".agents/issues"
  ".agents/skills/adr"
  ".agents/skills/caveman"
  ".agents/skills/handoff"
  ".agents/skills/qa"
  ".agents/skills/synthesize-design-doc"
  ".claude/skills/init-ai-workflow"
  ".claude/skills/grill-me"
  ".claude/skills/spec"
  ".claude/skills/plan"
  ".claude/skills/code"
  ".claude/skills/review"
  ".claude/skills/project-overview"
  ".claude/skills/adr"
  ".claude/skills/caveman"
  ".claude/skills/handoff"
  ".claude/skills/qa"
  ".claude/skills/synthesize-design-doc"
  ".claude/commands"
  ".gemini/commands"
  ".gemini/prompts"
  ".cursor/rules"
)

created_dirs=0
new_files=0
updated_files=0
backups=0
skipped_files=0
identical_files=0

run_mkdir() {
  local dir="$1"
  if [[ ! -d "$TARGET_ROOT/$dir" ]]; then
    if [[ $DRY_RUN -eq 1 ]]; then
      log "[DRY-RUN][MKDIR] $dir"
    else
      mkdir -p "$TARGET_ROOT/$dir"
    fi
    created_dirs=$((created_dirs + 1))
  fi
}

copy_one() {
  local src_rel="$1"
  local dest_rel="$2"
  local required="$3"
  local src_file="$TEMPLATE_ROOT/$src_rel"
  local dest_file="$TARGET_ROOT/$dest_rel"

  if [[ ! -f "$src_file" ]]; then
    if [[ "$required" == "required" ]]; then
      err "Required template file not found: $src_file"
      exit 1
    fi
    skipped_files=$((skipped_files + 1))
    [[ $VERBOSE -eq 1 ]] && log "[SKIP][OPTIONAL MISSING] $src_rel"
    return
  fi

  local dest_dir
  dest_dir="$(dirname "$dest_file")"
  if [[ ! -d "$dest_dir" ]]; then
    if [[ $DRY_RUN -eq 1 ]]; then
      log "[DRY-RUN][MKDIR] ${dest_dir#$TARGET_ROOT/}"
    else
      mkdir -p "$dest_dir"
    fi
    created_dirs=$((created_dirs + 1))
  fi

  if [[ -f "$dest_file" ]]; then
    if cmp -s "$src_file" "$dest_file"; then
      identical_files=$((identical_files + 1))
      [[ $VERBOSE -eq 1 ]] && log "[UNCHANGED] $dest_rel"
      return
    fi

    if [[ $FORCE -ne 1 ]]; then
      skipped_files=$((skipped_files + 1))
      warn "Exists, skipped: $dest_rel (use --force to overwrite)"
      return
    fi

    if [[ $NO_BACKUP -ne 1 ]]; then
      local timestamp backup_file
      timestamp="$(date +"%Y%m%d%H%M%S")"
      backup_file="$dest_file.bak.$timestamp"
      if [[ $DRY_RUN -eq 1 ]]; then
        log "[DRY-RUN][BACKUP] $dest_rel -> $(basename "$backup_file")"
      else
        cp -p "$dest_file" "$backup_file"
      fi
      backups=$((backups + 1))
    fi

    if [[ $DRY_RUN -eq 1 ]]; then
      log "[DRY-RUN][UPDATE] $dest_rel"
    else
      cp -p "$src_file" "$dest_file"
    fi
    updated_files=$((updated_files + 1))
  else
    if [[ $DRY_RUN -eq 1 ]]; then
      log "[DRY-RUN][NEW] $dest_rel"
    else
      cp -p "$src_file" "$dest_file"
    fi
    new_files=$((new_files + 1))
  fi
}

print_header() {
  log "============================================="
  log "  3A Factory Installer"
  log "============================================="
  log "Template root: $TEMPLATE_ROOT"
  log "Target root:   $TARGET_ROOT"
  log "Mode:          $([[ $DRY_RUN -eq 1 ]] && echo dry-run || echo write)"
  log "Overwrite:     $([[ $FORCE -eq 1 ]] && echo yes || echo no)"
  log "Backup:        $([[ $NO_BACKUP -eq 1 ]] && echo no || echo yes)"
  log "---------------------------------------------"
}

print_footer() {
  log "---------------------------------------------"
  success "Installation completed."
  log "Created dirs: $created_dirs"
  log "New files:    $new_files"
  log "Updated:      $updated_files"
  log "Backups:      $backups"
  log "Unchanged:    $identical_files"
  log "Skipped:      $skipped_files"
  log "============================================="
  log "Claude Code: use /grill-me, /spec, /plan, /code, /review, or native skills under .claude/skills."
  log "Gemini CLI:   use custom commands from .gemini/commands/*.toml."
  log "Cursor:       project rules are installed under .cursor/rules/ai-workflow.mdc."
  log "Generic:      AGENTS.md + .agents/skills are installed as the portable source of truth."
  log "============================================="
}

print_header

for dir in "${TARGET_DIRS[@]}"; do
  run_mkdir "$dir"
done

for item in "${REQUIRED_FILES[@]}"; do
  copy_one "${item%%:*}" "${item#*:}" "required"
done

for item in "${OPTIONAL_FILES[@]}"; do
  copy_one "${item%%:*}" "${item#*:}" "optional"
done

print_footer
