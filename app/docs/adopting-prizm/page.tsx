import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Adopting PRIZM" };

export default function AdoptingPrizmPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-xs font-medium uppercase tracking-widest text-accent">Overview</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Adopting PRIZM</h1>
      <p className="mt-4 text-lg text-fg-muted">
        Adopting PRIZM 4 isn&apos;t a one-off migration. It&apos;s a way of evolving your product
        alongside PRIZM — bringing the system in where new work happens, and letting the rest follow
        over time. This page is about doing that without putting everything else on hold.
      </p>

      {/* ============================================================
          You don't have to rebuild everything
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">
        You don&apos;t have to rebuild everything
      </h2>
      <p className="mt-4 leading-relaxed text-fg-muted">
        There&apos;s a common worry that taking on a new design system means a full redesign: freeze
        the roadmap, rework every screen, ship the lot in one go. For a small product that can be
        reasonable. For a large one it rarely is, and for a programme that runs for years it&apos;s
        close to unworkable.
      </p>
      <p className="mt-4 leading-relaxed text-fg-muted">
        Your teams keep shipping features the whole time, so it&apos;s not that work stops. The
        problem is the look and feel: it sits frozen for the years a full redesign takes, while
        PRIZM keeps evolving. The longer it drags, the more dated the product looks — and the
        version you finally ship is already a step behind.
      </p>
      <p className="mt-4 leading-relaxed text-fg-muted">
        So we don&apos;t suggest doing it that way. There&apos;s a better route, and it&apos;s the
        one most large software actually takes.
      </p>

      {/* ============================================================
          Bring it in gradually
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Bring it in gradually</h2>
      <p className="mt-4 leading-relaxed text-fg-muted">
        Rather than one cutover, bring PRIZM 4 in where new work is already happening, and let the
        older parts follow when their turn comes. A few habits keep this working in practice.
      </p>

      <h3 className="mt-8 text-lg font-semibold text-fg">New work starts on PRIZM 4</h3>
      <p className="mt-3 leading-relaxed text-fg-muted">
        Every new module or application is built on PRIZM 4, without debating it case by case. This
        is the easiest place to adopt, too: there&apos;s no existing code to unpick, so you&apos;re
        building on the current system from the start.
      </p>

      <h3 className="mt-8 text-lg font-semibold text-fg">
        Refresh when you&apos;re already in there
      </h3>
      <p className="mt-3 leading-relaxed text-fg-muted">
        Your older modules don&apos;t need a migration plan of their own. Most of them will be
        reworked at some point anyway — a feature gets rebuilt, part of the product gets an
        overhaul. When that happens, move the module to PRIZM 4 as part of the same work, rather
        than rebuilding it again in a version we no longer support.
      </p>
      <p className="mt-4 leading-relaxed text-fg-muted">
        The risk with this is that &ldquo;we&apos;ll do it next time we&apos;re in there&rdquo;
        turns into never. On a long programme, keep a simple list of which modules are on which
        version of PRIZM, so someone can see what&apos;s left and the migration doesn&apos;t quietly
        stall.
      </p>

      <h3 className="mt-8 text-lg font-semibold text-fg">Split old and new by module</h3>
      <p className="mt-3 leading-relaxed text-fg-muted">
        This is the part worth getting right. It&apos;s fine for different modules to look different
        — people are used to the newer parts of a product looking newer than the older ones. The
        problem is when the difference shows up inside a single task: a form where the top half
        looks new and the bottom half old, or a workflow that changes style partway through.
      </p>
      <p className="mt-4 leading-relaxed text-fg-muted">
        So keep the boundary between modules, where people are already moving from one part of the
        product to another, and not inside a single piece of work. That&apos;s where consistency
        actually matters. Across a whole product built up over ten years, some difference between
        the parts is expected, and users won&apos;t hold it against you.
      </p>

      <h3 className="mt-8 text-lg font-semibold text-fg">Start with the shell</h3>
      <p className="mt-3 leading-relaxed text-fg-muted">
        If there&apos;s one place to start, it&apos;s the shared frame around everything — the top
        bar, the navigation, the shell your modules sit inside. Moving that to PRIZM 4 early makes
        the biggest visible difference: the product as a whole starts to look current, even while
        most of the module content is still on the old system. In C3, the{" "}
        <Link href="/c3/templates/app-shell" className="text-accent hover:underline">
          App Shell template
        </Link>{" "}
        is built for precisely this.
      </p>

      <h3 className="mt-8 text-lg font-semibold text-fg">How it plays out</h3>
      <p className="mt-3 leading-relaxed text-fg-muted">
        Picture a dispatch platform that&apos;s run for six years: a live operations console, a
        shift-planning module, a reporting area, and an admin back-end. You don&apos;t rebuild all
        four. The incident-review module you&apos;re starting this quarter is built on PRIZM 4. The
        operations console — the screen everyone watches all day — gets the PRIZM 4 shell now, so
        the product feels current. Shift-planning is due a rework next year and moves across then.
        Reporting and admin stay as they are until they&apos;re due for a refresh. A year in, a good
        part of the product is on PRIZM 4, and no roadmap was ever frozen to get there.
      </p>

      <figure className="mt-6 rounded-xl border border-border bg-bg-subtle p-4 sm:p-6">
        <div className="rounded-lg border border-border bg-surface p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-md border border-accent bg-accent/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold text-accent">Shared shell</span>
            <span className="ml-auto text-[11px] font-medium text-accent">PRIZM 4</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <ModuleTile name="Incident review" isNew />
            <ModuleTile name="Operations console" isNew />
            <ModuleTile name="Shift planning" />
            <ModuleTile name="Reporting" />
            <ModuleTile name="Admin" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-accent bg-accent/10" />
            On PRIZM 4
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-border bg-bg-muted" />
            Earlier version
          </span>
        </div>
        <figcaption className="mt-3 text-sm leading-relaxed text-fg-muted">
          One product, several modules, mid-migration. New and reworked modules are on PRIZM 4; the
          rest move across when they&apos;re next worked on. The shared shell is on PRIZM 4 already,
          so the product reads as current even while some modules haven&apos;t changed.
        </figcaption>
      </figure>

      {/* ============================================================
          Won't it look inconsistent?
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">
        Won&apos;t it look inconsistent?
      </h2>
      <p className="mt-4 leading-relaxed text-fg-muted">
        Everyone asks this, so let&apos;s answer it straight. Yes — for a while, parts of your
        product will look as though they were built at different times, because they were. That
        isn&apos;t a new problem, and it certainly isn&apos;t yours alone.
      </p>
      <p className="mt-4 leading-relaxed text-fg-muted">
        It&apos;s a recognised way of working, and it has a name: coexistence — an old system and a
        new one running side by side while the new one gradually takes over. The biggest software in
        the world runs this way. Salesforce ran Classic and Lightning side by side for years and let
        each org move across when it was ready, rather than flipping everyone at once. SAP&apos;s
        Fiori has sat next to older screens for over a decade; its Launchpad is really just a modern
        frame around applications of wildly different ages — the same &ldquo;start with the
        shell&rdquo; idea, at enormous scale. Even Windows has shipped the old Control Panel beside
        its newer Settings for well over a decade.
      </p>
      <p className="mt-4 leading-relaxed text-fg-muted">
        None of them waited for a clean-slate moment to modernise, because in software that&apos;s
        actually in use there is no clean-slate moment. They did it continuously, in the open, and
        it worked. The all-at-once alternative isn&apos;t more consistent. It reaches the same place
        with more risk, carried for longer.
      </p>

      {/* ============================================================
          Where to start
          ============================================================ */}
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Where to start</h2>
      <p className="mt-4 leading-relaxed text-fg-muted">
        The first step is a small one. Take the next new module on your plan and build it on PRIZM
        4. Move the shared shell over early so the surroundings feel current. Keep a short note of
        what&apos;s on which version. After that, new work and the usual reworking of old modules
        will carry the rest across over time.
      </p>

      {/* Next reads */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <NextRead
          href="/docs/getting-started"
          title="Getting started"
          description="Install the dependencies and copy your first component."
        />
        <NextRead
          href="/docs/using-with-ai"
          title="Using with AI"
          description="Bring PRIZM into an AI-assisted workflow, and keep it there across sessions."
        />
      </div>
    </article>
  );
}

function ModuleTile({ name, isNew = false }: { name: string; isNew?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md border p-2.5",
        isNew ? "border-accent bg-accent/5" : "border-border bg-bg-muted",
      )}
    >
      <span className="text-xs font-medium text-fg">{name}</span>
      <span className={cn("text-[10px] font-medium", isNew ? "text-accent" : "text-fg-subtle")}>
        {isNew ? "PRIZM 4" : "Earlier version"}
      </span>
    </div>
  );
}

function NextRead({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong"
    >
      <div>
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        <p className="mt-1 text-sm text-fg-muted">{description}</p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
        Read
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
