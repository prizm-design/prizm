"use client";

import {
  ControllerInterface,
  type ControllerInterfaceProps,
} from "@/components/rc3/controller-interface";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const RC3 = "oklch(71% 0.195 32)";

type Fixture = ControllerInterfaceProps & { description: string };

const FIXTURES: Fixture[] = [
  {
    platform: "UGV-04",
    leftStick: { x: 0, y: 0 },
    leftStickLabel: "DRIVE",
    rightStick: { x: 0, y: 0 },
    rightStickLabel: "GIMBAL",
    leftTrigger: 0,
    leftTriggerLabel: "ZOOM−",
    rightTrigger: 0,
    rightTriggerLabel: "ZOOM+",
    buttons: [
      { id: "a", label: "A", binding: "HORN" },
      { id: "b", label: "B", binding: "REC" },
      { id: "x", label: "X", binding: "MARK" },
      { id: "y", label: "Y", binding: "RTL" },
    ],
    description:
      "Idle — sticks centred, no triggers, no buttons pressed. Operator's input is live but the operator is not driving.",
  },
  {
    platform: "UGV-04",
    leftStick: { x: 0.1, y: 0.78 },
    leftStickLabel: "DRIVE",
    rightStick: { x: -0.4, y: 0.25 },
    rightStickLabel: "GIMBAL",
    leftTrigger: 0,
    leftTriggerLabel: "ZOOM−",
    rightTrigger: 0.6,
    rightTriggerLabel: "ZOOM+",
    buttons: [
      { id: "a", label: "A", binding: "HORN" },
      { id: "b", label: "B", binding: "REC", pressed: true },
      { id: "x", label: "X", binding: "MARK" },
      { id: "y", label: "Y", binding: "RTL" },
    ],
    description:
      "Active — drive stick forward, gimbal panning, right trigger zooming, REC button pressed.",
  },
];

export default function ControllerInterfacePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Hero />
      <Anatomy />
      <Props />
      <Wiring />
      <Behaviour />
      <A11y />
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
          { label: "Controller interface" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Controller interface
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        Live operator input state — sticks, triggers, buttons. Read-only; the consumer wires input
        from their gamepad / WebSocket / physical controller pipeline. Useful for direct teleop
        confirmation, deadzone debugging, and binding reference.
      </p>
    </div>
  );
}

