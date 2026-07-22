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

// Avoid polluting the template developer's repository root during local package install or run.
if (path.resolve(targetRoot) === path.resolve(templateRoot)) {
  console.log('\x1b[32m%s\x1b[0m', '[OK] Running in development repository. Skipping template installation to avoid root pollution.');
  process.exit(0);
}

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
  'docs/requirements',
  'docs/designs',
  'docs/reviews',
  'docs/qa',
  'docs/release-notes',
  '.agents/templates',
  '.agents/compact',
  '.agents/issues',
  '.claude/commands',
  '.gemini/commands',
  '.gemini/prompts',
  '.cursor/rules'
];

const requiredFiles = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
  { src: 'GEMINI.md', dest: 'GEMINI.md' },
  { src: 'templates/WORKFLOW.md', dest: 'WORKFLOW.md' },
  { src: 'templates/.agents/templates/SPEC-template.md', dest: '.agents/templates/SPEC-template.md' },
  { src: 'templates/.agents/templates/PLAN-template.md', dest: '.agents/templates/PLAN-template.md' },
  { src: 'templates/.agents/templates/ADR-template.md', dest: '.agents/templates/ADR-template.md' },
  { src: 'templates/.agents/templates/RAW-REQ-template.md', dest: '.agents/templates/RAW-REQ-template.md' },
  { src: 'templates/.agents/templates/DISCOVERY-template.md', dest: '.agents/templates/DISCOVERY-template.md' },
  { src: 'templates/.agents/templates/ANALYSIS-template.md', dest: '.agents/templates/ANALYSIS-template.md' },
  { src: 'templates/.agents/templates/DESIGN-template.md', dest: '.agents/templates/DESIGN-template.md' },
  { src: 'templates/.agents/templates/REVIEW-template.md', dest: '.agents/templates/REVIEW-template.md' },
  { src: 'templates/.agents/templates/QA-REPORT-template.md', dest: '.agents/templates/QA-REPORT-template.md' },
  { src: 'templates/.agents/templates/RELEASE-template.md', dest: '.agents/templates/RELEASE-template.md' },
  { src: 'templates/.cursor/rules/ai-workflow.mdc', dest: '.cursor/rules/ai-workflow.mdc' }
];

const optionalFiles = [
  { src: '.cursorrules', dest: '.cursorrules' }
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

function sameStringContent(destPath, content) {
  if (!fs.existsSync(destPath)) return false;
  try {
    const destContent = fs.readFileSync(destPath, 'utf8');
    return destContent.replace(/\r\n/g, '\n') === content.replace(/\r\n/g, '\n');
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

function writeGeneratedFile(destRelativePath, content) {
  const destFile = path.join(targetRoot, destRelativePath);
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
    if (sameStringContent(destFile, content)) {
      stats.unchanged++;
      if (isVerbose) {
        console.log(`${colors.gray}[UNCHANGED] ${destRelativePath}${colors.reset}`);
      }
      return;
    }

    if (!isForce) {
      stats.skipped++;
      logWarn(`Exists, skipped: ${destRelativePath} (use --force to overwrite)`);
      return;
    }

    if (!isNoBackup) {
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const backupFile = `${destFile}.bak.${timestamp}`;
      if (isDryRun) {
        console.log(`[DRY-RUN][BACKUP] ${destRelativePath} -> ${path.basename(backupFile)}`);
      } else {
        fs.writeFileSync(backupFile, fs.readFileSync(destFile, 'utf8'), 'utf8');
      }
      stats.backups++;
    }

    if (isDryRun) {
      console.log(`[DRY-RUN][UPDATE] ${destRelativePath}`);
    } else {
      fs.writeFileSync(destFile, content, 'utf8');
    }
    stats.updatedFiles++;
  } else {
    if (isDryRun) {
      console.log(`[DRY-RUN][NEW] ${destRelativePath}`);
    } else {
      fs.writeFileSync(destFile, content, 'utf8');
    }
    stats.newFiles++;
  }
}

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDirectory(filePath, fileList);
    } else if (stat.isFile() && file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function parseMarkdownWithFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const normalized = content.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    throw new Error(`File does not start with frontmatter: ${filePath}`);
  }
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) {
    throw new Error(`Invalid frontmatter in file: ${filePath}`);
  }
  const frontmatterText = normalized.substring(4, endIdx);
  const body = normalized.substring(endIdx + 5);

  const lines = frontmatterText.split('\n');
  const metadata = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.substring(0, colonIdx).trim();
    let val = line.substring(colonIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    metadata[key] = val;
  }

  if (!metadata.name) {
    metadata.name = path.basename(filePath, '.md');
  }
  if (!metadata.description) {
    metadata.description = '';
  }

  return { metadata, body };
}

