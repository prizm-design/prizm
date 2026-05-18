"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  useCommandState,
} from "@/components/ui/command";
import { COMPONENTS } from "@/lib/components-registry";
import { cn } from "@/lib/utils";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo } from "react";

interface SearchEntry {
  id: string;
  group: "Components" | "Docs" | "Zones";
  name: string;
  description?: string;
  href: string;
  icon: ReactNode;
  keywords: string[];
}

const DOC_ENTRIES: SearchEntry[] = [
  {
    id: "doc:getting-started",
    group: "Docs",
    name: "Getting started",
    description: "Install PRIZM and add your first component.",
    href: "/docs/getting-started",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["docs", "install"],
  },
  {
    id: "doc:using-with-ai",
    group: "Docs",
    name: "Using with AI",
    description: "How a team adopts PRIZM with AI in the loop — setup, prompts, air-gapped AI.",
    href: "/docs/using-with-ai",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: [
      "docs",
      "ai",
      "claude",
      "claude code",
      "cursor",
      "llm",
      "rag",
      "prompt",
      "team",
      "workflow",
    ],
  },
  {
    id: "doc:installation",
    group: "Docs",
    name: "Installation",
    description: "Detailed setup for new projects.",
    href: "/docs/installation",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["docs", "setup"],
  },
  {
    id: "doc:theming",
    group: "Docs",
    name: "Theming",
    description: "How the four-variant token system works.",
    href: "/docs/theming",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["docs", "tokens", "theme"],
  },
  {
    id: "doc:foundations",
    group: "Docs",
    name: "Foundations",
    description: "Index of the PRIZM foundation references.",
    href: "/docs/foundations",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["docs", "foundations", "tokens", "design language"],
  },
  {
    id: "doc:principles",
    group: "Docs",
    name: "Design principles",
    description: "Human factors and HCI research behind PRIZM's patterns.",
    href: "/docs/principles",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: [
      "docs",
      "foundations",
      "principles",
      "human factors",
      "HCI",
      "Endsley",
      "Fitts",
      "Norman",
      "research",
    ],
  },
  {
    id: "doc:colors",
    group: "Docs",
    name: "Colors",
    description: "Semantic tokens, baseline scales, and how they vary per theme.",
    href: "/docs/colors",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["docs", "foundations", "palette", "swatches", "tokens"],
  },
  {
    id: "doc:typography",
    group: "Docs",
    name: "Typography",
    description: "Font families, type scale, and weights used across PRIZM.",
    href: "/docs/typography",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["docs", "foundations", "fonts", "type", "scale", "Inter", "JetBrains"],
  },
  {
    id: "doc:surface-and-motion",
    group: "Docs",
    name: "Surface & motion",
    description: "Radii, shadows, and motion tokens (durations, ease curves).",
    href: "/docs/surface-and-motion",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: [
      "docs",
      "foundations",
      "radii",
      "radius",
      "shadow",
      "elevation",
      "motion",
      "duration",
      "ease",
    ],
  },
  {
    id: "doc:icons",
    group: "Docs",
    name: "Icons",
    description: "lucide-react at 1.5 stroke-width — sizes, pairing, accessibility, and catalog.",
    href: "/docs/icons",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["docs", "foundations", "icons", "lucide", "stroke", "svg", "iconography"],
  },
  {
    id: "doc:liquid-glass",
    group: "Docs",
    name: "Liquid glass",
    description: "C3-only translucent surface treatment with two tiers.",
    href: "/docs/liquid-glass",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: [
      "docs",
      "foundations",
      "c3",
      "glass",
      "liquid",
      "translucent",
      "frosted",
      "blur",
      "backdrop",
    ],
  },
  {
    id: "doc:air-gap",
    group: "Docs",
    name: "Air-gap setup",
    description: "Running PRIZM in disconnected environments.",
    href: "/docs/air-gap",
    icon: <BookOpen className="h-4 w-4" />,
    keywords: ["docs", "offline", "airgap"],
  },
];

