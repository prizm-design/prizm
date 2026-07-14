"use client";

import { Rc3JavaFxSection } from "@/components/rc3/javafx-section";
import { RC3Swatch } from "@/components/rc3/swatch";
import { type FeedStatus, VideoTile } from "@/components/rc3/video-tile";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

const RC3 = "oklch(71% 0.195 32)";

type FeedFixture = {
  source: string;
  status: FeedStatus;
  description: string;
  coordinates?: string;
  bearing?: number;
  range?: number;
  zoom?: number;
  sensor?: "EO" | "IR" | "LL";
};

const FEEDS: FeedFixture[] = [
  {
    source: "FPV · UGV-04",
    status: "live",
    description:
      "Healthy feed with full telemetry burn-in. Ember dot marks the source as the active RC3 feed; status reads on the label.",
    coordinates: "01°20'58\"N 103°49'13\"E",
    bearing: 48,
    range: 1200,
    zoom: 2,
    sensor: "EO",
  },
  {
    source: "GIMBAL · UAV-09",
    status: "degraded",
    description:
      "Bandwidth-degraded link. Only the sensor mode is in scope — bearing and range are stale and deliberately omitted.",
    sensor: "IR",
    zoom: 4,
  },
  {
    source: "WIDE · UGV-05",
    status: "live",
    description:
      "Minimal default. No telemetry passed; the tile stays sparse. Pass props only when the consumer has signal to surface.",
  },
  {
    source: "IR · UGV-07",
    status: "lost",
    description:
      "Signal lost. The overlay blanks the frame so a stale image cannot be misread as live; telemetry suppressed.",
  },
];

export default function VideoTilePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Hero />
      <Anatomy />
      <Props />
      <Wiring />
      <Behaviour />
      <A11y />
      <Rc3JavaFxSection slug="video-tile" />
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
          { label: "Video tile" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">Video tile</h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        A single sensor feed — FPV camera, gimbal, IR, EO. RC3 ships the frame; the consumer plugs
        the stream player into the children slot.
      </p>
    </div>
  );
}

