import { SafetyActions, type SafetyScope } from "@/components/rc3/safety-actions";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "RC3 — Command contexts" };

// RC3 signature hue + a deeper Ember step — pack identity, theme-independent.
const RC3 = "oklch(71% 0.195 32)";
const RC3_DEEP = "oklch(40% 0.120 29)";

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

const SCOPES = [
  {
    index: "One",
    name: "Platform",
    role: "One platform",
    definition: "Direct command of a single robot. Teleop or supervised.",
    example: "UGV-04",
  },
  {
    index: "Two",
    name: "Group",
    role: "Several coordinated platforms",
    definition:
      "Element- or section-level coordination. Two to a dozen platforms acting in concert.",
    example: "ECHELON BRAVO · 3 PLATFORMS",
  },
  {
    index: "Three",
    name: "Swarm",
    role: "Many platforms acting on intent",
    definition:
      "Group-level intent over a larger force. Operator sets the rules, the swarm executes.",
    example: "PERIMETER WATCH · 12 PLATFORMS",
  },
  {
    index: "Four",
    name: "Mission",
    role: "A strategic objective",
    definition: "Mission-level intent. The full force is sequenced toward an outcome.",
    example: "OP NIGHTOWL · 47 PLATFORMS",
  },
] as const;

const COMMANDING = [
  { scope: "Platform", value: "UGV-04", meta: "ACTIVE" },
  { scope: "Group", value: "ECHELON BRAVO", meta: "3 PLATFORMS" },
  { scope: "Swarm", value: "PERIMETER WATCH", meta: "12 PLATFORMS" },
  { scope: "Mission", value: "OP NIGHTOWL", meta: "47 PLATFORMS" },
] as const;

const SAFETY: { scope: SafetyScope; label: string }[] = [
  { scope: "platform", label: "Platform" },
  { scope: "group", label: "Group" },
  { scope: "swarm", label: "Swarm" },
  { scope: "mission", label: "Mission" },
];

export default function RC3CommandContextsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Spectrum />
      <ContextAware />
      <ScopeType />
      <InvariantCallout />
    </div>
  );
}

function ScopeType() {
  return (
    <section className="mt-20">
      <SectionLabel>The Scope type</SectionLabel>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        One type, shared across organisms.
      </h2>
      <p className="mt-4 max-w-3xl text-fg-muted">
        Every RC3 organism that adapts to scope takes a{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">scope</code> prop. The
        type is canonical here so the concept and its TypeScript representation live together.
        Safety actions, comms / health strip, and autonomy mode selector all import their{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">Scope</code> alias from
        this same union.
      </p>
      <div className="mt-6 max-w-3xl">
        <CodeBlock
          language="ts"
          code={`type Scope = "platform" | "group" | "swarm" | "mission";

// What each value addresses:
//   platform → a single robot
//   group    → an element / section, 2–12 platforms acting in concert
//   swarm    → larger force on shared intent
//   mission  → the full force sequenced toward a strategic outcome`}
        />
      </div>
      <p className="mt-4 max-w-3xl text-sm text-fg-muted">
        The same union surfaces in each organism's API as{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">SafetyScope</code>,{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">Scope</code>, and{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">AutonomyScope</code> —
        the aliases name the consuming organism, but the value set is identical and load-bearing.
        Your application owns the state machine that decides which scope the operator is addressing
        at any moment; the organisms render accordingly.
      </p>
    </section>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[
          { label: "RC3", href: "/c3/rc3" },
          { label: "Concepts", href: "/c3/rc3/concepts" },
          { label: "Command contexts" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Concepts
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Command contexts
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        What you are commanding right now. RC3 carries one vocabulary across the spectrum — from a
        single platform to a mission — and adapts the surface to scope.
      </p>
    </div>
  );
}

function Spectrum() {
  return (
    <section className="mt-16">
      <SectionLabel>The spectrum</SectionLabel>

      <RC3Swatch
        className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
        style={{ backgroundColor: SURFACE.bg }}
      >
        <div
          className="grid gap-px sm:grid-cols-2 lg:grid-cols-4"
          style={{ backgroundColor: SURFACE.border }}
        >
          {SCOPES.map((s) => (
            <ScopeCell key={s.name} {...s} />
          ))}
        </div>

        {/* Gradient line under all four — the transition from tight control to intent. */}
        <div
          className="relative h-1.5"
          style={{
            background: `linear-gradient(to right, ${RC3} 0%, ${RC3} 12%, ${RC3_DEEP} 50%, ${SURFACE.fgSubtle} 100%)`,
          }}
        />
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ backgroundColor: SURFACE.bg }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{ color: SURFACE.fgMuted }}
          >
            Tight control
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{ color: SURFACE.fgMuted }}
          >
            Intent only
          </span>
        </div>
      </RC3Swatch>
    </section>
  );
}

function ScopeCell({ index, name, role, definition, example }: (typeof SCOPES)[number]) {
  return (
    <div className="flex flex-col p-6" style={{ backgroundColor: SURFACE.bg }}>
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: SURFACE.fgSubtle }}
      >
        {index}
      </div>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight" style={{ color: SURFACE.fg }}>
        {name}
      </h3>
      <p className="mt-1 text-xs font-medium" style={{ color: RC3 }}>
        {role}
      </p>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: SURFACE.fgMuted }}>
        {definition}
      </p>
      <div
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-md px-2.5 py-1.5"
        style={{
          backgroundColor: SURFACE.panel,
          border: `1px solid ${SURFACE.border}`,
        }}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        <span className="font-mono text-[11px] font-semibold" style={{ color: SURFACE.fg }}>
          {example}
        </span>
      </div>
    </div>
  );
}

