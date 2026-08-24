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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
  const initialLanguage: Language = cookieLanguage === "en" ? "en" : "he";

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
