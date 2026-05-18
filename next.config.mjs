import createMDX from "@next/mdx";

// basePath / assetPrefix are env-driven so local dev (`pnpm dev`) keeps working
// at the root, while production builds deployed to a GitHub Pages subpath
// (e.g. `/prizm`) can prepend that path everywhere by setting
// NEXT_PUBLIC_BASE_PATH. The NEXT_PUBLIC_* prefix is required so the same
// value is also accessible to components (see lib/base-path.ts).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  experimental: {
    mdxRs: false,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
