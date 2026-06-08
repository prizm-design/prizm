"use client";

import { DEFAULT_RUNGS } from "@/components/rc3/autonomy-mode-selector";
import { AutonomyModeSelectorDemo } from "@/components/rc3/autonomy-mode-selector-demo";
import { CommsHealthStrip, type PlatformLink } from "@/components/rc3/comms-health-strip";
import { PlatformRoster, type RosterEntry } from "@/components/rc3/platform-roster";
import { RC3Swatch } from "@/components/rc3/swatch";
import { useState } from "react";

// RC3 signature hue — pack identity, theme-independent.
const RC3 = "oklch(71% 0.195 32)";

// Hero surface references C3 semantic tokens via CSS variables so the hero tracks the docs theme.
// The wrapping <RC3Swatch> sets `--color-*` to C3 light or C3 dark based on docs mode.
const SURFACE = {
  bg: "var(--color-bg)",
  border: "var(--color-border)",
  // Faint grid hairline — `--color-border` mixed back toward bg so the lines stay just-visible
  // in both light and dark modes.
  borderSoft: "color-mix(in oklch, var(--color-border) 35%, var(--color-bg))",
  fg: "var(--color-fg)",
  fgMuted: "var(--color-fg-muted)",
  fgSubtle: "var(--color-fg-subtle)",
};

// Semi-transparent panel fill for floating overlays — color-mix swaps cleanly across themes.
const PANEL_TRANSLUCENT = "color-mix(in oklch, var(--color-surface) 80%, transparent)";

type SwarmUnit = RosterEntry & {
  klass: "UGV" | "UAV";
  x: number;
  y: number;
  heading: number;
};

// A 16-platform swarm. Over twelve, so the comms strip drops the per-platform pips and reads the
// aggregate; the roster scrolls within its frame. Positions sit in the central / left map band so
// they read between the (minimised) autonomy panel and the right-hand breadth column.
const SWARM: SwarmUnit[] = [
  {
    id: "UAV-01",
    link: "good",
    signal: 4,
    battery: 88,
    klass: "UAV",
    x: 0.57,
    y: 0.24,
    heading: 120,
  },
  {
    id: "UAV-02",
    link: "good",
    signal: 4,
    battery: 76,
    klass: "UAV",
    x: 0.49,
    y: 0.33,
    heading: 122,
  },
  {
    id: "UAV-03",
    link: "degraded",
    signal: 2,
    battery: 31,
    klass: "UAV",
    x: 0.43,
    y: 0.41,
    heading: 130,
  },
  {
    id: "UAV-04",
    link: "good",
    signal: 3,
    battery: 69,
    klass: "UAV",
    x: 0.52,
    y: 0.16,
    heading: 110,
  },
  {
    id: "UAV-05",
    link: "good",
    signal: 4,
    battery: 81,
    klass: "UAV",
    x: 0.36,
    y: 0.29,
    heading: 104,
  },
  {
    id: "UAV-06",
    link: "good",
    signal: 4,
    battery: 92,
    klass: "UAV",
    x: 0.44,
    y: 0.21,
    heading: 116,
  },
  {
    id: "UAV-07",
    link: "good",
    signal: 4,
    battery: 67,
    klass: "UAV",
    x: 0.3,
    y: 0.18,
    heading: 112,
  },
  {
    id: "UGV-01",
    link: "good",
    signal: 4,
    battery: 64,
    klass: "UGV",
    x: 0.31,
    y: 0.66,
    heading: 48,
  },
  {
    id: "UGV-02",
    link: "good",
    signal: 3,
    battery: 58,
    klass: "UGV",
    x: 0.39,
    y: 0.73,
    heading: 50,
  },
  {
    id: "UGV-03",
    link: "good",
    signal: 4,
    battery: 73,
    klass: "UGV",
    x: 0.47,
    y: 0.79,
    heading: 50,
  },
  {
    id: "UGV-04",
    link: "good",
    signal: 4,
    battery: 78,
    klass: "UGV",
    x: 0.55,
    y: 0.7,
    heading: 52,
  },
  {
    id: "UGV-05",
    link: "good",
    signal: 3,
    battery: 49,
    klass: "UGV",
    x: 0.25,
    y: 0.78,
    heading: 46,
  },
  {
    id: "UGV-06",
    link: "good",
    signal: 4,
    battery: 71,
    klass: "UGV",
    x: 0.19,
    y: 0.61,
    heading: 44,
  },
  {
    id: "UGV-07",
    link: "lost",
    signal: 0,
    battery: 12,
    klass: "UGV",
    x: 0.15,
    y: 0.85,
    heading: 40,
  },
  {
    id: "UGV-08",
    link: "good",
    signal: 3,
    battery: 55,
    klass: "UGV",
    x: 0.33,
    y: 0.87,
    heading: 48,
  },
  {
    id: "UGV-09",
    link: "good",
    signal: 4,
    battery: 83,
    klass: "UGV",
    x: 0.41,
    y: 0.6,
    heading: 50,
  },
];

