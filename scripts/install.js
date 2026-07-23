#!/usr/bin/env node

/**
 * 3A-Factory installer (greenfield Spec Package)
 * Installs shared governance + Spec Package templates/contracts/schemas
 * and agent adapters for Claude / Gemini / Cursor.
 *
 * Does NOT create .specs/, run workflow, approve, commit, push, or deploy.
 */

const fs = require('fs');
const path = require('path');

const VALID_AGENTS = ['claude', 'gemini', 'cursor'];
const SKIP_SKILL_NAMES = new Set(['plan']);

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const isDryRun = args.includes('--dry-run') && !args.includes('--apply');
const isForce = args.includes('--force') || process.env.npm_config_force === 'true';
const isNoBackup = args.includes('--no-backup');
const isVerbose = args.includes('--verbose');
const isJson = args.includes('--json');

let selectedAgents;
try {
  selectedAgents = parseAgents(args);
} catch (err) {
  failToken('INSTALL_TARGET_INVALID', err.message);
}

const cwdArg = getFlagValue(args, '--cwd');
const scriptDir = __dirname;
const templateRoot = path.resolve(scriptDir, '..');
let targetRoot = cwdArg ? path.resolve(cwdArg) : process.env.INIT_CWD || process.cwd();

try {
  targetRoot = assertInsideAllowedRoot(targetRoot);
} catch (err) {
  failToken('INSTALL_PATH_INVALID', err.message);
}

const bundlePath = path.join(scriptDir, 'bundle.json');
let bundleFilesCache = null;

const report = {
  schemaVersion: 1,
  target: [...selectedAgents].sort().join(','),
  mode: isDryRun ? 'dry-run' : 'apply',
  installedFiles: [],
  updatedFiles: [],
  unchangedFiles: [],
  conflicts: [],
  backups: [],
  skipped: [],
  result: null
};

const stats = {
  createdDirs: 0,
  newFiles: 0,
  updatedFiles: 0,
  backups: 0,
  unchanged: 0,
  skipped: 0,
  conflicts: 0
};

function getFlagValue(argv, name) {
  const idx = argv.indexOf(name);
  if (idx >= 0 && argv[idx + 1] && !argv[idx + 1].startsWith('-')) return argv[idx + 1];
  const pref = `${name}=`;
  const hit = argv.find((a) => a.startsWith(pref));
  return hit ? hit.slice(pref.length) : null;
}

function failToken(token, message) {
  if (isJson) {
    console.log(JSON.stringify({ result: token, message }, null, 2));
  } else {
    console.error(`[ERROR] ${token}: ${message}`);
  }
  process.exit(1);
}

function normalizeRel(relativePath) {
  return String(relativePath || '').replace(/\\/g, '/');
}

function assertInsideAllowedRoot(candidate) {
  const resolved = path.resolve(candidate);
  if (resolved.includes('\0')) throw new Error('null byte in path');
  const relParts = path.relative(path.parse(resolved).root, resolved).split(path.sep);
  if (relParts.includes('..')) throw new Error(`path traversal: ${candidate}`);
  return resolved;
}

function assertDestSafe(destRelativePath) {
  const rel = normalizeRel(destRelativePath);
  if (!rel || rel.startsWith('/') || rel.includes('..') || /^[A-Za-z]:/.test(rel)) {
    throw new Error(`unsafe dest path: ${destRelativePath}`);
  }
  if (rel === '.specs' || rel.startsWith('.specs/')) {
    throw new Error('installer must not create .specs/');
  }
  const full = path.resolve(targetRoot, rel);
  if (!full.startsWith(targetRoot)) throw new Error(`path escape: ${destRelativePath}`);
  return { rel, full };
}

function getBundleFiles() {
  if (bundleFilesCache !== null) return bundleFilesCache;
  if (fs.existsSync(bundlePath)) {
    bundleFilesCache = JSON.parse(fs.readFileSync(bundlePath, 'utf8')).files || {};
  } else {
    bundleFilesCache = null;
  }
  return bundleFilesCache;
}

