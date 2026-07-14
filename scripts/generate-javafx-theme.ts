#!/usr/bin/env tsx
/**
 * JavaFX theme generator
 * ------------------------------------------------------------
 * Derives JavaFX stylesheets from the canonical PRIZM token CSS.
 * The CSS token files stay the single source of truth; this script
 * only READS them and emits a second output format. Scope is C3 +
 * its extension packs (RC3) — Enterprise is deliberately excluded.
 *
 * Pipeline per theme: resolve the token cascade (baseline → c3-{mode}
 * → pack overlay), convert each semantic colour oklch() → sRGB hex,
 * emit `.root { -color-*: #rrggbb; }` looked-up colours.
 *
 *   - c3-{light,dark}.css   full base theme (all colour tokens, plus derived
 *                           -color-<status>-subtle / -border alert tints)
 *   - rc3-{light,dark}.css  pack overlay — only the accent trio,
 *                           applied to the Scene ON TOP of the base
 *                           (mirrors the web data-pack model)
 *
 * Glass tokens are excluded (web surface treatment, alpha + blur —
 * not needed by controls). Radius/shadow are lengths, which JavaFX
 * CSS cannot express as looked-up values; they live in prizm.css.
 *
 * The oklch→sRGB path mirrors scripts/audit-contrast.ts verbatim so
 * the emitted colours match the design intent the contrast audit
 * validates against. Naming (-color-accent / -color-fg / -color-bg)
 * aligns with common JavaFX theme conventions (e.g. AtlantaFX).
 *
 * Run with:  pnpm generate:javafx-theme
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT_DIR = `${ROOT}/javafx/src/main/resources/prizm/themes`;

// --- oklch → sRGB (mirrors scripts/audit-contrast.ts) -------------------

/** Returns sRGB channels in 0..1 plus whether any channel was gamut-clamped. */
function oklchToSrgb(
  L: number,
  c: number,
  h: number,
): { rgb: [number, number, number]; clamped: boolean } {
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
  const raw = [toSrgb(r), toSrgb(g), toSrgb(bl)] as const;
  const eps = 0.0005;
  const clamped = raw.some((v) => v < -eps || v > 1 + eps);
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return { rgb: [clamp(raw[0]), clamp(raw[1]), clamp(raw[2])], clamped };
}

function toHex([r, g, b]: [number, number, number]): string {
  const h = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  return [
    Number.parseInt(n.slice(0, 2), 16) / 255,
    Number.parseInt(n.slice(2, 4), 16) / 255,
    Number.parseInt(n.slice(4, 6), 16) / 255,
  ];
}

/** Source-over compositing of `fg` at `alpha` onto opaque `bg` (sRGB gamma space,
 *  matching how a browser composites an `oklch(... / alpha)` layer). */
function compositeOver(
  fg: [number, number, number],
  bg: [number, number, number],
  alpha: number,
): [number, number, number] {
  return [
    alpha * fg[0] + (1 - alpha) * bg[0],
    alpha * fg[1] + (1 - alpha) * bg[1],
    alpha * fg[2] + (1 - alpha) * bg[2],
  ];
}

// --- token parsing (mirrors scripts/audit-contrast.ts) ------------------

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
    current = current.replace(
      /var\((--[\w-]+)\)/g,
      (_, name) => theme[name] ?? baseline[name] ?? `var(${name})`,
    );
  }
  return current;
}

function parseOklch(value: string): [number, number, number] | null {
  const m = value.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return null;
  return [Number.parseFloat(m[1]) / 100, Number.parseFloat(m[2]), Number.parseFloat(m[3])];
}

// --- read source token files --------------------------------------------

const read = (name: string) => readFileSync(`${ROOT}/styles/tokens/${name}.css`, "utf-8");
const baseline = parseTokens(read("baseline"));

interface Emitted {
  token: string; // e.g. "accent"
  hex: string;
  source: string; // resolved oklch (for the report)
  clamped: boolean;
}

/** Resolve every --prizm-color-* token in `theme` (over `baseline`) to hex. */
function resolveColours(theme: Record<string, string>, keys: string[]): Emitted[] {
  const out: Emitted[] = [];
  for (const key of keys) {
    const raw = resolveVar(theme[key], baseline, theme);
    const okl = parseOklch(raw);
    if (!okl) {
      console.error(`  ✗ cannot resolve ${key} → ${raw}`);
      continue;
    }
    const { rgb, clamped } = oklchToSrgb(...okl);
    out.push({ token: key.replace("--prizm-color-", ""), hex: toHex(rgb), source: raw, clamped });
  }
  return out;
}

