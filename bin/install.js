#!/usr/bin/env node

/**
 * 3A-Factory
 * Cross-platform Node.js script.
 */

const fs = require('fs');
const path = require('path');

// CLI Arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force') || process.env.npm_config_force === 'true';
const isNoBackup = args.includes('--no-backup');
const isVerbose = args.includes('--verbose');

// Target and Template directories
const targetRoot = process.env.INIT_CWD || process.cwd();
const templateRoot = path.resolve(__dirname, '..');

// ANSI Terminal Colors
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function logInfo(msg) { console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`); }
logInfo.toString(); // avoid linting unused warning if not used elsewhere
function logOk(msg) { console.log(`${colors.green}[OK]${colors.reset} ${msg}`); }
function logWarn(msg) { console.warn(`${colors.yellow}[WARN]${colors.reset} ${msg}`); }
function logErr(msg) { console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`); }

const targetDirs = [
  '.ai/requirements',
  '.ai/specs',
  '.ai/plans',
  '.ai/decisions',
  '.ai/reviews',
  '.ai/runs',
  '.ai/templates',
  '.agents/skills/init-ai-workflow',
  '.agents/skills/grill-me',
  '.agents/skills/spec',
  '.agents/skills/plan',
  '.agents/skills/code',
  '.agents/skills/review',
  '.agents/skills/project-overview',
  '.agents/skills/adr',
  '.claude/skills/init-ai-workflow',
  '.claude/skills/grill-me',
  '.claude/skills/spec',
  '.claude/skills/plan',
  '.claude/skills/code',
  '.claude/skills/review',
  '.claude/skills/project-overview',
  '.claude/skills/adr',
  '.claude/commands',
  '.gemini/commands',
  '.gemini/prompts',
  '.cursor/rules',
  '.cursor/prompts',
  'docs'
];

