"use client";

import { Rc3JavaFxSection } from "@/components/rc3/javafx-section";
import { PlatformRoster, type RosterEntry } from "@/components/rc3/platform-roster";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

const RC3 = "oklch(71% 0.195 32)";

const GROUP: RosterEntry[] = [
  {
    id: "UGV-04",
    klass: "UGV",
    link: "good",
    signal: 4,
    battery: 78,
    autonomy: "SUPERVISED",
  },
  {
    id: "UGV-05",
    klass: "UGV",
    link: "good",
    signal: 3,
    battery: 64,
    autonomy: "SUPERVISED",
  },
  {
    id: "UAV-09",
    klass: "UAV",
    link: "degraded",
    signal: 2,
    battery: 42,
    autonomy: "DELEGATED",
  },
];

const SWARM: RosterEntry[] = [
  { id: "UGV-04", klass: "UGV", link: "good", signal: 4, battery: 78, autonomy: "AUTONOMOUS" },
  { id: "UGV-05", klass: "UGV", link: "good", signal: 4, battery: 64, autonomy: "AUTONOMOUS" },
  { id: "UGV-06", klass: "UGV", link: "good", signal: 3, battery: 71, autonomy: "AUTONOMOUS" },
  { id: "UAV-01", klass: "UAV", link: "good", signal: 4, battery: 88, autonomy: "AUTONOMOUS" },
  { id: "UAV-02", klass: "UAV", link: "good", signal: 4, battery: 56, autonomy: "AUTONOMOUS" },
  { id: "UAV-03", klass: "UAV", link: "degraded", signal: 2, battery: 31, autonomy: "DELEGATED" },
  { id: "UAV-04", klass: "UAV", link: "lost", signal: 0, battery: 18, autonomy: "MANUAL" },
];

export default function PlatformRosterPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Hero />
      <Anatomy />
      <Props />
      <Wiring />
      <Behaviour />
      <A11y />
      <Rc3JavaFxSection slug="platform-roster" />
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
          { label: "Platform roster" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Platform roster
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        A list of platforms with quick-glance link, autonomy, and battery per row. The active
        platform is unmistakable — Ember-marked left edge and leading dot. Essential for group /
        swarm command surfaces.
      </p>
    </div>
  );
}

