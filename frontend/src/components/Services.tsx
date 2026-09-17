"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import eyebrowShaping from "@/assets/Eyebrow-shaping.png";
import goldenFaceLineArt from "@/assets/golden-face-line-art.png";
import luxuryMakeupBrush from "@/assets/luxury-makeup-brush.png";
import magicPathImage from "@/assets/magic-path.png";
import magicPathMobileImage from "@/assets/magic-path-mobile.png";
import { useLanguage } from "@/context/LanguageContext";
import { FeatherIcon, GraduationCapIcon, LeafIcon, LipstickIcon } from "@/components/icons";
import Editable from "@/components/Editable";
import EditableImage from "@/components/EditableImage";
import EditPopover from "@/components/EditPopover";
import type { EditableTextKey } from "@/lib/editableContent";

// service3 (courses) links straight to /courses instead — only these three
// open the in-page detail modal.
const SERVICE_DETAIL_KEYS: Partial<Record<EditableTextKey, EditableTextKey>> = {
  service1Title: "service1Detail",
  service2Title: "service2Detail",
  service4Title: "service4Detail",
};

function PermanentMakeupMagicTrail() {
  return (
    <div className="service-magic-trail" aria-hidden="true">
      <Image
        className="service-magic-trail-desktop"
        src={magicPathImage}
        alt=""
        fill
        sizes="(max-width: 860px) 0px, 1100px"
      />
      <Image
        className="service-magic-trail-mobile"
        src={magicPathMobileImage}
        alt=""
        fill
        sizes="(max-width: 860px) 500px, 0px"
      />
    </div>
  );
}

function GoldenFaceOutline() {
  return (
    <span className="service-golden-face" aria-hidden="true">
      <Image
        className="service-golden-face-image"
        src={goldenFaceLineArt}
        alt=""
        fill
        sizes="(max-width: 860px) 150px, 285px"
      />
      <Image
        className="service-golden-face-image service-golden-face-image-shimmer"
        src={goldenFaceLineArt}
        alt=""
        fill
        sizes="(max-width: 860px) 150px, 285px"
      />
    </span>
  );
}

const SERVICES = [
  { badgeIcon: GraduationCapIcon, titleKey: "service3Title" as const, descKey: "service3Desc" as const },
  { badgeIcon: FeatherIcon, titleKey: "service1Title" as const, descKey: "service1Desc" as const },
  { badgeIcon: LipstickIcon, titleKey: "service2Title" as const, descKey: "service2Desc" as const },
  { badgeIcon: LeafIcon, titleKey: "service4Title" as const, descKey: "service4Desc" as const },
];

