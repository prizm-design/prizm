import Link from "next/link";

export const metadata = {
  title: "Changelog",
  description:
    "What's new in PRIZM. Component additions, template additions, design language tweaks, and notable fixes.",
};

// ============================================================
//  Entry data
//  ------------------------------------------------------------
//  Add a new entry at the TOP of the list when you ship a
//  meaningful change. Five tag types — keep the taxonomy tight:
//
//    component   — new component or material change to existing one
//    template    — new template or material change
//    foundation  — new foundation page or token-system change
//    design      — visual-language tweak (blur, colour, spacing, motion)
//    fix         — bug fix worth telling consumers about
//
//  Do NOT add entries for: typo fixes, doc rewordings, lint /
//  formatting cleanup, internal refactors that don't affect a
//  consumer copying components into their codebase.
// ============================================================

type ChangeType = "component" | "template" | "foundation" | "design" | "fix";

interface ChangeEntry {
  type: ChangeType;
  title: string;
  body?: string;
  href?: string;
}

interface ChangelogDay {
  date: string; // ISO yyyy-mm-dd
  entries: ChangeEntry[];
}

const CHANGELOG: ChangelogDay[] = [
  {
    date: "2026-05-18",
    entries: [
      {
        type: "foundation",
        title: "Introduction page and Changelog added",
        body: "Overview gains an Introduction (why PRIZM, what changed in 4.0, what's next) and a Changelog. Site nav reordered to Overview → Foundations → Components → C3 → Enterprise so new readers orient before they browse.",
        href: "/docs/introduction",
      },
      {
        type: "design",
        title: "Liquid glass blur tuned to 8 / 12 px",
        body: "Chrome and panel blur reduced from 12 / 24 px so underlying canvas activity (map markers, route lines, terrain) stays readable through glass. Aligned with Apple's thin material tiers.",
        href: "/docs/liquid-glass",
      },
      {
        type: "component",
        title: "Combobox is now typeahead-first",
        body: "Single search input replaces the trigger + popup-input pattern. Type to filter against the items prop; pick to select. Popup width pinned to the trigger, empty state collapses cleanly.",
        href: "/components/combobox",
      },
      {
        type: "component",
        title: "Toast example wired up",
        body: "The Toast component page now ships a working preview with Success / Error / Info triggers. ToastDemo lives as a client component under components/site/ so it can call the imperative toast.add() singleton.",
        href: "/components/toast",
      },
      {
        type: "fix",
        title: "C3 App Shell theme toggle in liquid glass mode",
        body: "Toggling dark ↔ light while glass was on left the chrome and side panels visually stuck on the old tint until a browser tab switch. Force a one-frame backdrop-filter suppression on mode change so the GPU layer invalidates.",
        href: "/c3/templates/app-shell",
      },
      {
        type: "foundation",
        title: "Icons page mobile layout fixed",
        body: "The Accessibility section's card grid was wider than the viewport on small screens, which forced page-level horizontal scroll and made the Custom SVGs section look broken. Now both sections fit cleanly.",
        href: "/docs/icons",
      },
    ],
  },
  {
    date: "2026-05-17",
    entries: [
      {
        type: "foundation",
        title: "Liquid Glass surface treatment",
        body: "A C3-only translucent surface system in two tiers (chrome for the application frame, panel for floating overlays). Light and dark modes, noise overlay, hairline border, rim-light highlight. Six components opt in via variant='glass'.",
        href: "/docs/liquid-glass",
      },
      {
        type: "foundation",
        title: "Icons foundation page",
        body: "Documents the lucide-react choice, the site-wide stroke-width of 1.5, the five-size scale, accessibility conventions, and the PRIZM brand mark as a worked example for custom SVGs.",
        href: "/docs/icons",
      },
    ],
  },
  {
    date: "2026-05-16",
    entries: [
      {
        type: "template",
        title: "C3 App Shell template",
        body: "First C3 template. Top bar, status ticker, icon rail, slide panel, notification centre, workspace panel — all composed from existing PRIZM primitives. Includes the Design Principles Applied section anchoring decisions in HF research.",
        href: "/c3/templates/app-shell",
      },
    ],
  },
  {
    date: "2026-05-15",
    entries: [
      {
        type: "component",
        title: "44-component baseline complete",
        body: "All 44 primitives ported and marked stable. Drawer merged into Sheet (consolidated four-side panel API). Sidebar removed — assembled sidebars will ship as templates where the per-zone divergence is more naturally expressed.",
        href: "/components",
      },
      {
        type: "foundation",
        title: "Foundations pages",
        body: "Design principles, Colours, Typography, Surface & motion shipped as the visual reference layer.",
        href: "/docs/foundations",
      },
    ],
  },
];

const TYPE_LABELS: Record<ChangeType, string> = {
  component: "Component",
  template: "Template",
  foundation: "Foundation",
  design: "Design",
  fix: "Fix",
};

// Colour tokens for each tag. Lean — accent for additive, info for context,
// warning for design tweaks, muted for fixes. Keeps the timeline scannable.
const TYPE_CLASSES: Record<ChangeType, string> = {
  component: "border-accent/40 bg-accent/10 text-accent",
  template: "border-accent/40 bg-accent/10 text-accent",
  foundation: "border-info/40 bg-info/10 text-info",
  design: "border-warning/40 bg-warning/10 text-warning",
  fix: "border-border-strong bg-bg-muted text-fg-muted",
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function ChangelogPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-xs font-medium uppercase tracking-widest text-accent">Overview</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Changelog</h1>
      <p className="mt-4 text-lg text-fg-muted">
        What&rsquo;s new in PRIZM — new components, new templates, design language tweaks, and
        notable fixes. Entries are curated, not auto-generated from git; if a change would affect a
        team copying PRIZM into their codebase, it appears here.
      </p>

      <div className="mt-12 space-y-12">
        {CHANGELOG.map((day) => (
          <section key={day.date}>
            <div className="flex items-baseline gap-3">
              <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">
                {formatDate(day.date)}
              </h2>
              <div className="h-px flex-1 bg-border" aria-hidden />
            </div>
            <ul className="mt-5 space-y-5">
              {day.entries.map((entry, i) => (
                <li
                  key={`${day.date}-${i}`}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1"
                >
                  <span
                    className={`mt-0.5 inline-flex h-[22px] w-[92px] items-center justify-center self-start rounded-full border px-2 text-[11px] font-medium uppercase tracking-wider ${TYPE_CLASSES[entry.type]}`}
                  >
                    {TYPE_LABELS[entry.type]}
                  </span>
                  <div className="min-w-0">
                    {entry.href ? (
                      <Link
                        href={entry.href}
                        className="text-base font-semibold text-fg hover:text-accent"
                      >
                        {entry.title}
                      </Link>
                    ) : (
                      <div className="text-base font-semibold text-fg">{entry.title}</div>
                    )}
                    {entry.body && <p className="mt-1 text-sm text-fg-muted">{entry.body}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
