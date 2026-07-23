#!/usr/bin/env node

/**
 * Build publish bundle for 3A-Factory (greenfield Spec Package).
 * Embeds templates into dist/bundle.json + copies install.js + writes build-manifest.json.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const REQUIRED_ARTIFACTS = [
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  'templates/WORKFLOW.md',
  'templates/.cursor/rules/ai-workflow.mdc',
  'templates/.agents/contracts/spec-package.md',
  'templates/.agents/schemas/spec-package-manifest.schema.json',
  'templates/.agents/templates/SPEC-PACKAGE-MANIFEST-template.yaml',
  'templates/.agents/templates/REQUIREMENTS-template.md',
  'templates/.agents/templates/DESIGN-template.md',
  'templates/.agents/templates/TASKS-template.md',
  'templates/.agents/templates/ACCEPTANCE-template.md',
  'templates/.agents/templates/SPEC-REVIEW-template.md',
  'templates/.agents/templates/IMPLEMENTATION-EVIDENCE-template.md',
  'templates/.agents/templates/CODE-REVIEW-template.md',
  'templates/.agents/templates/QA-SUMMARY-template.md',
  'templates/.agents/templates/CONVERGE-REPORT-template.md',
  'templates/skills/workflow/triage.md',
  'templates/skills/workflow/grill-me.md',
  'templates/skills/workflow/analyze.md',
  'templates/skills/workflow/requirements.md',
  'templates/skills/workflow/adr.md',
  'templates/skills/workflow/design.md',
  'templates/skills/workflow/tasks.md',
  'templates/skills/workflow/acceptance.md',
  'templates/skills/workflow/spec-review.md',
  'templates/skills/workflow/spec.md',
  'templates/skills/workflow/project-manager.md',
  'templates/skills/workflow/develop.md',
  'templates/skills/workflow/review.md',
  'templates/skills/workflow/qa.md',
  'templates/skills/workflow/converge.md',
  'templates/skills/workflow/deploy.md'
];

const FORBIDDEN_BASENAMES = new Set([
  'plan.md',
  'SPEC-template.md',
  'PLAN-template.md'
]);

const FORBIDDEN_PATH_PARTS = [
  'migration',
  'legacy-resolver',
  'spec-migrate'
];

function normalizeRel(relPath) {
  return String(relPath || '').replace(/\\/g, '/');
}

function fail(token, message) {
  console.error(`[build] ${token}: ${message}`);
  process.exitCode = 1;
  throw new Error(`${token}: ${message}`);
}

function assertSafeRel(rel) {
  const n = normalizeRel(rel);
  if (!n || n.startsWith('/') || /^[A-Za-z]:/.test(n)) {
    fail('BUILD_PATH_INVALID', `absolute path not allowed: ${rel}`);
  }
  const parts = n.split('/');
  if (parts.some((p) => p === '..')) {
    fail('BUILD_PATH_INVALID', `path traversal rejected: ${rel}`);
  }
  return n;
}

function isForbiddenSource(rel) {
  const n = normalizeRel(rel);
  const base = path.posix.basename(n);
  if (FORBIDDEN_BASENAMES.has(base)) return true;
  if (FORBIDDEN_PATH_PARTS.some((p) => n.toLowerCase().includes(p))) return true;
  if (n === 'templates/skills/workflow/plan.md') return true;
  return false;
}

function walkSorted(relativeDir, out = []) {
  const full = path.join(root, relativeDir);
  if (!fs.existsSync(full)) return out;
  const entries = fs.readdirSync(full, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  for (const entry of entries) {
    const rel = normalizeRel(path.join(relativeDir, entry.name));
    const entryFull = path.join(full, entry.name);
    let real;
    try {
      real = fs.realpathSync(entryFull);
    } catch (err) {
      fail('BUILD_PATH_INVALID', `cannot resolve ${rel}: ${err.message}`);
    }
    if (!real.startsWith(root)) {
      fail('BUILD_PATH_INVALID', `symlink escape: ${rel}`);
    }
    if (entry.isDirectory()) {
      walkSorted(rel, out);
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }
  return out;
}

function main() {
  const files = {};
  const artifacts = [];
  const targetSeen = new Map();

  const seed = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.cursorrules'];
  const collected = [];
  for (const s of seed) {
    const full = path.join(root, s);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) collected.push(s);
  }
  collected.push(...walkSorted('templates'));
  collected.sort((a, b) => a.localeCompare(b));

  for (const relRaw of collected) {
    const rel = assertSafeRel(relRaw);
    if (isForbiddenSource(rel)) continue;
    const full = path.join(root, rel);
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) continue;
    if (targetSeen.has(rel)) {
      fail(
        'BUILD_TARGET_CONFLICT',
        `duplicate target ${rel} from ${targetSeen.get(rel)} and ${rel}`
      );
    }
    targetSeen.set(rel, rel);
    const content = fs.readFileSync(full, 'utf8');
    files[rel] = content;
    let type = 'file';
    if (rel.startsWith('templates/skills/')) type = 'skill';
    else if (rel.includes('/contracts/')) type = 'contract';
    else if (rel.includes('/schemas/')) type = 'schema';
    else if (rel.includes('/templates/')) type = 'template';
    else if (rel.includes('.cursor/')) type = 'adapter';
    else if (['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'templates/WORKFLOW.md'].includes(rel)) {
      type = 'governance';
    }
    artifacts.push({
      source: rel,
      target: `dist/bundle.json#files[${rel}]`,
      type,
      sha256: crypto.createHash('sha256').update(content, 'utf8').digest('hex')
    });
  }

  for (const req of REQUIRED_ARTIFACTS) {
    if (!Object.prototype.hasOwnProperty.call(files, req)) {
      fail('BUILD_REQUIRED_ARTIFACT_MISSING', req);
    }
  }

  // Guard: no plan skill / legacy templates in bundle
  for (const key of Object.keys(files)) {
    if (isForbiddenSource(key)) {
      fail('BUILD_VALIDATION_FAILED', `forbidden artifact bundled: ${key}`);
    }
  }

  if (fs.existsSync(distDir)) {
    for (const name of fs.readdirSync(distDir)) {
      fs.rmSync(path.join(distDir, name), { recursive: true, force: true });
    }
  } else {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const bundle = {
    version: require('../package.json').version,
    files
  };

  const bundleJson = JSON.stringify(bundle);
  fs.writeFileSync(path.join(distDir, 'bundle.json'), bundleJson, 'utf8');
  fs.copyFileSync(path.join(root, 'scripts', 'install.js'), path.join(distDir, 'install.js'));

  const buildManifest = {
    schemaVersion: 1,
    packageVersion: require('../package.json').version,
    artifacts: artifacts.sort((a, b) => a.source.localeCompare(b.source)),
    targets: ['claude', 'gemini', 'cursor'],
    validation: {
      requiredArtifacts: true,
      duplicates: false,
      legacyArtifacts: false
    },
    counts: {
      files: Object.keys(files).length
    }
  };
  fs.writeFileSync(
    path.join(distDir, 'build-manifest.json'),
    `${JSON.stringify(buildManifest, null, 2)}\n`,
    'utf8'
  );

  console.log(`[build] BUILD_PASSED`);
  console.log(`[build] dist/bundle.json — ${Object.keys(files).length} files`);
  console.log('[build] dist/install.js — copied');
  console.log('[build] dist/build-manifest.json — written');
}

try {
  main();
} catch (err) {
  if (!process.exitCode) process.exitCode = 1;
  if (!String(err.message || '').includes('BUILD_')) {
    console.error(`[build] BUILD_VALIDATION_FAILED: ${err.message}`);
  }
  process.exit(process.exitCode || 1);
}
