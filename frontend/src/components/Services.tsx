"use client";

import { useEffect, useRef } from "react";
import eyebrowShaping from "@/assets/Eyebrow-shaping.png";
import { useLanguage } from "@/context/LanguageContext";
import { FeatherIcon, GraduationCapIcon, LeafIcon, MakeupBrushIcon } from "@/components/icons";
import Editable from "@/components/Editable";
import EditableImage from "@/components/EditableImage";

const GOLD_TONES = ["#9f6a0b", "#c58a16", "#dfad35", "#f0cf70", "#fff0ad"] as const;

type DustParticle = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: (typeof GOLD_TONES)[number];
};

function createDust(
  count: number,
  radiusX: number,
  radiusY: number,
  angleOffset: number,
  seedOffset: number
): DustParticle[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (((index * 137.508 + angleOffset) % 360) * Math.PI) / 180;
    const radialJitter = ((index * 47 + seedOffset) % 35) - 17;
    const sizeSeed = (index * 29 + seedOffset) % 19;

    return {
      x: Number((300 + Math.cos(angle) * (radiusX + radialJitter)).toFixed(2)),
      y: Number((280 + Math.sin(angle) * (radiusY + radialJitter * 0.72)).toFixed(2)),
      radius: index % 29 === 0 ? 4.4 : index % 13 === 0 ? 2.9 : Number((0.65 + sizeSeed * 0.085).toFixed(2)),
      opacity: Number((0.3 + ((index * 17 + seedOffset) % 55) / 100).toFixed(2)),
      color: GOLD_TONES[(index * 7 + seedOffset) % GOLD_TONES.length],
    };
  });
}

const OUTER_DUST = createDust(138, 267, 232, 8, 3);
const INNER_DUST = createDust(96, 232, 202, 31, 11);

const GOLD_SHARDS = Array.from({ length: 34 }, (_, index) => {
  const angleDegrees = (index * 83 + 19) % 360;
  const angle = (angleDegrees * Math.PI) / 180;
  const radialJitter = ((index * 41) % 29) - 14;

  return {
    x: Number((300 + Math.cos(angle) * (251 + radialJitter)).toFixed(2)),
    y: Number((280 + Math.sin(angle) * (217 + radialJitter * 0.75)).toFixed(2)),
    width: 1.6 + (index % 3) * 0.7,
    height: 4 + (index % 4) * 1.4,
    rotation: angleDegrees + 34,
    opacity: 0.38 + (index % 5) * 0.11,
    color: GOLD_TONES[(index + 1) % GOLD_TONES.length],
  };
});

const LIGHT_FLARES = [
  { x: 71, y: 176, scale: 0.8, rotation: -14, kind: "sparkle" },
  { x: 93, y: 111, scale: 0.42, rotation: -8, kind: "diamond" },
  { x: 132, y: 75, scale: 0.52, rotation: 8, kind: "star" },
  { x: 210, y: 45, scale: 0.48, rotation: 14, kind: "diamond" },
  { x: 302, y: 27, scale: 0.92, rotation: 2, kind: "sparkle" },
  { x: 393, y: 42, scale: 0.43, rotation: -12, kind: "sparkle" },
  { x: 478, y: 72, scale: 0.58, rotation: 18, kind: "star" },
  { x: 522, y: 128, scale: 0.4, rotation: 12, kind: "diamond" },
  { x: 557, y: 211, scale: 0.72, rotation: -8, kind: "sparkle" },
  { x: 571, y: 310, scale: 0.46, rotation: 8, kind: "star" },
  { x: 526, y: 404, scale: 0.47, rotation: 22, kind: "star" },
  { x: 492, y: 469, scale: 0.45, rotation: -16, kind: "sparkle" },
  { x: 397, y: 516, scale: 0.7, rotation: 4, kind: "sparkle" },
  { x: 299, y: 531, scale: 0.48, rotation: 7, kind: "diamond" },
  { x: 196, y: 510, scale: 0.43, rotation: -10, kind: "star" },
  { x: 112, y: 462, scale: 0.55, rotation: -18, kind: "sparkle" },
  { x: 56, y: 373, scale: 0.42, rotation: 20, kind: "sparkle" },
  { x: 49, y: 292, scale: 0.4, rotation: -6, kind: "star" },
] as const;

