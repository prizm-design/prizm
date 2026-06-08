import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ThemedFleetOverview } from "./themed-console";

export const metadata = { title: "RC3 — Fleet overview" };

const APPLIED_PRINCIPLES = [
  {
    name: "Active context unambiguous",
    sublabel: "RC3 behavioural invariant 3",
    href: "/c3/rc3/concepts/behavioural-invariants",
    rationale:
      "The roster's Ember-marked active row and the identity rule's `ACTIVE` cell anchor the operator's spatial sense of which platform they are looking at — across a fleet where the same command word means different things to different platforms.",
  },
  {
    name: "Comms / health always visible",
    sublabel: "RC3 behavioural invariant 2",
    href: "/c3/rc3/concepts/behavioural-invariants",
    rationale:
      "The aggregated comms strip sits at the top, surfacing fleet health (linked count, percent healthy, degraded and lost counts) before the operator even scans the roster. Per-platform health is then in the roster row itself.",
  },
  {
    name: "Safety reachable in one tap",
    sublabel: "RC3 behavioural invariant 1",
    href: "/c3/rc3/concepts/behavioural-invariants",
    rationale:
      "Swarm-scope safety actions anchor the bottom-right of the canvas. Recall Swarm and Suspend remain one tap away regardless of which platform the operator is inspecting.",
  },
  {
    name: "Cognitive chunking",
    sublabel: "C3 principle",
    href: "/docs/principles",
    rationale:
      "Three regions: identity + aggregated comms (chrome), roster + active-platform pane (scanning), group autonomy + safety (command). Each region carries one role; nothing crosses chunk boundaries.",
  },
];

export default function FleetOverviewPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "RC3", href: "/c3/rc3" },
          { label: "Templates", href: "/c3/rc3/templates" },
          { label: "Fleet overview" },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            RC3 Template
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Fleet overview</h1>
          <p className="mt-3 max-w-2xl text-lg text-fg-muted">
            Second anchor template — group / swarm command. Composes the platform roster, aggregated
            comms, group-scope autonomy, group-scope safety, and an active-platform pane that drills
            into the selected row with video tile + platform detail.
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
            href="/c3/rc3/templates/fleet-overview/preview"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            target="_blank"
            rel="noopener"
          >
            View at viewport scale
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-bg-subtle">
          <div className="h-[760px]">
            <ThemedFleetOverview />
          </div>
        </div>
        <p className="mt-2 text-xs text-fg-subtle">
          Click a roster row to select that platform — the active-platform pane updates with the new
          source, telemetry, and feed. UAV-04 is in `lost` state; selecting it surfaces the NO
          SIGNAL overlay on the video tile.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Code</h2>
        <p className="mt-3 text-fg-muted">
          One file composing six organisms. Copy it and substitute your platform data source and
          your real video / map engine.
        </p>
        <div className="mt-4">
          <CodeBlock
            language="tsx"
            code={`import { FleetOverview } from "@/templates/rc3/fleet-overview";

export default function YourFleetView() {
  return <FleetOverview />;
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
                The fleet roster — pass your real platforms with their link, signal, battery, and
                autonomy state. The roster handles selection state via <code>onSelect</code>
              </li>
              <li>
                The group autonomy ladder — pass your own <code>rungs</code> array. Group scope uses
                the same MANUAL / SUPERVISED / DELEGATED / AUTONOMOUS vocabulary as platform scope;
                the scope is already established by the header
              </li>
              <li>
                The video placeholder — substitute your stream player (WebRTC, RTSP, HLS) per feed
                via VideoTile's children slot
              </li>
              <li>
                Platform detail fields — position, heading, speed, vertical, mission step, operator,
                last contact. Each section renders only when its prop is passed, so drop any field
                the operator doesn't need at this scope. The vertical label adapts to the platform's
                domain (ALT / ELEV / DEPTH)
              </li>
              <li>
                Roster label — set to the operational group name (`PERIMETER WATCH`, `ECHELON
                BRAVO`, etc.)
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-fg">What's intentionally fixed</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
              <li>The identity rule at the top — every RC3 surface carries it</li>
              <li>
                Three-region layout — aggregated comms (top chrome), roster + active pane
                (scanning), group autonomy + safety (command). Each chunks one role
              </li>
              <li>
                Aggregated comms at the top — fleet health surfaces before per-platform scanning
              </li>
              <li>
                Safety scope is swarm-wide — Recall Swarm / Suspend. Per-platform safety belongs in
                a platform-detail surface (the master-detail companion to roster)
              </li>
              <li>C3 dark mode — operator-canonical regardless of docs-site mode</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-fg">RC3 organisms used</p>
            <p className="mt-2 text-sm">
              <Link
                href="/c3/rc3/components/platform-roster"
                className="text-accent hover:underline"
              >
                Platform roster
              </Link>
              ,{" "}
              <Link
                href="/c3/rc3/components/comms-health-strip"
                className="text-accent hover:underline"
              >
                Comms / health strip
              </Link>{" "}
              (aggregated swarm view),{" "}
              <Link
                href="/c3/rc3/components/autonomy-mode-selector"
                className="text-accent hover:underline"
              >
                Autonomy mode selector
              </Link>{" "}
              (swarm scope),{" "}
              <Link
                href="/c3/rc3/components/safety-actions"
                className="text-accent hover:underline"
              >
                Safety actions
              </Link>{" "}
              (swarm scope),{" "}
              <Link href="/c3/rc3/components/video-tile" className="text-accent hover:underline">
                Video tile
              </Link>
              , and{" "}
              <Link
                href="/c3/rc3/components/platform-detail"
                className="text-accent hover:underline"
              >
                Platform detail
              </Link>{" "}
              (master-detail companion to the roster — surfaces comms, telemetry, mission, and last
              contact for the active platform). Six organisms total.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
