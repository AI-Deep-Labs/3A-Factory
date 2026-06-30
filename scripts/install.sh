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

REQUIRED_FILES=(
  "AGENTS.md:AGENTS.md"
  "CLAUDE.md:CLAUDE.md"
  "GEMINI.md:GEMINI.md"
  "templates/WORKFLOW.md:WORKFLOW.md"
  "templates/.agents/templates/SPEC-template.md:.agents/templates/SPEC-template.md"
  "templates/.agents/templates/PLAN-template.md:.agents/templates/PLAN-template.md"
  "templates/.agents/templates/ADR-template.md:.agents/templates/ADR-template.md"
  "templates/.cursor/rules/ai-workflow.mdc:.cursor/rules/ai-workflow.mdc"
)

OPTIONAL_FILES=(
  ".cursorrules:.cursorrules"
)

TARGET_DIRS=(
  ".agents/requirements"
  ".agents/specs"
  ".agents/plans"
  ".agents/decisions"
  ".agents/reviews"
  ".agents/runs"
  ".agents/templates"
  ".agents/compact"
  ".agents/issues"
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

same_string_content() {
  local dest="$1"
  local content="$2"
  if [[ ! -f "$dest" ]]; then
    return 1
  fi
  local dest_content clean_content
  dest_content=$(tr -d '\r' < "$dest")
  clean_content=$(printf '%s' "$content" | tr -d '\r')
  if [[ "$dest_content" == "$clean_content" ]]; then
    return 0
  else
    return 1
  fi
}

write_generated_file() {
  local dest_rel="$1"
  local file_content="$2"
  local dest_file="$TARGET_ROOT/$dest_rel"
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
    if same_string_content "$dest_file" "$file_content"; then
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
      printf '%s' "$file_content" > "$dest_file"
    fi
    updated_files=$((updated_files + 1))
  else
    if [[ $DRY_RUN -eq 1 ]]; then
      log "[DRY-RUN][NEW] $dest_rel"
    else
      printf '%s' "$file_content" > "$dest_file"
    fi
    new_files=$((new_files + 1))
  fi
}

process_skills() {
  local skills_dir="$TEMPLATES_DIR/skills"
  if [[ ! -d "$skills_dir" ]]; then
    warn "Source skills directory not found: $skills_dir"
    return
  fi

  local file
  while IFS= read -r -d '' file; do
    [[ -f "$file" ]] || continue

    if ! head -n 1 "$file" | grep -q '^---$'; then
      warn "File does not start with frontmatter: $file"
      continue
    fi

    local name
    name=$(awk '/^name:/ {print $2; exit}' "$file")
    if [[ -z "$name" ]]; then
      name=$(basename "$file" .md)
    fi

    local description
    description=$(awk -F': ' '/^description:/ {print $2; exit}' "$file")
    description="${description%\"}"
    description="${description#\"}"
    description="${description%\'}"
    description="${description#\'}"

    local disable_model_invocation
    disable_model_invocation=$(awk '/^disable-model-invocation:/ {print $2; exit}' "$file")

    local argument_hint
    argument_hint=$(awk -F': ' '/^argument-hint:/ {print $2; exit}' "$file")
    argument_hint="${argument_hint%\"}"
    argument_hint="${argument_hint#\"}"

    local always_apply
    always_apply=$(awk '/^alwaysApply:/ {print $2; exit}' "$file")
    if [[ -z "$always_apply" ]]; then
      always_apply="false"
    fi

    local body
    body=$(awk '
      BEGIN { fm_count = 0 }
      /^---$/ {
        fm_count++
        next
      }
      fm_count >= 2 {
        print $0
      }
    ' "$file")

    if [[ $VERBOSE -eq 1 ]]; then
      info "Processing skill: $name"
    fi

    # 1. Generic Agent Skill
    local generic_fm
    generic_fm="---
name: $name
description: $description
"
    if [[ -n "$disable_model_invocation" ]]; then
      generic_fm="${generic_fm}disable-model-invocation: $disable_model_invocation
"
    fi
    if [[ -n "$argument_hint" ]]; then
      generic_fm="${generic_fm}argument-hint: $argument_hint
"
    fi
    generic_fm="${generic_fm}---
"
    write_generated_file ".agents/skills/$name/SKILL.md" "${generic_fm}${body}"

    # 2. Claude Agent Skill
    write_generated_file ".claude/skills/$name/SKILL.md" "${generic_fm}${body}"

    # 3. Cursor Rule
    local cursor_fm
    cursor_fm="---
description: $description
globs: *
alwaysApply: $always_apply
---
"
    write_generated_file ".cursor/rules/${name}.mdc" "${cursor_fm}${body}"

    # 4. Claude Command
    local claude_cmd
    claude_cmd="---
description: $description
---

Read and execute .claude/skills/$name/SKILL.md. Arguments: \$ARGUMENTS
"
    write_generated_file ".claude/commands/${name}.md" "$claude_cmd"

    # 5. Gemini Command
    local escaped_desc
    escaped_desc="${description//\"/\\\"}"
    local gemini_cmd
    gemini_cmd="description = \"$escaped_desc\"
prompt = \"\"\"
Read AGENTS.md first, then read .agents/skills/$name/SKILL.md and execute that workflow.
Arguments: {{args}}
\"\"\"
"
    write_generated_file ".gemini/commands/${name}.toml" "$gemini_cmd"

  done < <(find "$skills_dir" -type f -name "*.md" -print0)
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

process_skills

print_footer
