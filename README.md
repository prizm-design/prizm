# PRIZM 4.0

A DSTA design system. Serves two product families — command-and-control (C3) and enterprise. Built on Base UI and Tailwind CSS. Engineered for developers and AI.

## What's in the box

- **44 component primitives** (all stable) — shared by both product families
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

### Dev

| Script | What it does |
|--------|--------------|
| `pnpm dev` | Run the docs site in dev mode |
| `pnpm dev:clean` | Wipe `.next` and start dev — use after a dependency change |

### Format & lint

| Script | What it does |
|--------|--------------|
| `pnpm lint` | Run Biome (lint + format check, no writes) |
| `pnpm lint:fix` | Run Biome with safe autofixes applied |
| `pnpm format` | Format the codebase with Biome |

### Verify

| Script | What it does |
|--------|--------------|
| `pnpm typecheck` | Run the TypeScript compiler (`tsc --noEmit`) |
| `pnpm verify` | Run the full CI chain locally — lint, typecheck, audits, link check, and static build. Use this before pushing to confirm CI will pass. |

### Audits & checks

| Script | What it does |
|--------|--------------|
| `pnpm audit:airgap` | Scan the repo for external URL references |
| `pnpm audit:components` | Verify `components-registry.ts` and `components-api.ts` are aligned |
| `pnpm check:links` | Validate every internal link uses the right primitive (`<Link>` for routes, `<a>` for static files) |

### Build & release

| Script | What it does |
|--------|--------------|
| `pnpm build` | Build the static export to `out/` |
| `pnpm build:offline` | Produce release tarballs for air-gapped consumers |

### Generation

| Script | What it does |
|--------|--------------|
| `pnpm generate:llms-api` | Lift `components-api.ts` data into each per-component `llms/<slug>.md` |
| `pnpm generate:favicon-png` | Regenerate `public/favicon.ico` and `public/favicon-32.png` from `public/favicon.svg` |

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

[MIT](./LICENSE) © Defence Science and Technology Agency (DSTA), Singapore.

PRIZM is permissively licensed for both public and air-gapped use. Copy components into your project, modify them, and ship — keep the copyright notice. The license matches the underlying stack (Base UI, Tailwind, Next.js — all MIT; lucide-react is ISC) so consumers face no license-compatibility friction.
