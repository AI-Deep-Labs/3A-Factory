'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

const REQUIRED_SKILLS = [
  'triage', 'grill-me', 'analyze', 'requirements', 'adr', 'design', 'tasks',
  'acceptance', 'spec-review', 'spec', 'project-manager', 'develop', 'review',
  'qa', 'converge', 'deploy'
];

const FORBIDDEN_ACTIVE = [
  /docs\/requirements\/REQ-.*-spec\.md/,
  /docs\/designs\/REQ-.*-plan\.md/,
  /`\/plan`/,
  /\/plan alias/i
];

const PACKAGE_STATUS = new Set([
  'new', 'triaged', 'clarifying', 'analyzed', 'specifying', 'validating',
  'awaiting_approval', 'approved', 'implementing', 'reviewing', 'qa',
  'converging', 'awaiting_user_review', 'done', 'blocked', 'rejected',
  'superseded', 'cancelled'
]);

const HAPPY_TRANSITIONS = {
  new: ['triaged'],
  triaged: ['clarifying', 'analyzed'],
  clarifying: ['analyzed', 'clarifying'],
  analyzed: ['specifying'],
  specifying: ['validating', 'specifying'],
  validating: ['awaiting_approval', 'specifying'],
  awaiting_approval: ['approved', 'specifying', 'rejected'],
  approved: ['implementing'],
  implementing: ['reviewing', 'blocked', 'implementing'],
  reviewing: ['implementing', 'qa', 'approved'],
  qa: ['converging', 'implementing', 'specifying', 'blocked'],
  converging: ['awaiting_user_review', 'blocked', 'implementing', 'specifying'],
  awaiting_user_review: ['done'],
  done: [],
  blocked: ['specifying', 'implementing', 'clarifying', 'analysed', 'analyzed'],
  rejected: [],
  superseded: [],
  cancelled: []
};

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function walk(relDir, acc = []) {
  const full = path.join(ROOT, relDir);
  if (!fs.existsSync(full)) return acc;
  for (const name of fs.readdirSync(full).sort()) {
    const rel = path.posix.join(relDir.replace(/\\/g, '/'), name);
    const st = fs.statSync(path.join(ROOT, rel));
    if (st.isDirectory()) walk(rel, acc);
    else acc.push(rel.replace(/\\/g, '/'));
  }
  return acc;
}

function parseFrontmatter(content, label) {
  const normalized = content.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) throw new Error(`missing frontmatter: ${label}`);
  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) throw new Error(`bad frontmatter: ${label}`);
  const fm = normalized.slice(4, end);
  const meta = {};
  for (const line of fm.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: normalized.slice(end + 5) };
}

function result(ok, token, details = []) {
  return { ok, token, details };
}

module.exports = {
  ROOT,
  REQUIRED_SKILLS,
  FORBIDDEN_ACTIVE,
  PACKAGE_STATUS,
  HAPPY_TRANSITIONS,
  read,
  exists,
  walk,
  parseFrontmatter,
  result
};
