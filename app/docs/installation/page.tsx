import { CodeBlock } from "@/components/site/code-block";

export const metadata = { title: "Installation" };

export default function InstallationPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Installation</h1>
      <p className="mt-3 text-lg text-fg-muted">
        PRIZM is distributed via copy-paste, but every consumer still needs the same peer
        dependencies and token setup. This page walks through both.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Peer dependencies</h2>
      <p className="mt-3 text-fg-muted">Required by every PRIZM component:</p>
      <div className="mt-4">
        <CodeBlock
          language="bash"
          code={`pnpm add @base-ui-components/react class-variance-authority clsx lucide-react tailwind-merge
pnpm add -D tailwindcss@^4.0.0-beta.4 @tailwindcss/postcss`}
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Tailwind CSS v4 config</h2>
      <p className="mt-3 text-fg-muted">
        PRIZM uses Tailwind v4's CSS-first configuration. Add this PostCSS config to your project:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="js"
          code={`// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};`}
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Add tokens to your global CSS</h2>
      <p className="mt-3 text-fg-muted">
        Copy <code className="font-mono text-xs">styles/tokens/</code> and{" "}
        <code className="font-mono text-xs">styles/fonts.css</code> from PRIZM into your project,
        then import them in your global stylesheet (typically{" "}
        <code className="font-mono text-xs">app/globals.css</code>).
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Add the cn utility</h2>
      <p className="mt-3 text-fg-muted">
        Every PRIZM component depends on a small <code className="font-mono text-xs">cn()</code>{" "}
        helper at <code className="font-mono text-xs">@/lib/utils</code>:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Set the theme at the root</h2>
      <div className="mt-4">
        <CodeBlock
          language="html"
          code={`<html data-zone="enterprise" data-mode="light">
  <!-- ... -->
</html>`}
        />
      </div>
      <p className="mt-3 text-fg-muted">
        For interactive theme switching, copy{" "}
        <code className="font-mono text-xs">lib/theme-context.tsx</code> from PRIZM and wrap your
        app in <code className="font-mono text-xs">&lt;ThemeProvider&gt;</code>.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Copy your first component</h2>
      <p className="mt-3 text-fg-muted">
        You're ready. Visit any component page and copy its source. Components go in{" "}
        <code className="font-mono text-xs">components/ui/</code> in your project.
      </p>
    </article>
  );
}
