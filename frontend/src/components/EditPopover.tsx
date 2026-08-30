"use client";

import { useEffect, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Popovers can nest — editing text inside an already-open detail modal
// opens a second instance while the first is still mounted. All instances
// listen on the same document, so without this stack an Escape press
// would close every open popover at once instead of just the topmost,
// and the inner one unmounting would release the shared scroll-lock out
// from under the outer one that's still open.
const openStack: Array<() => void> = [];

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
    openStack.push(onClose);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && openStack[openStack.length - 1] === onClose) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    const scrollContainer = document.querySelector<HTMLElement>(".page-scroll");
    if (scrollContainer) scrollContainer.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const index = openStack.lastIndexOf(onClose);
      if (index !== -1) openStack.splice(index, 1);
      if (openStack.length === 0 && scrollContainer) scrollContainer.style.overflow = "";
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

  // Portaled straight to <body> rather than rendered in place. Editable/
  // EditableImage can end up nested under all sorts of ancestors (card
  // hover-lift transforms, absolutely-positioned buttons, etc.), and a
  // `transform`/`filter`/`will-change` on ANY ancestor re-anchors a
  // position:fixed descendant to that ancestor instead of the viewport —
  // exactly the same class of bug the hero WhatsApp CTA's own portal
  // avoids. Portaling here means this dialog's screen position and
  // stacking never depend on where in the tree it happened to be opened.
  return createPortal(
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
    </div>,
    document.body
  );
}