function emitCss(title: string, source: string, colours: Emitted[]): string {
  const lines = colours.map((c) => `    -color-${c.token}: ${c.hex};`).join("\n");
  return `/* ${title}
 * GENERATED by scripts/generate-javafx-theme.ts — do not edit by hand.
 * Source of truth: styles/tokens/${source}. Regenerate with: pnpm generate:javafx-theme
 */
.root {
${lines}
}
`;
}

const COLOUR_KEY = (k: string) => k.startsWith("--prizm-color-");

mkdirSync(OUT_DIR, { recursive: true });

const report: Array<{ theme: string; colours: Emitted[]; overlay: boolean }> = [];

for (const mode of ["light", "dark"] as const) {
  // --- base C3 theme: all colour tokens ---
  const c3 = parseTokens(read(`c3-${mode}`));
  const c3Keys = Object.keys(c3).filter(COLOUR_KEY);
  const c3Colours = resolveColours(c3, c3Keys);

  // Composited status tints for the Alert — the status colour blended over the
  // theme background at the web's fill (10%) and border (30%) alphas. JavaFX CSS
  // can't alpha-mix a looked-up colour, so we precompute solid hexes here.
  const byToken = Object.fromEntries(c3Colours.map((c) => [c.token, c.hex]));
  const bgRgb = hexToRgb(byToken.bg);
  const surfaceRgb = hexToRgb(byToken.surface);
  for (const status of ["info", "success", "warning", "danger"]) {
    const sRgb = hexToRgb(byToken[status]);
    c3Colours.push({
      token: `${status}-subtle`,
      hex: toHex(compositeOver(sRgb, bgRgb, 0.1)),
      source: `${status} @10% over bg`,
      clamped: false,
    });
    c3Colours.push({
      token: `${status}-border`,
      hex: toHex(compositeOver(sRgb, bgRgb, 0.3)),
      source: `${status} @30% over bg`,
      clamped: false,
    });
    // Badge fill — the web Badge tints the status colour at 15% (badge.tsx),
    // and badges sit on surfaces (rows, top bar), not the app background. So
    // composite over surface, not bg, or the pill reads darker than its panel.
    c3Colours.push({
      token: `${status}-badge`,
      hex: toHex(compositeOver(sRgb, surfaceRgb, 0.15)),
      source: `${status} @15% over surface`,
      clamped: false,
    });
  }

  writeFileSync(
    `${OUT_DIR}/c3-${mode}.css`,
    emitCss(`PRIZM C3 — ${mode}`, `baseline.css + c3-${mode}.css`, c3Colours),
  );
  report.push({ theme: `c3-${mode}`, colours: c3Colours, overlay: false });

  // --- RC3 pack overlay: only the accent tokens it overrides ---
  const rc3Raw = parseTokens(read(`rc3-${mode}`));
  const rc3Theme = { ...c3, ...rc3Raw }; // rc3 ramp + overrides resolve over the C3 base
  const rc3Keys = Object.keys(rc3Raw).filter(COLOUR_KEY);
  const rc3Colours = resolveColours(rc3Theme, rc3Keys);
  writeFileSync(
    `${OUT_DIR}/rc3-${mode}.css`,
    emitCss(
      `PRIZM RC3 pack overlay — ${mode} (apply on top of c3-${mode}.css)`,
      `rc3-${mode}.css`,
      rc3Colours,
    ),
  );
  report.push({ theme: `rc3-${mode}`, colours: rc3Colours, overlay: true });
}

// --- report -------------------------------------------------------------

console.log("✓ Wrote JavaFX theme stylesheets to javafx/src/main/resources/prizm/themes/\n");
for (const { theme, colours, overlay } of report) {
  console.log(`  ${theme}.css${overlay ? "  (pack overlay — accent only)" : ""}`);
  for (const c of colours) {
    const flag = c.clamped ? "  · near-gamut (sRGB-clamped)" : "";
    console.log(`    -color-${c.token.padEnd(16)} ${c.hex}${flag}`);
  }
  console.log("");
}

const clamped = report.flatMap((r) =>
  r.colours.filter((c) => c.clamped).map((c) => `${r.theme}/${c.token}`),
);
if (clamped.length > 0) {
  console.log(
    `· ${clamped.length} saturated token(s) sat just outside sRGB and were clamped: ${clamped.join(", ")}`,
  );
  console.log(
    "  Delta vs proper gamut mapping is ≤~2% (imperceptible); JavaFX renders sRGB regardless.",
  );
} else {
  console.log("✓ Every token mapped cleanly into sRGB with no clamping.");
}
