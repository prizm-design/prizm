"use client";

import {
  AutonomyModeSelector,
  type AutonomyRung,
  type AutonomyScope,
  DEFAULT_RUNGS,
} from "@/components/rc3/autonomy-mode-selector";
import { Rc3JavaFxSection } from "@/components/rc3/javafx-section";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

const RC3 = "oklch(71% 0.195 32)";

type ScopeFixture = {
  scope: AutonomyScope;
  platform: string;
  active: string;
};

const SCOPES: ScopeFixture[] = [
  { scope: "platform", platform: "UGV-04", active: "manual" },
  { scope: "group", platform: "ECHELON BRAVO · 3", active: "supervised" },
  { scope: "swarm", platform: "PERIMETER · 12", active: "delegated" },
  { scope: "mission", platform: "OP NIGHTOWL · 47", active: "autonomous" },
];

export default function AutonomyModeSelectorPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Hero />
      <ExpandedReference />
      <EmbeddedReference />
      <Anatomy />
      <Props />
      <Wiring />
      <Behaviour />
      <Taxonomy />
      <A11y />
      <Rc3JavaFxSection slug="autonomy-mode-selector" />
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
          { label: "Autonomy mode selector" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Autonomy mode selector
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        The LOA ladder for the active scope. The climb arms; the descent is immediate.
      </p>
    </div>
  );
}

function Hero() {
  const [active, setActive] = useState<Record<string, string>>(
    Object.fromEntries(SCOPES.map((s) => [s.scope, s.active])),
  );

  return (
    <section className="mt-16">
      <SectionLabel>Live · compact · framed</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Production posture in a framed surface. Single tactical row, active rung inline. Tap the
        chevron to disclose the full rail for a mode change. Climbing arms on first tap, commits on
        the second within three seconds; descent is immediate. Escape disarms.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl ring-1 ring-black/10">
        <div className="bg-bg">
          <div
            className="grid auto-rows-min gap-px md:grid-cols-2"
            style={{ backgroundColor: "var(--prizm-color-border)" }}
          >
            {SCOPES.map(({ scope, platform }) => (
              <div key={scope} className="flex items-start bg-bg p-6">
                <AutonomyModeSelector
                  scope={scope}
                  platform={platform}
                  rungs={DEFAULT_RUNGS}
                  activeKey={active[scope]}
                  framed
                  onTransition={(toKey) => setActive((prev) => ({ ...prev, [scope]: toKey }))}
                />
              </div>
            ))}
          </div>
        </div>
      </RC3Swatch>
    </section>
  );
}

function ExpandedReference() {
  const [active, setActive] = useState("supervised");

  return (
    <section className="mt-12">
      <SectionLabel>Expanded</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        The full rail, no disclosure. Use in training surfaces and review screens where the LOA
        hierarchy must remain visible.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl ring-1 ring-black/10">
        <div className="flex bg-bg p-8">
          <AutonomyModeSelector
            scope="platform"
            platform="UGV-04"
            rungs={DEFAULT_RUNGS}
            activeKey={active}
            compact={false}
            framed
            onTransition={setActive}
          />
        </div>
      </RC3Swatch>
    </section>
  );
}

function EmbeddedReference() {
  const [active, setActive] = useState("supervised");

  return (
    <section className="mt-12">
      <SectionLabel>Embedded · unframed</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        The default posture. No bezel, no background fill — the control inherits the host
        surface&rsquo;s chrome. Armed state surfaces in the rung label and the rail&rsquo;s ghost
        pointer, not in the frame.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl ring-1 ring-black/10">
        <div className="bg-bg p-8">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
              Operator console &middot; autonomy zone
            </div>
            <div className="mt-4">
              <AutonomyModeSelector
                scope="platform"
                platform="UGV-04"
                rungs={DEFAULT_RUNGS}
                activeKey={active}
                onTransition={setActive}
              />
            </div>
          </div>
        </div>
      </RC3Swatch>
    </section>
  );
}

