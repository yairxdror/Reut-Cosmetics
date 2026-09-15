"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { submitHealthDeclaration } from "@/lib/api";
import { isValidIsraeliId, isValidIsraeliPhone } from "@/lib/israeliValidation";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import { HomeButton } from "@/components/NavControls";
import type { EditableTextKey } from "@/lib/editableContent";
import {
  EMPTY_HEALTH_DECLARATION,
  useHealthDeclarationDraft,
  type YesNo,
} from "@/context/HealthDeclarationDraftContext";

// Hebrew/English letters, spaces, hyphens and apostrophes (for names like
// "אל-עלי" or "O'Brien") — strips anything else, digits included, as the
// user types rather than only flagging it after the fact.
const NAME_INVALID_CHARS = /[^a-zA-Zא-ת\s'-]/g;

// Digits only — an ID number is never anything else.
const ID_NUMBER_INVALID_CHARS = /\D/g;

// Digits plus the separators isValidIsraeliPhone already tolerates (spaces
// and hyphens, e.g. "050-1234567") — everything else, letters included, is
// stripped as the user types.
const PHONE_INVALID_CHARS = /[^\d\s-]/g;

interface Question {
  id: string;
  textKey: EditableTextKey;
}

export const QUESTIONS: Question[] = [
  { id: "allergies", textKey: "hdQ1" },
  { id: "skinConditionAtSite", textKey: "hdQ2" },
  { id: "slowHealing", textKey: "hdQ3" },
  { id: "pregnant", textKey: "hdQ4" },
  { id: "regularMedication", textKey: "hdQ5" },
  { id: "underInfluence", textKey: "hdQ6" },
  { id: "g6pdDeficiency", textKey: "hdQ7" },
  { id: "seborrheaPsoriasis", textKey: "hdQ8" },
  { id: "roaccutane", textKey: "hdQ9" },
  { id: "hormoneTherapy", textKey: "hdQ10" },
];

const AGREEMENT_PARAGRAPH_KEYS: EditableTextKey[] = [
  "hdAgreement1",
  "hdAgreementRisks",
  "hdAgreement2",
  "hdAgreement3",
  "hdAgreement4",
  "hdAgreement5",
  "hdAgreement6",
  "hdAgreement7",
  "hdAgreement8",
  "hdAgreement9",
  "hdAgreement10",
];

const PRIVACY_NOTICE_KEYS: EditableTextKey[] = [
  "hdPrivacyNotice1",
  "hdPrivacyNotice2",
  "hdPrivacyNotice3",
  "hdPrivacyNotice4",
];

export default function HealthDeclarationForm() {
  const { t } = useLanguage();
  const [form, setForm] = useHealthDeclarationDraft();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Moves the home button out of the top nav bar and into this screen's own
  // content (see the success banner below) while it's showing.
  useEffect(() => {
    document.documentElement.classList.toggle("hd-success", status === "success");
    return () => document.documentElement.classList.remove("hd-success");
  }, [status]);

  function setAnswer(questionId: string, value: YesNo) {
    setForm((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
      details: value === "no" ? { ...prev.details, [questionId]: "" } : prev.details,
    }));
  }

  function setDetail(questionId: string, value: string) {
    setForm((prev) => ({ ...prev, details: { ...prev.details, [questionId]: value } }));
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = t("hdNameRequired");
    else if (form.fullName.trim().length < 2) next.fullName = t("hdNameTooShort");
    if (!form.idNumber.trim()) next.idNumber = t("hdIdNumberRequired");
    else if (!isValidIsraeliId(form.idNumber)) next.idNumber = t("hdIdNumberInvalid");
    if (!form.phone.trim()) next.phone = t("hdPhoneRequired");
    else if (!isValidIsraeliPhone(form.phone)) next.phone = t("hdPhoneInvalid");
    for (const q of QUESTIONS) {
      if (!form.answers[q.id]) next[q.id] = t("hdAnswerRequired");
      if (form.answers[q.id] === "yes" && !form.details[q.id]?.trim()) {
        next[`detail-${q.id}`] = t("hdDetailRequired");
      }
    }
    if (!form.healthDeclarationConfirmed) {
      next.healthDeclarationConfirmation = t("hdConfirmationRequired");
    }
    if (!form.agreementAccepted) next.agreement = t("hdAgreementRequired");
    if (!form.privacyConsentAccepted) next.privacyConsent = t("hdPrivacyConsentRequired");
    return next;
  }

  // Derive errors from the current answers so corrections clear immediately,
  // including a detail field that disappears when an answer changes to "no".
  const errors = hasSubmitted ? validate() : {};

  function errorAttributes(key: string) {
    return {
      "aria-invalid": Boolean(errors[key]),
      "aria-describedby": errors[key] ? `${key}-error` : undefined,
    };
  }

  function renderError(key: string) {
    return errors[key] ? (
      <span id={`${key}-error`} className="form-error" aria-live="polite">
        {errors[key]}
      </span>
    ) : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setHasSubmitted(true);
    if (Object.keys(validationErrors).length > 0) {
      const formElement = event.currentTarget;
      requestAnimationFrame(() => {
        const firstInvalid = formElement.querySelector<HTMLElement>('[aria-invalid="true"]');
        if (!firstInvalid) return;
        firstInvalid.focus({ preventScroll: true });
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          document.documentElement.classList.contains("a11y-reduce-motion");
        firstInvalid.scrollIntoView({ block: "center", behavior: reduceMotion ? "instant" : "smooth" });
      });
      return;
    }

    setStatus("submitting");
    try {
      await submitHealthDeclaration({
        fullName: form.fullName.trim(),
        idNumber: form.idNumber.trim(),
        phone: form.phone.trim(),
        answers: form.answers as Record<string, YesNo>,
        details: form.details,
        healthDeclarationConfirmed: form.healthDeclarationConfirmed,
        agreementAccepted: form.agreementAccepted,
        privacyConsentAccepted: form.privacyConsentAccepted,
      });
      setStatus("success");
      setForm(EMPTY_HEALTH_DECLARATION);
      setHasSubmitted(false);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success-banner">
        <h3 className="text-gold">
          <Editable contentKey="hdSuccessTitle">{t("hdSuccessTitle")}</Editable>
        </h3>
        <p>
          <Editable contentKey="hdSuccessText">{t("hdSuccessText")}</Editable>
        </p>
        <HomeButton />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        {t("healthDeclaration")}
      </h1>
      <p style={{ textAlign: "center" }}>
        <span className="form-required">*</span> {t("hdRequiredNote")}
      </p>
      <form className="health-form" onSubmit={handleSubmit} noValidate>
        <section className="form-section">
          <h2 className="form-section-title text-gold">
            <Editable contentKey="hdPersonalTitle">{t("hdPersonalTitle")}</Editable>
          </h2>

        <div className="form-field">
          <label className="form-label" htmlFor="fullName">
            <Editable contentKey="hdFullNameLabel">{t("hdFullNameLabel")}</Editable>{" "}
            <span className="form-required">*</span>
          </label>
          <input
            id="fullName"
            className="form-input"
            type="text"
            autoComplete="name"
            required
            {...errorAttributes("fullName")}
            value={form.fullName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullName: e.target.value.replace(NAME_INVALID_CHARS, "") }))
            }
          />
          {renderError("fullName")}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="idNumber">
            <Editable contentKey="hdIdNumberLabel">{t("hdIdNumberLabel")}</Editable>{" "}
            <span className="form-required">*</span>
          </label>
          <input
            id="idNumber"
            className="form-input"
            type="text"
            inputMode="numeric"
            maxLength={9}
            required
            {...errorAttributes("idNumber")}
            value={form.idNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, idNumber: e.target.value.replace(ID_NUMBER_INVALID_CHARS, "") }))
            }
          />
          {renderError("idNumber")}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="phone">
            <Editable contentKey="hdPhoneLabel">{t("hdPhoneLabel")}</Editable>{" "}
            <span className="form-required">*</span>
          </label>
          <input
            id="phone"
            className="form-input"
            type="tel"
            autoComplete="tel"
            required
            {...errorAttributes("phone")}
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value.replace(PHONE_INVALID_CHARS, "") }))
            }
          />
          {renderError("phone")}
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="hdQuestionnaireTitle">{t("hdQuestionnaireTitle")}</Editable>
        </h2>

        {QUESTIONS.map((q, index) => (
          <div className="form-question" key={q.id}>
            <p id={`question-${q.id}`} className="form-question-text">
              {index + 1}. <Editable contentKey={q.textKey}>{t(q.textKey)}</Editable>{" "}
              <span className="form-required">*</span>
            </p>
            <div
              className="form-radio-group"
              role="group"
              aria-labelledby={`question-${q.id}`}
              tabIndex={-1}
              {...errorAttributes(q.id)}
            >
              <button
                type="button"
                className={`form-radio-pill form-radio-no ${form.answers[q.id] === "no" ? "selected" : ""}`}
                onClick={() => setAnswer(q.id, "no")}
                aria-pressed={form.answers[q.id] === "no"}
              >
                <Editable contentKey="healthFormNo">{t("healthFormNo")}</Editable>
              </button>
              <button
                type="button"
                className={`form-radio-pill form-radio-yes ${form.answers[q.id] === "yes" ? "selected" : ""}`}
                onClick={() => setAnswer(q.id, "yes")}
                aria-pressed={form.answers[q.id] === "yes"}
              >
                <Editable contentKey="healthFormYes">{t("healthFormYes")}</Editable>
              </button>
            </div>
            {renderError(q.id)}

            {form.answers[q.id] === "yes" && (
              <div className="form-detail-field">
                <label className="form-label" htmlFor={`detail-${q.id}`}>
                  <Editable contentKey="hdDetailLabel">{t("hdDetailLabel")}</Editable>{" "}
                  <span className="form-required">*</span>
                </label>
                <input
                  id={`detail-${q.id}`}
                  className="form-input"
                  type="text"
                  required
                  {...errorAttributes(`detail-${q.id}`)}
                  value={form.details[q.id] || ""}
                  onChange={(e) => setDetail(q.id, e.target.value)}
                />
                {renderError(`detail-${q.id}`)}
              </div>
            )}
          </div>
        ))}

        <label className="form-checkbox-row">
          <input
            type="checkbox"
            required
            {...errorAttributes("healthDeclarationConfirmation")}
            checked={form.healthDeclarationConfirmed}
            onChange={(e) => setForm((prev) => ({ ...prev, healthDeclarationConfirmed: e.target.checked }))}
          />
          <span>
            <Editable contentKey="hdConfirmationText">{t("hdConfirmationText")}</Editable>{" "}
            <span className="form-required">*</span>
          </span>
        </label>
        {renderError("healthDeclarationConfirmation")}
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="hdAgreementTitle">{t("hdAgreementTitle")}</Editable>
        </h2>
        <ol className="form-agreement-box">
          {AGREEMENT_PARAGRAPH_KEYS.map((key) => (
            <li key={key}>
              <Editable contentKey={key}>{t(key)}</Editable>
            </li>
          ))}
        </ol>

        <label className="form-checkbox-row">
          <input
            type="checkbox"
            required
            {...errorAttributes("agreement")}
            checked={form.agreementAccepted}
            onChange={(e) => setForm((prev) => ({ ...prev, agreementAccepted: e.target.checked }))}
          />
          <span>
            <Editable contentKey="hdAgreementCheckboxText">{t("hdAgreementCheckboxText")}</Editable>{" "}
            <span className="form-required">*</span>
          </span>
        </label>
        {renderError("agreement")}
      </section>

      <section className="form-section" aria-labelledby="health-privacy-notice-title">
        <h2 id="health-privacy-notice-title" className="form-section-title text-gold">
          <Editable contentKey="hdPrivacyNoticeTitle">{t("hdPrivacyNoticeTitle")}</Editable>
        </h2>
        <ul className="form-agreement-box">
          {PRIVACY_NOTICE_KEYS.map((key) => (
            <li key={key}>
              <Editable contentKey={key}>{t(key)}</Editable>
            </li>
          ))}
        </ul>
        <Link href="/privacy-policy">{t("privacyPolicyLinkLabel")}</Link>

        <label className="form-checkbox-row">
          <input
            type="checkbox"
            required
            {...errorAttributes("privacyConsent")}
            checked={form.privacyConsentAccepted}
            onChange={(e) => setForm((prev) => ({ ...prev, privacyConsentAccepted: e.target.checked }))}
          />
          <span>
            <Editable contentKey="hdPrivacyConsentText">{t("hdPrivacyConsentText")}</Editable>{" "}
            <span className="form-required">*</span>
          </span>
        </label>
        {renderError("privacyConsent")}
      </section>

      <div className="form-submit-row">
        <button className="btn btn-blue" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? t("hdSubmitting") : <Editable contentKey="hdSubmit">{t("hdSubmit")}</Editable>}
        </button>
        {status === "error" && <span className="form-error">{t("hdSubmitError")}</span>}
      </div>
      </form>
    </>
  );
}
