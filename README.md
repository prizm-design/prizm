# PRIZM 4.0

The DSTA design system. Serves two product families — command-and-control (C3) and enterprise. Built on Base UI and Tailwind CSS. Engineered for developers and AI.

## What's in the box

- **44 component primitives** (all stable) — shared by both product families
- **Four theme variants** — `c3-light`, `c3-dark`, `enterprise-light`, `enterprise-dark`
- **A docs site** at `/` that doubles as the public component browser
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
| `pnpm build` | Build static export to `out/` |
| `pnpm lint` | Run Biome linter |
| `pnpm typecheck` | Run TypeScript compiler |
| `pnpm audit:airgap` | Scan the repo for external URL references |
| `pnpm build:offline` | Produce release tarballs for air-gapped consumers |

## Project structure

```
PRIZM 4.0/
├── app/                    # Next.js docs site (App Router, static export)
├── components/
│   ├── ui/                 # ←— The component library. Copy these.
│   └── site/               # Docs-site components (header, preview, etc.)
├── lib/
│   ├── utils.ts            # cn() helper
│   ├── theme-context.tsx   # Zone + mode state provider
│   └── components-registry.ts
├── styles/
│   ├── fonts.css           # Self-hosted font declarations
│   └── tokens/             # The four-variant token system
├── llms/                   # Per-component LLM context files
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

TBD.
