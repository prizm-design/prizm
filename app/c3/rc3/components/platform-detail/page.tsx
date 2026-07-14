"use client";

import { CapacityBar, PipCount, StateDot, StateText } from "@/components/rc3/indicators";
import { Rc3JavaFxSection } from "@/components/rc3/javafx-section";
import { PlatformDetail, type PlatformDetailProps } from "@/components/rc3/platform-detail";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const RC3 = "oklch(71% 0.195 32)";

const FIXTURES: (PlatformDetailProps & { description: string })[] = [
  {
    platform: "UAV-01",
    klass: "UAV",
    domain: "aerial",
    link: "good",
    signal: 4,
    battery: 88,
    autonomy: "DELEGATED",
    position: "01°20'58\"N 103°49'13\"E",
    heading: 120,
    speed: 22,
    speedUnit: "kn",
    vertical: 4000,
    verticalUnit: "ft",
    verticalRef: "AGL",
    mission: { current: 4, total: 12, label: "WPT-04" },
    operator: "MAJ A. LOH",
    lastContact: "0.3 s ago",
    description:
      "Full aerial fixture — every section populated. The master-detail companion to the fleet-overview roster when this platform is selected.",
  },
  {
    platform: "UGV-04",
    klass: "UGV",
    domain: "ground",
    link: "good",
    signal: 4,
    battery: 78,
    autonomy: "SUPERVISED",
    heading: 48,
    speed: 3.2,
    operator: "WO2 S. TAN",
    lastContact: "0.2 s ago",
    description:
      "Ground platform — ELEV reads not ALT; minimal telemetry; no mission step (operator is manually driving).",
  },
  {
    platform: "UUV-11",
    klass: "UUV",
    domain: "underwater",
    link: "good",
    signal: 3,
    battery: 64,
    autonomy: "AUTONOMOUS",
    position: "01°15'30\"N 103°52'40\"E",
    heading: 92,
    speed: 2.4,
    vertical: 85,
    verticalUnit: "m",
    mission: { current: 7, total: 9, label: "TRANSECT C" },
    operator: "SYSTEM AI",
    lastContact: "1.1 s ago",
    description:
      "Underwater platform — DEPTH reads instead of ALT; speed in m/s; operator is SYSTEM AI (autonomous mode).",
  },
  {
    platform: "USV-02",
    klass: "USV",
    domain: "surface",
    link: "degraded",
    signal: 2,
    battery: 54,
    autonomy: "SUPERVISED",
    position: "01°16'42\"N 103°47'10\"E",
    heading: 305,
    speed: 6.2,
    speedUnit: "kn",
    vertical: 18,
    verticalUnit: "m",
    verticalRef: "BLW",
    mission: { current: 3, total: 6, label: "PATROL B" },
    operator: "LTA H. WONG",
    lastContact: "0.6 s ago",
    extras: [
      {
        section: "Endurance",
        label: "Fuel",
        value: <CapacityBar pct={62} suffix="62%" />,
      },
      {
        section: "Sensors",
        label: "Sonar",
        value: <StateDot state="active">Active</StateDot>,
      },
      {
        section: "Sensors",
        label: "Radar",
        value: <StateDot state="standby">Standby</StateDot>,
      },
    ],
    description:
      "Surface platform — DEPTH reads water-under-keel; degraded link surfaces semantic colour on LINK. Endurance uses `CapacityBar` for the diesel reserve, Sensors uses `StateDot` — two indicator primitives in one card.",
  },
  {
    platform: "UAV-04",
    klass: "UAV",
    domain: "aerial",
    link: "lost",
    signal: 0,
    battery: 18,
    autonomy: "MANUAL",
    lastContact: "47 s ago",
    description:
      "Lost-link state — sparse data, lastContact stretches, low battery flagged. The detail panel still anchors the platform identity even when most fields are absent.",
  },
  {
    platform: "UAV-07",
    klass: "UAV",
    domain: "aerial",
    link: "good",
    signal: 4,
    battery: 72,
    autonomy: "DELEGATED",
    position: "01°22'14\"N 103°50'40\"E",
    heading: 215,
    speed: 28,
    speedUnit: "kn",
    vertical: 3500,
    verticalUnit: "ft",
    verticalRef: "AGL",
    mission: { current: 2, total: 5, label: "STRIKE A" },
    operator: "CPT NG",
    lastContact: "0.3 s ago",
    extras: [
      {
        section: "Payload",
        label: "Munition",
        value: <PipCount filled={4} total={4} suffix="AGM-114" />,
      },
      {
        section: "Payload",
        label: "Status",
        value: <StateText tone="danger">ARMED</StateText>,
      },
      {
        section: "Sensors",
        label: "EO/IR",
        value: <StateDot state="active">Tracking</StateDot>,
      },
      {
        section: "Sensors",
        label: "Radar",
        value: <StateDot state="standby">Standby</StateDot>,
      },
    ],
    description:
      "Strike platform with `extras` — Payload and Sensors sections compose `PipCount`, `StateText`, and `StateDot` into row values so payload and sensor state read as instruments, not flat text.",
  },
];

