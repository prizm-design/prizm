# PRIZM 4.0

A DSTA design system. Serves two product families — command-and-control (C3) and enterprise. Built on Base UI and Tailwind CSS. Engineered for developers and AI.

## What's in the box

- **44 stable component primitives** (plus 6 planned) — shared by both product families
- **RC3 capability pack** — robotics & autonomy modules for C3. Identity layer (Ember signature, identity rule) + three signature organisms (safety actions, comms / health strip, autonomy mode selector) + concept docs.
- **JavaFX library** — a parallel set of native controls for thick-client (desktop) C3 apps. Tokens derived from the same CSS; `PrizmButton` / `PrizmInput` / `PrizmCard` in spec parity with the React library. C3 and capability packs only. Lives at `javafx/`.
- **Four theme variants** — `c3-light`, `c3-dark`, `enterprise-light`, `enterprise-dark`
- **A docs site** at `/` that doubles as the public component browser. Top-level nav: Overview (Introduction, Getting started, Using with AI, Installation, Theming, Air-gap setup, Changelog) → Foundations → Components → C3 → Enterprise.
- **An LLM layer** — `PRIZM.md`, `llms.txt`, per-component context files in `/llms/`
- **Air-gap support** — self-hosted fonts, no CDN refs, offline release artifacts
- **Copy-paste distribution** — own your components, no npm package required

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Before running, drop self-hosted font files into `public/fonts/` — see `public/fonts/README.md` for sources.

## Scripts

| Script | What it does |
|--------|--------------|
| `pnpm dev` | Run the docs site in dev mode |
| `pnpm build` | Build the static export to `out/` |
| `pnpm verify` | Run the full CI chain locally — use before pushing |
| `pnpm lint` | Run Biome (lint + format check) |
| `pnpm typecheck` | Run the TypeScript compiler |
| `pnpm build:offline` | Produce release tarballs for air-gapped consumers |

Run `pnpm run` to see the full list, including audits, generation tasks, and CI helpers.

## Project structure

```
PRIZM 4.0/
├── app/                    # Next.js docs site (App Router, static export)
├── components/
│   ├── ui/                 # ←— The component library. Copy these.
│   ├── rc3/                # RC3 capability-pack organisms
│   └── site/               # Docs-site components (header, preview, etc.)
├── lib/
│   ├── utils.ts            # cn() helper
│   ├── theme-context.tsx   # Zone + mode state provider
│   └── components-registry.ts
├── styles/
│   ├── fonts.css           # Self-hosted font declarations
│   └── tokens/             # The four-variant token system
├── javafx/                 # JavaFX thick-client library (C3 + packs only)
├── llms/                   # Per-component LLM context files
│   ├── rc3/                # Per-organism context files for RC3
│   └── javafx/             # Per-control context files for the JavaFX library
├── llms.txt                # Top-level LLM entry point
├── PRIZM.md                # Full brief for AI assistants
├── OFFLINE_SETUP.md        # Air-gap deployment guide
└── scripts/
    ├── audit-airgap.ts
    └── build-offline.ts
```

## For AI assistants

Start with [PRIZM.md](./PRIZM.md). It explains conventions, theming, distribution, and what to do when asked to add or modify components.

## License

[MIT](./LICENSE) © Defence Science and Technology Agency (DSTA), Singapore.

PRIZM is permissively licensed for both public and air-gapped use. Copy components into your project, modify them, and ship — keep the copyright notice. The license matches the underlying stack (Base UI, Tailwind, Next.js — all MIT; lucide-react is ISC) so consumers face no license-compatibility friction.
