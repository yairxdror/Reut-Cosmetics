"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import eyebrowShaping from "@/assets/Eyebrow-shaping.png";
import goldenFaceLineArt from "@/assets/golden-face-line-art.png";
import luxuryMakeupBrush from "@/assets/luxury-makeup-brush.png";
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

type MagicTrailFlare = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  kind: "sparkle" | "diamond" | "star";
};

const MAGIC_TRAIL_DESKTOP_PATH =
  "M125 10C90 35 22 47 8 75C-8 110 28 145 76 190C95 208 110 213 135 222C220 303 335 400 430 492C465 530 470 590 440 645C405 705 320 730 220 750C120 770 62 735 62 670C60 590 80 545 120 515C195 458 310 425 430 432C560 430 680 500 785 585C870 655 930 720 995 747";

const MAGIC_TRAIL_MOBILE_PATH =
  "M306 52C328 61 342 103 337 141C333 176 312 191 289 211C266 232 263 252 259 279C255 308 247 325 225 329C198 333 177 326 158 316C139 306 116 308 99 322C78 340 82 366 103 371C126 376 141 353 130 338C116 318 82 324 57 348C28 376 25 423 29 468C31 486 38 500 52 508C60 514 69 518 80 519";

const DESKTOP_TRAIL_FLARES: MagicTrailFlare[] = [
  { x: 125, y: 10, scale: 0.7, rotation: -10, kind: "sparkle" },
  { x: 80, y: 35, scale: 0.34, rotation: 13, kind: "diamond" },
  { x: 25, y: 60, scale: 0.46, rotation: -7, kind: "star" },
  { x: 8, y: 90, scale: 0.4, rotation: 18, kind: "sparkle" },
  { x: 30, y: 135, scale: 0.3, rotation: -4, kind: "diamond" },
  { x: 75, y: 185, scale: 0.35, rotation: 8, kind: "star" },
  { x: 135, y: 222, scale: 0.64, rotation: -12, kind: "sparkle" },
  { x: 200, y: 285, scale: 0.32, rotation: 17, kind: "diamond" },
  { x: 270, y: 350, scale: 0.46, rotation: 2, kind: "star" },
  { x: 340, y: 415, scale: 0.6, rotation: -18, kind: "sparkle" },
  { x: 410, y: 475, scale: 0.32, rotation: 12, kind: "diamond" },
  { x: 445, y: 535, scale: 0.42, rotation: -7, kind: "star" },
  { x: 450, y: 600, scale: 0.34, rotation: 19, kind: "sparkle" },
  { x: 420, y: 655, scale: 0.54, rotation: -14, kind: "diamond" },
  { x: 355, y: 700, scale: 0.38, rotation: 8, kind: "star" },
  { x: 270, y: 730, scale: 0.66, rotation: -8, kind: "sparkle" },
  { x: 180, y: 748, scale: 0.34, rotation: 16, kind: "diamond" },
  { x: 105, y: 730, scale: 0.4, rotation: 4, kind: "star" },
  { x: 64, y: 690, scale: 0.32, rotation: -15, kind: "sparkle" },
  { x: 65, y: 620, scale: 0.56, rotation: 12, kind: "sparkle" },
  { x: 90, y: 555, scale: 0.36, rotation: -8, kind: "diamond" },
  { x: 140, y: 505, scale: 0.64, rotation: 7, kind: "star" },
  { x: 220, y: 465, scale: 0.34, rotation: -12, kind: "sparkle" },
  { x: 320, y: 438, scale: 0.42, rotation: 15, kind: "diamond" },
  { x: 430, y: 432, scale: 0.58, rotation: -5, kind: "star" },
  { x: 540, y: 450, scale: 0.32, rotation: 18, kind: "sparkle" },
  { x: 640, y: 500, scale: 0.4, rotation: -9, kind: "diamond" },
  { x: 735, y: 565, scale: 0.56, rotation: 6, kind: "star" },
  { x: 815, y: 630, scale: 0.34, rotation: -14, kind: "sparkle" },
  { x: 890, y: 695, scale: 0.42, rotation: 11, kind: "diamond" },
  { x: 955, y: 735, scale: 0.5, rotation: -6, kind: "star" },
  { x: 995, y: 747, scale: 0.66, rotation: 8, kind: "sparkle" },
];

