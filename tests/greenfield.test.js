'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const v = require('../scripts/validation');

const ROOT = path.resolve(__dirname, '..');

describe('greenfield + validators', () => {
  it('has no plan skill or legacy SPEC/PLAN templates', () => {
    assert.equal(fs.existsSync(path.join(ROOT, 'templates/skills/workflow/plan.md')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'templates/.agents/templates/SPEC-template.md')), false);
    assert.equal(fs.existsSync(path.join(ROOT, 'templates/.agents/templates/PLAN-template.md')), false);
  });

  it('greenfield validator passes', () => {
    const r = v.validateGreenfield();
    assert.equal(r.ok, true, r.details.join('\n'));
  });

  it('skill contracts pass', () => {
    const r = v.validateSkillContracts();
    assert.equal(r.ok, true, r.details.join('\n'));
  });

  it('templates pass', () => {
    const r = v.validateTemplateReferences();
    assert.equal(r.ok, true, r.details.join('\n'));
  });

  it('governance consistent', () => {
    const r = v.validateGovernanceConsistency();
    assert.equal(r.ok, true, r.details.join('\n'));
  });

  it('adapter parity', () => {
    const r = v.validateAdapterParity();
    assert.equal(r.ok, true, r.details.join('\n'));
  });

  it('state flow validator', () => {
    const r = v.validateStateFlow();
    assert.equal(r.ok, true, r.details.join('\n'));
  });

  it('detects circular task dependency', () => {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), '3a-trace-'));
    fs.writeFileSync(
      path.join(tmp, 'tasks.md'),
      '### TASK-001\nDependencies\n- TASK-002\n### TASK-002\nDependencies\n- TASK-001\n',
      'utf8'
    );
    const r = v.validateTraceability(tmp);
    assert.equal(r.ok, false);
    assert.ok(r.details.some((d) => d.includes('CIRCULAR_TASK_DEPENDENCY')));
  });

  it('manifest folder mismatch', () => {
    const { validateManifestFile } = require('../scripts/validation/validate-manifest');
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), '3a-man-'));
    const man = path.join(tmp, 'manifest.yaml');
    fs.writeFileSync(
      man,
      [
        'schema_version: 1',
        'id: REQ-000001',
        'slug: other-slug',
        'title: t',
        'risk: low',
        'status: new',
        'artifacts:',
        'decisions:',
        'validation:',
        'approval:',
        'execution:',
        'review:',
        'qa:'
      ].join('\n'),
      'utf8'
    );
    const r = validateManifestFile(man, 'REQ-000001-demo-feature');
    assert.equal(r.ok, false);
  });
});
