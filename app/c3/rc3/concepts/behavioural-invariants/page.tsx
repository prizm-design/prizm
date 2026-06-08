import { DEFAULT_RUNGS } from "@/components/rc3/autonomy-mode-selector";
import { AutonomyModeSelectorDemo } from "@/components/rc3/autonomy-mode-selector-demo";
import { CommsHealthStrip } from "@/components/rc3/comms-health-strip";
import { SafetyActions } from "@/components/rc3/safety-actions";
import { RC3Swatch } from "@/components/rc3/swatch";
import { TelemetryHud } from "@/components/rc3/telemetry-hud";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "RC3 — Behavioural invariants" };

// RC3 signature hue — pack identity, theme-independent.
const RC3 = "oklch(71% 0.195 32)";

// Preview surfaces reference C3 semantic tokens via CSS variables so they track the docs
// theme. The wrapping <RC3Swatch> sets `--color-*` to C3 light or C3 dark based on docs mode.
const SURFACE = {
  bg: "var(--color-bg)",
  border: "var(--color-border)",
  borderSoft: "color-mix(in oklch, var(--color-border) 35%, var(--color-bg))",
  fg: "var(--color-fg)",
  fgMuted: "var(--color-fg-muted)",
  fgSubtle: "var(--color-fg-subtle)",
  surface: "var(--color-surface)",
  panel: "var(--color-bg-muted)",
};

export default function RC3BehaviouralInvariantsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Invariants />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[
          { label: "RC3", href: "/c3/rc3" },
          { label: "Concepts", href: "/c3/rc3/concepts" },
          { label: "Behavioural invariants" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Concepts
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Behavioural invariants
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        Five rules every RC3 surface must satisfy. Properties, not opt-in patterns — layouts can
        vary; these hold.
      </p>
    </div>
  );
}

function Invariants() {
  return (
    <div className="mt-16 space-y-6">
      <InvariantBlock
        index="One"
        title="Safety in one tap"
        statement="Safety actions are reachable within one tap from any live state."
        expansion="Operator stress and time-critical recovery cannot tolerate menu-diving. The e-stop, override, and abort affordances stay in the first interaction layer whenever a platform is live — never collapsed into overflow, never hidden behind a mode."
        mock={<SafetyMock />}
      />
      <InvariantBlock
        index="Two"
        title="Comms always visible"
        statement="Comms and health are visible whenever a live platform is connected."
        expansion="A degraded link is information the operator needs before deciding anything. RC3 surfaces keep link state, signal strength, and platform health on screen for every connected platform — not in a settings panel."
        mock={<CommsMock />}
      />
      <InvariantBlock
        index="Three"
        title="Active context unambiguous"
        statement="The active context — which platform, group, or mission is in focus — is unambiguous on screen."
        expansion="The same command word means different things at different scopes. Every RC3 surface anchors the operator with a clear active-context indicator so a tap that means “move” cannot be misread as moving the wrong thing."
        mock={<ContextMock />}
      />
      <InvariantBlock
        index="Four"
        title="Deliberate transitions"
        statement="Autonomy transitions, takeover, and override require deliberate confirmation."
        expansion="Handing control to autonomy, taking it back, or overriding a running command are mode-shifts with operational consequence. None of them happen on a single accidental tap — each requires an explicit confirm gesture."
        mock={<TransitionMock />}
      />
      <InvariantBlock
        index="Five"
        title="Telemetry never silently stale"
        statement="Telemetry never goes silently stale. Degraded data states are visible, not masked."
        expansion="A frozen number that looks fresh is worse than no number. When data goes stale, the surface marks it stale with a timestamp — operators see the degradation before they act on it."
        mock={<TelemetryMock />}
      />
    </div>
  );
}

