"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HomeButton, LanguageButton } from "./NavControls";
import HamburgerButton from "./HamburgerButton";
import Sidebar from "./Sidebar";
import AccessibilityWidget from "./AccessibilityWidget";
import ServiceWorkerRegistration from "./ServiceWorkerRegistration";
import logo from "@/assets/logo.png";
import { isAdminLoggedIn, clearAdminToken, ADMIN_AUTH_EVENT } from "@/lib/adminAuth";
import { useLanguage } from "@/context/LanguageContext";
import { LogoutIcon, WhatsAppIcon } from "@/components/icons";
import { WHATSAPP_URL } from "@/lib/contact";

const MIN_THUMB_HEIGHT = 30;
const ARROW_SIZE = 12;
const THUMB_RAIL_INSET = ARROW_SIZE + 2;
const ARROW_SCROLL_AMOUNT = 120;

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [thumb, setThumb] = useState<{ top: number; height: number } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWhatsAppDocked, setIsWhatsAppDocked] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    scrollContainerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    function checkAdmin() {
      setIsAdmin(isAdminLoggedIn());
    }
    checkAdmin();
    window.addEventListener(ADMIN_AUTH_EVENT, checkAdmin);
    window.addEventListener("storage", checkAdmin);
    return () => {
      window.removeEventListener(ADMIN_AUTH_EVENT, checkAdmin);
      window.removeEventListener("storage", checkAdmin);
    };
  }, []);

  // Scroll-linked "dock" effect for the hero WhatsApp CTA: as the guest
  // scrolls the home page, --wa-dock-progress (0 -> 1) tracks how close the
  // button's natural position has come to sliding under the nav bar. The
  // hero button (see .hero-whatsapp-cta) shrinks/fades out on the first
  // half of that range, and a small icon button here in the nav bar
  // (.nav-bar-whatsapp-dock) fades in on the second half, so it looks like
  // the same button rising into the bar and locking in place.
  useEffect(() => {
    const root = document.documentElement;
    const scrollEl = scrollContainerRef.current;
    const navEl = navRef.current;

    if (!isHome || isAdmin || !scrollEl || !navEl) {
      root.style.setProperty("--wa-dock-progress", "0");
      setIsWhatsAppDocked(false);
      return;
    }

    let threshold = 0;
    let rafId: number | null = null;

    function measure() {
      const ctaEl = document.querySelector(".hero-whatsapp-cta");
      if (!ctaEl || !navEl || !scrollEl) return;
      const ctaRect = ctaEl.getBoundingClientRect();
      const documentTop = ctaRect.top + scrollEl.scrollTop;
      threshold = Math.max(documentTop - navEl.offsetHeight, 1);
    }

    function updateProgress() {
      rafId = null;
      if (!scrollEl) return;
      const progress = Math.min(Math.max(scrollEl.scrollTop / threshold, 0), 1);
      root.style.setProperty("--wa-dock-progress", String(progress));
      const nextDocked = progress > 0.5;
      setIsWhatsAppDocked((prev) => (prev === nextDocked ? prev : nextDocked));
    }

    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(updateProgress);
    }

    measure();
    updateProgress();
    scrollEl.addEventListener("scroll", onScroll);
    window.addEventListener("resize", measure);

    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (rafId !== null) cancelAnimationFrame(rafId);
      root.style.setProperty("--wa-dock-progress", "0");
    };
  }, [isHome, isAdmin, pathname]);

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    const mainEl = mainRef.current;
    const navEl = navRef.current;
    if (!scrollEl || !mainEl) return;

    function updateThumb() {
      const el = scrollEl;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight + 1) {
        setThumb(null);
        return;
      }
      const trackHeight = clientHeight - (navRef.current?.offsetHeight ?? 0);
      const railHeight = trackHeight - THUMB_RAIL_INSET * 2;
      const thumbHeight = Math.max((clientHeight / scrollHeight) * railHeight, MIN_THUMB_HEIGHT);
      const maxThumbTop = railHeight - thumbHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      const thumbTop = THUMB_RAIL_INSET + (maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0);
      setThumb({ top: thumbTop, height: thumbHeight });
    }

    updateThumb();
    scrollEl.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    window.addEventListener("orientationchange", updateThumb);
    const resizeObserver = new ResizeObserver(updateThumb);
    resizeObserver.observe(mainEl);
    resizeObserver.observe(scrollEl);
    if (navEl) resizeObserver.observe(navEl);

    return () => {
      scrollEl.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
      window.removeEventListener("orientationchange", updateThumb);
      resizeObserver.disconnect();
    };
  }, [pathname]);

  function handleThumbMouseDown(event: React.MouseEvent) {
    event.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;

    const startY = event.clientY;
    const startScrollTop = el.scrollTop;
    const { scrollHeight, clientHeight } = el;
    const trackHeight = clientHeight - (navRef.current?.offsetHeight ?? 0);
    const railHeight = trackHeight - THUMB_RAIL_INSET * 2;
    const thumbHeight = Math.max((clientHeight / scrollHeight) * railHeight, MIN_THUMB_HEIGHT);
    const maxThumbTop = railHeight - thumbHeight;
    const maxScrollTop = scrollHeight - clientHeight;

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "pointer";

    function handleMove(moveEvent: MouseEvent) {
      const deltaY = moveEvent.clientY - startY;
      const deltaScroll = maxThumbTop > 0 ? (deltaY / maxThumbTop) * maxScrollTop : 0;
      el!.scrollTop = startScrollTop + deltaScroll;
    }
    function handleUp() {
      document.body.style.cursor = previousCursor;
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    }
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }

  function handleArrowClick(direction: 1 | -1) {
    scrollContainerRef.current?.scrollBy({ top: direction * ARROW_SCROLL_AMOUNT, behavior: "smooth" });
  }

  function handleLogout() {
    clearAdminToken();
  }

  return (
    <div>
      <header className={`nav-bar ${isHome ? "nav-bar-home" : ""}`} ref={navRef}>
        <div className="nav-bar-lang">
          <button
            type="button"
            className="nav-bar-logo-link"
            onClick={() => (isHome ? window.location.reload() : router.push("/"))}
            aria-label="Go to home page"
          >
            <span className="nav-bar-brand">
              <span className="nav-bar-brand-main">Reut</span>
              <span className="nav-bar-brand-sub">Cosmetics</span>
            </span>
            <Image src={logo} alt="Reut Yakobi" className="nav-bar-logo" priority />
          </button>
        </div>
        <div className="nav-bar-side">
          {isHome && !isAdmin && (
            <a
              className={`nav-bar-whatsapp-dock ${isWhatsAppDocked ? "is-active" : ""}`}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("whatsappCta")}
              aria-hidden={!isWhatsAppDocked}
              tabIndex={isWhatsAppDocked ? 0 : -1}
            >
              <WhatsAppIcon size={16} />
            </a>
          )}
          <HamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((prev) => !prev)} />
          <LanguageButton />
          {!isHome && <HomeButton />}
          {isAdmin && (
            <button
              type="button"
              className="btn-glass-thin btn-icon-only"
              onClick={handleLogout}
              aria-label={t("logout")}
              title={t("logout")}
            >
              <LogoutIcon size={18} />
            </button>
          )}
          {isAdmin && (
            <button type="button" className="nav-bar-admin-badge" onClick={() => router.push("/admin")}>
              {t("adminBadge")}
            </button>
          )}
        </div>
      </header>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="page-scroll" ref={scrollContainerRef}>
        <main ref={mainRef} style={{ padding: "4.5rem 1.5rem 3rem" }}>
          {children}
        </main>
      </div>
      {thumb && (
        <div className="custom-scrollbar-track">
          <button
            type="button"
            className="custom-scrollbar-arrow custom-scrollbar-arrow-up"
            onClick={() => handleArrowClick(-1)}
            aria-label="Scroll up"
          />
          <div
            className="custom-scrollbar-thumb"
            style={{ top: thumb.top, height: thumb.height }}
            onMouseDown={handleThumbMouseDown}
          />
          <button
            type="button"
            className="custom-scrollbar-arrow custom-scrollbar-arrow-down"
            onClick={() => handleArrowClick(1)}
            aria-label="Scroll down"
          />
        </div>
      )}
      <AccessibilityWidget />
      <ServiceWorkerRegistration />
    </div>
  );
}
