"use client";

import { type Zone, useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { type ReactNode, useState } from "react";

type Variant = "c3" | "enterprise" | "compare";

/**
 * The standard preview frame used on every per-component page.
 *
 * - Tabs switch the preview between C3 and Enterprise zones.
 * - "Compare" expands to a 2x2 matrix showing all four theme variants.
 * - Theme toggle (light/dark) is global, handled by the site header.
 */
export function ComponentPreview({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { zone, setZone } = useTheme();
  const [view, setView] = useState<Variant>(zone);

  function setVariant(next: Variant) {
    setView(next);
    if (next !== "compare") setZone(next);
  }

  return (
    <div className={cn("rounded-lg border border-border bg-bg-subtle", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex gap-1 text-xs">
          {(["c3", "enterprise"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                view === v
                  ? "bg-bg-muted text-fg"
                  : "text-fg-subtle hover:bg-bg-muted hover:text-fg-muted",
              )}
            >
              {v === "c3" ? "C3" : "Enterprise"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setVariant(view === "compare" ? zone : "compare")}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            view === "compare"
              ? "bg-bg-muted text-fg"
              : "text-fg-subtle hover:bg-bg-muted hover:text-fg-muted",
          )}
        >
          {view === "compare" ? "Single view" : "Compare all variants"}
        </button>
      </div>

      {view === "compare" ? (
        <div className="grid grid-cols-1 md:grid-cols-2">
          <PreviewSwatch zone="c3" mode="light" label="C3 · Light">
            {children}
          </PreviewSwatch>
          <PreviewSwatch zone="c3" mode="dark" label="C3 · Dark">
            {children}
          </PreviewSwatch>
          <PreviewSwatch zone="enterprise" mode="light" label="Enterprise · Light">
            {children}
          </PreviewSwatch>
          <PreviewSwatch zone="enterprise" mode="dark" label="Enterprise · Dark">
            {children}
          </PreviewSwatch>
        </div>
      ) : (
        <div className="flex min-h-[200px] items-center justify-center p-10">{children}</div>
      )}
    </div>
  );
}

function PreviewSwatch({
  zone,
  mode,
  label,
  children,
}: {
  zone: Zone;
  mode: "light" | "dark";
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      data-zone={zone}
      data-mode={mode}
      className={cn(
        `swatch-${zone}-${mode}`,
        "flex flex-col border-border bg-bg",
        "[&:nth-child(odd)]:md:border-r [&:nth-child(-n+2)]:border-b",
      )}
    >
      <div className="border-b border-border bg-bg-subtle px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div className="flex flex-1 items-center justify-center p-8">{children}</div>
    </div>
  );
}
