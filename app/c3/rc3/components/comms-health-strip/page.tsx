import {
  CommsHealthStrip,
  type PlatformLink,
  type Scope,
} from "@/components/rc3/comms-health-strip";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "RC3 — Comms / health strip" };

const RC3 = "oklch(71% 0.195 32)";

// Mock telemetry for the showcase.
const PLATFORM: PlatformLink = {
  id: "UGV-04",
  signal: 4,
  battery: 87,
  gpsLock: true,
  status: "good",
};

const GROUP: PlatformLink[] = [
  { id: "UGV-04", signal: 4, status: "good" },
  { id: "UGV-05", signal: 3, status: "good" },
  { id: "UAV-09", signal: 2, status: "degraded" },
];

const SWARM: PlatformLink[] = [
  { id: "UGV-04", signal: 4, status: "good" },
  { id: "UGV-05", signal: 3, status: "good" },
  { id: "UGV-06", signal: 3, status: "good" },
  { id: "UGV-07", signal: 4, status: "good" },
  { id: "UGV-08", signal: 3, status: "good" },
  { id: "UGV-09", signal: 2, status: "degraded" },
  { id: "UAV-01", signal: 4, status: "good" },
  { id: "UAV-02", signal: 3, status: "good" },
  { id: "UAV-03", signal: 4, status: "good" },
  { id: "UAV-04", signal: 3, status: "good" },
  { id: "UAV-05", signal: 4, status: "good" },
  { id: "UAV-06", signal: 0, status: "lost" },
];

const MISSION: PlatformLink[] = Array.from({ length: 47 }, (_, i) => {
  const status: PlatformLink["status"] = i < 40 ? "good" : i < 44 ? "degraded" : "lost";
  return {
    id: `PLT-${String(i + 1).padStart(3, "0")}`,
    signal: status === "good" ? 4 : status === "degraded" ? 2 : 0,
    status,
  };
});

const SHOWCASE: {
  scope: Scope;
  label: string;
  example: string;
  description: string;
}[] = [
  {
    scope: "platform",
    label: "Platform",
    example: "UGV-04",
    description: "Single platform — signal, link, battery, GPS",
  },
  {
    scope: "group",
    label: "Group",
    example: "ECHELON BRAVO · 3 PLATFORMS",
    description: "Aggregated link count, per-platform pips",
  },
  {
    scope: "swarm",
    label: "Swarm",
    example: "PERIMETER WATCH · 12 PLATFORMS",
    description: "Aggregated count, percent healthy, degraded callout",
  },
  {
    scope: "mission",
    label: "Mission",
    example: "OP NIGHTOWL · 47 PLATFORMS",
    description: "Mission-wide summary with degraded and lost counts",
  },
];

export default function CommsHealthStripPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Hero />
      <Anatomy />
      <Props />
      <Wiring />
      <Behaviour />
      <A11y />
      <Usage />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[
          { label: "RC3", href: "/c3/rc3" },
          { label: "Components", href: "/c3/rc3/components" },
          { label: "Comms / health strip" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Comms / health strip
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        A persistent strip that carries link state, signal strength, and platform health for
        whatever scope the operator is addressing. Visible whenever a platform is live.
      </p>
    </div>
  );
}

function Hero() {
  return (
    <section className="mt-16">
      <SectionLabel>Live</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Four scopes, four densities of the same idea. Status colours follow semantic tokens —
        success for a clean link, warning for degraded, danger for lost.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg">
          <div className="grid gap-px" style={{ backgroundColor: "var(--prizm-color-border)" }}>
            {SHOWCASE.map(({ scope, label, example, description }) => (
              <div key={scope} className="flex flex-col gap-4 bg-bg p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                      {label}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: RC3 }}
                      />
                      <span className="font-mono text-xs font-semibold text-fg">{example}</span>
                    </span>
                  </div>
                  <span className="text-xs text-fg-subtle">{description}</span>
                </div>
                {scope === "platform" ? (
                  <CommsHealthStrip scope="platform" platform={PLATFORM} />
                ) : scope === "group" ? (
                  <CommsHealthStrip scope="group" platforms={GROUP} />
                ) : scope === "swarm" ? (
                  <CommsHealthStrip scope="swarm" platforms={SWARM} />
                ) : (
                  <CommsHealthStrip scope="mission" platforms={MISSION} />
                )}
              </div>
            ))}
          </div>
        </div>
      </RC3Swatch>
    </section>
  );
}

