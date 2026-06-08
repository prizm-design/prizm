"use client";

import { AutonomyModeSelector, type AutonomyRung } from "@/components/rc3/autonomy-mode-selector";
import { CommsHealthStrip, type PlatformLink } from "@/components/rc3/comms-health-strip";
import { PlatformDetail } from "@/components/rc3/platform-detail";
import { PlatformRoster, type RosterEntry } from "@/components/rc3/platform-roster";
import { SafetyActions } from "@/components/rc3/safety-actions";
import type { UxvDomain } from "@/components/rc3/telemetry-hud";
import { VideoTile } from "@/components/rc3/video-tile";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const EMBER = "oklch(71% 0.195 32)";

// Group LOA ladder. Same vocabulary as platform scope — operators read MANUAL / SUPERVISED /
// DELEGATED / AUTONOMOUS at any scope; the scope is already established by the header. Authority
// labels match the default ladder; at SWARM scope the per-platform implication is carried by the
// header's scope chip, not by re-wording the label.
const GROUP_RUNGS: AutonomyRung[] = [
  { key: "manual", index: "L0", label: "MANUAL", authority: "OPERATOR" },
  { key: "supervised", index: "L1", label: "SUPERVISED", authority: "OP-IN-LOOP" },
  { key: "delegated", index: "L2", label: "DELEGATED", authority: "OP-ON-LOOP" },
  { key: "autonomous", index: "L3", label: "AUTONOMOUS", authority: "SYSTEM AI" },
];

interface Platform {
  id: string;
  klass: "UGV" | "UAV";
  domain: UxvDomain;
  link: PlatformLink["status"];
  signal: PlatformLink["signal"];
  battery: number;
  autonomyRung: string;
  speed: number;
  speedUnit?: "m/s" | "kn";
  vertical?: number;
  verticalUnit?: "m" | "ft";
  verticalRef?: string;
  heading: number;
  cameraSource: string;
  position: string;
  missionStep: { current: number; total: number; label?: string };
  operator: string;
  lastContact: string;
  // Position on the stylised map, normalised 0–1 in both axes.
  mapX: number;
  mapY: number;
}

