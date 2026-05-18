import { CodeBlock } from "@/components/site/code-block";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { C3AppShell } from "./shell";

export const metadata = { title: "C3 App Shell" };

const APPLIED_PRINCIPLES = [
  {
    name: "Predictable information placement",
    href: "/docs/principles",
    rationale:
      "The top bar (brand, online status, notifications, theme, avatar) and status ticker (metric counts, alerts, LOCAL/UTC/EX clocks) anchor in the same screen position regardless of which icon-rail app is open. Status never moves between contexts — operators always know where to look.",
  },
  {
    name: "Cognitive chunking",
    href: "/docs/principles",
    rationale:
      "The icon rail holds six core apps plus up to five pinned add-ons in a visually distinct section — each chunk stays at the 7±2 working-memory limit. The App Store accommodates the rest without inflating the rail. The status ticker carries four metrics plus the clocks. The top-bar action group holds four elements (status · notifications · theme · avatar). Each region stays scannable at a glance.",
  },
  {
    name: "Stress-resilient consistency",
    href: "/docs/principles",
    rationale:
      "The shell chrome (top bar, ticker, icon rail) is invariant across all C3 templates that compose this one. Per-app content replaces only the main canvas and side panel, never the chrome. Under load, an operator's overlearned spatial map remains correct.",
  },
  {
    name: "Operator dark mode",
    href: "/docs/principles",
    rationale:
      "The shell renders in C3 dark by default regardless of the docs site's mode. Dark is the canonical operator state — preserves dark adaptation in dim ops rooms and reduces eye strain on long shifts.",
  },
];

export default function C3AppShellPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/c3/templates"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
      >
        ← C3 templates
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            C3 Template
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">App Shell</h1>
          <p className="mt-3 max-w-2xl text-lg text-fg-muted">
            The foundational layout chrome every C3 application sits inside — top bar, status
            ticker, icon rail (core apps + pinned add-ons + App Store), main canvas slot, and an
            expandable side panel that opens adjacent to the icon rail (used by every rail item
            including the App Store). Plus chrome-level Notification Centre and Workspace panels
            triggered from the top bar. Other C3 templates compose this shell and fill the main
            canvas.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">stable</Badge>
        </div>
      </div>

      {/* ============================================================
          Design Principles Applied — MANDATORY section
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">
          Design principles applied
        </h2>
        <div className="mt-4 space-y-3">
          {APPLIED_PRINCIPLES.map((p) => (
            <div
              key={p.name}
              className="rounded-lg border border-border border-l-4 border-l-accent bg-surface p-5"
            >
              <Link
                href={p.href}
                className="text-base font-semibold text-fg hover:text-accent hover:underline"
              >
                {p.name}
              </Link>
              <p className="mt-2 text-sm text-fg-muted">{p.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          Preview
          ============================================================ */}
      <section className="mt-12">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Preview</h2>
          <Link
            href="/c3/templates/app-shell/preview"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            target="_blank"
            rel="noopener"
          >
            View at viewport scale
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-bg-subtle">
          <div className="h-[720px]">
            <C3AppShell />
          </div>
        </div>
        <p className="mt-2 text-xs text-fg-subtle">
          Click any icon in the rail to open its side panel (opens adjacent to the rail, can expand
          to the full canvas). The App Store icon at the bottom of the rail follows the same pattern
          and opens the add-on catalogue — install / uninstall / pin to rail (capped at 5 pinned
          add-ons). The bell and avatar are different: they open the right-anchored Notification
          Centre and Workspace panels respectively (those two are chrome-level, mutually exclusive,
          and don't support the expand toggle).
        </p>
      </section>

      {/* ============================================================
          Code
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Code</h2>
        <p className="mt-3 text-fg-muted">
          The shell is one file. Copy it into your project at the same relative path and customize
          the brand, rail items, and metrics for your application.
        </p>
        <div className="mt-4">
          <CodeBlock
            language="tsx"
            code={`import { C3AppShell } from "@/templates/c3/app-shell";

export default function YourApp() {
  return <C3AppShell />;
}`}
          />
        </div>
      </section>

      {/* ============================================================
          Notes
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Notes</h2>
        <div className="mt-4 space-y-4 text-fg-muted">
          <div>
            <p className="font-medium text-fg">What's customizable</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
              <li>Brand mark and product name (in the top bar)</li>
              <li>
                Core icon rail items — order, labels, badges, icons; the current set (Dashboard, Ops
                Log, Incidents, Tasks, ORBAT, Chat) is placeholder. Always available to every
                operator.
              </li>
              <li>
                Add-on app catalogue — apps the operator can install via the App Store. Up to five
                installed add-ons can be pinned to the rail (separated from core apps by a
                horizontal divider). Unpinned installed add-ons remain launchable: clicking their
                row in the App Store opens the app's slide panel (the same panel they'd open from
                the rail if pinned).
              </li>
              <li>Status ticker metrics — labels, values, optional severity tone</li>
              <li>
                Exercise start time — currently anchored 2 hours before mount; replace with your
                real D-day timestamp
              </li>
              <li>
                Notification Centre data — the placeholder list, filters, and dismiss /
                mark-all-read behaviour are wired to local state for the demo; replace with your
                real backend
              </li>
              <li>
                Workspace panel — the operator card (MAJ A. LOH · Watch Officer · DSTA) and the
                workspace list are placeholders
              </li>
              <li>
                Side-panel content (rail apps) — currently placeholder text; wire your app's UI into
                each one
              </li>
              <li>
                The main canvas — currently a stylized map placeholder (grid + markers + compass +
                scale bar). Substitute your real map (Leaflet, Mapbox, etc.), dashboard, or detail
                content
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-fg">What's intentionally fixed</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
              <li>Top-bar height (56px) and ticker height (32px) — chunking constraint</li>
              <li>
                Icon rail width (64px) — Fitts-comfortable target sizes within chunking limits
              </li>
              <li>Top-bar element order — predictable placement across templates</li>
              <li>
                Add-on pin cap (5) — keeps the rail's add-on chunk at the 7±2 limit; the App Store
                handles the rest
              </li>
              <li>
                Visual seam between core and add-ons (horizontal divider) — preserves chunking via
                clear spatial grouping
              </li>
              <li>
                App Store position — always pinned at the bottom of the rail, outside the scroll
                area. Rail scrolls vertically if core + pinned add-ons would overflow the available
                height, but App Store stays in place per <em>predictable information placement</em>.
              </li>
              <li>Dark theme as default — operator-state principle</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-fg">Primitives used</p>
            <p className="mt-2 text-sm">
              <Link href="/components/avatar" className="text-accent hover:underline">
                Avatar
              </Link>
              ,{" "}
              <Link href="/components/badge" className="text-accent hover:underline">
                Badge
              </Link>
              ,{" "}
              <Link href="/components/button" className="text-accent hover:underline">
                Button
              </Link>
              ,{" "}
              <Link href="/components/tooltip" className="text-accent hover:underline">
                Tooltip
              </Link>
              . No new primitives were created for this template. Building the Tooltip into the rail
              surfaced two small enhancements to the design system:{" "}
              <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">side</code> /{" "}
              <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">align</code> props
              on{" "}
              <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
                TooltipContent
              </code>
              , and a{" "}
              <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">Badge</code>{" "}
              <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">info</code>{" "}
              variant.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
