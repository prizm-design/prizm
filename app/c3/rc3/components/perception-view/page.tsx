"use client";

import { Rc3JavaFxSection } from "@/components/rc3/javafx-section";
import { type PerceptionScene, PerceptionView } from "@/components/rc3/perception-view";
import { PerceptionViewDemo } from "@/components/rc3/perception-view-demo";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const RC3 = "oklch(71% 0.195 32)";

export default function PerceptionViewPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <LiveScene />
      <States />
      <Boundary />
      <Anatomy />
      <Props />
      <Wiring />
      <Behaviour />
      <A11y />
      <Rc3JavaFxSection slug="perception-view" />
      <Usage />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[
          { label: "RC3", href: "/c3/rc3" },
          { label: "Components", href: "/c3/rc3/components" },
          { label: "Perception view" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Perception view
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        The operator's live 3D window into what a robot swarm perceives — the mapped structure, the
        areas of interest within it, and how fresh each part of the picture is. RC3 frames the
        surface and ships a reference renderer; an upstream system does the fusion.
      </p>
    </div>
  );
}

function LiveScene() {
  return (
    <section className="mt-16">
      <SectionLabel>Live · replay</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        A small sample scene replaying in-browser — a real renderer drawing real geometry, not
        invented telemetry. A swarm of platforms feeds one consolidated map of a mid-rise building:
        its window grid is structure (a mesh), with point clouds and a voxel floor plan over it, and
        AOIs highlighting specific windows. Drag to orbit; toggle layers; select an area of
        interest. Watch platforms drop out on a rolling cycle — their points fade and their source
        flips to `STALE` rather than holding a crisp last frame.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg p-4 md:p-6">
          <div className="overflow-hidden rounded-md border border-border">
            <PerceptionViewDemo />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            Bundled sample · replay
          </p>
        </div>
      </RC3Swatch>
    </section>
  );
}

// A tiny static scene for the state tiles — a handful of points + AOIs, no animation.
function staticScene(aerialAge: number): PerceptionScene {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    pts.push([Math.cos(a) * 6, Math.sin(a) * 4, (i % 5) * 1.4]);
  }
  return {
    frame: "ENU",
    sources: [
      { id: "UGV-04", ageSeconds: 0.5 },
      { id: "UAV-09", ageSeconds: aerialAge },
    ],
    layers: [
      { kind: "points", id: "g", label: "Ground cloud", sourceId: "UGV-04", points: pts },
      {
        kind: "points",
        id: "a",
        label: "Aerial cloud",
        sourceId: "UAV-09",
        points: pts.map(([x, y, z]) => [x * 0.7, y * 0.7, z + 6]),
      },
    ],
    aois: [
      { id: "obj", label: "Entry A", kind: "objective", position: [-6, 0, 0], confidence: 0.9 },
      { id: "haz", label: "Hazard", kind: "hazard", position: [4, -2, 2], confidence: 0.7 },
    ],
  };
}

function States() {
  return (
    <section className="mt-16">
      <SectionLabel>Feed posture</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        The `status` prop governs the whole view. `live` draws normally. When the consolidated feed
        stops, `holding` dims the scene and raises a banner with the age of the last good frame — a
        held picture can never read as live. `lost` replaces the scene with an unmistakable overlay.
        This is invariant 5 applied to space.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div
          className="grid gap-px bg-bg md:grid-cols-3"
          style={{ backgroundColor: "var(--prizm-color-border)" }}
        >
          {(
            [
              ["live", "Live", "All sources fresh."],
              ["holding", "Holding", "Feed paused — last good frame, clearly held."],
              ["lost", "Feed lost", "Link down — no scene, no ambiguity."],
            ] as const
          ).map(([status, label, note]) => (
            <div key={status} className="flex flex-col gap-3 bg-bg p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
                  {label}
                </span>
              </div>
              <PerceptionView
                scene={staticScene(status === "live" ? 0.5 : 7)}
                status={status}
                bareChrome
              />
              <p className="text-xs text-fg-muted">{note}</p>
            </div>
          ))}
        </div>
      </RC3Swatch>
    </section>
  );
}

