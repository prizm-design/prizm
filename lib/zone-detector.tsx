"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTheme, type Zone } from "./theme-context";

/**
 * Watches the route and syncs the active zone to the URL.
 * - /c3/...           → c3 zone
 * - /enterprise/...   → enterprise zone
 * - anywhere else     → user's last-selected zone (no change)
 */
export function ZoneRouteSync() {
  const pathname = usePathname();
  const { zone, setZone } = useTheme();

  useEffect(() => {
    let next: Zone | null = null;
    if (pathname?.startsWith("/c3")) next = "c3";
    else if (pathname?.startsWith("/enterprise")) next = "enterprise";
    if (next && next !== zone) setZone(next);
  }, [pathname, zone, setZone]);

  return null;
}
