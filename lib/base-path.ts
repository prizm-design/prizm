/**
 * Base-path helpers for production deployment under a subpath (e.g. GitHub
 * Pages serving the site at `/prizm/`).
 *
 * Next.js's `<Link>` component automatically prepends `basePath` from
 * `next.config.mjs`, so for ROUTES you don't need these helpers. But raw
 * `<a href="/llms.txt">` anchors, `<img src="/noise.svg">` tags, and any
 * direct URL construction in code do NOT get the basePath treatment —
 * Next.js can't statically know which strings are URLs.
 *
 * For those cases, wrap the path with `withBasePath()`:
 *
 *   <a href={withBasePath("/llms.txt")}>llms.txt</a>
 *
 * The value is read from `NEXT_PUBLIC_BASE_PATH` (the same env var
 * `next.config.mjs` consumes to set `basePath`). The `NEXT_PUBLIC_*`
 * prefix is required so it's available in both server and client
 * components after the build. Local dev sets nothing, so `basePath` is
 * empty and URLs are unchanged.
 */

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prepend the configured `basePath` to a path that starts with `/`.
 * No-op when `basePath` is empty (local dev) or when the input is
 * already an absolute URL.
 */
export function withBasePath(path: string): string {
  if (!basePath) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