function readTemplateContent(relativePath) {
  const rel = normalizeRel(relativePath);
  const bundle = getBundleFiles();
  if (bundle && Object.prototype.hasOwnProperty.call(bundle, rel)) return bundle[rel];
  const full = path.join(templateRoot, rel);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

function listSkillTemplateEntries() {
  const prefix = 'templates/skills/';
  const bundle = getBundleFiles();
  if (bundle) {
    return Object.keys(bundle)
      .filter((key) => key.startsWith(prefix) && key.endsWith('.md'))
      .sort()
      .map((key) => ({ relativePath: key, content: bundle[key] }));
  }
  const skillsDir = path.join(templateRoot, 'templates', 'skills');
  return scanDirectory(skillsDir)
    .map((filePath) => ({
      relativePath: normalizeRel(path.relative(templateRoot, filePath)),
      content: fs.readFileSync(filePath, 'utf8')
    }))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function printHelp() {
  console.log(`3A-Factory installer (greenfield Spec Package)

Usage:
  npx 3a-factory [options]
  node scripts/install.js [options]

Targets:
  --agent=<name>[,<name>...] | --target=<name>[,...]   claude | gemini | cursor | all
  --claude / --gemini / --cursor / --all

Modes:
  --dry-run     Print actions only
  --apply       Write files (default when not --dry-run)
  --force       Overwrite existing differing files (backup unless --no-backup)
  --no-backup   Skip backups on force overwrite
  --cwd <path>  Install root (default: INIT_CWD or cwd)
  --json        Machine-readable install report on stdout
  --verbose     Extra logging
  -h, --help

Always installs (shared):
  AGENTS.md, WORKFLOW.md, .agents/{templates,contracts,schemas,skills}, docs/

Per agent:
  claude  → CLAUDE.md, .claude/skills, .claude/commands
  gemini  → GEMINI.md, .gemini/commands/*.toml → .agents/skills
  cursor  → .cursor/rules/*.mdc (requestable skill rules) + ai-workflow.mdc

Never:
  create .specs/, pre-create docs/decisions or docs/misc, run workflow, approve, commit, push, deploy
  create .cursor/skills/ or .gemini/skills/ (content lives in .agents/skills only)
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
      throw new Error(`Unknown target "${raw}". Use: ${VALID_AGENTS.join(', ')}, or all`);
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
    const m = arg.match(/^--(?:agents?|target)=(.+)$/i);
    if (m) m[1].split(',').forEach(addToken);
  }

  if (selected.size === 0) {
    const envVal =
      process.env.THREEA_AGENT ||
      process.env.npm_config_3a_agent ||
      process.env.npm_config_agent;
    if (envVal) String(envVal).split(',').forEach(addToken);
  }

  if (selected.size === 0) VALID_AGENTS.forEach((a) => selected.add(a));
  return selected;
}

function wants(agent) {
  return selectedAgents.has(agent);
}

const sharedDirs = [
  '.agents/templates',
  '.agents/contracts',
  '.agents/schemas',
  '.agents/skills',
  'docs'
];

const agentDirs = {
  claude: ['.claude/commands', '.claude/skills'],
  gemini: ['.gemini/commands'],
  cursor: ['.cursor/rules']
};

const SPEC_PACKAGE_TEMPLATES = [
  'SPEC-PACKAGE-README.md',
  'SPEC-PACKAGE-MANIFEST-template.yaml',
  'REQUIREMENTS-template.md',
  'TASKS-template.md',
  'ACCEPTANCE-template.md',
  'SPEC-REVIEW-template.md',
  'IMPLEMENTATION-EVIDENCE-template.md',
  'CODE-REVIEW-template.md',
  'QA-SUMMARY-template.md',
  'CONVERGE-REPORT-template.md',
  'ADR-template.md',
  'RAW-REQ-template.md',
  'DISCOVERY-template.md',
  'ANALYSIS-template.md',
  'DESIGN-template.md',
  'RELEASE-template.md'
];

const sharedFiles = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: 'templates/WORKFLOW.md', dest: 'WORKFLOW.md' },
  {
    src: 'templates/.agents/contracts/spec-package.md',
    dest: '.agents/contracts/spec-package.md'
  },
  {
    src: 'templates/.agents/schemas/spec-package-manifest.schema.json',
    dest: '.agents/schemas/spec-package-manifest.schema.json'
  },
  ...SPEC_PACKAGE_TEMPLATES.map((name) => ({
    src: `templates/.agents/templates/${name}`,
    dest: `.agents/templates/${name}`
  }))
];

const agentFiles = {
  claude: [{ src: 'CLAUDE.md', dest: 'CLAUDE.md' }],
  gemini: [{ src: 'GEMINI.md', dest: 'GEMINI.md' }],
  cursor: [
    {
      src: 'templates/.cursor/rules/ai-workflow.mdc',
      dest: '.cursor/rules/ai-workflow.mdc'
    }
  ]
};

const optionalAgentFiles = {
  cursor: [{ src: '.cursorrules', dest: '.cursorrules' }]
};

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function logInfo(msg) {
  if (!isJson) console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`);
}
function logOk(msg) {
  if (!isJson) console.log(`${colors.green}[OK]${colors.reset} ${msg}`);
}
function logWarn(msg) {
  if (!isJson) console.warn(`${colors.yellow}[WARN]${colors.reset} ${msg}`);
}

function sameContent(a, b) {
  return String(a || '').replace(/\r\n/g, '\n') === String(b || '').replace(/\r\n/g, '\n');
}

function ensureDirectory(relativeDir) {
  const { full, rel } = assertDestSafe(relativeDir);
  if (!fs.existsSync(full)) {
    if (!isDryRun) fs.mkdirSync(full, { recursive: true });
    stats.createdDirs++;
    if (isVerbose) logInfo(`[MKDIR] ${rel}`);
  }
}

function backupFile(full, destRel) {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const backupFile = `${full}.bak.${timestamp}`;
  if (!isDryRun) fs.copyFileSync(full, backupFile);
  stats.backups++;
  report.backups.push(normalizeRel(path.relative(targetRoot, backupFile)));
  return backupFile;
}

function writeFileAction(destRel, content, required) {
  const { full, rel } = assertDestSafe(destRel);
  const destDir = path.dirname(full);
  if (!fs.existsSync(destDir)) {
    if (!isDryRun) fs.mkdirSync(destDir, { recursive: true });
    stats.createdDirs++;
  }

  if (fs.existsSync(full)) {
    const existing = fs.readFileSync(full, 'utf8');
    if (sameContent(existing, content)) {
      stats.unchanged++;
      report.unchangedFiles.push(rel);
      return 'UNCHANGED';
    }
    if (!isForce) {
      stats.conflicts++;
      stats.skipped++;
      report.conflicts.push(rel);
      report.skipped.push(rel);
      logWarn(`INSTALL_CONFLICT: ${rel} (use --force to overwrite)`);
      return 'CONFLICT';
    }
    if (!isNoBackup) backupFile(full, rel);
    if (!isDryRun) fs.writeFileSync(full, content, 'utf8');
    stats.updatedFiles++;
    report.updatedFiles.push(rel);
    return 'UPDATE_SAFE';
  }

  if (!isDryRun) fs.writeFileSync(full, content, 'utf8');
  stats.newFiles++;
  report.installedFiles.push(rel);
  return 'CREATE';
}

function copyWorkflowFile(item, required) {
  const srcContent = readTemplateContent(item.src);
  if (srcContent === null) {
    if (required) throw new Error(`Required template missing: ${item.src}`);
    stats.skipped++;
    report.skipped.push(item.dest);
    return;
  }
  writeFileAction(item.dest, srcContent, required);
}

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  for (const file of fs.readdirSync(dir).sort()) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) scanDirectory(filePath, fileList);
    else if (stat.isFile() && file.endsWith('.md')) fileList.push(filePath);
  }
  return fileList;
}

