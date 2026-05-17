import Link from "next/link";

export const metadata = { title: "Docs" };

const DOCS = [
  {
    href: "/docs/getting-started",
    title: "Getting started",
    description: "Install PRIZM and add your first component.",
  },
  {
    href: "/docs/installation",
    title: "Installation",
    description: "Detailed setup for new projects and migrations.",
  },
  {
    href: "/docs/theming",
    title: "Theming",
    description: "How the four-variant token system works.",
  },
  {
    href: "/docs/air-gap",
    title: "Air-gap setup",
    description: "Running PRIZM in disconnected environments.",
  },
];

export default function DocsIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Documentation</h1>
      <p className="mt-3 text-fg-muted">Set up PRIZM 4.0 and learn how the system fits together.</p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {DOCS.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-bg-subtle"
          >
            <div className="font-medium">{doc.title}</div>
            <p className="mt-1 text-sm text-fg-muted">{doc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