const SWARM: Platform[] = [
  {
    id: "UGV-04",
    klass: "UGV",
    domain: "ground",
    link: "good",
    signal: 4,
    battery: 78,
    autonomyRung: "DELEGATED",
    speed: 3.2,
    heading: 48,
    cameraSource: "FPV",
    position: `01°20'58\"N 103°49'13\"E`,
    missionStep: { current: 6, total: 12, label: "WPT-06" },
    operator: "SGT YEO",
    lastContact: "0.3 s ago",
    mapX: 0.08,
    mapY: 0.86,
  },
  {
    id: "UGV-05",
    klass: "UGV",
    domain: "ground",
    link: "good",
    signal: 4,
    battery: 64,
    autonomyRung: "DELEGATED",
    speed: 2.8,
    heading: 52,
    cameraSource: "FPV",
    position: `01°21'02\"N 103°49'21\"E`,
    missionStep: { current: 5, total: 12, label: "WPT-05" },
    operator: "SGT YEO",
    lastContact: "0.4 s ago",
    mapX: 0.18,
    mapY: 0.8,
  },
  {
    id: "UGV-06",
    klass: "UGV",
    domain: "ground",
    link: "good",
    signal: 3,
    battery: 71,
    autonomyRung: "DELEGATED",
    speed: 3.0,
    heading: 50,
    cameraSource: "FPV",
    position: `01°21'06\"N 103°49'29\"E`,
    missionStep: { current: 5, total: 12, label: "WPT-05" },
    operator: "SGT YEO",
    lastContact: "0.6 s ago",
    mapX: 0.28,
    mapY: 0.72,
  },
  {
    id: "UAV-01",
    klass: "UAV",
    domain: "aerial",
    link: "good",
    signal: 4,
    battery: 88,
    autonomyRung: "DELEGATED",
    speed: 22,
    speedUnit: "kn",
    vertical: 4000,
    verticalUnit: "ft",
    verticalRef: "AGL",
    heading: 120,
    cameraSource: "GIMBAL",
    position: `01°21'34\"N 103°50'12\"E`,
    missionStep: { current: 3, total: 8, label: "RECON B" },
    operator: "MAJ A. LOH",
    lastContact: "0.2 s ago",
    mapX: 0.55,
    mapY: 0.22,
  },
  {
    id: "UAV-02",
    klass: "UAV",
    domain: "aerial",
    link: "good",
    signal: 4,
    battery: 56,
    autonomyRung: "DELEGATED",
    speed: 24,
    speedUnit: "kn",
    vertical: 4200,
    verticalUnit: "ft",
    verticalRef: "AGL",
    heading: 118,
    cameraSource: "GIMBAL",
    position: `01°21'48\"N 103°50'31\"E`,
    missionStep: { current: 3, total: 8, label: "RECON B" },
    operator: "MAJ A. LOH",
    lastContact: "0.3 s ago",
    mapX: 0.72,
    mapY: 0.36,
  },
  {
    id: "UAV-03",
    klass: "UAV",
    domain: "aerial",
    link: "degraded",
    signal: 2,
    battery: 31,
    autonomyRung: "DELEGATED",
    speed: 19,
    speedUnit: "kn",
    vertical: 3800,
    verticalUnit: "ft",
    verticalRef: "AGL",
    heading: 130,
    cameraSource: "IR",
    position: `01°22'04\"N 103°50'52\"E`,
    missionStep: { current: 2, total: 8, label: "RECON B" },
    operator: "MAJ A. LOH",
    lastContact: "2.4 s ago",
    mapX: 0.86,
    mapY: 0.52,
  },
  {
    id: "UAV-04",
    klass: "UAV",
    domain: "aerial",
    link: "lost",
    signal: 0,
    battery: 18,
    autonomyRung: "MANUAL",
    speed: 0,
    speedUnit: "kn",
    vertical: 0,
    verticalUnit: "ft",
    verticalRef: "AGL",
    heading: 0,
    cameraSource: "FPV",
    position: `01°22'18\"N 103°51'08\"E`,
    missionStep: { current: 4, total: 8, label: "RECON B" },
    operator: "CPT NG",
    lastContact: "48 s ago",
    mapX: 0.94,
    mapY: 0.1,
  },
];

// Roster entries drop per-platform `autonomy` and `klass` — the group autonomy is shown in the
// right column above the video, so the per-row label would be redundant; and at 228px column
// width, dropping these keeps each row scannable. The platform-detail organism (not surfaced
// in this template) shows the per-platform autonomy when the operator drills in.
const ROSTER: RosterEntry[] = SWARM.map((p) => ({
  id: p.id,
  link: p.link,
  signal: p.signal,
  battery: p.battery,
}));

const COMMS: PlatformLink[] = SWARM.map((p) => ({
  id: p.id,
  signal: p.signal,
  status: p.link,
  battery: p.battery,
}));

export interface FleetOverviewProps {
  /** Standalone-instrument chrome. */
  framed?: boolean;
  /**
   * Theme mode. Defaults to `"dark"` — operator canonical state. Override to `"light"` (e.g.
   * via a docs-site wrapper that reads the docs theme) to make the embed react to a global
   * light/dark toggle.
   */
  mode?: "light" | "dark";
  className?: string;
}

