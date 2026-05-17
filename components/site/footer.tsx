import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-semibold tracking-tight">PRIZM 4.0</div>
            <p className="mt-2 text-sm text-fg-muted">
              A DSTA design system for C3 and Enterprise products, built for developers and AI.
            </p>
          </div>
          <div>
            <div className="text-sm font-medium">Library</div>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              <li><Link href="/components" className="hover:text-fg">Components</Link></li>
              <li><Link href="/docs/foundations" className="hover:text-fg">Foundations</Link></li>
              <li><Link href="/docs/getting-started" className="hover:text-fg">Getting started</Link></li>
              <li><Link href="/docs/theming" className="hover:text-fg">Theming</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium">Products</div>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              <li><Link href="/c3" className="hover:text-fg">C3</Link></li>
              <li><Link href="/enterprise" className="hover:text-fg">Enterprise</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium">For AI</div>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              <li><Link href="/docs/using-with-ai" className="hover:text-fg">Using with AI</Link></li>
              <li><Link href="/llms.txt" className="hover:text-fg">llms.txt</Link></li>
              <li><Link href="/PRIZM.md" className="hover:text-fg">PRIZM.md</Link></li>
              <li><Link href="/docs/air-gap" className="hover:text-fg">Air-gap setup</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-fg-subtle">
          PRIZM 4.0 · A DSTA design system · Open source.
        </div>
      </div>
    </footer>
  );
}