function parseYamlFrontmatter(text) {
  const metadata = {};
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      i++;
      continue;
    }
    const key = line.substring(0, colonIdx).trim();
    let val = line.substring(colonIdx + 1).trim();
    if (val === '>' || val === '|') {
      const blockLines = [];
      i++;
      while (i < lines.length && (/^\s/.test(lines[i]) || lines[i].trim() === '')) {
        if (/^\s/.test(lines[i])) blockLines.push(lines[i].replace(/^\s{2,}/, '').trimEnd());
        i++;
      }
      metadata[key] = blockLines.join(' ').trim();
      continue;
    }
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    metadata[key] = val;
    i++;
  }
  return metadata;
}

function yamlQuote(value) {
  return `"${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
function tomlQuote(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function formatSkillFrontmatter(metadata) {
  const name = metadata.name;
  const lines = [
    '---',
    `name: ${name}`,
    `description: ${yamlQuote(metadata.description || '')}`
  ];
  // Slash-style invocation: only load when user types /name (Cursor + Agent Skills UX).
  lines.push('disable-model-invocation: true');
  if (metadata['argument-hint'] !== undefined && metadata['argument-hint'] !== '') {
    const hint = Array.isArray(metadata['argument-hint'])
      ? metadata['argument-hint'].join(' ')
      : String(metadata['argument-hint']);
    lines.push(`argument-hint: ${yamlQuote(hint)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

function parseMarkdownContentWithFrontmatter(content, label) {
  const normalized = String(content).replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) throw new Error(`File does not start with frontmatter: ${label}`);
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) throw new Error(`Invalid frontmatter: ${label}`);
  const metadata = parseYamlFrontmatter(normalized.substring(4, endIdx));
  const body = normalized.substring(endIdx + 5);
  if (!metadata.name) metadata.name = path.basename(label, '.md');
  if (!metadata.description) metadata.description = '';
  return { metadata, body };
}

