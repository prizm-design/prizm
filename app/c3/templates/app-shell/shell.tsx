"use client";

import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Droplet,
  Info,
  LayoutDashboard,
  LayoutGrid,
  Eye,
  HeartPulse,
  Home,
  Inbox,
  LifeBuoy,
  MessageSquare,
  Moon,
  Network,
  Pin,
  PinOff,
  Plane,
  ScrollText,
  Search,
  Square,
  Sun,
  Truck,
  Users,
  X,
} from "lucide-react";
import { type ComponentType, type ReactNode, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * SSR-safe live clock — returns null on first render (both server and client)
 * to avoid hydration mismatch, then begins ticking on the client. Components
 * using this should render a stable placeholder while `now` is null.
 */
function useNow(intervalMs: number): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

interface RailItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: { count: number; tone: "danger" | "warning" | "info" };
}

const CORE_APPS: RailItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "ops-log", label: "Ops Log", icon: <ScrollText className="h-5 w-5" /> },
  {
    id: "incidents",
    label: "Incidents",
    icon: <AlertTriangle className="h-5 w-5" />,
    badge: { count: 3, tone: "danger" },
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: <ClipboardList className="h-5 w-5" />,
    badge: { count: 2, tone: "warning" },
  },
  { id: "orbat", label: "ORBAT", icon: <Network className="h-5 w-5" /> },
  { id: "chat", label: "Chat", icon: <MessageSquare className="h-5 w-5" />, badge: { count: 5, tone: "info" } },
];


interface AddonAppSeed {
  id: string;
  label: string;
  icon: ReactNode;
  description: string;
  installed: boolean;
  pinned: boolean;
}

// Add-on catalogue — apps available beyond the core six. State (installed,
// pinned) is the demo's starting point and is mutated locally by the App
// Store panel. Pinned add-ons show up on the icon rail in a separate section
// below the core apps, capped at 3.
const ADDON_APPS_SEED: AddonAppSeed[] = [
  {
    id: "logistics",
    label: "Logistics",
    icon: <Truck className="h-5 w-5" />,
    description: "Convoys, supply lines, inventory.",
    installed: true,
    pinned: true,
  },
  {
    id: "intel",
    label: "INTEL",
    icon: <Eye className="h-5 w-5" />,
    description: "Threat reports, signals, observations.",
    installed: true,
    pinned: true,
  },
  {
    id: "air-ops",
    label: "Air Ops",
    icon: <Plane className="h-5 w-5" />,
    description: "Sortie planning, airspace status, fuel.",
    installed: true,
    pinned: true,
  },
  {
    id: "sar",
    label: "SAR",
    icon: <LifeBuoy className="h-5 w-5" />,
    description: "Search & rescue — teams, missions, last-known positions.",
    installed: true,
    pinned: false,
  },
  {
    id: "medical",
    label: "Medical",
    icon: <HeartPulse className="h-5 w-5" />,
    description: "Casualty handling, MEDEVAC coordination.",
    installed: false,
    pinned: false,
  },
  {
    id: "shelter",
    label: "Shelter",
    icon: <Home className="h-5 w-5" />,
    description: "Evacuation shelters — capacity, status, occupancy.",
    installed: false,
    pinned: false,
  },
];

const ADDON_PIN_CAP = 5;

const APP_STORE_ITEM: RailItem = {
  id: "app-store",
  label: "App Store",
  icon: <LayoutGrid className="h-5 w-5" />,
};

const STATUS_METRICS = [
  { label: "Active", value: 7 },
  { label: "Deployed", value: 34 },
  { label: "Personnel", value: 128 },
  { label: "Alerts", value: 12, tone: "danger" as const },
];

interface C3AppShellProps {
  className?: string;
}

/**
 * The C3 App Shell template — a reusable chrome layout for command-and-control
 * applications. Compose your app's content into the main canvas; use the icon
 * rail items to open contextual side panels.
 *
 * Always renders in PRIZM's C3 dark theme regardless of the parent's theme,
 * because dark is the canonical operator state per the design principles.
 */
