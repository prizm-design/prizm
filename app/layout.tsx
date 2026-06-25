import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ZoneIndicator } from "@/components/site/zone-indicator";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/lib/theme-context";
import { ZoneRouteSync } from "@/lib/zone-detector";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { basePath } from "@/lib/base-path";

// Next.js's `metadata.icons` does NOT auto-prefix URLs with `basePath` —
// known gotcha. Use the shared `basePath` constant from lib/base-path.ts
// so favicon URLs resolve correctly when deployed under a subpath.

export const metadata: Metadata = {
  title: {
    default: "PRIZM 4.0 — A DSTA design system",
    template: "%s · PRIZM 4.0",
  },
  description:
    "PRIZM 4.0 is a DSTA design system. Built for two product families — C3 and Enterprise — and engineered for both developers and AI.",
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: "32x32" },
      { url: `${basePath}/favicon-32.png`, type: "image/png", sizes: "32x32" },
      { url: `${basePath}/favicon.svg`, type: "image/svg+xml", sizes: "any" },
    ],
  },
};

// Inline script that runs before React hydrates to set zone/mode on <html>,
// preventing a flash of unthemed content (FOUC).
const themeInitScript = `
(function() {
  try {
    var zone = localStorage.getItem('prizm.zone') || 'c3';
    var mode = localStorage.getItem('prizm.mode');
    if (!mode) {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.zone = zone;
    document.documentElement.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode;
  } catch (e) {}
})();
`;

// @font-face is injected here (not via globals.css) so the font URLs pick up
// `basePath` when deployed under a subpath — the same gotcha as the favicon URLs.
// styles/fonts.css remains the consumer copy-paste artifact.
const fontFaceStyles = `
@font-face { font-family: "Inter"; font-style: normal; font-weight: 100 900; font-display: swap; src: url("${basePath}/fonts/Inter/InterVariable.woff2") format("woff2"); }
@font-face { font-family: "Inter"; font-style: italic; font-weight: 100 900; font-display: swap; src: url("${basePath}/fonts/Inter/InterVariable-Italic.woff2") format("woff2"); }
@font-face { font-family: "JetBrains Mono"; font-style: normal; font-weight: 100 800; font-display: swap; src: url("${basePath}/fonts/JetBrainsMono/JetBrainsMono-VariableFont_wght.ttf") format("truetype"); }
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FOUC-prevention: applies the persisted theme before React hydrates.
            Cannot be a regular module — must execute synchronously in <head>
            from a known-safe inline string we control. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted constant */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted constant */}
        <style dangerouslySetInnerHTML={{ __html: fontFaceStyles }} />
      </head>
      <body className="flex min-h-screen flex-col bg-bg text-fg antialiased">
        <ThemeProvider>
          <ToastProvider>
            <ZoneRouteSync />
            <Header />
            <ZoneIndicator />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
