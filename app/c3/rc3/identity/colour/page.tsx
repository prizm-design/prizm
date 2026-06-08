import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Check } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "RC3 — Colour reference" };

const RAMP = [
  { step: 50, oklch: "oklch(97% 0.024 32)" },
  { step: 100, oklch: "oklch(93% 0.060 32)" },
  { step: 200, oklch: "oklch(86% 0.118 32)" },
  { step: 300, oklch: "oklch(78% 0.165 32)" },
  { step: 400, oklch: "oklch(71% 0.195 32)" },
  { step: 500, oklch: "oklch(63% 0.200 32)" },
  { step: 600, oklch: "oklch(55% 0.180 31)" },
  { step: 700, oklch: "oklch(47% 0.150 30)" },
  { step: 800, oklch: "oklch(40% 0.120 29)" },
  { step: 900, oklch: "oklch(33% 0.092 28)" },
  { step: 950, oklch: "oklch(25% 0.065 27)" },
] as const;

const TOKENS = [
  {
    name: "--prizm-color-accent",
    mode: "dark",
    value: "var(--prizm-rc3-400)",
    swatch: "oklch(71% 0.195 32)",
  },
  {
    name: "--prizm-color-accent-hover",
    mode: "dark",
    value: "var(--prizm-rc3-300)",
    swatch: "oklch(78% 0.165 32)",
  },
  {
    name: "--prizm-color-accent-fg",
    mode: "dark",
    value: "var(--prizm-slate-950)",
    swatch: "oklch(12.9% 0.042 264.7)",
  },
  {
    name: "--prizm-color-accent",
    mode: "light",
    value: "var(--prizm-rc3-700)",
    swatch: "oklch(47% 0.150 30)",
  },
  {
    name: "--prizm-color-accent-hover",
    mode: "light",
    value: "var(--prizm-rc3-800)",
    swatch: "oklch(40% 0.120 29)",
  },
  {
    name: "--prizm-color-accent-fg",
    mode: "light",
    value: "oklch(100% 0 0)",
    swatch: "oklch(100% 0 0)",
  },
] as const;

const CONTRAST = [
  { mode: "dark", pair: "accent (rc3-400) on bg", ratio: 7.2 },
  { mode: "dark", pair: "accent (rc3-400) on surface", ratio: 5.29 },
  { mode: "dark", pair: "accent-fg (slate-950) on accent", ratio: 7.04 },
  { mode: "dark", pair: "accent-hover (rc3-300) on bg", ratio: 9.01 },
  { mode: "light", pair: "accent (rc3-700) on bg", ratio: 6.83 },
  { mode: "light", pair: "accent (rc3-700) on surface", ratio: 7.36 },
  { mode: "light", pair: "accent-fg (white) on accent", ratio: 7.36 },
  { mode: "light", pair: "accent-hover (rc3-800) on bg", ratio: 9.06 },
] as const;

const RC3 = "oklch(71% 0.195 32)";

export default function RC3ColourReferencePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <Header />
      <Ramp />
      <Tokens />
      <Activation />
      <Contrast />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "RC3", href: "/c3/rc3" },
          { label: "Identity", href: "/c3/rc3/identity" },
          { label: "Colour" },
        ]}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3 &middot; Colour
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">Ember</h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        RC3&rsquo;s signature colour. Red-orange at hue 32 in OKLCH. Ramp, token mapping,
        activation, and contrast receipts.
      </p>
    </div>
  );
}

