export const metadata = { title: "Air-gap setup" };

export default function AirGapPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Air-gap setup</h1>
      <p className="mt-3 text-lg text-fg-muted">
        PRIZM 4.0 runs unmodified inside air-gapped environments. This page summarizes how. For the
        full procedure, see <code className="font-mono text-sm">OFFLINE_SETUP.md</code> in the repo
        root.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">What's guaranteed</h2>
      <ul className="mt-4 space-y-2 text-fg-muted">
        <li>
          • All fonts self-hosted in <code className="font-mono text-xs">/public/fonts/</code>
        </li>
        <li>
          • All icons bundled via <code className="font-mono text-xs">lucide-react</code>
        </li>
        <li>• No CDN-hosted scripts, stylesheets, or assets</li>
        <li>• No telemetry, error reporting, or remote APIs</li>
        <li>
          • The <code className="font-mono text-xs">pnpm audit:airgap</code> script enforces this in
          CI
        </li>
      </ul>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Three ingestion paths</h2>
      <p className="mt-3 text-fg-muted">Pick the one that matches your environment:</p>

      <h3 className="mt-6 text-lg font-semibold">A. Internal npm registry</h3>
      <p className="mt-2 text-fg-muted">
        If your cloud team operates Verdaccio, Nexus, or Artifactory, mirror this repo to your
        internal git server and point pnpm at your internal registry. Updates flow normally.
      </p>

      <h3 className="mt-6 text-lg font-semibold">B. Offline tarball</h3>
      <p className="mt-2 text-fg-muted">
        Each release publishes{" "}
        <code className="font-mono text-xs">prizm-offline-&lt;version&gt;.tar.gz</code> containing
        source plus a complete pnpm store. Transfer once, extract, run{" "}
        <code className="font-mono text-xs">pnpm install --offline</code>.
      </p>

      <h3 className="mt-6 text-lg font-semibold">C. Read-only docs</h3>
      <p className="mt-2 text-fg-muted">
        If you only need to read docs and copy component source — not build PRIZM locally — transfer{" "}
        <code className="font-mono text-xs">prizm-docs-&lt;version&gt;.tar.gz</code> and serve it
        with any static file server.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Verifying after ingestion</h2>
      <p className="mt-3 text-fg-muted">
        Run <code className="font-mono text-xs">pnpm audit:airgap</code> on the air-gapped machine
        to confirm nothing has drifted. A clean pass means you're safe.
      </p>
    </article>
  );
}
