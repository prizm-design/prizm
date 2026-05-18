export const metadata = { title: "Enterprise — Overview" };

export default function EnterpriseOverviewPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-xs font-medium uppercase tracking-widest text-accent">Enterprise</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Design overview</h1>
      <p className="mt-4 text-lg text-fg-muted">
        Enterprise is for back-office applications, customer-facing portals, internal tools, and
        marketing surfaces. It serves a broader audience than C3 — people who may use the product
        occasionally, intensively, or somewhere in between.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Design principles</h2>
      <Section
        title="Whitespace as structure"
        body="Enterprise products lean into generous padding and clear visual hierarchy. A user new to the product should immediately understand what to look at."
      />
      <Section
        title="Calm over loud"
        body="Accents are restrained. Status colours appear when warranted, not as decoration. The system trusts the user to scan, not to stress-read."
      />
      <Section
        title="Light mode first"
        body="Most Enterprise users work in normal lighting. Light mode is the primary surface; dark mode is the alternate."
      />
      <Section
        title="Forms and data tables matter most"
        body="Forms and tables carry most of the weight in Enterprise products, so PRIZM Enterprise tunes those components with extra care."
      />
      <Section
        title="Approachable to first-time users"
        body="Tooltips, helper text, and empty states are first-class concerns — they help people who are new to the product feel oriented, not lost."
      />

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">When to use Enterprise vs C3</h2>
      <p className="mt-4 text-fg-muted">
        Choose Enterprise when the product serves a wide audience under normal working conditions.
        Choose C3 when the product is operated by trained users in sustained monitoring sessions.
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
