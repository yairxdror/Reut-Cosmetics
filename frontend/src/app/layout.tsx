import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { LANGUAGE_COOKIE_NAME, type Language } from "@/lib/language";
import SiteChrome from "@/components/SiteChrome";

const gveretLevin = localFont({
  src: "../assets/fonts/GveretLevin-Regular.ttf",
  variable: "--font-gveret-levin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reut Cosmetics",
  description: "Reut Cosmetics - natural beauty products",
  appleWebApp: {
    capable: true,
    title: "Reut Cosmetics",
    statusBarStyle: "black-translucent",
  },
};

// The GitHub Pages build is a static export (no server), which can't call
// cookies() at all — dynamic APIs make a route fail to prerender. Only read
// the saved-language cookie on real (server-backed) deployments; the static
// export just always starts in Hebrew, same as before this feature existed.
const isStaticExport = process.env.GITHUB_PAGES === "true";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialLanguage: Language = "he";
  if (!isStaticExport) {
    const cookieStore = await cookies();
    const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
    initialLanguage = cookieLanguage === "en" ? "en" : "he";
  }

  return (
    <html lang={initialLanguage} dir={initialLanguage === "he" ? "rtl" : "ltr"}>
      <body className={gveretLevin.variable}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
