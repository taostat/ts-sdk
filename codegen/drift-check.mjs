#!/usr/bin/env node
/**
 * codegen/drift-check.mjs — the anti-rot gate.
 *
 * 1. Snapshot the current pinned spec version + endpoint set.
 * 2. Refresh the spec from the live API and regenerate.
 * 3. If anything under spec/ or src/generated/ changed, exit NON-ZERO and print
 *    a human summary of the drift (version bump, added/removed endpoints).
 *    CI uses the non-zero exit to fail the job and open an auto-PR.
 *
 * Clean (no drift) -> exit 0, prints "no drift".
 *
 * Usage:
 *   node codegen/drift-check.mjs            # refresh + regen + diff
 *   node codegen/drift-check.mjs --no-fetch # regen from pinned spec only
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const noFetch = process.argv.includes('--no-fetch');

const specPath = resolve(ROOT, 'spec/openapi.json');
const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: 'pipe' }).toString();

function loadSpec(fromGit = false) {
  const raw = fromGit
    ? run('git show HEAD:spec/openapi.json')
    : readFileSync(specPath, 'utf8');
  const s = JSON.parse(raw);
  const endpoints = new Set();
  for (const [p, item] of Object.entries(s.paths ?? {}))
    for (const m of Object.keys(item))
      if (['get', 'post', 'put', 'delete', 'patch'].includes(m)) endpoints.add(`${m.toUpperCase()} ${p}`);
  return { version: s?.info?.version, endpoints };
}

// Baseline = the spec as committed at HEAD (not the working tree, which the
// refresh step is about to overwrite).
const before = loadSpec(true);

if (!noFetch) {
  console.log('→ refreshing spec from live API…');
  run('node codegen/refresh-spec.mjs');
}
console.log('→ regenerating…');
run('node codegen/generate.mjs');

const after = loadSpec();

// Report semantic drift
const added = [...after.endpoints].filter((e) => !before.endpoints.has(e)).sort();
const removed = [...before.endpoints].filter((e) => !after.endpoints.has(e)).sort();
const versionChanged = before.version !== after.version;

// Detect any file drift (spec + generated) via git.
const dirty = run('git status --porcelain -- spec src/generated').trim();

if (!dirty) {
  console.log(`✓ no drift (spec version ${after.version}). Generated output up to date.`);
  process.exit(0);
}

console.error('\n════════ API DRIFT DETECTED ════════');
if (versionChanged) console.error(`  spec version: ${before.version} → ${after.version}`);
if (added.length) {
  console.error(`\n  + ${added.length} endpoint(s) ADDED:`);
  for (const e of added) console.error(`      + ${e}`);
}
if (removed.length) {
  console.error(`\n  - ${removed.length} endpoint(s) REMOVED (may break the SDK!):`);
  for (const e of removed) console.error(`      - ${e}`);
}
console.error('\n  Changed files:');
console.error(dirty.split('\n').map((l) => '      ' + l).join('\n'));
console.error('\n  Regenerated output is committed on the drift branch — review the PR.');
console.error('════════════════════════════════════\n');
process.exit(1);
