"use client";

import { useTheme } from "@/lib/theme-context";
import { OperatorConsole, type OperatorConsoleProps } from "./console";

/**
 * Docs-site wrapper around `OperatorConsole`. Reads the docs theme via `useTheme()` and passes
 * the resolved mode through, so the embed reacts to the docs site's light/dark toggle. The
 * underlying `OperatorConsole` defaults to `"dark"` when used without this wrapper — preserving
 * operator-canonical state for downstream copies.
 */
export function ThemedOperatorConsole(props: Omit<OperatorConsoleProps, "mode">) {
  const { mode } = useTheme();
  return <OperatorConsole {...props} mode={mode} />;
}
