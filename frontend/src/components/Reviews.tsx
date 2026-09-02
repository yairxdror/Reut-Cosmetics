"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAdmin } from "@/context/AdminContext";
import {
  deleteReview,
  fetchReviews,
  submitReview,
  updateReview,
  EditNotAllowedError,
  RateLimitError,
  UnauthorizedError,
  type Review,
} from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/adminAuth";
import { saveEditToken, getEditToken } from "@/lib/reviewEditTokens";
import { containsProfanity } from "@/lib/profanityFilter";
import { PencilIcon, QuoteIcon, StarIcon } from "@/components/icons";
import Editable from "@/components/Editable";
import TieredTitle from "@/components/TieredTitle";

const MIN_TEXT_LENGTH = 3;
const MAX_TEXT_LENGTH = 500;
const VISIBLE_REVIEW_ROWS_LIMIT = 6;
const EDIT_WINDOW_MS = 15 * 60 * 1000;

function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="review-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} size={size} className={star <= value ? "star-filled" : "star-empty"} />
      ))}
    </div>
  );
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="review-stars-input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="review-star-btn"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          <StarIcon size={26} className={star <= (hovered || value) ? "star-filled" : "star-empty"} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { t, language } = useLanguage();
  const { isAdmin } = useAdmin();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [website, setWebsite] = useState("");
  const [publicationConsent, setPublicationConsent] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    rating?: string;
    text?: string;
    publicationConsent?: string;
    form?: string;
  }>({});
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [moderationError, setModerationError] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);

  const editableReviewIds = useMemo(() => {
    const ids = new Set<number>();
    for (const review of reviews) {
      if (!getEditToken(review.id)) continue;
      if (now - new Date(review.createdAt).getTime() < EDIT_WINDOW_MS) {
        ids.add(review.id);
      }
    }
    return ids;
  }, [reviews, now]);

  useEffect(() => {
    let cancelled = false;
    fetchReviews()
      .then((data) => {
        if (!cancelled) {
          setReviews(data);
          setLoadState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    function updateClipHeight() {
      if (!grid) return;
      if (reviews.length <= VISIBLE_REVIEW_ROWS_LIMIT) {
        grid.style.maxHeight = "";
        return;
      }
      const sixthCard = grid.children[VISIBLE_REVIEW_ROWS_LIMIT - 1] as HTMLElement | undefined;
      if (!sixthCard) return;
      const gridTop = grid.getBoundingClientRect().top;
      const cardBottom = sixthCard.getBoundingClientRect().bottom;
      grid.style.maxHeight = `${Math.ceil(cardBottom - gridTop) + 12}px`;
    }

    updateClipHeight();
    window.addEventListener("resize", updateClipHeight);
    return () => window.removeEventListener("resize", updateClipHeight);
  }, [reviews]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const scrollContainer = document.querySelector<HTMLElement>(".page-scroll");
    if (scrollContainer) scrollContainer.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (scrollContainer) scrollContainer.style.overflow = "";
    };
  }, [isModalOpen]);

  const isFormComplete =
    name.trim().length > 0 &&
    rating >= 1 &&
    text.trim().length >= MIN_TEXT_LENGTH &&
    (Boolean(editingReview) || publicationConsent);

  function resetForm() {
    setName("");
    setRating(0);
    setText("");
    setWebsite("");
    setPublicationConsent(false);
    setErrors({});
    setStatus("idle");
  }

  function openCreateModal() {
    resetForm();
    setEditingReview(null);
    setIsModalOpen(true);
  }

  function openEditModal(review: Review) {
    setName(review.name);
    setRating(review.rating);
    setText(review.text);
    setPublicationConsent(false);
    setErrors({});
    setStatus("idle");
    setEditingReview(review);
    setIsModalOpen(true);
  }

  async function handleAdminDelete(review: Review) {
    if (!window.confirm(t("reviewDeleteConfirm"))) return;
    const token = getAdminToken();
    if (!token) {
      clearAdminToken();
      return;
    }

    setModerationError("");
    try {
      await deleteReview(token, review.id);
      setReviews((prev) => prev.filter((item) => item.id !== review.id));
    } catch (error) {
      if (error instanceof UnauthorizedError) clearAdminToken();
      setModerationError(t("reviewDeleteError"));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    const trimmedName = name.trim();
    const trimmedText = text.trim();

    if (!trimmedName) nextErrors.name = t("reviewNameRequired");
    else if (containsProfanity(trimmedName)) nextErrors.name = t("reviewProfanityError");

    if (rating < 1) nextErrors.rating = t("reviewRatingRequired");

    if (!trimmedText) nextErrors.text = t("reviewTextRequired");
    else if (trimmedText.length < MIN_TEXT_LENGTH) nextErrors.text = t("reviewTextTooShort");
    else if (trimmedText.length > MAX_TEXT_LENGTH) nextErrors.text = t("reviewTextTooLong");
    else if (containsProfanity(trimmedText)) nextErrors.text = t("reviewProfanityError");

    if (!editingReview && !publicationConsent) {
      nextErrors.publicationConsent = t("reviewConsentRequired");
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      if (editingReview) {
        const editToken = getEditToken(editingReview.id);
        if (!editToken) throw new EditNotAllowedError("Missing edit token");
        const updated = await updateReview(editingReview.id, editToken, {
          name: trimmedName,
          rating,
          text: trimmedText,
        });
        setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await submitReview({
          name: trimmedName,
          rating,
          text: trimmedText,
          website,
          publicationConsent,
        });
        saveEditToken(created.id, created.editToken);
        const publicReview: Review = {
          id: created.id,
          name: created.name,
          rating: created.rating,
          text: created.text,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        };
        setReviews((prev) => [publicReview, ...prev]);
      }
      setIsModalOpen(false);
      setEditingReview(null);
      resetForm();
    } catch (err) {
      setStatus("idle");
      const message =
        err instanceof RateLimitError
          ? t("reviewRateLimited")
          : err instanceof EditNotAllowedError
            ? t("reviewEditExpired")
            : t("reviewGenericError");
      setErrors({ form: message });
    }
  }

  return (
    <section className="reviews-section">
      <div className="reviews-header-row">
        <TieredTitle contentKey="reviewsTitle" className="reviews-title" />
        <button type="button" className="btn btn-black" onClick={openCreateModal}>
          <Editable contentKey="addReviewButton">{t("addReviewButton")}</Editable>
        </button>
      </div>

      {loadState === "loading" && <p className="reviews-status">…</p>}
      {loadState === "error" && <p className="reviews-status">{t("reviewsLoadError")}</p>}
      {moderationError && <p className="form-error reviews-status">{moderationError}</p>}
      {loadState === "loaded" && reviews.length === 0 && <p className="reviews-status">{t("reviewsEmpty")}</p>}

      {loadState === "loaded" && reviews.length > 0 && (
        <div
          ref={gridRef}
          className={`reviews-grid ${reviews.length > VISIBLE_REVIEW_ROWS_LIMIT ? "reviews-grid-scroll" : ""}`}
        >
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <QuoteIcon size={26} className="review-quote-icon" />
              <StarRating value={review.rating} />
              <p className="review-text">{review.text}</p>
              <div className="review-meta">
                <span className="review-name">{review.name}</span>
                <span className="review-meta-right">
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString(language === "he" ? "he-IL" : "en-US")}
                    {review.updatedAt && ` · ${t("reviewEditedLabel")}`}
                  </span>
                  {editableReviewIds.has(review.id) && (
                    <button
                      type="button"
                      className="review-edit-btn"
                      onClick={() => openEditModal(review)}
                      aria-label="Edit review"
                    >
                      <PencilIcon size={14} />
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      className="review-edit-btn review-delete-btn"
                      onClick={() => handleAdminDelete(review)}
                      aria-label={t("reviewDeleteButton")}
                    >
                      ✕
                    </button>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="review-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="review-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={editingReview ? t("reviewEditFormTitle") : t("reviewFormTitle")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-header">
              <h2 className="text-gold" style={{ margin: 0 }}>
                {editingReview ? t("reviewEditFormTitle") : t("reviewFormTitle")}
              </h2>
              <button className="btn-glass-thin" onClick={() => setIsModalOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <p className="review-required-note">
              <span className="form-required">*</span> {t("requiredFieldsNote")}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="website"
                className="form-honeypot"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="form-field">
                <label className="form-label" htmlFor="review-name">
                  {t("reviewNameLabel")} <span className="form-required">*</span>
                </label>
                <input
                  id="review-name"
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-field">
                <span className="form-label">
                  {t("reviewRatingLabel")} <span className="form-required">*</span>
                </span>
                <StarRatingInput value={rating} onChange={setRating} />
                {errors.rating && <span className="form-error">{errors.rating}</span>}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="review-text">
                  {t("reviewTextLabel")} <span className="form-required">*</span>
                </label>
                <textarea
                  id="review-text"
                  className="form-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("reviewTextPlaceholder")}
                  maxLength={MAX_TEXT_LENGTH}
                  rows={4}
                />
                {errors.text && <span className="form-error">{errors.text}</span>}
              </div>

              {!editingReview && (
                <div className="privacy-notice review-privacy-notice">
                  <p>
                    <Editable contentKey="reviewPrivacyNoticeText">{t("reviewPrivacyNoticeText")}</Editable>
                  </p>
                  <Link href="/privacy-policy" onClick={() => setIsModalOpen(false)}>
                    {t("privacyPolicyLinkLabel")}
                  </Link>
                  <label className="form-checkbox-row">
                    <input
                      type="checkbox"
                      checked={publicationConsent}
                      onChange={(event) => setPublicationConsent(event.target.checked)}
                    />
                    <span>
                      <Editable contentKey="reviewPublishConsentText">{t("reviewPublishConsentText")}</Editable>{" "}
                      <span className="form-required">*</span>
                    </span>
                  </label>
                  {errors.publicationConsent && (
                    <span className="form-error">{errors.publicationConsent}</span>
                  )}
                </div>
              )}

              <div className="form-submit-row">
                <button className="btn btn-black" type="submit" disabled={!isFormComplete || status === "submitting"}>
                  {editingReview
                    ? status === "submitting"
                      ? t("reviewUpdating")
                      : <Editable contentKey="reviewUpdate">{t("reviewUpdate")}</Editable>
                    : status === "submitting"
                      ? t("reviewSubmitting")
                      : <Editable contentKey="reviewSubmit">{t("reviewSubmit")}</Editable>}
                </button>
                {errors.form && <span className="form-error">{errors.form}</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
