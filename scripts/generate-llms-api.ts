#!/usr/bin/env tsx
/**
 * Generate / update the Props section in each llms/<slug>.md from
 * lib/components-api.ts.
 *
 * - For each component with an API spec, builds a markdown Props table and
 *   sub-component list.
 * - Inserts the generated content between markers in the existing
 *   llms/<slug>.md so re-running the script is idempotent.
 * - If the file has no markers yet, the section is inserted BEFORE the
 *   "## Source" heading (or appended if there's no Source section).
 *
 * Run with:  pnpm tsx scripts/generate-llms-api.ts
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  COMPONENT_API,
  type ComponentApi,
  type PropSpec,
  type SubComponentSpec,
} from "../lib/components-api";

const ROOT = resolve(import.meta.dirname, "..");
const START_MARKER = "<!-- prizm:api-start -->";
const END_MARKER = "<!-- prizm:api-end -->";

function escapeTableCell(s: string): string {
  // Escape pipes (would break the markdown table) and collapse newlines.
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function renderPropTable(props: PropSpec[]): string {
  if (props.length === 0) return "";
  const rows = props.map(
    (p) =>
      `| \`${escapeTableCell(p.name)}\` | \`${escapeTableCell(p.type)}\` | ${
        p.default ? `\`${escapeTableCell(p.default)}\`` : "—"
      } | ${escapeTableCell(p.description)} |`,
  );
  return ["| Prop | Type | Default | Description |", "|---|---|---|---|", ...rows].join("\n");
}

function renderSubComponent(sub: SubComponentSpec): string {
  const parts = [`### \`${sub.name}\``, "", sub.description];
  if (sub.props && sub.props.length > 0) {
    parts.push("", renderPropTable(sub.props));
  }
  return parts.join("\n");
}

function renderApi(api: ComponentApi): string {
  const sections: string[] = [];
  sections.push("## Props");
  sections.push("");
  if (api.props.length > 0) {
    sections.push(renderPropTable(api.props));
  } else {
    sections.push("_No props on the root — see sub-components below._");
  }
  if (api.subComponents && api.subComponents.length > 0) {
    sections.push("");
    sections.push("## Sub-components");
    for (const sub of api.subComponents) {
      sections.push("");
      sections.push(renderSubComponent(sub));
    }
  }
  if (api.notes) {
    sections.push("");
    sections.push(`_${api.notes}_`);
  }
  sections.push("");
  sections.push(
    "_All components also accept standard HTML attributes for their root element (e.g. `id`, `aria-*`, `data-*`, event handlers) and forward `ref` where applicable._",
  );
  return sections.join("\n");
}

function upsertApiSection(content: string, generated: string): string {
  const markedBlock = `${START_MARKER}\n${generated}\n${END_MARKER}`;

  if (content.includes(START_MARKER) && content.includes(END_MARKER)) {
    // Replace existing marked block.
    const regex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);
    return content.replace(regex, markedBlock);
  }

  // No markers yet — insert before "## Source" if present, else append.
  const sourceMatch = content.match(/^## Source/m);
  if (sourceMatch && sourceMatch.index !== undefined) {
    return `${content.slice(0, sourceMatch.index) + markedBlock}\n\n${content.slice(sourceMatch.index)}`;
  }
  return `${content.trimEnd()}\n\n${markedBlock}\n`;
}

let updated = 0;
let skipped = 0;
const missing: string[] = [];

for (const slug of Object.keys(COMPONENT_API)) {
  const filePath = resolve(ROOT, "llms", `${slug}.md`);
  if (!existsSync(filePath)) {
    missing.push(slug);
    skipped++;
    continue;
  }
  const original = readFileSync(filePath, "utf8");
  const generated = renderApi(COMPONENT_API[slug]);
  const next = upsertApiSection(original, generated);
  if (next !== original) {
    writeFileSync(filePath, next, "utf8");
    updated++;
  }
}

console.log(`Updated ${updated} llms/*.md file(s).`);
if (skipped > 0) {
  console.log(`Skipped ${skipped} (no llms/<slug>.md exists):`);
  for (const s of missing) console.log(`  - ${s}`);
}
