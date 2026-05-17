import Link from "next/link";
import { CodeBlock } from "@/components/site/code-block";

export const metadata = { title: "Typography" };

const TYPE_SCALE = [
  { name: "text-5xl", size: "48px", line: "1", sample: "The display headline" },
  { name: "text-4xl", size: "36px", line: "40px", sample: "Page title" },
  { name: "text-3xl", size: "30px", line: "36px", sample: "Section heading" },
  { name: "text-2xl", size: "24px", line: "32px", sample: "Subsection heading" },
  { name: "text-xl", size: "20px", line: "28px", sample: "Card title" },
  { name: "text-lg", size: "18px", line: "28px", sample: "Lead paragraph" },
  { name: "text-base", size: "16px", line: "24px", sample: "Body text — the default reading size for PRIZM. Optimised for long-form prose and dense UI alike." },
  { name: "text-sm", size: "14px", line: "20px", sample: "Secondary text — captions, descriptions, table cells." },
  { name: "text-xs", size: "12px", line: "16px", sample: "Metadata, badges, keyboard hints, code annotations." },
];

const WEIGHTS = [
  { name: "font-normal", value: 400, label: "Regular", note: "Body text default." },
  { name: "font-medium", value: 500, label: "Medium", note: "Buttons, form labels, badges." },
  { name: "font-semibold", value: 600, label: "Semibold", note: "Headings, emphasised UI labels." },
  { name: "font-bold", value: 700, label: "Bold", note: "Reserved for highest emphasis." },
];

