"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import heroProduct from "@/assets/hero-product.jpg";
import { useLanguage } from "@/context/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";
import { isAdminLoggedIn, ADMIN_AUTH_EVENT } from "@/lib/adminAuth";
import {
  CrownIcon,
  DiamondIcon,
  HeartIcon,
  PersonIcon,
  ShieldIcon,
  SparkleIcon,
  WhatsAppIcon,
} from "@/components/icons";
import Services from "@/components/Services";
import Location from "@/components/Location";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const FEATURES = [
  { icon: SparkleIcon, key: "featureDiagnostics" as const },
  { icon: PersonIcon, key: "featurePersonalService" as const },
  { icon: DiamondIcon, key: "featureEquipped" as const },
  { icon: ShieldIcon, key: "featureMaterials" as const },
];

export default function Home() {
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setMounted(true);
    function checkAdmin() {
      setIsAdmin(isAdminLoggedIn());
    }
    checkAdmin();
    window.addEventListener(ADMIN_AUTH_EVENT, checkAdmin);
    return () => window.removeEventListener(ADMIN_AUTH_EVENT, checkAdmin);
  }, []);

  // For guests, this button is always position: fixed (portaled to
  // document.body, see below) and its position/size are driven entirely by
  // CSS custom properties so the shrink is one continuous, scroll-linked
  // transform on a single persistent element — never a swap to a different
  // node. --wa-progress (0 -> 1) tracks how far it's traveled from its
  // natural spot in the hero toward the nav bar; .hero-whatsapp-cta's CSS
  // interpolates position and size from that. It's portaled (rather than
  // just fixed in place) because the nav bar's backdrop-filter blurs
  // anything painted before it in the DOM regardless of z-index — being
  // portaled keeps it after the nav bar in DOM order the whole time, so it
  // never renders blurry.
  useEffect(() => {
    if (isAdmin || !mounted) return;
    const scrollEl = document.querySelector<HTMLElement>(".page-scroll");
    const navEl = document.querySelector<HTMLElement>(".nav-bar");
    const ctaEl = ctaRef.current;
    if (!scrollEl || !navEl || !ctaEl) return;

    let startTop = 0;
    let endTop = 0;
    let distance = 1;

    function measure() {
      const anchorEl = document.querySelector<HTMLElement>(".hero-cta-row");
      const suffixEl = ctaEl?.querySelector<HTMLElement>(".hero-whatsapp-cta-label-suffix");
      if (!anchorEl || !navEl || !scrollEl || !ctaEl) return;
      const anchorRect = anchorEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      startTop = anchorRect.top + scrollEl.scrollTop + anchorRect.height / 2;
      endTop = navRect.top + navRect.height / 2;
      distance = Math.max(startTop - endTop, 1);
      const startLeft = anchorRect.left + anchorRect.width / 2;
      // On desktop there's plenty of open space in the nav bar either way,
      // so sliding sideways into a centered dock spot is just unnecessary
      // motion — keep it docking straight up at its natural column
      // position instead. Mobile still recenters into the (narrow) gap.
      const isDesktopLayout = window.innerWidth > 860;
      const endLeft = isDesktopLayout ? startLeft : navRect.left + navRect.width / 2;
      ctaEl.style.setProperty("--wa-start-top", `${startTop}px`);
      ctaEl.style.setProperty("--wa-end-top", `${endTop}px`);
      ctaEl.style.setProperty("--wa-start-left", `${startLeft}px`);
      ctaEl.style.setProperty("--wa-end-left", `${endLeft}px`);
      if (suffixEl) ctaEl.style.setProperty("--wa-suffix-width", `${suffixEl.scrollWidth}px`);
    }

    let rafId: number | null = null;

    // Position (top/left) tracks the full scroll range so the button rises
    // continuously the whole way, but shrinking only starts once it's
    // mostly there — SHRINK_START of the way through the journey — so it
    // stays full-size for the first stretch of scrolling and only gets
    // smaller once it's actually close to the nav bar.
    const SHRINK_START = 0.65;

    function updateProgress() {
      rafId = null;
      if (!scrollEl || !ctaEl) return;
      const progress = Math.min(Math.max(scrollEl.scrollTop / distance, 0), 1);
      const shrink = Math.min(Math.max((progress - SHRINK_START) / (1 - SHRINK_START), 0), 1);
      ctaEl.style.setProperty("--wa-progress", String(progress));
      ctaEl.style.setProperty("--wa-shrink", String(shrink));
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
    };
  }, [isAdmin, mounted]);

  // Admins get a plain, always-in-flow button (no dock effect at all — the
  // .hero-whatsapp-cta class below, which carries the fixed positioning, is
  // deliberately left off so it can never be affected by the guest effect).
  const adminCta = (
    <a className="btn-hero btn-hero-gold" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon size={18} />
      <span>{t("whatsappCta")}</span>
    </a>
  );

  // The label is split so "core" ("Chat with us") always stays visible even
  // once docked, while only "suffix" ("on WhatsApp") gradually collapses
  // away on narrow screens where there isn't room for the full phrase.
  const floatingCta = (
    <a
      ref={ctaRef}
      className="btn-hero btn-hero-gold hero-whatsapp-cta"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppIcon size={18} />
      <span className="hero-whatsapp-cta-label">
        <span className="hero-whatsapp-cta-label-core">{t("whatsappCtaCore")}</span>{" "}
        <span className="hero-whatsapp-cta-label-suffix">{t("whatsappCtaSuffix")}</span>
      </span>
    </a>
  );

  return (
    <>
      <section className="hero-banner">
        <div className="hero-image-col">
          <div className="hero-image-placeholder-full">
            <Image
              src={heroProduct}
              alt={`${t("heroTitleMain")} ${t("heroTitleLine2Prefix")} ${t("heroTitleHighlight")}`}
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="hero-badge">
            <CrownIcon size={27} />
            <span>
              {t("heroBadgeLine1")}
              <br />
              <strong>{t("heroBadgeLine2")}</strong>
              <br />
              {t("heroBadgeLine3")}
            </span>
          </div>
        </div>

        <div className="hero-content">
          <h1>
            {t("heroTitleMain")}
            <br />
            {t("heroTitleLine2Prefix")} <span className="text-gold">{t("heroTitleHighlight")}</span>
          </h1>

          <div className="hero-divider">
            <span className="hero-divider-line" />
            <HeartIcon size={18} className="hero-heart" />
            <span className="hero-divider-line" />
          </div>

          <p className="hero-description">{t("heroSubtitle")}</p>

          <div className="hero-cta-row">{(isAdmin || !mounted) && adminCta}</div>

          <div className="hero-features">
            {FEATURES.map(({ icon: FeatureIcon, key }) => (
              <div className="hero-feature" key={key}>
                <FeatureIcon size={26} />
                <span>{t(key)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-wave" aria-hidden="true" />
      </section>

      <Services />
      <Location />
      <Reviews />
      <Contact />
      <Footer />

      {!isAdmin && mounted && createPortal(floatingCta, document.body)}
    </>
  );
}
