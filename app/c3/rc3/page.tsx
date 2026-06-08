import { PerceptionViewDemo } from "@/components/rc3/perception-view-demo";
import { RC3Swatch } from "@/components/rc3/swatch";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Hero } from "./hero";

export const metadata = { title: "RC3 — Robotics & Autonomy" };

// RC3 signature hue — pack identity, theme-independent.
const RC3 = "oklch(71% 0.195 32)";

export default function RC3LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Hero />
      <Routes />
      <Spotlight />
      <Activation />
    </div>
  );
}

function Spotlight() {
  return (
    <section className="mt-16 md:mt-20">
      <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            Spotlight
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            A live window into what the swarm sees.
          </h2>
          <p className="mt-4 text-fg-muted">
            Perception view is RC3&rsquo;s live 3D canvas &mdash; the consolidated picture a robot
            swarm builds of its surroundings, with areas of interest, layer toggles, and per-source
            freshness so a held frame never reads as live.
          </p>
          <p className="mt-4 text-fg-muted">
            RC3 frames the surface and ships a dependency-free reference renderer; a host map or
            vendor engine can take over the 3D through a render delegate.
          </p>
          <Link
            href="/c3/rc3/components/perception-view"
            className="mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Open the component
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <RC3Swatch className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/10">
          <div className="bg-bg p-3 md:p-4">
            <div className="overflow-hidden rounded-md border border-border">
              <PerceptionViewDemo />
            </div>
          </div>
        </RC3Swatch>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Robotics &amp; Autonomy
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        A capability pack for command and control. One vocabulary across the full spectrum — from
        single-platform teleop to mission-level intent.
      </p>
    </div>
  );
}

function Activation() {
  return (
    <section className="mt-16 md:mt-20">
      <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            Activation
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            One attribute, two CSS imports.
          </h2>
          <p className="mt-4 text-fg-muted">
            RC3 layers on top of C3 without forking. Set{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
              data-pack="rc3"
            </code>{" "}
            on the surface that wraps the RC3 application, import the two RC3 token files alongside
            your C3 ones, and the accent semantic tokens flip to Ember. Surfaces, typography, radii,
            shadows all inherit from C3 unchanged.
          </p>
          <p className="mt-4 text-fg-muted">
            RC3 is consumed the same way the rest of PRIZM is: copy the organism source files into
            your project, build with React. Host it however your environment requires — a Next.js
            app, a Vite app, embedded inside an existing system through whatever bridge your host
            supports.
          </p>
        </div>
        <div className="space-y-3">
          <CodeBlock
            language="css"
            code={`/* in your global CSS */
@import "@prizm/tokens/c3-light.css";
@import "@prizm/tokens/c3-dark.css";
@import "@prizm/tokens/rc3-light.css";
@import "@prizm/tokens/rc3-dark.css";`}
          />
          <CodeBlock
            language="tsx"
            code={`<div data-zone="c3" data-mode="dark" data-pack="rc3">
  <YourRC3Surface />
</div>`}
          />
        </div>
      </div>
    </section>
  );
}

function Routes() {
  return (
    <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <RouteCard
        title="Identity"
        body="The signature colour, schematic iconography, and the identity rule that carries RC3 into any host."
        href="/c3/rc3/identity"
      />
      <RouteCard
        title="Concepts"
        body="Command contexts, behavioural invariants, and the surface regions that templates compose from."
        href="/c3/rc3/concepts"
      />
      <RouteCard
        title="Components"
        body="Autonomy mode, comms and health, safety actions, telemetry HUD — the organisms RC3 adds to C3."
        href="/c3/rc3/components"
      />
      <RouteCard
        title="Templates"
        body="Operator console and the anchor arrangements that compose RC3 organisms into a working surface."
        href="/c3/rc3/templates"
      />
    </div>
  );
}

function RouteCard({
  title,
  body,
  href,
  unbuilt = false,
}: {
  title: string;
  body: string;
  href: string;
  unbuilt?: boolean;
}) {
  if (unbuilt) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-bg-subtle p-6 opacity-80">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-fg-muted">{body}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-fg-subtle">
          In design
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-bg-subtle"
    >
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-fg-muted">{body}</p>
      <div
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
        style={{ color: "var(--prizm-color-accent)" }}
      >
        Open
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