function Hero() {
  const [pulse, setPulse] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      setPulse((p) => (p + (now - last) / 1000) % 100);
      last = now;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const animated: ControllerInterfaceProps = {
    platform: "UGV-04",
    leftStick: {
      x: 0.1 * Math.sin(pulse * 0.6),
      y: 0.6 + 0.2 * Math.sin(pulse * 0.9),
    },
    leftStickLabel: "DRIVE",
    rightStick: {
      x: 0.5 * Math.sin(pulse * 0.4),
      y: 0.2 * Math.cos(pulse * 0.3),
    },
    rightStickLabel: "GIMBAL",
    leftTrigger: 0,
    leftTriggerLabel: "ZOOM−",
    rightTrigger: 0.5 + 0.4 * Math.sin(pulse * 1.1),
    rightTriggerLabel: "ZOOM+",
    buttons: [
      { id: "a", label: "A", binding: "HORN" },
      { id: "b", label: "B", binding: "REC", pressed: Math.sin(pulse * 0.5) > 0.6 },
      { id: "x", label: "X", binding: "MARK" },
      { id: "y", label: "Y", binding: "RTL" },
    ],
  };

  return (
    <section className="mt-16">
      <SectionLabel>Live</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Animated demo — sticks, trigger, and the REC button move as if the operator is driving.
        Below: two static fixtures showing idle and active states with binding labels.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg">
          <div className="grid gap-px" style={{ backgroundColor: "var(--prizm-color-border)" }}>
            <div className="flex flex-col gap-4 bg-bg p-6 md:p-8">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                Animated
              </span>
              <ControllerInterface {...animated} />
            </div>
            {FIXTURES.map((f, i) => {
              const { description: _d, ...controllerProps } = f;
              return (
                <div key={i} className="flex flex-col gap-4 bg-bg p-6 md:p-8">
                  <span className="text-sm text-fg-muted">{f.description}</span>
                  <ControllerInterface {...controllerProps} />
                </div>
              );
            })}
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
        Horizontal strip. Each section renders only when the consumer passes its data. The platform
        marker carries the Ember signature; operational controls stay neutral.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Part
          label="Platform marker"
          body="Optional leading cell — Ember dot + mono identifier. Drop when the controller sits next to a video tile that already names the source."
        />
        <Part
          label="Stick wells"
          body="Circular SVG wells with a faint dashed deadzone, a centre-to-position trace, and a neutral fg dot. Numerical X / Y values below for precise reading."
        />
        <Part
          label="Trigger bars"
          body="Thin vertical bars filling from the bottom. 0 to 1 value displayed below. Use for continuous-value inputs (zoom, fine throttle)."
        />
        <Part
          label="Button pills"
          body="Small mono pills with optional binding subtitle. Pressed state inverts the pill (bg-fg / text-bg) for high-contrast read-at-a-glance."
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
    name: "platform",
    type: "string",
    description:
      'Optional platform identifier — e.g. `"UGV-04"`. Renders as the leading Ember-dotted cell.',
  },
  {
    name: "leftStick",
    type: "StickState",
    description: "Left stick state. `{ x, y }` normalised to -1 / 1 per axis.",
  },
  {
    name: "leftStickLabel",
    type: "string",
    default: '"STICK L"',
    description: 'Label above the left stick well — e.g. `"DRIVE"`.',
  },
  {
    name: "rightStick",
    type: "StickState",
    description: "Right stick state.",
  },
  {
    name: "rightStickLabel",
    type: "string",
    default: '"STICK R"',
    description: 'Label above the right stick well — e.g. `"GIMBAL"`.',
  },
  {
    name: "leftTrigger",
    type: "number",
    description: "Left trigger value, 0 to 1.",
  },
  {
    name: "leftTriggerLabel",
    type: "string",
    default: '"TRIG L"',
    description: "Label above the left trigger bar.",
  },
  {
    name: "rightTrigger",
    type: "number",
    description: "Right trigger value, 0 to 1.",
  },
  {
    name: "rightTriggerLabel",
    type: "string",
    default: '"TRIG R"',
    description: "Label above the right trigger bar.",
  },
  {
    name: "buttons",
    type: "ControllerButton[]",
    description:
      "Button row. Each button has an `id`, a display `label`, optional `binding` subtitle, and live `pressed` state.",
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the root container.",
  },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "StickState",
    signature: `interface StickState {
  x: number;  // -1 (full left) to 1 (full right)
  y: number;  // -1 (full down) to 1 (full up)
}`,
    description:
      "Normalised stick position. Positive y is up by convention. Values outside [-1, 1] are clamped.",
  },
  {
    name: "ControllerButton",
    signature: `interface ControllerButton {
  id: string;        // stable identifier
  label: string;     // displayed (e.g. "A", "RB", "STOP")
  pressed?: boolean; // live press state — inverts the pill when true
  binding?: string;  // optional binding subtitle (e.g. "EMERGENCY STOP")
}`,
    description:
      "Per-button state. The consumer drives `pressed` from the input pipeline; `binding` is the operator-facing what-it-does label.",
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
        Read-only. The consumer reads the gamepad (or WebSocket from a physical controller) and
        pushes state in on each tick. RC3 does not own the input pipeline — same separation as video
        tile and telemetry HUD.
      </p>
      <div className="mt-6 space-y-3">
        <CodeBlock
          language="tsx"
          code={`// Wired to the browser Gamepad API
const pad = navigator.getGamepads()[0];

<ControllerInterface
  platform="UGV-04"
  leftStick={{ x: pad.axes[0], y: -pad.axes[1] }}
  leftStickLabel="DRIVE"
  rightStick={{ x: pad.axes[2], y: -pad.axes[3] }}
  rightStickLabel="GIMBAL"
  leftTrigger={pad.buttons[6].value}
  leftTriggerLabel="ZOOM−"
  rightTrigger={pad.buttons[7].value}
  rightTriggerLabel="ZOOM+"
  buttons={[
    { id: "a", label: "A", binding: "HORN", pressed: pad.buttons[0].pressed },
    { id: "b", label: "B", binding: "REC",  pressed: pad.buttons[1].pressed },
    { id: "x", label: "X", binding: "MARK", pressed: pad.buttons[2].pressed },
    { id: "y", label: "Y", binding: "RTL",  pressed: pad.buttons[3].pressed },
  ]}
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
          When a stick or trigger goes unresponsive, omit its prop rather than holding the
          last-known value. A frozen stick reading masquerading as live input is the same failure
          shape as a stale video frame — operators act on signal that is no longer true.
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
      label: "Live region",
      body: 'The strip carries `role="status"` and `aria-live="polite"`. Screen readers announce input transitions without interrupting the operator.',
    },
    {
      label: "Labelled by platform",
      body: "The root `aria-label` is of the form `Controller input for {platform}` when present, otherwise just `Controller input`.",
    },
    {
      label: "Button pills",
      body: 'Each button carries `role="status"` and an `aria-label` of the form `{label} — {binding}, {pressed | released}` so screen readers announce both the binding and the live state.',
    },
    {
      label: "Decorative visuals",
      body: "Stick well graphics and trigger bar fills are `aria-hidden`. Labels and numerical values carry the meaning.",
    },
    {
      label: "Colour and meaning",
      body: "Pressed state uses contrast inversion, not colour alone — a button reads as pressed because it flips bg / fg, not because it changes hue.",
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
        Use whenever the operator is in direct teleop and benefits from seeing what their input is
        doing — deadzone confirmation, binding reference, and as a safety check that the input
        pipeline is live. Pass the binding labels even when the operator is experienced; the labels
        rot less than memory under stress. Touch / virtual-joystick input — where the operator drags
        the stick on the screen rather than on physical hardware — is a separate concern and not in
        this organism's scope.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
