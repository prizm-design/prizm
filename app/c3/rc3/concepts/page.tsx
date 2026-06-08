import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "RC3 — Concepts" };

const RC3 = "oklch(71% 0.195 32)";

export default function RC3ConceptsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <Concepts />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <Breadcrumbs items={[{ label: "RC3", href: "/c3/rc3" }, { label: "Concepts" }]} />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RC3 }} />
        RC3
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">Concepts</h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        How RC3 thinks about commanding, behaving, and composing. Three shaping rules that hold
        across every surface — independent of layout.
      </p>
    </div>
  );
}

function Concepts() {
  return (
    <div className="mt-16 grid gap-6 lg:grid-cols-3">
      <ConceptCard
        index="One"
        title="Command contexts"
        question="What are you commanding right now?"
        body="A spectrum from single-platform direct teleop to mission-level intent. Components are context-aware — the autonomy ladder, telemetry surface, and safety actions adapt to whether you are addressing a platform, a group, a swarm, or a mission."
        href="/c3/rc3/concepts/command-contexts"
      />
      <ConceptCard
        index="Two"
        title="Behavioural invariants"
        question="What must always be true on an RC3 surface?"
        body="Five rules. Safety reachable in one tap, comms always visible, active context unambiguous, no accidental mode-switch, telemetry never silently stale. Properties of every RC3 surface, not opt-in patterns."
        href="/c3/rc3/concepts/behavioural-invariants"
      />
      <ConceptCard
        index="Three"
        title="Surface regions"
        question="What is each region of the surface called, and what fills it?"
        body="A shared dictionary of regions — spatial canvas, platform roster, telemetry, autonomy state, comms / health strip, safety actions, mission timeline, detail panel — each linked to the organism that fills it. Templates compose from the dictionary, not from a canonical layout."
        href="/c3/rc3/concepts/surface-regions"
      />
    </div>
  );
}

function ConceptCard({
  index,
  title,
  question,
  body,
  href,
  unbuilt = false,
}: {
  index: string;
  title: string;
  question: string;
  body: string;
  href: string;
  unbuilt?: boolean;
}) {
  const content = (
    <>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">{index}</div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm font-medium" style={{ color: RC3 }}>
        {question}
      </p>
      <p className="mt-3 text-sm text-fg-muted">{body}</p>
    </>
  );

  if (unbuilt) {
    return (
      <div className="flex flex-col rounded-xl border border-dashed border-border bg-bg-subtle p-6 opacity-80">
        {content}
        <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
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
      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Open
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
