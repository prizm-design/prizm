"use client";

import { AutonomyModeSelector, DEFAULT_RUNGS } from "@/components/rc3/autonomy-mode-selector";
import { CommsHealthStrip, type PlatformLink } from "@/components/rc3/comms-health-strip";
import { SafetyActions } from "@/components/rc3/safety-actions";
import { TelemetryHud } from "@/components/rc3/telemetry-hud";
import { cn } from "@/lib/utils";
import { useState } from "react";

const EMBER = "oklch(71% 0.195 32)";

const INITIAL_PLATFORM: PlatformLink = {
  id: "UGV-04",
  signal: 4,
  battery: 78,
  gpsLock: true,
  status: "good",
};

export interface OperatorConsoleProps {
  /**
   * Standalone-instrument chrome. When false (default in docs preview), the console assumes it
   * sits inside the C3 App Shell main canvas and renders without an outer frame. When true, it
   * stands on its own with a hairline bezel — useful for the full-bleed preview route.
   */
  framed?: boolean;
  /**
   * Theme mode. Defaults to `"dark"` — operator canonical state. The console sets its own
   * `data-mode` + `swatch-c3-{mode}` so it renders correctly even when dropped into a host
   * that doesn't supply a theme context. Override to `"light"` (e.g. via a docs-site wrapper
   * that reads the docs theme) to make the embed react to a global light/dark toggle.
   */
  mode?: "light" | "dark";
  className?: string;
}

/**
 * RC3 — Operator console
 *
 * Anchor template for single-platform robotics operations. Composes the three signature RC3
 * organisms (autonomy mode selector, comms / health strip, safety actions) over a stylised
 * tactical canvas. Sets `data-pack="rc3"` on the outer wrapper so the C3 accent semantic token
 * flips to Ember inside this surface; the organisms themselves carry the signature regardless.
 */
export function OperatorConsole({
  framed = false,
  mode = "dark",
  className,
}: OperatorConsoleProps) {
  const [autonomyKey, setAutonomyKey] = useState("supervised");

  return (
    <div
      data-zone="c3"
      data-mode={mode}
      data-pack="rc3"
      className={cn(
        "relative isolate flex h-full min-h-[640px] flex-col overflow-hidden bg-bg",
        mode === "light" ? "swatch-c3-light" : "swatch-c3-dark",
        framed && "rounded-lg border border-border",
        className,
      )}
      style={
        framed
          ? {
              borderTopWidth: 1.5,
              borderTopColor: EMBER,
            }
          : { borderTop: `1.5px solid ${EMBER}` }
      }
    >
      <IdentityRule />
      <div className="relative flex-1 overflow-hidden">
        <TacticalCanvas />
        <div className="absolute inset-0">
          <div className="absolute left-4 top-4 z-10 w-72">
            <AutonomyModeSelector
              scope="platform"
              platform={INITIAL_PLATFORM.id}
              rungs={DEFAULT_RUNGS}
              activeKey={autonomyKey}
              onTransition={setAutonomyKey}
              framed
              compact
            />
          </div>
          <div className="absolute right-4 top-4 z-10">
            <CommsHealthStrip scope="platform" platform={INITIAL_PLATFORM} />
          </div>
          <div className="absolute bottom-4 right-4 z-10">
            <SafetyActions scope="platform" />
          </div>
          <div className="absolute bottom-4 left-4 z-10">
            <TelemetryHud
              domain="ground"
              platform={INITIAL_PLATFORM.id}
              speed={3.2}
              heading={48}
              battery={INITIAL_PLATFORM.battery}
              roll={-1}
              pitch={4}
              slope={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentityRule() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border bg-bg px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: EMBER }}
          aria-hidden="true"
        />
        <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-fg">RC3</span>
        <span className="font-mono text-[11px] tracking-[0.16em] text-fg-muted">
          / OPERATOR CONSOLE
        </span>
      </div>
      <span className="font-mono text-[10px] tracking-wider text-fg-muted">
        SINGLE PLATFORM · UGV-04
      </span>
    </div>
  );
}

/**
 * Stylised tactical canvas — grid background, geofence polygon, route line with three
 * waypoints, platform marker, scale bar + compass rose. No real map engine; pure SVG so the
 * template stays standalone. Real deployments substitute their map (Leaflet, Mapbox, etc.) here.
 */
function TacticalCanvas() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(color-mix(in oklch, var(--color-border) 35%, var(--color-bg)) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklch, var(--color-border) 35%, var(--color-bg)) 1px, transparent 1px)
        `,
        backgroundSize: "16px 16px, 16px 16px",
      }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Faint terrain curve */}
        <path
          d="M -20 520 Q 200 480 420 500 T 820 460 T 1240 440"
          fill="none"
          stroke="var(--prizm-color-border)"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M -20 560 Q 220 520 460 540 T 880 500 T 1240 480"
          fill="none"
          stroke="var(--prizm-color-border)"
          strokeWidth="1"
          opacity="0.25"
        />

        {/* Geofence — dashed polygon */}
        <polygon
          points="180,140 1020,120 1080,560 220,600"
          fill="none"
          stroke="var(--prizm-color-fg-subtle)"
          strokeWidth="1"
          strokeDasharray="6 6"
          opacity="0.4"
        />

        {/* Route trace */}
        <path
          d="M 280 480 L 520 360 L 760 300 L 940 220"
          fill="none"
          stroke="var(--prizm-color-fg-muted)"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          opacity="0.7"
        />

        {/* Waypoints */}
        <Waypoint cx={520} cy={360} label="WPT-05" />
        <Waypoint cx={760} cy={300} label="WPT-06" active />
        <Waypoint cx={940} cy={220} label="WPT-07" />

        {/* Platform marker — UGV-04 at the start of the route */}
        <g>
          <circle cx={280} cy={480} r={16} fill={EMBER} opacity="0.18" />
          <circle cx={280} cy={480} r={8} fill={EMBER} opacity="0.35" />
          <circle cx={280} cy={480} r={4} fill={EMBER} />
        </g>
      </svg>

      {/* Compass rose */}
      <div className="absolute bottom-4 right-1/2 translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
        <span className="font-mono text-[10px] font-semibold tracking-wider text-fg-muted">N</span>
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <polygon points="11,2 13,11 11,9 9,11" fill="var(--prizm-color-fg-muted)" />
          <polygon
            points="11,20 13,11 11,13 9,11"
            fill="none"
            stroke="var(--prizm-color-fg-muted)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Scale bar */}
      <div className="absolute bottom-4 right-[34%] flex flex-col items-end gap-1 opacity-60">
        <span className="font-mono text-[10px] tracking-wider text-fg-muted">500 m</span>
        <span className="block h-px w-16 bg-fg-muted" />
      </div>
    </div>
  );
}

function Waypoint({
  cx,
  cy,
  label,
  active,
}: { cx: number; cy: number; label: string; active?: boolean }) {
  const color = active ? EMBER : "var(--prizm-color-fg-muted)";
  return (
    <g>
      <circle cx={cx} cy={cy} r={active ? 5 : 3.5} fill="none" stroke={color} strokeWidth="1.25" />
      <circle cx={cx} cy={cy} r={1.5} fill={color} />
      <text
        x={cx + 10}
        y={cy + 4}
        fill="var(--prizm-color-fg-muted)"
        style={{
          font: "600 10px/1 'JetBrains Mono', ui-monospace, monospace",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </text>
    </g>
  );
}
