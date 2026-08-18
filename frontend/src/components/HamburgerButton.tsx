"use client";

export default function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="btn-glass-thin hamburger-btn"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <span className={`hamburger-icon ${isOpen ? "hamburger-icon-open" : ""}`}>
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
