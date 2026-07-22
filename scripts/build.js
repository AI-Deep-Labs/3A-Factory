#!/usr/bin/env node

/**
 * Build publish bundle — templates are embedded in dist/bundle.json
 * so npm "Code" tab does not expose readable source tree (templates/, scripts/).
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const files = {};

function normalizeRel(relPath) {
  return relPath.replace(/\\/g, '/');
}

function addFile(relativePath) {
  const rel = normalizeRel(relativePath);
  const full = path.join(root, rel);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return;
  files[rel] = fs.readFileSync(full, 'utf8');
}

function walkDirectory(relativeDir) {
  const full = path.join(root, relativeDir);
  if (!fs.existsSync(full)) return;

  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = normalizeRel(path.join(relativeDir, entry.name));
    const entryFull = path.join(full, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(rel);
    } else if (entry.isFile()) {
      addFile(rel);
    }
  }
}

['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.cursorrules'].forEach(addFile);
walkDirectory('templates');

const bundle = {
  version: require('../package.json').version,
  files
};

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'bundle.json'), JSON.stringify(bundle), 'utf8');
fs.copyFileSync(path.join(root, 'scripts', 'install.js'), path.join(distDir, 'install.js'));

console.log(`[build] dist/bundle.json — ${Object.keys(files).length} template files`);
console.log('[build] dist/install.js — copied from scripts/install.js');