function processSkills() {
  const skillsDir = path.join(templateRoot, 'templates', 'skills');
  if (!fs.existsSync(skillsDir)) {
    logWarn(`Source skills directory not found: ${skillsDir}`);
    return;
  }

  const skillFiles = scanDirectory(skillsDir);
  for (const file of skillFiles) {
    try {
      const { metadata, body } = parseMarkdownWithFrontmatter(file);
      const name = metadata.name;
      const desc = metadata.description;

      if (isVerbose) {
        logInfo(`Processing skill: ${name}`);
      }

      // 1. Generic Agent Skill: .agents/skills/[name]/SKILL.md
      let genericFM = `---\nname: ${name}\ndescription: ${desc}\n`;
      if (metadata['disable-model-invocation'] !== undefined) {
        genericFM += `disable-model-invocation: ${metadata['disable-model-invocation']}\n`;
      }
      if (metadata['argument-hint'] !== undefined) {
        genericFM += `argument-hint: ${metadata['argument-hint']}\n`;
      }
      genericFM += `---\n`;
      writeGeneratedFile(`.agents/skills/${name}/SKILL.md`, `${genericFM}${body}`);

      // 2. Claude Agent Skill: .claude/skills/[name]/SKILL.md
      writeGeneratedFile(`.claude/skills/${name}/SKILL.md`, `${genericFM}${body}`);

      // 3. Cursor Rule: .cursor/rules/[name].mdc
      let cursorFM = `---\ndescription: ${desc}\nglobs: *\n`;
      if (metadata.alwaysApply !== undefined) {
        cursorFM += `alwaysApply: ${metadata.alwaysApply}\n`;
      } else {
        cursorFM += `alwaysApply: false\n`;
      }
      cursorFM += `---\n`;
      writeGeneratedFile(`.cursor/rules/${name}.mdc`, `${cursorFM}${body}`);

      // 4. Claude Command: .claude/commands/[name].md
      const claudeCmd = `---\ndescription: ${desc}\n---\n\nRead and execute .claude/skills/${name}/SKILL.md. Arguments: $ARGUMENTS\n`;
      writeGeneratedFile(`.claude/commands/${name}.md`, claudeCmd);

      // 5. Gemini Command: .gemini/commands/[name].toml
      const geminiCmd = `description = "${desc.replace(/"/g, '\\"')}"\nprompt = """\nRead AGENTS.md first, then read .agents/skills/${name}/SKILL.md and execute that workflow.\nArguments: {{args}}\n"""\n`;
      writeGeneratedFile(`.gemini/commands/${name}.toml`, geminiCmd);

    } catch (err) {
      logWarn(`Failed to parse or convert skill file ${file}: ${err.message}`);
    }
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

  // Process and Generate Skills dynamically
  processSkills();

  console.log(`${colors.cyan}---------------------------------------------${colors.reset}`);
  logOk('Installation completed.');
  console.log(`Created dirs: ${stats.createdDirs}`);
  console.log(`New files:    ${stats.newFiles}`);
  console.log(`Updated:      ${stats.updatedFiles}`);
  console.log(`Backups:      ${stats.backups}`);
  console.log(`Unchanged:    ${stats.unchanged}`);
  console.log(`Skipped:      ${stats.skipped}`);
  console.log(`${colors.cyan}=============================================${colors.reset}`);
  console.log(`Claude Code: use /project-manager, /grill-me, /triage, /analyze, /design, /spec, /plan, /develop, /review, /qa, /deploy, …`);
  console.log(`Gemini CLI:   use custom commands from .gemini/commands/*.toml.`);
  console.log(`Cursor:       project rules under .cursor/rules/ (incl. ai-workflow.mdc).`);
  console.log(`Artifacts:    docs/{requirements,designs,reviews,qa,release-notes}`);
  console.log(`Source of truth sync: AGENTS.md + .agents/skills (Claude/Gemini/Cursor).`);
  console.log(`${colors.cyan}=============================================${colors.reset}`);
} catch (err) {
  logErr(`Installation failed: ${err.message}`);
  process.exit(1);
}

