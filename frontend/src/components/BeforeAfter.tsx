"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import EditableImage from "@/components/EditableImage";
import TieredTitle from "@/components/TieredTitle";
import { SlideArrowsIcon } from "@/components/icons";
import type { EditableImageKey } from "@/lib/editableContent";
import beforePhoto from "@/assets/before-after-before.png";
import afterPhoto from "@/assets/before-after-after.png";
import beforePhoto2 from "@/assets/before-after-before-2.png";
import afterPhoto2 from "@/assets/before-after-after-2.png";
import beforePhoto3 from "@/assets/before-after-before-3.png";
import afterPhoto3 from "@/assets/before-after-after-3.png";

const DEFAULT_POSITION = 50;
const MIN_POSITION = 5;
const MAX_POSITION = 95;
const STEP = 5;

const SETS: Array<{
  beforeKey: EditableImageKey;
  afterKey: EditableImageKey;
  beforeFallback: typeof beforePhoto;
  afterFallback: typeof afterPhoto;
}> = [
  {
    beforeKey: "beforeAfterImageBefore",
    afterKey: "beforeAfterImageAfter",
    beforeFallback: beforePhoto,
    afterFallback: afterPhoto,
  },
  {
    beforeKey: "beforeAfterImageBefore2",
    afterKey: "beforeAfterImageAfter2",
    beforeFallback: beforePhoto2,
    afterFallback: afterPhoto2,
  },
  {
    beforeKey: "beforeAfterImageBefore3",
    afterKey: "beforeAfterImageAfter3",
    beforeFallback: beforePhoto3,
    afterFallback: afterPhoto3,
  },
];

export default function BeforeAfter() {
  const { t } = useLanguage();
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [activeSet, setActiveSet] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  function updateFromClientX(clientX: number) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const fraction = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(MAX_POSITION, Math.max(MIN_POSITION, fraction)));
  }

  // Attached to the handle track only (not the images) — capturing on
  // currentTarget means it keeps tracking the drag even once the pointer
  // moves off the (fairly narrow) track and over the photos.
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  // The handle's own physical left/right meaning doesn't depend on reading
  // direction (it's dragged by clientX either way), so arrow keys are kept
  // physical too rather than logical/RTL-flipped — least surprising for a
  // pointer-driven widget where "left" always means "toward the left edge".
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((prev) => Math.max(MIN_POSITION, prev - STEP));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((prev) => Math.min(MAX_POSITION, prev + STEP));
    }
  }

  function selectSet(index: number) {
    setActiveSet(index);
    setPosition(DEFAULT_POSITION);
  }

  const current = SETS[activeSet];

  return (
    <section className="before-after-section">
      <TieredTitle contentKey="beforeAfterTitle" className="before-after-title" />

      <div className="before-after-slider" ref={containerRef}>
        <div className="before-after-layer before-after-layer-base">
          <EditableImage
            imageKey={current.beforeKey}
            fallbackSrc={current.beforeFallback}
            alt={t("beforeAfterBeforeAlt")}
            sizes="(max-width: 860px) 90vw, 640px"
            className="before-after-image"
          />
          <span className="before-after-badge before-after-badge-before">
            <Editable contentKey="beforeAfterBeforeLabel">{t("beforeAfterBeforeLabel")}</Editable>
          </span>
        </div>

        <div
          className="before-after-layer before-after-layer-reveal"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <EditableImage
            imageKey={current.afterKey}
            fallbackSrc={current.afterFallback}
            alt={t("beforeAfterAfterAlt")}
            sizes="(max-width: 860px) 90vw, 640px"
            className="before-after-image"
          />
          <span className="before-after-badge before-after-badge-after">
            <Editable contentKey="beforeAfterAfterLabel">{t("beforeAfterAfterLabel")}</Editable>
          </span>
        </div>

        <div
          className="before-after-handle-track"
          style={{ left: `${position}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="before-after-handle"
            role="slider"
            tabIndex={0}
            aria-label={t("beforeAfterHandleLabel")}
            aria-valuemin={MIN_POSITION}
            aria-valuemax={MAX_POSITION}
            aria-valuenow={Math.round(position)}
            onKeyDown={handleKeyDown}
          >
            <SlideArrowsIcon size={18} />
          </div>
        </div>
      </div>

      <div className="before-after-thumbnails">
        {SETS.map((set, index) => (
          <button
            key={set.afterKey}
            type="button"
            className={`before-after-thumbnail-btn${
              index === activeSet ? " before-after-thumbnail-btn-active" : ""
            }`}
            onClick={() => selectSet(index)}
            aria-pressed={index === activeSet}
            aria-label={`${t("beforeAfterExampleLabel")} ${index + 1}`}
          >
            <EditableImage
              imageKey={set.afterKey}
              fallbackSrc={set.afterFallback}
              alt={`${t("beforeAfterExampleLabel")} ${index + 1}`}
              sizes="64px"
              className="before-after-thumbnail-image"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
