#!/usr/bin/env node
/**
 * codegen/generate.mjs — Phase 2 codegen driver.
 *
 * Pipeline:
 *   1. Load the pinned OpenAPI spec (spec/openapi.json).
 *   2. Patch in fallback definitions for schemas that are REFERENCED but NOT
 *      DEFINED upstream (a server-side bug in the Taostats OpenAPI export).
 *      Each patch is logged loudly so the list stays visible until the API is
 *      fixed. See MISSING_UPSTREAM below.
 *   3. Run openapi-typescript against the patched spec -> src/generated/schema.ts.
 *
 * Re-run with: pnpm run codegen
 *
 * NOTE: When the upstream spec adds these definitions, remove them from
 * MISSING_UPSTREAM — the driver warns if a "missing" schema is now present so
 * we don't shadow a real definition.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SPEC_IN = resolve(ROOT, 'spec/openapi.json');
const SPEC_PATCHED = resolve(ROOT, 'spec/.openapi.patched.json');
const OUT = resolve(ROOT, 'src/generated/schema.ts');

// Schemas referenced by the spec but never defined in components.schemas.
// Verified against v1.8.52. Fallbacks are intentionally permissive — real enum
// values / precision are unknown without the backend. Track upstream fix.
const MISSING_UPSTREAM = {
  // Big numbers are serialized as strings throughout this API (e.g. alpha shares).
  BigDecimal: { type: 'string', description: 'FALLBACK (missing upstream): big decimal serialized as string.' },
  // Enum-like discriminator/param fields; concrete members unknown from spec.
  ClaimType: { type: 'string', description: 'FALLBACK (missing upstream): claim type.' },
  Frequency: { type: 'string', description: 'FALLBACK (missing upstream): frequency.' },
  LiquidityPositionType: { type: 'string', description: 'FALLBACK (missing upstream): liquidity position type.' },
};

function main() {
  const spec = JSON.parse(readFileSync(SPEC_IN, 'utf8'));
  spec.components ??= {};
  spec.components.schemas ??= {};

  const patched = [];
  for (const [name, def] of Object.entries(MISSING_UPSTREAM)) {
    if (spec.components.schemas[name]) {
      console.warn(`  ℹ  ${name} is now DEFINED upstream — remove it from MISSING_UPSTREAM.`);
      continue; // never shadow a real definition
    }
    spec.components.schemas[name] = def;
    patched.push(name);
  }

  if (patched.length) {
    console.warn(`⚠  Patched ${patched.length} schema(s) missing from upstream spec: ${patched.join(', ')}`);
    console.warn('   These are server-side OpenAPI bugs. Fallback = permissive string. Track for upstream fix.');
  }

  // Every operation's operationId is literally "v1" upstream, which makes
  // openapi-typescript emit a single `operations` interface with dozens of
  // duplicate `v1` keys (TS2300 Duplicate identifier). We consume types via the
  // `paths` object (keyed by unique path) not `operations`, so strip operationId
  // to suppress the broken operations block entirely.
  let stripped = 0;
  for (const item of Object.values(spec.paths ?? {})) {
    for (const method of Object.keys(item)) {
      const op = item[method];
      if (op && typeof op === 'object' && 'operationId' in op) {
        delete op.operationId;
        stripped++;
      }
    }
  }
  if (stripped) console.warn(`⚠  Stripped ${stripped} non-unique operationId ("v1") to avoid duplicate-identifier collisions.`);

  writeFileSync(SPEC_PATCHED, JSON.stringify(spec));
  mkdirSync(dirname(OUT), { recursive: true });

  console.log('→ running openapi-typescript…');
  execSync(`npx openapi-typescript "${SPEC_PATCHED}" -o "${OUT}"`, { stdio: 'inherit', cwd: ROOT });
  console.log(`✓ generated ${OUT}`);

  console.log('→ emitting module classes…');
  execSync(`node "${resolve(__dirname, 'emit-modules.mjs')}"`, { stdio: 'inherit', cwd: ROOT });
}

main();
