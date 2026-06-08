import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ThemedOperatorConsole } from "./themed-console";

export const metadata = { title: "RC3 — Operator console" };

const APPLIED_PRINCIPLES = [
  {
    name: "Safety reachable in one tap",
    sublabel: "RC3 behavioural invariant 1",
    href: "/c3/rc3/concepts/behavioural-invariants",
    rationale:
      "Safety actions anchor at the bottom-right of the canvas regardless of autonomy state, waypoint progress, or active panel. E-stop never moves between modes — operators acquire it without re-orienting.",
  },
  {
    name: "Comms / health always visible",
    sublabel: "RC3 behavioural invariant 2",
    href: "/c3/rc3/concepts/behavioural-invariants",
    rationale:
      "The comms / health strip sits in the top-right and persists across every console state. Link, signal, battery, and GPS lock are simultaneously visible — degradation surfaces before it becomes an outage.",
  },
  {
    name: "No mode-switch via accident",
    sublabel: "RC3 behavioural invariant 4",
    href: "/c3/rc3/concepts/behavioural-invariants",
    rationale:
      "Climbing the autonomy ladder requires a deliberate second tap within three seconds; the destructive safety action requires the same gesture. Descending toward operator authority — and the recoverable secondary actions — are immediate.",
  },
  {
    name: "Predictable information placement",
    sublabel: "C3 principle",
    href: "/docs/principles",
    rationale:
      "Identity rule at the top, autonomy top-left, comms top-right, safety bottom-right, telemetry bottom-left. The arrangement is invariant across single-platform consoles so an operator's overlearned spatial map remains correct under load.",
  },
];

export default function OperatorConsolePage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "RC3", href: "/c3/rc3" },
          { label: "Templates", href: "/c3/rc3/templates" },
          { label: "Operator console" },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            RC3 Template
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Operator console</h1>
          <p className="mt-3 max-w-2xl text-lg text-fg-muted">
            The anchor template for single-platform robotics operations. Composes the three RC3
            signature organisms — autonomy mode selector, comms / health strip, safety actions —
            over a stylised tactical canvas. One operator, one platform, the full RC3 vocabulary in
            one screen.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">stable</Badge>
        </div>
      </div>

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
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  href={p.href}
                  className="text-base font-semibold text-fg hover:text-accent hover:underline"
                >
                  {p.name}
                </Link>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                  {p.sublabel}
                </span>
              </div>
              <p className="mt-2 text-sm text-fg-muted">{p.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Preview</h2>
          <Link
            href="/c3/rc3/templates/operator-console/preview"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            target="_blank"
            rel="noopener"
          >
            View at viewport scale
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-bg-subtle">
          <div className="h-[720px] overflow-x-auto">
            <ThemedOperatorConsole className="h-full min-w-[860px]" />
          </div>
        </div>
        <p className="mt-2 text-xs text-fg-subtle">
          The autonomy rail discloses on the chevron; climbing arms a transition, descending commits
          immediately. The safety primary requires a second deliberate tap to fire. The console
          keeps its fixed operator layout on narrow screens — scroll horizontally to pan across it.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Code</h2>
        <p className="mt-3 text-fg-muted">
          The console is one file. Copy it into your project, swap the stylised canvas for your real
          map engine, and wire the organism callbacks to your platform backend.
        </p>
        <div className="mt-4">
          <CodeBlock
            language="tsx"
            code={`import { OperatorConsole } from "@/templates/rc3/operator-console";

export default function YourConsole() {
  return <OperatorConsole />;
}`}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Notes</h2>
        <div className="mt-4 space-y-4 text-fg-muted">
          <div>
            <p className="font-medium text-fg">What's customisable</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
              <li>
                The platform — single-platform context here; switch organism <code>scope</code>{" "}
                props to <code>"group"</code> / <code>"swarm"</code> / <code>"mission"</code> for
                broader command contexts (gates which actions and aggregations surface)
              </li>
              <li>
                The autonomy ladder — pass your own <code>rungs</code> array to{" "}
                <Link
                  href="/c3/rc3/components/autonomy-mode-selector"
                  className="text-accent hover:underline"
                >
                  AutonomyModeSelector
                </Link>
                . The default loop-position taxonomy (L0 MANUAL → L3 AUTONOMOUS) is a placeholder
              </li>
              <li>
                The tactical canvas — currently a stylised SVG (grid + geofence + route +
                waypoints). Substitute your real map (Leaflet, Mapbox, MIL-STD-2525 renderer) here
              </li>
              <li>
                The telemetry HUD — pass your platform's live state. Set <code>domain</code> to the
                platform class so labels resolve correctly (ALT vs ELEV vs DEPTH)
              </li>
              <li>
                Organism callbacks — <code>onTransition</code> on the autonomy selector,{" "}
                <code>onAction</code> on safety actions; wire to your backend
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-fg">What's intentionally fixed</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
              <li>
                The identity rule at the top — every RC3 surface carries it (1.5px Ember top border
                + signature dot + RC3 mark + active module name)
              </li>
              <li>
                Organism positions — autonomy top-left, comms top-right, safety bottom-right,
                telemetry bottom-left. Invariant across single-platform consoles
              </li>
              <li>C3 dark mode — operator-canonical regardless of docs-site mode</li>
              <li>
                <code>data-pack="rc3"</code> on the outer wrapper — activates Ember as the accent
                semantic token for anything inside that reads from <code>--prizm-color-accent</code>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-fg">RC3 organisms used</p>
            <p className="mt-2 text-sm">
              <Link
                href="/c3/rc3/components/autonomy-mode-selector"
                className="text-accent hover:underline"
              >
                Autonomy mode selector
              </Link>
              ,{" "}
              <Link
                href="/c3/rc3/components/comms-health-strip"
                className="text-accent hover:underline"
              >
                Comms / health strip
              </Link>
              ,{" "}
              <Link
                href="/c3/rc3/components/safety-actions"
                className="text-accent hover:underline"
              >
                Safety actions
              </Link>
              ,{" "}
              <Link href="/c3/rc3/components/telemetry-hud" className="text-accent hover:underline">
                Telemetry HUD
              </Link>
              . Four organisms cover the four corners. The{" "}
              <Link href="/c3/rc3/templates/fleet-overview" className="text-accent hover:underline">
                fleet overview
              </Link>{" "}
              template composes a broader set — platform roster, platform detail, video tile — for
              multi-platform command. A mission planner template is planned.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
