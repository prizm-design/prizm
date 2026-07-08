import { CodeBlock } from "@/components/site/code-block";
import {
  BookOpen,
  Cloud,
  Code2,
  Compass,
  FileText,
  Network,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
- Reuse before you build (non-negotiable). Before creating any UI element,
  search llms.txt and lib/components-api.ts for a PRIZM component that fits.
  If one exists, use it as-is — adjust exposed props and variants only, never
  rewrite its markup or styling. If nothing fits, stop and say so, naming what
  you checked, rather than silently hand-rolling a replacement. Duplicating
  existing PRIZM functionality needs explicit sign-off from me.
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
          Keeping your AI on-system over time
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">
        Keeping your AI on-system over time
      </h2>
      <p className="mt-3 text-fg-muted">
        The starter prompt above does its job at the start of a session. But over a long session,
        the AI's earliest messages are the first thing summarised away as the context fills up — so
        the specifics fade (<em>use semantic tokens</em>, <em>start from the App Shell</em>) even
        while the AI still remembers it's &ldquo;using PRIZM&rdquo;. The result is gradual drift
        away from the system.
      </p>
      <p className="mt-4 text-fg-muted">
        The fix is to give the rules a home the AI re-reads every session rather than a message it
        sees once. PRIZM recommends two complementary things for this: a project rules file the AI
        loads automatically, and a short record of the key decisions it can consult, so each new
        session starts grounded in what was already agreed.
      </p>

      <p className="mt-6 font-semibold text-fg">The core practice: a project rules file</p>
      <p className="mt-3 text-fg-muted">
        Your conventions belong in the file your AI tool loads automatically at the start of every
        session —{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">CLAUDE.md</code> for
        Claude Code, or the equivalent for your tool (Cursor's{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">.cursor/rules</code>,
        for example). You don't have to write it by hand — give your AI the one-time prompt below
        and it will set the file up for you. A good rules file stays short and points at the source
        rather than restating it — it captures four things:
      </p>
      <ol className="mt-4 space-y-2 text-fg-muted">
        <li className="flex gap-3">
          <span className="font-mono text-sm text-accent">1.</span>
          <span>
            <strong className="font-medium text-fg">Reuse before you build</strong> — use PRIZM
            components and templates. Before writing any UI element, search{" "}
            <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">llms.txt</code>{" "}
            and{" "}
            <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
              lib/components-api.ts
            </code>{" "}
            for one that fits. If one does, use it as-is — adjust exposed props and variants only,
            never re-implement its markup or styling. If nothing fits, stop and say so — naming what
            was checked — rather than silently hand-rolling a replacement. Duplicating existing
            PRIZM functionality needs explicit sign-off. This is the rule that actually drifts: an
            AI can follow every token rule while quietly rebuilding a component PRIZM already ships.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-sm text-accent">2.</span>
          <span>
            <strong className="font-medium text-fg">Which zone and pack you're on</strong> — so the
            AI loads the right tokens and the right starting point (an active{" "}
            <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">data-pack</code>{" "}
            for an extension pack).
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-sm text-accent">3.</span>
          <span>
            <strong className="font-medium text-fg">The conventions that must always hold</strong> —
            the few non-negotiables for your project (semantic tokens, variants over overrides, no
            external URLs), not a full style guide. Keep it short enough that the AI weighs every
            line.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-sm text-accent">4.</span>
          <span>
            <strong className="font-medium text-fg">Where the canonical docs live</strong> —{" "}
            <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">PRIZM.md</code>,{" "}
            <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">llms.txt</code>,
            and the raw-file fetch path — so the AI reads the current source instead of working from
            memory.
          </span>
        </li>
      </ol>
      <p className="mt-4 text-fg-muted">
        One self-contained prompt does it — paste it into a fresh session or your project setup:
      </p>

      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`Set up a PRIZM rules file for this project. First read PRIZM.md and llms.txt
— from our local PRIZM checkout or mirror, otherwise from the repo at
https://github.com/prizm-design/prizm. They describe the conventions and how
to fetch any source file.

Then add these to the file my AI tool loads automatically each session —
CLAUDE.md, or the equivalent for our tool. If that file already exists, append
a clearly-marked PRIZM section rather than overwriting what's there; create the
file only if it's missing. Keep the section short:
- the core rule (state it as non-negotiable): this project's UI is built with
  PRIZM. Before creating any UI element, search llms.txt and
  lib/components-api.ts for an existing PRIZM component. If one fits, use it
  as-is — adjust exposed props and variants only, never rewrite its markup or
  styling. If nothing fits, stop and say so — naming what was checked —
  rather than silently hand-rolling. Start from a PRIZM template where one
  fits before composing from primitives. Duplicating existing PRIZM
  functionality needs explicit sign-off from me;
- the PRIZM zone and pack this project uses (ask me if it isn't obvious from
  the code);
- the conventions that must always hold (semantic tokens only, existing
  variants over className overrides, no external URLs, British English in
  user-facing copy; check llms/<slug>.md for a component's props and usage);
- where the canonical docs live: PRIZM.md, llms.txt, and the raw-file fetch
  path — read current source rather than recalling it, and if a fetch 404s,
  stop and tell me instead of inventing a substitute.

From now on that file is the source of truth — re-read it before new work and
partway through a long session.`}
        />
      </div>

      <p className="mt-4 text-sm text-fg-muted">
        Review what it writes, trim it to the essentials, and commit it — from then on every session
        starts from the file instead of a pasted prompt.
      </p>

      <p className="mt-8 font-semibold text-fg">Or copy this straight into CLAUDE.md</p>
      <p className="mt-3 text-fg-muted">
        If you'd rather skip the prompt and just paste a starting point into{" "}
        <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">CLAUDE.md</code> (or
        your tool's equivalent) yourself, use this template. Fill in the zone and pack, adjust the
        &ldquo;always hold&rdquo; list for your project's own conventions, and commit.
      </p>

      <div className="mt-4">
        <CodeBlock
          language="markdown"
          code={`# PRIZM project rules

This project's UI is built with **PRIZM 4.0** (a DSTA design system). Before
writing UI, read the current PRIZM.md and llms.txt — from our local PRIZM
checkout or mirror, otherwise from the repo at
https://github.com/prizm-design/prizm.

## Reuse before you build — non-negotiable

1. Before creating any UI element, search **llms.txt** (component index) and
   **lib/components-api.ts** (props, variants, defaults) for a PRIZM
   component that fits the need. Look by function, not by name — a "pill" or
   "chip" is a Badge; a "modal" is a Dialog; a "drawer" is a Sheet.
2. If one exists, use it as-is — adjust exposed props and variants only.
   Never rewrite its markup, restyle its internals, or wrap it purely to
   change its look.
3. If nothing fits, **stop and say so — explicitly**. Name the components
   checked and why each doesn't fit, before writing anything from scratch.
4. Duplicating existing PRIZM functionality requires explicit sign-off — flag
   the overlap and wait for a "yes, build a new one" before proceeding.

## Zone and pack

- Product zone: <c3 | enterprise>
- Extension pack: <none | rc3 | …>

## Conventions that must always hold

- Semantic Tailwind tokens only (\`bg-bg\`, \`text-fg\`, \`border-border\`,
  \`bg-accent\`, etc.). Never raw colour utilities like \`bg-slate-500\`.
- Prefer existing component variants over \`className\` overrides for visual
  changes.
- No external URL references — no CDNs, remote fonts, third-party scripts.
  PRIZM is air-gap safe and the audit script fails CI on violations.
- User-facing copy uses British English (colour, behaviour, organisation);
  code identifiers stay American.

## Canonical docs — read current source, don't recall

- \`PRIZM.md\` — the AI brief.
- \`llms.txt\` — component index. Consult before writing UI.
- \`lib/components-api.ts\` — full props / variants surface.
- \`llms/<slug>.md\` — per-component context.
- \`/docs/principles\` — HF/HCI rationale behind PRIZM's patterns.
- Raw fetch pattern:
  \`https://raw.githubusercontent.com/prizm-design/prizm/main/<path>\`.
  If a fetch 404s, stop and tell me — don't fabricate a substitute.`}
        />
      </div>

      <p className="mt-8 font-semibold text-fg">Two habits that help</p>
      <div className="mt-4 space-y-6">
        <SetupBlock
          icon={<RefreshCw className="h-5 w-5" />}
          title="Scope sessions, and start fresh"
          body={
            <p className="text-fg-muted">
              One feature per session beats one marathon session — there's less context to summarise
              away, so less room for drift. On a long session, ask the AI to re-read the rules file
              partway through before it carries on.
            </p>
          }
        />
        <SetupBlock
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Add a mechanical check"
          body={
            <p className="text-fg-muted">
              A lint rule or a pull-request review step that flags non-PRIZM usage — raw colours,
              ad-hoc chrome — catches drift regardless of what the model remembers. It's the one
              safety net that doesn't depend on context staying intact, so it's worth having even
              when the rules file is doing its job.
            </p>
          }
        />
      </div>

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
