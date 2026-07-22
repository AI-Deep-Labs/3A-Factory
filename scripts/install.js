#!/usr/bin/env node

/**
 * 3A-Factory installer
 * Install shared workflow files + adapters for selected agent(s) only.
 *
 * Usage:
 *   npx 3a-factory --agent=claude
 *   npx 3a-factory --agent=gemini,cursor --force
 *   npx 3a-factory --claude --cursor
 *   npx 3a-factory --all
 *
 * Env (useful with npm postinstall):
 *   THREEA_AGENT=claude
 *   npm_config_3a_agent=gemini
 */

const fs = require('fs');
const path = require('path');

const VALID_AGENTS = ['claude', 'gemini', 'cursor'];

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force') || process.env.npm_config_force === 'true';
const isNoBackup = args.includes('--no-backup');
const isVerbose = args.includes('--verbose');

const selectedAgents = parseAgents(args);

const targetRoot = process.env.INIT_CWD || process.cwd();
const templateRoot = path.resolve(__dirname, '..');

if (path.resolve(targetRoot) === path.resolve(templateRoot)) {
  console.log('\x1b[32m%s\x1b[0m', '[OK] Running in development repository. Skipping template installation to avoid root pollution.');
  process.exit(0);
}

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function logInfo(msg) { console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`); }
function logOk(msg) { console.log(`${colors.green}[OK]${colors.reset} ${msg}`); }
function logWarn(msg) { console.warn(`${colors.yellow}[WARN]${colors.reset} ${msg}`); }
function logErr(msg) { console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`); }

function printHelp() {
  console.log(`3A-Factory installer

Usage:
  npx 3a-factory [options]
  node scripts/install.js [options]

Agent selection (pick one or more; default: all):
  --agent=<name>[,<name>...]   claude | gemini | cursor | all
  --claude / --gemini / --cursor
  --all

  Env: THREEA_AGENT=claude   or   npm_config_3a_agent=gemini

Other options:
  --force       Overwrite existing files (backup unless --no-backup)
  --no-backup   Do not write .bak.* when overwriting
  --dry-run     Print actions only
  --verbose     Extra logging
  -h, --help    Show help

Always installed (shared):
  docs/*, AGENTS.md, WORKFLOW.md, .agents/templates|skills
  (docs includes misc/compact + misc/issues)

Per agent:
  claude  → CLAUDE.md, .claude/skills, .claude/commands
  gemini  → GEMINI.md, .gemini/commands (skills via .agents/skills)
  cursor  → .cursor/rules/*.mdc (incl. ai-workflow.mdc)
`);
}

function parseAgents(argv) {
  const selected = new Set();

  function addToken(raw) {
    const token = String(raw || '').trim().toLowerCase();
    if (!token) return;
    if (token === 'all') {
      VALID_AGENTS.forEach((a) => selected.add(a));
      return;
    }
    if (!VALID_AGENTS.includes(token)) {
      throw new Error(`Unknown agent "${raw}". Use: ${VALID_AGENTS.join(', ')}, or all`);
    }
    selected.add(token);
  }

  for (const arg of argv) {
    if (arg === '--all') {
      VALID_AGENTS.forEach((a) => selected.add(a));
      continue;
    }
    if (arg === '--claude' || arg === '--gemini' || arg === '--cursor') {
      addToken(arg.slice(2));
      continue;
    }
    const m = arg.match(/^--agents?=(.+)$/i);
    if (m) {
      m[1].split(',').forEach(addToken);
    }
  }

  if (selected.size === 0) {
    const envVal =
      process.env.THREEA_AGENT ||
      process.env.npm_config_3a_agent ||
      process.env.npm_config_agent;
    if (envVal) {
      String(envVal).split(',').forEach(addToken);
    }
  }

  if (selected.size === 0) {
    VALID_AGENTS.forEach((a) => selected.add(a));
  }

  return selected;
}

function wants(agent) {
  return selectedAgents.has(agent);
}

const sharedDirs = [
  'docs/requirements',
  'docs/designs',
  'docs/reviews',
  'docs/qa',
  'docs/release-notes',
  'docs/misc/compact',
  'docs/misc/issues',
  '.agents/templates'
];

const agentDirs = {
  claude: ['.claude/commands', '.claude/skills'],
  gemini: ['.gemini/commands', '.gemini/prompts'],
  cursor: ['.cursor/rules']
};

const sharedFiles = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
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
  { src: 'templates/.agents/templates/RELEASE-template.md', dest: '.agents/templates/RELEASE-template.md' }
];

const agentFiles = {
  claude: [{ src: 'CLAUDE.md', dest: 'CLAUDE.md' }],
  gemini: [{ src: 'GEMINI.md', dest: 'GEMINI.md' }],
  cursor: [{ src: 'templates/.cursor/rules/ai-workflow.mdc', dest: '.cursor/rules/ai-workflow.mdc' }]
};

