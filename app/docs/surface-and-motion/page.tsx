import { DurationDemo, EaseDemo } from "./demos";

export const metadata = { title: "Surface & motion" };

const RADII = [
  { name: "xs", value: "0.125rem", px: "2px", tailwind: "rounded-xs" },
  { name: "sm", value: "0.25rem", px: "4px", tailwind: "rounded-sm" },
  { name: "md", value: "0.375rem", px: "6px", tailwind: "rounded-md" },
  { name: "lg", value: "0.5rem", px: "8px", tailwind: "rounded-lg" },
  { name: "xl", value: "0.75rem", px: "12px", tailwind: "rounded-xl" },
];

const SHADOWS = [
  {
    name: "sm",
    tailwind: "shadow-sm",
    role: "Quiet lift — inline cards, table rows.",
  },
  {
    name: "md",
    tailwind: "shadow-md",
    role: "Default elevation — popovers, menus, tooltips.",
  },
  {
    name: "lg",
    tailwind: "shadow-lg",
    role: "Maximum elevation — modal dialogs, drawers, sheets.",
  },
];

const DURATIONS = [
  { name: "fast", value: "120ms", role: "Hover, micro-interactions." },
  { name: "base", value: "200ms", role: "Default for everything else." },
  { name: "slow", value: "320ms", role: "Modals, sheets, content reveals." },
];

const EASES = [
  {
    name: "ease-out",
    value: "cubic-bezier(0.16, 1, 0.3, 1)",
    role: "Default for entrances — fast out of the gate, settles softly.",
  },
  {
    name: "ease-in-out",
    value: "cubic-bezier(0.65, 0, 0.35, 1)",
    role: "Symmetric — used for state toggles and looping motion.",
  },
];

export default function SurfaceAndMotionPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Foundations</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Surface &amp; motion</h1>
      <p className="mt-3 text-lg text-fg-muted">
        Radii, shadows, and motion tokens. The small physical-feeling values that determine how
        PRIZM components round their corners, lift off the page, and move.
      </p>

      {/* ============================================================
          Radii
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Radii</h2>
      <p className="mt-3 text-fg-muted">
        Five corner radii covering everything from inline pills to floating panels. Used by every
        component that has a corner — buttons, inputs, cards, dialogs, popovers.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {RADII.map((r) => (
          <div key={r.name} className="rounded-lg border border-border bg-surface p-4">
            <div
              className="mb-4 h-16 w-full bg-bg-muted"
              style={{ borderRadius: `var(--prizm-radius-${r.name})` }}
            />
            <div className="text-sm font-semibold text-fg">{r.name}</div>
            <div className="mt-1 font-mono text-[11px] text-fg-muted">
              {r.value} ({r.px})
            </div>
            <code className="mt-2 inline-block rounded bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
              {r.tailwind}
            </code>
          </div>
        ))}
      </div>

      {/* ============================================================
          Shadows
          ============================================================ */}
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">Shadows</h2>
      <p className="mt-3 text-fg-muted">
        Three elevation tiers. Match them to how prominently an element sits over its background — a
        row in a table sits at{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">sm</code>, a popover
        at <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">md</code>, a modal
        at <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">lg</code>.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {SHADOWS.map((s) => (
          <div key={s.name} className="rounded-lg border border-border bg-bg-subtle p-8">
            <div
              className="flex h-24 items-center justify-center rounded-md bg-surface text-sm font-semibold text-fg"
              style={{ boxShadow: `var(--prizm-shadow-${s.name})` }}
            >
              shadow-{s.name}
            </div>
            <p className="mt-4 text-xs text-fg-muted">{s.role}</p>
            <code className="mt-2 inline-block rounded bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
              shadow-{s.name}
            </code>
          </div>
        ))}
      </div>

      {/* ============================================================
          Motion
          ============================================================ */}
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">Motion</h2>
      <p className="mt-3 text-fg-muted">
        PRIZM defines three duration tokens and two ease curves. The tokens are the canonical
        reference for how fast a transition should feel — reach for them when animating opacity,
        position, scale, or background-color in a custom component.
      </p>
      <p className="mt-3 text-sm text-fg-muted">
        Note: most stable PRIZM components currently use Tailwind&rsquo;s default duration/ease
        utilities. The tokens are documented here as the canonical timing scale; expect them to be
        wired through more deliberately once the design language is locked.
      </p>

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
        Durations
      </h3>
      <p className="mt-3 text-fg-muted">Click each box to see the duration in action.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {DURATIONS.map((d) => (
          <DurationDemo key={d.name} duration={d} />
        ))}
      </div>

      <h3 className="mt-12 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
        Ease curves
      </h3>
      <p className="mt-3 text-fg-muted">Click each box to compare the easing feel.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {EASES.map((e) => (
          <EaseDemo key={e.name} ease={e} />
        ))}
      </div>
    </article>
  );
}
