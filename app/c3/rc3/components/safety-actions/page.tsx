"use client";

import { Rc3JavaFxSection } from "@/components/rc3/javafx-section";
import {
  type SafetyActionKey,
  SafetyActions,
  type SafetyScope,
} from "@/components/rc3/safety-actions";
import { RC3Swatch } from "@/components/rc3/swatch";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CodeBlock } from "@/components/site/code-block";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

const RC3 = "oklch(71% 0.195 32)";

const SCOPES: { scope: SafetyScope; label: string; example: string }[] = [
  { scope: "platform", label: "Platform", example: "UGV-04" },
  { scope: "group", label: "Group", example: "ECHELON BRAVO · 3 PLATFORMS" },
  { scope: "swarm", label: "Swarm", example: "PERIMETER WATCH · 12 PLATFORMS" },
  { scope: "mission", label: "Mission", example: "OP NIGHTOWL · 47 PLATFORMS" },
];

export default function SafetyActionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Hero />
      <Anatomy />
      <Props />
      <Wiring />
      <Behaviour />
      <A11y />
      <Rc3JavaFxSection slug="safety-actions" />
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
          { label: "Safety actions" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Components
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        Safety actions
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        The primary safety affordance for the active scope. Always one tap away. The destructive
        action takes a deliberate second tap.
      </p>
    </div>
  );
}

function Hero() {
  const [last, setLast] = useState<{ scope: SafetyScope; key: SafetyActionKey } | null>(null);

  return (
    <section className="mt-16">
      <SectionLabel>Live</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Try it. The primary action arms on the first tap and fires on the second within three
        seconds. Press Escape or the cancel chip to disarm.
      </p>

      <RC3Swatch className="mt-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
        <div className="bg-bg">
          <div
            className="grid gap-px md:grid-cols-2 xl:grid-cols-4"
            style={{ backgroundColor: "var(--prizm-color-border)" }}
          >
            {SCOPES.map(({ scope, label, example }) => (
              <div key={scope} className="flex flex-col gap-5 bg-bg p-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                    {label}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: RC3 }}
                    />
                    <span className="font-mono text-xs font-semibold text-fg">{example}</span>
                  </div>
                </div>
                <div className="flex flex-1 items-end">
                  <SafetyActions scope={scope} onAction={(key) => setLast({ scope, key })} />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border bg-bg-subtle px-6 py-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
              Last fired:
            </span>{" "}
            <span className="font-mono text-xs text-fg">
              {last ? `${last.scope} → ${last.key}` : "—"}
            </span>
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
        Two affordances per scope: a secondary action (override / pause / suspend, scope-dependent)
        and a primary destructive action (e-stop / recall / abort). The primary action is the only
        one that arms on first tap.
      </p>

      <RC3Swatch className="mt-6 grid gap-6 lg:grid-cols-2">
        <AnatomyCard label="Default state">
          <SafetyActions scope="platform" />
        </AnatomyCard>
        <AnatomyCard
          label="Armed (after first tap)"
          hint="Click the primary button above to see this state live."
        >
          <SafetyActions scope="platform" />
        </AnatomyCard>
      </RC3Swatch>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Part label="Secondary action" body="Outlined, neutral. Single tap fires." />
        <Part
          label="Primary destructive"
          body="Filled with danger semantic. Never Ember — danger and identity are visually distinct."
        />
        <Part
          label="Armed state"
          body="Pulsing ring and label change to 'Confirm · X'. A second tap within 3s fires."
        />
        <Part label="Cancel chip" body="Floating dismiss. Esc also disarms." />
      </div>
    </section>
  );
}

function AnatomyCard({
  label,
  hint,
  children,
}: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-bg p-8">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
        {label}
      </div>
      <div className="mt-6 flex items-center justify-center py-6">{children}</div>
      {hint && <div className="mt-4 text-xs text-fg-subtle">{hint}</div>}
    </div>
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
    type: "SafetyScope",
    description:
      "Command-context scope. Selects which primary and secondary actions surface. See [Command contexts](/c3/rc3/concepts/command-contexts) for the type definition.",
  },
  {
    name: "onAction",
    type: "(key: SafetyActionKey) => void",
    description:
      "Fires when an action commits. The destructive primary only fires after the second tap; secondary actions fire on the first tap.",
  },
  {
    name: "confirm",
    type: "boolean",
    default: "true",
    description:
      "When true (default), the primary action requires a deliberate second tap within three seconds. Set false only for scripted demos.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
      "Disables both controls. Use only when no platform is live — never to mask an error.",
  },
  {
    name: "className",
    type: "string",
    description: "Forwarded to the root container.",
  },
];

const TYPES: { name: string; signature: string; description: string }[] = [
  {
    name: "SafetyActionKey",
    signature: `type SafetyActionKey =
  | "e-stop"
  | "override"
  | "recall-group"
  | "recall-swarm"
  | "abort"
  | "pause"
  | "suspend";`,
    description:
      "The discrete action that fired. Your onAction handler dispatches on these. Resolved per scope — platform → e-stop + override, group → recall-group + pause, swarm → recall-swarm + suspend, mission → abort + pause.",
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
        Wire <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">onAction</code> to
        your safety dispatcher. The consent gesture is internal — by the time your handler runs, the
        operator has confirmed.
      </p>
      <div className="mt-6">
        <CodeBlock
          language="tsx"
          code={`<SafetyActions
  scope="platform"
  disabled={!hasLivePlatform}
  onAction={(key) => {
    switch (key) {
      case "e-stop":   return safetyAPI.estop(platformId);
      case "override": return controlAPI.takeOver(platformId);
      // ... your dispatcher
    }
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
      <SectionLabel>Behavioural rules</SectionLabel>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <InvariantLink
          index="One"
          title="Safety in one tap"
          body="The primary action is always visible and always in the first interaction layer. It is never collapsed into an overflow menu, never hidden behind a mode."
          href="/c3/rc3/concepts/behavioural-invariants"
        />
        <InvariantLink
          index="Four"
          title="Deliberate transitions"
          body="The destructive action requires two deliberate taps within a 3-second window. The first arms, the second fires. Escape or the cancel chip disarm."
          href="/c3/rc3/concepts/behavioural-invariants"
        />
      </div>
    </section>
  );
}

function InvariantLink({
  index,
  title,
  body,
  href,
}: {
  index: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-bg-subtle"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
        Invariant {index}
      </div>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-fg-muted">{body}</p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Read invariant
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function A11y() {
  const rows: { label: string; body: string }[] = [
    {
      label: "Group role",
      body: 'Both buttons live inside a `role="group"` with an `aria-label` describing the scope (e.g. "Safety actions for platform").',
    },
    {
      label: "Armed state",
      body: 'The primary button toggles `aria-pressed` when armed. The `aria-label` updates to "Confirm <action>" so screen readers announce the confirmation step.',
    },
    {
      label: "Keyboard",
      body: "Enter or Space activates either button. Escape disarms the primary action while armed. Tab order: secondary → primary → cancel chip.",
    },
    {
      label: "Focus",
      body: "Both buttons carry visible focus rings using the accent ring colour. The danger ring is reserved for the armed state itself.",
    },
    {
      label: "Disabled",
      body: "The `disabled` prop sets `disabled` on both buttons and prevents the arm/fire flow. Use only when no platform is live — never to mask an error.",
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
        Place safety actions where they remain visible whenever a platform is live — typically the
        top-right of the operator panel or the bottom of a control rail. Never collapse them into an
        overflow menu, never re-order them between surfaces, and never use the Ember signature
        colour for the primary destructive action: danger semantic stays distinct from identity.
      </p>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