const requiredFiles = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
  { src: 'GEMINI.md', dest: 'GEMINI.md' },
  { src: 'templates/docs/AI_WORKFLOW.md', dest: 'docs/AI_WORKFLOW.md' },
  { src: 'templates/.ai/templates/SPEC-template.md', dest: '.ai/templates/SPEC-template.md' },
  { src: 'templates/.ai/templates/PLAN-template.md', dest: '.ai/templates/PLAN-template.md' },
  { src: 'templates/.ai/templates/ADR-template.md', dest: '.ai/templates/ADR-template.md' },
  { src: 'templates/.claude/commands/grill-me.md', dest: '.claude/commands/grill-me.md' },
  { src: 'templates/.claude/commands/spec.md', dest: '.claude/commands/spec.md' },
  { src: 'templates/.claude/commands/plan.md', dest: '.claude/commands/plan.md' },
  { src: 'templates/.claude/commands/code.md', dest: '.claude/commands/code.md' },
  { src: 'templates/.claude/commands/review.md', dest: '.claude/commands/review.md' },
  { src: 'templates/.claude/commands/init-ai-workflow.md', dest: '.claude/commands/init-ai-workflow.md' },
  { src: 'templates/.claude/commands/adr.md', dest: '.claude/commands/adr.md' },
  { src: 'templates/.gemini/commands/grill-me.toml', dest: '.gemini/commands/grill-me.toml' },
  { src: 'templates/.gemini/commands/spec.toml', dest: '.gemini/commands/spec.toml' },
  { src: 'templates/.gemini/commands/plan.toml', dest: '.gemini/commands/plan.toml' },
  { src: 'templates/.gemini/commands/code.toml', dest: '.gemini/commands/code.toml' },
  { src: 'templates/.gemini/commands/review.toml', dest: '.gemini/commands/review.toml' },
  { src: 'templates/.gemini/commands/init-ai-workflow.toml', dest: '.gemini/commands/init-ai-workflow.toml' },
  { src: 'templates/.gemini/commands/project-overview.toml', dest: '.gemini/commands/project-overview.toml' },
  { src: 'templates/.gemini/commands/adr.toml', dest: '.gemini/commands/adr.toml' },
  { src: 'templates/.cursor/rules/alex-workflow.mdc', dest: '.cursor/rules/alex-workflow.mdc' },
  { src: 'templates/.cursor/prompts/grill-me.md', dest: '.cursor/prompts/grill-me.md' },
  { src: 'templates/.cursor/prompts/spec.md', dest: '.cursor/prompts/spec.md' },
  { src: 'templates/.cursor/prompts/plan.md', dest: '.cursor/prompts/plan.md' },
  { src: 'templates/.cursor/prompts/code.md', dest: '.cursor/prompts/code.md' },
  { src: 'templates/.cursor/prompts/review.md', dest: '.cursor/prompts/review.md' },
  { src: 'templates/.cursor/prompts/init-ai-workflow.md', dest: '.cursor/prompts/init-ai-workflow.md' },
  { src: 'templates/.cursor/prompts/project-overview.md', dest: '.cursor/prompts/project-overview.md' },
  { src: 'templates/.cursor/prompts/adr.md', dest: '.cursor/prompts/adr.md' },
  { src: 'templates/.agents/skills/init-ai-workflow/SKILL.md', dest: '.agents/skills/init-ai-workflow/SKILL.md' },
  { src: 'templates/.agents/skills/grill-me/SKILL.md', dest: '.agents/skills/grill-me/SKILL.md' },
  { src: 'templates/.agents/skills/spec/SKILL.md', dest: '.agents/skills/spec/SKILL.md' },
  { src: 'templates/.agents/skills/plan/SKILL.md', dest: '.agents/skills/plan/SKILL.md' },
  { src: 'templates/.agents/skills/code/SKILL.md', dest: '.agents/skills/code/SKILL.md' },
  { src: 'templates/.agents/skills/review/SKILL.md', dest: '.agents/skills/review/SKILL.md' },
  { src: 'templates/.agents/skills/project-overview/SKILL.md', dest: '.agents/skills/project-overview/SKILL.md' },
  { src: 'templates/.agents/skills/adr/SKILL.md', dest: '.agents/skills/adr/SKILL.md' },
  { src: 'templates/.claude/skills/init-ai-workflow/SKILL.md', dest: '.claude/skills/init-ai-workflow/SKILL.md' },
  { src: 'templates/.claude/skills/grill-me/SKILL.md', dest: '.claude/skills/grill-me/SKILL.md' },
  { src: 'templates/.claude/skills/spec/SKILL.md', dest: '.claude/skills/spec/SKILL.md' },
  { src: 'templates/.claude/skills/plan/SKILL.md', dest: '.claude/skills/plan/SKILL.md' },
  { src: 'templates/.claude/skills/code/SKILL.md', dest: '.claude/skills/code/SKILL.md' },
  { src: 'templates/.claude/skills/review/SKILL.md', dest: '.claude/skills/review/SKILL.md' },
  { src: 'templates/.claude/skills/project-overview/SKILL.md', dest: '.claude/skills/project-overview/SKILL.md' },
  { src: 'templates/.claude/skills/adr/SKILL.md', dest: '.claude/skills/adr/SKILL.md' }
];

const optionalFiles = [
  { src: '.cursorrules', dest: '.cursorrules' },
  { src: 'templates/.gemini/prompts/grill-me.md', dest: '.gemini/prompts/grill-me.md' },
  { src: 'templates/.gemini/prompts/spec.md', dest: '.gemini/prompts/spec.md' },
  { src: 'templates/.gemini/prompts/plan.md', dest: '.gemini/prompts/plan.md' },
  { src: 'templates/.gemini/prompts/code.md', dest: '.gemini/prompts/code.md' },
  { src: 'templates/.gemini/prompts/review.md', dest: '.gemini/prompts/review.md' },
  { src: 'templates/.gemini/prompts/init-ai-workflow.md', dest: '.gemini/prompts/init-ai-workflow.md' },
  { src: 'templates/.gemini/prompts/adr.md', dest: '.gemini/prompts/adr.md' }
];

const stats = {
  createdDirs: 0,
  newFiles: 0,
  updatedFiles: 0,
  backups: 0,
  unchanged: 0,
  skipped: 0
};

function sameFileContent(src, dest) {
  if (!fs.existsSync(dest)) return false;
  try {
    const srcBuf = fs.readFileSync(src);
    const destBuf = fs.readFileSync(dest);
    return srcBuf.equals(destBuf);
  } catch (err) {
    return false;
  }
}