const MOBILE_TRAIL_FLARES: MagicTrailFlare[] = [
  { x: 306, y: 52, scale: 0.64, rotation: -10, kind: "sparkle" },
  { x: 330, y: 88, scale: 0.34, rotation: 12, kind: "diamond" },
  { x: 338, y: 139, scale: 0.44, rotation: -8, kind: "star" },
  { x: 316, y: 184, scale: 0.37, rotation: 16, kind: "sparkle" },
  { x: 287, y: 212, scale: 0.3, rotation: -5, kind: "diamond" },
  { x: 266, y: 252, scale: 0.32, rotation: 9, kind: "star" },
  { x: 254, y: 304, scale: 0.57, rotation: -12, kind: "sparkle" },
  { x: 224, y: 329, scale: 0.32, rotation: 15, kind: "diamond" },
  { x: 181, y: 320, scale: 0.42, rotation: 4, kind: "star" },
  { x: 108, y: 326, scale: 0.31, rotation: 10, kind: "diamond" },
  { x: 104, y: 371, scale: 0.36, rotation: 17, kind: "sparkle" },
  { x: 129, y: 351, scale: 0.44, rotation: -11, kind: "diamond" },
  { x: 76, y: 337, scale: 0.3, rotation: -14, kind: "diamond" },
  { x: 48, y: 363, scale: 0.46, rotation: 8, kind: "star" },
  { x: 31, y: 404, scale: 0.34, rotation: 13, kind: "sparkle" },
  { x: 28, y: 449, scale: 0.3, rotation: -8, kind: "diamond" },
  { x: 36, y: 486, scale: 0.42, rotation: 11, kind: "star" },
  { x: 52, y: 508, scale: 0.6, rotation: -5, kind: "sparkle" },
  { x: 72, y: 517, scale: 0.34, rotation: 8, kind: "diamond" },
];

function MagicTrailGlyph({ kind }: { kind: MagicTrailFlare["kind"] }) {
  if (kind === "star") {
    return <path d="M0-13 3.2-4.3 12.4-4 5 1.7 7.7 11-0.1 5.7-7.8 11-5 1.7-12.4-4-3.2-4.3Z" />;
  }

  if (kind === "diamond") {
    return <path d="M0-13 4.2-3.8 13 0 4.2 3.8 0 13-4.2 3.8-13 0-4.2-3.8Z" />;
  }

  return <path d="M0-17C1.8-5.2 4.8-1.8 17 0 4.8 1.8 1.8 5.2 0 17-1.8 5.2-4.8 1.8-17 0-4.8-1.8-1.8-5.2 0-17Z" />;
}

// Math.sin/** (pow) aren't guaranteed bit-identical across JS engines, so the
// raw values below can differ in their last digit between server and client
// renders. Rounding before they hit the DOM (as data-* attrs and inside the
// transform string) keeps the serialized markup byte-identical and avoids a
// hydration mismatch; the lost precision is far below anything visible.
function roundForHydration(value: number) {
  return Math.round(value * 1000) / 1000;
}

