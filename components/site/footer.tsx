import { withBasePath } from "@/lib/base-path";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="font-semibold tracking-tight">PRIZM 4.0</div>
            <p className="mt-2 text-sm text-fg-muted">
              A DSTA design system for C3 and Enterprise products, built for developers and AI.
            </p>
          </div>
          <div>
            <div className="text-sm font-medium">Get started</div>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              <li>
                <Link href="/docs/introduction" className="hover:text-fg">
                  Introduction
                </Link>
              </li>
              <li>
                <Link href="/docs/getting-started" className="hover:text-fg">
                  Getting started
                </Link>
              </li>
              <li>
                <Link href="/docs/adopting-prizm" className="hover:text-fg">
                  Adopting PRIZM
                </Link>
              </li>
              <li>
                <Link href="/docs/installation" className="hover:text-fg">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="/docs/theming" className="hover:text-fg">
                  Theming
                </Link>
              </li>
              <li>
                <Link href="/docs/changelog" className="hover:text-fg">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium">Reference</div>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              <li>
                <Link href="/docs/foundations" className="hover:text-fg">
                  Foundations
                </Link>
              </li>
              <li>
                <Link href="/components" className="hover:text-fg">
                  Components
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium">Products</div>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              <li>
                <Link href="/c3" className="hover:text-fg">
                  C3
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="hover:text-fg">
                  Enterprise
                </Link>
              </li>
              <li>
                <Link href="/c3/javafx" className="hover:text-fg">
                  JavaFX (C3)
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium">For AI</div>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              <li>
                <Link href="/docs/using-with-ai" className="hover:text-fg">
                  Using with AI
                </Link>
              </li>
              <li>
                <a href={withBasePath("/PRIZM.md")} className="hover:text-fg">
                  PRIZM.md
                </a>
              </li>
              <li>
                <a href={withBasePath("/llms.txt")} className="hover:text-fg">
                  llms.txt
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-fg-subtle">
          PRIZM 4.0 · A DSTA design system ·{" "}
          <a
            href="https://github.com/prizm-design/prizm/blob/main/LICENSE"
            className="hover:text-fg"
          >
            MIT licensed
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
