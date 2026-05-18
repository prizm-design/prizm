import Link from "next/link";

export const metadata = {
  title: "Introduction",
  description:
    "Why PRIZM is named after a prism, what's new in PRIZM 4.0, and where the system is heading.",
};

export default function IntroductionPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-xs font-medium uppercase tracking-widest text-accent">Overview</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Introduction</h1>
      <p className="mt-4 text-lg text-fg-muted">
        PRIZM is a DSTA design system. One coherent foundation, several distinct product surfaces.
        This page covers where the name comes from, what changed in PRIZM 4.0, and what we're
        building next.
      </p>

      {/* ============================================================
          Why PRIZM
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Why &ldquo;PRIZM&rdquo;</h2>
      <p className="mt-4 text-fg-muted">
        When light enters a prism it doesn&rsquo;t stop being light. It splits — fanning into red,
        orange, green, blue — and each colour continues on a different path. The source is one. The
        outputs are many.
      </p>
      <p className="mt-4 text-fg-muted">
        PRIZM works the same way. One design system. One set of primitives. One coherent visual
        language. But the surfaces it shapes — a tactical operator station, a customer-facing
        portal, an internal admin tool — each find their own path, with their own density, their own
        tone, their own audience. Same DNA, different colours.
      </p>
      <p className="mt-4 text-fg-muted">
        The &ldquo;Z&rdquo; isn&rsquo;t a typo. It&rsquo;s the system&rsquo;s reminder to itself
        that the goal isn&rsquo;t to copy what other design systems already do — it&rsquo;s to
        anticipate where they&rsquo;re going.
      </p>

      {/* ============================================================
          PRIZM 4.0
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">PRIZM 4.0</h2>
      <p className="mt-4 text-fg-muted">
        PRIZM 4.0 is rebuilt from the ground up. It is not an incremental update to PRIZM 1, 2, or 3
        — it is a reimagination of what a DSTA design system can be.
      </p>
      <p className="mt-4 text-fg-muted">
        The earlier versions served us well. They standardised UI across DSTA products through years
        of steady, additive iteration. But the surrounding landscape has moved on: component
        primitives have matured (we now build on{" "}
        <strong className="font-medium text-fg">Base UI</strong>&rsquo;s accessible foundations
        rather than maintaining our own), CSS has matured (Tailwind v4&rsquo;s token system replaces
        hand-rolled CSS), and — most consequentially — the way teams build software is changing. AI
        is part of how interfaces get designed and shipped now. A design system built only for human
        consumption is leaving capability on the table.
      </p>

      <h3 className="mt-8 text-lg font-semibold tracking-tight">
        Built for both developers and AI
      </h3>
      <p className="mt-3 text-fg-muted">
        Components are documented for developers, and the same documentation is structured so an AI
        assistant can read it, understand it, and ship correct UI on a team&rsquo;s behalf. Every
        component ships with a TypeScript surface, a usage example, a per-component LLM context
        file, and props encoded in a machine-readable spec. See{" "}
        <Link href="/docs/using-with-ai" className="text-accent hover:underline">
          using PRIZM with AI
        </Link>{" "}
        for how teams adopt this in practice.
      </p>

      <h3 className="mt-8 text-lg font-semibold tracking-tight">
        Every component carefully crafted
      </h3>
      <p className="mt-3 text-fg-muted">
        The 44 stable primitives in the baseline are not auto-generated wrappers — each one has been
        considered individually. Variants are chosen, not enumerated. Keyboard paths are explicit.
        Focus management is deliberate. The four-variant token system means a single component
        renders correctly in C3-light, C3-dark, Enterprise-light, and Enterprise-dark with no
        branching at the call site. The result is a small set of well-shaped parts that compose into
        much larger surfaces without losing coherence.
      </p>

      <h3 className="mt-8 text-lg font-semibold tracking-tight">
        A custom Liquid Glass surface treatment
      </h3>
      <p className="mt-3 text-fg-muted">
        On the visual side, we&rsquo;ve layered a custom{" "}
        <Link href="/docs/liquid-glass" className="text-accent hover:underline">
          Liquid Glass
        </Link>{" "}
        treatment over Base UI&rsquo;s primitives — a translucent surface system designed for C3
        operator displays, where panels need to sit over a map or feed without blocking spatial
        context. Two tiers, both light and dark, all baked into the system.
      </p>

      {/* ============================================================
          What's next
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">What&rsquo;s next</h2>
      <p className="mt-4 text-fg-muted">
        PRIZM 4.0 is in active preview. The 44-component stable baseline covers a large surface
        area, but it isn&rsquo;t complete — six more components are already on the roadmap
        (Accordion, Date Picker, Tree, Toggle Group, Number Input, Scroll Area), with further
        additions to follow as templates pull them in.
      </p>
      <p className="mt-4 text-fg-muted">
        We will also expand the template library, building out the six planned C3 app templates and
        adding the Enterprise template set.
      </p>
      <p className="mt-4 text-fg-muted">
        Beyond the current two product families, we&rsquo;re exploring a third —{" "}
        <strong className="font-medium text-fg">Info systems</strong> — for products that sit
        between C3 and Enterprise: dashboards, briefing surfaces, and analytical tools where
        information density matters but the audience isn&rsquo;t purely operator-trained.
      </p>

      {/* ============================================================
          Next reads
          ============================================================ */}
      <div className="mt-16 grid gap-4 rounded-lg border border-border bg-surface p-6 sm:grid-cols-2">
        <Link href="/docs/getting-started" className="group">
          <div className="text-xs font-medium uppercase tracking-wider text-fg-subtle">Next</div>
          <div className="mt-1 text-base font-semibold text-fg group-hover:text-accent">
            Getting started →
          </div>
          <p className="mt-1 text-sm text-fg-muted">
            Install dependencies and copy your first component.
          </p>
        </Link>
        <Link href="/docs/foundations" className="group">
          <div className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
            Or browse
          </div>
          <div className="mt-1 text-base font-semibold text-fg group-hover:text-accent">
            Foundations →
          </div>
          <p className="mt-1 text-sm text-fg-muted">
            The tokens, principles, and visual language behind the system.
          </p>
        </Link>
      </div>
    </article>
  );
}