function MagicTrailArtwork({
  className,
  viewBox,
  path,
  flares,
  flareSpread,
  trailSpread,
  endpointTaper,
}: {
  className: string;
  viewBox: string;
  path: string;
  flares: MagicTrailFlare[];
  flareSpread: number;
  trailSpread: number;
  endpointTaper: number;
}) {
  const flareLanes = [
    {
      x: trailSpread * -1.08,
      y: trailSpread * 0.78,
      className: "service-magic-trail-flare-lane-outer",
      densityStep: 3,
      densityOffset: 0,
      scale: 0.64,
      motionSpeed: 0.68,
    },
    {
      x: trailSpread * -0.54,
      y: trailSpread * 0.38,
      className: "service-magic-trail-flare-lane-inner",
      densityStep: 2,
      densityOffset: 1,
      scale: 0.76,
      motionSpeed: 0.84,
    },
    {
      x: 0,
      y: 0,
      className: "service-magic-trail-flare-lane-core",
      densityStep: 1,
      densityOffset: 0,
      scale: 1,
      motionSpeed: 1,
    },
    {
      x: trailSpread * 0.54,
      y: trailSpread * -0.38,
      className: "service-magic-trail-flare-lane-inner",
      densityStep: 2,
      densityOffset: 0,
      scale: 0.76,
      motionSpeed: 0.84,
    },
    {
      x: trailSpread * 1.08,
      y: trailSpread * -0.78,
      className: "service-magic-trail-flare-lane-outer",
      densityStep: 3,
      densityOffset: 1,
      scale: 0.64,
      motionSpeed: 0.68,
    },
  ];

  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="none" focusable="false">
      <path
        className="service-magic-trail-glow service-magic-trail-glow-wide service-magic-trail-motion-path"
        d={path}
      />
      <path className="service-magic-trail-glow service-magic-trail-glow-core" d={path} />
      <path
        className="service-magic-trail-stream service-magic-trail-stream-scatter service-magic-trail-stream-scatter-a"
        d={path}
        transform={`translate(${trailSpread * -0.52} ${trailSpread * 0.38})`}
      />
      <path
        className="service-magic-trail-stream service-magic-trail-stream-scatter service-magic-trail-stream-scatter-b"
        d={path}
        transform={`translate(${trailSpread * 0.54} ${trailSpread * -0.4})`}
      />
      <path
        className="service-magic-trail-stream service-magic-trail-stream-scatter service-magic-trail-stream-scatter-c"
        d={path}
        transform={`translate(${-trailSpread} ${trailSpread * 0.72})`}
      />
      <path
        className="service-magic-trail-stream service-magic-trail-stream-scatter service-magic-trail-stream-scatter-d"
        d={path}
        transform={`translate(${trailSpread} ${trailSpread * -0.72})`}
      />
      <path className="service-magic-trail-stream service-magic-trail-stream-soft" d={path} />
      <path className="service-magic-trail-stream service-magic-trail-stream-dust" d={path} />
      <path className="service-magic-trail-stream service-magic-trail-stream-shards" d={path} />
      <g className="service-magic-trail-flares">
        {flareLanes.map((lane, laneIndex) => (
          <g className={lane.className} key={`${className}-lane-${laneIndex}`}>
            {flares.map((flare, index) => {
              if (index % lane.densityStep !== lane.densityOffset) return null;

              const progress = flares.length > 1 ? index / (flares.length - 1) : 0.5;
              const centerWidth = Math.sin(Math.PI * progress) ** 0.72;
              const widthFactor = 1 - endpointTaper * (1 - centerWidth);
              const baseX = roundForHydration(
                flare.x + (lane.x + ((((index * 17) % 11) - 5) * flareSpread) / 5) * widthFactor
              );
              const baseY = roundForHydration(
                flare.y + (lane.y + ((((index * 23) % 13) - 6) * flareSpread) / 6) * widthFactor
              );
              const baseScale = roundForHydration(flare.scale * lane.scale * (0.9 + widthFactor * 0.1));

              return (
                <g
                  key={`${className}-${laneIndex}-${index}`}
                  data-magic-trail-flare-position="true"
                  data-base-x={baseX}
                  data-base-y={baseY}
                  data-base-rotation={flare.rotation}
                  data-base-scale={baseScale}
                  data-motion-speed={lane.motionSpeed}
                  transform={`translate(${baseX} ${baseY}) rotate(${flare.rotation}) scale(${baseScale})`}
                >
                  <g className={`service-magic-trail-flare service-magic-trail-flare-${index % 3}`}>
                    <MagicTrailGlyph kind={flare.kind} />
                  </g>
                </g>
              );
            })}
          </g>
        ))}
      </g>
    </svg>
  );
}