function processSkills() {
  const skillEntries = listSkillTemplateEntries();
  if (skillEntries.length === 0) {
    throw new Error('INSTALL_SOURCE_INVALID: no skill templates found');
  }

  for (const { relativePath, content } of skillEntries) {
    const { metadata, body } = parseMarkdownContentWithFrontmatter(content, relativePath);
    const name = metadata.name;
    if (SKIP_SKILL_NAMES.has(name)) continue;
    const desc = metadata.description || '';
    const bodyText = body.replace(/^\n/, '');
    const skillBody = `${formatSkillFrontmatter(metadata)}${bodyText}`;

    // Shared skill body — single content source for Gemini + Cursor Agent Skills discovery
    writeFileAction(`.agents/skills/${name}/SKILL.md`, skillBody, true);

    if (wants('claude')) {
      writeFileAction(`.claude/skills/${name}/SKILL.md`, skillBody, true);
      const claudeCmd = `---\ndescription: ${yamlQuote(desc)}\n---\n\nRead AGENTS.md first, then read and execute .claude/skills/${name}/SKILL.md.\nArguments: $ARGUMENTS\n`;
      writeFileAction(`.claude/commands/${name}.md`, claudeCmd, true);
    }

    if (wants('cursor')) {
      // Requestable Rules = Cursor slash/Rules UX (no .cursor/skills mirror)
      const cursorRule = [
        '---',
        `description: ${yamlQuote(desc)}`,
        'globs: *',
        'alwaysApply: false',
        '---',
        '',
        bodyText
      ].join('\n');
      writeFileAction(`.cursor/rules/${name}.mdc`, cursorRule, true);
    }

    if (wants('gemini')) {
      // Slash entry only — body is .agents/skills (no .gemini/skills mirror)
      const geminiCmd = `description = "${tomlQuote(desc)}"\nprompt = """\nRead AGENTS.md first, then read and execute .agents/skills/${name}/SKILL.md.\nArguments: {{args}}\n"""\n`;
      writeFileAction(`.gemini/commands/${name}.toml`, geminiCmd, true);
    }
  }
}

