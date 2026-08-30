"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAdmin } from "@/context/AdminContext";
import { getAdminToken, clearAdminToken } from "@/lib/adminAuth";
import { fetchFaqs, createFaq, updateFaq, deleteFaq, UnauthorizedError, type FaqItem } from "@/lib/api";
import Editable from "@/components/Editable";
import EditPopover from "@/components/EditPopover";
import { PencilIcon } from "@/components/icons";

export default function Faq() {
  const { t, language } = useLanguage();
  // Add/edit/delete here are their own explicit, dedicated controls (a
  // toolbar button, per-item icons) rather than the generic hover-to-reveal
  // Editable/EditableImage affordance, so — unlike everywhere else — they
  // don't require edit mode to be toggled on too; being logged in as admin
  // is enough to see them on this page.
  const { isAdmin } = useAdmin();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [heQuestion, setHeQuestion] = useState("");
  const [enQuestion, setEnQuestion] = useState("");
  const [heAnswer, setHeAnswer] = useState("");
  const [enAnswer, setEnAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFaqs()
      .then((items) => {
        setFaqs(items);
        setLoadState("loaded");
      })
      .catch(() => setLoadState("error"));
  }, []);

  function resetForm() {
    setHeQuestion("");
    setEnQuestion("");
    setHeAnswer("");
    setEnAnswer("");
    setError("");
    setStatus("idle");
  }

  function openCreateModal() {
    resetForm();
    setEditingFaq(null);
    setIsModalOpen(true);
  }

  function openEditModal(faq: FaqItem) {
    setHeQuestion(faq.heQuestion);
    setEnQuestion(faq.enQuestion);
    setHeAnswer(faq.heAnswer);
    setEnAnswer(faq.enAnswer);
    setError("");
    setStatus("idle");
    setEditingFaq(faq);
    setIsModalOpen(true);
  }

  // preventDefault/stopPropagation: these action buttons live inside a
  // <summary>, whose native click behavior toggles the parent <details>
  // open/closed — without stopping it here, clicking "edit" or "delete"
  // would also flip the disclosure at the same time. Typed structurally so
  // both the click and keydown (Enter/Space) handlers can call these.
  async function handleDelete(faq: FaqItem, event: { preventDefault(): void; stopPropagation(): void }) {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm(t("faqDeleteConfirm"))) return;

    const token = getAdminToken();
    if (!token) return;
    try {
      await deleteFaq(token, faq.id);
      setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
    } catch (err) {
      if (err instanceof UnauthorizedError) clearAdminToken();
    }
  }

  function handleEditClick(faq: FaqItem, event: { preventDefault(): void; stopPropagation(): void }) {
    event.preventDefault();
    event.stopPropagation();
    openEditModal(faq);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedHeQ = heQuestion.trim();
    const trimmedEnQ = enQuestion.trim();
    const trimmedHeA = heAnswer.trim();
    const trimmedEnA = enAnswer.trim();
    if (!trimmedHeQ || !trimmedEnQ || !trimmedHeA || !trimmedEnA) {
      setError(t("faqValidationError"));
      return;
    }

    const token = getAdminToken();
    if (!token) {
      setError(t("editSessionExpired"));
      return;
    }

    const fields = { heQuestion: trimmedHeQ, enQuestion: trimmedEnQ, heAnswer: trimmedHeA, enAnswer: trimmedEnA };

    setStatus("submitting");
    try {
      if (editingFaq) {
        const updated = await updateFaq(token, editingFaq.id, fields);
        setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      } else {
        const created = await createFaq(token, fields);
        setFaqs((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
      setEditingFaq(null);
      resetForm();
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

  const isFormComplete =
    heQuestion.trim().length > 0 &&
    enQuestion.trim().length > 0 &&
    heAnswer.trim().length > 0 &&
    enAnswer.trim().length > 0;

  return (
    <section>
      <h1 className="faq-title text-gold">
        <Editable contentKey="faq">{t("faq")}</Editable>
      </h1>

      {isAdmin && (
        <div className="faq-admin-toolbar">
          <button type="button" className="btn btn-black" onClick={openCreateModal}>
            {t("faqAddButton")}
          </button>
        </div>
      )}

      {loadState === "error" && <p className="admin-status">{t("faqLoadError")}</p>}

      {loadState !== "error" && (
        <div className="faq-list">
          {faqs.map((faqItem) => {
            const question = language === "he" ? faqItem.heQuestion : faqItem.enQuestion;
            const answer = language === "he" ? faqItem.heAnswer : faqItem.enAnswer;
            return (
              <details className="faq-item" key={faqItem.id}>
                <summary className="faq-question">
                  <span className="faq-question-text">{question}</span>
                  {isAdmin && (
                    <span className="faq-admin-actions">
                      <span
                        className="faq-action-btn"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleEditClick(faqItem, e)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handleEditClick(faqItem, e);
                        }}
                        aria-label={t("editFieldTitle")}
                      >
                        <PencilIcon size={14} />
                      </span>
                      <span
                        className="faq-action-btn"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleDelete(faqItem, e)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handleDelete(faqItem, e);
                        }}
                        aria-label={t("faqDeleteButton")}
                      >
                        ✕
                      </span>
                    </span>
                  )}
                  <span className="faq-question-icon" aria-hidden="true" />
                </summary>
                <p className="faq-answer">{answer}</p>
              </details>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <EditPopover title={editingFaq ? t("faqEditTitle") : t("faqAddButton")} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} noValidate>
            <p className="faq-form-section-label">{t("faqQuestionSectionLabel")}</p>
            <div className="form-field">
              <label className="form-label" htmlFor="faq-he-q">
                {t("editTextHebrewLabel")}
              </label>
              <textarea
                id="faq-he-q"
                className="form-textarea"
                value={heQuestion}
                onChange={(e) => setHeQuestion(e.target.value)}
                dir="rtl"
                rows={2}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="faq-en-q">
                {t("editTextEnglishLabel")}
              </label>
              <textarea
                id="faq-en-q"
                className="form-textarea"
                value={enQuestion}
                onChange={(e) => setEnQuestion(e.target.value)}
                dir="ltr"
                rows={2}
              />
            </div>

            <p className="faq-form-section-label">{t("faqAnswerSectionLabel")}</p>
            <div className="form-field">
              <label className="form-label" htmlFor="faq-he-a">
                {t("editTextHebrewLabel")}
              </label>
              <textarea
                id="faq-he-a"
                className="form-textarea"
                value={heAnswer}
                onChange={(e) => setHeAnswer(e.target.value)}
                dir="rtl"
                rows={4}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="faq-en-a">
                {t("editTextEnglishLabel")}
              </label>
              <textarea
                id="faq-en-a"
                className="form-textarea"
                value={enAnswer}
                onChange={(e) => setEnAnswer(e.target.value)}
                dir="ltr"
                rows={4}
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
    </section>
  );
}
