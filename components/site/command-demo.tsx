"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  useCommandState,
} from "@/components/ui/command";
import {
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  SettingsIcon,
} from "lucide-react";
import { useState } from "react";

interface Entry {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  keywords: string[];
}

const NAVIGATION: Entry[] = [
  {
    id: "dashboard",
    icon: LayoutDashboardIcon,
    title: "Dashboard",
    desc: "View today’s activity",
    keywords: ["home", "overview"],
  },
  {
    id: "calendar",
    icon: CalendarIcon,
    title: "Calendar",
    desc: "Upcoming events and meetings",
    keywords: ["schedule", "events"],
  },
  {
    id: "settings",
    icon: SettingsIcon,
    title: "Settings",
    desc: "Account and workspace preferences",
    keywords: ["preferences", "config"],
  },
];

const DOCUMENTATION: Entry[] = [
  {
    id: "getting-started",
    icon: BookOpenIcon,
    title: "Getting started",
    desc: "Install PRIZM and ship your first component",
    keywords: ["docs", "install", "setup"],
  },
  {
    id: "theming",
    icon: FileTextIcon,
    title: "Theming guide",
    desc: "Tokens, modes, and the four-variant system",
    keywords: ["tokens", "colors"],
  },
];

// Live result count, read from the Command context so it tracks the filter.
function ResultCount() {
  const { visibleIds } = useCommandState();
  const n = visibleIds().length;
  return (
    <span>
      {n} {n === 1 ? "result" : "results"}
    </span>
  );
}

function Row({
  entry,
  selected,
  onSelect,
}: {
  entry: Entry;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = entry.icon;
  return (
    <CommandItem className="group gap-3 py-2" keywords={entry.keywords} onSelect={onSelect}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-fg-subtle group-aria-selected:text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-fg">{entry.title}</span>
        <span className="truncate text-xs text-fg-muted">{entry.desc}</span>
      </span>
      {selected && <CheckIcon className="h-4 w-4 shrink-0 text-accent" aria-label="Selected" />}
    </CommandItem>
  );
}

export function CommandDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Command className="w-full max-w-md rounded-lg border border-border shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList className="max-h-72 p-1">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {NAVIGATION.map((entry) => (
            <Row
              key={entry.id}
              entry={entry}
              selected={selected === entry.id}
              onSelect={() => setSelected(entry.id)}
            />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Documentation">
          {DOCUMENTATION.map((entry) => (
            <Row
              key={entry.id}
              entry={entry}
              selected={selected === entry.id}
              onSelect={() => setSelected(entry.id)}
            />
          ))}
        </CommandGroup>
      </CommandList>
      <div className="flex items-center justify-between border-t border-border bg-bg-subtle px-3 py-2 text-[11px] text-fg-subtle">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-border bg-bg px-1 py-0.5">↑↓</kbd> navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-border bg-bg px-1 py-0.5">↵</kbd> select
          </span>
        </div>
        <ResultCount />
      </div>
    </Command>
  );
}