function assertNoSpecsCreated() {
  // Installer itself must not create .specs — verify we didn't write under it
  if (report.installedFiles.some((f) => f === '.specs' || f.startsWith('.specs/'))) {
    failToken('INSTALL_PATH_INVALID', 'installer attempted to create .specs/');
  }
}

// Dev repo skip (avoid polluting package source tree)
if (path.resolve(targetRoot) === path.resolve(templateRoot) && !cwdArg) {
  const msg =
    '[OK] Running in development repository. Skipping template installation to avoid root pollution. Use --cwd <temp> for smoke tests.';
  if (isJson) console.log(JSON.stringify({ result: 'INSTALL_PASSED', skippedDevRepo: true, message: msg }));
  else console.log('\x1b[32m%s\x1b[0m', msg);
  process.exit(0);
}

if (!getBundleFiles() && !fs.existsSync(path.join(templateRoot, 'templates'))) {
  failToken('INSTALL_SOURCE_INVALID', 'bundle.json missing and templates/ not found — run npm run build');
}

if (!isJson) {
  console.log(`${colors.cyan}=============================================${colors.reset}`);
  console.log(`${colors.cyan}  3A-Factory Installer (greenfield)${colors.reset}`);
  console.log(`${colors.cyan}=============================================${colors.reset}`);
  console.log(`Template root: ${templateRoot}`);
  console.log(`Target root:   ${targetRoot}`);
  console.log(`Agents:        ${[...selectedAgents].join(', ')}`);
  console.log(`Mode:          ${isDryRun ? 'dry-run' : 'apply'}`);
  console.log(`Overwrite:     ${isForce ? 'yes' : 'no'}`);
}

try {
  sharedDirs.forEach((d) => ensureDirectory(d));
  for (const agent of VALID_AGENTS) {
    if (wants(agent)) (agentDirs[agent] || []).forEach((d) => ensureDirectory(d));
  }

  sharedFiles.forEach((item) => copyWorkflowFile(item, true));
  for (const agent of VALID_AGENTS) {
    if (wants(agent)) (agentFiles[agent] || []).forEach((item) => copyWorkflowFile(item, true));
  }
  for (const agent of VALID_AGENTS) {
    if (wants(agent)) (optionalAgentFiles[agent] || []).forEach((item) => copyWorkflowFile(item, false));
  }
  processSkills();
  assertNoSpecsCreated();

  report.result = report.conflicts.length
    ? 'INSTALL_CONFLICT'
    : isDryRun
      ? 'INSTALL_DRY_RUN'
      : 'INSTALL_PASSED';

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    logOk(`Installation finished: ${report.result}`);
    console.log(`Created dirs: ${stats.createdDirs}`);
    console.log(`New files:    ${stats.newFiles}`);
    console.log(`Updated:      ${stats.updatedFiles}`);
    console.log(`Backups:      ${stats.backups}`);
    console.log(`Unchanged:    ${stats.unchanged}`);
    console.log(`Conflicts:    ${stats.conflicts}`);
    console.log(`Shared:       AGENTS.md, WORKFLOW.md, .agents/{templates,contracts,schemas,skills}, docs/`);
    console.log(`Note:         Installer does not create .specs/, docs/decisions, or docs/misc.`);
  }

  if (report.result === 'INSTALL_CONFLICT') process.exit(2);
} catch (err) {
  const msg = err.message || String(err);
  if (msg.startsWith('INSTALL_')) failToken(msg.split(':')[0], msg);
  failToken('INSTALL_SOURCE_INVALID', msg);
}