export function C3AppShell({
  className,
  defaultGlass = false,
}: C3AppShellProps & { defaultGlass?: boolean }) {
  const [activeRailItem, setActiveRailItem] = useState<string | null>(null);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [glass, setGlass] = useState<boolean>(defaultGlass);
  const [rightPanel, setRightPanel] = useState<"notifications" | "workspace" | null>(null);
  const [addons, setAddons] = useState<AddonAppSeed[]>(ADDON_APPS_SEED);

  // Look up the active rail item in either the core apps or any pinned add-on.
  const installedAddons = useMemo(
    () => addons.filter((a) => a.installed),
    [addons],
  );
  const pinnedAddons = useMemo(
    () => installedAddons.filter((a) => a.pinned),
    [installedAddons],
  );
  // railLookup includes ALL installed add-ons (not just pinned) so the slide
  // panel can render an app launched from inside the App Store, regardless
  // of whether it has a rail icon.
  const railLookup = useMemo(
    () => [...CORE_APPS, ...installedAddons, APP_STORE_ITEM],
    [installedAddons],
  );
  const activeItem = railLookup.find((i) => i.id === activeRailItem) ?? null;
  const isAppStoreActive = activeRailItem === "app-store";

  function toggleRightPanel(panel: "notifications" | "workspace") {
    setRightPanel((current) => (current === panel ? null : panel));
  }

  function installAddon(id: string) {
    setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, installed: true } : a)));
  }

  function uninstallAddon(id: string) {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, installed: false, pinned: false } : a)),
    );
    // If the uninstalled app was the active rail panel, close it.
    setActiveRailItem((current) => (current === id ? null : current));
  }

  function launchAddon(id: string) {
    setActiveRailItem(id);
    setPanelExpanded(false);
  }

  function setAddonPinned(id: string, pinned: boolean) {
    setAddons((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (pinned && prev.filter((x) => x.installed && x.pinned).length >= ADDON_PIN_CAP) {
          // Silently ignore; UI disables the control when at cap.
          return a;
        }
        return { ...a, pinned };
      }),
    );
  }

  function handleRailClick(id: string) {
    if (activeRailItem === id) {
      // Re-clicking the active item closes the panel.
      setActiveRailItem(null);
      setPanelExpanded(false);
    } else {
      setActiveRailItem(id);
      setPanelExpanded(false);
    }
  }

  function handleClose() {
    setActiveRailItem(null);
    setPanelExpanded(false);
  }

  function toggleMode() {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  }

  // WebKit/Blink keep a compositor cache for elements with `backdrop-filter`.
  // When the swatch class flips (dark ↔ light) and the inherited
  // `--prizm-glass-*` variables resolve to new values, the CSS engine has the
  // right values but the GPU layer doesn't always invalidate, so the surface
  // visually stays in the old tint until a tab-switch forces a full recomposite.
  // Force the issue by briefly suppressing `backdrop-filter`, letting the
  // surfaces repaint with the new background-color, then restoring it on the
  // next frame.
  useEffect(() => {
    if (!glass) return;
    const root = document.querySelector(`.swatch-c3-${mode}`);
    if (!root) return;
    const surfaces = root.querySelectorAll<HTMLElement>(
      ".surface-glass-chrome, .surface-glass-panel",
    );
    surfaces.forEach((el) => {
      el.style.setProperty("backdrop-filter", "none", "important");
      el.style.setProperty("-webkit-backdrop-filter", "none", "important");
    });
    const raf = requestAnimationFrame(() => {
      surfaces.forEach((el) => {
        el.style.removeProperty("backdrop-filter");
        el.style.removeProperty("-webkit-backdrop-filter");
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [mode, glass]);

  function toggleGlass() {
    setGlass((g) => !g);
  }

  // In glass mode the canvas is full-bleed and the chrome floats on top with
  // surface-glass classes. In solid mode the chrome has solid backgrounds but
  // the layout is the same — the canvas always extends edge-to-edge so the
  // visual structure is consistent across both treatments.
  return (
    <TooltipProvider delay={150}>
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-bg text-fg",
          mode === "dark" ? "swatch-c3-dark" : "swatch-c3-light",
          className,
        )}
      >
        {/* Base layer — canvas fills the entire shell */}
        <MainCanvas className="absolute inset-0" />

        {/* Top chrome — top bar + status ticker, floating overlays */}
        <div className="absolute inset-x-0 top-0 z-30">
          <TopBar
            mode={mode}
            glass={glass}
            onToggleMode={toggleMode}
            onToggleGlass={toggleGlass}
            onToggleNotifications={() => toggleRightPanel("notifications")}
            onToggleWorkspace={() => toggleRightPanel("workspace")}
          />
          <StatusTicker glass={glass} />
        </div>

        {/* Left chrome — icon rail, starts below top chrome */}
        <IconRail
          glass={glass}
          activeId={activeRailItem}
          onSelect={handleRailClick}
          pinnedAddons={pinnedAddons}
          className="absolute left-0 top-[5.5rem] bottom-0 z-20"
        />

        {/* Left-anchored slide panel — opens adjacent to the icon rail */}
        {activeItem && !isAppStoreActive && (
          <SlidePanel
            glass={glass}
            item={activeItem}
            expanded={panelExpanded}
            onToggleExpand={() => setPanelExpanded((v) => !v)}
            onClose={handleClose}
          />
        )}
        {isAppStoreActive && (
          <AppStorePanel
            glass={glass}
            addons={addons}
            expanded={panelExpanded}
            onToggleExpand={() => setPanelExpanded((v) => !v)}
            onInstall={installAddon}
            onUninstall={uninstallAddon}
            onSetPinned={setAddonPinned}
            onLaunch={launchAddon}
            onClose={handleClose}
          />
        )}

        {/* Right-anchored panels — one at a time */}
        {rightPanel === "notifications" && (
          <NotificationPanel glass={glass} onClose={() => setRightPanel(null)} />
        )}
        {rightPanel === "workspace" && (
          <WorkspacePanel glass={glass} onClose={() => setRightPanel(null)} />
        )}
      </div>
    </TooltipProvider>
  );
}

/* ============================================================
   Top bar — 56 px, brand + current app + notifications + theme + avatar
   ============================================================ */

function TopBar({
  mode,
  glass,
  onToggleMode,
  onToggleGlass,
  onToggleNotifications,
  onToggleWorkspace,
}: {
  mode: "light" | "dark";
  glass: boolean;
  onToggleMode: () => void;
  onToggleGlass: () => void;
  onToggleNotifications: () => void;
  onToggleWorkspace: () => void;
}) {
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-3 border-b border-border px-3",
        glass ? "surface-glass-chrome" : "bg-surface",
      )}
    >
      <BrandMark />
      <div className="ml-auto flex items-center gap-2">
        <Badge variant="success" className="gap-1.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          ONLINE
        </Badge>
        <NotificationButton onClick={onToggleNotifications} />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleGlass}
                aria-label={glass ? "Switch to solid surfaces" : "Switch to liquid glass surfaces"}
                aria-pressed={glass}
              >
                {glass ? <Square className="h-4 w-4" /> : <Droplet className="h-4 w-4" />}
              </Button>
            }
          />
          <TooltipContent>{glass ? "Switch to solid" : "Switch to glass"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMode}
                aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {mode === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            }
          />
          <TooltipContent>
            {mode === "dark" ? "Switch to light" : "Switch to dark"}
          </TooltipContent>
        </Tooltip>
        <button
          type="button"
          onClick={onToggleWorkspace}
          aria-label="Open workspace"
          className="relative rounded-full transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <span
            className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-success ring-2 ring-surface"
            aria-label="On duty"
          />
        </button>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-accent"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <title>Brand</title>
        <path d="M12 2L22 20H2L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 2L12 20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className="font-semibold tracking-tight">
        C3
        <span className="ml-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-fg-subtle">
          DSTA
        </span>
      </span>
    </div>
  );
}

function NotificationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Notifications"
      className="relative"
      onClick={onClick}
    >
      <Bell className="h-4 w-4" />
      <span className="absolute -right-0.5 -top-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-1 font-mono text-[9px] font-semibold leading-none text-danger-fg ring-2 ring-surface">
        9+
      </span>
    </Button>
  );
}

/* ============================================================
   Status ticker — 32 px, aggregate metrics + clock
   ============================================================ */

function StatusTicker({ glass }: { glass: boolean }) {
  const now = useNow(1000);
  // Exercise anchored 2 hours before mount — gives the demo clock a plausible
  // non-zero starting value (so it reads as "exercise in progress").
  const [exerciseStartedAt] = useState(() => Date.now() - 2 * 3600 * 1000);

  // NBSP placeholders during SSR / first paint keep ticker height stable
  // and avoid hydration mismatch on the dynamic time content.
  const localClock = now == null ? " " : formatLocalClock(new Date(now));
  const localTz = now == null ? " " : formatLocalTz(new Date(now));
  const utcClock = now == null ? " " : formatUtcClock(new Date(now));
  const exClock = now == null ? " " : formatExerciseElapsed(now - exerciseStartedAt);

  return (
    <div
      className={cn(
        "flex h-8 items-center gap-6 border-b border-border px-3 text-xs",
        glass ? "surface-glass-chrome" : "bg-bg-subtle",
      )}
    >
      {STATUS_METRICS.map((m) => (
        <div key={m.label} className="flex items-center gap-1.5">
          <span className="text-fg-subtle">{m.label}</span>
          <span
            className={cn(
              "font-mono font-semibold tabular-nums",
              m.tone === "danger" ? "text-danger" : "text-fg",
            )}
          >
            {m.value}
          </span>
        </div>
      ))}
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-fg-subtle">LOCAL</span>
          <span className="font-mono text-fg tabular-nums" suppressHydrationWarning>
            {localClock}
          </span>
          <span className="font-mono text-[10px] text-fg-subtle" suppressHydrationWarning>
            {localTz}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-fg-subtle">UTC</span>
          <span className="font-mono text-fg-muted tabular-nums" suppressHydrationWarning>
            {utcClock}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-fg-subtle">EX</span>
          <span className="font-mono text-warning tabular-nums" suppressHydrationWarning>
            {exClock}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatUtcClock(d: Date): string {
  const hh = d.getUTCHours().toString().padStart(2, "0");
  const mm = d.getUTCMinutes().toString().padStart(2, "0");
  const ss = d.getUTCSeconds().toString().padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatLocalClock(d: Date): string {
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatLocalTz(d: Date): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(d);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}

function formatExerciseElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const rest = totalSeconds % 86400;
  const hh = Math.floor(rest / 3600).toString().padStart(2, "0");
  const mm = Math.floor((rest % 3600) / 60).toString().padStart(2, "0");
  const ss = (rest % 60).toString().padStart(2, "0");
  return `D+${days.toString().padStart(2, "0")} ${hh}:${mm}:${ss}`;
}

/* ============================================================
   Icon rail — 64 px, vertical icon-only nav
   ============================================================ */

function IconRail({
  glass,
  activeId,
  onSelect,
  pinnedAddons,
  className,
}: {
  glass: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  pinnedAddons: AddonAppSeed[];
  className?: string;
}) {
  const appStoreActive = activeId === APP_STORE_ITEM.id;
  return (
    <nav
      className={cn(
        "flex w-16 flex-col items-center border-r border-border",
        glass ? "surface-glass-chrome" : "bg-surface",
        className,
      )}
    >
      {/* Scrollable section — holds core apps + pinned add-ons. Scrolls
          vertically when the rail can't fit everything at the current
          viewport (e.g. all 5 add-ons pinned on a short viewport). The
          App Store stays pinned at the bottom outside this scroll area
          per "predictable information placement". */}
      <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-2">
        {CORE_APPS.map((item) => (
          <RailButton
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onSelect={onSelect}
          />
        ))}

        {pinnedAddons.length > 0 && (
          <>
            <div className="my-1 h-px w-8 bg-border" aria-hidden />
            {pinnedAddons.map((item) => (
              <RailButton
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                onSelect={onSelect}
              />
            ))}
          </>
        )}
      </div>

      {/* App Store — always pinned at the bottom, outside the scroll area */}
      <div className="flex shrink-0 flex-col items-center gap-1 pb-2">
        <div className="h-px w-8 bg-border" aria-hidden />
        <Tooltip>
          <TooltipTrigger
            onClick={() => onSelect(APP_STORE_ITEM.id)}
            aria-label="App Store"
            aria-pressed={appStoreActive}
            data-active={appStoreActive ? "" : undefined}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-md text-fg-muted transition-colors",
              "hover:bg-bg-muted hover:text-fg",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              "data-[active]:bg-bg-muted data-[active]:text-accent",
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            App Store
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
}

function RailButton({
  item,
  isActive,
  onSelect,
}: {
  item: RailItem;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => onSelect(item.id)}
        aria-label={item.label}
        aria-pressed={isActive}
        data-active={isActive ? "" : undefined}
        className={cn(
          "relative inline-flex h-11 w-11 items-center justify-center rounded-md text-fg-muted transition-colors",
          "hover:bg-bg-muted hover:text-fg",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "data-[active]:bg-bg-muted data-[active]:text-accent",
        )}
      >
        {item.icon}
        {/* Notification-style badge count, top-right */}
        {item.badge && (
          <span
            className={cn(
              "absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-[10px] font-semibold",
              item.badge.tone === "danger" && "bg-danger text-danger-fg",
              item.badge.tone === "warning" && "bg-warning text-fg",
              item.badge.tone === "info" && "bg-info text-fg",
            )}
          >
            {item.badge.count}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

/* ============================================================
   Main canvas — placeholder slot for the actual app content
   ============================================================ */

/**
 * Stylized map placeholder. No real geography, no map library — just a visual
 * scaffold that reads as "tactical map area" so the shell doesn't sit on an
 * empty canvas. Substitute your real map / dashboard / content here.
 */
function MainCanvas({ className }: { className?: string }) {
  // Markers are positioned to overlap the App Shell's chrome regions so the
  // canvas content is visibly refracted through the glass treatment when
  // glass mode is enabled. Top bar + status ticker occupy y: 0-12% (88px on
  // a ~720px canvas); icon rail occupies x: 0-9% (64px on a ~700px canvas);
  // side panels open at x: 9-60% (slide) or x: right side (notification /
  // workspace).
  const markers: {
    left: string;
    top: string;
    tone: "accent" | "danger";
    size?: "sm" | "md" | "lg";
    pulse?: boolean;
  }[] = [
    // Under the top bar / status ticker band (y: 0-12%) — chrome glass refracts these
    { left: "18%", top: "4%", tone: "accent", size: "sm" },
    { left: "32%", top: "8%", tone: "danger", size: "md", pulse: true },
    { left: "50%", top: "5%", tone: "accent", size: "sm" },
    { left: "68%", top: "9%", tone: "accent", size: "md" },
    { left: "86%", top: "6%", tone: "accent", size: "sm" },
    // Down the icon rail strip (x: 0-9%) — rail glass refracts these
    { left: "3%", top: "25%", tone: "accent", size: "sm" },
    { left: "5%", top: "55%", tone: "accent", size: "sm" },
    { left: "4%", top: "80%", tone: "danger", size: "sm" },
    // Free canvas — visible without any glass over them, for contrast
    { left: "30%", top: "40%", tone: "accent", size: "md" },
    { left: "55%", top: "52%", tone: "accent", size: "lg", pulse: true },
    { left: "44%", top: "70%", tone: "accent", size: "md" },
    { left: "72%", top: "38%", tone: "danger", size: "md" },
    { left: "82%", top: "62%", tone: "accent", size: "md" },
    { left: "65%", top: "82%", tone: "accent", size: "sm" },
  ];

  return (
    <main
      className={cn("overflow-hidden bg-bg", className)}
      aria-label="Map canvas (placeholder)"
    >
      {/* Radial accent glows — give backdrop-saturate something to amplify so
          the glass treatment reads clearly. Two zones: one cyan accent over
          the central canvas, one danger over the top-right where the right
          panels open. Subtle (~18-20% peak opacity); the grid + terrain
          still dominate the visual hierarchy. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 35% 60%, var(--color-accent) 0%, transparent 70%), radial-gradient(ellipse 35% 35% at 78% 25%, var(--color-danger) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 65% 78%, var(--color-accent) 0%, transparent 70%)",
          opacity: 0.16,
        }}
        aria-hidden
      />

      {/* Minor grid (12 px) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 0.5px, transparent 0.5px), linear-gradient(to bottom, var(--color-border) 0.5px, transparent 0.5px)",
          backgroundSize: "12px 12px",
        }}
        aria-hidden
      />
      {/* Major grid (96 px) */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
        aria-hidden
      />

      {/* Abstract "coastline" curve — purely decorative */}
      <svg
        className="absolute inset-0 h-full w-full text-fg-subtle opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <title>Map terrain placeholder</title>
        <path
          d="M0,72 C12,68 22,76 30,70 C40,62 50,68 60,60 C72,50 84,58 92,52 L100,50 L100,100 L0,100 Z"
          fill="currentColor"
          opacity="0.4"
        />
        <path
          d="M0,72 C12,68 22,76 30,70 C40,62 50,68 60,60 C72,50 84,58 92,52 L100,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.8"
        />
      </svg>

      {/* Route line — extended to pass through the top chrome band, then
          down through the canvas, exiting bottom-right. Glass refraction is
          most visible along lines/edges, so a route that crosses chrome
          regions gives the effect more to amplify. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-accent"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <title>Route line placeholder</title>
        <path
          d="M 8 5 Q 22 8, 32 25 T 55 52 Q 70 60, 85 65 T 98 88"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 1.2"
          opacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Markers */}
      {markers.map((m, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: m.left, top: m.top }}
        >
          <div className="relative">
            {m.pulse && (
              <span
                className={cn(
                  "absolute inset-0 -m-1 animate-ping rounded-full",
                  m.tone === "danger" ? "bg-danger/40" : "bg-accent/40",
                )}
              />
            )}
            <span
              className={cn(
                "relative block rounded-full ring-2",
                m.size === "sm" && "h-2 w-2",
                (!m.size || m.size === "md") && "h-2.5 w-2.5",
                m.size === "lg" && "h-3 w-3",
                m.tone === "danger"
                  ? "bg-danger ring-danger/30"
                  : "bg-accent ring-accent/30",
              )}
            />
          </div>
        </div>
      ))}

      {/* Compass rose — top-right */}
      <div className="absolute right-3 top-3">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          className="text-fg-muted"
          aria-hidden
        >
          <title>Compass</title>
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <path d="M16 4 L16 28 M4 16 L28 16" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <path d="M16 4 L19 14 L16 12 L13 14 Z" fill="currentColor" />
          <text x="16" y="2.5" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="monospace">N</text>
        </svg>
      </div>

      {/* Scale bar — bottom-left */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1 font-mono text-[10px] text-fg-muted">
        <div className="flex h-1.5">
          <span className="w-12 border border-fg-muted bg-fg-muted/30" />
          <span className="w-12 border border-fg-muted" />
        </div>
        <div className="flex w-24 justify-between">
          <span>0</span>
          <span>1km</span>
          <span>2km</span>
        </div>
      </div>

      {/* Placeholder label — bottom-right, subtle */}
      <div className="absolute bottom-3 right-3 rounded border border-dashed border-border bg-bg/80 px-2 py-1 font-mono text-[10px] text-fg-subtle backdrop-blur-sm">
        Map placeholder — substitute your real map here
      </div>
    </main>
  );
}

/* ============================================================
   Slide panel — anchored against the icon rail's right edge, opens
   into the canvas. Two width states (standard + expanded).
   ============================================================ */

function SlidePanel({
  glass,
  item,
  expanded,
  onToggleExpand,
  onClose,
}: {
  glass: boolean;
  item: RailItem;
  expanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
}) {
  return (
    <aside
      className={cn(
        "absolute left-16 top-[5.5rem] bottom-0 z-10 flex flex-col border-r border-border shadow-lg",
        glass ? "surface-glass-panel" : "bg-surface",
        "transition-[width] duration-300",
        expanded ? "w-[calc(100%-4rem)]" : "w-[360px]",
      )}
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <span className="text-fg-muted">{item.icon}</span>
        <span className="text-sm font-semibold text-fg">{item.label}</span>
        <div className="ml-auto flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onToggleExpand}
                  aria-label={expanded ? "Collapse panel" : "Expand panel"}
                >
                  {expanded ? (
                    <ChevronsLeft className="h-4 w-4" />
                  ) : (
                    <ChevronsRight className="h-4 w-4" />
                  )}
                </Button>
              }
            />
            <TooltipContent>{expanded ? "Collapse" : "Expand"}</TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-fg-muted">
          {item.label} panel content — your app's UI for this view goes here. The panel opens
          adjacent to the icon rail and supports two width states: standard (360px) and expanded
          (full canvas width).
        </p>
      </div>
    </aside>
  );
}

/* ============================================================
   Notification panel — right-anchored, opens from the bell icon.
   Independent of the icon-rail slide panel (both can be open).
   ============================================================ */

type NotificationTone = "danger" | "warning" | "info" | "success";

interface NotificationSeed {
  id: string;
  tone: NotificationTone;
  title: string;
  description: string;
  /** Minutes before mount-time this notification was created. */
  minutesAgo: number;
  read: boolean;
}

interface NotificationItem {
  id: string;
  tone: NotificationTone;
  title: string;
  description: string;
  /** Millisecond timestamp computed at mount, relative to which "time ago" is formatted. */
  createdAt: number;
  read: boolean;
}

const NOTIFICATION_SEEDS: NotificationSeed[] = [
  {
    id: "n1",
    tone: "danger",
    title: "Incident reported",
    description: "Sector 7-G — escalated to Priority 1. Two units dispatched.",
    minutesAgo: 2,
    read: false,
  },
  {
    id: "n2",
    tone: "warning",
    title: "Vehicle V-04 lost signal",
    description: "Last known position recorded. Reconnection attempts in progress.",
    minutesAgo: 8,
    read: false,
  },
  {
    id: "n3",
    tone: "danger",
    title: "Perimeter breach",
    description: "Motion detected on west fence line. Camera feed available.",
    minutesAgo: 12,
    read: false,
  },
  {
    id: "n4",
    tone: "info",
    title: "Personnel update",
    description: "Bravo team reported on station and awaiting orders.",
    minutesAgo: 23,
    read: true,
  },
  {
    id: "n5",
    tone: "success",
    title: "Supply drop confirmed",
    description: "Cache 12 received by Alpha team. Inventory updated.",
    minutesAgo: 60,
    read: true,
  },
  {
    id: "n6",
    tone: "info",
    title: "Shift handover scheduled",
    description: "Watch B taking over at 16:00. Briefing notes attached.",
    minutesAgo: 180,
    read: true,
  },
  {
    id: "n7",
    tone: "warning",
    title: "Weather advisory",
    description: "Storm cell tracking east — ETA 4 hours. Review contingency.",
    minutesAgo: 1440,
    read: true,
  },
];

function formatRelativeTime(createdAt: number, now: number): string {
  const minutes = Math.max(0, Math.floor((now - createdAt) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  if (minutes < 2880) return "Yesterday";
  return `${Math.floor(minutes / 1440)}d ago`;
}

const SEVERITY_ICON: Record<NotificationTone, ComponentType<{ className?: string }>> = {
  danger: AlertTriangle,
  warning: AlertCircle,
  info: Info,
  success: CheckCircle,
};

const SEVERITY_COLOR: Record<NotificationTone, string> = {
  danger: "text-danger",
  warning: "text-warning",
  info: "text-info",
  success: "text-success",
};

type NotificationFilter = "all" | "unread" | "alerts";

function NotificationPanel({ glass, onClose }: { glass: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const mountTime = Date.now();
    return NOTIFICATION_SEEDS.map(({ minutesAgo, ...rest }) => ({
      ...rest,
      createdAt: mountTime - minutesAgo * 60_000,
    }));
  });
  const [filter, setFilter] = useState<NotificationFilter>("all");
  // Refresh relative times once a minute — enough resolution for "Xm ago" rendering.
  const now = useNow(60_000);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.read);
    if (filter === "alerts") return notifications.filter((n) => n.tone === "danger");
    return notifications;
  }, [notifications, filter]);

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <aside
      className={cn(
        "absolute right-0 top-[5.5rem] bottom-0 z-20 flex w-[360px] flex-col border-l border-border shadow-lg",
        glass ? "surface-glass-panel" : "bg-surface",
      )}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <Bell className="h-4 w-4 text-fg-muted" />
        <span className="text-sm font-semibold text-fg">Notification Centre</span>
        {unreadCount > 0 && (
          <Badge variant="info" className="ml-1 px-1.5 py-0 font-mono text-[10px]">
            {unreadCount} unread
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={onClose}
          aria-label="Close notification centre"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-3 py-2">
        {(["all", "unread", "alerts"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize transition-colors",
              filter === f
                ? "bg-bg-muted text-fg"
                : "text-fg-muted hover:bg-bg-muted/50 hover:text-fg",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 py-12 text-center text-xs text-fg-subtle">
            No {filter === "all" ? "" : filter} notifications.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((n) => {
              const SeverityIcon = SEVERITY_ICON[n.tone];
              return (
                <li
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") markRead(n.id);
                  }}
                  role="button"
                  tabIndex={0}
                  className="group flex cursor-default items-start gap-3 px-3 py-3 transition-colors hover:bg-bg-muted/40 focus-visible:bg-bg-muted/40 focus-visible:outline-none"
                >
                  <SeverityIcon className={cn("mt-0.5 h-4 w-4 shrink-0", SEVERITY_COLOR[n.tone])} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {!n.read && (
                        <span
                          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          aria-label="Unread"
                        />
                      )}
                      <span
                        className={cn(
                          "truncate text-sm",
                          n.read ? "text-fg-muted" : "font-semibold text-fg",
                        )}
                      >
                        {n.title}
                      </span>
                    </div>
                    <p className={cn("mt-1 text-xs", n.read ? "text-fg-subtle" : "text-fg-muted")}>
                      {n.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className="font-mono text-[10px] text-fg-subtle"
                      suppressHydrationWarning
                    >
                      {now == null ? " " : formatRelativeTime(n.createdAt, now)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(n.id);
                      }}
                      aria-label="Dismiss"
                      className="rounded-sm text-fg-muted opacity-0 transition-opacity hover:text-fg group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between border-t border-border px-3 py-2 text-[11px] text-fg-muted">
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="rounded transition-colors hover:text-fg disabled:cursor-default disabled:opacity-50 disabled:hover:text-fg-muted"
        >
          Mark all read
        </button>
        <button type="button" className="hover:text-fg">
          View history
        </button>
      </div>
    </aside>
  );
}

/* ============================================================
   Workspace panel — right-anchored, opens from the user avatar.
   Contains the user card, workspace switcher, and sign-out.
   ============================================================ */

interface Workspace {
  id: string;
  name: string;
  detail: string;
  tone?: NotificationTone;
}

const WORKSPACES: Workspace[] = [
  { id: "w1", name: "Exercise Alpha", detail: "Active scenario · D+00 02:00", tone: "warning" },
  { id: "w2", name: "Sector 7 Watch", detail: "Live operations", tone: "danger" },
  { id: "w3", name: "Training Sandbox", detail: "Sandbox · no consequences", tone: "info" },
  { id: "w4", name: "Archive", detail: "Read-only past exercises" },
];

function WorkspacePanel({ glass, onClose }: { glass: boolean; onClose: () => void }) {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("w1");

  return (
    <aside
      className={cn(
        "absolute right-0 top-[5.5rem] bottom-0 z-20 flex w-[360px] flex-col border-l border-border shadow-lg",
        glass ? "surface-glass-panel" : "bg-surface",
      )}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <Users className="h-4 w-4 text-fg-muted" />
        <span className="text-sm font-semibold text-fg">Workspace</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={onClose}
          aria-label="Close workspace"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* User card */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-3 py-4">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <span
            className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-success ring-2 ring-surface"
            aria-label="On duty"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-wide text-fg">MAJ A. LOH</p>
          <p className="mt-0.5 truncate text-xs text-fg-muted">Watch Officer · DSTA</p>
        </div>
      </div>

      {/* Workspace switcher */}
      <div className="flex-1 overflow-y-auto">
        <p className="px-3 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
          Workspaces
        </p>
        <ul>
          {WORKSPACES.map((w) => {
            const isActive = w.id === activeWorkspaceId;
            return (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() => setActiveWorkspaceId(w.id)}
                  className={cn(
                    "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors",
                    isActive ? "bg-bg-muted" : "hover:bg-bg-muted/40",
                  )}
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                    {isActive ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <span className="h-3 w-3 rounded-full border border-border" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "truncate text-sm",
                          isActive ? "font-semibold text-fg" : "text-fg",
                        )}
                      >
                        {w.name}
                      </span>
                      {w.tone && (
                        <Badge
                          variant={w.tone}
                          className="px-1.5 py-0 text-[10px] uppercase tracking-wider"
                        >
                          {w.tone === "danger"
                            ? "Live"
                            : w.tone === "warning"
                              ? "Exercise"
                              : w.tone === "info"
                                ? "Training"
                                : "OK"}
                        </Badge>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-fg-muted">{w.detail}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between border-t border-border px-3 py-2 text-[11px] text-fg-muted">
        <button type="button" className="hover:text-fg">
          Workspace settings
        </button>
        <button type="button" className="text-danger hover:underline">
          Sign out
        </button>
      </div>
    </aside>
  );
}

/* ============================================================
   App Store panel — right-anchored, opens from the LayoutGrid icon at the
   bottom of the rail. Lets the operator install / uninstall add-on apps and
   pin / unpin them to the rail. Pinned add-ons cap at ADDON_PIN_CAP (3) —
   when at cap, the pin toggle is disabled until something is unpinned.
   ============================================================ */

type AppStoreFilter = "all" | "installed" | "available";

function AppStorePanel({
  glass,
  addons,
  expanded,
  onToggleExpand,
  onInstall,
  onUninstall,
  onSetPinned,
  onLaunch,
  onClose,
}: {
  glass: boolean;
  addons: AddonAppSeed[];
  expanded: boolean;
  onToggleExpand: () => void;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
  onSetPinned: (id: string, pinned: boolean) => void;
  onLaunch: (id: string) => void;
  onClose: () => void;
}) {
  const [filter, setFilter] = useState<AppStoreFilter>("all");

  const pinnedCount = addons.filter((a) => a.installed && a.pinned).length;
  const installedCount = addons.filter((a) => a.installed).length;
  const atCap = pinnedCount >= ADDON_PIN_CAP;

  const filtered = useMemo(() => {
    if (filter === "installed") return addons.filter((a) => a.installed);
    if (filter === "available") return addons.filter((a) => !a.installed);
    return addons;
  }, [addons, filter]);

  return (
    <aside
      className={cn(
        "absolute left-16 top-[5.5rem] bottom-0 z-10 flex flex-col border-r border-border shadow-lg",
        glass ? "surface-glass-panel" : "bg-surface",
        "transition-[width] duration-300",
        expanded ? "w-[calc(100%-4rem)]" : "w-[360px]",
      )}
    >
      {/* Header — matches the SlidePanel chrome: icon · label · expand · close */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <LayoutGrid className="h-4 w-4 text-fg-muted" />
        <span className="text-sm font-semibold text-fg">App Store</span>
        <Badge variant="subtle" className="ml-1 px-1.5 py-0 font-mono text-[10px]">
          {pinnedCount} / {ADDON_PIN_CAP} pinned
        </Badge>
        <div className="ml-auto flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              onClick={onToggleExpand}
              aria-label={expanded ? "Collapse panel" : "Expand panel"}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors",
                "hover:bg-bg-muted hover:text-fg",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              )}
            >
              {expanded ? (
                <ChevronsLeft className="h-4 w-4" />
              ) : (
                <ChevronsRight className="h-4 w-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>{expanded ? "Collapse" : "Expand"}</TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
            aria-label="Close App Store"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-3 py-2">
        {(["all", "installed", "available"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize transition-colors",
              filter === f
                ? "bg-bg-muted text-fg"
                : "text-fg-muted hover:bg-bg-muted/50 hover:text-fg",
            )}
          >
            {f}
            {f === "installed" && installedCount > 0 && ` (${installedCount})`}
          </button>
        ))}
      </div>

      {/* Apps list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 py-12 text-center text-xs text-fg-subtle">
            No {filter === "all" ? "" : filter} add-on apps.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((app) => (
              <AppRow
                key={app.id}
                app={app}
                atCap={atCap}
                onInstall={() => onInstall(app.id)}
                onUninstall={() => onUninstall(app.id)}
                onTogglePin={() => onSetPinned(app.id, !app.pinned)}
                onLaunch={() => onLaunch(app.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Footer hint */}
      <div className="shrink-0 border-t border-border px-3 py-2 text-[11px] text-fg-muted">
        Pinned add-ons appear in the icon rail (up to {ADDON_PIN_CAP}). Unpin to free a slot.
      </div>
    </aside>
  );
}

function AppRow({
  app,
  atCap,
  onInstall,
  onUninstall,
  onTogglePin,
  onLaunch,
}: {
  app: AddonAppSeed;
  atCap: boolean;
  onInstall: () => void;
  onUninstall: () => void;
  onTogglePin: () => void;
  onLaunch: () => void;
}) {
  const pinDisabled = !app.pinned && atCap;
  // Unpinned installed apps can be launched by clicking the row. Pinned
  // apps don't need this — they're already 1-click from the rail.
  const rowLaunchable = app.installed && !app.pinned;

  function handleRowKey(e: React.KeyboardEvent<HTMLLIElement>) {
    if (!rowLaunchable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onLaunch();
    }
  }

  // Inner buttons stop propagation so they don't also trigger row-launch.
  function stop<T extends React.SyntheticEvent>(handler: () => void) {
    return (e: T) => {
      e.stopPropagation();
      handler();
    };
  }

  return (
    <li
      onClick={rowLaunchable ? onLaunch : undefined}
      onKeyDown={rowLaunchable ? handleRowKey : undefined}
      role={rowLaunchable ? "button" : undefined}
      tabIndex={rowLaunchable ? 0 : undefined}
      aria-label={rowLaunchable ? `Open ${app.label}` : undefined}
      className={cn(
        "px-3 py-3 transition-colors",
        rowLaunchable &&
          "cursor-pointer hover:bg-bg-muted/40 focus-visible:bg-bg-muted/40 focus-visible:outline-none",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg-muted text-fg-muted">
          {app.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-fg">{app.label}</span>
            {app.installed && app.pinned && (
              <Badge variant="success" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">
                Pinned
              </Badge>
            )}
            {app.installed && !app.pinned && (
              <Badge variant="subtle" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">
                Installed
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-fg-muted">{app.description}</p>
        </div>
      </div>

      {/* Actions row */}
      <div className="mt-3 flex items-center justify-end gap-2">
        {!app.installed && (
          <Button size="sm" onClick={stop(onInstall)}>
            Install
          </Button>
        )}
        {app.installed && (
          <>
            <Tooltip>
              <TooltipTrigger
                onClick={stop(onTogglePin)}
                disabled={pinDisabled}
                aria-label={app.pinned ? "Unpin from rail" : "Pin to rail"}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium transition-colors",
                  "hover:bg-bg-muted",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
                  app.pinned && "text-accent",
                )}
              >
                {app.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                {app.pinned ? "Unpin" : "Pin"}
              </TooltipTrigger>
              {pinDisabled && (
                <TooltipContent side="top">
                  Rail full — unpin another add-on first
                </TooltipContent>
              )}
            </Tooltip>
            <Button size="sm" variant="outline" onClick={stop(onUninstall)}>
              Uninstall
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
