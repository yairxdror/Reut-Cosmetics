import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AdminProvider } from "@/context/AdminContext";
import { HealthDeclarationDraftProvider } from "@/context/HealthDeclarationDraftContext";
import { LANGUAGE_COOKIE_NAME, type Language } from "@/lib/language";
import SiteChrome from "@/components/SiteChrome";

const gveretLevin = localFont({
  src: "../assets/fonts/GveretLevin-Regular.ttf",
  variable: "--font-gveret-levin",
  display: "swap",
});

export const metadata: Metadata = {
  // Bilingual so Hebrew searches for the brand name find the site too — the
  // English name still leads, matching the logo/wordmark. This tag isn't
  // part of the page's visible design (browser tab + search results only),
  // so it doesn't need to visually match the logo.
  title: "רעות קוסמטיקה | Reut Cosmetics",
  description: "רעות קוסמטיקה (קוסמטיקס) - איפור קבוע, עיצוב גבות ואיפור כלות | Reut Cosmetics - permanent makeup, eyebrow design & bridal makeup",
  appleWebApp: {
    capable: true,
    title: "Reut Cosmetics",
    statusBarStyle: "black-translucent",
  },
  // Google Search Console domain-ownership verification — do not remove,
  // it keeps the site verified there even after the initial check passes.
  verification: {
    google: "mi0lRb-iOTedfUQfW2QVjuc7J9hhmJJqWdobtLAqsCY",
  },
};

// viewportFit: "cover" is what makes env(safe-area-inset-*) resolve to real
// values on notched/rounded-corner phones instead of always being 0 — needed
// so fixed/floating UI near the screen edges can stay clear of the notch.
// themeColor tints Android Chrome's own address bar/status bar to match the
// page (the cream background, not the PWA manifest's dark install-splash
// color, which is a separate, already-deliberate choice for a different
// context) instead of leaving it default white/gray.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf8f2",
};

// The GitHub Pages build is a static export (no server), which can't call
// cookies() at all — dynamic APIs make a route fail to prerender. Only read
// the saved-language cookie on real (server-backed) deployments; the static
// export just always starts in Hebrew, same as before this feature existed.
const isStaticExport =
  process.env.GITHUB_PAGES === "true" || process.env.FIREBASE_HOSTING === "true";

// Text/image selection and copying is blocked site-wide (see globals.css'
// .no-select rules), but only on real production builds — a developer
// running the site locally still needs to select and copy text.
const isProduction = process.env.NODE_ENV === "production";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialLanguage: Language = "he";
  if (!isStaticExport) {
    const cookieStore = await cookies();
    const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
    initialLanguage = cookieLanguage === "en" ? "en" : "he";
  }

  return (
    <html
      lang={initialLanguage}
      dir={initialLanguage === "he" ? "rtl" : "ltr"}
      className={isProduction ? "no-select" : undefined}
    >
      <body className={gveretLevin.variable}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <AdminProvider>
            <SiteChrome>
              <HealthDeclarationDraftProvider>{children}</HealthDeclarationDraftProvider>
            </SiteChrome>
          </AdminProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
