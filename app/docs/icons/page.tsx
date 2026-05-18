import { CodeBlock } from "@/components/site/code-block";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Droplet,
  ExternalLink,
  Eye,
  FileText,
  Github,
  Home,
  Info,
  LayoutDashboard,
  LayoutGrid,
  type LucideIcon,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";

export const metadata = { title: "Icons" };

interface CatalogIcon {
  name: string;
  Icon: LucideIcon;
}

interface CatalogGroup {
  label: string;
  icons: CatalogIcon[];
}

const CATALOG: CatalogGroup[] = [
  {
    label: "Actions",
    icons: [
      { name: "Check", Icon: Check },
      { name: "X", Icon: X },
      { name: "Plus", Icon: Plus },
      { name: "Copy", Icon: Copy },
      { name: "Search", Icon: Search },
      { name: "Settings", Icon: Settings },
      { name: "ArrowRight", Icon: ArrowRight },
      { name: "ArrowLeft", Icon: ArrowLeft },
    ],
  },
  {
    label: "Chevrons",
    icons: [
      { name: "ChevronDown", Icon: ChevronDown },
      { name: "ChevronUp", Icon: ChevronUp },
      { name: "ChevronRight", Icon: ChevronRight },
      { name: "ChevronLeft", Icon: ChevronLeft },
    ],
  },
  {
    label: "Status & feedback",
    icons: [
      { name: "Info", Icon: Info },
      { name: "AlertTriangle", Icon: AlertTriangle },
      { name: "AlertCircle", Icon: AlertCircle },
      { name: "CheckCircle", Icon: CheckCircle },
      { name: "Bell", Icon: Bell },
    ],
  },
  {
    label: "People & containers",
    icons: [
      { name: "User", Icon: User },
      { name: "Users", Icon: Users },
      { name: "Home", Icon: Home },
      { name: "FileText", Icon: FileText },
      { name: "LayoutDashboard", Icon: LayoutDashboard },
      { name: "LayoutGrid", Icon: LayoutGrid },
      { name: "MessageSquare", Icon: MessageSquare },
      { name: "Eye", Icon: Eye },
    ],
  },
  {
    label: "Theme & state",
    icons: [
      { name: "Sun", Icon: Sun },
      { name: "Moon", Icon: Moon },
      { name: "Droplet", Icon: Droplet },
    ],
  },
  {
    label: "Misc",
    icons: [
      { name: "Github", Icon: Github },
      { name: "ExternalLink", Icon: ExternalLink },
    ],
  },
];

const SIZES = [
  {
    className: "h-3 w-3",
    px: "12px",
    useCase: "Inside Badge, dense status indicators, kbd glyphs",
  },
  {
    className: "h-3.5 w-3.5",
    px: "14px",
    useCase: "Small buttons (size sm), breadcrumb separators",
  },
  {
    className: "h-4 w-4",
    px: "16px (default)",
    useCase: "Most buttons, inline with body text, command palette",
  },
  {
    className: "h-5 w-5",
    px: "20px",
    useCase: "Section headers, icon rail items, foundation cards",
  },
  {
    className: "h-6 w-6",
    px: "24px",
    useCase: "Empty states, hero placements, oversized affordances",
  },
];

