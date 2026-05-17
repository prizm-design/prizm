import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ZoneIndicator } from "@/components/site/zone-indicator";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/lib/theme-context";
import { ZoneRouteSync } from "@/lib/zone-detector";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PRIZM 4.0 — A DSTA design system",
    template: "%s · PRIZM 4.0",
  },
  description:
    "PRIZM 4.0 is the DSTA design system. Built for two product families — C3 and Enterprise — and engineered for both developers and AI.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
