import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Layout,
  LayoutDashboard,
  MessageSquare,
  Network,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "C3 — Templates" };

interface Template {
  title: string;
  href: string;
  icon: ReactNode;
  description: string;
  status: "stable" | "planned";
  highlights?: string[];
}

const TEMPLATES: Template[] = [
  {
    title: "App Shell",
    href: "/c3/templates/app-shell",
    icon: <Layout className="h-5 w-5" />,
    description:
      "The foundational layout chrome every C3 application sits inside — top bar, status ticker, icon rail, main canvas, expandable side panel. Other C3 templates compose this shell.",
    status: "stable",
    highlights: ["Top bar + ticker", "6-app icon rail", "Expandable side panel"],
  },
];

// Each planned template corresponds to one of the apps in the App Shell's icon
// rail. They all share the same shell chrome and the same panel + expanded
// width pattern; what changes is the content inside the panel and (when
// expanded) the canvas.
const PLANNED: Template[] = [
  {
    title: "Dashboard",
    href: "/c3/templates",
    icon: <LayoutDashboard className="h-5 w-5" />,
    description:
      "Overview screen — KPI cards, summary charts, recent activity. Default landing surface inside the App Shell.",
    status: "planned",
  },
  {
    title: "Ops Log",
    href: "/c3/templates",
    icon: <ScrollText className="h-5 w-5" />,
    description:
      "Chronological event feed — filters, severity, timestamps. Reads like an aviation flight log for ops.",
    status: "planned",
  },
  {
    title: "Incidents",
    href: "/c3/templates",
    icon: <AlertTriangle className="h-5 w-5" />,
    description:
      "Incident management — severity, status, assignment, escalation flow. Master-detail inside the canvas.",
    status: "planned",
  },
  {
    title: "Tasks",
    href: "/c3/templates",
    icon: <ClipboardList className="h-5 w-5" />,
    description:
      "Task board with priority and status. Kanban or list view; supports assignment and resolution.",
    status: "planned",
  },
  {
    title: "ORBAT",
    href: "/c3/templates",
    icon: <Network className="h-5 w-5" />,
    description:
      "Order of battle — hierarchical org tree of units, sub-units, and personnel with composition status.",
    status: "planned",
  },
  {
    title: "Chat",
    href: "/c3/templates",
    icon: <MessageSquare className="h-5 w-5" />,
    description:
      "Multi-channel messaging — channels list, thread view, composer. Supports priority and group comms.",
    status: "planned",
  },
];

export default function C3TemplatesPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">C3</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Templates</h1>
      <p className="mt-3 text-lg text-fg-muted">
        Layout scaffolds for C3 products — operator stations, tactical dashboards, mission-control
        screens. Each template anchors on the{" "}
        <Link href="/docs/principles" className="text-accent hover:underline">
          design principles
        </Link>{" "}
        and composes PRIZM primitives. Templates are starting points: copy, adapt, deploy.
      </p>

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

      <h2 className="mt-16 text-sm font-medium uppercase tracking-wider text-fg-subtle">Planned</h2>
      <p className="mt-3 text-sm text-fg-muted">
        Each maps directly to an app in the App Shell's icon rail. All share the same chrome and the
        same panel-plus-expanded pattern — what changes is the content inside the panel and (when
        expanded) the canvas.
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
