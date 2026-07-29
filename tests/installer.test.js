'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function install(cwd, extraArgs = [], env = {}) {
  return execFileSync(
    process.execPath,
    ['scripts/install.js', '--cwd', cwd, ...extraArgs, '--json'],
    { cwd: ROOT, encoding: 'utf8', env: { ...process.env, ...env } }
  );
}

/** Simulate npm/npx lifecycle: no --cwd; target comes from INIT_CWD (like real postinstall). */
function installAsNpmLifecycle(initCwd, lifecycle = 'postinstall', extraArgs = [], env = {}) {
  return execFileSync(process.execPath, ['scripts/install.js', ...extraArgs, '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env,
      npm_lifecycle_event: lifecycle,
      INIT_CWD: initCwd
    }
  });
}

function listAgentMarkers(dir) {
  return {
    shared: fs.existsSync(path.join(dir, 'AGENTS.md')),
    gemini: fs.existsSync(path.join(dir, 'GEMINI.md')),
    claude: fs.existsSync(path.join(dir, 'CLAUDE.md')),
    geminiDir: fs.existsSync(path.join(dir, '.gemini')),
    claudeDir: fs.existsSync(path.join(dir, '.claude')),
    cursorDir: fs.existsSync(path.join(dir, '.cursor'))
  };
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
      assert.ok(fs.existsSync(path.join(tmp, '.agents/rules/agent-mode.md')));
      const agentMode = fs.readFileSync(path.join(tmp, '.agents/rules/agent-mode.md'), 'utf8');
      assert.match(agentMode, /No Internal Planning Mode/);
      assert.match(agentMode, /No Hidden Artifacts/);
      const agentsMd = fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8');
      assert.match(agentsMd, /\.agents\/rules\/agent-mode\.md/);
      assert.ok(!fs.existsSync(path.join(tmp, 'docs', 'tasks')));
      assert.ok(!fs.existsSync(path.join(tmp, '.specs')));
      assert.ok(!fs.existsSync(path.join(tmp, '.3a-factory')));
      assert.ok(fs.existsSync(path.join(tmp, 'docs')));
      assert.ok(!fs.existsSync(path.join(tmp, 'docs/decisions')));
      assert.ok(!fs.existsSync(path.join(tmp, 'docs/misc')));
      if (agent === 'claude') {
        const claudeMd = fs.readFileSync(path.join(tmp, 'CLAUDE.md'), 'utf8');
        assert.match(claudeMd, /\.agents\/rules\/agent-mode\.md/);
        assert.ok(fs.existsSync(path.join(tmp, '.claude/skills/develop/SKILL.md')));
        assert.ok(!fs.existsSync(path.join(tmp, '.claude/skills/plan')));
        const pmClaude = fs.readFileSync(path.join(tmp, '.claude/commands/project-manager.md'), 'utf8');
        assert.match(pmClaude, /MANDATORY PM MODE/);
        assert.match(pmClaude, /Session orchestration/);
        const triageClaude = fs.readFileSync(path.join(tmp, '.claude/commands/triage.md'), 'utf8');
        assert.match(triageClaude, /# Triage/);
        assert.match(triageClaude, /Classify a raw request/);
      }
      if (agent === 'gemini') {
        const geminiMd = fs.readFileSync(path.join(tmp, 'GEMINI.md'), 'utf8');
        assert.match(geminiMd, /\.agents\/rules\/agent-mode\.md/);
        assert.ok(fs.existsSync(path.join(tmp, '.gemini/commands/converge.toml')));
        assert.ok(fs.existsSync(path.join(tmp, '.agents/skills/converge/SKILL.md')));
        assert.ok(!fs.existsSync(path.join(tmp, '.gemini/skills')));
        const toml = fs.readFileSync(path.join(tmp, '.gemini/commands/triage.toml'), 'utf8');
        assert.match(toml, /^description = "/);
        assert.match(toml, /# Triage/);
        assert.match(toml, /Classify a raw request/);
        const pmGemini = fs.readFileSync(path.join(tmp, '.gemini/commands/project-manager.toml'), 'utf8');
        assert.match(pmGemini, /MANDATORY PM MODE/);
      }
      if (agent === 'cursor') {
        const workflow = fs.readFileSync(path.join(tmp, '.cursor/rules/ai-workflow.mdc'), 'utf8');
        assert.match(workflow, /\.agents\/rules\/agent-mode\.md/);
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
        const pmRule = fs.readFileSync(path.join(tmp, '.cursor/rules/project-manager.mdc'), 'utf8');
        assert.match(pmRule, /MANDATORY PM MODE/);
        assert.match(pmRule, /Slash invocation \(mandatory\)/);
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

describe('installer npx/postinstall regression', () => {
  before(() => {
    execFileSync(process.execPath, ['scripts/build.js'], { cwd: ROOT, stdio: 'pipe' });
  });

  it('skips scaffolding during npm postinstall with INIT_CWD (no --agent)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-life-post-'));
    const out = installAsNpmLifecycle(tmp, 'postinstall');
    const report = JSON.parse(out);
    assert.equal(report.result, 'INSTALL_SKIPPED_LIFECYCLE');
    assert.equal(report.lifecycle, 'postinstall');
    assert.deepEqual(listAgentMarkers(tmp), {
      shared: false,
      gemini: false,
      claude: false,
      geminiDir: false,
      claudeDir: false,
      cursorDir: false
    });
  });

  it('npx simulation: postinstall must not install all agents; CLI --agent=gemini installs only gemini', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-npx-sim-'));

    // Step 1: npm/npx package install lifecycle (historically defaulted to all agents into INIT_CWD)
    const lifeOut = installAsNpmLifecycle(tmp, 'postinstall');
    assert.equal(JSON.parse(lifeOut).result, 'INSTALL_SKIPPED_LIFECYCLE');
    assert.deepEqual(listAgentMarkers(tmp), {
      shared: false,
      gemini: false,
      claude: false,
      geminiDir: false,
      claudeDir: false,
      cursorDir: false
    });

    // Step 2: bin/CLI with user flag (what npx runs after install)
    const cliOut = install(tmp, ['--agent=gemini', '--apply']);
    assert.equal(JSON.parse(cliOut).result, 'INSTALL_PASSED');
    const m = listAgentMarkers(tmp);
    assert.equal(m.shared, true);
    assert.equal(m.gemini, true);
    assert.equal(m.geminiDir, true);
    assert.equal(m.claude, false);
    assert.equal(m.claudeDir, false);
    assert.equal(m.cursorDir, false);
  });

  it('regression: postinstall after gemini-only install must not add claude/cursor', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-reg-post-'));
    install(tmp, ['--agent=gemini', '--apply']);
    assert.equal(listAgentMarkers(tmp).claudeDir, false);
    assert.equal(listAgentMarkers(tmp).cursorDir, false);

    const lifeOut = installAsNpmLifecycle(tmp, 'postinstall');
    assert.equal(JSON.parse(lifeOut).result, 'INSTALL_SKIPPED_LIFECYCLE');

    const m = listAgentMarkers(tmp);
    assert.equal(m.gemini, true);
    assert.equal(m.geminiDir, true);
    assert.equal(m.claude, false);
    assert.equal(m.claudeDir, false);
    assert.equal(m.cursorDir, false);
  });

  it('lifecycle skip ignores npm_config_agent=all (must not scaffold via postinstall)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-cfg-agent-'));
    const out = installAsNpmLifecycle(tmp, 'postinstall', [], {
      npm_config_agent: 'all'
    });
    assert.equal(JSON.parse(out).result, 'INSTALL_SKIPPED_LIFECYCLE');
    assert.deepEqual(listAgentMarkers(tmp), {
      shared: false,
      gemini: false,
      claude: false,
      geminiDir: false,
      claudeDir: false,
      cursorDir: false
    });
  });

  it('explicit CLI without lifecycle still defaults to all agents', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), '3a-default-all-'));
    const out = install(tmp, ['--apply']);
    const report = JSON.parse(out);
    assert.equal(report.result, 'INSTALL_PASSED');
    const m = listAgentMarkers(tmp);
    assert.equal(m.shared, true);
    assert.equal(m.gemini, true);
    assert.equal(m.claude, true);
    assert.equal(m.geminiDir, true);
    assert.equal(m.claudeDir, true);
    assert.equal(m.cursorDir, true);
  });
});