function Hero() {
  const [recording, setRecording] = useState(false);
  const [reticle, setReticle] = useState(false);

  return (
    <section className="mt-16">
      <SectionLabel>Live</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Three feed states. Toggle recording and reticle to see the optional overlays. The frame
        renders a stylised placeholder where the consumer's real video element would sit.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Toggle label="Recording" on={recording} onChange={setRecording} />
        <Toggle label="Reticle" on={reticle} onChange={setReticle} />
      </div>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg p-6 md:p-8">
          <div className="grid gap-px" style={{ backgroundColor: "var(--prizm-color-border)" }}>
            {FEEDS.map((f) => (
              <div key={f.source} className="flex flex-col gap-4 bg-bg p-6 lg:flex-row lg:gap-8">
                <div className="lg:w-72 lg:shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                    {STATUS_LABEL[f.status]}
                  </span>
                  <p className="mt-2 text-sm text-fg-muted">{f.description}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <VideoTile
                    source={f.source}
                    status={f.status}
                    recording={recording && f.status !== "lost"}
                    reticle={reticle}
                    coordinates={f.coordinates}
                    bearing={f.bearing}
                    range={f.range}
                    zoom={f.zoom}
                    sensor={f.sensor}
                  >
                    <Placeholder source={f.source} status={f.status} />
                  </VideoTile>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RC3Swatch>
    </section>
  );
}

const STATUS_LABEL = {
  live: "Live",
  degraded: "Degraded",
  lost: "Lost",
} as const;

function Toggle({
  label,
  on,
  onChange,
}: { label: string; on: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
        on
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-surface text-fg-muted hover:bg-bg-muted"
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${on ? "bg-accent" : "bg-fg-subtle"}`}
        aria-hidden="true"
      />
      {label}
    </button>
  );
}

/**
 * Stylised placeholder rendered inside the VideoTile's children slot. Real consumers plug their
 * stream player (a `<video>` element for WebRTC / HLS, a JS player for RTSP, a canvas for raw
 * frames) in place of this.
 */
function Placeholder({ source, status }: { source: string; status: FeedStatus }) {
  const gradient =
    status === "live"
      ? "linear-gradient(140deg, oklch(28% 0.05 230) 0%, oklch(18% 0.04 250) 60%, oklch(12% 0.02 260) 100%)"
      : status === "degraded"
        ? "linear-gradient(140deg, oklch(24% 0.04 260) 0%, oklch(16% 0.03 260) 60%, oklch(10% 0.02 260) 100%)"
        : "linear-gradient(140deg, oklch(18% 0.02 260) 0%, oklch(10% 0.01 260) 100%)";

  return (
    <div
      className="relative h-full w-full"
      style={{
        background: gradient,
        backgroundImage: `
          ${gradient},
          linear-gradient(var(--prizm-color-border-soft, oklch(22% 0.025 264.7)) 1px, transparent 1px),
          linear-gradient(90deg, var(--prizm-color-border-soft, oklch(22% 0.025 264.7)) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 24px 24px, 24px 24px",
      }}
    >
      {status !== "lost" && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle"
          aria-hidden="true"
        >
          Video feed · {source.split(" · ").pop()}
        </span>
      )}
    </div>
  );
}

function Anatomy() {
  return (
    <section className="mt-20">
      <SectionLabel>Anatomy</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Frame + five overlay layers. Everything outside the consumer's video element is RC3 chrome —
        restrained, never competing with the feed for attention. The source dot carries the Ember
        signature (identity); status reads in the label colour (semantic).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Part
          label="Source + status"
          body="Top-left chip. Ember identity dot + mono source identifier + semantic status label. Always visible."
        />
        <Part
          label="Telemetry strip"
          body="Bottom-left mono row, single line. Surfaces only the cells the consumer passes — coordinates, sensor mode, bearing, range, zoom. Suppressed when feed is lost."
        />
        <Part
          label="Recording indicator"
          body="Top-right chip. Small danger dot + REC. Optional; surfaces only when the consumer marks the feed as recording."
        />
        <Part
          label="Reticle"
          body="Centre crosshair + outer ring for operator aim. Optional. Hidden when the feed is lost — meaning is undefined."
        />
        <Part
          label="No-signal overlay"
          body={`Replaces the frame on status="lost". Backdrop-blurred bg-bg with danger dot + NO SIGNAL caption. The frozen frame is never shown alone.`}
        />
        <Part
          label="Ember signature"
          body="The source dot. Marks this surface as RC3-managed regardless of feed state. Distinct from semantic status — operators read identity and state independently."
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
    name: "source",
    type: "string",
    description:
      'Operator-visible identifier — e.g. `"FPV · UGV-04"`. Rendered in the top-left corner in mono.',
  },
  {
    name: "status",
    type: '"live" | "degraded" | "lost"',
    description:
      "Feed status. Drives the corner state label and the no-signal overlay. Honours invariant 5: a `lost` feed surfaces as an unambiguous overlay, not a frozen frame.",
  },
  {
    name: "recording",
    type: "boolean",
    default: "false",
    description:
      "Surfaces a danger-toned `REC` indicator in the top-right. The consumer drives recording state from their pipeline.",
  },
  {
    name: "aspectRatio",
    type: '"16:9" | "4:3" | "9:16" | "1:1" | "auto"',
    default: '"16:9"',
    description:
      "Aspect ratio constraint. `auto` releases the constraint so the consumer's video element sizes the tile naturally.",
  },
  {
    name: "reticle",
    type: "boolean",
    default: "false",
    description:
      "Optional centre crosshair + outer ring overlay for aim. Hidden when the feed is lost.",
  },
  {
    name: "coordinates",
    type: "string",
    description:
      "Consumer-formatted look-point coordinates — e.g. `01°20'58\"N 103°49'13\"E`. Surfaces in the telemetry strip when present.",
  },
  {
    name: "bearing",
    type: "number",
    description: "Camera bearing in degrees (0–359). Formatted as `BRG ###°`.",
  },
  {
    name: "range",
    type: "number",
    description:
      "Range to look-point in metres. Formatted as `RNG N m` below 1 km, `N.N km` above.",
  },
  {
    name: "zoom",
    type: "number",
    description: "Zoom multiplier — e.g. 4 for 4×.",
  },
  {
    name: "sensor",
    type: '"EO" | "IR" | "LL"',
    description: "Sensor mode badge — electro-optical, infra-red, low-light.",
  },
  {
    name: "children",
    type: "ReactNode",
    description:
      "The consumer-rendered video element, canvas, or stream player. Sized to fill the frame; RC3 does not ship the player.",
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the root container.",
  },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "FeedStatus",
    signature: `type FeedStatus = "live" | "degraded" | "lost";`,
    description:
      "Feed status classifier. Your application owns the classification — typically derived from link metrics + frame rate + last-frame timestamp on the consumer side.",
  },
  {
    name: "SensorMode",
    signature: `type SensorMode = "EO" | "IR" | "LL";`,
    description:
      "Sensor mode tag. EO (electro-optical, daylight), IR (infra-red), LL (low-light). Drives the sensor badge in the telemetry strip.",
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
        Read-only — the tile renders whatever you pass into{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">children</code>. Video
        transport varies hugely across platforms (RTSP / H.264, WebRTC, MJPEG, HLS, raw frames over
        WebSocket); RC3 stays out of the protocol business and lets you bring your own player.
      </p>
      <div className="mt-6 space-y-3">
        <CodeBlock
          language="tsx"
          code={`// WebRTC / HLS — with telemetry burn-in
<VideoTile
  source="FPV · UGV-04"
  status={feed.status}
  recording={feed.recording}
  coordinates={lookAt.geo}
  bearing={camera.bearing}
  range={camera.rangeMetres}
  zoom={camera.zoom}
  sensor={camera.mode}
>
  <video
    ref={feed.videoRef}
    autoPlay
    muted
    playsInline
    className="h-full w-full object-cover"
  />
</VideoTile>`}
        />
        <CodeBlock
          language="tsx"
          code={`// RTSP via your JS player — minimal
<VideoTile source="GIMBAL · UAV-09" status={feed.status}>
  <YourRtspPlayer
    url={feed.rtspUrl}
    className="h-full w-full"
  />
</VideoTile>`}
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
          A stale frame masquerading as a live feed is the worst-case failure — operators act on
          imagery that is no longer true. When the feed is lost, the tile blanks with an explicit NO
          SIGNAL overlay rather than holding the last frame.
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
      label: "Figure role",
      body: 'The tile carries `role="figure"` with an `aria-label` of the form `{source}, {status}` so screen readers can announce the active feed and its state in one breath.',
    },
    {
      label: "Decorative chrome",
      body: "Source label backdrop, status dot, reticle, and recording chip background are all `aria-hidden`. The accessible label on the figure root carries the meaning.",
    },
    {
      label: "Recording state",
      body: 'The recording chip carries `role="status"` with `aria-label="Recording"` so a screen reader can announce the start of recording.',
    },
    {
      label: "Colour and meaning",
      body: "Status colour is never the only signal — every state carries an explicit text label (LIVE / DEGRADED / NO SIGNAL). Operators with colour-vision differences still read state.",
    },
    {
      label: "Consumer responsibility",
      body: "The video element inside `children` is the consumer's surface — captions, audio descriptions, and player controls are the consumer's accessibility responsibility.",
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
        A single tile renders one feed. Multi-feed surfaces (FPV + gimbal + IR side-by-side,
        picture-in-picture) are template-level compositions — drop several{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">VideoTile</code>{" "}
        instances into a grid and let your application decide which is primary. The status prop must
        reflect actual feed health on the consumer side — never default to{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">"live"</code> while you
        wait for the first frame; show{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">"degraded"</code> or{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">"lost"</code> until the
        stream is verified.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
