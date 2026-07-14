import { CodeBlock } from "@/components/site/code-block";
import { COMPONENTS } from "@/lib/components-registry";
import { JAVAFX_API } from "@/lib/javafx-api";
import { RC3_JAVAFX_API } from "@/lib/rc3-javafx-api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const RC3_EMBER = "oklch(71% 0.195 32)";

// Friendly names for the RC3 organisms (RC3 has no components-registry entry).
const RC3_NAMES: Record<string, string> = {
  "safety-actions": "Safety actions",
  "comms-health-strip": "Comms / health strip",
  "autonomy-mode-selector": "Autonomy mode selector",
  "video-tile": "Video tile",
  "telemetry-hud": "Telemetry HUD",
  "controller-interface": "Controller interface",
  "platform-roster": "Platform roster",
  "platform-detail": "Platform detail",
  "perception-view": "Perception view",
};

export const metadata = {
  title: "JavaFX — thick-client C3",
  description:
    "Build native desktop operator applications with a parallel JavaFX library, themed from the same PRIZM tokens. C3 and its extension packs.",
};

export default function JavaFxPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Header />
      <HowItWorks />
      <Setup />
      <Components />
      <Rc3Organisms />
      <Templates />
      <SeeItNatively />
      <Notes />
    </div>
  );
}

function Header() {
  return (
    <div className="max-w-4xl">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        Thick client
      </div>
      <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        PRIZM for JavaFX
      </h1>
      <p className="mt-5 max-w-3xl text-balance text-lg text-fg-muted md:text-xl">
        A parallel JavaFX library for thick-client C3 applications. Same design language, rendered
        natively.
      </p>
      <p className="mt-4 max-w-3xl text-fg-muted">
        Enterprise is web-only and not shipped for JavaFX.
      </p>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="mt-16 md:mt-20">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
        How it works
      </span>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card title="Tokens, derived">
          The colour tokens are generated from the same canonical CSS the web library uses,
          converted to JavaFX looked-up colours. One source of truth, two rendered outputs.
        </Card>
        <Card title="Native, not embedded">
          Components are idiomatic JavaFX classes &mdash; thin subclasses of the stock controls
          &mdash; rendered by the JavaFX scene graph. No browser, no WebView.
        </Card>
        <Card title="Spec parity">
          Each component implements the same spec as its React counterpart, so variants, sizes, and
          defaults match across both libraries.
        </Card>
      </div>
    </section>
  );
}

