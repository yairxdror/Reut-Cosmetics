"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useLanguage } from "@/context/LanguageContext";
import { getAdminToken, clearAdminToken } from "@/lib/adminAuth";
import { updateContentText, UnauthorizedError } from "@/lib/api";
import type { EditableTextKey } from "@/lib/editableContent";
import { PencilIcon } from "@/components/icons";
import EditPopover from "@/components/EditPopover";

export default function Editable({ contentKey, children }: { contentKey: EditableTextKey; children: ReactNode }) {
  const { isAdmin, isEditMode } = useAdmin();
  const { t, getTextPair, applyTextOverride } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [he, setHe] = useState("");
  const [en, setEn] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");

  // True no-op outside edit mode — zero DOM/CSS difference for the vast
  // majority of page loads that aren't an actively-editing admin.
  if (!isAdmin || !isEditMode) {
    return <>{children}</>;
  }

  function openEditor() {
    const current = getTextPair(contentKey);
    setHe(current.he);
    setEn(current.en);
    setError("");
    setStatus("idle");
    setIsOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedHe = he.trim();
    const trimmedEn = en.trim();
    if (!trimmedHe || !trimmedEn) {
      setError(t("editBothFieldsRequired"));
      return;
    }

    const token = getAdminToken();
    if (!token) {
      setError(t("editSessionExpired"));
      return;
    }

    setStatus("submitting");
    try {
      await updateContentText(token, contentKey, { he: trimmedHe, en: trimmedEn });
      applyTextOverride(contentKey, trimmedHe, trimmedEn);
      setIsOpen(false);
    } catch (err) {
      setStatus("idle");
      if (err instanceof UnauthorizedError) {
        clearAdminToken();
        setError(t("editSessionExpired"));
      } else {
        setError(t("editGenericError"));
      }
    }
  }

  const isFormComplete = he.trim().length > 0 && en.trim().length > 0;

  // A <span role="button"> rather than a real <button> — call sites like
  // the footer's location link wrap this in an <a>, and nesting a real
  // button inside an anchor is both invalid HTML and a click-handling
  // conflict (native interactive content can't nest inside more of the
  // same). stopPropagation keeps a click here from also activating
  // whatever ancestor link/button it happens to be sitting inside.
  function handleTriggerActivate(event: { preventDefault(): void; stopPropagation(): void }) {
    event.preventDefault();
    event.stopPropagation();
    openEditor();
  }

  return (
    <>
      <span
        className="editable-trigger"
        role="button"
        tabIndex={0}
        onClick={handleTriggerActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleTriggerActivate(e);
        }}
        aria-label={t("editFieldTitle")}
      >
        {children}
        <span className="editable-affordance" aria-hidden="true">
          <PencilIcon size={12} />
        </span>
      </span>

      {isOpen && (
        <EditPopover title={t("editFieldTitle")} onClose={() => setIsOpen(false)}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-label" htmlFor={`${contentKey}-he`}>
                {t("editTextHebrewLabel")}
              </label>
              <textarea
                id={`${contentKey}-he`}
                className="form-textarea"
                value={he}
                onChange={(e) => setHe(e.target.value)}
                dir="rtl"
                rows={3}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor={`${contentKey}-en`}>
                {t("editTextEnglishLabel")}
              </label>
              <textarea
                id={`${contentKey}-en`}
                className="form-textarea"
                value={en}
                onChange={(e) => setEn(e.target.value)}
                dir="ltr"
                rows={3}
              />
            </div>
            <div className="form-submit-row">
              <button className="btn btn-black" type="submit" disabled={!isFormComplete || status === "submitting"}>
                {status === "submitting" ? t("editSaving") : t("editSave")}
              </button>
              {error && <span className="form-error">{error}</span>}
            </div>
          </form>
        </EditPopover>
      )}
    </>
  );
}