export function FleetOverview({ framed = false, mode = "dark", className }: FleetOverviewProps) {
  const [activeId, setActiveId] = useState("UAV-01");
  const [groupAutonomy, setGroupAutonomy] = useState("delegated");

  const active = SWARM.find((p) => p.id === activeId) ?? SWARM[0];
  const activeFeedStatus =
    active.link === "good" ? "live" : active.link === "degraded" ? "degraded" : "lost";

  return (
    <div
      data-zone="c3"
      data-mode={mode}
      data-pack="rc3"
      className={cn(
        "relative isolate flex h-full min-h-[680px] flex-col overflow-hidden bg-bg",
        mode === "light" ? "swatch-c3-light" : "swatch-c3-dark",
        framed && "rounded-lg border border-border",
        className,
      )}
      style={
        framed
          ? { borderTopWidth: 1.5, borderTopColor: EMBER }
          : { borderTop: `1.5px solid ${EMBER}` }
      }
    >
      <IdentityRule platformCount={SWARM.length} active={active.id} />

      {/* Top chrome strip — aggregated fleet health on the left, swarm safety anchored right.
          Both are inline single-line surfaces, so the strip stays visually flat. Autonomy lives
          at the top of the right column where it has the vertical room to disclose its full
          rail without disturbing this row. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-bg px-4 py-3">
        <CommsHealthStrip scope="swarm" platforms={COMMS} />
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
            Swarm safety
          </span>
          <SafetyActions scope="swarm" />
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto p-3 lg:flex-row lg:overflow-hidden">
        {/* Left — roster. fillHeight lets the list scroll within the roster frame so a long
            fleet doesn't push other columns around. */}
        <div className="flex min-h-0 flex-col lg:w-[240px] lg:shrink-0">
          <PlatformRoster
            label="PERIMETER WATCH"
            platforms={ROSTER}
            activeId={activeId}
            onSelect={setActiveId}
            fillHeight
            className="flex-1 max-w-none"
          />
        </div>

        {/* Centre — tactical map. Fixed height at narrow widths so stacked layout doesn't
            squeeze the right column; flex-grow at lg+ to fill the central pane. */}
        <div className="relative h-[300px] min-w-0 shrink-0 overflow-hidden rounded-md border border-border bg-bg lg:h-auto lg:flex-1 lg:shrink">
          <TacticalMap activeId={activeId} swarm={SWARM} onSelect={setActiveId} />
        </div>

        {/* Right — swarm autonomy + active-platform focus pane. Autonomy and video stay
            intrinsic-height; platform-detail uses fillHeight so it takes whatever vertical
            space remains and scrolls within its own frame when the autonomy rail is expanded
            or the active platform has many extras. */}
        <div className="flex min-h-0 flex-col gap-3 lg:w-[320px] lg:shrink-0">
          <AutonomyModeSelector
            scope="swarm"
            rungs={GROUP_RUNGS}
            activeKey={groupAutonomy}
            onTransition={setGroupAutonomy}
            framed
            compact
            className="w-full max-w-none shrink-0"
          />
          <VideoTile
            source={`${active.cameraSource} · ${active.id}`}
            status={activeFeedStatus}
            sensor={active.cameraSource === "IR" ? "IR" : "EO"}
            aspectRatio="16:9"
            className="shrink-0"
          >
            <CameraPlaceholder
              feed={active.cameraSource}
              platform={active.id}
              status={activeFeedStatus}
            />
          </VideoTile>
          <PlatformDetail
            platform={active.id}
            klass={active.klass}
            domain={active.domain}
            link={active.link}
            signal={active.signal}
            battery={active.battery}
            autonomy={active.autonomyRung}
            position={active.position}
            heading={active.heading}
            speed={active.speed}
            speedUnit={active.speedUnit}
            vertical={active.vertical}
            verticalUnit={active.verticalUnit}
            verticalRef={active.verticalRef}
            mission={active.missionStep}
            operator={active.operator}
            lastContact={active.lastContact}
            fillHeight
            className="w-full max-w-none flex-1 min-h-0"
          />
        </div>
      </div>
    </div>
  );
}

function IdentityRule({ platformCount, active }: { platformCount: number; active: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-bg px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: EMBER }}
          aria-hidden="true"
        />
        <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-fg">RC3</span>
        <span className="font-mono text-[11px] tracking-[0.16em] text-fg-muted">
          / FLEET OVERVIEW
        </span>
      </div>
      <span className="font-mono text-[10px] tracking-wider text-fg-muted">
        SWARM · {platformCount} PLATFORMS · ACTIVE {active}
      </span>
    </div>
  );
}

