import type { MetadataRoute } from "next";

// Required for static export builds (GitHub Pages / Firebase Hosting).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login"],
      },
    ],
    sitemap: "https://reutycosmetics.top/sitemap.xml",
  };
}
