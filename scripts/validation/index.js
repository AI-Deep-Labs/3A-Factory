'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, result, REQUIRED_SKILLS, exists, walk, parseFrontmatter, read, FORBIDDEN_ACTIVE, HAPPY_TRANSITIONS, PACKAGE_STATUS } = require('./lib');
const { validateSchemaJson, validateManifestFile } = require('./validate-manifest');

function validatePackageLayout(specsRoot = path.join(ROOT, 'docs/tasks')) {
  const details = [];
  if (!fs.existsSync(specsRoot)) {
    return result(true, 'PACKAGE_LAYOUT_VALID', ['no docs/tasks packages (OK)']);
  }
  const dirs = fs.readdirSync(specsRoot).filter((n) =>
    fs.statSync(path.join(specsRoot, n)).isDirectory()
  );
  const byId = new Map();
  for (const name of dirs) {
    if (!/^REQ-[0-9]{6}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      details.push(`invalid package name: ${name}`);
      continue;
    }
    const id = name.slice(0, 10);
    if (byId.has(id)) {
      return result(false, 'PACKAGE_CONFLICT', [`duplicate REQ id ${id}`]);
    }
    byId.set(id, name);
    const man = path.join(specsRoot, name, 'manifest.yaml');
    const r = validateManifestFile(man, name);
    if (!r.ok) details.push(...r.details.map((d) => `${name}: ${d}`));
    for (const legacy of ['docs', 'legacy']) {
      if (fs.existsSync(path.join(specsRoot, name, legacy))) {
        details.push(`${name}: unexpected legacy folder`);
      }
    }
  }
  return details.length
    ? result(false, 'PACKAGE_LAYOUT_INVALID', details)
    : result(true, 'PACKAGE_LAYOUT_VALID', []);
}