function Anatomy() {
  return (
    <section className="mt-20">
      <SectionLabel>Anatomy</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Header carries the scope and platform. The active rung — or the full rail when disclosed —
        sits below. Chevron pointer marks the active position.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Part
          label="Header"
          body="AUTONOMY label, scope + platform breadcrumb, and the disclosure chevron in compact mode."
        />
        <Part
          label="Active row"
          body="In compact-collapsed posture, the active rung is the only one shown. Three-tier mono — index, label, authority."
        />
        <Part
          label="Chevron pointer"
          body="Filled Ember needle on the active rung. Inactive rungs read as hairline scale ticks."
        />
        <Part
          label="Armed state"
          body="The destination rung's label swaps to CONFIRM in Ember and a ghost chevron pulses on the rail. In framed mode the bezel goes Ember too."
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
    name: "scope",
    type: "AutonomyScope",
    description:
      "Command-context scope the ladder applies to. See [Command contexts](/c3/rc3/concepts/command-contexts) for the type definition.",
  },
  {
    name: "platform",
    type: "string",
    description: "Optional context label rendered in the header.",
  },
  {
    name: "rungs",
    type: "AutonomyRung[]",
    description:
      "Caller-supplied LOA taxonomy, ordered lowest to highest authority-to-machine. Pass `DEFAULT_RUNGS` for the loop-position default ladder, or substitute your programme's taxonomy.",
  },
  {
    name: "activeKey",
    type: "string",
    description: "The `key` of the currently active rung.",
  },
  {
    name: "onTransition",
    type: "(toKey: string) => void",
    description:
      "Fires when a transition commits. The consent gesture is internal — by the time your handler runs, the operator has confirmed (or descended, which is always immediate).",
  },
  {
    name: "consent",
    type: "boolean",
    default: "true",
    description:
      "Require an armed second gesture to commit a climb toward more machine authority. Descending toward the operator always bypasses this.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable all controls. Use only when no platform is live.",
  },
  {
    name: "compact",
    type: "boolean",
    default: "true",
    description:
      "Production glance state — single tactical row with the active rung inline. A chevron discloses the full rail. Set false for docs / training surfaces.",
  },
  {
    name: "framed",
    type: "boolean",
    default: "false",
    description:
      "Standalone-instrument chrome: hairline bezel + surface fill. Default embed-friendly; inherits the host surface's chrome. Set true for docs heroes, modal / popover deployments, or any context where the control is the dominant visual.",
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the root container.",
  },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "AutonomyRung",
    signature: `interface AutonomyRung {
  key: string;        // stable identifier, e.g. "supervised"
  index: string;      // rail label, e.g. "L1"
  label: string;      // display label, rendered in caps, e.g. "SUPERVISED"
  authority: string;  // loop-position, e.g. "OP-IN-LOOP" or "SYSTEM AI"
  blurb?: string;     // optional one-line meaning
}`,
    description:
      "One rung of an autonomy ladder. The taxonomy is caller-supplied — there is no settled industry LOA vocabulary, so RC3 stays neutral on it.",
  },
  {
    name: "DEFAULT_RUNGS",
    signature: `// Task-agnostic default ladder. Loop-position language; replace with your taxonomy.
const DEFAULT_RUNGS: AutonomyRung[] = [
  { key: "manual",      index: "L0", label: "MANUAL",      authority: "OPERATOR",    blurb: "Operator commands and acts." },
  { key: "supervised",  index: "L1", label: "SUPERVISED",  authority: "OP-IN-LOOP",  blurb: "System acts; operator monitors every step and can take over instantly." },
  { key: "delegated",   index: "L2", label: "DELEGATED",   authority: "OP-ON-LOOP",  blurb: "System acts and decides routine steps; operator approves key decisions." },
  { key: "autonomous",  index: "L3", label: "AUTONOMOUS",  authority: "SYSTEM AI",   blurb: "System AI acts within mission intent; operator out of the loop." },
];`,
    description:
      "Re-exported from the component module so consumers can adopt the default or use it as a starting point. Pass your own array when your programme uses a different LOA model.",
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
        Wire <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">onTransition</code>{" "}
        to your backend's mode-change endpoint. The consent gesture is internal; your handler only
        sees committed transitions.
      </p>
      <div className="mt-6">
        <CodeBlock
          language="tsx"
          code={`<AutonomyModeSelector
  scope="platform"
  platform="UGV-04"
  rungs={DEFAULT_RUNGS}
  activeKey={currentRung}
  onTransition={(toKey) => {
    // commit the transition to your backend.
    // the consent gesture has already passed by the time you see this.
    autonomyAPI.requestMode(toKey);
  }}
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
          Invariant Four
        </div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">Deliberate transitions</h3>
        <p className="mt-2 max-w-3xl text-sm text-fg-muted">
          Authority does not change by accident. Climbing toward more machine authority is an armed,
          two-tap commit. Descent is immediate, so the safety escape is never gated.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          Read invariant
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </section>
  );
}

function Taxonomy() {
  return (
    <section className="mt-20">
      <SectionLabel>Taxonomy is caller-supplied</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        No settled LOA vocabulary exists — Sheridan, NASA LACES, and the service formulations all
        differ. Rungs are a prop. The default ladder describes loop position, not driving; swap it
        for the taxonomy your programme uses.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-subtle">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-muted">
                Index
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-muted">
                Label
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-muted">
                Authority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-muted">
                Meaning
              </th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_RUNGS.map((r: AutonomyRung) => (
              <tr key={r.key} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-fg">{r.index}</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-fg">
                  {r.label}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-fg-muted">{r.authority}</td>
                <td className="px-4 py-3 text-fg-muted">{r.blurb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function A11y() {
  const rows: { label: string; body: string }[] = [
    {
      label: "Radiogroup",
      body: 'The rail is a `role="radiogroup"` named by scope. Each rung is a `role="radio"` with `aria-checked` reflecting the active mode.',
    },
    {
      label: "Disclosure",
      body: "The compact chevron is a button with `aria-expanded` and `aria-controls` pointing at the rail. It does not commit a mode change.",
    },
    {
      label: "Armed state",
      body: 'An arming rung updates its `aria-label` to "Confirm transition to <label>" so screen readers announce that a second gesture is required.',
    },
    {
      label: "Keyboard",
      body: "Enter or Space selects. Escape disarms. The active rung is disabled — there is no transition to itself.",
    },
    {
      label: "Colour and meaning",
      body: "The Ember pointer is never the only signal — the index, label, and authority line carry the meaning for operators with colour-vision differences.",
    },
    {
      label: "Disabled",
      body: "The `disabled` prop dims the control and blocks every transition. Use only when no platform is live — never to mask an error.",
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
        Default to compact in production — operators glance the active rung; the ladder discloses
        only when a mode change is in hand. Leave the control unframed when it sits inside a host
        surface that already carries chrome. Use the framed posture only when the control is
        floating or dominant — modal overlays, popovers, single-panel dashboards. Mark only the
        active rung with Ember. Never let the climb commit on a single tap; never gate the descent.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