function InvariantBlock({
  index,
  title,
  statement,
  expansion,
  mock,
}: {
  index: string;
  title: string;
  statement: string;
  expansion: string;
  mock: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <div className="border-b border-border p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
            {index} · Invariant
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          <p className="mt-4 text-base font-medium leading-snug" style={{ color: RC3 }}>
            “{statement}”
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">{expansion}</p>
        </div>
        <RC3Swatch
          className="flex items-center justify-center p-6 md:p-8"
          style={{ backgroundColor: SURFACE.bg }}
        >
          {mock}
        </RC3Swatch>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Inline mocks — each demonstrates the invariant in action against C3 dark.

function SafetyMock() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-md"
      style={{
        backgroundColor: SURFACE.panel,
        border: `1px solid ${SURFACE.border}`,
      }}
    >
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: SURFACE.fgMuted }}>
          Autonomy mode
        </div>
        <div className="mt-1 text-base font-semibold" style={{ color: SURFACE.fg }}>
          Supervised
        </div>
        <div className="mt-3 space-y-1.5">
          <PlatformLine id="UGV-04" status="ACTIVE" active />
          <PlatformLine id="UGV-05" status="STANDBY" />
        </div>
      </div>
      <div
        className="flex items-center justify-between gap-3 border-t px-4 py-3"
        style={{ borderColor: SURFACE.border }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.14em]"
          style={{ color: SURFACE.fgSubtle }}
        >
          Always one tap away
        </span>
        <SafetyActions scope="platform" />
      </div>
    </div>
  );
}

function CommsMock() {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <CommsHealthStrip
        scope="platform"
        platform={{ id: "UGV-04", signal: 4, battery: 87, gpsLock: true, status: "good" }}
      />
      <CommsHealthStrip
        scope="platform"
        platform={{ id: "UAV-09", signal: 1, status: "degraded" }}
      />
    </div>
  );
}

function ContextMock() {
  const levels = ["Platform", "Group", "Swarm", "Mission"];
  return (
    <div
      className="w-full rounded-md p-4"
      style={{
        backgroundColor: SURFACE.panel,
        border: `1px solid ${SURFACE.border}`,
      }}
    >
      <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: SURFACE.fgMuted }}>
        Now commanding
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RC3 }} />
        <span className="font-mono text-xl font-bold tracking-tight" style={{ color: SURFACE.fg }}>
          UGV-04
        </span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1">
        {levels.map((l, i) => (
          <div
            key={l}
            className="rounded px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: i === 0 ? RC3 : "transparent",
              color: i === 0 ? "oklch(15% 0 0)" : SURFACE.fgMuted,
              border: i === 0 ? "none" : `1px solid ${SURFACE.borderSoft}`,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function TransitionMock() {
  // The real Autonomy mode selector honouring invariant 4: climbing toward more machine authority
  // arms on first tap (the rung flips to "CONFIRM" in Ember) and commits only on a second tap;
  // descending toward the operator is immediate. No transition rides a single accidental tap.
  return (
    <AutonomyModeSelectorDemo
      scope="platform"
      platform="UGV-04"
      rungs={DEFAULT_RUNGS}
      defaultActiveKey="supervised"
      compact={false}
      framed
    />
  );
}

function TelemetryMock() {
  // The real Telemetry HUD honouring invariant 5: heading has stopped updating, so it dims and
  // carries a STALE age tag rather than presenting a frozen 174° as if it were live.
  return (
    <TelemetryHud
      domain="ground"
      platform="UGV-04"
      speed={3.2}
      heading={174}
      battery={87}
      stale={{ heading: 4 }}
    />
  );
}

// -----------------------------------------------------------------------------
// Small parts.

function PlatformLine({
  id,
  status,
  active = false,
}: {
  id: string;
  status: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: active ? RC3 : SURFACE.fgSubtle,
          opacity: active ? 1 : 0.5,
        }}
      />
      <span
        className="font-mono text-[11px]"
        style={{
          color: active ? SURFACE.fg : SURFACE.fgMuted,
          fontWeight: active ? 600 : 400,
        }}
      >
        {id}
      </span>
      <span className="text-[9px] tracking-wider" style={{ color: SURFACE.fgMuted }}>
        {status}
      </span>
    </div>
  );
}