function validateTraceability(packageDir) {
  const details = [];
  if (!packageDir || !fs.existsSync(packageDir)) {
    return result(true, 'TRACEABILITY_VALID', ['no package provided']);
  }
  const files = ['requirements.md', 'design.md', 'tasks.md', 'acceptance.md'];
  const text = files
    .map((f) => {
      const p = path.join(packageDir, f);
      return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    })
    .join('\n');
  // Uniqueness applies to *definitions* (markdown headings), not cross-references.
  const defRe =
    /^#{2,4}\s+((?:FR|BR|NFR|DES-[A-Z]+|TASK|AC|UT|ST|UAT|PERF|SEC)-\d{3})\b/gm;
  const defined = [...text.matchAll(defRe)].map((m) => m[1]);
  const seen = new Set();
  for (const id of defined) {
    if (seen.has(id)) details.push(`DUPLICATE_ID:${id}`);
    seen.add(id);
  }
  if (text.includes('PENDING_ACCEPTANCE')) details.push('PENDING_ACCEPTANCE');
  // circular task dependency naive check (Dependencies lists only)
  const deps = {};
  const taskBlocks = text.split(/###\s+(TASK-\d{3})/);
  for (let i = 1; i < taskBlocks.length; i += 2) {
    const id = taskBlocks[i];
    const body = taskBlocks[i + 1] || '';
    const depSection = body.match(/Dependencies[\s\S]*?(?=\n##|\n###|$)/i);
    const section = depSection ? depSection[0] : '';
    const refs = [...section.matchAll(/TASK-\d{3}/g)].map((m) => m[0]).filter((t) => t !== id);
    deps[id] = refs;
  }
  function hasCycle(node, stack = new Set()) {
    if (stack.has(node)) return true;
    stack.add(node);
    for (const d of deps[node] || []) {
      if (hasCycle(d, new Set(stack))) return true;
    }
    return false;
  }
  for (const t of Object.keys(deps)) {
    if (hasCycle(t)) details.push(`CIRCULAR_TASK_DEPENDENCY:${t}`);
  }
  return details.length
    ? result(false, 'TRACEABILITY_INVALID', details)
    : result(true, 'TRACEABILITY_VALID', []);
}

function validateSkillContracts() {
  const details = [];
  const names = new Set();
  for (const skill of REQUIRED_SKILLS) {
    const rel = `templates/skills/workflow/${skill}.md`;
    if (!exists(rel)) {
      details.push(`missing skill: ${skill}`);
      continue;
    }
    const content = read(rel);
    let meta;
    try {
      ({ meta } = parseFrontmatter(content, rel));
    } catch (err) {
      details.push(err.message);
      continue;
    }
    if (!meta.name || !meta.description) details.push(`${skill}: missing name/description`);
    if (names.has(meta.name)) details.push(`duplicate skill name: ${meta.name}`);
    names.add(meta.name);
    const lower = content.toLowerCase();
    for (const section of ['purpose', 'gate', 'input', 'output', 'failure', 'manifest', 'stop']) {
      if (!lower.includes(section)) details.push(`${skill}: missing section hint '${section}'`);
    }
    if (content.includes('/plan') || meta.name === 'plan') details.push(`${skill}: forbidden /plan`);
    if (/docs\/requirements\/REQ-.*-spec\.md/.test(content) && /Write `docs\//.test(content)) {
      details.push(`${skill}: active legacy write path`);
    }
    if (/auto-approve|automatically approve/i.test(content) && skill !== 'spec') {
      // soft: ensure not approving deploy automatically
    }
    if (skill === 'deploy' && !/APPROVED_DEPLOY/.test(content)) {
      details.push('deploy missing APPROVED_DEPLOY');
    }
    if (skill === 'develop' && !/APPROVED_SPEC_PACKAGE/.test(content)) {
      details.push('develop missing APPROVED_SPEC_PACKAGE gate');
    }
    if (skill === 'review' && !/task\.status:\s*done/.test(content)) {
      details.push('review must control task done');
    }
    if (skill === 'qa' && !/max = 3|max QA|Maximum attempts:\s*\*\*3\*\*|attempts.*3/i.test(content)) {
      details.push('qa missing bounded loop max 3');
    }
    if (skill === 'converge' && /status:\s*done/.test(content) && !/Do \*\*not\*\* set `done`/.test(content)) {
      details.push('converge must not mark done');
    }
  }
  if (exists('templates/skills/workflow/plan.md')) {
    details.push('plan.md must not exist (greenfield)');
  }
  return details.length
    ? result(false, 'SKILL_VALIDATION_FAILED', details)
    : result(true, 'SKILL_VALIDATION_PASSED', []);
}

function validateTemplateReferences() {
  const details = [];
  const required = [
    'SPEC-PACKAGE-MANIFEST-template.yaml',
    'REQUIREMENTS-template.md',
    'DESIGN-template.md',
    'TASKS-template.md',
    'ACCEPTANCE-template.md',
    'SPEC-REVIEW-template.md',
    'IMPLEMENTATION-EVIDENCE-template.md',
    'CODE-REVIEW-template.md',
    'QA-SUMMARY-template.md',
    'CONVERGE-REPORT-template.md'
  ];
  for (const t of required) {
    if (!exists(`templates/.agents/templates/${t}`)) details.push(`TEMPLATE_REFERENCE_MISSING:${t}`);
  }
  for (const legacy of ['SPEC-template.md', 'PLAN-template.md']) {
    if (exists(`templates/.agents/templates/${legacy}`)) {
      details.push(`legacy template present: ${legacy}`);
    }
  }
  return details.length
    ? result(false, 'TEMPLATE_CONTRACT_MISMATCH', details)
    : result(true, 'TEMPLATE_VALIDATION_PASSED', []);
}

const AGENT_MODE_HUB = 'templates/.agents/rules/agent-mode.md';
const AGENT_MODE_POINTER = '.agents/rules/agent-mode.md';

function validateAgentModeHub() {
  const details = [];
  if (!exists(AGENT_MODE_HUB)) {
    details.push(`missing ${AGENT_MODE_HUB}`);
    return details;
  }
  const hub = read(AGENT_MODE_HUB);
  for (const needle of [
    'CRITICAL OVERRIDE',
    'No Internal Planning Mode',
    'No Hidden Artifacts',
    'docs/tasks/REQ-',
    'APPROVED_SPEC_PACKAGE'
  ]) {
    if (!hub.includes(needle)) details.push(`${AGENT_MODE_HUB}: missing '${needle}'`);
  }
  const pointers = [
    ['AGENTS.md', 'CRITICAL AGENT OVERRIDE'],
    ['CLAUDE.md', 'CRITICAL'],
    ['GEMINI.md', 'CRITICAL'],
    ['templates/.cursor/rules/ai-workflow.mdc', 'CRITICAL']
  ];
  for (const [file, marker] of pointers) {
    if (!exists(file)) {
      details.push(`missing ${file}`);
      continue;
    }
    const text = read(file);
    if (!text.includes(AGENT_MODE_POINTER)) {
      details.push(`${file}: missing pointer to ${AGENT_MODE_POINTER}`);
    }
    if (!text.includes(marker)) details.push(`${file}: missing '${marker}' override marker`);
  }
  return details;
}

function validateGovernanceConsistency() {
  const files = [
    'AGENTS.md',
    'CLAUDE.md',
    'GEMINI.md',
    'templates/WORKFLOW.md',
    'templates/.cursor/rules/ai-workflow.mdc',
    'templates/.agents/contracts/spec-package.md',
    'README.md'
  ];
  const details = [...validateAgentModeHub()];
  for (const f of files) {
    if (!exists(f)) {
      details.push(`missing ${f}`);
      continue;
    }
    const text = read(f);
    if (!text.includes('docs/tasks/')) {
      if (f !== 'README.md') details.push(`${f}: missing canonical docs/tasks path`);
    }
    if (f !== 'README.md' && !/Feature-local Spec Package/i.test(text) && f !== 'templates/.agents/contracts/spec-package.md') {
      if (!/Spec is a Feature-local Spec Package/i.test(text) && !/Spec Package/i.test(text)) {
        details.push(`${f}: missing Spec Package definition`);
      }
    }
    if (/`\/plan`/.test(text) && !/not supported|removed|must not|không|No `\/plan`/i.test(text)) {
      // allow explicit "no /plan" statements
      if (/deprecated alias of `\/tasks`|Using `\/tasks`/.test(text)) {
        details.push(`${f}: ACTIVE_REFERENCE /plan alias`);
      }
    }
  }
  return details.length
    ? result(false, 'GOVERNANCE_CONFLICT', details)
    : result(true, 'GOVERNANCE_CONSISTENT', []);
}

function validateAdapterParity() {
  const details = [];
  for (const [file, marker] of [
    ['CLAUDE.md', 'Claude'],
    ['GEMINI.md', 'Gemini'],
    ['templates/.cursor/rules/ai-workflow.mdc', 'Cursor']
  ]) {
    if (!exists(file)) {
      details.push(`missing ${file}`);
      continue;
    }
    const text = read(file);
    for (const needle of [
      'docs/tasks/',
      'APPROVED_SPEC_PACKAGE',
      'APPROVED_DEPLOY',
      'converge',
      'tasks.md',
      AGENT_MODE_POINTER
    ]) {
      if (!text.includes(needle)) details.push(`${marker}: missing ${needle}`);
    }
  }
  for (const skill of REQUIRED_SKILLS) {
    if (!exists(`templates/skills/workflow/${skill}.md`)) details.push(`missing skill ${skill}`);
  }
  return details.length
    ? result(false, 'ADAPTER_PARITY_FAILED', details)
    : result(true, 'ADAPTER_PARITY_PASSED', []);
}

function validateBuildOutput() {
  const details = [];
  const bundlePath = path.join(ROOT, 'dist/bundle.json');
  const manPath = path.join(ROOT, 'dist/build-manifest.json');
  if (!fs.existsSync(bundlePath)) details.push('bundle.json missing — run build');
  if (!fs.existsSync(manPath)) details.push('build-manifest.json missing');
  if (fs.existsSync(bundlePath)) {
    const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
    for (const skill of REQUIRED_SKILLS) {
      const key = `templates/skills/workflow/${skill}.md`;
      if (!bundle.files[key]) details.push(`bundle missing ${key}`);
    }
    if (bundle.files['templates/skills/workflow/plan.md']) details.push('bundle contains plan.md');
    if (bundle.files['templates/.agents/templates/SPEC-template.md']) {
      details.push('bundle contains SPEC-template.md');
    }
    if (bundle.files['templates/.agents/templates/PLAN-template.md']) {
      details.push('bundle contains PLAN-template.md');
    }
    if (!bundle.files[AGENT_MODE_HUB]) {
      details.push(`bundle missing ${AGENT_MODE_HUB}`);
    }
  }
  return details.length
    ? result(false, 'BUILD_OUTPUT_INVALID', details)
    : result(true, 'BUILD_OUTPUT_VALID', []);
}

function validateStateFlow() {
  const details = [];
  const invalid = [
    ['triaged', 'implementing'],
    ['awaiting_approval', 'qa'],
    ['implementing', 'done'],
    ['qa', 'done'],
    ['converging', 'done']
  ];
  for (const [from, to] of invalid) {
    const allowed = HAPPY_TRANSITIONS[from] || [];
    if (allowed.includes(to)) details.push(`unexpectedly allowed ${from}→${to}`);
  }
  for (const s of Object.keys(HAPPY_TRANSITIONS)) {
    if (!PACKAGE_STATUS.has(s) && s !== 'analysed') details.push(`unknown state ${s}`);
  }
  return details.length
    ? result(false, 'STATE_FLOW_INVALID', details)
    : result(true, 'STATE_FLOW_VALID', []);
}

function validateGreenfield() {
  const details = [];
  if (exists('templates/skills/workflow/plan.md')) details.push('plan skill exists');
  if (exists('templates/.agents/templates/SPEC-template.md')) details.push('SPEC-template exists');
  if (exists('templates/.agents/templates/PLAN-template.md')) details.push('PLAN-template exists');
  const skillFiles = walk('templates/skills/workflow');
  for (const f of skillFiles) {
    const text = read(f);
    if (/Write `docs\/requirements\/REQ-.*-spec\.md`/.test(text)) {
      details.push(`ACTIVE_REFERENCE legacy spec write in ${f}`);
    }
    if (/Write `\.specs\//.test(text) || /create `\.\.?\/?\.specs\//i.test(text)) {
      details.push(`ACTIVE_REFERENCE legacy .specs write in ${f}`);
    }
  }
  const contract = read('templates/.agents/contracts/spec-package.md');
  if (!contract.includes('docs/tasks/')) {
    details.push('contract missing docs/tasks/ canonical path');
  }
  if (/```text\s*\n\.specs\//.test(contract)) {
    details.push('contract still shows .specs/ as canonical layout');
  }
  return details.length
    ? result(false, 'GREENFIELD_INVALID', details)
    : result(true, 'GREENFIELD_VALID', []);
}

module.exports = {
  validatePackageLayout,
  validateTraceability,
  validateSkillContracts,
  validateTemplateReferences,
  validateGovernanceConsistency,
  validateAdapterParity,
  validateBuildOutput,
  validateStateFlow,
  validateGreenfield,
  validateSchemaJson
};
