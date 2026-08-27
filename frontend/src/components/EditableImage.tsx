"use client";

import { useState, type ChangeEvent, type CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { useLanguage } from "@/context/LanguageContext";
import { getAdminToken, clearAdminToken } from "@/lib/adminAuth";
import { uploadContentImage, UnauthorizedError } from "@/lib/api";
import type { EditableImageKey } from "@/lib/editableContent";
import { ImageIcon } from "@/components/icons";
import EditPopover from "@/components/EditPopover";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// Renders in place of a plain <Image>, inside whatever position:relative
// wrapper the call site already uses for its `fill` image — it does not
// add its own wrapper, so it drops into the existing hero/service/course
// card markup unchanged. Call sites that don't already have such a wrapper
// (the logo) need one added where this is used.
export default function EditableImage({
  imageKey,
  fallbackSrc,
  alt,
  sizes,
  className,
  style,
  priority,
}: {
  imageKey: EditableImageKey;
  fallbackSrc: StaticImageData | string;
  alt: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  const { isAdmin, isEditMode } = useAdmin();
  const { t, getImageUrl, applyImageOverride } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");

  const overrideUrl = getImageUrl(imageKey);
  const src = overrideUrl ?? fallbackSrc;

  function openEditor() {
    setPreview(null);
    setPendingFile(null);
    setError("");
    setStatus("idle");
    setIsOpen(true);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t("editImageInvalidType"));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(t("editImageTooLarge"));
      return;
    }

    setError("");
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!pendingFile) return;
    const token = getAdminToken();
    if (!token) {
      setError(t("editSessionExpired"));
      return;
    }

    setStatus("submitting");
    try {
      const { url } = await uploadContentImage(token, imageKey, pendingFile);
      applyImageOverride(imageKey, url);
      setIsOpen(false);
    } catch (err) {
      setStatus("idle");
      if (err instanceof UnauthorizedError) {
        clearAdminToken();
        setError(t("editSessionExpired"));
      } else {
        setError(err instanceof Error ? err.message : t("editGenericError"));
      }
    }
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        style={style}
        unoptimized={Boolean(overrideUrl)}
        priority={priority}
      />

      {isAdmin && isEditMode && (
        // <span role="button">, not a real <button> — the logo call site
        // sits inside the nav bar's own <button>, and nesting interactive
        // elements is both invalid HTML and a click-handling conflict.
        <span
          className="editable-image-affordance"
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            openEditor();
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            event.stopPropagation();
            openEditor();
          }}
          aria-label={t("editImageTitle")}
        >
          <ImageIcon size={16} />
        </span>
      )}

      {isOpen && (
        <EditPopover title={t("editImageTitle")} onClose={() => setIsOpen(false)}>
          <div className="form-field">
            <label className="form-label" htmlFor={`${imageKey}-file`}>
              {t("editImageUploadLabel")}
            </label>
            {preview && (
              <div className="editable-image-preview">
                {/* eslint-disable-next-line @next/next/no-img-element -- transient local blob: URL, not an optimizable source */}
                <img src={preview} alt="" />
              </div>
            )}
            <input
              id={`${imageKey}-file`}
              className="form-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
            {error && <span className="form-error">{error}</span>}
          </div>
          <div className="form-submit-row">
            <button
              className="btn btn-black"
              type="button"
              onClick={handleSave}
              disabled={!pendingFile || status === "submitting"}
            >
              {status === "submitting" ? t("editSaving") : t("editSave")}
            </button>
          </div>
        </EditPopover>
      )}
    </>
  );
}
