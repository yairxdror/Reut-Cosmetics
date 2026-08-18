"use client";

import { useState, type FormEvent } from "react";
import { submitHealthDeclaration } from "@/lib/api";

type YesNo = "yes" | "no";

interface Question {
  id: string;
  text: string;
}

const QUESTIONS: Question[] = [
  { id: "allergies", text: "האם הינך רגישה לתכשירים קוסמטיים (אלרגיות למשחות/תרופות/חומרים כלשהם)?" },
  { id: "skinConditionAtSite", text: "האם הינך סובלת ממחלת עור/גירוי פצע באזור המיועד לטיפול?" },
  { id: "slowHealing", text: "האם הינך סובלת מריפוי איטי של פצעים/הצטלקותם?" },
  { id: "pregnant", text: "האם הינך בהריון?" },
  { id: "regularMedication", text: "האם הינך נוטלת תרופות באופן קבוע ו/או כדורים לדילול דם?" },
  { id: "underInfluence", text: "האם הינך כעת תחת השפעת אלכוהול/סמים/סמים עם מרשם רופא?" },
  { id: "g6pdDeficiency", text: "האם קיים אצלך חוסר באנזים (G6PD)?" },
  {
    id: "seborrheaPsoriasis",
    text: "האם הינך סובלת ממחלת עור מסוג סבוריאה/אקזמה/פסוריאזיס במקום המיועד לטיפול?",
  },
  { id: "roaccutane", text: "האם הינך נוטלת כדורים מסוג רקוטאן?" },
  { id: "hormoneTherapy", text: "האם הינך לוקחת הורמונים באופן קבוע או בזמן טיפול פוריות IVF?" },
];

const AGREEMENT_PARAGRAPHS: string[] = [
  'ידוע לי כי חובת המטפלת להראות לי את הצורה המתאימה לי בהתאם לתווי הפנים שלי על ידי שימוש בשבלונה/סרגל או כל כלי עזר שברשותה. רק לאחר שראיתי והסכמתי, המטפלת תחל בעבודתה. כמו כן מובן לי שלא יהיה ניתן לעשות כל שינוי בצורה לאחר תחילת העבודה.',
  'ידוע לי כי הצבע המתקבל תלוי בפיגמנט העור שלי ולכן זה שונה מאדם לאדם. לפיכך ידועה לי העובדה כי במקרים מסוימים הצבע עלול להידחות על ידי העור שלי ואתבקש להגיע לטיפול נוסף בתשלום (להלן: "טיפול שלישי").',
  'ידוע לי כי בעבור התמורה הכספית (להלן: "שכר טרחה") אקבל שני טיפולים בלבד. כל טיפול מעבר לכך יהיה בתשלום.',
  "ידוע לי כי אין אחריות על קליטת הפיגמנט בעור והליך המיקרובליידינג הינו אינדיבידואלי ומשתנה מאדם לאדם (סוגי העור שונים וכיוצא בזה).",
  "ידוע לי כי לא תתאפשר החזרת כספים לאחר תחילת הטיפול הראשון, גם אם בוצע רק חלקית.",
  "אני מבינה את חשיבות מסירת כל המידע הנוגע לי לפני תחילת העבודה וברור לי שהסתרת כל מידע רלוונטי הנוגע אלי עלול לפגוע בתוצאה הסופית ואף לסכן את בריאותי.",
  'אני מבינה את חשיבות "דף ההוראות לטיפול בעור לאחר איפור קבוע" שאקבל בסיום הטיפול ואי התייחסותי אליו ואי ביצוע ההוראות שרשומות עלול לפגוע בתהליך הכולל של האיפור הקבוע.',
  "ידוע לי כי עליי להגיע לטיפול השני במועד שייקבע לי, וכי אי הגעה לטיפול בטווח של עד חודשיים עלולה לפגוע בתוצאה הסופית הרצויה, כאשר האחריות לכך לא תחול על המטפלת.",
  "כמו כן ידוע לי כי המטפלת לא תהיה חייבת לקבל אותי לטיפול מעבר למועד המיועד והנכון לכך.",
  "על הלקוחה לשלם מראש את מלוא המחיר עבור שני הטיפולים.",
];

interface FormState {
  fullName: string;
  idNumber: string;
  phone: string;
  answers: Record<string, YesNo | undefined>;
  details: Record<string, string>;
  agreementAccepted: boolean;
}

const initialState: FormState = {
  fullName: "",
  idNumber: "",
  phone: "",
  answers: {},
  details: {},
  agreementAccepted: false,
};

export default function HealthDeclarationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
    if (!form.phone.trim()) next.phone = "יש למלא מספר טלפון";
    for (const q of QUESTIONS) {
      if (!form.answers[q.id]) next[q.id] = "יש לבחור תשובה";
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
        <h3 className="text-gold">הטופס נשלח בהצלחה</h3>
        <p>תודה שמילאת את הצהרת הבריאות. הפרטים התקבלו אצלנו.</p>
      </div>
    );
  }

  return (
    <form className="health-form" onSubmit={handleSubmit} noValidate>
      <section className="form-section">
        <h2 className="form-section-title text-gold">פרטים אישיים</h2>

        <div className="form-field">
          <label className="form-label" htmlFor="fullName">
            שם מלא <span className="form-required">*</span>
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
            מספר תעודת זהות <span className="form-required">*</span>
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
            מספר טלפון <span className="form-required">*</span>
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
        <h2 className="form-section-title text-gold">שאלון בריאות</h2>

        {QUESTIONS.map((q) => (
          <div className="form-question" key={q.id}>
            <p className="form-question-text">
              {q.text} <span className="form-required">*</span>
            </p>
            <div className="form-radio-group">
              <button
                type="button"
                className={`form-radio-pill form-radio-no ${form.answers[q.id] === "no" ? "selected" : ""}`}
                onClick={() => setAnswer(q.id, "no")}
                aria-pressed={form.answers[q.id] === "no"}
              >
                לא
              </button>
              <button
                type="button"
                className={`form-radio-pill form-radio-yes ${form.answers[q.id] === "yes" ? "selected" : ""}`}
                onClick={() => setAnswer(q.id, "yes")}
                aria-pressed={form.answers[q.id] === "yes"}
              >
                כן
              </button>
            </div>
            {errors[q.id] && <span className="form-error">{errors[q.id]}</span>}

            {form.answers[q.id] === "yes" && (
              <div className="form-detail-field">
                <label className="form-label" htmlFor={`detail-${q.id}`}>
                  אנא פרטי
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
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">הסכם</h2>
        <p className="form-agreement-intro">ידוע לי כי:</p>
        <ol className="form-agreement-box">
          {AGREEMENT_PARAGRAPHS.map((paragraph, index) => (
            <li key={index}>{paragraph}</li>
          ))}
        </ol>

        <label className="form-checkbox-row">
          <input
            type="checkbox"
            checked={form.agreementAccepted}
            onChange={(e) => setForm((prev) => ({ ...prev, agreementAccepted: e.target.checked }))}
          />
          <span>
            אני מאשרת שקראתי ומסכימה להסכם זה <span className="form-required">*</span>
          </span>
        </label>
        {errors.agreement && <span className="form-error">{errors.agreement}</span>}
      </section>

      <div className="form-submit-row">
        <button className="btn btn-blue" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "שולח..." : "שליחת הטופס"}
        </button>
        {status === "error" && (
          <span className="form-error">אירעה שגיאה בשליחת הטופס. נסי שוב או צרי קשר טלפוני.</span>
        )}
      </div>
    </form>
  );
}
