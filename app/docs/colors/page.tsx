import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/site/code-block";

export const metadata = { title: "Colors" };

interface SemanticToken {
  name: string;
  tailwind: string;
  description: string;
  /** When set, swatches render text in this token's color over `on` instead of a solid fill. */
  rendersAs?: "fill" | "text";
  /** If rendersAs is "text", which token's value to use as the background behind the sample. */
  on?: string;
}

const TOKEN_GROUPS: { title: string; tokens: SemanticToken[] }[] = [
  {
    title: "Backgrounds & surfaces",
    tokens: [
      { name: "bg", tailwind: "bg-bg", description: "Page background." },
      { name: "bg-subtle", tailwind: "bg-bg-subtle", description: "Slightly recessed background tier." },
      { name: "bg-muted", tailwind: "bg-bg-muted", description: "Muted fills — hovered rows, inactive states." },
      { name: "surface", tailwind: "bg-surface", description: "Cards, panels, the standard container fill." },
      { name: "surface-elevated", tailwind: "bg-surface-elevated", description: "Floating elements — popovers, dialogs, dropdowns." },
    ],
  },
  {
    title: "Borders",
    tokens: [
      { name: "border", tailwind: "border-border", description: "Default border between regions and inside controls." },
      { name: "border-strong", tailwind: "border-border-strong", description: "Emphasised border for focus or selected state." },
    ],
  },
  {
    title: "Foreground (text)",
    tokens: [
      { name: "fg", tailwind: "text-fg", description: "Primary body text. Highest contrast.", rendersAs: "text", on: "bg" },
      { name: "fg-muted", tailwind: "text-fg-muted", description: "Secondary text — captions, descriptions, labels.", rendersAs: "text", on: "bg" },
      { name: "fg-subtle", tailwind: "text-fg-subtle", description: "Tertiary text — metadata, placeholder, disabled.", rendersAs: "text", on: "bg" },
    ],
  },
  {
    title: "Accent",
    tokens: [
      { name: "accent", tailwind: "bg-accent", description: "Brand accent. Cyan on C3, blue on Enterprise." },
      { name: "accent-fg", tailwind: "text-accent-fg", description: "Text rendered on an accent fill.", rendersAs: "text", on: "accent" },
      { name: "accent-hover", tailwind: "hover:bg-accent-hover", description: "Hover state for accent-filled buttons and links." },
    ],
  },
  {
    title: "Status",
    tokens: [
      { name: "danger", tailwind: "bg-danger", description: "Destructive actions, error states." },
      { name: "danger-fg", tailwind: "text-danger-fg", description: "Text on a danger fill.", rendersAs: "text", on: "danger" },
      { name: "success", tailwind: "bg-success", description: "Confirmation, positive state." },
      { name: "warning", tailwind: "bg-warning", description: "Caution, requires attention." },
      { name: "info", tailwind: "bg-info", description: "Neutral informational state." },
    ],
  },
];

const BASELINE_SCALES = [
  { name: "slate", description: "Neutral scale. Used for backgrounds, borders, and text in both zones." },
  { name: "cyan", description: "C3 accent family." },
  { name: "blue", description: "Enterprise accent family." },
];

const STATUS_HUES = [
  { name: "red", description: "Danger." },
  { name: "green", description: "Success." },
  { name: "amber", description: "Warning." },
  { name: "sky", description: "Info." },
];

const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const STATUS_STEPS = [500, 600];

const VARIANTS: { zone: "c3" | "enterprise"; mode: "light" | "dark"; label: string }[] = [
  { zone: "c3", mode: "light", label: "C3 · L" },
  { zone: "c3", mode: "dark", label: "C3 · D" },
  { zone: "enterprise", mode: "light", label: "Ent · L" },
  { zone: "enterprise", mode: "dark", label: "Ent · D" },
];

