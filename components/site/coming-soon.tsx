import { Clock } from "lucide-react";

export function ComingSoon({
  kicker,
  title,
  description,
  phase,
  examples,
}: {
  kicker: string;
  title: string;
  description: string;
  phase: string;
  examples: string[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-xs font-medium uppercase tracking-widest text-accent">{kicker}</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{description}</p>

      <div className="mt-10 rounded-lg border border-dashed border-border bg-bg-subtle p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-fg-muted">
          <Clock className="h-3 w-3" />
          {phase}
        </div>
        <h2 className="mt-4 text-lg font-semibold">What this section will contain</h2>
        <ul className="mt-3 space-y-2 text-sm text-fg-muted">
          {examples.map((example) => (
            <li key={example} className="flex gap-2">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
