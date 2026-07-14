"use client";

import { Rc3JavaFxSection } from "@/components/rc3/javafx-section";
import { RC3Swatch } from "@/components/rc3/swatch";
import { TelemetryHud, type TelemetryHudProps } from "@/components/rc3/telemetry-hud";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

const RC3 = "oklch(71% 0.195 32)";

type Fixture = TelemetryHudProps & { description: string };

const FIXTURES: Fixture[] = [
  {
    domain: "aerial",
    platform: "UAV-09",
    speed: 22,
    speedUnit: "kn",
    vertical: 4000,
    verticalUnit: "ft",
    verticalRef: "AGL",
    heading: 48,
    battery: 78,
    roll: -3,
    pitch: 2,
    verticalRate: 1.5,
    description:
      "Aerial — airspeed in knots, altitude AGL in feet, full attitude and climb rate. ALT label resolves from the aerial domain.",
  },
  {
    domain: "ground",
    platform: "UGV-04",
    speed: 3.2,
    vertical: 142,
    heading: 178,
    battery: 18,
    roll: -1,
    pitch: 4,
    slope: 8,
    description:
      "Ground — ELEV reads instead of ALT. Slope cell carries the terrain grade. Battery surfaces in danger colour at 18%.",
  },
  {
    domain: "surface",
    platform: "USV-02",
    speed: 14,
    speedUnit: "kn",
    vertical: 32,
    verticalRef: "BLW",
    heading: 270,
    fuel: 42,
    roll: -4,
    pitch: 1,
    description:
      "Surface — DEPTH reads (below-keel sounder); fuel substitutes for battery on a combustion platform.",
  },
  {
    domain: "underwater",
    platform: "UUV-11",
    speed: 2.4,
    vertical: 85,
    heading: 92,
    battery: 64,
    pitch: -8,
    roll: 0,
    verticalRate: 0.3,
    altitudeAboveBottom: 12,
    description:
      "Underwater — DEPTH reads sub-surface; DIVE rate replaces V/S; BOT shows altitude above seabed.",
  },
];

const FRAME_FIXTURE: TelemetryHudProps = {
  domain: "aerial",
  platform: "UAV-09",
  speed: 22,
  speedUnit: "kn",
  vertical: 4000,
  verticalUnit: "ft",
  verticalRef: "AGL",
  heading: 48,
  battery: 78,
  roll: -3,
  pitch: 2,
  verticalRate: 1.5,
};

export default function TelemetryHudPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <FramePosture />
      <DomainShowcase />
      <StaleState />
      <Anatomy />
      <Props />
      <Wiring />
      <Behaviour />
      <A11y />
      <Rc3JavaFxSection slug="telemetry-hud" />
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
          { label: "Telemetry HUD" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Telemetry HUD
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        Operational telemetry for a UXV — aerial, ground, surface, or underwater. The same organism,
        four domain dialects. Two postures: a compact strip for edge overlays, and a four-edge frame
        for centred map / 3D / video viewports.
      </p>
    </div>
  );
}

function DomainShowcase() {
  return (
    <section className="mt-16">
      <SectionLabel>Live · domains · strip mode</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Four domains, four label dialects. The vertical concept changes — `ALT` for aerial, `ELEV`
        for ground, `DEPTH` for surface and underwater. Vertical rate reads `V/S` for aerial, `DIVE`
        for underwater. Domain-specific cells (`SLOPE` for ground, `BOT` for underwater) surface
        only when relevant.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg">
          <div className="grid gap-px" style={{ backgroundColor: "var(--prizm-color-border)" }}>
            {FIXTURES.map((f, i) => {
              const { description: _d, ...hudProps } = f;
              return (
                <div key={i} className="flex flex-col gap-4 bg-bg p-6 md:p-8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                      {(f.domain ?? "aerial").toUpperCase()}
                    </span>
                    <span className="text-sm text-fg-muted">{f.description}</span>
                  </div>
                  <TelemetryHud {...hudProps} />
                </div>
              );
            })}
          </div>
        </div>
      </RC3Swatch>
    </section>
  );
}