export default function IconsFoundationPage() {
  const totalIcons = CATALOG.reduce((sum, g) => sum + g.icons.length, 0);

  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Foundations</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Icons</h1>
      <p className="mt-3 max-w-3xl text-lg text-fg-muted">
        Icons in PRIZM use{" "}
        <a
          href="https://lucide.dev"
          className="text-accent underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer noopener"
        >
          lucide-react
        </a>{" "}
        — a wide, well-maintained, MIT-licensed set bundled as React components. No remote fetches,
        air-gap safe out of the box. PRIZM overrides the stroke-width site-wide for a lighter, more
        precise aesthetic.
      </p>

      {/* ============================================================
          The stroke-width decision
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">
          Stroke width
        </h2>
        <p className="mt-2 max-w-3xl text-fg-muted">
          Lucide's default{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">stroke-width</code>{" "}
          is <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">2</code>. PRIZM
          overrides to{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">1.5</code> via a
          single rule in{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
            app/globals.css
          </code>
          :
        </p>
        <div className="mt-4">
          <CodeBlock
            language="css"
            code={`@layer base {
  svg {
    stroke-width: 1.5;
  }
}`}
          />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <StrokeSample width={2} label="Default (lucide stock)" />
          <StrokeSample width={1.5} label="PRIZM site-wide" highlighted />
        </div>
        <p className="mt-4 text-sm text-fg-muted">
          The lighter stroke reads as more precise and pairs better with PRIZM's typography weights.
          The override applies to ALL svg elements site-wide. To deviate on a single icon, use the
          Tailwind arbitrary modifier (
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
            [stroke-width:2]
          </code>
          ) or inline style. The lucide{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">strokeWidth</code>{" "}
          prop is overridden by the CSS rule, so prop-level changes have no effect.
        </p>
      </section>

      {/* ============================================================
          Sizes
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Size scale</h2>
        <p className="mt-2 max-w-3xl text-fg-muted">
          Five sizes cover essentially every use case. Apply via Tailwind class on the icon element.
          Sizes are not enforced by tokens — the goal is to keep choices small and predictable, not
          to gate them.
        </p>
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-bg-subtle text-xs uppercase tracking-wider text-fg-subtle">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Class</th>
                <th className="px-4 py-2 text-left font-medium">Pixels</th>
                <th className="px-4 py-2 text-left font-medium">Use case</th>
                <th className="px-4 py-2 text-left font-medium">Sample</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SIZES.map((s) => (
                <tr key={s.className}>
                  <td className="px-4 py-3 font-mono text-xs text-fg">{s.className}</td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">{s.px}</td>
                  <td className="px-4 py-3 text-fg-muted">{s.useCase}</td>
                  <td className="px-4 py-3">
                    <Check className={s.className} aria-hidden />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          Pairing with text
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">
          Pairing with text
        </h2>
        <p className="mt-2 max-w-3xl text-fg-muted">
          Use{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
            inline-flex items-center
          </code>{" "}
          and an explicit gap that scales with the text. Vertical centering is rarely correct by
          default — let flex align them.
        </p>
        <div className="mt-6 space-y-4">
          <PairingRow
            sample={
              <span className="inline-flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4" />
                Continue
              </span>
            }
            label="h-4 w-4 + text-sm + gap-2"
            description="Default for buttons and inline calls to action"
          />
          <PairingRow
            sample={
              <span className="inline-flex items-center gap-1.5 text-xs">
                <Info className="h-3.5 w-3.5" />
                Helper text
              </span>
            }
            label="h-3.5 w-3.5 + text-xs + gap-1.5"
            description="Captions, hints, status chips"
          />
          <PairingRow
            sample={
              <span className="inline-flex items-center gap-3 text-base font-semibold">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </span>
            }
            label="h-5 w-5 + text-base + gap-3"
            description="Section headers, nav rail tooltips when expanded"
          />
        </div>
      </section>

      {/* ============================================================
          Accessibility
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">
          Accessibility
        </h2>
        <p className="mt-2 max-w-3xl text-fg-muted">The two rules that cover 95% of cases:</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="min-w-0 rounded-lg border border-border bg-surface p-5">
            <p className="text-sm font-semibold text-fg">Decorative (alongside a visible label)</p>
            <p className="mt-2 text-sm text-fg-muted">
              Add{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
                aria-hidden
              </code>{" "}
              so screen readers skip the icon. The label conveys the meaning.
            </p>
            <div className="mt-4">
              <CodeBlock
                language="tsx"
                code={`<Button>
  <Check className="h-4 w-4" aria-hidden />
  Save changes
</Button>`}
              />
            </div>
          </div>
          <div className="min-w-0 rounded-lg border border-border bg-surface p-5">
            <p className="text-sm font-semibold text-fg">Meaningful (icon-only control)</p>
            <p className="mt-2 text-sm text-fg-muted">
              Put{" "}
              <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
                aria-label
              </code>{" "}
              on the <em>container</em>, not the icon. The icon stays decorative.
            </p>
            <div className="mt-4">
              <CodeBlock
                language="tsx"
                code={`<Button variant="ghost" size="icon" aria-label="Settings">
  <Settings className="h-4 w-4" aria-hidden />
</Button>`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Catalog
          ============================================================ */}
      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">
              Common icons
            </h2>
            <p className="mt-2 max-w-3xl text-fg-muted">
              The {totalIcons} icons PRIZM uses most across components and templates. Not a full
              catalog — lucide ships{" "}
              <a
                href="https://lucide.dev/icons"
                className="text-accent underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer noopener"
              >
                ~1,500 icons
              </a>
              ; any of them can be imported the same way.
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-8">
          {CATALOG.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {group.label}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {group.icons.map(({ name, Icon }) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg-muted text-fg">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <code className="truncate font-mono text-xs text-fg-muted">{name}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-fg-muted">
          Import any of these by name from{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">lucide-react</code>:
        </p>
        <div className="mt-3">
          <CodeBlock
            language="tsx"
            code={`import { Check, Search, Settings } from "lucide-react";`}
          />
        </div>
      </section>

      {/* ============================================================
          Custom SVGs
          ============================================================ */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-fg-subtle">Custom SVGs</h2>
        <p className="mt-2 max-w-3xl text-fg-muted">
          For brand marks and product-specific glyphs lucide doesn't cover, write the SVG inline.
          Set{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">stroke-width</code>{" "}
          on each{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">&lt;path&gt;</code>{" "}
          directly — the site-wide{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
            svg {"{ stroke-width: 1.5 }"}
          </code>{" "}
          only affects elements that don't have an explicit per-path value. Include a{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">&lt;title&gt;</code>{" "}
          for accessibility.
        </p>
        <div className="mt-6 flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex shrink-0 items-center gap-3">
            <PrizmMark className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm font-semibold text-fg">PRIZM brand mark</p>
              <p className="text-xs text-fg-muted">Used in the site header and C3 App Shell</p>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <CodeBlock
              language="tsx"
              code={`<svg
  viewBox="0 0 24 24"
  fill="none"
  className="h-5 w-5 text-accent"
  aria-hidden
>
  <title>PRIZM</title>
  <path
    d="M12 2L22 20H2L12 2Z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
  />
  <path
    d="M12 2L12 20"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
  />
</svg>`}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          Air-gap
          ============================================================ */}
      <section className="mt-12 rounded-lg border border-dashed border-border bg-bg-subtle p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Air-gap</p>
        <p className="mt-2 max-w-3xl text-sm text-fg-muted">
          lucide-react ships every icon as a React component bundled into your build — no remote
          fetches. PRIZM's air-gap audit (
          <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-xs">pnpm audit:airgap</code>)
          does not flag lucide. Custom SVGs vendored inline are also safe. The only thing that would
          break air-gap discipline is referencing a remote icon font or external SVG URL — don't do
          that.
        </p>
      </section>
    </article>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

function StrokeSample({
  width,
  label,
  highlighted = false,
}: {
  width: number;
  label: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-lg border bg-surface p-5 ${
        highlighted ? "border-accent" : "border-border"
      }`}
    >
      <div className="flex shrink-0 items-center gap-3">
        {/* Inline SVG so we can set strokeWidth per-path (lucide's stroke is
            overridden by the site-wide rule). Uses a stroke-only outline so
            the difference is visible. */}
        <CheckOutline width={width} className="h-8 w-8 text-fg" />
        <Search style={{ strokeWidth: width }} className="h-8 w-8 text-fg" />
        <Bell style={{ strokeWidth: width }} className="h-8 w-8 text-fg" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-fg">{label}</p>
        <p className="text-xs text-fg-muted">stroke-width: {width}</p>
      </div>
    </div>
  );
}

function CheckOutline({ width, className }: { width: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <title>Check sample</title>
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PairingRow({
  sample,
  label,
  description,
}: {
  sample: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-surface p-4">
      <div className="min-w-[8rem] text-fg">{sample}</div>
      <div className="flex-1">
        <p className="font-mono text-xs text-fg">{label}</p>
        <p className="mt-0.5 text-xs text-fg-muted">{description}</p>
      </div>
    </div>
  );
}

function PrizmMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <title>PRIZM</title>
      <path d="M12 2L22 20H2L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 2L12 20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