function Anatomy() {
  return (
    <section className="mt-20">
      <SectionLabel>Anatomy</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Platform scope is rich and single-row; group / swarm / mission collapse to an aggregated
        summary. Both share the same monospace, the same status-token palette, and the same compact
        strip silhouette so the strip reads the same regardless of scope.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Part
          label="Signal bars"
          body="Four-bar reading coloured by link status. Greyed bars indicate empty slots."
        />
        <Part
          label="Link label"
          body="LINK · DEGRADED · LOST. Coloured by semantic token. Always present even when LOST."
        />
        <Part
          label="Aggregated count"
          body="X / Y LINK at group, swarm, and mission scope. Degraded and lost surface as separate counts in their semantic colours."
        />
        <Part
          label="Per-platform pips"
          body="At group and swarm scope (≤12 platforms), a small dot per platform shows individual status. Mission scope drops the pips for legibility."
        />
      </div>
    </section>
  );
}

function Part({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
        {label}
      </div>
      <p className="mt-2 text-sm text-fg">{body}</p>
    </div>
  );
}

const PROPS: { name: string; type: string; default?: string; description: string }[] = [
  {
    name: "scope",
    type: "Scope",
    description:
      "Selects single-row platform view vs aggregated summary. See [Command contexts](/c3/rc3/concepts/command-contexts) for the type definition.",
  },
  {
    name: "platform",
    type: "PlatformLink",
    description: 'Required when `scope="platform"`. The single platform\'s link state.',
  },
  {
    name: "platforms",
    type: "PlatformLink[]",
    description:
      'Required when `scope` is `group` / `swarm` / `mission`. Leave lost platforms in the list with `status: "lost"` rather than removing them — the operator\'s spatial map stays stable.',
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the root container.",
  },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "PlatformLink",
    signature: `interface PlatformLink {
  id: string;                                // operator-visible identifier, e.g. "UGV-04"
  signal: 0 | 1 | 2 | 3 | 4;                 // bars, derived from RSSI / link quality
  battery?: number;                          // percentage, 0-100; omit if not applicable
  gpsLock?: boolean;                         // omit if platform has no GPS dependency
  status: "good" | "degraded" | "lost";      // your link-quality classifier
}`,
    description:
      "Per-platform link and health state. Derive from your link layer; the strip doesn't poll or fetch. Polling cadence is the consumer's call — 500ms–1s is typical for command-post surfaces.",
  },
];