function Boundary() {
  return (
    <section className="mt-20">
      <SectionLabel>What RC3 owns — and what it doesn't</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Perception view is the trustworthy screen, not the map-builder. RC3 does not fuse, register,
        or run SLAM — it assumes an upstream system consolidates the swarm's sensors into one clean
        scene, the same way the Controller interface frames a physical gamepad. RC3 owns the input
        contract, the operator chrome, and a reference renderer; a vendor engine can take over the
        drawing through `renderDelegate` while keeping both.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-success">
            RC3 owns
          </div>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li>The input data contract — ROS 2 / Foxglove-shaped layers.</li>
            <li>Operator chrome — layer legend, AOI registry, per-source provenance, freshness.</li>
            <li>
              A dependency-free reference renderer: points, voxels, mesh, markers, live transforms.
            </li>
            <li>The AOI schema — the one piece RC3 defines natively.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
            Upstream / delegate owns
          </div>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li>Sensor fusion, registration, SLAM — the clean scene arrives ready to display.</li>
            <li>
              High-scale rendering — LOD, octree streaming, mesh reconstruction (via
              `renderDelegate`).
            </li>
            <li>glTF / GLB / 3D Tiles binary decoding — a delegate concern.</li>
            <li>The coordinate frame's truth — RC3 pins one and trusts the declared transforms.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Anatomy() {
  return (
    <section className="mt-20">
      <SectionLabel>Anatomy</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        A spatial canvas in the centre with chrome pinned to the edges. The geometry comes from the
        scene; the operator semantics come from the chrome.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Part
          label="Coordinate frame"
          body="The top-left chip names the canonical frame (ENU / NED / z-up / y-up). Sources declare their transform into it; mismatch is the number-one integration failure, so the frame is always on screen."
        />
        <Part
          label="Layer legend"
          body="Per-layer toggles with a kind swatch and element count. Points, occupancy voxels, and structural mesh switch independently — the operator declutters without losing the others."
        />
        <Part
          label="AOI registry"
          body="Areas of interest with kind tone (objective / hazard / inspect / marker) and confidence. Selecting one rings it in Ember in the canvas. The one schema RC3 defines natively."
        />
        <Part
          label="Source provenance"
          body="Every contributing platform, its identity colour, and its freshness — LIVE or STALE with age. The picture is never anonymous; the operator can see who saw what, when."
        />
        <Part
          label="Freshness decay"
          body="Geometry from a source that stops reporting fades and desaturates rather than vanishing or staying crisp. Stale data is visible as stale — invariant 5 applied to space."
        />
        <Part
          label="Holding / lost"
          body="When the consolidated feed pauses or drops, the whole view raises an unmistakable overlay with the age of the last good frame. A frozen scene can never pass for live."
        />
        <Part
          label="Reference renderer"
          body="A dependency-free canvas-2D projector: points, voxels, mesh wireframe, AOI markers, live per-source transforms. Lean by design — heavy rendering belongs to a delegate."
        />
        <Part
          label="Render delegate"
          body="An escape hatch: pass `renderDelegate` to plug a vendor 3D engine into the centre. RC3 keeps drawing the chrome around it, so the contract and operator semantics are unchanged."
        />
      </div>
    </section>
  );
}

function Part({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
        {label}
      </div>
      <p className="mt-2 text-sm text-fg">{body}</p>
    </div>
  );
}

const PROPS: { name: string; type: string; default?: string; description: string }[] = [
  {
    name: "scene",
    type: "PerceptionScene",
    description:
      "The consolidated scene from upstream — frame, sources, layers, and AOIs. RC3 displays it; it does not fuse or register.",
  },
  {
    name: "status",
    type: '"live" | "holding" | "lost"',
    default: '"live"',
    description:
      "Overall feed posture. `holding` dims the scene and raises a last-good-frame banner; `lost` replaces it with an overlay. Honours invariant 5.",
  },
  {
    name: "hiddenLayerIds",
    type: "string[]",
    description: "Controlled — layer ids the operator has toggled off. Pair with `onToggleLayer`.",
  },
  {
    name: "onToggleLayer",
    type: "(layerId: string) => void",
    description: "Fired when a legend entry is tapped. The consumer owns the hidden set.",
  },
  {
    name: "selectedAoiId",
    type: "string | null",
    default: "null",
    description:
      "Controlled — the focused AOI. The selected marker is ringed in Ember on the canvas.",
  },
  {
    name: "onSelectAoi",
    type: "(aoiId: string | null) => void",
    description: "Fired when an AOI is tapped. Passes `null` when the active AOI is tapped again.",
  },
  {
    name: "staleAfterSeconds",
    type: "number",
    default: "3",
    description:
      "Source age beyond which geometry visibly decays and provenance flips to STALE. Tune to the feed's expected cadence.",
  },
  {
    name: "autoRotate",
    type: "boolean",
    default: "false",
    description:
      "Slowly orbit the reference camera. Respects `prefers-reduced-motion` and pauses while the operator drags. Ignored when a delegate renders.",
  },
  {
    name: "renderDelegate",
    type: "(ctx: PerceptionRenderContext) => ReactNode",
    description:
      "Escape hatch — render the geometry with a vendor 3D engine instead of the built-in renderer. RC3 still draws the chrome.",
  },
  {
    name: "bareChrome",
    type: "boolean",
    default: "false",
    description:
      "Drop the layer legend, AOI registry, and provenance panels — e.g. for a compact tile.",
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the root container.",
  },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "PerceptionScene",
    signature: `interface PerceptionScene {
  frame: CoordinateFrame;          // "ENU" | "NED" | "z-up" | "y-up"
  sources: PerceptionSource[];
  layers: SceneLayer[];
  aois?: AreaOfInterest[];
}`,
    description: "The whole consolidated scene. The renderer auto-fits the camera to its bounds.",
  },
  {
    name: "SceneLayer",
    signature: `type SceneLayer = PointCloudLayer | OccupancyLayer | MeshLayer;
// points    → sensor_msgs/PointCloud2 · Foxglove PointCloud
// occupancy → nav_msgs/OccupancyGrid · OctoMap · Foxglove Grid
// mesh      → pre-tessellated glTF / 3D Tiles backdrop`,
    description:
      "The three geometry layers, each tagged with an optional `sourceId` so freshness can decay it independently.",
  },
  {
    name: "PerceptionSource",
    signature: `interface PerceptionSource {
  id: string;                      // "UGV-04"
  label?: string;
  ageSeconds: number;              // since last fresh geometry
  transform?: FrameTransform;      // into the scene frame
}`,
    description:
      "A contributing platform and how fresh its contribution is. `ageSeconds` drives decay and the holding state.",
  },
  {
    name: "AreaOfInterest",
    signature: `interface AreaOfInterest {
  id: string;
  label: string;
  kind: "objective" | "hazard" | "inspect" | "marker";
  position: Vec3;
  sourceId?: string;
  confidence?: number;             // 0–1
  ageSeconds?: number;
}`,
    description: "The operator-semantic schema RC3 defines natively. Layered over the geometry.",
  },
  {
    name: "FrameTransform",
    signature: `interface FrameTransform {
  translation: Vec3;               // metres, into the scene frame
  yaw?: number;                    // radians about the up axis
}`,
    description:
      "A source's pose in the canonical frame. The reference renderer honours translation + yaw; a delegate may use the full pose.",
  },
  {
    name: "PerceptionRenderContext",
    signature: `interface PerceptionRenderContext {
  scene: PerceptionScene;
  hiddenLayerIds: Set<string>;
  selectedAoiId: string | null;
  staleAfterSeconds: number;
  status: PerceptionStatus;
}`,
    description: "Handed to a `renderDelegate` so a vendor engine has everything the chrome knows.",
  },
];