function Hero() {
  const [activeGroup, setActiveGroup] = useState<string | undefined>("UGV-04");
  const [activeSwarm, setActiveSwarm] = useState<string | undefined>("UAV-01");

  return (
    <section className="mt-16">
      <SectionLabel>Live</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Two roster postures. Click a row to make it active — the Ember marker shifts. Each row
        carries signal bars, identifier, class tag, autonomy rung, battery percent, and link label.
        Battery and link colours use semantic tokens; identity stays on the Ember edge.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg">
          <div
            className="grid gap-px md:grid-cols-2"
            style={{ backgroundColor: "var(--prizm-color-border)" }}
          >
            <div className="flex flex-col gap-4 bg-bg p-6 md:p-8">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                Group — 3 platforms
              </span>
              <PlatformRoster
                label="ECHELON BRAVO"
                platforms={GROUP}
                activeId={activeGroup}
                onSelect={setActiveGroup}
              />
            </div>
            <div className="flex flex-col gap-4 bg-bg p-6 md:p-8">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                Swarm — 7 platforms, mixed state
              </span>
              <PlatformRoster
                label="PERIMETER WATCH"
                platforms={SWARM}
                activeId={activeSwarm}
                onSelect={setActiveSwarm}
              />
            </div>
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
        Vertical list. Each row is a single mono line of state. The active row carries the Ember
        marker on the left edge; everything else stays neutral so the active context reads
        unambiguously.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Part
          label="Active marker"
          body="Left-edge Ember bar + Ember leading dot mark the active platform. Honours invariant 3 — the active context is unmistakable at a glance."
        />
        <Part
          label="Signal bars"
          body="Four-bar reading coloured by link status. Greyed bars indicate empty slots. Matches the sibling comms / health strip's bar treatment."
        />
        <Part
          label="Identifier + class"
          body="Mono identifier with optional class tag (UGV / UAV / USV / UUV). Class reads in fg-subtle so it doesn't compete with the ID."
        />
        <Part
          label="Autonomy + battery + link"
          body="Right-aligned cluster: current autonomy rung (mono caps), battery percentage with semantic colour, and link label (LINK / DEGRADED / LOST) in semantic tone."
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
    name: "platforms",
    type: "RosterEntry[]",
    description: "Platforms to render, in display order.",
  },
  {
    name: "activeId",
    type: "string",
    description: "The id of the currently active platform. Marked with Ember left-edge + dot.",
  },
  {
    name: "onSelect",
    type: "(id: string) => void",
    description:
      "Fires when the operator selects a row. When omitted, rows are non-interactive (status only) and render without focus / hover affordances.",
  },
  {
    name: "label",
    type: "string",
    description: 'Optional roster label rendered above the list — e.g. `"ECHELON BRAVO"`.',
  },
  {
    name: "fillHeight",
    type: "boolean",
    default: "false",
    description:
      "Opt into fit-and-scroll. Root takes parent's full height; the label header stays anchored; the list scrolls within the roster frame. Use when the fleet might be longer than the column can show.",
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the root container.",
  },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "RosterEntry",
    signature: `interface RosterEntry {
  id: string;                    // operator-visible identifier, e.g. "UGV-04"
  link: "good" | "degraded" | "lost";
  signal?: 0 | 1 | 2 | 3 | 4;    // bars; defaults from link status when omitted
  battery?: number;              // 0-100, colour-coded
  autonomy?: string;             // e.g. "MANUAL", "SUPERVISED"
  klass?: string;                // class tag, e.g. "UGV", "UAV"
}`,
    description:
      'Per-platform row state. Drives the visual cells. Leave lost platforms in the array (with `link: "lost"`) rather than removing them — the operator\'s spatial map stays stable.',
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
        The roster is read-only state plus a single selection callback. The consumer holds the
        active-platform state machine; the roster renders it.
      </p>
      <div className="mt-6">
        <CodeBlock
          language="tsx"
          code={`<PlatformRoster
  label="ECHELON BRAVO"
  platforms={fleet.map(toRosterEntry)}
  activeId={activePlatformId}
  onSelect={(id) => commandContext.focus(id)}
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
          Invariant Three
        </div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">Active context unambiguous</h3>
        <p className="mt-2 max-w-3xl text-sm text-fg-muted">
          The same command word means different things at different platforms. The roster's
          Ember-marked active row anchors the operator's spatial sense of{" "}
          <em>who am I addressing right now</em> — no row hover state, no near-miss colour, no
          ambiguity.
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
      label: "Listbox role",
      body: 'The root carries `role="listbox"` with an `aria-label` (defaults to `Platform roster`). Each row is `role="option"` with `aria-selected` reflecting the active state.',
    },
    {
      label: "Interactive vs status",
      body: "When `onSelect` is passed, rows render as buttons with hover / focus affordances and keyboard activation. When omitted, rows are static status-only items — no focus ring, no hover.",
    },
    {
      label: "Decorative visuals",
      body: "Signal bars, the Ember left-edge, and the leading dot are `aria-hidden`. Row text — ID, autonomy, battery percentage, link label — carries the meaning.",
    },
    {
      label: "Colour and meaning",
      body: "Link state (LINK / DEGRADED / LOST) and battery percentage are paired with explicit text. Operators with colour-vision differences still read state.",
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
        Use whenever the operator commands more than one platform. The roster's first responsibility
        is to make the active context unambiguous — if no platform is active, pass an explicit{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">activeId</code> that the
        consumer's state machine can verify. Leave lost platforms in the list with{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">link: "lost"</code>{" "}
        rather than removing them — the operator's spatial map of the fleet stays stable.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
