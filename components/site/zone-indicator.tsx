"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * A thin colored bar shown below the header on C3 and Enterprise pages
 * to make the active product context unambiguous.
 */
export function ZoneIndicator() {
  const pathname = usePathname();
  let zone: "c3" | "enterprise" | null = null;
  if (pathname?.startsWith("/c3")) zone = "c3";
  else if (pathname?.startsWith("/enterprise")) zone = "enterprise";

  if (!zone) return null;

  return (
    <div
      className={cn(
        "border-b border-border bg-bg-muted px-6 py-1.5",
        "text-[11px] font-medium uppercase tracking-wider text-fg-muted",
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            zone === "c3" ? "bg-[oklch(52.0%_0.105_223.13)]" : "bg-[oklch(54.6%_0.245_262.88)]",
          )}
        />
        Viewing {zone === "c3" ? "C3" : "Enterprise"} design language
      </span>
    </div>
  );
}
