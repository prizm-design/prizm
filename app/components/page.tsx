import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORIES,
  type ComponentCategory,
  COMPONENTS,
  getComponentsByCategory,
} from "@/lib/components-registry";

export const metadata = {
  title: "Components",
  description: "Browse all PRIZM 4.0 components.",
};

export default function ComponentsIndexPage() {
  const grouped = getComponentsByCategory();
  const stable = COMPONENTS.filter((c) => c.status === "stable").length;
  const planned = COMPONENTS.filter((c) => c.status === "planned").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">Components</h1>
        <p className="mt-3 text-fg-muted">
          Shared component primitives used by both C3 and Enterprise products. Copy-paste any
          component into your project — the source files are yours to own and modify.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge variant="success">{stable} stable</Badge>
          <Badge variant="subtle">{planned} planned</Badge>
          <Badge variant="outline">{COMPONENTS.length} total</Badge>
        </div>
      </div>

      <div className="mt-12 space-y-12">
        {(Object.keys(CATEGORIES) as ComponentCategory[]).map((cat) => {
          const items = grouped[cat];
          if (!items.length) return null;
          return (
            <section key={cat}>
              <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
                <h2 className="text-xl font-semibold tracking-tight">{CATEGORIES[cat].label}</h2>
                <p className="text-sm text-fg-subtle">{CATEGORIES[cat].description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/components/${c.slug}`}
                    className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-bg-subtle"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium tracking-tight group-hover:text-accent">
                        {c.name}
                      </div>
                      {c.status === "stable" ? (
                        <Badge variant="success" className="shrink-0">
                          stable
                        </Badge>
                      ) : c.status === "alpha" ? (
                        <Badge variant="warning" className="shrink-0">
                          alpha
                        </Badge>
                      ) : (
                        <Badge variant="subtle" className="shrink-0">
                          planned
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-fg-muted">{c.description}</p>
                    {c.builtOn && (
                      <p className="mt-2 text-[11px] text-fg-subtle">Built on {c.builtOn}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