function PermanentMakeupMagicTrail() {
  return (
    <div className="service-magic-trail" aria-hidden="true">
      <MagicTrailArtwork
        className="service-magic-trail-art service-magic-trail-art-desktop"
        viewBox="0 0 1000 760"
        path={MAGIC_TRAIL_DESKTOP_PATH}
        flares={DESKTOP_TRAIL_FLARES}
        flareSpread={18}
        trailSpread={40}
        endpointTaper={0.52}
      />
      <MagicTrailArtwork
        className="service-magic-trail-art service-magic-trail-art-mobile"
        viewBox="0 0 360 520"
        path={MAGIC_TRAIL_MOBILE_PATH}
        flares={MOBILE_TRAIL_FLARES}
        flareSpread={7}
        trailSpread={16}
        endpointTaper={0.64}
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
    const mobileLayoutQuery = window.matchMedia("(max-width: 860px)");
    const pathSamples = new Map<
      SVGPathElement,
      { totalLength: number; samples: Array<{ length: number; x: number; y: number }> }
    >();

    const movingTrailFlares = Array.from(
      card.querySelectorAll<SVGGElement>("[data-magic-trail-flare-position]")
    ).flatMap((element) => {
      const artwork = element.ownerSVGElement;
      const path = artwork?.querySelector<SVGPathElement>(".service-magic-trail-motion-path");
      const baseX = Number(element.dataset.baseX);
      const baseY = Number(element.dataset.baseY);
      const baseRotation = Number(element.dataset.baseRotation);
      const baseScale = Number(element.dataset.baseScale);
      const motionSpeed = Number(element.dataset.motionSpeed);
      if (!artwork || !path || ![baseX, baseY, baseRotation, baseScale, motionSpeed].every(Number.isFinite)) {
        return [];
      }

      let pathData = pathSamples.get(path);
      if (!pathData) {
        const totalLength = path.getTotalLength();
        const samples = Array.from({ length: 241 }, (_, index) => {
          const length = (totalLength * index) / 240;
          const point = path.getPointAtLength(length);
          return { length, x: point.x, y: point.y };
        });
        pathData = { totalLength, samples };
        pathSamples.set(path, pathData);
      }

      let nearestSample = pathData.samples[0];
      let nearestDistanceSquared = Number.POSITIVE_INFINITY;
      pathData.samples.forEach((sample) => {
        const distanceSquared = (sample.x - baseX) ** 2 + (sample.y - baseY) ** 2;
        if (distanceSquared < nearestDistanceSquared) {
          nearestDistanceSquared = distanceSquared;
          nearestSample = sample;
        }
      });

      const before = path.getPointAtLength(Math.max(0, nearestSample.length - 1));
      const after = path.getPointAtLength(Math.min(pathData.totalLength, nearestSample.length + 1));
      const tangentLength = Math.hypot(after.x - before.x, after.y - before.y) || 1;
      const tangentX = (after.x - before.x) / tangentLength;
      const tangentY = (after.y - before.y) / tangentLength;
      const normalX = -tangentY;
      const normalY = tangentX;
      const offsetX = baseX - nearestSample.x;
      const offsetY = baseY - nearestSample.y;

      return [
        {
          element,
          path,
          totalLength: pathData.totalLength,
          baseLength: nearestSample.length,
          tangentOffset: offsetX * tangentX + offsetY * tangentY,
          normalOffset: offsetX * normalX + offsetY * normalY,
          baseRotation,
          baseScale,
          motionSpeed,
          mobile: artwork.classList.contains("service-magic-trail-art-mobile"),
        },
      ];
    });
    let animationFrameId: number | null = null;

    function updateRotation() {
      animationFrameId = null;
      const reduceMotion =
        reducedMotionQuery.matches || document.documentElement.classList.contains("a11y-reduce-motion");
      const scrollTop = reduceMotion ? 0 : scrollElement!.scrollTop;
      const useMobileTrail = mobileLayoutQuery.matches;
      const mainDustSpeed = useMobileTrail ? 0.44 : 0.6;
      const innerDustSpeed = useMobileTrail ? 0.37 : 0.5;
      const outerDustSpeed = useMobileTrail ? 0.28 : 0.38;

      card!.style.setProperty("--magic-trail-dash-offset", `${scrollTop * mainDustSpeed}px`);
      card!.style.setProperty("--magic-trail-dash-offset-inner", `${scrollTop * innerDustSpeed}px`);
      card!.style.setProperty("--magic-trail-dash-offset-outer", `${scrollTop * outerDustSpeed}px`);
      card!.style.setProperty("--magic-trail-angle", `${scrollTop * 0.035}deg`);
      card!.style.setProperty("--magic-trail-counter-angle", `${scrollTop * -0.022}deg`);
      const trailDistance = scrollTop * (useMobileTrail ? 0.3 : 0.42);
      movingTrailFlares.forEach((flare) => {
        if (flare.mobile !== useMobileTrail) return;

        const wrappedLength =
          ((flare.baseLength - trailDistance * flare.motionSpeed) % flare.totalLength + flare.totalLength) %
          flare.totalLength;
        const point = flare.path.getPointAtLength(wrappedLength);
        const before = flare.path.getPointAtLength(Math.max(0, wrappedLength - 1));
        const after = flare.path.getPointAtLength(Math.min(flare.totalLength, wrappedLength + 1));
        const tangentLength = Math.hypot(after.x - before.x, after.y - before.y) || 1;
        const tangentX = (after.x - before.x) / tangentLength;
        const tangentY = (after.y - before.y) / tangentLength;
        const normalX = -tangentY;
        const normalY = tangentX;
        const x = point.x + tangentX * flare.tangentOffset + normalX * flare.normalOffset;
        const y = point.y + tangentY * flare.tangentOffset + normalY * flare.normalOffset;

        flare.element.setAttribute(
          "transform",
          `translate(${x} ${y}) rotate(${flare.baseRotation}) scale(${flare.baseScale})`
        );
      });
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
    mobileLayoutQuery.addEventListener("change", queueRotationUpdate);

    return () => {
      scrollElement.removeEventListener("scroll", queueRotationUpdate);
      reducedMotionQuery.removeEventListener("change", queueRotationUpdate);
      mobileLayoutQuery.removeEventListener("change", queueRotationUpdate);
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
