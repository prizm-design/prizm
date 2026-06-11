import { CodeBlock } from "@/components/site/code-block";
import { BookOpen, Cloud, Code2, Compass, FileText, Network, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Using with AI" };

export default function UsingWithAiPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Docs</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Using PRIZM with AI</h1>
      <p className="mt-3 text-lg text-fg-muted">
        PRIZM is built to be read and used by AI assistants as well as people. This page walks
        through how a team adopts PRIZM with AI in the loop — what PRIZM gives your AI to work with,
        how to wire it up, and where each role fits.
      </p>

      {/* ============================================================
          What PRIZM offers your AI assistant
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">
        What PRIZM offers your AI assistant
      </h2>
      <p className="mt-3 text-fg-muted">
        Every component, principle, and design decision in PRIZM is documented in plain Markdown and
        TypeScript that AI tools can read directly — no separate API, no external service.
      </p>

      <div className="mt-6 space-y-3">
        <ArtefactRow
          icon={<BookOpen className="h-4 w-4" />}
          name="PRIZM.md"
          path="/PRIZM.md (repo root)"
          description="The full brief for AI assistants: conventions, theming, tokens, what to do when asked to build. Read this first."
        />
        <ArtefactRow
          icon={<Compass className="h-4 w-4" />}
          name="/docs/principles"
          path="foundation page on the docs site"
          description="The HF / HCI research behind PRIZM's patterns (Endsley, Fitts, Norman, Sweller, etc.). Consult this when an AI is making a design call — layout, hierarchy, when-to-use — not just composing components."
        />
        <ArtefactRow
          icon={<FileText className="h-4 w-4" />}
          name="llms.txt"
          path="/llms.txt (repo root)"
          description="Structured index of every component, foundation page, and zone overview. The entry point most AI tools look for."
        />
        <ArtefactRow
          icon={<Code2 className="h-4 w-4" />}
          name="llms/<slug>.md"
          path="/llms/ (per-component context files)"
          description="One file per component — when to use it, accessibility notes, examples, and a full props table generated from the same source the docs site uses."
        />
        <ArtefactRow
          icon={<Sparkles className="h-4 w-4" />}
          name="components-api.ts"
          path="/lib/components-api.ts"
          description="The canonical API surface: every prop, type, default, and sub-component for the full library. Curated, not auto-generated."
        />
      </div>

      <p className="mt-4 text-sm text-fg-muted">
        PRIZM.md, llms.txt, the llms/ directory, and components-api.ts are vendored in the repo. The
        principles page lives on the docs site — readable by any AI that can fetch HTML, or ingested
        alongside the rest in an air-gapped knowledge base.
      </p>

      {/* ============================================================
          AI and your team
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">AI and your team</h2>
      <p className="mt-4 text-fg-muted">
        AI is good at moving within a system: composing PRIZM components, applying tokens, migrating
        older code, reviewing for consistency. PRIZM gives it the structure that makes the output
        reliably good.
      </p>
      <p className="mt-4 text-fg-muted">
        The system itself — its principles, its brand, the choices about what to build and who to
        build it for — comes from your product designers and researchers. AI helps the team move
        through the work faster; designers and researchers shape what the work is.
      </p>

      {/* ============================================================
          Setting up your AI
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Setting up your AI</h2>
      <p className="mt-3 text-fg-muted">
        Four common paths, depending on how your team works. At DSTA we mostly use Claude Code;
        these patterns work with other LLMs too.
      </p>

      <div className="mt-8 space-y-6">
        <SetupBlock
          icon={<Code2 className="h-5 w-5" />}
          title="IDE-integrated AI (Claude Code, Cursor, Continue)"
          body={
            <>
              <p className="text-fg-muted">
                Open the PRIZM repo (or your project that has PRIZM copied in) in your IDE. The AI
                reads the workspace files automatically — including{" "}
                <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
                  PRIZM.md
                </code>
                ,{" "}
                <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
                  llms.txt
                </code>
                , and the per-component context files.
              </p>
              <p className="mt-3 text-fg-muted">
                For Claude Code specifically, add PRIZM.md to your project context once (either as a
                project instruction file or as initial-message context) and most subsequent requests
                will resolve correctly without re-pasting.
              </p>
            </>
          }
        />

        <SetupBlock
          icon={<Sparkles className="h-5 w-5" />}
          title="Chat-based AI (Claude, ChatGPT, Gemini)"
          body={
            <p className="text-fg-muted">
              At the start of a session, paste the contents of{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">PRIZM.md</code>{" "}
              into the chat. For specific components, also paste the matching{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
                llms/&lt;slug&gt;.md
              </code>
              . Public deployments can also link to the hosted{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">llms.txt</code>{" "}
              URL and let the model fetch.
            </p>
          }
        />

        <SetupBlock
          icon={<Network className="h-5 w-5" />}
          title="Internal LLM gateway with RAG"
          body={
            <p className="text-fg-muted">
              Ingest the{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">llms/</code>{" "}
              directory and{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">PRIZM.md</code>{" "}
              into your team's knowledge base. The files are plain Markdown — no preprocessing
              needed. Re-ingest after each PRIZM release.
            </p>
          }
        />

        <SetupBlock
          icon={<Cloud className="h-5 w-5" />}
          title="Air-gapped AI"
          body={
            <p className="text-fg-muted">
              Same as the gateway path, but PRIZM ships into the air-gap via the offline release
              tarball. The same files —{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">PRIZM.md</code>,{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">llms.txt</code>,
              the per-component context — work identically on an on-prem model with no external
              dependencies. See{" "}
              <Link href="/docs/air-gap" className="text-accent hover:underline">
                Air-gap setup
              </Link>{" "}
              for the ingestion procedure.
            </p>
          }
        />
      </div>

      {/* ============================================================
          A starter prompt
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">A starter prompt for your AI</h2>
      <p className="mt-3 text-fg-muted">
        A short prompt prefix that establishes the right working conventions. Copy this into your
        AI's system prompt, project instructions, or the start of a session.
      </p>

      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`You are helping me build with PRIZM 4.0, a design system. Read PRIZM.md and
llms.txt first — from your local PRIZM checkout or your team's mirror if you
have one, otherwise from the repo at https://github.com/prizm-design/prizm.
They describe everything else, including how to fetch any source file you don't
already have. If you can't locate them, ask me where PRIZM lives rather than
guessing.

Working conventions:
- For any component, check llms/<slug>.md for props, conventions, and accessibility notes.
- For design decisions (layout, hierarchy, when-to-use), consult /docs/principles.
- Use semantic Tailwind tokens only: bg-bg, text-fg, border-border, bg-accent, etc.
  Never use raw color utilities like bg-slate-500 or text-blue-600.
- Prefer existing component variants over className overrides for visual changes.
- Match the active product zone: C3 (cyan, dense, tactical) or Enterprise
  (blue, spacious, professional). Tokens flip automatically; layout choices don't.
- Components are copy-paste. The source files at components/ui/<slug>.tsx
  are mine to copy and modify.
- Never introduce external URL references (CDNs, remote fonts, third-party scripts).
  PRIZM is air-gap safe and the audit script will fail CI on violations.`}
        />
      </div>

      <p className="mt-4 text-sm text-fg-muted">
        Adapt the rules to your team's working conventions. This prompt is a starting point, not a
        contract — tighten or loosen it to match the kind of work you're doing.
      </p>

      {/* ============================================================
          For air-gapped teams
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">For air-gapped teams</h2>
      <p className="mt-3 text-fg-muted">
        Teams running on-prem LLM gateways or fully disconnected environments get the same AI
        experience PRIZM offers anywhere. The artefacts AI reads —{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">PRIZM.md</code>,{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">llms.txt</code>, the{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">llms/</code>{" "}
        directory,{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
          components-api.ts
        </code>{" "}
        — are all vendored in the repo. No external service calls, no CDN fetches, no embedding APIs
        required.
      </p>
      <p className="mt-4 text-fg-muted">
        The PRIZM offline release tarball includes everything an air-gapped LLM needs. The same
        prompts, the same workflows, the same outputs as a connected team. See{" "}
        <Link href="/docs/air-gap" className="text-accent hover:underline">
          Air-gap setup
        </Link>{" "}
        for the operational procedure.
      </p>
    </article>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

function ArtefactRow({
  icon,
  name,
  path,
  description,
}: {
  icon: React.ReactNode;
  name: string;
  path: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg-muted text-accent">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <code className="font-mono text-sm font-semibold text-fg">{name}</code>
          <code className="font-mono text-[11px] text-fg-subtle">{path}</code>
        </div>
        <p className="mt-1 text-sm text-fg-muted">{description}</p>
      </div>
    </div>
  );
}

function SetupBlock({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-bg-muted text-accent">
          {icon}
        </span>
        <h3 className="text-base font-semibold text-fg">{title}</h3>
      </div>
      <div className="mt-3">{body}</div>
    </div>
  );
}
