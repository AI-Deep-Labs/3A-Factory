'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

function runBuild() {
  execFileSync(process.execPath, ['scripts/build.js'], { cwd: ROOT, stdio: 'pipe' });
}

describe('build', { concurrency: 1 }, () => {
  it('happy path produces bundle and build-manifest', () => {
    runBuild();
    assert.ok(fs.existsSync(path.join(ROOT, 'dist/bundle.json')));
    assert.ok(fs.existsSync(path.join(ROOT, 'dist/build-manifest.json')));
    assert.ok(fs.existsSync(path.join(ROOT, 'dist/install.js')));
    const bundle = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/bundle.json'), 'utf8'));
    assert.ok(bundle.files['templates/skills/workflow/converge.md']);
    assert.ok(bundle.files['templates/.agents/contracts/spec-package.md']);
    assert.ok(bundle.files['templates/.agents/rules/agent-mode.md']);
    assert.equal(bundle.files['templates/skills/workflow/plan.md'], undefined);
    assert.equal(bundle.files['templates/.agents/templates/SPEC-template.md'], undefined);
    assert.equal(bundle.files['templates/.agents/templates/PLAN-template.md'], undefined);
  });

  it('is deterministic for file set and content hashes', () => {
    runBuild();
    const a = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/bundle.json'), 'utf8'));
    const ha = crypto.createHash('sha256').update(JSON.stringify(a.files)).digest('hex');
    runBuild();
    const b = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/bundle.json'), 'utf8'));
    const hb = crypto.createHash('sha256').update(JSON.stringify(b.files)).digest('hex');
    assert.equal(ha, hb);
    assert.deepEqual(Object.keys(a.files).sort(), Object.keys(b.files).sort());
  });

  it('fails when required skill missing', () => {
    const skill = path.join(ROOT, 'templates/skills/workflow/converge.md');
    const bak = skill + '.baktest';
    fs.renameSync(skill, bak);
    try {
      assert.throws(() => runBuild());
    } finally {
      fs.renameSync(bak, skill);
      runBuild();
    }
  });
});
