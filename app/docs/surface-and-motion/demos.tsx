"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DurationDemo({
  duration,
}: {
  duration: { name: string; value: string; role: string };
}) {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setActive((a) => !a)}
      className="group relative w-full overflow-hidden rounded-lg border border-border bg-surface p-4 text-left"
    >
      <div className="relative h-12 rounded-md bg-bg-muted">
        <div
          className="absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-md bg-accent"
          style={{
            left: active ? "calc(100% - 2.5rem)" : "0.5rem",
            transitionProperty: "left",
            transitionDuration: `var(--prizm-duration-${duration.name})`,
            transitionTimingFunction: "var(--prizm-ease-out)",
          }}
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-fg">{duration.name}</span>
        <span className="font-mono text-[11px] text-fg-muted">{duration.value}</span>
      </div>
      <p className="mt-1 text-xs text-fg-muted">{duration.role}</p>
      <code className="mt-2 inline-block rounded bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
        --prizm-duration-{duration.name}
      </code>
    </button>
  );
}

export function EaseDemo({
  ease,
}: {
  ease: { name: string; value: string; role: string };
}) {
  const [active, setActive] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="relative h-14 rounded-md bg-bg-muted">
        <div
          className="absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-md bg-accent"
          style={{
            left: active ? "calc(100% - 3rem)" : "0.5rem",
            transitionProperty: "left",
            transitionDuration: "var(--prizm-duration-slow)",
            transitionTimingFunction: `var(--prizm-${ease.name})`,
          }}
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-fg">{ease.name}</span>
        <Button size="sm" variant="outline" onClick={() => setActive((a) => !a)}>
          Play
        </Button>
      </div>
      <p className="mt-1 text-xs text-fg-muted">{ease.role}</p>
      <code className="mt-2 inline-block break-all rounded bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
        {ease.value}
      </code>
    </div>
  );
}
