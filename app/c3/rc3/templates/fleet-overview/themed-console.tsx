"use client";

import { useTheme } from "@/lib/theme-context";
import { FleetOverview, type FleetOverviewProps } from "./console";

/**
 * Docs-site wrapper around `FleetOverview`. Reads the docs theme via `useTheme()` and passes
 * the resolved mode through. See the operator-console twin for rationale.
 */
export function ThemedFleetOverview(props: Omit<FleetOverviewProps, "mode">) {
  const { mode } = useTheme();
  return <FleetOverview {...props} mode={mode} />;
}
