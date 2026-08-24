"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { AccessibilityIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

type FontScale = "normal" | "large" | "xlarge";

interface A11yPrefs {
  fontScale: FontScale;
  highContrast: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  rightMargin: number;
}

// Direction-independent: which of the three rail segments the button sits
// on, and how far along it (0 to 1). Storing it this way — rather than raw
// pixels — means it stays sensible when RTL/LTR swap which side has the
// scrollbar-clearance margin, when the window resizes, etc.
interface RailPosition {
  rail: "bottom" | "left" | "right";
  fraction: number;
}

const DEFAULT_PREFS: A11yPrefs = {
  fontScale: "normal",
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
};
const DEFAULT_RAIL: RailPosition = { rail: "bottom", fraction: 1 };

const STORAGE_KEY = "a11yPrefs";
const EDGE_MARGIN = 12;
const DRAG_THRESHOLD = 4;
const PANEL_WIDTH = 280;
const PANEL_GAP = 12;
// Rough height of the panel's contents (title + 4 options + reset row +
// link). Used only to decide whether it fits above the button — if not, it
// opens below instead. Doesn't need to be exact: the panel also has its own
// max-height/overflow safety net for when this estimate runs short.
const PANEL_HEIGHT_ESTIMATE = 320;
// The custom scrollbar sits at the page's inline-end edge (left in RTL,
// right in LTR). Keep that side's rail clear of it with a wider margin.
const SCROLLBAR_CLEARANCE = 28;

const FONT_CLASSES: Record<FontScale, string | null> = {
  normal: null,
  large: "a11y-font-lg",
  xlarge: "a11y-font-xl",
};

function applyPrefs(prefs: A11yPrefs) {
  const root = document.documentElement;
  root.classList.remove("a11y-font-lg", "a11y-font-xl");
  const fontClass = FONT_CLASSES[prefs.fontScale];
  if (fontClass) root.classList.add(fontClass);
  root.classList.toggle("a11y-contrast", prefs.highContrast);
  root.classList.toggle("a11y-reduce-motion", prefs.reduceMotion);
  root.classList.toggle("a11y-underline-links", prefs.underlineLinks);
}

function railToPixel(rail: RailPosition, bounds: Bounds): Position {
  const { minX, maxX, minY, maxY } = bounds;
  if (rail.rail === "bottom") {
    return { x: minX + rail.fraction * (maxX - minX), y: maxY };
  }
  const y = maxY - rail.fraction * (maxY - minY);
  return { x: rail.rail === "left" ? minX : maxX, y };
}

// Given a free (unclamped) candidate point, snap it to whichever of the
// three rail segments (bottom edge, or straight up the left/right edge from
// there) is closest, expressed as a direction-independent fraction.
function pixelToRail(x: number, y: number, bounds: Bounds): RailPosition {
  const { minX, maxX, minY, maxY } = bounds;
  const bottomX = Math.min(Math.max(x, minX), maxX);
  const sideY = Math.min(Math.max(y, minY), maxY);

  const options: { rail: RailPosition; point: Position }[] = [
    {
      rail: { rail: "bottom", fraction: maxX > minX ? (bottomX - minX) / (maxX - minX) : 0 },
      point: { x: bottomX, y: maxY },
    },
    {
      rail: { rail: "left", fraction: maxY > minY ? (maxY - sideY) / (maxY - minY) : 0 },
      point: { x: minX, y: sideY },
    },
    {
      rail: { rail: "right", fraction: maxY > minY ? (maxY - sideY) / (maxY - minY) : 0 },
      point: { x: maxX, y: sideY },
    },
  ];

  const dist = (p: Position) => Math.hypot(x - p.x, y - p.y);
  return options.reduce((closest, opt) => (dist(opt.point) < dist(closest.point) ? opt : closest)).rail;
}

