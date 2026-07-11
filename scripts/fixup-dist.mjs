#!/usr/bin/env node
/**
 * scripts/fixup-dist.mjs — finalize the dual build:
 *   1. Write per-directory package.json markers so Node resolves each format:
 *        dist/cjs/package.json -> { "type": "commonjs" }
 *        dist/esm/package.json -> { "type": "module" }
 *   2. Add explicit .js extensions to relative imports/exports in the ESM
 *      output. TypeScript emits extensionless specifiers (fine for CJS/bundlers)
 *      but native Node ESM requires them, so we rewrite them post-build.
 *
 * Run after `tsc -p tsconfig.cjs.json` + `tsc -p tsconfig.esm.json`.
 */
import { writeFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// 1. format markers
for (const [rel, content] of [
  ['dist/cjs/package.json', { type: 'commonjs' }],
  ['dist/esm/package.json', { type: 'module' }],
]) {
  const p = resolve(ROOT, rel);
  if (!existsSync(dirname(p))) mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(content, null, 2) + '\n');
  console.log(`✓ wrote ${rel}`);
}

// 2. add .js extensions to relative specifiers in ESM .js output
const ESM_DIR = resolve(ROOT, 'dist/esm');

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.js')) fixFile(full);
  }
}

// Rewrite:  from './x'  /  from '../y/z'   ->  add /index.js if it's a dir,
// else .js. We can check the emitted filesystem to decide dir-vs-file.
function fixFile(file) {
  const src = readFileSync(file, 'utf8');
  const re = /(from\s+|import\s*\(\s*)(['"])(\.\.?\/[^'"]+)(['"])/g;
  let changed = false;
  const out = src.replace(re, (m, pre, q1, spec, q2) => {
    if (/\.(js|json|mjs|cjs)$/.test(spec)) return m; // already has ext
    const base = resolve(dirname(file), spec);
    let target;
    if (existsSync(base) && statSync(base).isDirectory()) {
      target = `${spec}/index.js`;
    } else {
      target = `${spec}.js`;
    }
    changed = true;
    return `${pre}${q1}${target}${q2}`;
  });
  if (changed) writeFileSync(file, out);
}

if (existsSync(ESM_DIR)) {
  walk(ESM_DIR);
  console.log('✓ added .js extensions to ESM relative imports');
}
