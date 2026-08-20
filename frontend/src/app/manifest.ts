import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPagesBuild ? "/Reut-Cosmetics" : "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reut Cosmetics",
    short_name: "Reut Cosmetics",
    description: "Reut Cosmetics - natural beauty products",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#1a1712",
    theme_color: "#1a1712",
    icons: [
      {
        src: `${basePath}/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${basePath}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