export default function AccessibilityWidget() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_PREFS);
  const [rail, setRail] = useState<RailPosition | null>(null);
  const [, forceRecompute] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(
    null
  );

  function getBounds(): Bounds {
    const el = buttonRef.current;
    const width = el?.offsetWidth ?? 48;
    const height = el?.offsetHeight ?? 48;
    const navHeight = document.querySelector<HTMLElement>(".nav-bar")?.offsetHeight ?? 0;
    const isRtl = document.documentElement.dir === "rtl";
    const minX = isRtl ? SCROLLBAR_CLEARANCE : EDGE_MARGIN;
    const rightMargin = isRtl ? EDGE_MARGIN : SCROLLBAR_CLEARANCE;
    return {
      minX,
      maxX: Math.max(minX, window.innerWidth - width - rightMargin),
      maxY: Math.max(EDGE_MARGIN, window.innerHeight - height - EDGE_MARGIN),
      minY: navHeight + EDGE_MARGIN,
      rightMargin,
    };
  }

  // Recomputed on every render from `rail` + the current bounds, so it's
  // automatically correct after a resize or a direction change — no stale
  // pixel values left over from a different layout.
  const position = rail ? railToPixel(rail, getBounds()) : null;

  useEffect(() => {
    const storedPrefs = localStorage.getItem(STORAGE_KEY);
    if (storedPrefs) {
      try {
        const parsed = { ...DEFAULT_PREFS, ...JSON.parse(storedPrefs) };
        setPrefs(parsed);
        applyPrefs(parsed);
      } catch {
        // ignore malformed stored value
      }
    }

    // Position is never persisted — every page load starts at the default
    // corner, regardless of where it was dragged to before.
    setRail(DEFAULT_RAIL);
  }, []);

  useEffect(() => {
    function handleResize() {
      forceRecompute((n) => n + 1);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    // Switching language flips text direction, which moves the custom
    // scrollbar (and its clearance margin) to the other side. LanguageContext
    // updates `dir` in its own effect on this same `language` change; since
    // this component sits deeper in the tree, its effects run first, so wait
    // a frame to make sure `dir` has actually been applied before re-reading it.
    const raf = requestAnimationFrame(() => forceRecompute((n) => n + 1));
    return () => cancelAnimationFrame(raf);
  }, [language]);

  function update(next: A11yPrefs) {
    setPrefs(next);
    applyPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function cycleFontScale() {
    const order: FontScale[] = ["normal", "large", "xlarge"];
    const next = order[(order.indexOf(prefs.fontScale) + 1) % order.length];
    update({ ...prefs, fontScale: next });
  }

  function toggle(key: "highContrast" | "reduceMotion" | "underlineLinks") {
    update({ ...prefs, [key]: !prefs[key] });
  }

  function reset() {
    update(DEFAULT_PREFS);
  }

  function resetPosition() {
    setRail(DEFAULT_RAIL);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    };
    el.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
    if (!drag.moved) setIsOpen(false);
    drag.moved = true;

    setRail(pixelToRail(drag.originX + dx, drag.originY + dy, getBounds()));
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    const el = buttonRef.current;
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);

    if (!drag?.moved) {
      setIsOpen((prev) => !prev);
    }
    dragRef.current = null;
  }

  function getButtonStyle(): CSSProperties | undefined {
    if (!position) return undefined;
    return { left: position.x, top: position.y, bottom: "auto", insetInlineStart: "auto" };
  }

  function getPanelStyle(): CSSProperties | undefined {
    if (!position) return undefined;
    const { minX, minY, rightMargin } = getBounds();
    const buttonWidth = buttonRef.current?.offsetWidth ?? 48;
    const buttonHeight = buttonRef.current?.offsetHeight ?? 48;
    // Centered over the button horizontally (not just left-aligned with it),
    // so it stays visually attached to the button even when the button sits
    // right at an edge and the wider panel has to shift to stay on-screen.
    const buttonCenterX = position.x + buttonWidth / 2;
    const idealLeft = buttonCenterX - PANEL_WIDTH / 2;
    const maxLeft = Math.max(minX, window.innerWidth - PANEL_WIDTH - rightMargin);
    const left = Math.min(Math.max(idealLeft, minX), maxLeft);

    // Prefer opening above the button; if there isn't roughly enough room
    // between the button and the top of the page (e.g. the button is
    // parked near the nav bar), open below it instead.
    const spaceAbove = position.y - minY;
    const openAbove = spaceAbove >= PANEL_HEIGHT_ESTIMATE;

    return {
      left,
      insetInlineStart: "auto",
      top: openAbove ? "auto" : position.y + buttonHeight + PANEL_GAP,
      bottom: openAbove ? window.innerHeight - position.y + PANEL_GAP : "auto",
    };
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="a11y-toggle"
        style={getButtonStyle()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        aria-label="תפריט נגישות (ניתן לגרירה)"
        aria-expanded={isOpen}
      >
        <AccessibilityIcon size={24} />
      </button>

      {isOpen && (
        <div className="a11y-panel" ref={panelRef} style={getPanelStyle()} role="dialog" aria-label="אפשרויות נגישות">
          <h2 className="a11y-panel-title">נגישות</h2>

          <button type="button" className="a11y-option" onClick={cycleFontScale} aria-pressed={prefs.fontScale !== "normal"}>
            <span>גודל טקסט</span>
            <span>{prefs.fontScale === "normal" ? "רגיל" : prefs.fontScale === "large" ? "גדול" : "גדול מאוד"}</span>
          </button>

          <button
            type="button"
            className="a11y-option"
            onClick={() => toggle("highContrast")}
            aria-pressed={prefs.highContrast}
          >
            ניגודיות גבוהה
          </button>

          <button
            type="button"
            className="a11y-option"
            onClick={() => toggle("reduceMotion")}
            aria-pressed={prefs.reduceMotion}
          >
            עצירת אנימציות
          </button>

          <button
            type="button"
            className="a11y-option"
            onClick={() => toggle("underlineLinks")}
            aria-pressed={prefs.underlineLinks}
          >
            הדגשת קישורים
          </button>

          <div className="a11y-reset-row">
            <button type="button" className="a11y-reset" onClick={reset}>
              איפוס הגדרות
            </button>

            <button type="button" className="a11y-reset" onClick={resetPosition}>
              איפוס מיקום
            </button>
          </div>

          <Link href="/accessibility" className="a11y-statement-link" onClick={() => setIsOpen(false)}>
            הצהרת נגישות
          </Link>
        </div>
      )}
    </>
  );
}
