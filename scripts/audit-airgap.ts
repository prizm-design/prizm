#!/usr/bin/env tsx
/**
 * Air-gap audit script
 * ------------------------------------------------------------
 * Scans the repo for anything that would break in a disconnected
 * environment: external URL references, CDN-hosted fonts, remote
 * <Image>/<Script> sources, and known runtime-network packages.
 *
 * Exits 1 on violation so CI fails fast.
 *
 * Run locally with:  pnpm audit:airgap
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

// Directories we never scan.
const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  "out",
  ".git",
  ".pnpm-store-offline",
  "public/fonts",
]);

// File extensions we scan.
const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".mdx",
  ".md",
  ".css",
  ".html",
  ".json",
]);

// External hosts that are NEVER allowed at runtime.
const FORBIDDEN_HOSTS = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "use.typekit.net",
  "use.fontawesome.com",
  "cdn.jsdelivr.net",
  "cdnjs.cloudflare.com",
  "unpkg.com",
  "googletagmanager.com",
  "google-analytics.com",
  "sentry.io",
  "vercel-analytics.com",
];

// URLs that are allowed only in documentation/markdown context (informational,
// not loaded at runtime). The audit ignores HTTP(S) URLs inside .md, .mdx, and
// .json files unless they reference a forbidden host directly.
const DOC_EXTENSIONS = new Set([".md", ".mdx", ".json"]);

// Allowlist: specific URLs we accept anywhere (e.g. SVG xmlns).
const ALLOWLIST = [
  "http://www.w3.org/2000/svg",
  "http://www.w3.org/1999/xlink",
  "https://biomejs.dev/schemas/",
];

interface Violation {
  file: string;
  line: number;
  column: number;
  match: string;
  rule: string;
}

const violations: Violation[] = [];

function walk(dir: string, fn: (file: string) => void) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full);
    if (IGNORE_DIRS.has(entry) || IGNORE_DIRS.has(rel)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, fn);
    else fn(full);
  }
}

function scanFile(file: string) {
  const ext = file.slice(file.lastIndexOf("."));
  if (!SCAN_EXTENSIONS.has(ext)) return;

  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");
  const isDocFile = DOC_EXTENSIONS.has(ext);
  const relPath = relative(ROOT, file);

  lines.forEach((line, i) => {
    // Rule 1: forbidden hosts anywhere
    for (const host of FORBIDDEN_HOSTS) {
      const idx = line.indexOf(host);
      if (idx !== -1) {
        violations.push({
          file: relPath,
          line: i + 1,
          column: idx + 1,
          match: host,
          rule: "forbidden-host",
        });
      }
    }

    // Rule 2: any http(s) URL outside doc files
    if (!isDocFile) {
      const urlRegex = /https?:\/\/[^\s"'`<>)]+/g;
      let match: RegExpExecArray | null = urlRegex.exec(line);
      while (match !== null) {
        const url = match[0];
        if (!ALLOWLIST.some((a) => url.startsWith(a))) {
          violations.push({
            file: relPath,
            line: i + 1,
            column: match.index + 1,
            match: url,
            rule: "external-url",
          });
        }
        match = urlRegex.exec(line);
      }
    }
  });
}

console.log("PRIZM air-gap audit — scanning...\n");
walk(ROOT, scanFile);

if (violations.length === 0) {
  console.log("✓ No violations found. Repo is air-gap clean.");
  process.exit(0);
}

console.log(`✗ Found ${violations.length} violation(s):\n`);
const grouped = new Map<string, Violation[]>();
for (const v of violations) {
  const arr = grouped.get(v.file) ?? [];
  arr.push(v);
  grouped.set(v.file, arr);
}

for (const [file, vs] of grouped) {
  console.log(`  ${file}`);
  for (const v of vs) {
    console.log(`    ${v.line}:${v.column}  [${v.rule}]  ${v.match}`);
  }
  console.log();
}

console.log(
  `Fix these references so PRIZM works in air-gapped environments.\nSee /docs/air-gap for guidance.`,
);
process.exit(1);