function FramePosture() {
  return (
    <section className="mt-16">
      <SectionLabel>Live · frame mode</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Four-edge layout around a centred viewport. The consumer's map, 3D view, or video sits in
        the children slot; telemetry pins to the edges. Top: heading + platform. Left: speed + roll.
        Right: vertical + pitch. Bottom: battery, vertical rate, and any domain-specific cells. The
        centre stays clear.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg p-4 md:p-6">
          <div className="h-[420px] overflow-hidden rounded-md border border-border">
            <TelemetryHud {...FRAME_FIXTURE} mode="frame">
              <Viewport />
            </TelemetryHud>
          </div>
        </div>
      </RC3Swatch>
    </section>
  );
}

/** Stylised map placeholder for the frame-mode demo — grid + faint route. Real consumers plug a
 * Leaflet / Mapbox / 3D renderer here. */
function Viewport() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        // Derived from C3 semantic tokens so the viewport tracks the docs theme — the consumer's
        // real map flips with their app, and the frame chrome (bg-derived pills) melts into it the
        // same way in light and dark. Pre-theming this was a hardcoded dark gradient.
        backgroundColor: "var(--color-bg)",
        backgroundImage: `
          linear-gradient(140deg, color-mix(in oklch, var(--color-bg-muted) 70%, var(--color-bg)) 0%, var(--color-bg) 100%),
          linear-gradient(color-mix(in oklch, var(--color-border) 35%, var(--color-bg)) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklch, var(--color-border) 35%, var(--color-bg)) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 24px 24px, 24px 24px",
      }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M 80 380 Q 250 320 420 300 T 720 220 T 940 160"
          fill="none"
          stroke="var(--color-fg-subtle)"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          opacity="0.55"
        />
        <g>
          <circle cx={720} cy={220} r={5} fill="var(--color-fg-subtle)" opacity="0.5" />
        </g>
        <g>
          <circle cx={420} cy={300} r={12} fill="oklch(71% 0.195 32)" opacity="0.2" />
          <circle cx={420} cy={300} r={5} fill="oklch(71% 0.195 32)" />
        </g>
      </svg>
      <span
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle lg:block"
        aria-hidden="true"
      >
        Viewport · map / 3D / video
      </span>
    </div>
  );
}

function StaleState() {
  return (
    <section className="mt-16">
      <SectionLabel>Live · stale field</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Heading has stopped updating. Rather than presenting a frozen `174°` as if it were live, the
        cell dims its value and carries a `STALE` age tag — the operator sees the degradation before
        acting on it. Fresh cells around it are unaffected. This is invariant 5 in the organism
        itself: mark stale, never hold a silent last-good value.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="flex items-center justify-center bg-bg p-8 md:p-12">
          <TelemetryHud
            domain="ground"
            platform="UGV-04"
            speed={3.2}
            heading={174}
            battery={87}
            stale={{ heading: 4 }}
          />
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
        Same cells, two postures. The cell set is determined by what the consumer passes; the
        posture is determined by `mode`. Labels resolve from `domain`.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Part
          label="Domain"
          body="Aerial / ground / surface / underwater. Resolves the vertical concept (ALT / ELEV / DEPTH) and the vertical rate (V/S / DIVE) without forking the organism."
        />
        <Part
          label="Platform marker"
          body="Optional leading cell. Ember dot + mono identifier. Marks 'this is the active RC3 platform.' Drop when the HUD overlays a video tile that already names the source."
        />
        <Part
          label="Strip mode"
          body="Inline horizontal row. Cells flow with hairline dividers, flex-wraps on narrow viewports. Best for edge overlays and side panels."
        />
        <Part
          label="Frame mode"
          body="Four-edge container with the consumer's viewport in the centre. Top: heading + platform. Left: speed + roll. Right: vertical + pitch. Bottom: charge + rate + domain cells."
        />
        <Part
          label="Battery / fuel colour"
          body="Success > 50%, warning 20–50%, danger < 20%. Operators read state before reading the number."
        />
        <Part
          label="Stale marker"
          body="A field passed in `stale` dims its value and gains a STALE age tag. The frozen reading stays visible but unmistakably degraded — never silently fresh-looking."
        />
        <Part
          label="Domain-specific cells"
          body="SLOPE (ground only) and BOT — altitude above bottom — surface where the platform's domain makes them meaningful."
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
    name: "domain",
    type: '"aerial" | "ground" | "surface" | "underwater"',
    default: '"aerial"',
    description:
      "UXV domain. Drives label semantics: `vertical` reads as ALT / ELEV / DEPTH; `verticalRate` reads as V/S / DIVE. Domain-specific cells (`slope`, `altitudeAboveBottom`) surface only when meaningful.",
  },
  {
    name: "mode",
    type: '"strip" | "frame"',
    default: '"strip"',
    description:
      "Layout. `strip` is an inline horizontal row, suited to edge overlays and side panels. `frame` is a four-edge container around a centred viewport (map, 3D, video).",
  },
  {
    name: "platform",
    type: "string",
    description:
      'Optional platform identifier — e.g. `"UGV-04"`. Renders as the leading Ember-dotted cell.',
  },
  {
    name: "speed",
    type: "number",
    description: "Speed value. Unit defaults to `m/s`.",
  },
  {
    name: "speedUnit",
    type: '"m/s" | "km/h" | "kn"',
    default: '"m/s"',
    description: "Speed unit. `m/s` rounds to one decimal; `km/h` and `kn` round to integer.",
  },
  {
    name: "vertical",
    type: "number",
    description:
      "Vertical position. Aerial: altitude. Ground: elevation. Surface / underwater: depth. Label resolves from `domain`.",
  },
  {
    name: "verticalUnit",
    type: '"m" | "ft"',
    default: '"m"',
    description: "Vertical unit.",
  },
  {
    name: "verticalRef",
    type: "string",
    description:
      'Optional reference marker appended to the vertical cell — e.g. `"AGL"` / `"MSL"` / `"BLW"`.',
  },
  {
    name: "verticalRate",
    type: "number",
    description:
      "Vertical rate in m/s. Signed. Label resolves from `domain` — `V/S` for aerial, `DIVE` for underwater.",
  },
  {
    name: "heading",
    type: "number",
    description: "Heading in degrees (0–359). Rendered three-digit padded — `HDG 048°`.",
  },
  {
    name: "battery",
    type: "number",
    description:
      "Battery state of charge (0–100). Colour-coded — success > 50, warning 20–50, danger < 20.",
  },
  {
    name: "fuel",
    type: "number",
    description:
      "Fuel level (0–100). Mutually exclusive with `battery`; if both are passed, battery wins.",
  },
  {
    name: "roll",
    type: "number",
    description: "Roll angle in degrees. Signed.",
  },
  {
    name: "pitch",
    type: "number",
    description: "Pitch angle in degrees. Signed.",
  },
  {
    name: "slope",
    type: "number",
    description:
      'Ground-only — slope / grade in degrees. Signed. Renders only when `domain="ground"`.',
  },
  {
    name: "altitudeAboveBottom",
    type: "number",
    description:
      "Distance to bottom in metres. Sounder reading; meaningful for underwater and deep-terrain ground platforms.",
  },
  {
    name: "stale",
    type: "Partial<Record<TelemetryField, number>>",
    description:
      "Per-field staleness, in seconds since the last fresh update. A listed field keeps its last-known value but renders dimmed with a `STALE` age tag — a frozen reading never passes for live. Honours invariant 5.",
  },
  {
    name: "children",
    type: "ReactNode",
    description: 'Rendered inside the frame centre when `mode="frame"`. Ignored in strip mode.',
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the root container.",
  },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "UxvDomain",
    signature: `type UxvDomain = "aerial" | "ground" | "surface" | "underwater";`,
    description: "UXV domain. Drives label semantics for the vertical concept and vertical rate.",
  },
  {
    name: "SpeedUnit",
    signature: `type SpeedUnit = "m/s" | "km/h" | "kn";`,
    description: "Speed unit. Use `kn` for aviation / surface, `m/s` for ground / underwater.",
  },
  {
    name: "VerticalUnit",
    signature: `type VerticalUnit = "m" | "ft";`,
    description: "Vertical unit. `ft` typical for aviation; `m` for everything else.",
  },
  {
    name: "HudMode",
    signature: `type HudMode = "strip" | "frame";`,
    description: "Layout posture.",
  },
  {
    name: "TelemetryField",
    signature: `type TelemetryField =
  | "speed" | "vertical" | "heading"
  | "battery" | "fuel" | "roll" | "pitch"
  | "verticalRate" | "slope" | "altitudeAboveBottom";`,
    description:
      "The fields that can be marked stale via the `stale` prop. Keyed by the feeding prop.",
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
        Read-only — pass whichever fields the platform surfaces. When a field stops updating, mark
        it stale via `stale` rather than letting a frozen value look live. Set `domain` to the
        platform class.
      </p>
      <div className="mt-6 space-y-3">
        <CodeBlock
          language="tsx"
          code={`// Aerial — strip mode beside a video tile
