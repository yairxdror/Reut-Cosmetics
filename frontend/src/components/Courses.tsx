"use client";

import { useLanguage, type TranslationKey } from "@/context/LanguageContext";
import { ImageIcon } from "@/components/icons";

const COURSES: { titleKey: TranslationKey; descKey?: TranslationKey }[] = [
  { titleKey: "course1Title", descKey: "course1Desc" },
  { titleKey: "course2Title" },
];

export default function Courses() {
  const { t } = useLanguage();

  return (
    <section className="courses-section">
      <h2 className="courses-title text-gold">{t("coursesTitle")}</h2>
      <div className="courses-grid">
        {COURSES.map(({ titleKey, descKey }) => (
          <div className="course-card" key={titleKey}>
            <div className="course-circle">
              <ImageIcon size={32} />
            </div>
            <h3 className="course-card-title">{t(titleKey)}</h3>
            {descKey && <p className="course-card-desc">{t(descKey)}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
