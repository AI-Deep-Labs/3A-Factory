'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function install(cwd, extraArgs = []) {
  return execFileSync(
    process.execPath,
    ['scripts/install.js', '--cwd', cwd, ...extraArgs, '--json'],
    { cwd: ROOT, encoding: 'utf8' }
  );
}

describe('installer smoke', () => {
  before(() => {
    execFileSync(process.execPath, ['scripts/build.js'], { cwd: ROOT, stdio: 'pipe' });
  });

  for (const agent of ['claude', 'gemini', 'cursor']) {
    it(`installs ${agent}`, () => {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `3a-${agent}-`));
      const out = install(tmp, [`--agent=${agent}`, '--apply']);
      const report = JSON.parse(out);
      assert.equal(report.result, 'INSTALL_PASSED');
      assert.ok(fs.existsSync(path.join(tmp, 'AGENTS.md')));
      assert.ok(fs.existsSync(path.join(tmp, '.agents/contracts/spec-package.md')));
      assert.ok(fs.existsSync(path.join(tmp, '.agents/schemas/spec-package-manifest.schema.json')));
      assert.ok(!fs.existsSync(path.join(tmp, '.specs')));
      assert.ok(!fs.existsSync(path.join(tmp, '.3a-factory')));
      assert.ok(fs.existsSync(path.join(tmp, 'docs')));
      assert.ok(!fs.existsSync(path.join(tmp, 'docs/decisions')));
      assert.ok(!fs.existsSync(path.join(tmp, 'docs/misc')));
      if (agent === 'claude') {
        assert.ok(fs.existsSync(path.join(tmp, '.claude/skills/develop/SKILL.md')));
        assert.ok(!fs.existsSync(path.join(tmp, '.claude/skills/plan')));
      }
      if (agent === 'gemini') {
        assert.ok(fs.existsSync(path.join(tmp, '.gemini/commands/converge.toml')));
        assert.ok(fs.existsSync(path.join(tmp, '.agents/skills/converge/SKILL.md')));
        assert.ok(!fs.existsSync(path.join(tmp, '.gemini/skills')));
        const toml = fs.readFileSync(path.join(tmp, '.gemini/commands/triage.toml'), 'utf8');
        assert.match(toml, /^description = "/);
        assert.match(toml, /\.agents\/skills\/triage\/SKILL\.md/);
      }
      if (agent === 'cursor') {
        assert.ok(fs.existsSync(path.join(tmp, '.cursor/rules/ai-workflow.mdc')));
        assert.ok(fs.existsSync(path.join(tmp, '.cursor/rules/triage.mdc')));
        assert.ok(fs.existsSync(path.join(tmp, '.agents/skills/tasks/SKILL.md')));
        assert.ok(!fs.existsSync(path.join(tmp, '.cursor/skills')));
        assert.ok(!fs.existsSync(path.join(tmp, '.cursor/commands')));
        const rule = fs.readFileSync(path.join(tmp, '.cursor/rules/triage.mdc'), 'utf8');
        assert.match(rule, /description: "/);
        assert.match(rule, /globs: \*/);
        assert.match(rule, /alwaysApply: false/);
        assert.match(rule, /# Triage/);
        assert.doesNotMatch(rule, /^name: triage$/m);
        const shared = fs.readFileSync(path.join(tmp, '.agents/skills/triage/SKILL.md'), 'utf8');
        assert.match(shared, /^---\nname: triage\n/);
        assert.match(shared, /disable-model-invocation: true/);
      }
    });
  }

  it('second install is idempotent (unchanged)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-idem-'));
    install(tmp, ['--agent=cursor', '--apply']);
    const out2 = install(tmp, ['--agent=cursor', '--apply']);
    const report = JSON.parse(out2);
    assert.equal(report.result, 'INSTALL_PASSED');
    assert.ok(report.unchangedFiles.length > 0);
    assert.equal(report.updatedFiles.length, 0);
    assert.equal(report.installedFiles.length, 0);
  });

  it('detects conflict without --force', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-conflict-'));
    install(tmp, ['--agent=claude', '--apply']);
    fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# customized\n', 'utf8');
    let report;
    try {
      install(tmp, ['--agent=claude', '--apply']);
      assert.fail('expected conflict exit');
    } catch (err) {
      report = JSON.parse(String(err.stdout || ''));
    }
    assert.equal(report.result, 'INSTALL_CONFLICT');
    assert.ok(report.conflicts.includes('AGENTS.md'));
  });

  it('force creates backup', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-force-'));
    install(tmp, ['--agent=claude', '--apply']);
    fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# customized\n', 'utf8');
    const out = install(tmp, ['--agent=claude', '--apply', '--force']);
    const report = JSON.parse(out);
    assert.equal(report.result, 'INSTALL_PASSED');
    assert.ok(report.backups.length >= 1);
  });

  it('rejects invalid target', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-bad-'));
    assert.throws(() => install(tmp, ['--agent=nope']));
  });

  it('dry-run does not write files', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-dry-'));
    const out = install(tmp, ['--agent=cursor', '--dry-run']);
    const report = JSON.parse(out);
    assert.equal(report.result, 'INSTALL_DRY_RUN');
    assert.ok(!fs.existsSync(path.join(tmp, 'AGENTS.md')));
  });
});
