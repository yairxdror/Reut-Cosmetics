import type { MetadataRoute } from "next";

// Required for static export builds (GitHub Pages / Firebase Hosting).
export const dynamic = "force-static";

const BASE_URL = "https://reutycosmetics.top";

const ROUTES = [
  "",
  "/faq",
  "/care-instructions",
  "/courses",
  "/health-declaration",
  "/privacy-policy",
  "/terms",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