export default function Services() {
  const { t } = useLanguage();
  const servicesSectionRef = useRef<HTMLElement>(null);
  const permanentMakeupCardRef = useRef<HTMLDivElement>(null);
  const bridalMakeupCardRef = useRef<HTMLDivElement>(null);
  const facialWaxCardRef = useRef<HTMLDivElement>(null);
  const [openDetailTitleKey, setOpenDetailTitleKey] = useState<EditableTextKey | null>(null);

  useEffect(() => {
    const card = permanentMakeupCardRef.current;
    const bridalCard = bridalMakeupCardRef.current;
    const facialWaxCard = facialWaxCardRef.current;
    const scrollElement = card?.closest(".page-scroll") as HTMLElement | null;
    if (!card || !bridalCard || !facialWaxCard || !scrollElement) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrameId: number | null = null;

    function updateRotation() {
      animationFrameId = null;
      const reduceMotion =
        reducedMotionQuery.matches || document.documentElement.classList.contains("a11y-reduce-motion");
      const scrollTop = reduceMotion ? 0 : scrollElement!.scrollTop;
      bridalCard!.style.setProperty("--bridal-brush-angle", `${scrollTop * 0.02}deg`);
      const faceShinePosition = reduceMotion ? 50 : 66 - ((scrollTop * 0.0066) % 33);
      facialWaxCard!.style.setProperty("--face-shine-position", `${faceShinePosition}%`);
    }

    function queueRotationUpdate() {
      if (animationFrameId !== null) return;
      animationFrameId = requestAnimationFrame(updateRotation);
    }

    const classObserver = new MutationObserver(queueRotationUpdate);
    classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    updateRotation();
    scrollElement.addEventListener("scroll", queueRotationUpdate, { passive: true });
    reducedMotionQuery.addEventListener("change", queueRotationUpdate);

    return () => {
      scrollElement.removeEventListener("scroll", queueRotationUpdate);
      reducedMotionQuery.removeEventListener("change", queueRotationUpdate);
      classObserver.disconnect();
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const section = servicesSectionRef.current;
    if (!section) return;

    const detailButtons = Array.from(section.querySelectorAll<HTMLElement>(".service-card-link"));
    if (detailButtons.length === 0) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timerId: number | null = null;
    let shuffledButtons: HTMLElement[] = [];

    function prefersReducedMotion() {
      return reducedMotionQuery.matches || document.documentElement.classList.contains("a11y-reduce-motion");
    }

    function clearGlints() {
      detailButtons.forEach((button) => button.classList.remove("is-sun-glinting"));
    }

    function nextButton() {
      if (shuffledButtons.length === 0) {
        shuffledButtons = [...detailButtons];
        for (let index = shuffledButtons.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [shuffledButtons[index], shuffledButtons[randomIndex]] = [
            shuffledButtons[randomIndex],
            shuffledButtons[index],
          ];
        }
      }

      return shuffledButtons.pop();
    }

    function nextVisibleButton() {
      const visibleButtons = detailButtons.filter((button) => {
        const bounds = button.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight;
      });

      if (visibleButtons.length === 0) return nextButton();
      return visibleButtons[Math.floor(Math.random() * visibleButtons.length)];
    }

    function scheduleGlint(isInitial = false) {
      const minimumDelay = isInitial ? 900 : 2200;
      const randomRange = isInitial ? 1800 : 4000;
      const delay = minimumDelay + Math.random() * randomRange;

      timerId = window.setTimeout(() => {
        if (prefersReducedMotion()) return;

        const button = nextVisibleButton();
        if (!button) return;

        button.classList.add("is-sun-glinting");
        timerId = window.setTimeout(() => {
          button.classList.remove("is-sun-glinting");
          scheduleGlint();
        }, 1450);
      }, delay);
    }

    function resetGlints() {
      if (timerId !== null) window.clearTimeout(timerId);
      timerId = null;
      clearGlints();
      if (!prefersReducedMotion()) scheduleGlint(true);
    }

    const classObserver = new MutationObserver(resetGlints);
    classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    reducedMotionQuery.addEventListener("change", resetGlints);
    scheduleGlint(true);

    return () => {
      if (timerId !== null) window.clearTimeout(timerId);
      reducedMotionQuery.removeEventListener("change", resetGlints);
      classObserver.disconnect();
      clearGlints();
    };
  }, []);

  return (
    <section className="services-section" ref={servicesSectionRef}>
      <h2 className="services-title" aria-label={`${t("servicesTitleKicker")} ${t("servicesTitleMain")}`}>
        <span className="services-title-kicker">
          <Editable contentKey="servicesTitleKicker">{t("servicesTitleKicker")}</Editable>
        </span>
        <span className="services-title-main">
          <Editable contentKey="servicesTitleMain">{t("servicesTitleMain")}</Editable>
        </span>
      </h2>
      <div className="services-grid">
        {SERVICES.map(({ badgeIcon: BadgeIcon, titleKey, descKey }) => {
          const isPermanentMakeup = titleKey === "service1Title";
          const isBridalMakeup = titleKey === "service2Title";
          const isCourses = titleKey === "service3Title";
          const isFacialWax = titleKey === "service4Title";
          const cardClassName = [
            "service-card",
            isCourses ? "service-card-courses" : "",
            isPermanentMakeup ? "service-card-permanent" : "",
            isBridalMakeup ? "service-card-bridal" : "",
            isFacialWax ? "service-card-wax" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              ref={
                isPermanentMakeup
                  ? permanentMakeupCardRef
                  : isBridalMakeup
                    ? bridalMakeupCardRef
                    : isFacialWax
                      ? facialWaxCardRef
                      : undefined
              }
              className={cardClassName}
              key={titleKey}
            >
              {isPermanentMakeup && <PermanentMakeupMagicTrail />}
              {isFacialWax && <GoldenFaceOutline />}
              {isBridalMakeup && (
                <span className="service-bridal-brush" aria-hidden="true">
                  <Image src={luxuryMakeupBrush} alt="" fill sizes="310px" />
                </span>
              )}
              <div className="service-image">
                <EditableImage
                  imageKey="servicesCardImage"
                  fallbackSrc={eyebrowShaping}
                  alt={t(titleKey)}
                  sizes="(max-width: 860px) 85vw, 420px"
                  className="service-image-photo"
                />
                <div className="service-badge">
                  <BadgeIcon size={isBridalMakeup ? 21 : 18} />
                </div>
              </div>
              <h3 className="service-card-title">
                <Editable contentKey={titleKey}>{t(titleKey)}</Editable>
              </h3>
              <p className="service-card-desc">
                <Editable contentKey={descKey}>{t(descKey)}</Editable>
              </p>
              {isCourses ? (
                <Link className="service-card-link" href="/courses">
                  <Editable contentKey="detailsLink" interceptAncestorClick={false}>
                    {t("detailsLink")}
                  </Editable>
                </Link>
              ) : (
                <button type="button" className="service-card-link" onClick={() => setOpenDetailTitleKey(titleKey)}>
                  <Editable contentKey="detailsLink" interceptAncestorClick={false}>
                    {t("detailsLink")}
                  </Editable>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {openDetailTitleKey &&
        (() => {
          const detailKey = SERVICE_DETAIL_KEYS[openDetailTitleKey];
          if (!detailKey) return null;
          return (
            <EditPopover title={t(openDetailTitleKey)} onClose={() => setOpenDetailTitleKey(null)} centerTitle>
              <p className="service-detail-text">
                <Editable contentKey={detailKey}>{t(detailKey)}</Editable>
              </p>
            </EditPopover>
          );
        })()}
    </section>
  );
}
