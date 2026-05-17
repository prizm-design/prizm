import { ArrowRight, Compass, Droplet, Layers, Palette, Shapes, Type } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "Foundations" };

interface Foundation {
  title: string;
  href: string;
  icon: ReactNode;
  description: string;
  highlights: string[];
}

const FOUNDATIONS: Foundation[] = [
  {
    title: "Design principles",
    href: "/docs/principles",
    icon: <Compass className="h-5 w-5" />,
    description:
      "The human factors and HCI research that shapes PRIZM's patterns. Core principles, plus product-specific sets for C3 and Enterprise.",
    highlights: ["4 core principles", "5 C3-specific", "4 Enterprise-specific"],
  },
  {
    title: "Colors",
    href: "/docs/colors",
    icon: <Palette className="h-5 w-5" />,
    description:
      "Semantic tokens (bg, fg, accent, status) shown across all four theme variants, plus the baseline scales they map onto.",
    highlights: ["18 semantic tokens", "3 baseline scales", "4-variant swatches"],
  },
  {
    title: "Typography",
    href: "/docs/typography",
    icon: <Type className="h-5 w-5" />,
    description:
      "Font families (Inter, JetBrains Mono), the full type scale with live samples, and the weights used across PRIZM.",
    highlights: ["2 font families", "9-step type scale", "4 weights"],
  },
  {
    title: "Surface & motion",
    href: "/docs/surface-and-motion",
    icon: <Layers className="h-5 w-5" />,
    description:
      "Corner radii, shadow elevation tiers, and motion tokens (durations, ease curves). The physical-feeling values that make UI feel tactile.",
    highlights: ["5 radii", "3 shadows", "3 durations + 2 eases"],
  },
  {
    title: "Icons",
    href: "/docs/icons",
    icon: <Shapes className="h-5 w-5" />,
    description:
      "lucide-react at PRIZM's site-wide 1.5 stroke-width. Size scale, text-pairing rules, accessibility, and a catalog of the icons used across the system.",
    highlights: ["1.5 stroke-width", "5 standard sizes", "~30 catalog icons"],
  },
  {
    title: "Liquid glass",
    href: "/docs/liquid-glass",
    icon: <Droplet className="h-5 w-5" />,
    description:
      "A C3-only surface treatment for floating panels over canvas content. Two tiers (chrome / panel), both light- and dark-mode variants.",
    highlights: ["C3-only", "Two tiers", "Light + dark"],
  },
];

export default function FoundationsPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Docs</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Foundations</h1>
      <p className="mt-3 text-lg text-fg-muted">
        The raw materials PRIZM is built from. Each foundation page is a reference — what the tokens
        are, what they look like, and when to use them.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {FOUNDATIONS.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-bg-subtle"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-bg-muted text-accent">
                {f.icon}
              </div>
              <h2 className="text-lg font-semibold text-fg">{f.title}</h2>
            </div>
            <p className="mt-3 text-sm text-fg-muted">{f.description}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {f.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-border bg-bg px-2 py-0.5 text-[11px] text-fg-muted"
                >
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
              Explore {f.title.toLowerCase()}
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-sm text-fg-muted">
        Need the architecture behind the tokens?{" "}
        <Link href="/docs/theming" className="text-accent hover:underline">
          Theming
        </Link>{" "}
        explains how the four-variant system is wired and how to activate a theme.
      </p>
    </article>
  );
}
