import { ArrowRight, FileText, Layout, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Enterprise" };

export default function EnterpriseLandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Websites & Applications
        </div>
        <h1 className="text-balance text-5xl font-semibold tracking-tight">
          PRIZM for Enterprise products
        </h1>
        <p className="mt-4 text-balance text-lg text-fg-muted">
          The Enterprise design language emphasizes calm, spacious, professional surfaces. Built for
          dashboards, forms, marketing pages, and customer-facing applications.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <ZoneCard
          icon={<Sparkles className="h-5 w-5" />}
          title="Overview"
          description="Design principles, when to use Enterprise, and how the aesthetic differs from C3."
          href="/enterprise/overview"
        />
        <ZoneCard
          icon={<Layout className="h-5 w-5" />}
          title="Templates"
          description="Layout scaffolds for marketing pages, application shells, dashboards, and settings."
          href="/enterprise/templates"
          badge="Coming in Phase 3"
        />
        <ZoneCard
          icon={<FileText className="h-5 w-5" />}
          title="Pages"
          description="Ready-to-use feature page designs for Enterprise product teams."
          href="/enterprise/pages"
          badge="Coming in Phase 3"
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
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
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
      {badge && (
        <span className="mt-3 inline-block rounded-full border border-border bg-bg px-2 py-0.5 text-[11px] text-fg-subtle">
          {badge}
        </span>
      )}
      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
        Explore <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
