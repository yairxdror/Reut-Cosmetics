"use client";

import { useState, type FormEvent } from "react";
import { submitHealthDeclaration } from "@/lib/api";
import { isValidIsraeliId, isValidIsraeliPhone } from "@/lib/israeliValidation";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import type { EditableTextKey } from "@/lib/editableContent";

type YesNo = "yes" | "no";

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

interface FormState {
  fullName: string;
  idNumber: string;
  phone: string;
  answers: Record<string, YesNo | undefined>;
  details: Record<string, string>;
  healthDeclarationConfirmed: boolean;
  agreementAccepted: boolean;
}

const initialState: FormState = {
  fullName: "",
  idNumber: "",
  phone: "",
  answers: {},
  details: {},
  healthDeclarationConfirmed: false,
  agreementAccepted: false,
};

export default function HealthDeclarationForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const isFormComplete =
    form.fullName.trim().length > 0 &&
    isValidIsraeliId(form.idNumber) &&
    isValidIsraeliPhone(form.phone) &&
    QUESTIONS.every((question) => Boolean(form.answers[question.id])) &&
    form.healthDeclarationConfirmed &&
    form.agreementAccepted;

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
    if (!form.fullName.trim()) next.fullName = "יש למלא שם מלא";
    if (!form.idNumber.trim()) next.idNumber = "יש למלא מספר תעודת זהות";
    else if (!isValidIsraeliId(form.idNumber)) next.idNumber = "מספר תעודת הזהות אינו תקין";
    if (!form.phone.trim()) next.phone = "יש למלא מספר טלפון";
    else if (!isValidIsraeliPhone(form.phone)) next.phone = "מספר הטלפון אינו תקין";
    for (const q of QUESTIONS) {
      if (!form.answers[q.id]) next[q.id] = "יש לבחור תשובה";
    }
    if (!form.healthDeclarationConfirmed) {
      next.healthDeclarationConfirmation = "יש לאשר את ההסכם כדי להמשיך";
    }
    if (!form.agreementAccepted) next.agreement = "יש לאשר את ההסכם כדי להמשיך";
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
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
      });
      setStatus("success");
      setForm(initialState);
      setErrors({});
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
      </div>
    );
  }

  return (
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
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
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
            value={form.idNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, idNumber: e.target.value }))}
          />
          {errors.idNumber && <span className="form-error">{errors.idNumber}</span>}
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
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="hdQuestionnaireTitle">{t("hdQuestionnaireTitle")}</Editable>
        </h2>

        {QUESTIONS.map((q) => (
          <div className="form-question" key={q.id}>
            <p className="form-question-text">
              <Editable contentKey={q.textKey}>{t(q.textKey)}</Editable> <span className="form-required">*</span>
            </p>
            <div className="form-radio-group">
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
            {errors[q.id] && <span className="form-error">{errors[q.id]}</span>}

            {form.answers[q.id] === "yes" && (
              <div className="form-detail-field">
                <label className="form-label" htmlFor={`detail-${q.id}`}>
                  <Editable contentKey="hdDetailLabel">{t("hdDetailLabel")}</Editable>
                </label>
                <input
                  id={`detail-${q.id}`}
                  className="form-input"
                  type="text"
                  value={form.details[q.id] || ""}
                  onChange={(e) => setDetail(q.id, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}

        <label className="form-checkbox-row">
          <input
            type="checkbox"
            checked={form.healthDeclarationConfirmed}
            onChange={(e) => setForm((prev) => ({ ...prev, healthDeclarationConfirmed: e.target.checked }))}
          />
          <span>
            <Editable contentKey="hdConfirmationText">{t("hdConfirmationText")}</Editable>{" "}
            <span className="form-required">*</span>
          </span>
        </label>
        {errors.healthDeclarationConfirmation && (
          <span className="form-error">{errors.healthDeclarationConfirmation}</span>
        )}
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
            checked={form.agreementAccepted}
            onChange={(e) => setForm((prev) => ({ ...prev, agreementAccepted: e.target.checked }))}
          />
          <span>
            <Editable contentKey="hdAgreementCheckboxText">{t("hdAgreementCheckboxText")}</Editable>{" "}
            <span className="form-required">*</span>
          </span>
        </label>
        {errors.agreement && <span className="form-error">{errors.agreement}</span>}
      </section>

      <div className="form-submit-row">
        <button className="btn btn-blue" type="submit" disabled={!isFormComplete || status === "submitting"}>
          {status === "submitting" ? "שולח..." : <Editable contentKey="hdSubmit">{t("hdSubmit")}</Editable>}
        </button>
        {status === "error" && (
          <span className="form-error">אירעה שגיאה בשליחת הטופס. נסי שוב או צרי קשר טלפוני.</span>
        )}
      </div>
    </form>
  );
}
