"use client";

import { useLanguage, type TranslationKey } from "@/context/LanguageContext";

const FAQS: { questionKey: TranslationKey; answerKey: TranslationKey }[] = [
  { questionKey: "faq1Question", answerKey: "faq1Answer" },
  { questionKey: "faq2Question", answerKey: "faq2Answer" },
  { questionKey: "faq3Question", answerKey: "faq3Answer" },
  { questionKey: "faq4Question", answerKey: "faq4Answer" },
  { questionKey: "faq5Question", answerKey: "faq5Answer" },
  { questionKey: "faq6Question", answerKey: "faq6Answer" },
  { questionKey: "faq7Question", answerKey: "faq7Answer" },
  { questionKey: "faq8Question", answerKey: "faq8Answer" },
  { questionKey: "faq9Question", answerKey: "faq9Answer" },
  { questionKey: "faq10Question", answerKey: "faq10Answer" },
];

export default function Faq() {
  const { t } = useLanguage();

  return (
    <section>
      <h1 className="faq-title text-gold">{t("faq")}</h1>
      <div className="faq-list">
        {FAQS.map(({ questionKey, answerKey }) => (
          <details className="faq-item" key={questionKey}>
            <summary className="faq-question">
              {t(questionKey)}
              <span className="faq-question-icon" aria-hidden="true" />
            </summary>
            <p className="faq-answer">{t(answerKey)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
