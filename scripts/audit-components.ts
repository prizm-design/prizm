#!/usr/bin/env tsx
/**
 * Component audit
 * ------------------------------------------------------------
 * Verifies that the component registry and the component-API surface
 * agree, and that no API entry is a stub. Catches drift between the
 * three places a new component gets registered:
 *
 *   lib/components-registry.ts   — what the docs site lists
 *   lib/components-api.ts        — what props each component documents
 *   components/ui/<slug>.tsx     — the actual implementation
 *
 * Three assertions:
 *   1. Every registry slug has a matching key in COMPONENT_API
 *   2. Every COMPONENT_API key has a matching entry in the registry
 *   3. Every COMPONENT_API entry documents at least one prop OR one
 *      sub-component (otherwise the entry is almost certainly a stub).
 *      Some components legitimately expose no root-level props but a
 *      rich set of sub-components — Toast and ContextMenu are examples.
 *
 * Exits 1 on any violation so CI fails fast.
 *
 * Run locally with:  pnpm audit:components
 */

import { COMPONENT_API } from "../lib/components-api";
import { COMPONENTS } from "../lib/components-registry";

const registrySlugs = new Set(COMPONENTS.map((c) => c.slug));
const apiSlugs = new Set(Object.keys(COMPONENT_API));

const missingFromApi: string[] = [];
const missingFromRegistry: string[] = [];
const stubEntries: string[] = [];

for (const slug of registrySlugs) {
  if (!apiSlugs.has(slug)) missingFromApi.push(slug);
}

for (const slug of apiSlugs) {
  if (!registrySlugs.has(slug)) missingFromRegistry.push(slug);
  const entry = COMPONENT_API[slug];
  const propCount = entry?.props?.length ?? 0;
  const subComponentCount = entry?.subComponents?.length ?? 0;
  if (propCount + subComponentCount === 0) stubEntries.push(slug);
}

const violations = missingFromApi.length + missingFromRegistry.length + stubEntries.length;

if (violations === 0) {
  console.log(
    `✓ Component audit clean. ${registrySlugs.size} components in registry, ${apiSlugs.size} in COMPONENT_API, all aligned.`,
  );
  process.exit(0);
}

console.error("✗ Component audit failed.\n");

if (missingFromApi.length > 0) {
  console.error(
    `  ${missingFromApi.length} component(s) in lib/components-registry.ts have no entry in lib/components-api.ts:`,
  );
  for (const slug of missingFromApi) console.error(`    - ${slug}`);
  console.error("");
}

if (missingFromRegistry.length > 0) {
  console.error(
    `  ${missingFromRegistry.length} entry/entries in lib/components-api.ts have no slug in lib/components-registry.ts:`,
  );
  for (const slug of missingFromRegistry) console.error(`    - ${slug}`);
  console.error("");
}

if (stubEntries.length > 0) {
  console.error(
    `  ${stubEntries.length} COMPONENT_API entry/entries document zero props AND zero sub-components (likely a stub):`,
  );
  for (const slug of stubEntries) console.error(`    - ${slug}`);
  console.error("");
}

console.error(
  "Resolution: register the component in both files and document at least its primary props or sub-components in COMPONENT_API.",
);

process.exit(1);
