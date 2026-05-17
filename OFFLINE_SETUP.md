# PRIZM 4.0 — Offline / air-gap setup

PRIZM 4.0 is designed to run inside air-gapped environments without modification. This guide covers how to get a copy of PRIZM into a secured environment and use it there.

## What you need to bring across the air-gap

Every release produces two tarballs:

- **`prizm-offline-<version>.tar.gz`** — source code plus a complete pnpm store. Install with no network access.
- **`prizm-docs-<version>.tar.gz`** — pre-built static docs site. Serve from any static file server.

Bring whichever you need. Most teams will want both — the source to copy components from, and the static docs site as a local reference.

## Three ingestion paths

### Path A — Internal npm registry (recommended long-term)

If your cloud team operates an internal npm registry (Verdaccio, Nexus, Artifactory), the workflow is:

1. Mirror the PRIZM GitHub repo to your internal git server.
2. Clone the mirrored repo on the air-gapped machine.
3. Configure `pnpm` to use the internal registry: `pnpm config set registry https://npm.internal/`
4. `pnpm install` — pulls dependencies from your internal registry.

This is the most maintainable approach. PRIZM versions track upstream cleanly and updates are routine.

### Path B — Offline tarball (recommended if no internal registry)

1. On an internet-connected machine, download `prizm-offline-<version>.tar.gz` from a tagged release.
2. Transfer it across the air-gap via your approved process.
3. On the air-gapped machine:
   ```bash
   tar -xzf prizm-offline-<version>.tar.gz -C ~/prizm
   cd ~/prizm
   pnpm install --offline
   pnpm dev
   ```

### Path C — Read-only docs (lowest touch)

If you only need to *read* the docs and copy component source — not build PRIZM locally — use the pre-built docs tarball:

1. Transfer `prizm-docs-<version>.tar.gz` across the air-gap.
2. Extract and serve from any static file server:
   ```bash
   tar -xzf prizm-docs-<version>.tar.gz -C /var/www/prizm-docs
   # Serve /var/www/prizm-docs with nginx, caddy, python -m http.server, etc.
   ```

## What's air-gap safe in PRIZM

PRIZM 4.0 has zero external runtime dependencies. The repo includes:

- All fonts self-hosted in `/public/fonts/`
- All icons bundled via `lucide-react` (no remote SVGs)
- No CDN-hosted scripts, stylesheets, or analytics
- No telemetry, error reporting, or remote APIs

The `pnpm audit:airgap` script enforces this and runs in CI. Any PR that introduces an external URL fails the check.

## Verifying your environment

Run the air-gap audit on the air-gapped machine to confirm nothing has drifted:

```bash
pnpm audit:airgap
```

A clean pass means PRIZM is safe to use in your environment.