const COMMS: PlatformLink[] = SWARM.map((p) => ({
  id: p.id,
  signal: p.signal ?? 0,
  battery: p.battery,
  gpsLock: p.link === "good",
  status: p.link,
}));

const ROSTER: RosterEntry[] = SWARM.map(({ id, link, signal, battery, klass }) => ({
  id,
  link,
  signal,
  battery,
  klass,
}));

export function Hero() {
  const [activeId, setActiveId] = useState("UAV-01");

  return (
    <RC3Swatch className="mt-12 overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/5">
      <div
        className="relative"
        style={{
          backgroundColor: SURFACE.bg,
          backgroundImage: `
            linear-gradient(${SURFACE.borderSoft} 1px, transparent 1px),
            linear-gradient(90deg, ${SURFACE.borderSoft} 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px, 12px 12px",
        }}
      >
        {/* Canvas — faint swarm trace. No AO boundary. */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          <path
            d="M 180 510 L 300 450 L 420 480 L 516 396 L 612 246 L 684 144"
            fill="none"
            stroke={SURFACE.fgMuted}
            strokeWidth={1.25}
            strokeDasharray="4 6"
            opacity={0.4}
          />
        </svg>

        {/* Markers — behind the foreground panels. */}
        <div className="pointer-events-none absolute inset-0">
          {SWARM.map((m) => (
            <HeroMarker key={m.id} marker={m} active={m.id === activeId} />
          ))}
        </div>

        {/* Identity rule — swarm scope. */}
        <div
          className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t-[1.5px] border-b px-5 py-3"
          style={{
            borderTopColor: RC3,
            borderBottomColor: SURFACE.border,
            backgroundColor: SURFACE.bg,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: RC3 }}
            />
            <span
              className="text-[11px] font-semibold tracking-[0.14em]"
              style={{ color: SURFACE.fg }}
            >
              RC3
            </span>
            <span className="text-[11px] tracking-[0.14em]" style={{ color: SURFACE.fgMuted }}>
              / SWARM
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-wider" style={{ color: SURFACE.fgMuted }}>
            SWARM · {SWARM.length} PLATFORMS · ACTIVE {activeId}
          </span>
        </div>

        <div className="relative grid gap-6 px-6 py-10 md:grid-cols-[360px_1fr] md:px-10 md:py-14">
          {/* Left — autonomy selector, minimised (shrinks to content). */}
          <div
            className="w-fit self-start justify-self-start rounded-lg p-5 shadow-xl backdrop-blur-sm"
            style={{
              backgroundColor: PANEL_TRANSLUCENT,
              border: `1px solid ${SURFACE.border}`,
            }}
          >
            <AutonomyModeSelectorDemo
              scope="swarm"
              platform="PERIMETER WATCH"
              rungs={DEFAULT_RUNGS}
              defaultActiveKey="delegated"
              compact={true}
            />
          </div>

          {/* Right — swarm breadth. Comms strip and roster share one width; roster scrolls. */}
          <div className="relative hidden h-[440px] md:flex md:justify-end">
            <div className="flex h-full w-full max-w-sm flex-col gap-3">
              <CommsHealthStrip scope="swarm" platforms={COMMS} className="w-full" />
              <div className="min-h-0 flex-1">
                <PlatformRoster
                  label="PERIMETER WATCH"
                  platforms={ROSTER}
                  activeId={activeId}
                  onSelect={setActiveId}
                  fillHeight
                  className="w-full shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle bottom fade so the canvas suggests it continues */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: `linear-gradient(to bottom, transparent, ${SURFACE.bg})` }}
        />
      </div>
    </RC3Swatch>
  );
}

function HeroMarker({ marker, active }: { marker: SwarmUnit; active: boolean }) {
  const color = active
    ? RC3
    : marker.link === "degraded"
      ? "var(--prizm-color-warning)"
      : marker.link === "lost"
        ? "var(--prizm-color-danger)"
        : SURFACE.fgMuted;
  const size = 16;

  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${marker.x * 100}%`, top: `${marker.y * 100}%` }}
    >
      {marker.klass === "UGV" ? (
        <span
          className="block"
          style={{
            width: size - 5,
            height: size - 5,
            background: active ? color : "transparent",
            border: `1.5px solid ${color}`,
          }}
        />
      ) : (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          style={{ transform: `rotate(${marker.heading}deg)` }}
        >
          <polygon
            points={`${size / 2},2 ${size - 2},${size - 3} ${size / 2},${size - 6} 2,${size - 3}`}
            fill={active ? color : "transparent"}
            stroke={color}
            strokeWidth="1.25"
            strokeLinejoin="miter"
          />
        </svg>
      )}
      {active && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: size * 2, height: size * 2, border: `1px solid ${RC3}`, opacity: 0.35 }}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