function Ramp() {
  return (
    <section className="mt-16">
      <SectionLabel>Ramp</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Eleven steps in OKLCH. Mirrors{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">styles/tokens/rc3-light.css</code>{" "}
        and{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">styles/tokens/rc3-dark.css</code>.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-11">
          {RAMP.map((s) => (
            <div key={s.step} className="aspect-square" style={{ backgroundColor: s.oklch }} />
          ))}
        </div>
        <div className="grid grid-cols-11 border-t border-border bg-bg-subtle text-center text-[10px] text-fg-subtle">
          {RAMP.map((s) => (
            <span key={s.step} className="py-1.5 font-mono">
              {s.step}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-bg-subtle text-left text-xs font-medium uppercase tracking-wider text-fg-muted">
            <tr>
              <th className="px-4 py-2.5 w-12">&nbsp;</th>
              <th className="px-4 py-2.5">Step</th>
              <th className="px-4 py-2.5">OKLCH</th>
            </tr>
          </thead>
          <tbody>
            {RAMP.map((s) => (
              <tr key={s.step} className="border-t border-border">
                <td className="px-4 py-2">
                  <span
                    className="block h-5 w-5 rounded-sm border border-border"
                    style={{ backgroundColor: s.oklch }}
                  />
                </td>
                <td className="px-4 py-2 font-mono text-xs">--prizm-rc3-{s.step}</td>
                <td className="px-4 py-2 font-mono text-xs text-fg-muted">{s.oklch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Tokens() {
  return (
    <section className="mt-20">
      <SectionLabel>Token mapping</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        The override layer touches only the accent semantic tokens. Surface, fg, border, status, and
        glass tokens inherit from C3 verbatim.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TokenGroup title="Dark mode">
          {TOKENS.filter((t) => t.mode === "dark").map((t) => (
            <TokenRow key={`${t.mode}-${t.name}`} {...t} />
          ))}
        </TokenGroup>
        <TokenGroup title="Light mode">
          {TOKENS.filter((t) => t.mode === "light").map((t) => (
            <TokenRow key={`${t.mode}-${t.name}`} {...t} />
          ))}
        </TokenGroup>
      </div>
    </section>
  );
}

function Activation() {
  return (
    <section className="mt-20">
      <SectionLabel>Activation</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        RC3 surfaces opt in by setting{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">data-pack=&quot;rc3&quot;</code>{" "}
        on the scope element. Token files gate on the composed selector:
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-bg-subtle">
        <pre className="overflow-x-auto p-4 text-xs">
          <code>{`[data-zone="c3"][data-mode="dark"][data-pack="rc3"] { ... }
[data-zone="c3"][data-mode="light"][data-pack="rc3"] { ... }`}</code>
        </pre>
      </div>
      <p className="mt-4 max-w-3xl text-sm text-fg-muted">
        The App Shell sets the attribute when an RC3 app is active. The custom-element wrapper sets
        it on the shadow root when RC3 embeds in a legacy host.
      </p>
    </section>
  );
}

function Contrast() {
  return (
    <section className="mt-20">
      <SectionLabel>Contrast — WCAG AA</SectionLabel>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Computed with the same OKLCH→sRGB→WCAG path as{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 text-xs">scripts/audit-contrast.ts</code>.
        Eight accent pairings, all clearing AA with margin.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-bg-subtle text-left text-xs font-medium uppercase tracking-wider text-fg-muted">
            <tr>
              <th className="px-4 py-2.5">Mode</th>
              <th className="px-4 py-2.5">Pairing</th>
              <th className="px-4 py-2.5 text-right">Ratio</th>
              <th className="px-4 py-2.5 text-right">Target</th>
              <th className="px-4 py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST.map((p) => (
              <tr key={`${p.mode}-${p.pair}`} className="border-t border-border">
                <td className="px-4 py-2.5 text-fg-muted">{p.mode}</td>
                <td className="px-4 py-2.5">{p.pair}</td>
                <td className="px-4 py-2.5 text-right font-mono">{p.ratio.toFixed(2)}:1</td>
                <td className="px-4 py-2.5 text-right font-mono text-fg-muted">4.5:1</td>
                <td className="px-4 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                    <Check className="h-3.5 w-3.5" />
                    PASS
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TokenGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border bg-bg-subtle px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-fg-muted">
        {title}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function TokenRow({
  name,
  value,
  swatch,
}: {
  name: string;
  value: string;
  swatch: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span
        className="h-6 w-6 shrink-0 rounded-sm border border-border"
        style={{ backgroundColor: swatch }}
      />
      <div className="min-w-0 flex-1">
        <code className="block truncate text-[11px] font-medium text-fg">{name}</code>
        <code className="block truncate text-[11px] text-fg-muted">{value}</code>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{children}</h2>
  );
}
