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
};

export default nextConfig;