function SparkleLayers() {
  return (
    <>
      <svg
        className="service-sparkle-layer service-sparkle-layer-outer"
        viewBox="0 0 600 560"
        preserveAspectRatio="none"
        focusable="false"
      >
        <g className="service-sparkle-orbit service-sparkle-orbit-outer">
          {OUTER_DUST.map((particle, index) => (
            <circle
              key={`outer-${index}`}
              cx={particle.x}
              cy={particle.y}
              r={particle.radius}
              fill={particle.color}
              opacity={particle.opacity}
            />
          ))}
          {GOLD_SHARDS.map((shard, index) => (
            <rect
              key={`shard-${index}`}
              x={shard.x}
              y={shard.y}
              width={shard.width}
              height={shard.height}
              rx={shard.width / 2}
              fill={shard.color}
              opacity={shard.opacity}
              transform={`rotate(${shard.rotation} ${shard.x} ${shard.y})`}
            />
          ))}
        </g>
      </svg>

      <svg
        className="service-sparkle-layer service-sparkle-layer-inner"
        viewBox="0 0 600 560"
        preserveAspectRatio="none"
        focusable="false"
      >
        <g className="service-sparkle-orbit service-sparkle-orbit-inner">
          {INNER_DUST.map((particle, index) => (
            <circle
              key={`inner-${index}`}
              cx={particle.x}
              cy={particle.y}
              r={particle.radius}
              fill={particle.color}
              opacity={particle.opacity}
            />
          ))}
        </g>
      </svg>

      <svg
        className="service-sparkle-layer service-sparkle-layer-flares"
        viewBox="0 0 600 560"
        preserveAspectRatio="none"
        focusable="false"
      >
        <g className="service-sparkle-orbit service-sparkle-orbit-flares">
          {LIGHT_FLARES.map((flare, index) => (
            <g
              key={`flare-${index}`}
              transform={`translate(${flare.x} ${flare.y}) rotate(${flare.rotation}) scale(${flare.scale})`}
            >
              {flare.kind === "star" ? (
                <path
                  d="M0-13 3.2-4.3 12.4-4 5 1.7 7.7 11-0.1 5.7-7.8 11-5 1.7-12.4-4-3.2-4.3Z"
                  fill="#d8a52b"
                />
              ) : flare.kind === "diamond" ? (
                <path
                  d="M0-13 4.2-3.8 13 0 4.2 3.8 0 13-4.2 3.8-13 0-4.2-3.8Z"
                  fill="#edc95f"
                />
              ) : (
                <path
                  d="M0-17C1.8-5.2 4.8-1.8 17 0 4.8 1.8 1.8 5.2 0 17-1.8 5.2-4.8 1.8-17 0-4.8-1.8-1.8-5.2 0-17Z"
                  fill="#f7dd83"
                />
              )}
            </g>
          ))}
        </g>
      </svg>
    </>
  );
}

function SparkleBaseGlow({ className = "" }: { className?: string }) {
  return (
    <div className={`service-sparkle-base-glow ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 600 560" preserveAspectRatio="none" focusable="false">
        <ellipse className="service-sparkle-glow-wide" cx="300" cy="280" rx="254" ry="219" />
        <ellipse className="service-sparkle-glow-core" cx="300" cy="280" rx="251" ry="216" />
      </svg>
    </div>
  );
}

function PermanentMakeupSparkles() {
  return (
    <>
      <SparkleBaseGlow />
      <SparkleBaseGlow className="service-sparkle-base-glow-mobile-front" />
      <div className="service-sparkle-halo service-sparkle-halo-back" aria-hidden="true">
        <SparkleLayers />
      </div>
      <div className="service-sparkle-halo service-sparkle-halo-front" aria-hidden="true">
        <SparkleLayers />
      </div>
    </>
  );
}

const SERVICES = [
  { badgeIcon: GraduationCapIcon, titleKey: "service3Title" as const, descKey: "service3Desc" as const },
  { badgeIcon: FeatherIcon, titleKey: "service1Title" as const, descKey: "service1Desc" as const },
  { badgeIcon: MakeupBrushIcon, titleKey: "service2Title" as const, descKey: "service2Desc" as const },
  { badgeIcon: LeafIcon, titleKey: "service4Title" as const, descKey: "service4Desc" as const },
];

export default function Services() {
  const { t } = useLanguage();
  const permanentMakeupCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = permanentMakeupCardRef.current;
    const scrollElement = card?.closest(".page-scroll") as HTMLElement | null;
    if (!card || !scrollElement) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrameId: number | null = null;

    function updateRotation() {
      animationFrameId = null;
      const reduceMotion =
        reducedMotionQuery.matches || document.documentElement.classList.contains("a11y-reduce-motion");
      const scrollTop = reduceMotion ? 0 : scrollElement!.scrollTop;

      card!.style.setProperty("--sparkle-outer-angle", `${scrollTop * 0.055}deg`);
      card!.style.setProperty("--sparkle-inner-angle", `${scrollTop * -0.034}deg`);
      card!.style.setProperty("--sparkle-flare-angle", `${scrollTop * 0.082}deg`);
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

  return (
    <section className="services-section">
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
          const cardClassName = [
            "service-card",
            titleKey === "service3Title" ? "service-card-courses" : "",
            isPermanentMakeup ? "service-card-permanent" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div ref={isPermanentMakeup ? permanentMakeupCardRef : undefined} className={cardClassName} key={titleKey}>
              {isPermanentMakeup && <PermanentMakeupSparkles />}
              <div className="service-image">
                <EditableImage
                  imageKey="servicesCardImage"
                  fallbackSrc={eyebrowShaping}
                  alt={t(titleKey)}
                  sizes="(max-width: 860px) 85vw, 420px"
                  className="service-image-photo"
                />
                <div className="service-badge">
                  <BadgeIcon size={18} />
                </div>
              </div>
              <h3 className="service-card-title">
                <Editable contentKey={titleKey}>{t(titleKey)}</Editable>
              </h3>
              <p className="service-card-desc">
                <Editable contentKey={descKey}>{t(descKey)}</Editable>
              </p>
              <a className="service-card-link" href="#">
                {t("detailsLink")}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
