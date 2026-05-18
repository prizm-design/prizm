"use client";

import { CodeBlock } from "@/components/site/code-block";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Droplet, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LiquidGlassFoundationPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-baseline gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Foundations</p>
        <Badge variant="info" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">
          New in 4.0
        </Badge>
        <Badge variant="subtle" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">
          C3 only
        </Badge>
      </div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Liquid glass</h1>
      <p className="mt-3 max-w-3xl text-lg text-fg-muted">
        A translucent surface treatment for floating panels in C3 products. Glass surfaces preserve
        spatial context — operators see the map, feed, or canvas through the panel rather than
        having it occluded. Available in both C3 light and C3 dark modes.
      </p>

      {/* ============================================================
          Live demo — interactive frame showing glass over a stylized canvas
          ============================================================ */}
      <section className="mt-12">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-fg-subtle">
          Live demo
        </h2>
        <LiveDemo />
      </section>

      {/* ============================================================
          When to use / when NOT to use
          ============================================================ */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-fg">
            <Sparkles className="h-4 w-4 text-accent" />
            When to use
          </div>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li>• Floating panels that sit over a map, feed, or visual canvas</li>
            <li>
              • Side panels (notifications, workspace, app drawers) where spatial context matters
            </li>
            <li>• Top chrome (top bar, status ticker) over rich visual backgrounds</li>
            <li>
              • Tooltips and popovers in C3 templates where the operator should keep seeing the data
              behind
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-fg">
            <AlertTriangle className="h-4 w-4 text-danger" />
            When NOT to use
          </div>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li>
              <strong className="text-fg">Alert dialogs</strong> — emergency UI needs maximum
              legibility, stay solid
            </li>
            <li>
              <strong className="text-fg">Critical-error toasts</strong> — danger states stay solid
            </li>
            <li>
              <strong className="text-fg">Confirmation modals</strong> for destructive actions —
              stay solid
            </li>
            <li>
              <strong className="text-fg">Enterprise products</strong> — glass conflicts with the
              "calm, spacious, professional" design principle
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================
          The two tiers
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Two tiers</h2>
        <p className="mt-2 text-fg-muted">
          PRIZM glass comes in two intensities. Both share the same recipe; they differ in blur,
          opacity, and shadow strength so they preserve visual hierarchy when stacked.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TierCard
            name="surface-glass-chrome"
            useCase="Application frame: top bar, status ticker, icon rail, persistent navigation"
            blur="8px"
            opacity="6%"
            border="hairline"
            shadow="subtle top highlight"
          />
          <TierCard
            name="surface-glass-panel"
            useCase="Floating overlays: notification centre, workspace, slide panels, popovers, tooltips"
            blur="12px"
            opacity="10%"
            border="hairline"
            shadow="stronger highlight + drop"
          />
        </div>
      </section>

      {/* ============================================================
          Anatomy — the five layers that compose the treatment
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Anatomy</h2>
        <p className="mt-2 text-fg-muted">
          Each glass surface composes five effects. The tint flips with the mode — darker on light,
          lighter on dark — so the surface always reads as elevated, never as invisible.
        </p>
        <ol className="mt-6 space-y-3 text-sm">
          <AnatomyRow
            n={1}
            label="Backdrop blur"
            body="Diffuses what's behind the surface. 8px (chrome) or 12px (panel) — tuned to keep underlying canvas activity readable."
          />
          <AnatomyRow
            n={2}
            label="Backdrop saturate"
            body="Boosts color saturation of the backdrop (180%) — gives the wet, refractive feel."
          />
          <AnatomyRow
            n={3}
            label="Surface tint"
            body="Very subtle (6-10% opacity). Darker on light mode, lighter on dark. Contrasts the backdrop."
          />
          <AnatomyRow
            n={4}
            label="Inner hairline border"
            body="1px inset border that defines the edge of glass. Does most of the surface-definition work."
          />
          <AnatomyRow
            n={5}
            label="Soft noise overlay"
            body="A tiled SVG noise pattern at 4-5% opacity breaks up large flat translucent areas."
          />
        </ol>
      </section>

      {/* ============================================================
          How to apply — utility class + variant prop
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">
          How to apply
        </h2>
        <p className="mt-2 text-fg-muted">
          Two paths. Most projects use the variant prop for ergonomics; the utility class is the
          escape hatch when you need glass on a custom element.
        </p>

        <h3 className="mt-6 text-base font-semibold text-fg">
          Variant prop on supporting components
        </h3>
        <p className="mt-2 text-sm text-fg-muted">
          Six components ship a{" "}
          <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">variant="glass"</code> prop:
          <strong className="text-fg">
            {" "}
            Sheet, Popover, Tooltip, HoverCard, Menu, ContextMenu
          </strong>
          . Default remains <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">"solid"</code>
          .
        </p>
        <CodeBlock
          language="tsx"
          code={`<Sheet>
  <SheetTrigger render={<Button>Open</Button>} />
  <SheetContent side="right" variant="glass">
    <SheetHeader>
      <SheetTitle>Notifications</SheetTitle>
    </SheetHeader>
    <SheetBody>{/* … */}</SheetBody>
  </SheetContent>
</Sheet>`}
        />

        <h3 className="mt-6 text-base font-semibold text-fg">Utility class on any surface</h3>
        <p className="mt-2 text-sm text-fg-muted">
          For custom chrome, use{" "}
          <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">surface-glass-chrome</code> or{" "}
          <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">surface-glass-panel</code>.
        </p>
        <CodeBlock
          language="tsx"
          code={`<header className="surface-glass-chrome border-b border-border px-3">
  {/* top bar content */}
</header>

<aside className="surface-glass-panel border-r border-border">
  {/* slide panel content */}
</aside>`}
        />
      </section>

      {/* ============================================================
          Tokens
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Tokens</h2>
        <p className="mt-2 text-fg-muted">
          Glass values are wired through CSS custom properties so they can be tuned centrally. The
          tokens live in{" "}
          <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">
            styles/tokens/c3-light.css
          </code>{" "}
          and{" "}
          <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">styles/tokens/c3-dark.css</code>
          .
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-bg-subtle text-xs uppercase tracking-wider text-fg-subtle">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Token</th>
                <th className="px-4 py-2 text-left font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TOKEN_ROWS.map((r) => (
                <tr key={r.token}>
                  <td className="px-4 py-2 font-mono text-xs text-fg">{r.token}</td>
                  <td className="px-4 py-2 text-fg-muted">{r.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          Compatibility + performance
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">
          Compatibility & performance
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-fg-muted">
          <li>
            <strong className="text-fg">Browser support</strong> — uses{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">backdrop-filter</code>,
            supported in all evergreen browsers and Chromium 76+. Older or stripped browsers fall
            back to solid surfaces via{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">@supports</code>.
          </li>
          <li>
            <strong className="text-fg">Air-gapped browsers</strong> — works the same. No external
            assets; the noise overlay is vendored at{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">/public/noise.svg</code>.
          </li>
          <li>
            <strong className="text-fg">Performance budget</strong> — backdrop-filter is GPU work.
            Aim for ≤6 concurrent glass surfaces in the visible viewport. Small chrome elements (top
            bar, ticker, rail) are cheap; large expanded panels are heavier. Profile on the target
            hardware if you're stacking many.
          </li>
          <li>
            <strong className="text-fg">Accessibility</strong> — glass applies to the surface
            background only; text stays at full opacity. WCAG AAA contrast remains the target. Test
            against worst-case canvas backdrops (e.g. bright sun glare on a map).
          </li>
        </ul>
      </section>

      {/* ============================================================
          Principles connection
          ============================================================ */}
      <section className="mt-12 rounded-lg border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Principle</p>
        <h2 className="mt-1 text-lg font-semibold text-fg">
          Layered transparency for spatial context
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          When a panel floats above content the operator needs to keep oriented to (a map, a feed, a
          chart), prefer a glass treatment over a solid surface. Translucency preserves the spatial
          relationship between the foreground panel and the background data; the operator never
          loses the canvas they're working from. Reserved for floating surfaces — never for
          legibility-critical UI.
        </p>
        <Link
          href="/docs/principles"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          See all design principles →
        </Link>
      </section>

      {/* ============================================================
          See it in product
          ============================================================ */}
      <section className="mt-12 rounded-lg border border-dashed border-border bg-bg-subtle p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-fg">
          <Droplet className="h-4 w-4 text-accent" />
          See it in product
        </div>
        <p className="mt-2 text-sm text-fg-muted">
          The C3 App Shell template ships glass mode as a toggle. Open the preview to experience
          glass on every chrome and panel surface, then switch back to solid to compare.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/c3/templates/app-shell/preview"
            className={buttonVariants({ variant: "solid" })}
          >
            Open App Shell preview
          </Link>
          <Link href="/c3/templates/app-shell" className={buttonVariants({ variant: "outline" })}>
            App Shell docs
          </Link>
        </div>
      </section>
    </article>
  );
}

/* ============================================================
   Live demo — toggleable glass over a stylized canvas
   ============================================================ */

function LiveDemo() {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [glass, setGlass] = useState(true);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-bg-subtle px-3 py-2 text-xs">
        <div className="flex gap-1">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium capitalize transition-colors",
                mode === m
                  ? "bg-bg-muted text-fg"
                  : "text-fg-subtle hover:bg-bg-muted hover:text-fg-muted",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setGlass((g) => !g)}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg"
        >
          <Droplet className="h-3.5 w-3.5" />
          {glass ? "Glass on" : "Glass off"}
        </button>
      </div>
      <div
        className={cn(
          "relative h-[360px] bg-bg",
          mode === "dark" ? "swatch-c3-dark" : "swatch-c3-light",
        )}
      >
        <StylizedCanvas />
        <div
          className={cn(
            "absolute left-8 top-8 right-8 h-12 border border-border px-4 flex items-center justify-between gap-3",
            "rounded-md",
            glass ? "surface-glass-chrome" : "bg-surface",
          )}
        >
          <span className="min-w-0 truncate text-sm font-semibold text-fg">Chrome surface</span>
          <code className="shrink-0 whitespace-nowrap rounded-sm border border-border bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
            surface-glass-chrome
          </code>
        </div>
        <div
          className={cn(
            "absolute left-8 top-28 w-64 max-w-[calc(100%-4rem)] p-4 border border-border",
            "rounded-md",
            glass ? "surface-glass-panel" : "bg-surface-elevated",
          )}
        >
          <p className="text-sm font-semibold text-fg">Panel surface</p>
          <p className="mt-1 text-xs text-fg-muted">
            Heavier glass for floating overlays — sheets, popovers, notification centres.
          </p>
          <code className="mt-3 inline-block rounded-sm border border-border bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
            surface-glass-panel
          </code>
        </div>
      </div>
    </div>
  );
}

function StylizedCanvas() {
  // Markers are positioned to overlap the two glass surfaces in LiveDemo so
  // the user can SEE the canvas content through the glass.
  // Chrome strip covers roughly y: 2-16% (top-8 + h-12 on a 360px canvas).
  // Panel covers roughly x: 2-72%, y: 31-65% (top-28 + 4xrem of content).
  const markers: {
    left: string;
    top: string;
    tone: "accent" | "danger";
    size: "sm" | "md" | "lg";
    pulse?: boolean;
  }[] = [
    // Under the chrome strip
    { left: "20%", top: "8%", tone: "accent", size: "md" },
    { left: "50%", top: "10%", tone: "danger", size: "md", pulse: true },
    { left: "80%", top: "9%", tone: "accent", size: "sm" },
    // Under the panel
    { left: "20%", top: "42%", tone: "accent", size: "md" },
    { left: "45%", top: "55%", tone: "danger", size: "sm" },
    { left: "30%", top: "62%", tone: "accent", size: "lg", pulse: true },
    // Free canvas (visible outside glass for contrast)
    { left: "82%", top: "45%", tone: "accent", size: "md" },
    { left: "88%", top: "78%", tone: "accent", size: "md" },
  ];

  return (
    <>
      {/* Radial accent glows — give the glass something visibly colored to
          refract against. Without rich backdrop content, glass-on-flat reads
          as nearly invisible. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 30% 55%, var(--color-accent) 0%, transparent 70%), radial-gradient(ellipse 35% 35% at 78% 25%, var(--color-danger) 0%, transparent 70%)",
          opacity: 0.18,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 0.5px, transparent 0.5px), linear-gradient(to bottom, var(--color-border) 0.5px, transparent 0.5px)",
          backgroundSize: "12px 12px",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
        aria-hidden
      />
      <svg
        className="absolute inset-0 h-full w-full text-fg-subtle opacity-40"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <title>Canvas terrain</title>
        <path
          d="M0,30 C20,28 35,42 50,38 C65,34 78,46 100,40 L100,100 L0,100 Z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
      {/* Route passes through both glass surfaces — top-left under chrome,
          then down through the panel area, then exits bottom-right */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-accent"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <title>Route</title>
        <path
          d="M 5 8 Q 30 12, 40 50 T 95 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 1.2"
          opacity="0.9"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {markers.map((m, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: m.left, top: m.top }}
        >
          <span className="relative block">
            {m.pulse && (
              <span
                className={cn(
                  "absolute inset-0 -m-1 animate-ping rounded-full",
                  m.tone === "danger" ? "bg-danger/40" : "bg-accent/40",
                )}
              />
            )}
            <span
              className={cn(
                "relative block rounded-full ring-2",
                m.size === "sm" && "h-2 w-2",
                m.size === "md" && "h-2.5 w-2.5",
                m.size === "lg" && "h-3 w-3",
                m.tone === "danger" ? "bg-danger ring-danger/30" : "bg-accent ring-accent/30",
              )}
            />
          </span>
        </div>
      ))}
    </>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

function TierCard({
  name,
  useCase,
  blur,
  opacity,
  border,
  shadow,
}: {
  name: string;
  useCase: string;
  blur: string;
  opacity: string;
  border: string;
  shadow: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <code className="font-mono text-xs font-semibold text-accent">{name}</code>
      <p className="mt-2 text-sm text-fg-muted">{useCase}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <dt className="text-fg-subtle">Blur</dt>
        <dd className="font-mono text-fg">{blur}</dd>
        <dt className="text-fg-subtle">Tint opacity</dt>
        <dd className="font-mono text-fg">{opacity}</dd>
        <dt className="text-fg-subtle">Border</dt>
        <dd className="font-mono text-fg">{border}</dd>
        <dt className="text-fg-subtle">Shadow</dt>
        <dd className="font-mono text-fg">{shadow}</dd>
      </dl>
    </div>
  );
}

function AnatomyRow({ n, label, body }: { n: number; label: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-muted font-mono text-[10px] font-semibold text-fg-muted">
        {n}
      </span>
      <div>
        <span className="font-semibold text-fg">{label}</span>
        <span className="text-fg-muted"> — {body}</span>
      </div>
    </li>
  );
}

const TOKEN_ROWS = [
  {
    token: "--prizm-glass-chrome-bg",
    purpose: "Surface tint for chrome-tier glass (top bar, ticker, rail)",
  },
  { token: "--prizm-glass-chrome-border", purpose: "Inner hairline border for chrome-tier glass" },
  { token: "--prizm-glass-chrome-blur", purpose: "Backdrop blur amount for chrome tier (8px)" },
  { token: "--prizm-glass-chrome-saturate", purpose: "Backdrop saturation boost (180%)" },
  { token: "--prizm-glass-chrome-shadow", purpose: "Inner highlight/shadow for chrome tier" },
  {
    token: "--prizm-glass-panel-bg",
    purpose: "Surface tint for panel-tier glass (sheets, popovers, side panels)",
  },
  { token: "--prizm-glass-panel-border", purpose: "Inner hairline border for panel-tier glass" },
  { token: "--prizm-glass-panel-blur", purpose: "Backdrop blur amount for panel tier (12px)" },
  { token: "--prizm-glass-panel-saturate", purpose: "Backdrop saturation boost (180%)" },
  { token: "--prizm-glass-panel-shadow", purpose: "Inner highlight + drop shadow for panel tier" },
  { token: "--prizm-glass-noise-opacity", purpose: "Opacity of the SVG noise overlay (4-5%)" },
];
