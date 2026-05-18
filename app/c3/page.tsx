import { ArrowRight, Layout, Target } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "C3" };

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
    </div>
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
