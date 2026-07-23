#!/usr/bin/env node
'use strict';

const validators = require('./index');
const { validateSchemaJson } = require('./validate-manifest');

const suites = [
  ['manifest-schema', () => validateSchemaJson()],
  ['greenfield', () => validators.validateGreenfield()],
  ['skills', () => validators.validateSkillContracts()],
  ['templates', () => validators.validateTemplateReferences()],
  ['governance', () => validators.validateGovernanceConsistency()],
  ['adapters', () => validators.validateAdapterParity()],
  ['build-output', () => validators.validateBuildOutput()],
  ['state-flow', () => validators.validateStateFlow()],
  ['package-layout', () => validators.validatePackageLayout()]
];

let failed = 0;
for (const [name, fn] of suites) {
  const r = fn();
  const mark = r.ok ? 'PASS' : 'FAIL';
  console.log(`[validate:${name}] ${mark} ${r.token}`);
  if (!r.ok) {
    failed++;
    for (const d of r.details.slice(0, 20)) console.log(`  - ${d}`);
  }
}

if (failed) {
  console.error(`[validate] FAILED (${failed} suites)`);
  process.exit(1);
}
console.log('[validate] ALL_PASSED');