function ContextAware() {
  return (
    <section className="mt-20">
      <SectionLabel>Context-aware components</SectionLabel>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        The role is constant. The content shifts with scope.
      </h2>
      <p className="mt-4 max-w-3xl text-fg-muted">
        Components have the same name and the same shape across the spectrum. What they hold —
        identifiers, telemetry surface, safety actions — adapts to whatever scope the operator is
        addressing.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <RoleColumn label="Now commanding · indicator">
          {COMMANDING.map((c) => (
            <CommandingCard key={c.scope} {...c} />
          ))}
        </RoleColumn>

        <RoleColumn label="Safety action · primary affordance">
          {SAFETY.map((s) => (
            <SafetyCard key={s.scope} scope={s.scope} label={s.label} />
          ))}
        </RoleColumn>
      </div>
    </section>
  );
}

function RoleColumn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <RC3Swatch
      className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5"
      style={{ backgroundColor: SURFACE.bg }}
    >
      <div className="border-b px-5 py-3" style={{ borderColor: SURFACE.border }}>
        <span
          className="text-[10px] uppercase tracking-[0.14em]"
          style={{ color: SURFACE.fgMuted }}
        >
          {label}
        </span>
      </div>
      <div className="space-y-px" style={{ backgroundColor: SURFACE.border }}>
        {children}
      </div>
    </RC3Swatch>
  );
}

function CommandingCard({
  scope,
  value,
  meta,
}: {
  scope: string;
  value: string;
  meta: string;
}) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4"
      style={{ backgroundColor: SURFACE.bg }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: RC3 }} />
        <div>
          <div className="font-mono text-sm font-bold tracking-tight" style={{ color: SURFACE.fg }}>
            {value}
          </div>
          <div
            className="mt-0.5 font-mono text-[10px] tracking-wider"
            style={{ color: SURFACE.fgMuted }}
          >
            {meta}
          </div>
        </div>
      </div>
      <span
        className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
        style={{
          color: SURFACE.fgMuted,
          border: `1px solid ${SURFACE.border}`,
        }}
      >
        {scope}
      </span>
    </div>
  );
}

function SafetyCard({ scope, label }: { scope: SafetyScope; label: string }) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-4"
      style={{ backgroundColor: SURFACE.bg }}
    >
      <span
        className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
        style={{
          color: SURFACE.fgMuted,
          border: `1px solid ${SURFACE.border}`,
        }}
      >
        {label}
      </span>
      <SafetyActions scope={scope} />
    </div>
  );
}

function InvariantCallout() {
  return (
    <section className="mt-20">
      <Link
        href="/c3/rc3/concepts/behavioural-invariants"
        className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-bg-subtle sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
            Related invariant
          </div>
          <p className="mt-2 max-w-2xl text-base text-fg">
            Without an unambiguous active context, the spectrum collapses. See{" "}
            <span className="font-semibold">Active context unambiguous</span> in behavioural
            invariants.
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