function Props() {
  return (
    <section className="mt-20">
      <SectionLabel>Props</SectionLabel>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-bg-subtle text-[10px] uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Prop</th>
              <th className="px-3 py-2 text-left font-medium">Type</th>
              <th className="px-3 py-2 text-left font-medium">Default</th>
              <th className="px-3 py-2 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PROPS.map((p) => (
              <tr key={p.name} className="align-top">
                <td className="px-3 py-2 font-mono text-xs font-semibold text-fg">{p.name}</td>
                <td className="px-3 py-2 font-mono text-xs text-fg-muted">
                  <code className="break-words">{p.type}</code>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-fg-muted">
                  {p.default ?? <span className="text-fg-subtle">—</span>}
                </td>
                <td className="px-3 py-2 text-fg-muted">
                  <PropDescription text={p.description} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 text-xs font-medium uppercase tracking-wider text-fg-subtle">Types</h3>
      <div className="mt-3 space-y-4">
        {TYPES.map((t) => (
          <div key={t.name} className="rounded-md border border-border bg-surface p-4">
            <code className="font-mono text-sm font-semibold text-fg">{t.name}</code>
            <p className="mt-2 text-sm text-fg-muted">{t.description}</p>
            <div className="mt-3">
              <CodeBlock language="ts" code={t.signature} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Render markdown-style [label](href) links and `code` inline backticks in a prop description. */
function PropDescription({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
  let last = 0;
  let m = re.exec(text);
  while (m !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(
        <Link key={`${m.index}-link`} href={m[2]} className="text-accent hover:underline">
          {m[1]}
        </Link>,
      );
    } else if (m[3]) {
      parts.push(
        <code key={`${m.index}-code`} className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
          {m[3]}
        </code>,
      );
    }
    last = m.index + m[0].length;
    m = re.exec(text);
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Wiring() {
  return (
    <section className="mt-20">
      <SectionLabel>Wiring</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Read-only — the strip renders whatever you pass in. Derive{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">PlatformLink</code>{" "}
        values from your link layer and re-render on a cadence that matches your surface.
      </p>
      <div className="mt-6 space-y-3">
        <CodeBlock
          language="tsx"
          code={`// single-platform
<CommsHealthStrip
  scope="platform"
  platform={{
    id: "UGV-04",
    signal: 4,
    battery: 78,
    gpsLock: true,
    status: "good",
  }}
/>`}
        />
        <CodeBlock
          language="tsx"
          code={`// aggregated
<CommsHealthStrip
  scope="group"
  platforms={liveFleet.map(toLinkState)}
/>`}
        />
      </div>
    </section>
  );
}

function Behaviour() {
  return (
    <section className="mt-20">
      <SectionLabel>Behavioural rule</SectionLabel>
      <Link
        href="/c3/rc3/concepts/behavioural-invariants"
        className="group mt-6 flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-bg-subtle"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
          Invariant Two
        </div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">Comms always visible</h3>
        <p className="mt-2 max-w-3xl text-sm text-fg-muted">
          A degraded link is information the operator needs before deciding anything. The strip is
          persistent for every connected platform and is never collapsed into a settings panel or
          tucked behind a tab.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          Read invariant
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </section>
  );
}

function A11y() {
  const rows: { label: string; body: string }[] = [
    {
      label: "Live region",
      body: 'The strip carries `role="status"` and `aria-live="polite"`. Screen readers announce link transitions without interrupting the operator.',
    },
    {
      label: "Labels",
      body: "Platform-scope strip uses an `aria-label` of the form `Comms for {id}: {status}`. Aggregated strip describes the summary count and health percent.",
    },
    {
      label: "Decorative parts",
      body: "Signal bars, dividers, and per-platform pips are `aria-hidden`. The textual link label and counts carry the meaning.",
    },
    {
      label: "Colour and meaning",
      body: "Status colour is never the only signal — every state also carries a text label (LINK / DEGRADED / LOST). Operators with colour-vision differences still read state.",
    },
  ];

  return (
    <section className="mt-20">
      <SectionLabel>Accessibility</SectionLabel>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border first:border-t-0">
                <th
                  scope="row"
                  className="w-40 bg-bg-subtle px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-muted"
                >
                  {r.label}
                </th>
                <td className="px-4 py-3 text-fg-muted">{r.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Usage() {
  return (
    <section className="mt-20 rounded-xl border border-border bg-bg-subtle p-6 md:p-8">
      <SectionLabel>Usage</SectionLabel>
      <p className="mt-4 max-w-3xl text-fg">
        Place the strip where it stays in primary attention — top edge of the operator panel, the
        canvas footer, or the active-platform chip. Never collapse into a settings panel, never tuck
        behind a tab, never gate behind a hover. Status colour follows semantic tokens — do not
        retint with Ember; comms is status, not identity.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
