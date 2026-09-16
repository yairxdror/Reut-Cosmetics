"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HomeButton, LanguageButton } from "./NavControls";
import HamburgerButton from "./HamburgerButton";
import Sidebar from "./Sidebar";
import AccessibilityWidget from "./AccessibilityWidget";
import ServiceWorkerRegistration from "./ServiceWorkerRegistration";
import EditableImage from "@/components/EditableImage";
import Editable from "@/components/Editable";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/context/LanguageContext";
import { useAdmin } from "@/context/AdminContext";
import { AdminIcon, PencilIcon } from "@/components/icons";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const isHome = pathname === "/";
  // The FAQ page's add/edit/delete controls work for any logged-in admin
  // regardless of edit mode, so the toggle has nothing to do there —
  // hiding it avoids implying it's needed on that specific page.
  const isFaqPage = pathname === "/faq";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, isEditMode, toggleEditMode } = useAdmin();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    scrollContainerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    function blockImageContextMenu(event: MouseEvent) {
      if (!document.documentElement.classList.contains("no-select")) return;
      const target = event.target as HTMLElement;
      if (target.closest("img, svg, picture")) {
        event.preventDefault();
      }
    }
    document.addEventListener("contextmenu", blockImageContextMenu);
    return () => document.removeEventListener("contextmenu", blockImageContextMenu);
  }, []);

  return (
    <div>
      <header className={`nav-bar ${isHome ? "nav-bar-home" : ""}`}>
        <div className="nav-bar-lang">
          <button
            type="button"
            className="nav-bar-logo-link"
            onClick={() => (isHome ? window.location.reload() : router.push("/"))}
            aria-label="Go to home page"
          >
            <span className="nav-bar-brand">
              <span className="nav-bar-brand-main">
                <Editable contentKey="brandNameMain">{t("brandNameMain")}</Editable>
              </span>
              <span className="nav-bar-brand-sub">
                <Editable contentKey="brandNameSub">{t("brandNameSub")}</Editable>
              </span>
            </span>
            <span className="nav-bar-logo-frame">
              <EditableImage
                imageKey="logo"
                fallbackSrc={logo}
                alt="Reut Yakobi"
                sizes="44px"
                style={{ objectFit: "contain" }}
                priority
              />
            </span>
          </button>
        </div>
        <div className="nav-bar-side">
          <HamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((prev) => !prev)} />
          <LanguageButton />
          {!isHome && <HomeButton />}
          {isAdmin && !isFaqPage && (
            <button
              type="button"
              className="btn-glass-thin btn-icon-only"
              onClick={toggleEditMode}
              aria-pressed={isEditMode}
              aria-label={t("editModeToggle")}
              title={t("editModeToggle")}
            >
              <PencilIcon size={22} />
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              className="btn-glass-thin btn-icon-only nav-bar-admin-badge"
              onClick={() => router.push("/admin")}
              aria-label={t("adminBadge")}
              title={t("adminBadge")}
            >
              <AdminIcon size={22} />
            </button>
          )}
        </div>
      </header>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="page-scroll" ref={scrollContainerRef}>
        <main style={{ padding: "4.5rem 1.5rem 3rem" }}>
          {children}
        </main>
      </div>
      <AccessibilityWidget />
      <ServiceWorkerRegistration />
    </div>
  );
}
