import Link from "next/link";
import { CodeBlock } from "@/components/site/code-block";

export const metadata = { title: "Getting started" };

export default function GettingStartedPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Getting started</h1>
      <p className="mt-3 text-lg text-fg-muted">
        PRIZM uses a copy-paste model. You don't install it as a package — you copy components into
        your project and own them.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">1. Install peer dependencies</h2>
      <p className="mt-3 text-fg-muted">PRIZM components rely on a small set of well-supported libraries:</p>
      <div className="mt-4">
        <CodeBlock
          language="bash"
          code={`pnpm add @base-ui-components/react class-variance-authority clsx lucide-react tailwind-merge
pnpm add -D tailwindcss@^4.0.0-beta.4`}
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">2. Add the PRIZM token CSS</h2>
      <p className="mt-3 text-fg-muted">
        Copy the contents of <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">/styles/tokens/</code>{" "}
        into your project and import them in your global CSS:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="css"
          code={`@import "tailwindcss";

@import "./tokens/baseline.css";
@import "./tokens/c3-light.css";
@import "./tokens/c3-dark.css";
@import "./tokens/enterprise-light.css";
@import "./tokens/enterprise-dark.css";`}
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">3. Set the active theme</h2>
      <p className="mt-3 text-fg-muted">
        Add data attributes to your root <code className="font-mono text-xs">&lt;html&gt;</code>{" "}
        element. PRIZM components automatically pick up the active theme.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="html"
          code={`<html data-zone="enterprise" data-mode="light">
  <!-- ... -->
</html>`}
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">4. Copy your first component</h2>
      <p className="mt-3 text-fg-muted">
        Browse the <Link href="/components" className="text-accent underline-offset-4 hover:underline">component catalog</Link>{" "}
        and copy the source of any stable component into{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">components/ui/</code>{" "}
        in your project. You now own that component — modify it freely.
      </p>
    </article>
  );
}