const optionalAgentFiles = {
  cursor: [{ src: '.cursorrules', dest: '.cursorrules' }]
};

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
    return fs.readFileSync(src).equals(fs.readFileSync(dest));
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
  for (const file of fs.readdirSync(dir)) {
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

  const metadata = {};
  for (const line of frontmatterText.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.substring(0, colonIdx).trim();
    let val = line.substring(colonIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    metadata[key] = val;
  }

  if (!metadata.name) metadata.name = path.basename(filePath, '.md');
  if (!metadata.description) metadata.description = '';

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

      let skillFM = `---\nname: ${name}\ndescription: ${desc}\n`;
      if (metadata['disable-model-invocation'] !== undefined) {
        skillFM += `disable-model-invocation: ${metadata['disable-model-invocation']}\n`;
      }
      if (metadata['argument-hint'] !== undefined) {
        skillFM += `argument-hint: ${metadata['argument-hint']}\n`;
      }
      skillFM += `---\n`;
      const skillBody = `${skillFM}${body}`;

      // Shared portable skills — used by Gemini prompts and as source of truth
      writeGeneratedFile(`.agents/skills/${name}/SKILL.md`, skillBody);

      if (wants('claude')) {
        writeGeneratedFile(`.claude/skills/${name}/SKILL.md`, skillBody);
        const claudeCmd = `---\ndescription: ${desc}\n---\n\nRead and execute .claude/skills/${name}/SKILL.md. Arguments: $ARGUMENTS\n`;
        writeGeneratedFile(`.claude/commands/${name}.md`, claudeCmd);
      }

      if (wants('cursor')) {
        let cursorFM = `---\ndescription: ${desc}\nglobs: *\n`;
        if (metadata.alwaysApply !== undefined) {
          cursorFM += `alwaysApply: ${metadata.alwaysApply}\n`;
        } else {
          cursorFM += `alwaysApply: false\n`;
        }
        cursorFM += `---\n`;
        writeGeneratedFile(`.cursor/rules/${name}.mdc`, `${cursorFM}${body}`);
      }

      if (wants('gemini')) {
        const geminiCmd = `description = "${desc.replace(/"/g, '\\"')}"\nprompt = """\nRead AGENTS.md first, then read .agents/skills/${name}/SKILL.md and execute that workflow.\nArguments: {{args}}\n"""\n`;
        writeGeneratedFile(`.gemini/commands/${name}.toml`, geminiCmd);
      }
    } catch (err) {
      logWarn(`Failed to parse or convert skill file ${file}: ${err.message}`);
    }
  }
}

function collectTargetDirs() {
  const dirs = [...sharedDirs];
  for (const agent of VALID_AGENTS) {
    if (wants(agent)) {
      dirs.push(...(agentDirs[agent] || []));
    }
  }
  return dirs;
}

function collectRequiredFiles() {
  const files = [...sharedFiles];
  for (const agent of VALID_AGENTS) {
    if (wants(agent)) {
      files.push(...(agentFiles[agent] || []));
    }
  }
  return files;
}

function collectOptionalFiles() {
  const files = [];
  for (const agent of VALID_AGENTS) {
    if (wants(agent)) {
      files.push(...(optionalAgentFiles[agent] || []));
    }
  }
  return files;
}

function printFooter() {
  console.log(`${colors.cyan}=============================================${colors.reset}`);
  console.log(`Agents installed: ${[...selectedAgents].join(', ')}`);
  console.log(`Artifacts:        docs/{requirements,designs,reviews,qa,release-notes,misc/...}`);
  console.log(`Shared skills:    .agents/skills + AGENTS.md`);
  if (wants('claude')) {
    console.log(`Claude Code:      /project-manager, /grill-me, /onboarding, /develop, …`);
  }
  if (wants('gemini')) {
    console.log(`Gemini CLI:       .gemini/commands/*.toml`);
  }
  if (wants('cursor')) {
    console.log(`Cursor:           .cursor/rules/*.mdc (incl. ai-workflow.mdc)`);
  }
  console.log(`${colors.cyan}=============================================${colors.reset}`);
}

console.log(`${colors.cyan}=============================================${colors.reset}`);
console.log(`${colors.cyan}  3A-Factory NPM Installer${colors.reset}`);
console.log(`${colors.cyan}=============================================${colors.reset}`);
console.log(`Template root: ${templateRoot}`);
console.log(`Target root:   ${targetRoot}`);
console.log(`Agents:        ${[...selectedAgents].join(', ')}`);
console.log(`Mode:          ${isDryRun ? 'dry-run' : 'write'}`);
console.log(`Overwrite:     ${isForce ? 'yes' : 'no'}`);
console.log(`Backup:        ${isNoBackup ? 'no' : 'yes'}`);
console.log(`${colors.cyan}---------------------------------------------${colors.reset}`);

try {
  collectTargetDirs().forEach((dir) => ensureDirectory(dir));
  collectRequiredFiles().forEach((item) => copyWorkflowFile(item, true));
  collectOptionalFiles().forEach((item) => copyWorkflowFile(item, false));
  processSkills();

  console.log(`${colors.cyan}---------------------------------------------${colors.reset}`);
  logOk('Installation completed.');
  console.log(`Created dirs: ${stats.createdDirs}`);
  console.log(`New files:    ${stats.newFiles}`);
  console.log(`Updated:      ${stats.updatedFiles}`);
  console.log(`Backups:      ${stats.backups}`);
  console.log(`Unchanged:    ${stats.unchanged}`);
  console.log(`Skipped:      ${stats.skipped}`);
  printFooter();
} catch (err) {
  logErr(`Installation failed: ${err.message}`);
  process.exit(1);
}
