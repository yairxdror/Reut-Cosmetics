"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import heroProduct from "@/assets/hero-product.jpg";
import { useLanguage } from "@/context/LanguageContext";
import { useAdmin } from "@/context/AdminContext";
import { WHATSAPP_URL } from "@/lib/contact";
import Editable from "@/components/Editable";
import EditableImage from "@/components/EditableImage";
import {
  CrownIcon,
  DiamondIcon,
  HeartIcon,
  PersonIcon,
  ShieldIcon,
  VipBadgeIcon,
  WhatsAppIcon,
} from "@/components/icons";
import Services from "@/components/Services";
import BeforeAfter from "@/components/BeforeAfter";
import Location from "@/components/Location";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const FEATURES = [
  { icon: VipBadgeIcon, key: "featureDiagnostics" as const },
  { icon: PersonIcon, key: "featurePersonalService" as const },
  { icon: DiamondIcon, key: "featureEquipped" as const },
  { icon: ShieldIcon, key: "featureMaterials" as const },
];

export default function Home() {
  const { t } = useLanguage();
  const { isAdmin } = useAdmin();
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const heroBadgeGlintRef = useRef<HTMLSpanElement>(null);

  // The CTA remains in the hero's normal document flow until its center
  // meets the nav bar's center. The very same element then becomes fixed at
  // those identical viewport coordinates. This makes its travel native page
  // movement instead of a JavaScript approximation of the scroll. Guests
  // get the effect everywhere; signed-in admins get it on desktop only.
  useLayoutEffect(() => {
    const scrollEl = document.querySelector<HTMLElement>(".page-scroll");
    const navEl = document.querySelector<HTMLElement>(".nav-bar");
    const anchorEl = document.querySelector<HTMLElement>(".hero-cta-row");
    const ctaEl = ctaRef.current;
    if (!scrollEl || !navEl || !anchorEl || !ctaEl) return;

    const scrollContainer = scrollEl;
    const navBar = navEl;
    const anchor = anchorEl;
    const cta = ctaEl;

    const SHRINK_START = 0.65;
    let dockScrollTop = 1;

    function update() {
      const effectEnabled = !isAdmin || window.innerWidth > 860;
      if (!effectEnabled) {
        cta.classList.remove("is-docked");
        cta.style.setProperty("--wa-shrink", "0");
        return;
      }

      const progress = Math.min(Math.max(scrollContainer.scrollTop / dockScrollTop, 0), 1);
      const mobileShrink =
        window.innerWidth <= 560
          ? Math.min(Math.max((progress - SHRINK_START) / (1 - SHRINK_START), 0), 1)
          : 0;

      cta.classList.toggle("is-docked", scrollContainer.scrollTop >= dockScrollTop);
      cta.style.setProperty("--wa-shrink", String(mobileShrink));
    }

    function measure() {
      const anchorRect = anchor.getBoundingClientRect();
      const navRect = navBar.getBoundingClientRect();
      const anchorDocumentCenter = anchorRect.top + scrollContainer.scrollTop + anchorRect.height / 2;
      const dockTop = navRect.top + navRect.height / 2;
      dockScrollTop = Math.max(anchorDocumentCenter - dockTop, 1);

      cta.style.setProperty("--wa-dock-top", `${dockTop}px`);
      cta.style.setProperty("--wa-dock-left", `${anchorRect.left + anchorRect.width / 2}px`);

      const suffixEl = cta.querySelector<HTMLElement>(".hero-whatsapp-cta-label-suffix");
      if (suffixEl) cta.style.setProperty("--wa-suffix-width", `${suffixEl.scrollWidth}px`);
      update();
    }

    function handleResize() {
      measure();
    }

    measure();
    scrollContainer.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(navBar);
    resizeObserver.observe(anchor);

    return () => {
      scrollContainer.removeEventListener("scroll", update);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      cta.classList.remove("is-docked");
      cta.style.removeProperty("--wa-shrink");
    };
  }, [isAdmin]);

  useEffect(() => {
    const glint = heroBadgeGlintRef.current!;
    if (!glint) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timerId: number | null = null;

    function prefersReducedMotion() {
      return reducedMotionQuery.matches || document.documentElement.classList.contains("a11y-reduce-motion");
    }

    function scheduleGlint(isInitial = false) {
      const minimumDelay = isInitial ? 900 : 2200;
      const randomRange = isInitial ? 1800 : 4000;

      timerId = window.setTimeout(() => {
        if (prefersReducedMotion()) return;

        glint.classList.add("is-sun-glinting");
        timerId = window.setTimeout(() => {
          glint.classList.remove("is-sun-glinting");
          scheduleGlint();
        }, 1450);
      }, minimumDelay + Math.random() * randomRange);
    }

    function resetGlint() {
      if (timerId !== null) window.clearTimeout(timerId);
      timerId = null;
      glint.classList.remove("is-sun-glinting");
      if (!prefersReducedMotion()) scheduleGlint(true);
    }

    const classObserver = new MutationObserver(resetGlint);
    classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    reducedMotionQuery.addEventListener("change", resetGlint);
    scheduleGlint(true);

    return () => {
      if (timerId !== null) window.clearTimeout(timerId);
      reducedMotionQuery.removeEventListener("change", resetGlint);
      classObserver.disconnect();
      glint.classList.remove("is-sun-glinting");
    };
  }, []);

  // On narrow screens only the suffix gradually collapses; the core label
  // and WhatsApp icon remain visible after docking.
  const whatsappCta = (
    <a
      ref={ctaRef}
      className="btn-hero btn-hero-gold hero-whatsapp-cta"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppIcon size={18} />
      <span className="hero-whatsapp-cta-label">
        <span className="hero-whatsapp-cta-label-core">
          <Editable contentKey="whatsappCtaCore">{t("whatsappCtaCore")}</Editable>
        </span>{" "}
        <span className="hero-whatsapp-cta-label-suffix">
          <Editable contentKey="whatsappCtaSuffix">{t("whatsappCtaSuffix")}</Editable>
        </span>
      </span>
    </a>
  );

  return (
    <>
      <section className="hero-banner">
        <div className="hero-wave-top" aria-hidden="true" />

        <div className="hero-image-col">
          <div className="hero-image-placeholder-full">
            <EditableImage
              imageKey="heroProduct"
              fallbackSrc={heroProduct}
              alt={`${t("heroTitleMain")} ${t("heroTitleLine2Prefix")} ${t("heroTitleHighlight")}`}
              sizes="(max-width: 860px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="hero-badge">
            <span ref={heroBadgeGlintRef} className="hero-badge-glint" aria-hidden="true" />
            <CrownIcon size={27} />
            <span>
              <Editable contentKey="heroBadgeLine1">{t("heroBadgeLine1")}</Editable>
              <br />
              <strong>
                <Editable contentKey="heroBadgeLine2">{t("heroBadgeLine2")}</Editable>
              </strong>
              <br />
              <Editable contentKey="heroBadgeLine3">{t("heroBadgeLine3")}</Editable>
            </span>
          </div>
        </div>

        <div className="hero-content">
          <h1>
            <Editable contentKey="heroTitleMain">{t("heroTitleMain")}</Editable>
            <br />
            <Editable contentKey="heroTitleLine2Prefix">{t("heroTitleLine2Prefix")}</Editable>{" "}
            <span className="text-gold">
              <Editable contentKey="heroTitleHighlight">{t("heroTitleHighlight")}</Editable>
            </span>
          </h1>

          <div className="hero-divider">
            <span className="hero-divider-line" />
            <HeartIcon size={18} className="hero-heart" />
            <span className="hero-divider-line" />
          </div>

          <p className="hero-description">
            <Editable contentKey="heroSubtitle">{t("heroSubtitle")}</Editable>
          </p>

          <div className="hero-cta-row">{whatsappCta}</div>

          <div className="hero-features">
            {FEATURES.map(({ icon: FeatureIcon, key }) => (
              <div className="hero-feature" key={key}>
                <FeatureIcon size={26} />
                <span>
                  <Editable contentKey={key}>{t(key)}</Editable>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-wave" aria-hidden="true" />
      </section>

      <Services />
      <BeforeAfter />
      <Location />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
}
