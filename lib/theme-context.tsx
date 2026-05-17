"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Zone = "enterprise" | "c3";
export type Mode = "light" | "dark";

const STORAGE_KEY_ZONE = "prizm.zone";
const STORAGE_KEY_MODE = "prizm.mode";

type ThemeContextValue = {
  zone: Zone;
  mode: Mode;
  setZone: (zone: Zone) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(zone: Zone, mode: Mode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.zone = zone;
  document.documentElement.dataset.mode = mode;
  document.documentElement.style.colorScheme = mode;
}

export function ThemeProvider({
  children,
  defaultZone = "c3",
  defaultMode = "light",
}: {
  children: ReactNode;
  defaultZone?: Zone;
  defaultMode?: Mode;
}) {
  const [zone, setZoneState] = useState<Zone>(defaultZone);
  const [mode, setModeState] = useState<Mode>(defaultMode);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedZone = window.localStorage.getItem(STORAGE_KEY_ZONE) as Zone | null;
    const storedMode = window.localStorage.getItem(STORAGE_KEY_MODE) as Mode | null;
    const initialZone = storedZone ?? defaultZone;
    const initialMode =
      storedMode ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : defaultMode);
    setZoneState(initialZone);
    setModeState(initialMode);
    applyTheme(initialZone, initialMode);
  }, [defaultZone, defaultMode]);

  const setZone = useCallback((next: Zone) => {
    setZoneState(next);
    window.localStorage.setItem(STORAGE_KEY_ZONE, next);
    applyTheme(next, modeRef());
  }, []);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY_MODE, next);
    applyTheme(zoneRef(), next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(modeRef() === "light" ? "dark" : "light");
  }, [setMode]);

  function zoneRef() {
    return (document.documentElement.dataset.zone as Zone) ?? defaultZone;
  }
  function modeRef() {
    return (document.documentElement.dataset.mode as Mode) ?? defaultMode;
  }

  return (
    <ThemeContext.Provider value={{ zone, mode, setZone, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