<TelemetryHud
  domain="aerial"
  platform="UAV-09"
  speed={state.airspeed}
  speedUnit="kn"
  vertical={state.altitudeFt}
  verticalUnit="ft"
  verticalRef="AGL"
  heading={state.heading}
  battery={state.batteryPct}
  roll={state.attitude.roll}
  pitch={state.attitude.pitch}
  verticalRate={state.climbRate}
/>`}
        />
        <CodeBlock
          language="tsx"
          code={`// Underwater — DEPTH and DIVE labels resolve from domain
<TelemetryHud
  domain="underwater"
  platform="UUV-11"
  speed={state.speed}
  vertical={state.depth}
  heading={state.heading}
  battery={state.batteryPct}
  pitch={state.diveAngle}
  verticalRate={state.diveRate}
  altitudeAboveBottom={state.sounderM}
/>`}
        />
        <CodeBlock
          language="tsx"
          code={`// Frame mode — four-edge overlay around a map / 3D viewport
<TelemetryHud mode="frame" domain="aerial" ...telemetry>
  <YourMapEngine />
</TelemetryHud>`}
        />
        <CodeBlock
          language="tsx"
          code={`// Mark a field stale when it stops updating — invariant 5
<TelemetryHud
  domain="ground"
  platform="UGV-04"
  speed={state.speed}
  heading={state.lastHeading}
  battery={state.batteryPct}
  stale={{ heading: secondsSince(state.headingUpdatedAt) }}
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
          Invariant Five
        </div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">
          Telemetry never silently stale
        </h3>
        <p className="mt-2 max-w-3xl text-sm text-fg-muted">
          When a field stops updating, mark it stale via `stale` — the value dims and gains a STALE
          age tag so a frozen reading can never pass for live. A degraded battery surfaces in danger
          before it becomes critical; a stalled heading reads as stale, not as a fresh fix.
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
      body: 'The HUD carries `role="status"` and `aria-live="polite"`. Screen readers announce telemetry transitions without interrupting the operator.',
    },
    {
      label: "Labelled by platform",
      body: "The root `aria-label` is of the form `Telemetry for {platform}` when a platform identifier is present, otherwise just `Telemetry`.",
    },
    {
      label: "Decorative parts",
      body: "The Ember dot and the cell dividers are `aria-hidden`. Cell labels and values carry the meaning.",
    },
    {
      label: "Colour and meaning",
      body: "Battery / fuel state colour is paired with the numeric value — operators with colour-vision differences still read the percentage. The colour amplifies, never replaces, the signal.",
    },
    {
      label: "Stale not colour-only",
      body: "A stale field carries the literal `STALE {age}` text alongside the dimmed value — the degradation is legible without relying on the danger colour. The `aria-live` region announces the change.",
    },
    {
      label: "Tabular nums",
      body: "Values use `tabular-nums` so digits do not shift width as values change. The strip stays scannable when the operator's eye returns to the same cell repeatedly.",
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
        Set `domain` to the platform class. Pass whichever fields the platform surfaces — labels
        resolve automatically. Drop the platform marker when the HUD overlays a video tile that
        already identifies the source. For map and 3D viewports, prefer `mode="frame"` and let the
        edges hold the telemetry while the centre stays clear. Keep the HUD honest: when a field
        stops updating, mark it stale via `stale` rather than letting a frozen value look live.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