export default function PlatformDetailPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Hero />
      <Anatomy />
      <Indicators />
      <Props />
      <Wiring />
      <Behaviour />
      <A11y />
      <Rc3JavaFxSection slug="platform-detail" />
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
          { label: "Platform detail" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Platform detail
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        Vertical card showing the deep state of a single platform — the master-detail companion to
        platform roster. Composes naturally to the right of a roster: operator scans the list,
        selects a row, this panel surfaces everything else.
      </p>
    </div>
  );
}

function Hero() {
  return (
    <section className="mt-16">
      <SectionLabel>Live</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Six fixtures across UXV domains (UAV / UGV / UUV / USV), then a lost-link state and a strike
        platform demonstrating the indicator alphabet. Each section renders only when its props are
        passed.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg">
          <div
            className="grid gap-px md:grid-cols-2"
            style={{ backgroundColor: "var(--prizm-color-border)" }}
          >
            {FIXTURES.map((f, i) => {
              const { description: _d, ...detailProps } = f;
              return (
                <div key={i} className="flex flex-col gap-4 bg-bg p-6 md:p-8">
                  <span className="text-sm text-fg-muted">{f.description}</span>
                  <PlatformDetail {...detailProps} />
                </div>
              );
            })}
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
        Header + three labelled sections (Comms, Telemetry, Mission), plus an optional last- contact
        footer. Each row is a label + value pair in mono. The header carries the Ember platform
        marker; rows stay neutral except for semantic-coded link / battery values.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Part
          label="Header"
          body="Ember-dotted platform identifier, optional class tag, optional current-autonomy summary on the right. Always present."
        />
        <Part
          label="Comms section"
          body="LINK label (semantic colour), signal bars next to the count, battery gauge next to the percent. Surfaces only if at least one is passed."
        />
        <Part
          label="Telemetry section"
          body="POSITION, HEADING (with a small rotating dial alongside the bearing), SPEED, vertical (ALT/ELEV/DEPTH from domain). Each row optional."
        />
        <Part
          label="Mission section"
          body="Mission step progress (e.g. WPT-04 · 4/12) and active operator. Together they answer 'what is this platform doing and who's responsible.'"
        />
        <Part
          label="Extras"
          body="Domain-specific rows surfaced between Mission and Last contact — payload, sensor health, fuel, munitions. Consecutive entries with the same section group under one header."
        />
        <Part
          label="Indicator alphabet"
          body="PipCount (discrete inventory), CapacityBar (continuous percentage), StateDot (active / standby / off), StateText (binary safety-critical state) compose into extras[].value so payload, endurance, and sensor rows read as instruments rather than flat text. See the Indicators section below."
        />
        <Part
          label="Fit-and-scroll"
          body="Pass fillHeight to opt into internal scrolling. The header and last-contact footer stay anchored; the body (Comms / Telemetry / Mission / extras) scrolls within the frame. Use when composing inside a height-constrained container so a card with many extras doesn't push the parent layout. Without it, the card stays intrinsic-height."
        />
        <Part
          label="Last contact footer"
          body="Time since last heartbeat. Anchors invariant 5 — when contact ages out, the operator sees it before drawing conclusions from stale data."
        />
        <Part
          label="Master-detail compositing"
          body="Designed to sit next to platform roster — roster has the active-platform state, detail receives the same id and renders the deep state."
        />
      </div>
    </section>
  );
}

