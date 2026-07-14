import { CodeBlock } from "@/components/site/code-block";
import { RC3_JAVAFX_API } from "@/lib/rc3-javafx-api";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * JavaFX section for an RC3 organism page (/c3/rc3/components/<slug>). Mirrors the
 * JavaFxSection on the global component pages: reads the RC3 JavaFX API spec and
 * renders class / usage / member table / notes. Renders nothing for organisms
 * without a JavaFX equivalent (e.g. perception-view), so it's safe to drop onto
 * every page.
 */
export function Rc3JavaFxSection({ slug }: { slug: string }) {
  const api = RC3_JAVAFX_API[slug];
  if (!api) return null;

  const usage = `import ${api.package}.${api.className};\n\n${api.constructors.join("\n")}`;

  return (
    <section className="mt-20">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">JavaFX</h2>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Ships in the{" "}
        <Link href="/c3/javafx" className="text-accent hover:underline">
          PRIZM JavaFX library
        </Link>{" "}
        for thick-client C3 apps as{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">{api.className}</code>{" "}
        (extends{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
          {api.base.split(".").pop()}
        </code>
        ). Run the gallery to see it natively.
      </p>
      <div className="mt-5">
        <CodeBlock code={usage} language="java" />
      </div>
      {api.members.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] text-xs">
            <thead className="bg-bg-subtle text-[10px] uppercase tracking-wider text-fg-subtle">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Member</th>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-left font-medium">Default</th>
                <th className="px-3 py-2 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {api.members.map((m) => (
                <tr key={m.name} className="align-top">
                  <td className="px-3 py-2 font-mono text-xs font-semibold text-fg">{m.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-fg-muted">
                    <code className="break-words">{m.type}</code>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-fg-muted">
                    {m.default ?? <span className="text-fg-subtle">&mdash;</span>}
                  </td>
                  <td className="px-3 py-2 text-fg-muted">
                    <InlineCode text={m.description} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {api.notes && <p className="mt-4 max-w-3xl text-sm text-fg-muted">{api.notes}</p>}
    </section>
  );
}

/** Render `inline-code` backticks in a member description. */
function InlineCode({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let buffer = "";
  let inCode = false;
  let key = 0;
  for (const ch of text) {
    if (ch === "`") {
      if (inCode) {
        parts.push(
          <code key={key++} className="rounded bg-bg-muted px-1 py-0.5 font-mono text-[11px]">
            {buffer}
          </code>,
        );
      } else if (buffer) {
        parts.push(buffer);
      }
      buffer = "";
      inCode = !inCode;
    } else {
      buffer += ch;
    }
  }
  if (buffer) parts.push(buffer);
  return <>{parts}</>;
}