function Props() {
  return (
    <section className="mt-20">
      <SectionLabel>Props</SectionLabel>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-bg-subtle text-[10px] uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Prop</th>
              <th className="px-3 py-2 text-left font-medium">Type</th>
              <th className="px-3 py-2 text-left font-medium">Default</th>
              <th className="px-3 py-2 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PROPS.map((p) => (
              <tr key={p.name} className="align-top">
                <td className="px-3 py-2 font-mono text-xs font-semibold text-fg">{p.name}</td>
                <td className="px-3 py-2 font-mono text-xs text-fg-muted">
                  <code className="break-words">{p.type}</code>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-fg-muted">
                  {p.default ?? <span className="text-fg-subtle">—</span>}
                </td>
                <td className="px-3 py-2 text-fg-muted">
                  <PropDescription text={p.description} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 text-xs font-medium uppercase tracking-wider text-fg-subtle">Types</h3>
      <div className="mt-3 space-y-4">
        {TYPES.map((t) => (
          <div key={t.name} className="rounded-md border border-border bg-surface p-4">
            <code className="font-mono text-sm font-semibold text-fg">{t.name}</code>
            <p className="mt-2 text-sm text-fg-muted">{t.description}</p>
            <div className="mt-3">
              <CodeBlock language="ts" code={t.signature} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Render markdown-style [label](href) links and `code` inline backticks in a prop description. */
function PropDescription({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
  let last = 0;
  let m = re.exec(text);
  while (m !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(
        <Link key={`${m.index}-link`} href={m[2]} className="text-accent hover:underline">
          {m[1]}
        </Link>,
      );
    } else if (m[3]) {
      parts.push(
        <code key={`${m.index}-code`} className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
          {m[3]}
        </code>,
      );
    }
    last = m.index + m[0].length;
    m = re.exec(text);
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Wiring() {
  return (
    <section className="mt-20">
      <SectionLabel>Wiring</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Subscribe to the upstream scene, hold the hidden-layer set and the selected AOI, and feed
        each source's age from its last update. When a source stops, let its age climb rather than
        freezing the picture; when the whole feed stops, raise `status`.
      </p>
      <div className="mt-6 space-y-3">
        <CodeBlock
          language="tsx"
          code={`// Live scene from an upstream perception subscription
<PerceptionView
  scene={{
    frame: "ENU",
    sources: feed.platforms.map((p) => ({
      id: p.id,
      ageSeconds: secondsSince(p.lastFrameAt),
      transform: { translation: p.position, yaw: p.yaw },
    })),
    layers: feed.layers,   // points / occupancy / mesh
    aois: feed.areasOfInterest,
  }}
  status={feed.connected ? "live" : "holding"}
  hiddenLayerIds={hidden}
  onToggleLayer={toggleLayer}
  selectedAoiId={selectedAoi}
  onSelectAoi={setSelectedAoi}
/>`}
        />
        <CodeBlock
          language="tsx"
          code={`// Hand the drawing to a vendor 3D engine, keep RC3's chrome
<PerceptionView
  scene={scene}
  renderDelegate={({ scene, hiddenLayerIds, selectedAoiId }) => (
    <YourEngine
      scene={scene}
      hidden={hiddenLayerIds}
      focus={selectedAoiId}
    />
  )}
/>`}
        />
      </div>
    </section>
  );
}

function Behaviour() {
  return (
    <section className="mt-20">
      <SectionLabel>Behavioural rule</SectionLabel>
      <Link
        href="/c3/rc3/concepts/behavioural-invariants"
        className="group mt-6 flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-bg-subtle"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
          Invariant Five
        </div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">
          Telemetry never silently stale
        </h3>
        <p className="mt-2 max-w-3xl text-sm text-fg-muted">
          Perception is telemetry with a shape. Geometry from a source that stops reporting fades
          rather than staying crisp; per-source freshness is always on screen; and a held or lost
          feed raises an unmistakable overlay. A frozen scene can never pass for a live one.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          Read invariant
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </section>
  );
}

function A11y() {
  const rows: { label: string; body: string }[] = [
    {
      label: "Figure role",
      body: 'The view carries `role="figure"` labelled by the coordinate-frame chip, so assistive tech announces a named spatial figure rather than a bare canvas.',
    },
    {
      label: "Operable chrome",
      body: "Layer toggles and AOI entries are real buttons with `aria-pressed` state — reachable, focusable, and operable without the canvas. The 3D canvas is a visual amplifier, not the only path.",
    },
    {
      label: "Freshness not colour-only",
      body: "Stale sources and AOIs carry literal `STALE {age}` / age text alongside the dimmed treatment. Degradation is legible without relying on the danger colour.",
    },
    {
      label: "Reduced motion",
      body: "`autoRotate` checks `prefers-reduced-motion` and does not animate the camera when the operator has asked the system to reduce motion.",
    },
    {
      label: "Held state is explicit",
      body: "Holding and lost states render text — `HOLDING · last good Ns ago`, `FEED LOST` — not just a colour wash, so the posture is unambiguous to every operator.",
    },
  ];

  return (
    <section className="mt-20">
      <SectionLabel>Accessibility</SectionLabel>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border first:border-t-0">
                <th
                  scope="row"
                  className="w-40 bg-bg-subtle px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-muted"
                >
                  {r.label}
                </th>
                <td className="px-4 py-3 text-fg-muted">{r.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Usage() {
  return (
    <section className="mt-20 rounded-xl border border-border bg-bg-subtle p-6 md:p-8">
      <SectionLabel>Usage</SectionLabel>
      <p className="mt-4 max-w-3xl text-fg">
        Reach for the Perception view when the operator needs to see — and command through — what
        the swarm perceives in space. Feed it a consolidated scene from upstream; do not expect RC3
        to fuse or register. Keep each source's `ageSeconds` honest so decay and the holding state
        work; raise `status` to `holding` or `lost` when the feed itself degrades. Start with the
        reference renderer; reach for `renderDelegate` only when scale demands a dedicated engine —
        and keep the chrome either way.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
