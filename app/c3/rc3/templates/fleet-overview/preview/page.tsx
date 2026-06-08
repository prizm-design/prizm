import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemedFleetOverview } from "../themed-console";

export const metadata = { title: "RC3 — Fleet overview preview" };

export default function FleetOverviewPreviewPage() {
  return (
    <div className="fixed inset-0 z-50">
      <ThemedFleetOverview />
      <Link
        href="/c3/rc3/templates/fleet-overview"
        className="absolute top-3 left-1/2 z-[60] inline-flex -translate-x-1/2 items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-fg shadow-lg transition-colors hover:bg-bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Exit preview
      </Link>
    </div>
  );
}
