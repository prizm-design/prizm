import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "RC3 — Templates" };

const RC3 = "oklch(71% 0.195 32)";

type Template = {
  index: string;
  name: string;
  role: string;
  body: string;
  href: string;
  unbuilt?: boolean;
};

const TEMPLATES: Template[] = [
  {
    index: "One",
    name: "Operator console",
    role: "Single-platform, one operator",
    body: "The anchor RC3 template. Composes the three signature organisms — autonomy mode selector, comms / health strip, safety actions — over a stylised tactical canvas. Demonstrates the data-pack activation contract.",
    href: "/c3/rc3/templates/operator-console",
  },
  {
    index: "Two",
    name: "Fleet overview",
    role: "Group / swarm command",
    body: "Second anchor template — swarm-scope command surface composing platform roster, aggregated comms, group autonomy, group safety, and an active-platform pane (video tile + telemetry HUD).",
    href: "/c3/rc3/templates/fleet-overview",
  },
  {
    index: "Three",
    name: "Mission planner",
    role: "Mission-level intent",
    body: "Pre-mission composition of objectives, geofences, and platform assignments. In design.",
    href: "/c3/rc3/templates/mission-planner",
    unbuilt: true,
  },
];

export default function RC3TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Templates />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs items={[{ label: "RC3", href: "/c3/rc3" }, { label: "Templates" }]} />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">Templates</h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        Anchor templates demonstrate one valid arrangement of the RC3 vocabulary per use case. They
        are examples, not canonical layouts — compose freely from the surface regions, honour the
        behavioural invariants, let the workflow set the geometry.
      </p>
    </div>
  );
}

function Templates() {
  return (
    <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {TEMPLATES.map((t) => (
        <TemplateCard key={t.name} template={t} />
      ))}
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const { index, name, role, body, href, unbuilt } = template;

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
            {index}
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{name}</h2>
          <p className="mt-1 text-sm font-medium" style={{ color: RC3 }}>
            {role}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-fg-muted">{body}</p>
    </>
  );

  if (unbuilt) {
    return (
      <div className="flex flex-col rounded-xl border border-dashed border-border bg-bg-subtle p-6 opacity-80">
        {content}
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          In design
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-bg-subtle"
    >
      {content}
      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Open
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
