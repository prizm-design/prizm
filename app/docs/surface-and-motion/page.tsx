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

export default function SurfaceAndMotionPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Foundations</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Surface &amp; motion</h1>
      <p className="mt-3 text-lg text-fg-muted">
        Radii, shadows, and motion. The small physical-feeling values that determine how PRIZM
        components round their corners, lift off the page, and move.
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
        PRIZM does not define its own duration or easing tokens. Components animate using
        Tailwind&rsquo;s default{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">duration-*</code> and{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">ease-*</code>{" "}
        utilities, which give a coherent enough tempo for the current component set. If motion
        becomes load-bearing for a future template or design call, we&rsquo;ll re-introduce a tempo
        system sized to that concrete need rather than guess at one now.
      </p>
      <p className="mt-3 text-fg-muted">
        When animating in a custom component, reach for{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">
          transition-colors duration-150
        </code>{" "}
        for hover-style micro-interactions,{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">
          duration-200 ease-out
        </code>{" "}
        for entrance transitions, and{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">duration-300</code>{" "}
        for larger reveals like modal opens. Always honour{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">
          prefers-reduced-motion
        </code>
        .
      </p>
    </article>
  );
}
