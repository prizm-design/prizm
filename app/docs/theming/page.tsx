import { CodeBlock } from "@/components/site/code-block";
import Link from "next/link";

export const metadata = { title: "Theming" };

export default function ThemingPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Theming</h1>
      <p className="mt-3 text-lg text-fg-muted">
        PRIZM has four theme variants — two products × two modes — driven by a single token layer
        and two data attributes on the root element.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">The four variants</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Variant zone="c3" mode="light" />
        <Variant zone="c3" mode="dark" />
        <Variant zone="enterprise" mode="light" />
        <Variant zone="enterprise" mode="dark" />
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">How activation works</h2>
      <p className="mt-3 text-fg-muted">
        Setting the data attributes on <code className="font-mono text-xs">&lt;html&gt;</code>{" "}
        activates the matching token set. Component code stays the same.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="html"
          code={`<html data-zone="c3" data-mode="dark">
  <!-- All PRIZM components render in the C3 dark theme -->
</html>`}
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Token architecture</h2>
      <p className="mt-3 text-fg-muted">PRIZM uses two layers:</p>
      <ol className="mt-3 list-decimal space-y-2 pl-6 text-fg-muted">
        <li>
          <strong className="text-fg">Baseline tokens</strong> — raw colour scales (slate, blue,
          cyan), radii, motion. In{" "}
          <code className="font-mono text-xs">styles/tokens/baseline.css</code>.
        </li>
        <li>
          <strong className="text-fg">Semantic tokens</strong> — meaning-based variables like{" "}
          <code className="font-mono text-xs">--prizm-color-bg</code>,{" "}
          <code className="font-mono text-xs">--prizm-color-accent</code>. Each theme file
          (c3-light.css, c3-dark.css, etc.) maps semantic tokens onto baseline values.
        </li>
      </ol>
      <p className="mt-3 text-fg-muted">
        Components always reference semantic tokens — never baseline scales directly. This is what
        makes theme switching free. For the full palette and per-token visual reference, see{" "}
        <Link href="/docs/colors" className="text-accent hover:underline">
          Colours
        </Link>
        .
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Using tokens in code</h2>
      <p className="mt-3 text-fg-muted">All semantic tokens are wired into Tailwind utilities:</p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`// ✓ Correct — uses semantic tokens, theme-aware
<div className="bg-bg text-fg border-border">
  <span className="text-accent">Important</span>
</div>

// ✗ Wrong — uses raw Tailwind colours, won't theme correctly
<div className="bg-slate-50 text-slate-900 border-slate-200">
  <span className="text-blue-600">Important</span>
</div>`}
        />
      </div>
    </article>
  );
}

function Variant({ zone, mode }: { zone: "c3" | "enterprise"; mode: "light" | "dark" }) {
  return (
    <div
      data-zone={zone}
      data-mode={mode}
      className={`swatch-${zone}-${mode} rounded-lg border border-border bg-bg p-4`}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
        {zone} · {mode}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-8 flex-1 rounded bg-accent" />
        <div className="h-8 flex-1 rounded bg-surface-elevated" />
        <div className="h-8 flex-1 rounded bg-bg-muted" />
      </div>
      <div className="mt-3 text-sm text-fg">Heading</div>
      <div className="text-xs text-fg-muted">Body text</div>
    </div>
  );
}
