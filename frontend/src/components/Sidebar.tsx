"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLanguage, type TranslationKey } from "@/context/LanguageContext";
import { useAdmin } from "@/context/AdminContext";

const NAV_ITEMS: { href: string; key: TranslationKey }[] = [
  { href: "/faq", key: "faq" },
  { href: "/health-declaration", key: "healthDeclaration" },
  { href: "/care-instructions", key: "careInstructions" },
  { href: "/courses", key: "privateCourses" },
  { href: "/login", key: "login" },
  { href: "/privacy-policy", key: "privacyPolicy" },
  { href: "/terms", key: "termsOfUse" },
  { href: "/accessibility", key: "accessibility" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const scrollContainer = document.querySelector<HTMLElement>(".page-scroll");
    if (scrollContainer) scrollContainer.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (scrollContainer) scrollContainer.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "sidebar-overlay-open" : ""}`} onClick={onClose} />
      <aside className={`sidebar-panel ${isOpen ? "sidebar-panel-open" : ""}`} aria-hidden={!isOpen}>
        <div className="sidebar-header">
          <h2 className="text-gold" style={{ margin: 0 }}>
            {t("menu")}
          </h2>
          <button className="btn-glass-thin" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.filter(
            (item) =>
              (item.href !== "/login" || !isAdmin) &&
              (item.href !== "/health-declaration" || isAdmin)
          ).map((item) => (
            <Link key={item.href} href={item.href} className="sidebar-link" onClick={onClose}>
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
