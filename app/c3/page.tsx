import { ArrowRight, Layout, Target } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "C3" };

// RC3 signature hue — pack identity, theme-independent.
const RC3 = "oklch(71% 0.195 32)";

export default function C3LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Command and Control
        </div>
        <h1 className="text-balance text-5xl font-semibold tracking-tight">PRIZM for C3 systems</h1>
        <p className="mt-4 text-balance text-lg text-fg-muted">
          The C3 design language emphasises density, high contrast, and operator clarity. Built for
          tactical interfaces, real-time data, and low-light environments.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <ZoneCard
          icon={<Target className="h-5 w-5" />}
          title="Overview"
          description="Design principles, when to use C3, and how the aesthetic differs from Enterprise."
          href="/c3/overview"
        />
        <ZoneCard
          icon={<Layout className="h-5 w-5" />}
          title="Templates"
          description="Layout scaffolds tuned for operator stations, dashboards, and tactical views."
          href="/c3/templates"
        />
      </div>

      <CapabilityPacks />
      <ThickClient />
    </div>
  );
}

function ThickClient() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">Thick-client delivery</h2>
      <div className="mt-3 max-w-3xl space-y-3 text-fg-muted">
        <p>
          Not every C3 surface is a web app — operator consoles often run as native desktop
          software. C3 ships for that too: a parallel{" "}
          <strong className="font-medium text-fg">JavaFX</strong> library for thick-client
          applications, rendered natively rather than in a browser.
        </p>
        <p>
          The design language is shared, not duplicated. The colour tokens are derived from the same
          canonical source, and the controls are in spec parity with their web counterparts — C3 and
          its capability packs only.
        </p>
      </div>
      <div className="mt-6">
        <Link
          href="/c3/javafx"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium transition-colors hover:border-border-strong hover:bg-bg-subtle"
        >
          Explore PRIZM for JavaFX
          <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function CapabilityPacks() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">Capability packs</h2>
      <div className="mt-3 max-w-3xl space-y-3 text-fg-muted">
        <p>
          Some C3 products are specialised — flying an autonomous robot swarm, fusing an ISR sensor
          picture, running an electronic-warfare console. Each reaches beyond the general PRIZM
          system, with capabilities that need their own organisms and a distinct visual and
          interaction treatment, not just a recolour of the base.
        </p>
        <p>
          A capability pack is how PRIZM serves a specialised product without fragmenting into
          separate design systems. It{" "}
          <strong className="font-medium text-fg">
            extends the C3 base rather than forking it
          </strong>
          : the same foundations, tokens, and component primitives carry through unchanged, and the
          pack adds only what is genuinely unique — a recognisable identity and a set of
          domain-specific organisms. Specialisation where the product needs it; one shared system
          everywhere else.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link
          href="/c3/rc3"
          className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-bg-subtle"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: RC3 }}
            />
            RC3
          </span>
          <h3 className="mt-4 text-xl font-semibold tracking-tight">Robotics &amp; Autonomy</h3>
          <p className="mt-2 text-sm text-fg-muted">
            One vocabulary for command and control across the full spectrum — single-platform teleop
            to swarm and mission-level intent. Signature organisms for safety, comms, autonomy,
            telemetry, fleet roster, and live 3D perception.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
            Explore the pack <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        <div className="rounded-lg border border-dashed border-border bg-bg-subtle p-6 opacity-90">
          <h3 className="text-xl font-semibold tracking-tight text-fg-muted">
            A pattern, not a one-off
          </h3>
          <p className="mt-2 text-sm text-fg-muted">
            RC3 is the first capability pack, not a special case. A single{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">data-pack</code>{" "}
            attribute switches a pack on, so the next specialised C3 product — counter-UAS, for
            instance — gets its own identity and organisms through the same mechanism.
          </p>
        </div>
      </div>
    </section>
  );
}

function ZoneCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-bg-subtle"
    >
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-bg-muted text-accent">
        {icon}
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-fg-muted">{description}</p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
        Explore <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
