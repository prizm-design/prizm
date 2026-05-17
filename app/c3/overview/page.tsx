import Link from "next/link";

export const metadata = { title: "C3 — Overview" };

export default function C3OverviewPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-xs font-medium uppercase tracking-widest text-accent">C3</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Design overview</h1>
      <p className="mt-4 text-lg text-fg-muted">
        C3 — command and control — is for systems where operators monitor and act on real-world
        events. Air defense, dispatch, network operations, mission control.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Design principles</h2>
      <Section
        title="Density over whitespace"
        body="Operators need to see a lot at once. C3 reduces padding, tightens typography, and shrinks decorative space so more information fits on screen without scrolling."
      />
      <Section
        title="High contrast for clarity"
        body="C3 prioritizes legibility under stress. Foreground and background contrast targets exceed WCAG AAA where practical. Borders are visible, not whispered."
      />
      <Section
        title="Color carries meaning"
        body="Status colors (red, amber, green) appear consistently and never decoratively. A red badge means an actual problem. A blinking element warrants attention."
      />
      <Section
        title="Designed for dark mode first"
        body="Most C3 installations run in dim rooms. Dark mode is the primary surface; light mode is the alternate. Token decisions favor dark-mode quality."
      />
      <Section
        title="Keyboard before pointer"
        body="Operators don't fumble with mice. Every action has a keyboard path. Focus rings are visible and unambiguous."
      />

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">A C3-only surface treatment</h2>
      <p className="mt-4 text-fg-muted">
        C3 ships with{" "}
        <Link href="/docs/liquid-glass" className="text-accent hover:underline">
          liquid glass
        </Link>{" "}
        — a translucent surface treatment for floating panels over canvas content. Operators
        retain spatial awareness of the map or feed behind a panel rather than having it occluded.
        Available in both C3 light and C3 dark; not available in Enterprise.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">When to use C3 vs Enterprise</h2>
      <p className="mt-4 text-fg-muted">
        Choose C3 when the product is operated by trained users who spend long sessions monitoring
        or directing real-world systems. Choose Enterprise for everything else — back-office
        applications, customer-facing tools, internal portals.
      </p>
    </article>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-6">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-fg-muted">{body}</p>
    </section>
  );
}
