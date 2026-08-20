"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { HomeButton, LanguageButton } from "./NavControls";
import HamburgerButton from "./HamburgerButton";
import Sidebar from "./Sidebar";
import logo from "@/assets/logo.png";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div>
      <header className="nav-bar">
        <div className="nav-bar-lang">
          {isHome && (
            <button
              type="button"
              className="nav-bar-logo-link"
              onClick={() => window.location.reload()}
              aria-label="Refresh home page"
            >
              <span className="nav-bar-brand">Reut Cosmetics</span>
              <Image src={logo} alt="Reut Yakobi" className="nav-bar-logo" priority />
            </button>
          )}
        </div>
        <div className="nav-bar-side">
          {!isHome && <HomeButton />}
          <HamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((prev) => !prev)} />
          <LanguageButton />
        </div>
      </header>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <main style={{ padding: "1rem 1.5rem 3rem" }}>{children}</main>
    </div>
  );
}