export default function ColorsPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Foundations</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Colors</h1>
      <p className="mt-3 text-lg text-fg-muted">
        PRIZM uses a two-layer color system: a fixed baseline palette of raw scales, and a set of
        semantic tokens that map onto those scales differently per theme. Component code only
        references semantic tokens — that's what makes theming free.
      </p>

      <p className="mt-4 text-sm text-fg-muted">
        See <Link href="/docs/theming" className="text-accent hover:underline">Theming</Link> for the
        architecture behind these layers and how to activate a theme.
      </p>

      {/* ============================================================
          Semantic tokens
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Semantic tokens</h2>
      <p className="mt-3 text-fg-muted">
        These tokens carry meaning, not raw color. Each one resolves to a different value per
        theme — that's the whole point of having four variants behind one component API.
      </p>

      <p className="mt-3 text-fg-muted">
        Every semantic token is wired into a Tailwind utility. Use the utility in component code:
        <code className="ml-1 rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">bg-bg</code>,{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">text-fg</code>,{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">border-border</code>{" "}
        — never the raw CSS variable directly.
      </p>

      <div className="mt-8 space-y-12">
        {TOKEN_GROUPS.map((group) => (
          <section key={group.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
              {group.title}
            </h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <TokenHeaderRow />
              {group.tokens.map((token, i) => (
                <TokenRow key={token.name} token={token} isLast={i === group.tokens.length - 1} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ============================================================
          Baseline scales
          ============================================================ */}
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">Baseline scales</h2>
      <p className="mt-3 text-fg-muted">
        Raw palettes that the semantic tokens reference. These values are theme-independent — they
        look the same regardless of which zone or mode is active. Don't reference these directly in
        component code; they're inputs to the semantic layer.
      </p>

      <div className="mt-8 space-y-10">
        {BASELINE_SCALES.map((scale) => (
          <Scale key={scale.name} name={scale.name} description={scale.description} steps={SCALE_STEPS} />
        ))}
      </div>

      <h3 className="mt-14 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
        Status hues
      </h3>
      <p className="mt-3 text-fg-muted">
        Single-purpose hues used by the status semantic tokens. Two steps each.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {STATUS_HUES.map((scale) => (
          <Scale key={scale.name} name={scale.name} description={scale.description} steps={STATUS_STEPS} compact />
        ))}
      </div>

      {/* ============================================================
          Usage
          ============================================================ */}
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">Using colors in code</h2>
      <p className="mt-3 text-fg-muted">
        Always reach for the semantic tokens via Tailwind utilities. Baseline scales are for the
        token files only — referencing them from a component locks that component to a single visual
        treatment and defeats theming.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`// ✓ Correct — semantic, theme-aware
<div className="bg-surface text-fg border border-border">
  <span className="text-accent">Important</span>
  <button className="bg-accent text-accent-fg hover:bg-accent-hover">Save</button>
</div>

// ✗ Wrong — references baseline directly, won't theme
<div style={{ backgroundColor: "var(--prizm-slate-100)" }}>...</div>`}
        />
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Sub-components
   -------------------------------------------------------------------------- */

function TokenHeaderRow() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,1fr))] gap-4 border-b border-border bg-bg-subtle px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
      <span>Token</span>
      {VARIANTS.map((v) => (
        <span key={v.label} className="text-center">
          {v.label}
        </span>
      ))}
    </div>
  );
}

function TokenRow({ token, isLast }: { token: SemanticToken; isLast: boolean }) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,1fr))] items-center gap-4 px-4 py-3${
        isLast ? "" : " border-b border-border"
      }`}
    >
      <div className="min-w-0">
        <div className="font-mono text-sm text-fg">--prizm-color-{token.name}</div>
        <div className="mt-0.5 truncate text-xs text-fg-muted">{token.description}</div>
        <div className="mt-1.5">
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
            {token.tailwind}
          </code>
        </div>
      </div>
      {VARIANTS.map((v) => (
        <SemanticSwatch key={v.label} zone={v.zone} mode={v.mode} token={token} />
      ))}
    </div>
  );
}

function SemanticSwatch({
  zone,
  mode,
  token,
}: {
  zone: "c3" | "enterprise";
  mode: "light" | "dark";
  token: SemanticToken;
}): ReactNode {
  if (token.rendersAs === "text") {
    return (
      <div
        className={`swatch-${zone}-${mode} flex h-12 items-center justify-center rounded-md border border-border`}
        style={{ backgroundColor: `var(--color-${token.on ?? "bg"})` }}
      >
        <span
          className="font-semibold"
          style={{ color: `var(--color-${token.name})`, fontSize: "16px" }}
        >
          Aa
        </span>
      </div>
    );
  }
  return (
    <div
      className={`swatch-${zone}-${mode} h-12 rounded-md border border-border`}
      style={{ backgroundColor: `var(--color-${token.name})` }}
    />
  );
}

function Scale({
  name,
  description,
  steps,
  compact = false,
}: {
  name: string;
  description: string;
  steps: number[];
  compact?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold capitalize text-fg">{name}</h3>
        <p className="text-sm text-fg-muted">{description}</p>
      </div>
      <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-11"}`}>
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className="h-12 w-full rounded-md border border-border"
              style={{ backgroundColor: `var(--prizm-${name}-${step})` }}
            />
            <div className="mt-1 font-mono text-[11px] text-fg-muted">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