export default function TypographyPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Foundations</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Typography</h1>
      <p className="mt-3 text-lg text-fg-muted">
        Two self-hosted variable fonts, a Tailwind-default type scale, and a small set of weights.
        For most UI text reach for the{" "}
        <Link href="/components/heading" className="text-accent hover:underline">Heading</Link>{" "}
        and{" "}
        <Link href="/components/text" className="text-accent hover:underline">Text</Link>{" "}
        primitives — the raw classes documented here are what those components compose underneath.
      </p>

      {/* ============================================================
          Font families
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Font families</h2>
      <p className="mt-3 text-fg-muted">
        Both fonts are self-hosted in <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">/public/fonts/</code>{" "}
        — no CDN dependency, no Google Fonts call. Required for air-gap deployments.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <FontFamilyCard
          name="Inter"
          token="--font-sans"
          tailwind="font-sans"
          role="UI, headings, and body text"
          sample="The quick brown fox"
          sampleClass="font-sans"
        />
        <FontFamilyCard
          name="JetBrains Mono"
          token="--font-mono"
          tailwind="font-mono"
          role="Code, keyboard shortcuts, token names"
          sample="cn('text-fg-muted')"
          sampleClass="font-mono"
        />
      </div>

      {/* ============================================================
          Why these fonts
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Why these fonts</h2>
      <p className="mt-3 text-fg-muted">
        Both fonts share design DNA — humanist sans roots, geometric construction, deliberate
        clarity at small sizes — so they sit together as a system rather than as two unrelated
        families.
      </p>

      <div className="mt-6 space-y-6">
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-base font-semibold text-fg">Inter for UI and body</h3>
          <p className="mt-3 text-fg-muted">
            Inter was designed by Rasmus Andersson explicitly for on-screen interfaces. The
            tall x-height keeps small text readable at the densities C3 operators and Enterprise
            data tables both need; open apertures stop adjacent letters from blurring together
            on long shifts. Crucially, it disambiguates the characters that matter most for
            operator UIs — <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">I</code>{" "}
            from <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">l</code>{" "}
            from <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">1</code>,{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">0</code> from{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">O</code> — so
            tactical readouts and form inputs stay unambiguous under glance or stress.
          </p>
          <p className="mt-3 text-fg-muted">
            It ships as a variable font, meaning every weight from 100 to 900 comes from a single
            file — smaller payload, simpler air-gap bundle. Tabular numeral support is excellent,
            which the C3 App Shell already relies on for its LOCAL / UTC / EX clocks and KPI
            counters. SIL Open Font License, so we self-host without licence concerns.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-base font-semibold text-fg">JetBrains Mono for code and tabular data</h3>
          <p className="mt-3 text-fg-muted">
            JetBrains Mono was built for code editors — the same disambiguation work Inter does
            for prose, JetBrains Mono does for source. Brackets, braces, and parentheses are
            visually distinct;{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">0</code> /{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">O</code> and{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">1</code> /{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">l</code> /{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">I</code> never
            collapse into each other. PRIZM uses it for code blocks, keyboard shortcut chips
            (<code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">Kbd</code>),
            token names in foundation tables, and any place where tabular alignment matters more
            than pretty curves.
          </p>
          <p className="mt-3 text-fg-muted">
            Also a variable font, also SIL Open Font License, also self-hosted alongside Inter
            in the same vendored bundle.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-border bg-bg-subtle p-5">
          <p className="text-sm text-fg-muted">
            <strong className="font-semibold text-fg">A note on minimalism.</strong>{" "}
            One sans and one mono is intentional. Adding more families increases cognitive load,
            bundle size, and the surface for inconsistency — none of which earn their keep in
            either product family.
          </p>
        </div>
      </div>

      {/* ============================================================
          Type scale
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Type scale</h2>
      <p className="mt-3 text-fg-muted">
        PRIZM uses Tailwind's default type scale unmodified. Sizes pair with sensible line-heights
        so most components don't need to set <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">leading-*</code> explicitly.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] gap-x-6 border-b border-border bg-bg-subtle px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
          <span>Utility</span>
          <span>Size · Line</span>
          <span>Sample</span>
        </div>
        {TYPE_SCALE.map((row, i) => (
          <div
            key={row.name}
            className={`grid grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-x-6 px-4 py-4${
              i === TYPE_SCALE.length - 1 ? "" : " border-b border-border"
            }`}
          >
            <code className="font-mono text-xs text-fg-muted">{row.name}</code>
            <span className="font-mono text-xs text-fg-subtle whitespace-nowrap">
              {row.size} / {row.line}
            </span>
            <span className={`${row.name} truncate text-fg`}>{row.sample}</span>
          </div>
        ))}
      </div>

      {/* ============================================================
          Weights
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Weights</h2>
      <p className="mt-3 text-fg-muted">
        Inter ships as a variable font (100–900) — every weight is available without an extra file.
        In practice PRIZM uses four: regular, medium, semibold, bold. Stick to these unless there's
        a clear reason not to.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        {WEIGHTS.map((w, i) => (
          <div
            key={w.name}
            className={`grid grid-cols-[auto_auto_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-6 px-4 py-4${
              i === WEIGHTS.length - 1 ? "" : " border-b border-border"
            }`}
          >
            <code className="font-mono text-xs text-fg-muted">{w.name}</code>
            <span className="font-mono text-xs text-fg-subtle">{w.value}</span>
            <span className={`text-xl text-fg ${w.name}`}>{w.label}</span>
            <span className="text-sm text-fg-muted">{w.note}</span>
          </div>
        ))}
      </div>

      {/* ============================================================
          Component shortcuts
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Use the primitives, not the raw classes</h2>
      <p className="mt-3 text-fg-muted">
        Day-to-day, prefer the{" "}
        <Link href="/components/heading" className="text-accent hover:underline">Heading</Link>{" "}
        and{" "}
        <Link href="/components/text" className="text-accent hover:underline">Text</Link>{" "}
        components — they encode the right defaults and keep visual treatment consistent across pages.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export function Example() {
  return (
    <section>
      <Heading as="h1" size="4xl">Page title</Heading>
      <Text variant="muted" size="lg">A short subtitle for context.</Text>
      <Text>Standard body copy paragraph. Inherits text-base by default.</Text>
      <Text size="sm" variant="subtle">Caption / metadata line.</Text>
    </section>
  );
}`}
        />
      </div>

      <p className="mt-4 text-sm text-fg-muted">
        For long-form HTML content (MDX, CMS output), wrap it in{" "}
        <Link href="/components/prose" className="text-accent hover:underline">Prose</Link>{" "}
        — it applies the type scale and spacing to nested headings, paragraphs, lists, and code blocks.
      </p>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Sub-components
   -------------------------------------------------------------------------- */

function FontFamilyCard({
  name,
  token,
  tailwind,
  role,
  sample,
  sampleClass,
}: {
  name: string;
  token: string;
  tailwind: string;
  role: string;
  sample: string;
  sampleClass: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-fg">{name}</span>
        <code className="font-mono text-[11px] text-fg-subtle">{token}</code>
      </div>
      <p className="mt-1 text-xs text-fg-muted">{role}</p>
      <p className={`mt-4 text-3xl text-fg ${sampleClass}`}>{sample}</p>
      <div className="mt-4">
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs text-fg-muted">
          {tailwind}
        </code>
      </div>
    </div>
  );
}