function Setup() {
  return (
    <section className="mt-16 md:mt-20">
      <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            Setup
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            A Gradle module and a theme call.
          </h2>
          <p className="mt-4 text-fg-muted">
            Add the OpenJFX plugin, then apply a theme to your{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">Scene</code>.
            Switching mode or overlaying an extension pack is the same call with different arguments
            &mdash; every styled component re-reads its looked-up colours live.
          </p>
          <p className="mt-4 text-fg-muted">
            Regenerate the theme stylesheets after any token change with{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
              pnpm generate:javafx-theme
            </code>
            .
          </p>
        </div>
        <div className="min-w-0 space-y-3">
          <CodeBlock
            language="kotlin"
            code={`// build.gradle.kts
plugins {
    application
    id("org.openjfx.javafxplugin") version "0.1.0"
}

javafx {
    version = "21.0.4"
    modules = listOf("javafx.controls")
}`}
          />
          <CodeBlock
            language="java"
            code={`import design.prizm.fx.PrizmTheme;

// C3 dark (operator-canonical default)
PrizmTheme.apply(scene, PrizmTheme.Mode.DARK);

// switch to light, overlay the RC3 (Ember) pack
PrizmTheme.apply(scene, PrizmTheme.Mode.LIGHT, PrizmTheme.Pack.RC3);`}
          />
        </div>
      </div>
    </section>
  );
}

function Components() {
  // Data-driven: every component flagged javafx: "stable" with a spec entry,
  // in registry order. Adding a component surfaces it here automatically.
  const components = COMPONENTS.flatMap((c) => {
    const api = c.javafx === "stable" ? JAVAFX_API[c.slug] : undefined;
    return api ? [{ slug: c.slug, name: c.name, api }] : [];
  });
  return (
    <section className="mt-16 md:mt-20">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
        Components
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Available now</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {components.map(({ slug, name, api }) => (
          <Link
            key={slug}
            href={`/components/${slug}`}
            className="group rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong hover:bg-bg-subtle"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-sm font-semibold tracking-tight group-hover:text-accent">
                {api.className}
              </span>
              <span className="shrink-0 text-xs text-fg-subtle">{name}</span>
            </div>
            <div className="mt-1 text-xs text-fg-subtle">
              extends <span className="font-mono">{api.base.split(".").pop()}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Rc3Organisms() {
  // Data-driven from the RC3 JavaFX spec, in declared order. Adding an organism
  // to rc3-javafx-api.ts surfaces it here automatically. Links to the RC3 docs
  // page (RC3 organisms have no /components/<slug> entry).
  const organisms = Object.entries(RC3_JAVAFX_API).map(([slug, api]) => ({
    slug,
    api,
    name: RC3_NAMES[slug] ?? slug,
  }));
  return (
    <section className="mt-16 md:mt-20">
      <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: RC3_EMBER }}
        />
        Extension packs
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        RC3 &mdash; Robotics &amp; Autonomy
      </h2>
      <p className="mt-4 max-w-3xl text-fg-muted">
        The RC3 pack&rsquo;s signature organisms, ported natively. Overlay the Ember accent with{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
          PrizmTheme.Pack.RC3
        </code>{" "}
        &mdash; identity marks read as Ember with or without it. All nine signature organisms,
        ported natively.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {organisms.map(({ slug, api, name }) => (
          <Link
            key={slug}
            href={`/c3/rc3/components/${slug}`}
            className="group rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong hover:bg-bg-subtle"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-sm font-semibold tracking-tight group-hover:text-accent">
                {api.className}
              </span>
              <span className="shrink-0 text-xs text-fg-subtle">{name}</span>
            </div>
            <div className="mt-1 text-xs text-fg-subtle">
              extends <span className="font-mono">{api.base.split(".").pop()}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Templates() {
  return (
    <section className="mt-16 md:mt-20">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
        Templates
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        The operator shell, native
      </h2>
      <p className="mt-4 max-w-3xl text-fg-muted">
        The{" "}
        <Link href="/c3/templates/app-shell" className="text-accent hover:underline">
          C3 App Shell
        </Link>{" "}
        &mdash; the canonical starting point for a C3 application &mdash; ships for JavaFX as{" "}
        <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">PrizmAppShell</code>:
        top bar, status ticker, icon rail with an App Store, slide panels, and a full-bleed map
        canvas. Fill its slots rather than composing chrome from scratch.
      </p>
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
        <div className="min-w-0">
          <p className="text-sm text-fg-muted">
            Launch it standalone, or hit{" "}
            <strong className="font-medium text-fg">Launch App Shell</strong> in the gallery toolbar
            (it inherits the gallery&rsquo;s theme + pack):
          </p>
          <div className="mt-3">
            <CodeBlock
              language="bash"
              code={`cd javafx
gradle runShell`}
            />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="font-semibold tracking-tight">Same anatomy as the web</h3>
          <p className="mt-2 text-sm text-fg-muted">
            {" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">PrizmAppShell</code>{" "}
            mirrors the web App Shell &mdash; see the{" "}
            <Link href="/c3/templates/app-shell" className="text-accent hover:underline">
              template page
            </Link>{" "}
            for the layout, regions, and the design principles it embodies.
          </p>
        </div>
      </div>
    </section>
  );
}

function SeeItNatively() {
  return (
    <section className="mt-16 md:mt-20">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
        See it natively
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Run the gallery</h2>
      <p className="mt-4 max-w-3xl text-fg-muted">
        The docs site can&rsquo;t render JavaFX, so the visual reference is a runnable{" "}
        <strong className="font-medium text-fg">gallery</strong> — every JavaFX-ready component, in
        all variants and states, with live theme and pack toggles.
      </p>
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight">Run from source</h3>
          <p className="mt-2 text-sm text-fg-muted">
            With a JDK 21 toolchain (e.g.{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
              brew install --cask temurin@21
            </code>
            ):
          </p>
          <div className="mt-3">
            <CodeBlock
              language="bash"
              code={`cd javafx
gradle run`}
            />
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-bg-subtle p-6">
          <h3 className="font-semibold tracking-tight text-fg-muted">Packaged app — planned</h3>
          <p className="mt-2 text-sm text-fg-muted">
            A self-contained native build (no JDK required), produced with{" "}
            <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">
              gradle jpackage
            </code>
            . A download will be linked here once release hosting is set up; air-gapped builds ship
            it in the offline bundle.
          </p>
        </div>
      </div>
    </section>
  );
}

function Notes() {
  return (
    <section className="mt-16 grid gap-4 md:mt-20 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-bg-subtle p-6">
        <h3 className="font-semibold tracking-tight">Air-gap</h3>
        <p className="mt-2 text-sm text-fg-muted">
          OpenJFX is fetched from Maven Central at build time. In a disconnected build, point your
          repositories at the internal Maven mirror. The runtime is bundled by the consumer via
          jlink / jpackage.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-6">
        <h3 className="font-semibold tracking-tight">Building with AI</h3>
        <p className="mt-2 text-sm text-fg-muted">
          When asked to build a JavaFX C3 surface, an AI should reach for these components and{" "}
          <code className="rounded bg-bg-muted px-1 py-0.5 font-mono text-xs">PrizmTheme</code>{" "}
          rather than hand-rolling chrome &mdash; the same way it starts from the App Shell on the
          web.
        </p>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-accent" />
        <h3 className="font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-fg-muted">{children}</p>
    </div>
  );
}