/**
 * Stylised tactical map placeholder. Renders all platforms positioned with class-specific
 * markers (square for UGV, triangle for UAV), heading indicators, a faint geofence outline,
 * and a route trace through the swarm centre. The active platform is Ember-marked; others stay
 * neutral. Clicking a platform marker selects it — matches the roster's `onSelect`.
 *
 * Real consumers plug their map engine (Leaflet, Mapbox, MIL-STD-2525 renderer) here.
 */
function useAnimationClock(intervalMs = 50): number {
  // Returns elapsed seconds since mount. Used to drive subtle marker drift and the active
  // pulse. Updates on requestAnimationFrame so movement is smooth without re-rendering every
  // frame at full 60fps when state doesn't materially change.
  const [tick, setTick] = useState(0);
  const startRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      if (now - lastRef.current >= intervalMs) {
        lastRef.current = now;
        setTick((now - startRef.current) / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [intervalMs]);

  return tick;
}

function TacticalMap({
  swarm,
  activeId,
  onSelect,
}: {
  swarm: Platform[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const t = useAnimationClock();

  return (
    <div
      className="relative h-full w-full"
      style={{
        backgroundImage: `
          linear-gradient(color-mix(in oklch, var(--color-border) 35%, var(--color-bg)) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklch, var(--color-border) 35%, var(--color-bg)) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px, 20px 20px",
      }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Geofence — hugs the asset distribution so the AO reads as "this is the area
            of operations" rather than a generic frame. */}
        <polygon
          points="40,30 970,20 985,575 25,585"
          fill="none"
          stroke="var(--prizm-color-fg-subtle)"
          strokeWidth="1"
          strokeDasharray="6 6"
          opacity="0.4"
        />
        {/* Terrain curves */}
        <path
          d="M -20 520 Q 220 480 460 500 T 880 460 T 1020 440"
          fill="none"
          stroke="var(--prizm-color-border)"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M -20 560 Q 240 520 480 540 T 920 510 T 1020 500"
          fill="none"
          stroke="var(--prizm-color-border)"
          strokeWidth="1"
          opacity="0.25"
        />
        {/* Swarm trace — connects ground convoy (lower-left) to aerial group (upper-right). */}
        <path
          d="M 80 520 L 180 480 L 280 432 L 550 132 L 720 216 L 860 312"
          fill="none"
          stroke="var(--prizm-color-fg-muted)"
          strokeWidth="1.25"
          strokeDasharray="4 5"
          opacity="0.55"
        />
      </svg>

      {/* Platform markers — interactive, with subtle position drift and active-marker pulse */}
      {swarm.map((p, i) => {
        const isActive = p.id === activeId;
        const isLost = p.link === "lost";
        // Lost platforms stop drifting — they no longer report telemetry. Live platforms drift
        // along their heading with a small phase offset per platform so the swarm reads as
        // organic rather than synchronised.
        const phase = (i * Math.PI) / 3;
        const drift = isLost ? 0 : 0.012;
        const headingRad = ((p.heading - 90) * Math.PI) / 180; // 0° = north → up
        const dx = drift * Math.cos(headingRad) * Math.sin(t * 0.35 + phase);
        const dy = drift * Math.sin(headingRad) * Math.sin(t * 0.35 + phase);
        const x = (p.mapX + dx) * 100;
        const y = (p.mapY + dy) * 100;
        // Active marker pulse — 0..1 sin wave drives ring opacity + scale.
        const pulse = isActive ? 0.5 + 0.5 * Math.sin(t * 2.2) : 0;
        return (
          <button
            key={p.id}
            type="button"
            aria-label={`Select ${p.id}`}
            aria-pressed={isActive}
            onClick={() => onSelect(p.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus-visible:outline-none"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <PlatformMarker
              klass={p.klass}
              heading={p.heading}
              active={isActive}
              lost={isLost}
              pulse={pulse}
            />
            <span
              className="mt-1 block font-mono text-[10px] font-semibold tracking-[0.08em]"
              style={{
                color: isActive
                  ? EMBER
                  : isLost
                    ? "var(--prizm-color-danger)"
                    : "var(--prizm-color-fg-muted)",
              }}
            >
              {p.id}
            </span>
          </button>
        );
      })}

      {/* Compass rose */}
      <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1 opacity-70">
        <span className="font-mono text-[10px] font-semibold tracking-wider text-fg-muted">N</span>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <polygon points="9,2 10.5,9 9,7.5 7.5,9" fill="var(--prizm-color-fg-muted)" />
          <polygon
            points="9,16 10.5,9 9,10.5 7.5,9"
            fill="none"
            stroke="var(--prizm-color-fg-muted)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Scale */}
      <div className="absolute bottom-3 left-3 flex flex-col items-start gap-0.5 opacity-70">
        <span className="font-mono text-[10px] tracking-wider text-fg-muted">1 km</span>
        <span className="block h-px w-12 bg-fg-muted" />
      </div>
    </div>
  );
}

/**
 * Per-platform map marker. Square for UGV, triangle (rotated to heading) for UAV. Active
 * platform carries the Ember signature; lost platforms render in danger; the rest in fg-muted.
 */
function PlatformMarker({
  klass,
  heading,
  active,
  lost,
  pulse = 0,
}: {
  klass: "UGV" | "UAV";
  heading: number;
  active: boolean;
  lost: boolean;
  pulse?: number;
}) {
  const color = active ? EMBER : lost ? "var(--prizm-color-danger)" : "var(--prizm-color-fg-muted)";
  const size = 18;
  // Pulse — radial ring scales 1.5→2.1 with opacity 0.45→0.15, driving the eye to the active
  // marker without competing visually with the rest of the map.
  const ringScale = 1.5 + 0.6 * pulse;
  const ringOpacity = 0.45 - 0.3 * pulse;

  if (klass === "UGV") {
    return (
      <span
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {active && (
          <span
            className="absolute inset-0 rounded-sm"
            style={{
              border: `1px solid ${color}`,
              opacity: ringOpacity,
              transform: `scale(${ringScale})`,
            }}
            aria-hidden="true"
          />
        )}
        <span
          className="block"
          style={{
            width: size - 6,
            height: size - 6,
            background: active ? color : "transparent",
            border: `1.5px solid ${color}`,
          }}
        />
      </span>
    );
  }

  // UAV — triangle rotated to heading
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      {active && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${color}`,
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
          }}
          aria-hidden="true"
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${heading}deg)`, transformOrigin: "center" }}
        aria-hidden="true"
      >
        <polygon
          points={`${size / 2},2 ${size - 2},${size - 3} ${size / 2},${size - 6} 2,${size - 3}`}
          fill={active ? color : "transparent"}
          stroke={color}
          strokeWidth="1.25"
          strokeLinejoin="miter"
        />
      </svg>
    </span>
  );
}

/**
 * Stylised feed placeholder for the active platform's video tile. Real consumers plug their
 * stream player into VideoTile's children slot.
 */
function CameraPlaceholder({
  feed,
  platform,
  status,
}: {
  feed: string;
  platform: string;
  status: "live" | "degraded" | "lost";
}) {
  if (status === "lost") {
    return <div className="h-full w-full bg-bg" />;
  }

  const gradient =
    feed === "IR"
      ? "linear-gradient(140deg, oklch(28% 0.04 60) 0%, oklch(18% 0.03 50) 60%, oklch(10% 0.02 50) 100%)"
      : feed === "FPV"
        ? "linear-gradient(140deg, oklch(24% 0.04 250) 0%, oklch(15% 0.03 260) 60%, oklch(8% 0.02 260) 100%)"
        : "linear-gradient(140deg, oklch(28% 0.05 230) 0%, oklch(18% 0.04 250) 60%, oklch(12% 0.02 260) 100%)";

  return (
    <div
      className="relative h-full w-full"
      style={{
        background: gradient,
        backgroundImage: `
          ${gradient},
          linear-gradient(oklch(100% 0 0 / 0.05) 1px, transparent 1px),
          linear-gradient(90deg, oklch(100% 0 0 / 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 24px 24px, 24px 24px",
      }}
    >
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.16em] text-fg-subtle"
        aria-hidden="true"
      >
        {feed} · {platform}
      </span>
    </div>
  );
}
