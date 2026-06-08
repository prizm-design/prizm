import { Breadcrumbs } from "@/components/site/breadcrumbs";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Clock,
  List,
  Map as MapIcon,
  PanelRight,
  Radio,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

export const metadata = { title: "RC3 — Surface regions" };

const RC3 = "oklch(71% 0.195 32)";

type Region = {
  index: string;
  name: string;
  role: string;
  description: string;
  variant: string;
  Icon: ComponentType<{ className?: string }>;
  fill: { label: string; href?: string; note?: string };
};

const REGIONS: Region[] = [
  {
    index: "One",
    name: "Spatial canvas",
    role: "Where things are",
    description:
      "The map, 3D viewport, or sensor frame the operator is acting on. Carries platforms, geofences, waypoints, and overlays.",
    variant:
      "Map at command-post density; a single platform-mounted camera view at platform scope; a wider area-of-operation view at swarm scope.",
    Icon: MapIcon,
    fill: {
      label: "Perception view",
      href: "/c3/rc3/components/perception-view",
      note: "RC3 ships a reference renderer for the 3D scene; a host map or vendor engine can take the region via the render delegate.",
    },
  },
  {
    index: "Two",
    name: "Platform roster",
    role: "What is in scope",
    description:
      "Lists the platforms the operator is addressing. Selection, status, latency, and quick health are surfaced inline.",
    variant:
      "A single detailed row at platform scope; group rollups at group scope; aggregated population counts at swarm scope.",
    Icon: List,
    fill: { label: "Platform roster", href: "/c3/rc3/components/platform-roster" },
  },
  {
    index: "Three",
    name: "Telemetry",
    role: "What the platforms know",
    description:
      "Live data from the platforms in scope — speed, position, battery, mission-relevant sensors. Fresh values are clear; stale values are flagged.",
    variant:
      "Full instrument readout at platform scope; aggregated min/max/mean at group and swarm scope; objective-level metrics at mission scope.",
    Icon: Activity,
    fill: { label: "Telemetry HUD", href: "/c3/rc3/components/telemetry-hud" },
  },
  {
    index: "Four",
    name: "Autonomy state",
    role: "Who is driving",
    description:
      "The level of autonomy in effect and the surface for changing it. Includes the active mode, the available transitions, and the consent gestures that gate them.",
    variant:
      "Per-platform mode at platform scope; group-level intent at group and swarm scope; objective gates at mission scope.",
    Icon: Bot,
    fill: { label: "Autonomy mode selector", href: "/c3/rc3/components/autonomy-mode-selector" },
  },
  {
    index: "Five",
    name: "Comms / health strip",
    role: "What the link is doing",
    description:
      "Link state, signal strength, and platform health for every connected platform. Persistent — the operator never has to dig to confirm comms.",
    variant:
      "Per-link bars at platform scope; aggregated link health at group and swarm scope; mission-wide connectivity summary at mission scope.",
    Icon: Radio,
    fill: { label: "Comms / health strip", href: "/c3/rc3/components/comms-health-strip" },
  },
  {
    index: "Six",
    name: "Safety actions",
    role: "How to stop",
    description:
      "The primary safety affordance for the active scope. Always reachable in one tap; visually distinct from identity colour.",
    variant:
      "E-stop and override at platform scope; recall and halt at group and swarm scope; abort and pause at mission scope.",
    Icon: ShieldAlert,
    fill: { label: "Safety actions", href: "/c3/rc3/components/safety-actions" },
  },
  {
    index: "Seven",
    name: "Mission timeline",
    role: "What happens when",
    description:
      "Sequenced phases, waypoints, or objectives across time. Past, current, and upcoming states are visible together.",
    variant:
      "Sortie or patrol timeline at platform and group scope; phase ladder at mission scope; absent at swarm scope where intent replaces sequence.",
    Icon: Clock,
    fill: { label: "Mission timeline", note: "In design" },
  },
  {
    index: "Eight",
    name: "Detail panel",
    role: "What the operator opened",
    description:
      "Inspector for whatever object is selected — a platform, a waypoint, a contact, an incident. Holds the deep view that the canvas summarises.",
    variant:
      "Platform readout at platform scope; group dossier at group scope; swarm rule editor at swarm scope; objective brief at mission scope.",
    Icon: PanelRight,
    fill: { label: "Platform detail", href: "/c3/rc3/components/platform-detail" },
  },
];

export default function RC3SurfaceRegionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Regions />
      <Compose />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[
          { label: "RC3", href: "/c3/rc3" },
          { label: "Concepts", href: "/c3/rc3/concepts" },
          { label: "Surface regions" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Concepts
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Surface regions
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        A shared dictionary of regions, each filled by an RC3 organism. Templates compose freely
        from these regions — they are not pinned to a canonical arrangement.
      </p>
    </div>
  );
}

function Regions() {
  return (
    <section className="mt-16">
      <SectionLabel>Eight regions</SectionLabel>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {REGIONS.map((r) => (
          <RegionCard key={r.name} region={r} />
        ))}
      </div>
    </section>
  );
}

function RegionCard({ region }: { region: Region }) {
  const { index, name, role, description, variant, Icon, fill } = region;
  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
            {index}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{name}</h2>
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

      <p className="mt-5 text-sm leading-relaxed text-fg">{description}</p>

      <div className="mt-5 rounded-md border border-border bg-bg-subtle p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
          Across scope
        </div>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{variant}</p>
      </div>

      <FilledBy fill={fill} />
    </article>
  );
}

function FilledBy({ fill }: { fill: Region["fill"] }) {
  const { label, href, note } = fill;
  return (
    <div className="mt-4 flex items-baseline gap-2 text-sm">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
        Filled by
      </span>
      {href ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 font-medium text-accent hover:underline"
        >
          {label}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ) : (
        <span className="font-medium text-fg">
          {label}
          {note ? <span className="ml-1 font-normal text-fg-muted">· {note}</span> : null}
        </span>
      )}
      {href && note ? <span className="text-fg-muted">· {note}</span> : null}
    </div>
  );
}

function Compose() {
  return (
    <section className="mt-16 rounded-xl border border-border bg-bg-subtle p-6 md:p-8">
      <SectionLabel>Composing from the dictionary</SectionLabel>
      <p className="mt-4 max-w-3xl text-fg">
        Templates pick the regions a surface needs and arrange them for the operator&rsquo;s task. A
        teleop console foregrounds the spatial canvas, autonomy state, and safety actions; a mission
        planner foregrounds the mission timeline and detail panel; a swarm console foregrounds the
        platform roster and comms strip. Same vocabulary, different emphases.
      </p>
      <p className="mt-4 max-w-3xl text-fg-muted">
        The regions do not imply position. A template chooses where each region sits, how large it
        is, and which variant it carries. The vocabulary anchors the operator&rsquo;s mental model
        so new templates feel familiar from the first surface.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
