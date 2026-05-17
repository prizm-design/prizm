import { ArrowRight, BarChart3, KeyRound, Layout, Settings } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Enterprise — Templates" };

interface Template {
  title: string;
  href: string;
  icon: ReactNode;
  description: string;
  status: "stable" | "planned";
  highlights?: string[];
}

const TEMPLATES: Template[] = [];

// Enterprise templates differ from C3 in tone — sidebar nav (vs icon rail),
// more whitespace, progressive disclosure, undo-over-confirm. Same chrome
// pattern though: a foundational app shell that the rest compose.
const PLANNED: Template[] = [
  {
    title: "Application shell",
    href: "/enterprise/templates",
    icon: <Layout className="h-5 w-5" />,
    description:
      "Top bar, sidebar nav, content area, optional inspector panel. The foundational chrome every Enterprise app sits inside — calmer rhythm than C3.",
    status: "planned",
  },
  {
    title: "Dashboard",
    href: "/enterprise/templates",
    icon: <BarChart3 className="h-5 w-5" />,
    description:
      "KPI row, chart grid, recent activity, summary cards. Read-first surface for executives and operators.",
    status: "planned",
  },
  {
    title: "Settings",
    href: "/enterprise/templates",
    icon: <Settings className="h-5 w-5" />,
    description:
      "Section list + content pane. Progressive disclosure for the rare options; common ones are surfaced by default.",
    status: "planned",
  },
  {
    title: "Auth flow",
    href: "/enterprise/templates",
    icon: <KeyRound className="h-5 w-5" />,
    description:
      "Sign in, sign up, forgot password, MFA — focused single-purpose screens with inline validation.",
    status: "planned",
  },
];

export default function EnterpriseTemplatesPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Enterprise</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Templates</h1>
      <p className="mt-3 text-lg text-fg-muted">
        Layout scaffolds for Enterprise products — application shells, dashboards, settings, auth.
        Each template anchors on the{" "}
        <Link href="/docs/principles" className="text-accent hover:underline">
          design principles
        </Link>{" "}
        and composes PRIZM primitives. Templates are starting points: copy, adapt, deploy.
      </p>

      {TEMPLATES.length > 0 && (
        <>
          <h2 className="mt-12 text-sm font-medium uppercase tracking-wider text-fg-subtle">
            Available
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {TEMPLATES.map((t) => (
              <Link
                key={t.title}
                href={t.href}
                className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-bg-subtle"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-bg-muted text-accent">
                    {t.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-fg">{t.title}</h3>
                </div>
                <p className="mt-3 text-sm text-fg-muted">{t.description}</p>
                {t.highlights && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {t.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full border border-border bg-bg px-2 py-0.5 text-[11px] text-fg-muted"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
                  View template
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-12 text-sm font-medium uppercase tracking-wider text-fg-subtle">
        Planned
      </h2>
      <p className="mt-3 text-sm text-fg-muted">
        Each composes the Enterprise application shell and fills the canvas with its own
        task-specific content.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {PLANNED.map((t) => (
          <div
            key={t.title}
            className="flex flex-col rounded-lg border border-dashed border-border bg-bg-subtle p-6 opacity-70"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-fg">{t.title}</h3>
              <Badge variant="subtle">planned</Badge>
            </div>
            <p className="mt-2 text-sm text-fg-muted">{t.description}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
