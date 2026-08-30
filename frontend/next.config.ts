import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const isFirebaseHostingBuild = process.env.FIREBASE_HOSTING === "true";
const isStaticExport = isGithubPagesBuild || isFirebaseHostingBuild;
const basePath = isGithubPagesBuild ? "/Reut-Cosmetics" : "";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export",
  }),
  ...(isGithubPagesBuild && {
    basePath,
    assetPrefix: basePath,
  }),
  images: {
    unoptimized: isStaticExport,
  },
  env: {
    // Exposed to the browser so the service worker (a plain static file,
    // registered by absolute URL) can be found under the GitHub Pages
    // subpath the same way every other asset is.
    NEXT_PUBLIC_BASE_PATH: basePath,
    // A Firebase static build must use same-origin API requests even when a
    // developer's ignored .env.local points at localhost.
    NEXT_PUBLIC_DEPLOY_TARGET: isFirebaseHostingBuild ? "firebase" : "default",
  },
};

export default nextConfig;
