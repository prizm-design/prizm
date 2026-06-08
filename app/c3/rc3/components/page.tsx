import { Breadcrumbs } from "@/components/site/breadcrumbs";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Box,
  Crosshair,
  Gamepad2,
  Gauge,
  Info,
  ListOrdered,
  Milestone,
  Radio,
  Repeat2,
  ShieldAlert,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

export const metadata = { title: "RC3 — Components" };

const RC3 = "oklch(71% 0.195 32)";

type Organism = {
  index: string;
  name: string;
  role: string;
  body: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
  unbuilt?: boolean;
};

// Built organisms first, then "In design" placeholders — each group in its own
// order. Keeps usable components above the fold and clusters the dashed cards at
// the end rather than interleaving them through the grid.
const ORGANISMS: Organism[] = [
  {
    index: "One",
    name: "Safety actions",
    role: "Stop, recall, abort",
    body: "The primary safety affordance for the active scope. One tap to reach, a deliberate second tap to fire. Honours invariants 1 and 4.",
    href: "/c3/rc3/components/safety-actions",
    Icon: ShieldAlert,
  },
  {
    index: "Two",
    name: "Comms / health strip",
    role: "What the link is doing",
    body: "Persistent strip carrying link state, signal strength, and platform health for every connected platform. Honours invariant 2.",
    href: "/c3/rc3/components/comms-health-strip",
    Icon: Radio,
  },
  {
    index: "Three",
    name: "Autonomy mode selector",
    role: "Who is driving",
    body: "The level-of-autonomy ladder and the consent gestures that gate transitions across it. Honours invariant 4.",
    href: "/c3/rc3/components/autonomy-mode-selector",
    Icon: Bot,
  },
  {
    index: "Four",
    name: "Video tile",
    role: "Live sensor feeds",
    body: "Frame for a single video / sensor feed — FPV camera, gimbal, IR, EO. RC3 ships the surface; the consumer plugs the stream player into the children slot. Honours invariant 5.",
    href: "/c3/rc3/components/video-tile",
    Icon: Video,
  },
  {
    index: "Five",
    name: "Telemetry HUD",
    role: "What the platform is doing",
    body: "Compact strip of operational telemetry — speed, altitude, heading, battery, attitude. Overlays a video tile or sits as its own thin panel. Honours invariant 5.",
    href: "/c3/rc3/components/telemetry-hud",
    Icon: Gauge,
  },
  {
    index: "Six",
    name: "Controller interface",
    role: "Operator input state",
    body: "Live operator input state — sticks, triggers, buttons. Read-only; the consumer wires input from their gamepad / WebSocket / physical controller pipeline. Honours invariant 5.",
    href: "/c3/rc3/components/controller-interface",
    Icon: Gamepad2,
  },
  {
    index: "Seven",
    name: "Platform roster",
    role: "Quick-glance fleet status",
    body: "Vertical list of platforms with link, autonomy mode, and battery summary per row. The active platform is Ember-marked — unmistakable. Honours invariant 3.",
    href: "/c3/rc3/components/platform-roster",
    Icon: Users,
  },
  {
    index: "Eight",
    name: "Platform detail",
    role: "Deep state of one platform",
    body: "Master-detail companion to platform roster. Comms, telemetry, mission, operator, last-contact — vertical card with each section optional. Honours invariant 3.",
    href: "/c3/rc3/components/platform-detail",
    Icon: Info,
  },
  {
    index: "Nine",
    name: "Perception view",
    role: "What the swarm perceives",
    body: "Live 3D window into the mapped scene — point clouds, occupancy, structure, and areas of interest, with per-source freshness. RC3 ships a reference renderer; upstream does the fusion. Honours invariant 5.",
    href: "/c3/rc3/components/perception-view",
    Icon: Box,
  },
  {
    index: "Ten",
    name: "Waypoint list",
    role: "Route and mission steps",
    body: "Ordered waypoint editor with reorder, insert, and active-step affordances. Replaces the operator-console's stub active-waypoint card. In design.",
    href: "/c3/rc3/components/waypoint-list",
    Icon: ListOrdered,
    unbuilt: true,
  },
  {
    index: "Eleven",
    name: "Alerts panel",
    role: "Warnings and acknowledgements",
    body: "RC3-scoped warnings for autonomy, safety, link, and platform events. Distinct from the C3 App Shell's chrome-level Notification Centre. In design.",
    href: "/c3/rc3/components/alerts-panel",
    Icon: AlertTriangle,
    unbuilt: true,
  },
  {
    index: "Twelve",
    name: "Mission timeline",
    role: "Phases and objectives",
    body: "Sequence of mission phases with progress and active-step indicator. Fills the mission timeline surface region. In design.",
    href: "/c3/rc3/components/mission-timeline",
    Icon: Milestone,
    unbuilt: true,
  },
  {
    index: "Thirteen",
    name: "Hand-off / takeover",
    role: "Who is driving right now",
    body: "Shared-control affordance for multi-operator workflows. Indicates the active controller, requests takeover, surfaces transfer acknowledgements. In design.",
    href: "/c3/rc3/components/handoff",
    Icon: Repeat2,
    unbuilt: true,
  },
  {
    index: "Fourteen",
    name: "Gimbal aim",
    role: "Where the camera is pointing",
    body: "Spatial indicator of camera orientation relative to the platform — bearing, depression / elevation, field-of-view. Complements the video tile when the operator needs sensor cone awareness. In design.",
    href: "/c3/rc3/components/gimbal-aim",
    Icon: Crosshair,
    unbuilt: true,
  },
];

export default function RC3ComponentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Organisms />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs items={[{ label: "RC3", href: "/c3/rc3" }, { label: "Components" }]} />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">Components</h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        Signature organisms that carry the RC3 vocabulary. Each documents anatomy, scope variants,
        states, behavioural rules, and accessibility.
      </p>
    </div>
  );
}

function Organisms() {
  return (
    <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {ORGANISMS.map((o) => (
        <OrganismCard key={o.name} organism={o} />
      ))}
    </div>
  );
}

function OrganismCard({ organism }: { organism: Organism }) {
  const { index, name, role, body, href, Icon, unbuilt } = organism;

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
        <div
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: "var(--prizm-color-bg-muted)" }}
        >
          <Icon className="h-5 w-5" />
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
