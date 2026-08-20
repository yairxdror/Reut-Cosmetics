"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HomeButton, LanguageButton } from "./NavControls";
import HamburgerButton from "./HamburgerButton";
import Sidebar from "./Sidebar";
import logo from "@/assets/logo.png";

const MIN_THUMB_HEIGHT = 30;

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [thumb, setThumb] = useState<{ top: number; height: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    scrollContainerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    const mainEl = mainRef.current;
    if (!scrollEl || !mainEl) return;

    function updateThumb() {
      const el = scrollEl;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight + 1) {
        setThumb(null);
        return;
      }
      const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, MIN_THUMB_HEIGHT);
      const maxThumbTop = clientHeight - thumbHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      const thumbTop = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0;
      setThumb({ top: thumbTop, height: thumbHeight });
    }

    updateThumb();
    scrollEl.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    const resizeObserver = new ResizeObserver(updateThumb);
    resizeObserver.observe(mainEl);

    return () => {
      scrollEl.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
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
    const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, MIN_THUMB_HEIGHT);
    const maxThumbTop = clientHeight - thumbHeight;
    const maxScrollTop = scrollHeight - clientHeight;

    function handleMove(moveEvent: MouseEvent) {
      const deltaY = moveEvent.clientY - startY;
      const deltaScroll = maxThumbTop > 0 ? (deltaY / maxThumbTop) * maxScrollTop : 0;
      el!.scrollTop = startScrollTop + deltaScroll;
    }
    function handleUp() {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    }
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }

  return (
    <div>
      <header className="nav-bar">
        <div className="nav-bar-lang">
          <button
            type="button"
            className="nav-bar-logo-link"
            onClick={() => (isHome ? window.location.reload() : router.push("/"))}
            aria-label="Go to home page"
          >
            <span className="nav-bar-brand">Reut Cosmetics</span>
            <Image src={logo} alt="Reut Yakobi" className="nav-bar-logo" priority />
          </button>
        </div>
        <div className="nav-bar-side">
          <HamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((prev) => !prev)} />
          <LanguageButton />
          {!isHome && <HomeButton />}
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
          <div
            className="custom-scrollbar-thumb"
            style={{ top: thumb.top, height: thumb.height }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
}