function Indicators() {
  return (
    <section className="mt-20">
      <SectionLabel>Indicators</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Four pack-internal primitives extend the indicator alphabet beyond the built-in signal /
        battery / heading. Pass them through{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">extras[].value</code> so
        payload, endurance, sensor, and safety-critical rows read as instruments rather than flat
        text. Imported from{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
          @/components/rc3/indicators
        </code>
        .
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <IndicatorCard
          name="PipCount"
          rationale="Discrete inventory — munition rounds, smoke cartridges, comms-relay drops. Pips stay countable; a smooth gauge would round away the operationally-meaningful unit."
          sample={<PipCount filled={3} total={4} suffix="AGM-114" />}
          code={`<PipCount filled={3} total={4} suffix="AGM-114" />`}
        />
        <IndicatorCard
          name="CapacityBar"
          rationale="Continuous percentage — fuel reserve, comms-relay buffer, mission completion, tank level. Pair with text suffix carrying the value or remaining-time. Tone is explicit since 'low = bad' is not universal."
          sample={
            <div className="flex flex-col gap-2">
              <CapacityBar pct={62} suffix="62%" />
              <CapacityBar pct={34} suffix="34%" tone="warning" />
              <CapacityBar pct={12} suffix="12%" tone="danger" />
            </div>
          }
          code={`<CapacityBar pct={62} suffix="62%" />`}
        />
        <IndicatorCard
          name="StateDot"
          rationale="Three-state operational status — active / standby / off. Colour-coded dot paired with the state text. Use for sensor channels, sub-system health, secondary modes."
          sample={
            <div className="flex flex-col gap-2">
              <StateDot state="active">Tracking</StateDot>
              <StateDot state="standby">Standby</StateDot>
              <StateDot state="off">Offline</StateDot>
            </div>
          }
          code={`<StateDot state="active">Tracking</StateDot>`}
        />
        <IndicatorCard
          name="StateText"
          rationale="Binary safety-critical state — ARMED / SAFE, WEAPONS HOT / COLD. Colour-coded mono text, no border or pill. Matches the LINK / LOST family already in Comms."
          sample={
            <div className="flex flex-col gap-2">
              <StateText tone="danger">ARMED</StateText>
              <StateText tone="success">SAFE</StateText>
            </div>
          }
          code={`<StateText tone="danger">ARMED</StateText>`}
        />
      </div>

      <p className="mt-6 max-w-3xl text-sm text-fg-muted">
        Pick the indicator that matches the data&apos;s shape — pips for discrete countable
        quantities, capacity bar for continuous percentages, dots for ternary state, semantic text
        for binary safety-critical state. Don&apos;t reach for chrome decoration (corner brackets,
        bordered pills, glow) to signal &ldquo;tactical&rdquo;; the instrument reads tactical
        because the encoding is honest.
      </p>
    </section>
  );
}

function IndicatorCard({
  name,
  rationale,
  sample,
  code,
}: {
  name: string;
  rationale: string;
  sample: ReactNode;
  code: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="font-mono text-xs font-semibold text-fg">{name}</div>
      <p className="text-sm text-fg-muted">{rationale}</p>
      <div className="rounded-md border border-border bg-bg-subtle px-3 py-3">{sample}</div>
      <code className="block overflow-x-auto rounded bg-bg-muted px-2 py-1.5 font-mono text-[11px] text-fg-muted">
        {code}
      </code>
    </div>
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
    name: "platform",
    type: "string",
    description: 'Platform identifier — e.g. `"UAV-01"`. Ember-dotted header.',
  },
  { name: "klass", type: "string", description: "Class tag — UGV / UAV / USV / UUV." },
  {
    name: "domain",
    type: '"aerial" | "ground" | "surface" | "underwater"',
    description: "Drives the vertical concept label (ALT / ELEV / DEPTH).",
  },
  {
    name: "link",
    type: '"good" | "degraded" | "lost"',
    description: "Link state. Surfaces in the Comms section as a semantic-coloured LINK label.",
  },
  { name: "signal", type: "0 | 1 | 2 | 3 | 4", description: "Signal bars count." },
  {
    name: "battery",
    type: "number",
    description:
      "Battery percent (0–100). Colour-coded — success > 50, warning 20–50, danger < 20.",
  },
  {
    name: "autonomy",
    type: "string",
    description: 'Current autonomy rung label — e.g. `"DELEGATED"`. Surfaces in the header.',
  },
  {
    name: "position",
    type: "string",
    description: "Consumer-formatted coordinates — e.g. `01°20'58\"N 103°49'13\"E`.",
  },
  {
    name: "heading",
    type: "number",
    description: "Heading in degrees (0–359). Three-digit padded.",
  },
  { name: "speed", type: "number", description: "Speed value." },
  {
    name: "speedUnit",
    type: '"m/s" | "km/h" | "kn"',
    default: '"m/s"',
    description: "Speed unit.",
  },
  {
    name: "vertical",
    type: "number",
    description: "Vertical position. Label resolves from `domain`.",
  },
  { name: "verticalUnit", type: '"m" | "ft"', default: '"m"', description: "Vertical unit." },
  {
    name: "verticalRef",
    type: "string",
    description: 'Reference marker — e.g. `"AGL"`, `"MSL"`, `"BLW"`.',
  },
  {
    name: "mission",
    type: "MissionStep",
    description: "Mission step progress — `{ current, total, label? }`.",
  },
  {
    name: "operator",
    type: "string",
    description: "Active operator — who is currently driving / supervising.",
  },
  {
    name: "lastContact",
    type: "string",
    description: 'Time since last heartbeat — e.g. `"0.3 s ago"`. Surfaces in the footer.',
  },
  {
    name: "extras",
    type: "PlatformDetailExtra[]",
    description:
      "Domain-specific rows surfaced between Mission and Last contact. Consecutive entries with the same `section` group under one header; an entry without a `section` merges into the immediately-preceding section.",
  },
  {
    name: "fillHeight",
    type: "boolean",
    default: "false",
    description:
      "Opt into fit-and-scroll. Root takes parent's full height; header and last-contact footer stay anchored; the body section scrolls within the frame. Use inside height-constrained containers.",
  },
  { name: "className", type: "string", description: "Forwarded to the root container." },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "MissionStep",
    signature: `interface MissionStep {
  current: number;   // current step, 1-indexed
  total: number;     // total steps
  label?: string;    // optional step label, e.g. "WPT-04"
}`,
    description:
      "Mission progress. The detail renders as `{label} · {current}/{total}` when label is provided, otherwise just the count.",
  },
  {
    name: "PlatformDetailExtra",
    signature: `interface PlatformDetailExtra {
  section?: string;     // section header (consecutive same-section entries group)
  label: string;        // row label
  value: ReactNode;     // row value
}`,
    description:
      "Shape of one entry in `extras`. Omit `section` to merge a row into the preceding section.",
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
        Read-only. Pass the active platform's deep state. Compose to the right of platform roster —
        roster passes the selected id up to the consumer's state machine, the consumer looks up the
        platform's full record and passes the fields to this organism. Pass `extras` for
        domain-specific rows (payload, sensors, fuel) that the base props don't cover.
      </p>
      <div className="mt-6">
        <CodeBlock
          language="tsx"
          code={`import {
  CapacityBar,
  PipCount,
  StateDot,
  StateText,
} from "@/components/rc3/indicators";

const active = fleet.find((p) => p.id === activeId);

<div className="flex gap-4">
  <PlatformRoster
    platforms={fleet.map(toRosterEntry)}
    activeId={activeId}
    onSelect={setActiveId}
  />
  {active && (
    <PlatformDetail
      platform={active.id}
      klass={active.klass}
      domain={active.domain}
      link={active.link}
      signal={active.signal}
      battery={active.battery}
      autonomy={active.autonomy}
      position={active.coords}
      heading={active.heading}
      speed={active.speed}
      speedUnit={active.speedUnit}
      vertical={active.altitude}
      verticalUnit={active.altitudeUnit}
      verticalRef={active.altitudeRef}
      mission={active.mission}
      operator={active.operator}
      lastContact={active.lastContact}
      extras={[
        {
          section: "Payload",
          label: "Munition",
          value: <PipCount filled={4} total={4} suffix="AGM-114" />,
        },
        {
          section: "Payload",
          label: "Status",
          value: <StateText tone="danger">ARMED</StateText>,
        },
        {
          section: "Endurance",
          label: "Fuel",
          value: <CapacityBar pct={62} suffix="62%" />,
        },
        {
          section: "Sensors",
          label: "EO/IR",
          value: <StateDot state="active">Tracking</StateDot>,
        },
      ]}
      fillHeight
    />
  )}
</div>`}
        />
      </div>
      <p className="mt-6 max-w-3xl text-fg-muted">
        Signal bars, battery gauge, and heading dial appear automatically next to their text values
        when <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">signal</code>,{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">battery</code>, and{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">heading</code> are
        passed — no separate prop. Text stays as the primary read; the indicators are a glanceable
        secondary read.
      </p>
      <p className="mt-4 max-w-3xl text-fg-muted">
        Set <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">fillHeight</code>{" "}
        when composing inside a height-constrained container (e.g. a sidebar column with{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">flex-1 min-h-0</code>):
        the card grows to fill the available height and the body section scrolls within the frame,
        so a card with many{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">extras</code> doesn't
        push the parent layout. Without it the card stays intrinsic-height.
      </p>
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
          The Ember-dotted header marks which platform this detail is for. When the operator selects
          a different row in the roster, this card swaps wholesale — never a partial update that
          could leave fields from the previous platform showing.
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
      label: "Region role",
      body: 'The root carries `role="region"` with an `aria-label` of the form `Platform detail for {platform}`.',
    },
    {
      label: "Decorative parts",
      body: "The Ember dot in the header is `aria-hidden`. Row labels and values carry the meaning.",
    },
    {
      label: "Section labels",
      body: "Comms / Telemetry / Mission are visible mono section headers, not just heading roles — they read consistently across operator surfaces.",
    },
    {
      label: "Colour and meaning",
      body: "Link and battery state colour is paired with text. Operators with colour-vision differences still read state.",
    },
    {
      label: "Last contact",
      body: "Surfaces honestly when contact ages — pair with consumer logic that classifies the value (e.g. show in danger after a threshold). The organism doesn't classify the age; that's domain-specific.",
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
        Compose as the master-detail companion to platform roster. Pass only the fields the platform
        actually surfaces — the card stays useful even when most fields are absent (a lost-link
        platform shows the identifier, lastContact age, and whatever final state was captured before
        contact dropped). Don't carry stale values forward when contact is lost: omit fields whose
        freshness can't be guaranteed.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
