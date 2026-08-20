import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Reut Cosmetics",
  description: "Reut Cosmetics - natural beauty products",
  appleWebApp: {
    capable: true,
    title: "Reut Cosmetics",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <LanguageProvider>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
