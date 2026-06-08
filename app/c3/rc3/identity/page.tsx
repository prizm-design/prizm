import { DEFAULT_RUNGS } from "@/components/rc3/autonomy-mode-selector";
import { AutonomyModeSelectorDemo } from "@/components/rc3/autonomy-mode-selector-demo";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Compass,
  Crosshair,
  Map as MapIcon,
  Plane,
  Radar,
  Radio,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "RC3 — Identity" };

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

export default function RC3IdentityPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Colour />
      <Iconography />
      <Rule />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs items={[{ label: "RC3", href: "/c3/rc3" }, { label: "Identity" }]} />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">Identity</h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        Three layers carry RC3 across any host: a signature colour, schematic iconography, and a
        thin identity rule.
      </p>
    </div>
  );
}

function Colour() {
  return (
    <section className="mt-20">
      <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
        <div>
          <SectionLabel>One · Signature colour</SectionLabel>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Ember</h2>
          <p className="mt-1 text-sm text-fg-muted">Red-orange &middot; hue 32</p>
        </div>
        <Link
          href="/c3/rc3/identity/colour"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-accent sm:inline-flex"
        >
          Ramp, tokens, contrast
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="mt-6 max-w-3xl text-fg-muted">
        Used as a scalpel. Ember marks identity, selection, and primary action. The same hue threads
        through link colour, focus rings, status dots, and the identity rule. Backgrounds and panels
        stay neutral.
      </p>

      <RC3Swatch
        className="mt-10 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
        style={{
          backgroundColor: SURFACE.bg,
          backgroundImage: `
            linear-gradient(${SURFACE.borderSoft} 1px, transparent 1px),
            linear-gradient(90deg, ${SURFACE.borderSoft} 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px, 12px 12px",
        }}
      >
        <div
          className="grid gap-px sm:grid-cols-2 lg:grid-cols-3"
          style={{ backgroundColor: SURFACE.border }}
        >
          <ColourMoment label="Identity rule">
            <div
              className="flex w-full items-center border-t-[1.5px] px-3 py-2"
              style={{ borderTopColor: RC3 }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: RC3 }}
                />
                <span
                  className="text-[10px] font-semibold tracking-[0.14em]"
                  style={{ color: SURFACE.fg }}
                >
                  RC3
                </span>
                <span className="text-[10px] tracking-[0.14em]" style={{ color: SURFACE.fgMuted }}>
                  / OPERATOR CONSOLE
                </span>
              </div>
            </div>
          </ColourMoment>

          <ColourMoment label="Selection edge">
            <div
              className="w-full overflow-hidden rounded"
              style={{
                border: `1px solid ${SURFACE.border}`,
                backgroundColor: SURFACE.surface,
              }}
            >
              <div
                className="flex items-center justify-between border-l-[2px] px-3 py-2"
                style={{ borderLeftColor: RC3 }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: RC3 }}
                  />
                  <span
                    className="font-mono text-[11px] font-semibold"
                    style={{ color: SURFACE.fg }}
                  >
                    UGV-04
                  </span>
                </div>
                <span className="font-mono text-[10px]" style={{ color: SURFACE.fg }}>
                  32 ms
                </span>
              </div>
              <div
                className="flex items-center justify-between border-l-[2px] border-t px-3 py-2"
                style={{ borderLeftColor: "transparent", borderTopColor: SURFACE.border }}
              >
                <span className="font-mono text-[11px]" style={{ color: SURFACE.fgMuted }}>
                  UAV-09
                </span>
                <span className="font-mono text-[10px]" style={{ color: SURFACE.fgMuted }}>
                  12 ms
                </span>
              </div>
            </div>
          </ColourMoment>

          <ColourMoment label="Primary action">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-xs font-medium"
                style={{
                  borderWidth: 1,
                  borderColor: SURFACE.border,
                  color: SURFACE.fg,
                  backgroundColor: "transparent",
                }}
              >
                Override
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: RC3, color: "oklch(15% 0 0)" }}
              >
                Engage
              </button>
            </div>
          </ColourMoment>

          <ColourMoment label="Link">
            <span
              className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
              style={{ color: RC3 }}
            >
              View platform UGV-04
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </ColourMoment>

          <ColourMoment label="Identity mark">
            <div className="flex items-center gap-5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: RC3 }}
              />
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: RC3 }}
              />
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ backgroundColor: RC3 }}
              />
            </div>
          </ColourMoment>

          <ColourMoment label="Status marker · in context">
            <div
              className="flex w-full items-center gap-2 rounded-md px-3 py-2"
              style={{
                backgroundColor: SURFACE.surface,
                border: `1px solid ${SURFACE.border}`,
              }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: RC3 }}
              />
              <span className="font-mono text-[11px]" style={{ color: SURFACE.fg }}>
                WPT-07
              </span>
              <span className="font-mono text-[10px]" style={{ color: SURFACE.fgMuted }}>
                · 1.2 km
              </span>
            </div>
          </ColourMoment>
        </div>
      </RC3Swatch>

      <Link
        href="/c3/rc3/identity/colour"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent sm:hidden"
      >
        Ramp, tokens, contrast
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

function Iconography() {
  const icons = [
    { Icon: Bot, label: "Bot" },
    { Icon: Plane, label: "Plane" },
    { Icon: MapIcon, label: "Map" },
    { Icon: Compass, label: "Compass" },
    { Icon: Crosshair, label: "Crosshair" },
    { Icon: Radar, label: "Radar" },
    { Icon: Radio, label: "Radio" },
    { Icon: ShieldAlert, label: "ShieldAlert" },
    { Icon: TriangleAlert, label: "TriangleAlert" },
  ];

  return (
    <section className="mt-24">
      <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
        <div>
          <SectionLabel>Two · Iconography</SectionLabel>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Schematic</h2>
        </div>
        <Link
          href="/docs/icons"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-accent sm:inline-flex"
        >
          Icon foundation
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="mt-6 max-w-3xl text-fg-muted">
        RC3 inherits lucide-react at the PRIZM site-wide 1.5 stroke-width. Domain symbols that
        lucide does not cover ship as custom inline SVGs to the same convention — 24×24 viewBox, 1.5
        stroke, schematic outlines, currentColor stroke.
      </p>

      <RC3Swatch
        className="mt-10 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
        style={{ backgroundColor: SURFACE.bg }}
      >
        <div
          className="grid grid-cols-3 gap-px sm:grid-cols-5 lg:grid-cols-9"
          style={{ backgroundColor: SURFACE.border }}
        >
          {icons.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex aspect-square items-center justify-center"
              style={{ backgroundColor: SURFACE.bg, color: SURFACE.fg }}
            >
              <Icon className="h-7 w-7" />
            </div>
          ))}
        </div>
      </RC3Swatch>

      <Link
        href="/docs/icons"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent sm:hidden"
      >
        Icon foundation
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

function Rule() {
  return (
    <section className="mt-24">
      <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
        <div>
          <SectionLabel>Three · Identity rule</SectionLabel>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            One line at the top edge
          </h2>
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-fg-muted">
        A 1.5px top border in the signature colour runs across every RC3 surface, paired with the
        RC3 mark and the active module name. Always-on — the identity carrier travels with the
        module regardless of host.
      </p>

      <div className="mt-10">
        <RuleMock />
      </div>
    </section>
  );
}

function ColourMoment({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-6" style={{ backgroundColor: SURFACE.bg }}>
      <div className="flex flex-1 items-center">{children}</div>
      <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: SURFACE.fgSubtle }}>
        {label}
      </div>
    </div>
  );
}

function RuleMock() {
  return (
    <RC3Swatch
      className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/5"
      style={{ backgroundColor: SURFACE.bg }}
    >
      <div
        className="flex items-center justify-between border-t-[1.5px] border-b px-6 py-3"
        style={{ borderTopColor: RC3, borderBottomColor: SURFACE.border }}
      >
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: RC3 }} />
          <span className="text-xs font-semibold tracking-[0.14em]" style={{ color: SURFACE.fg }}>
            RC3
          </span>
          <span className="text-xs tracking-[0.14em]" style={{ color: SURFACE.fgMuted }}>
            / OPERATOR CONSOLE
          </span>
        </div>
      </div>

      <div className="px-6 py-12 md:px-10 md:py-16">
        <div className="max-w-sm rounded-lg border border-border bg-surface p-6">
          <AutonomyModeSelectorDemo
            scope="platform"
            platform="UGV-04"
            rungs={DEFAULT_RUNGS}
            defaultActiveKey="supervised"
            compact={false}
          />
        </div>
      </div>
    </RC3Swatch>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
      {children}
    </span>
  );
}
