'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function skill(name) {
  return fs.readFileSync(path.join(ROOT, 'templates/skills/workflow', `${name}.md`), 'utf8');
}

describe('workflow regression (static)', () => {
  it('spec is package orchestrator and stops for APPROVED_SPEC_PACKAGE', () => {
    const s = skill('spec');
    assert.match(s, /Package Orchestrator/i);
    assert.match(s, /APPROVED_SPEC_PACKAGE/);
    assert.doesNotMatch(s, /Write `docs\/requirements\/REQ-.*-spec\.md`/);
  });

  it('ownership: requirements/design/tasks/acceptance', () => {
    assert.match(skill('requirements'), /Business Truth/);
    assert.match(skill('design'), /Technical Truth/);
    assert.match(skill('tasks'), /Execution Truth/);
    assert.match(skill('acceptance'), /Verification Truth/);
  });

  it('develop approval and dependency gates', () => {
    const d = skill('develop');
    assert.match(d, /APPROVED_SPEC_PACKAGE/);
    assert.match(d, /TASK_DEPENDENCY_BLOCKED|dependencies == done/);
    assert.match(d, /APPROVAL_REQUIRED/);
  });

  it('review alone marks task done', () => {
    const r = skill('review');
    assert.match(r, /task\.status:\s*done/);
    assert.match(r, /Only this skill/i);
  });

  it('qa bounded loop and defect routing', () => {
    const q = skill('qa');
    assert.match(q, /max = 3|Maximum attempts:\s*\*\*3\*\*/i);
    assert.match(q, /QA_IMPLEMENTATION_BUG/);
    assert.match(q, /QA_SPEC_DEFECT/);
    assert.match(q, /invalidated/);
    assert.match(q, /QA_LOOP_LIMIT_REACHED/);
  });

  it('converge does not mark done', () => {
    const c = skill('converge');
    assert.match(c, /awaiting_user_review/);
    assert.match(c, /Do \*\*not\*\* set `done`/);
  });

  it('deploy requires APPROVED_DEPLOY', () => {
    const d = skill('deploy');
    assert.match(d, /APPROVED_DEPLOY/);
    assert.match(d, /DEPLOY_APPROVAL_REQUIRED/);
    assert.match(d, /manifest\.status == done/);
  });

  it('project-manager routes states', () => {
    const pm = skill('project-manager');
    assert.match(pm, /awaiting_approval/);
    assert.match(pm, /APPROVED_USER_REVIEW/);
    assert.match(pm, /converge/);
  });
});
