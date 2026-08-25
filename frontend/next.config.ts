import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPagesBuild ? "/Reut-Cosmetics" : "";

const nextConfig: NextConfig = {
  ...(isGithubPagesBuild && {
    output: "export",
    basePath,
    assetPrefix: basePath,
  }),
  images: {
    unoptimized: isGithubPagesBuild,
  },
  env: {
    // Exposed to the browser so the service worker (a plain static file,
    // registered by absolute URL) can be found under the GitHub Pages
    // subpath the same way every other asset is.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
