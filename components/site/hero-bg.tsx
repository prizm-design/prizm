/**
 * Decorative background for the landing hero. Pure SVG + CSS — no JS, no library.
 *
 * Two layers:
 *   1. A static dot grid masked to fade at the edges (currentColor, low opacity).
 *   2. Four accent-tinted glowing bars, one on each edge of the hero.
 *
 * Themes itself via PRIZM tokens — the dots track `text-fg`, the glow tracks
 * the active zone's accent (cyan on C3, blue on Enterprise).
 */
export function HeroBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-fg">
      {/* Dot grid — decorative; parent <div> already has aria-hidden */}
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative background */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="prizm-hero-dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
          <radialGradient id="prizm-hero-fade" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="prizm-hero-mask">
            <rect width="100%" height="100%" fill="url(#prizm-hero-fade)" />
          </mask>
        </defs>
        <g mask="url(#prizm-hero-mask)" opacity="0.22">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#prizm-hero-dots)" />
        </g>
      </svg>

      {/* Four edge glows pulsing in clockwise sequence: top → right → bottom → left.
          Each is a 2 px bar with a center-fade gradient and a stacked box-shadow
          glow in the accent token. The brightness travels around the hero. */}
      <div
        className="prizm-hero-edge-1 absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
          boxShadow: "0 0 24px var(--color-accent), 0 0 48px var(--color-accent)",
          opacity: 0.4,
        }}
      />
      <div
        className="prizm-hero-edge-2 absolute inset-y-0 right-0 w-[2px]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
          boxShadow: "0 0 24px var(--color-accent), 0 0 48px var(--color-accent)",
          opacity: 0.4,
        }}
      />
      <div
        className="prizm-hero-edge-3 absolute inset-x-0 bottom-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
          boxShadow: "0 0 24px var(--color-accent), 0 0 48px var(--color-accent)",
          opacity: 0.4,
        }}
      />
      <div
        className="prizm-hero-edge-4 absolute inset-y-0 left-0 w-[2px]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
          boxShadow: "0 0 24px var(--color-accent), 0 0 48px var(--color-accent)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
