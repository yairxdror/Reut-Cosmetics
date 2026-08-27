"use client";

import { useEffect, type MouseEvent, type ReactNode } from "react";

export default function EditPopover({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    const scrollContainer = document.querySelector<HTMLElement>(".page-scroll");
    if (scrollContainer) scrollContainer.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (scrollContainer) scrollContainer.style.overflow = "";
    };
  }, [onClose]);

  function stop(event: MouseEvent) {
    event.stopPropagation();
  }

  // This can be mounted inside an ancestor <a>/<button> (e.g. the footer's
  // location link), so every click here — including dismissing via the
  // overlay — must stop propagation, not just the panel's own clicks.
  function handleOverlayClick(event: MouseEvent) {
    event.stopPropagation();
    onClose();
  }

  return (
    <div className="review-modal-overlay" onClick={handleOverlayClick}>
      <div className="review-modal-panel" role="dialog" aria-modal="true" aria-label={title} onClick={stop}>
        <div className="sidebar-header">
          <h2 className="text-gold" style={{ margin: 0 }}>
            {title}
          </h2>
          <button type="button" className="btn-glass-thin" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
