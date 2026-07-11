#!/usr/bin/env node
/**
 * codegen/refresh-spec.mjs — fetch the live OpenAPI spec and repin it.
 *
 * Downloads the current spec from the live API and writes it to spec/openapi.json
 * (pretty-printed, stable key order via the source order). Does NOT regenerate —
 * run `pnpm run codegen` after, or use `pnpm run drift:check` which does both.
 *
 * Env:
 *   TAOSTATS_OPENAPI_URL  override the spec URL (default below).
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const URL = process.env.TAOSTATS_OPENAPI_URL || 'https://api-prod-v2.taostats.io/api/openapi.json';
const OUT = resolve(ROOT, 'spec/openapi.json');

const res = await fetch(URL);
if (!res.ok) {
  console.error(`✗ failed to fetch spec: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const spec = await res.json();
// Stable serialization so diffs are meaningful (2-space, trailing newline).
writeFileSync(OUT, JSON.stringify(spec, null, 2) + '\n');
console.log(`✓ repinned ${OUT} (version ${spec?.info?.version ?? 'unknown'}, ${Object.keys(spec?.paths ?? {}).length} paths)`);
