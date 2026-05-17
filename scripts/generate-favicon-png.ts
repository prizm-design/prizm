#!/usr/bin/env tsx
/**
 * Rasterise public/favicon.svg into PNG + ICO fallbacks for browsers that
 * don't render SVG favicons well (notably Safari at small tab sizes — Safari
 * requires /favicon.ico to render the tab favicon reliably).
 *
 * Produces:
 *   public/favicon-32.png   (32x32, used by modern fallback browsers)
 *   public/favicon.ico      (same bytes, .ico extension — Safari accepts
 *                            PNG-in-ICO and this is what Safari fetches by
 *                            convention from the document root)
 *
 * Apple touch icon (180×180) is generated separately if/when needed.
 *
 * Run with:  pnpm generate:favicon-png
 */

import { copyFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const svg = readFileSync(resolve(ROOT, "public/favicon.svg"));
const pngPath = resolve(ROOT, "public/favicon-32.png");
const icoPath = resolve(ROOT, "public/favicon.ico");

await sharp(svg, { density: 384 })
  .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(pngPath);

copyFileSync(pngPath, icoPath);

console.log("Wrote public/favicon-32.png (32x32)");
console.log("Wrote public/favicon.ico (PNG-in-ICO for Safari)");