const ZONE_ENTRIES: SearchEntry[] = [
  {
    id: "zone:c3-overview",
    group: "Zones",
    name: "C3 — Overview",
    description: "Design principles for command and control.",
    href: "/c3/overview",
    icon: <FileText className="h-4 w-4" />,
    keywords: ["c3", "zone", "command", "control"],
  },
  {
    id: "template:c3-app-shell",
    group: "Zones",
    name: "C3 — App Shell template",
    description: "Top bar, status ticker, icon rail, main canvas, expandable side panel.",
    href: "/c3/templates/app-shell",
    icon: <FileText className="h-4 w-4" />,
    keywords: ["c3", "template", "shell", "operator", "chrome", "icon rail"],
  },
  {
    id: "zone:enterprise-overview",
    group: "Zones",
    name: "Enterprise — Overview",
    description: "Design principles for enterprise apps.",
    href: "/enterprise/overview",
    icon: <FileText className="h-4 w-4" />,
    keywords: ["enterprise", "zone"],
  },
];

function buildIndex(): SearchEntry[] {
  const components: SearchEntry[] = COMPONENTS.map((c) => ({
    id: `component:${c.slug}`,
    group: "Components",
    name: c.name,
    description: c.description,
    href: `/components/${c.slug}`,
    icon: <ArrowRight className="h-4 w-4" />,
    keywords: [c.category, c.slug, c.description, c.builtOn ?? ""],
  }));
  return [...components, ...DOC_ENTRIES, ...ZONE_ENTRIES];
}

// Rank entries so prefix matches on the name outrank substring matches,
// which outrank description-only hits. With no query, leave order untouched.
function score(entry: SearchEntry, q: string): number {
  if (!q) return 1;
  const needle = q.toLowerCase();
  const name = entry.name.toLowerCase();
  if (name.startsWith(needle)) return 100;
  if (name.includes(needle)) return 50;
  const haystack = `${entry.description ?? ""} ${entry.keywords.join(" ")}`.toLowerCase();
  if (haystack.includes(needle)) return 10;
  return 0;
}

/**
 * Renders the ranked & grouped results inside the Command. Lives inside the
 * provider so it can read the live query from useCommandState.
 */
function RankedResults({
  entries,
  onNavigate,
}: {
  entries: SearchEntry[];
  onNavigate: (href: string) => void;
}) {
  const { query } = useCommandState();

  const grouped = useMemo(() => {
    const ranked = entries
      .map((e) => ({ entry: e, s: score(e, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.entry);
    const map = new Map<string, SearchEntry[]>();
    for (const entry of ranked) {
      const arr = map.get(entry.group) ?? [];
      arr.push(entry);
      map.set(entry.group, arr);
    }
    return Array.from(map.entries());
  }, [entries, query]);

  return (
    <>
      <CommandEmpty>No results for "{query}".</CommandEmpty>
      {grouped.map(([group, items]) => (
        <CommandGroup key={group} heading={group}>
          {items.map((entry) => (
            <CommandItem
              key={entry.id}
              value={entry.name}
              keywords={entry.keywords}
              onSelect={() => onNavigate(entry.href)}
              className="gap-3 py-2"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-fg-subtle aria-selected:text-accent">
                {entry.icon}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-fg">{entry.name}</span>
                {entry.description && (
                  <span className="truncate text-xs text-fg-muted">{entry.description}</span>
                )}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      ))}
    </>
  );
}

function Footer() {
  const { visibleIds } = useCommandState();
  return (
    <div className="flex items-center justify-between border-t border-border bg-bg-subtle px-3 py-2 text-[11px] text-fg-subtle">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded border border-border bg-bg px-1 py-0.5">↑↓</kbd> navigate
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded border border-border bg-bg px-1 py-0.5">↵</kbd> open
        </span>
      </div>
      <span>{visibleIds().length} results</span>
    </div>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const entries = useMemo(buildIndex, []);

  function navigate(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-bg/60 backdrop-blur-sm",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
            "transition-opacity duration-150",
          )}
        />
        <BaseDialog.Popup
          className={cn(
            "fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2",
            "overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg",
            "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
            "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
            "transition-all duration-150",
          )}
        >
          <BaseDialog.Title className="sr-only">Search PRIZM</BaseDialog.Title>
          <Command className="rounded-none">
            <CommandInput placeholder="Search components, docs, and zones..." autoFocus />
            <CommandList className="max-h-[60vh] p-1">
              <RankedResults entries={entries} onNavigate={navigate} />
            </CommandList>
            <Footer />
          </Command>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export function useCommandPaletteShortcut(onOpen: () => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen]);
}
