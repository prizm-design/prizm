#!/usr/bin/env tsx
/**
 * Offline release builder
 * ------------------------------------------------------------
 * Produces two artifacts for air-gapped consumers:
 *
 *   prizm-offline-<version>.tar.gz
 *     Source + a complete pnpm store, ready for `pnpm install --offline`.
 *
 *   prizm-docs-<version>.tar.gz
 *     Pre-built static docs site, ready to be served from any static
 *     file server in a secured environment.
 *
 * Run with:  pnpm build:offline
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));
const version = pkg.version;

function run(cmd: string) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: "inherit" });
}

console.log(`PRIZM offline build — version ${version}\n`);

// 1. Run the air-gap audit first. If this fails, the build aborts.
run("pnpm audit:airgap");

// 2. Build the static docs site.
run("pnpm build");

// 3. Bundle the offline pnpm store.
//    Requires `pnpm fetch` to be run beforehand on an internet-connected machine.
run("pnpm fetch --prod");
run(`tar -czf prizm-offline-${version}.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=prizm-offline-*.tar.gz \
  --exclude=prizm-docs-*.tar.gz \
  .`);

// 4. Bundle the pre-built static docs.
run(`tar -czf prizm-docs-${version}.tar.gz -C out .`);

console.log(`\n✓ Built prizm-offline-${version}.tar.gz`);
console.log(`✓ Built prizm-docs-${version}.tar.gz`);
console.log("\nTransfer both files via your approved process into the air-gapped environment.");
console.log("Then follow OFFLINE_SETUP.md to ingest.");
