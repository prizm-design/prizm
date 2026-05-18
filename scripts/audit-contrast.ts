#!/usr/bin/env tsx
/**
 * Contrast audit
 * ------------------------------------------------------------
 * Verifies WCAG contrast ratios across all four PRIZM theme variants
 * (c3-light, c3-dark, enterprise-light, enterprise-dark). Encodes the
 * policy agreed in audits/2026-05-18-baseline.md (decisions D1 + D2):
 *
 *   - Text pairings need WCAG AA: 4.5:1 contrast ratio
 *       fg, fg-muted, fg-subtle on bg/bg-subtle/bg-muted/surface
 *       accent (used as link text) on bg/surface
 *       accent-fg on accent (text on accent fill)
 *       danger-fg on danger (text on danger fill)
 *
 *   - Fill pairings need WCAG non-text contrast: 3.0:1
 *       status hues (danger, success, warning, info) on bg
 *
 * Conversion path: oklch(L% c h) → Oklab a/b → linear sRGB →
 * relative luminance → WCAG contrast formula. Cross-checked once
 * against Stark / Polypane on 2026-05-19; treat results as ±0.1.
 *
 * Exits 1 on any violation so CI fails fast.
 *
 * Run locally with:  pnpm audit:contrast
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const THEMES = ["c3-light", "c3-dark", "enterprise-light", "enterprise-dark"] as const;

const TEXT_PAIRS: Array<[string, string[]]> = [
  ["fg", ["bg", "bg-subtle", "bg-muted", "surface", "surface-elevated"]],
  ["fg-muted", ["bg", "bg-subtle", "bg-muted", "surface"]],
  ["fg-subtle", ["bg", "surface"]],
  ["accent", ["bg", "surface"]],
  ["accent-fg", ["accent"]],
  ["danger-fg", ["danger"]],
];

const FILL_PAIRS: Array<[string, string[]]> = [
  ["danger", ["bg"]],
  ["success", ["bg"]],
  ["warning", ["bg"]],
  ["info", ["bg"]],
];

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3.0;

function oklchToSrgb(L: number, c: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const lc = l_ ** 3;
  const mc = m_ ** 3;
  const sc = s_ ** 3;
  const r = 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const bl = -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc;
  const toSrgb = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  return [
    Math.max(0, Math.min(1, toSrgb(r))),
    Math.max(0, Math.min(1, toSrgb(g))),
    Math.max(0, Math.min(1, toSrgb(bl))),
  ];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const linearise = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
  const lFg = relativeLuminance(fg);
  const lBg = relativeLuminance(bg);
  return (Math.max(lFg, lBg) + 0.05) / (Math.min(lFg, lBg) + 0.05);
}

function parseTokens(content: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const re = /(--prizm-[\w-]+):\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex.exec loop
  while ((m = re.exec(content)) !== null) {
    tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

function resolveVar(
  value: string,
  baseline: Record<string, string>,
  theme: Record<string, string>,
): string {
  let current = value;
  let prev = "";
  while (prev !== current && current.includes("var(")) {
    prev = current;
    current = current.replace(/var\((--[\w-]+)\)/g, (_, name) => {
      return theme[name] ?? baseline[name] ?? `var(${name})`;
    });
  }
  return current;
}

function parseOklch(value: string): [number, number, number] | null {
  const m = value.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return null;
  return [Number.parseFloat(m[1]) / 100, Number.parseFloat(m[2]), Number.parseFloat(m[3])];
}

interface Violation {
  theme: string;
  fg: string;
  bg: string;
  ratio: number;
  required: number;
  kind: "text" | "fill";
}

const baseline = parseTokens(readFileSync(`${ROOT}/styles/tokens/baseline.css`, "utf-8"));

const violations: Violation[] = [];
let checked = 0;

for (const theme of THEMES) {
  const themeTokens = parseTokens(readFileSync(`${ROOT}/styles/tokens/${theme}.css`, "utf-8"));

  for (const [pairs, threshold, kind] of [
    [TEXT_PAIRS, AA_TEXT, "text" as const],
    [FILL_PAIRS, AA_NON_TEXT, "fill" as const],
  ] as const) {
    for (const [fg, backgrounds] of pairs) {
      for (const bg of backgrounds) {
        const fgRaw = resolveVar(`var(--prizm-color-${fg})`, baseline, themeTokens);
        const bgRaw = resolveVar(`var(--prizm-color-${bg})`, baseline, themeTokens);
        const fgOkl = parseOklch(fgRaw);
        const bgOkl = parseOklch(bgRaw);
        if (!fgOkl || !bgOkl) {
          console.error(`  ✗ ${theme}: cannot resolve ${fg} (${fgRaw}) or ${bg} (${bgRaw})`);
          violations.push({ theme, fg, bg, ratio: 0, required: threshold, kind });
          continue;
        }
        const ratio = contrastRatio(oklchToSrgb(...fgOkl), oklchToSrgb(...bgOkl));
        checked++;
        if (ratio < threshold) {
          violations.push({ theme, fg, bg, ratio, required: threshold, kind });
        }
      }
    }
  }
}

if (violations.length === 0) {
  console.log(
    `✓ Contrast audit clean. ${checked} pairings checked across ${THEMES.length} themes; all meet the AA policy (4.5:1 text, 3.0:1 fill).`,
  );
  process.exit(0);
}

console.error(`✗ Contrast audit failed. ${violations.length} violation(s):\n`);
for (const v of violations) {
  const label = v.kind === "text" ? "text pair" : "fill pair";
  console.error(
    `  ${v.theme.padEnd(18)} ${v.fg.padEnd(12)} on ${v.bg.padEnd(18)} ${v.ratio.toFixed(2).padStart(5)}:1  (${label} requires ${v.required.toFixed(1)}:1)`,
  );
}
console.error(
  "\nResolution: adjust the failing token in its theme file. See audits/2026-05-18-baseline.md for the policy rationale.",
);
process.exit(1);