function ensureDirectory(relativeDir) {
  const fullPath = path.join(targetRoot, relativeDir);
  if (!fs.existsSync(fullPath)) {
    if (isDryRun) {
      console.log(`[DRY-RUN][MKDIR] ${relativeDir}`);
    } else {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    stats.createdDirs++;
  }
}

function copyWorkflowFile(item, required) {
  const srcFile = path.join(templateRoot, item.src);
  const destFile = path.join(targetRoot, item.dest);

  if (!fs.existsSync(srcFile)) {
    if (required) {
      throw new Error(`Required template file not found: ${srcFile}`);
    }
    stats.skipped++;
    if (isVerbose) {
      console.log(`${colors.gray}[SKIP][OPTIONAL MISSING] ${item.src}${colors.reset}`);
    }
    return;
  }

  const destDir = path.dirname(destFile);
  if (!fs.existsSync(destDir)) {
    if (isDryRun) {
      console.log(`[DRY-RUN][MKDIR] ${path.relative(targetRoot, destDir)}`);
    } else {
      fs.mkdirSync(destDir, { recursive: true });
    }
    stats.createdDirs++;
  }

  if (fs.existsSync(destFile)) {
    if (sameFileContent(srcFile, destFile)) {
      stats.unchanged++;
      if (isVerbose) {
        console.log(`${colors.gray}[UNCHANGED] ${item.dest}${colors.reset}`);
      }
      return;
    }

    if (!isForce) {
      stats.skipped++;
      logWarn(`Exists, skipped: ${item.dest} (use --force to overwrite)`);
      return;
    }

    if (!isNoBackup) {
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const backupFile = `${destFile}.bak.${timestamp}`;
      if (isDryRun) {
        console.log(`[DRY-RUN][BACKUP] ${item.dest} -> ${path.basename(backupFile)}`);
      } else {
        fs.copyFileSync(destFile, backupFile);
      }
      stats.backups++;
    }

    if (isDryRun) {
      console.log(`[DRY-RUN][UPDATE] ${item.dest}`);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
    stats.updatedFiles++;
  } else {
    if (isDryRun) {
      console.log(`[DRY-RUN][NEW] ${item.dest}`);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
    stats.newFiles++;
  }
}

console.log(`${colors.cyan}=============================================${colors.reset}`);
console.log(`${colors.cyan}  3A-Factory NPM Installer${colors.reset}`);
console.log(`${colors.cyan}=============================================${colors.reset}`);
console.log(`Template root: ${templateRoot}`);
console.log(`Target root:   ${targetRoot}`);
console.log(`Mode:          ${isDryRun ? 'dry-run' : 'write'}`);
console.log(`Overwrite:     ${isForce ? 'yes' : 'no'}`);
console.log(`Backup:        ${isNoBackup ? 'no' : 'yes'}`);
console.log(`${colors.cyan}---------------------------------------------${colors.reset}`);

try {
  // Create Target Directories
  targetDirs.forEach(dir => ensureDirectory(dir));

  // Copy Required Files
  requiredFiles.forEach(item => copyWorkflowFile(item, true));

  // Copy Optional Files
  optionalFiles.forEach(item => copyWorkflowFile(item, false));

  console.log(`${colors.cyan}---------------------------------------------${colors.reset}`);
  logOk('Installation completed.');
  console.log(`Created dirs: ${stats.createdDirs}`);
  console.log(`New files:    ${stats.newFiles}`);
  console.log(`Updated:      ${stats.updatedFiles}`);
  console.log(`Backups:      ${stats.backups}`);
  console.log(`Unchanged:    ${stats.unchanged}`);
  console.log(`Skipped:      ${stats.skipped}`);
  console.log(`${colors.cyan}=============================================${colors.reset}`);
  console.log(`Claude Code: use /grill-me, /spec, /plan, /code, /review, or native skills under .claude/skills.`);
  console.log(`Gemini CLI:   use custom commands from .gemini/commands/*.toml.`);
  console.log(`Cursor:       project rules are installed under .cursor/rules/alex-workflow.mdc.`);
  console.log(`Generic:      AGENTS.md + .agents/skills are installed as the portable source of truth.`);
  console.log(`${colors.cyan}=============================================${colors.reset}`);
} catch (err) {
  logErr(`Installation failed: ${err.message}`);
  process.exit(1);
}
