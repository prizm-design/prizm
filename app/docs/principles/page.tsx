import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "Design principles" };

interface Principle {
  title: string;
  citation: string;
  says: string;
  why: string;
  how: ReactNode;
}

const CORE_PRINCIPLES: Principle[] = [
  {
    title: "Predictable information placement",
    citation: "Endsley (1995)",
    says: "Recurring UI elements live in fixed, predictable locations. They don't move based on app state.",
    why: "People locate familiar information faster when it occupies a predictable spatial location. Research on attention and perception shows that fixed-position indicators reduce visual search time and prevent change-blindness errors that occur when content migrates between screens.",
    how: (
      <>
        Recurring UI — header chrome, primary navigation, account controls, status indicators,
        alerts — sits in the same screen position across templates, regardless of which app or page
        is active. The{" "}
        <Link href="/components/badge" className="text-accent hover:underline">
          Badge
        </Link>
        ,{" "}
        <Link href="/components/alert" className="text-accent hover:underline">
          Alert
        </Link>
        , and{" "}
        <Link href="/components/toast" className="text-accent hover:underline">
          Toast
        </Link>{" "}
        components inherit consistent anchoring rules.
      </>
    ),
  },
  {
    title: "Cognitive chunking",
    citation: "Miller (1956); Sweller (1988)",
    says: "Limit visible options to ~7±2 at any level of the interface. Use disclosure to extend depth without inflating breadth.",
    why: "Working memory is finite. Miller's classic capacity result and Sweller's cognitive load theory both predict that surfacing too many concurrent options degrades decision speed and accuracy. The effect compounds as attention is divided across more concurrent tasks.",
    how: (
      <>
        Icon rails cap at ~8 apps. Side panels group content into ≤5 sections.{" "}
        <Link href="/components/menu" className="text-accent hover:underline">
          Menu
        </Link>
        ,{" "}
        <Link href="/components/navigation-menu" className="text-accent hover:underline">
          Navigation Menu
        </Link>
        , and{" "}
        <Link href="/components/tabs" className="text-accent hover:underline">
          Tabs
        </Link>{" "}
        are the tools for keeping breadth low while preserving depth.
      </>
    ),
  },
  {
    title: "Fitts-aware action placement",
    citation: "Fitts (1954)",
    says: "Important actions are large and reachable. Destructive actions are never adjacent to their confirmations.",
    why: "Fitts' law predicts movement time as a function of target size and distance. Small or crowded targets compound error rates, and the cost of a misclick grows with the stakes of the action. Spatial separation between destructive and confirming actions is a primary defense against accidental commits.",
    how: (
      <>
        The{" "}
        <Link href="/components/button" className="text-accent hover:underline">
          Button
        </Link>{" "}
        primitive ships in four sizes; templates use{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">lg</code> or{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">md</code> for primary
        actions. The{" "}
        <Link href="/components/dialog" className="text-accent hover:underline">
          Dialog
        </Link>{" "}
        footer pattern places Confirm and Cancel apart, never paired tightly.
      </>
    ),
  },
  {
    title: "Information layering by task relevance",
    citation: "Yeh & Wickens (2001)",
    says: "Show what the current task needs at the primary layer. Push secondary and on-demand information behind tabs, hover, or disclosure.",
    why: "Yeh and Wickens' clutter research shows that information density degrades target acquisition non-linearly — small amounts of clutter cost disproportionately. Layered displays preserve density where it matters and remove it where it doesn't.",
    how: (
      <>
        Templates declare explicit primary / secondary / on-demand regions.{" "}
        <Link href="/components/hover-card" className="text-accent hover:underline">
          Hover Card
        </Link>
        ,{" "}
        <Link href="/components/popover" className="text-accent hover:underline">
          Popover
        </Link>
        , and{" "}
        <Link href="/components/sheet" className="text-accent hover:underline">
          Sheet
        </Link>{" "}
        are the disclosure primitives.
      </>
    ),
  },
];

const C3_PRINCIPLES: Principle[] = [
  {
    title: "Operator dark mode",
    citation: "Dark-adaptation research; MIL-STD-1472",
    says: "Dark is the canonical operator state. Light mode exists for daylight, shared-screen, or briefing contexts.",
    why: "Operator stations run in dim ambient light for hours. Dark interfaces reduce eye strain, preserve dark adaptation for any window-out reference, and minimize scatter on cockpit-style glass. MIL-STD-1472 (DoD human engineering criteria) reflects the same logic for operator workstations.",
    how: (
      <>
        The dark variant of{" "}
        <Link href="/c3" className="text-accent hover:underline">
          C3
        </Link>{" "}
        is the default surface for templates. Light is supported but expected to be the minority
        case.
      </>
    ),
  },
  {
    title: "Hierarchical alert escalation",
    citation: "Lees (1974); Stanton (1994)",
    says: "Severity escalates by perceptual salience: colour → icon shape → motion → audio. Don't escalate by stacking modalities — match the modality to the severity.",
    why: "Alarm-flooding research repeatedly shows that operators tune out interfaces where everything competes for top attention. Tiered salience preserves a meaningful difference between routine status and a real emergency.",
    how: (
      <>
        Use{" "}
        <Link href="/components/badge" className="text-accent hover:underline">
          Badge
        </Link>{" "}
        variants tiered by severity (success → warning → danger). Reserve motion (the hero-style
        pulse) for genuinely urgent indicators. Audio cues, when added, are reserved for the highest
        tier.
      </>
    ),
  },
  {
    title: "Reversibility — staged commit",
    citation: "Norman (1988); Reason (1990)",
    says: "Destructive C3 actions go through preview-then-commit. Bare buttons are reserved for cheap-to-undo operations.",
    why: "C3 actions often affect the real world — a deployed asset is deployed. Norman's gulf-of-execution and Reason's slip / lapse error taxonomy both argue for a deliberate confirmation step that requires the operator to re-engage with what they're about to do, not just click again.",
    how: (
      <>
        Destructive flows use{" "}
        <Link href="/components/dialog" className="text-accent hover:underline">
          Dialog
        </Link>{" "}
        with an explicit summary of the action and its consequences, before the commit button. The{" "}
        <Link href="/components/button" className="text-accent hover:underline">
          Button
        </Link>{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">danger</code> variant
        is reserved for these final commits.
      </>
    ),
  },
  {
    title: "Stress-resilient consistency",
    citation: "Driskell & Salas (1996)",
    says: "Layouts repeat across screens. Chrome (top bar, side panels, status regions) does not move between templates.",
    why: "Under high cognitive load and time pressure, operators revert to overlearned motor patterns. Inconsistent layouts force them back into deliberate visual search — exactly when they have least capacity for it.",
    how: (
      <>
        All C3 templates compose the same App Shell. The icon-rail order, badge positions, and
        command surfaces stay constant. Per-app content lives inside the chrome, never replacing it.
      </>
    ),
  },
  {
    title: "Layered transparency for spatial context",
    citation: "Wickens (2002) — proximity compatibility principle",
    says: "Floating panels over canvas content (a map, a feed, a chart) use a translucent surface treatment. Operators retain spatial awareness of the data behind the panel rather than having it occluded.",
    why: "C3 operators work inside a continuous spatial mental model. When a panel pops on top and covers the underlying canvas entirely, the operator has to mentally re-anchor when it closes. Translucent surfaces preserve the spatial relationship so the canvas remains the operator's persistent reference frame. Reserved for floating surfaces only — alerts, emergency dialogs, and critical-error states stay solid so legibility under stress is uncompromised.",
    how: (
      <>
        See{" "}
        <Link href="/docs/liquid-glass" className="text-accent hover:underline">
          Liquid glass
        </Link>
        . The treatment ships with{" "}
        <Link href="/components/sheet" className="text-accent hover:underline">
          Sheet
        </Link>
        ,{" "}
        <Link href="/components/popover" className="text-accent hover:underline">
          Popover
        </Link>
        ,{" "}
        <Link href="/components/tooltip" className="text-accent hover:underline">
          Tooltip
        </Link>
        ,{" "}
        <Link href="/components/hover-card" className="text-accent hover:underline">
          HoverCard
        </Link>
        ,{" "}
        <Link href="/components/menu" className="text-accent hover:underline">
          Menu
        </Link>
        , and{" "}
        <Link href="/components/context-menu" className="text-accent hover:underline">
          ContextMenu
        </Link>{" "}
        via the{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">variant="glass"</code>{" "}
        prop, or via the{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
          surface-glass-chrome
        </code>{" "}
        /{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
          surface-glass-panel
        </code>{" "}
        utility classes for custom chrome.
      </>
    ),
  },
];

const ENTERPRISE_PRINCIPLES: Principle[] = [
  {
    title: "Progressive disclosure",
    citation: "Nielsen (2006); Tidwell (2010)",
    says: "Start with the common case. Reveal complexity on demand.",
    why: "Enterprise users vary widely in expertise and frequency of use. A default surface that exposes every option penalizes the 80% who only need the common path. Disclosure scales the interface to the user's current task.",
    how: (
      <>
        Forms split into "essential" and "advanced" sections via{" "}
        <Link href="/components/tabs" className="text-accent hover:underline">
          Tabs
        </Link>{" "}
        or{" "}
        <Link href="/components/popover" className="text-accent hover:underline">
          Popover
        </Link>
        . Settings pages group rare options behind a "More" affordance rather than scrolling them
        all into view.
      </>
    ),
  },
  {
    title: "Form ergonomics",
    citation: "Wroblewski (2008); Jarrett (2009)",
    says: "Group fields by mental model, not by database schema. Minimize required input. Validate inline, not on submit.",
    why: "Form research consistently shows that grouping fields the way users think about them (Identity → Address → Preferences) outperforms grouping by storage layout (Profile table → Address table). Inline validation cuts correction loops dramatically.",
    how: (
      <>
        The{" "}
        <Link href="/components/field" className="text-accent hover:underline">
          Field
        </Link>{" "}
        wrapper composes label, hint, error, and input — supporting inline validation. Form
        templates demonstrate logical grouping and a "required-first" ordering.
      </>
    ),
  },
  {
    title: "Visual hierarchy through whitespace",
    citation: "Tufte (1990); Lidwell, Holden & Butler (2010)",
    says: "Use whitespace to signal grouping. Reserve colour and weight for emphasis, not for structure.",
    why: "Tufte's data-ink principle and Gestalt proximity grouping both point at the same thing — separation between groups is communicated more reliably by space than by lines or colour. Enterprise pages are read; spacing controls reading rhythm.",
    how: (
      <>
        The{" "}
        <Link href="/docs/surface-and-motion" className="text-accent hover:underline">
          spacing scale
        </Link>{" "}
        is generous in Enterprise. Cards have padding, sections breathe. Borders are used for
        separation, not decoration.
      </>
    ),
  },
  {
    title: "Default to undo over confirm",
    citation: "Nielsen (1994); Cooper, Reimann & Cronin (2007)",
    says: "Confirmation dialogs interrupt every user to catch the rare mistake. Default to a fast action with a clear undo, unless the action is genuinely irreversible.",
    why: "Confirmation is the opposite tradeoff from C3. In Enterprise contexts, most actions are cheap to reverse and users perform them frequently — making the common case slower to protect the rare case fails the cost-benefit calculation. C3 templates flip this; Enterprise templates lean toward optimistic UI with undo.",
    how: (
      <>
        Enterprise destructive flows show a{" "}
        <Link href="/components/toast" className="text-accent hover:underline">
          Toast
        </Link>{" "}
        with an Undo action rather than a Dialog confirm. Bulk and truly irreversible actions still
        confirm — the heuristic is "could a careful user undo this in 10 seconds?"
      </>
    ),
  },
];

export default function PrinciplesPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Foundations</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Design principles</h1>
      <p className="mt-3 text-lg text-fg-muted">
        PRIZM's patterns aren't aesthetic choices — they're shaped by human factors and HCI
        research. This page documents the principles every C3 and Enterprise template adheres to,
        with the research that backs each one.
      </p>

      {/* ============================================================
          Core principles
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">
        Core — apply across both products
      </h2>
      <p className="mt-3 text-fg-muted">
        Universal usability principles that show up in every PRIZM template, regardless of product.
      </p>
      <div className="mt-8 space-y-4">
        {CORE_PRINCIPLES.map((p) => (
          <PrincipleCard key={p.title} principle={p} accent="neutral" />
        ))}
      </div>

      {/* ============================================================
          C3 principles
          ============================================================ */}
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">C3 — for command and control</h2>
      <p className="mt-3 text-fg-muted">
        Principles specific to operator stations and command-and-control contexts. These are where
        C3 templates diverge most from Enterprise ones.
      </p>
      <div className="mt-8 space-y-4">
        {C3_PRINCIPLES.map((p) => (
          <PrincipleCard key={p.title} principle={p} accent="c3" />
        ))}
      </div>

      {/* ============================================================
          Enterprise principles
          ============================================================ */}
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">
        Enterprise — for websites and applications
      </h2>
      <p className="mt-3 text-fg-muted">
        Principles specific to Enterprise contexts — webapps, dashboards, marketing pages. Calmer,
        more progressive, more forgiving than C3 patterns.
      </p>
      <div className="mt-8 space-y-4">
        {ENTERPRISE_PRINCIPLES.map((p) => (
          <PrincipleCard key={p.title} principle={p} accent="enterprise" />
        ))}
      </div>

      {/* ============================================================
          References
          ============================================================ */}
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">References</h2>
      <p className="mt-3 text-fg-muted">
        PRIZM is built on established research and scientific principles in human factors and
        human-computer interaction.
      </p>
      <ul className="mt-6 space-y-2 text-sm text-fg-muted">
        <li>
          Cooper, A., Reimann, R., &amp; Cronin, D. (2007).{" "}
          <em>About Face 3: The Essentials of Interaction Design.</em>
        </li>
        <li>
          Driskell, J. E., &amp; Salas, E. (1996). <em>Stress and Human Performance.</em>
        </li>
        <li>
          Endsley, M. R. (1995). Toward a Theory of Situation Awareness in Dynamic Systems.{" "}
          <em>Human Factors</em>, 37(1).
        </li>
        <li>
          Fitts, P. M. (1954). The Information Capacity of the Human Motor System in Controlling the
          Amplitude of Movement. <em>Journal of Experimental Psychology</em>, 47.
        </li>
        <li>
          Jarrett, C., &amp; Gaffney, G. (2009).{" "}
          <em>Forms that Work: Designing Web Forms for Usability.</em>
        </li>
        <li>
          Lees, F. P. (1974). Quantification of Man-Machine System Reliability in Process Control.{" "}
          <em>IEEE Transactions on Reliability</em>.
        </li>
        <li>
          Lidwell, W., Holden, K., &amp; Butler, J. (2010). <em>Universal Principles of Design.</em>
        </li>
        <li>
          Miller, G. A. (1956). The Magical Number Seven, Plus or Minus Two.{" "}
          <em>Psychological Review</em>, 63(2).
        </li>
        <li>
          Nielsen, J. (1994). <em>Usability Engineering.</em>
        </li>
        <li>
          Nielsen, J. (2006). Progressive Disclosure. <em>Nielsen Norman Group.</em>
        </li>
        <li>
          Norman, D. A. (1988). <em>The Design of Everyday Things.</em>
        </li>
        <li>
          Reason, J. (1990). <em>Human Error.</em>
        </li>
        <li>
          Stanton, N. A. (1994). <em>Human Factors in Alarm Design.</em>
        </li>
        <li>
          Sweller, J. (1988). Cognitive Load During Problem Solving. <em>Cognitive Science</em>,
          12(2).
        </li>
        <li>
          Tidwell, J. (2010). <em>Designing Interfaces.</em>
        </li>
        <li>
          Tufte, E. R. (1990). <em>Envisioning Information.</em>
        </li>
        <li>
          U.S. Department of Defense. MIL-STD-1472:{" "}
          <em>
            Human Engineering Design Criteria for Military Systems, Equipment, and Facilities.
          </em>
        </li>
        <li>
          Wroblewski, L. (2008). <em>Web Form Design: Filling in the Blanks.</em>
        </li>
        <li>
          Yeh, M., &amp; Wickens, C. D. (2001). Display Signaling in Augmented Reality.{" "}
          <em>Human Factors</em>, 43(3).
        </li>
      </ul>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Sub-components
   -------------------------------------------------------------------------- */

function PrincipleCard({
  principle,
  accent,
}: {
  principle: Principle;
  accent: "neutral" | "c3" | "enterprise";
}) {
  const accentStyles = {
    neutral: "border-l-border-strong",
    c3: "border-l-accent",
    enterprise: "border-l-accent",
  } as const;

  return (
    <div
      className={`rounded-lg border border-border border-l-4 ${accentStyles[accent]} bg-surface p-6`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-fg">{principle.title}</h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
          {principle.citation}
        </span>
      </div>
      <p className="mt-3 text-fg">{principle.says}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Why</p>
          <p className="mt-1.5 text-sm text-fg-muted">{principle.why}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            How it shows up in PRIZM
          </p>
          <p className="mt-1.5 text-sm text-fg-muted">{principle.how}</p>
        </div>
      </div>
    </div>
  );
}
