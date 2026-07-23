'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, result, exists, read } = require('./lib');

function parseSimpleYaml(text) {
  // Semantic YAML subset for manifest validation (not a full YAML parser).
  const obj = {};
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const stack = [{ indent: -1, obj }];
  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.match(/^\s*/)[0].length;
    const line = raw.trim();
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (line.startsWith('- ')) {
      const val = line.slice(2).trim();
      if (!Array.isArray(parent._arr)) parent._arr = [];
      if (val.includes(':')) {
        const [k, ...rest] = val.split(':');
        const item = {};
        item[k.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
        parent._arr.push(item);
        stack.push({ indent, obj: item });
      } else {
        parent._arr.push(val === 'null' ? null : val.replace(/^"|"$/g, ''));
      }
      continue;
    }
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val === '') {
      const child = {};
      parent[key] = child;
      stack.push({ indent, obj: child });
    } else if (val === 'null') parent[key] = null;
    else if (val === '{}' ) parent[key] = {};
    else if (val === '[]') parent[key] = [];
    else if (/^\d+$/.test(val)) parent[key] = Number(val);
    else parent[key] = val.replace(/^"|"$/g, '');
  }
  return obj;
}

function validateManifestObject(manifest, folderName) {
  const details = [];
  const req = [
    'schema_version', 'id', 'slug', 'title', 'risk', 'status',
    'artifacts', 'decisions', 'validation', 'approval', 'execution', 'review', 'qa'
  ];
  for (const k of req) {
    if (manifest[k] === undefined) details.push(`missing field: ${k}`);
  }
  if (manifest.schema_version !== 1 && manifest.schema_version !== '1') {
    details.push('schema_version must be 1');
  }
  if (manifest.id && !/^REQ-[0-9]{6}$/.test(String(manifest.id))) {
    details.push(`invalid id: ${manifest.id}`);
  }
  if (manifest.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(manifest.slug))) {
    details.push(`invalid slug: ${manifest.slug}`);
  }
  if (folderName) {
    const m = folderName.match(/^REQ-([0-9]{6})-(.+)$/);
    if (!m) details.push(`invalid package folder: ${folderName}`);
    else {
      if (manifest.id !== `REQ-${m[1]}`) details.push('folder/manifest id mismatch');
      if (manifest.slug !== m[2]) details.push('folder/manifest slug mismatch');
    }
  }
  if (!['low', 'medium', 'high'].includes(manifest.risk)) details.push(`invalid risk: ${manifest.risk}`);
  return details;
}

function validateManifestFile(manifestPath, folderName) {
  if (!fs.existsSync(manifestPath)) {
    return result(false, 'MANIFEST_INVALID', ['manifest missing']);
  }
  const text = fs.readFileSync(manifestPath, 'utf8');
  const manifest = parseSimpleYaml(text);
  const details = validateManifestObject(manifest, folderName);
  return details.length
    ? result(false, 'MANIFEST_INVALID', details)
    : result(true, 'MANIFEST_VALID', []);
}

function validateSchemaJson() {
  const rel = 'templates/.agents/schemas/spec-package-manifest.schema.json';
  if (!exists(rel)) return result(false, 'MANIFEST_INVALID', ['schema missing']);
  try {
    JSON.parse(read(rel));
    return result(true, 'MANIFEST_VALID', ['schema JSON parse OK (semantic validator, not full AJV)']);
  } catch (err) {
    return result(false, 'MANIFEST_INVALID', [err.message]);
  }
}

module.exports = {
  parseSimpleYaml,
  validateManifestObject,
  validateManifestFile,
  validateSchemaJson
};
