import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { C3AppShell } from "../shell";

export const metadata = { title: "C3 App Shell — preview" };

/**
 * Standalone full-bleed preview of the C3 App Shell template.
 * Overlays the site chrome so the shell renders at true viewport scale.
 * An "Exit preview" button at the bottom-right returns to the docs page.
 */
export default function C3AppShellPreviewPage() {
  return (
    <div className="fixed inset-0 z-50">
      <C3AppShell defaultGlass />
      <Link
        href="/c3/templates/app-shell"
        className="absolute bottom-4 right-4 z-[60] inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm font-medium text-fg shadow-lg transition-colors hover:bg-bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Exit preview
      </Link>
    </div>
  );
}
