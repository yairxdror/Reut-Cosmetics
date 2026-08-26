"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ImageIcon } from "@/components/icons";

const PRIVATE_COURSES = [
  {
    titleKey: "pcCourse1Title" as const,
    descKey: "pcCourse1Desc" as const,
    methodsLabelKey: "pcCourse1MethodsLabel" as const,
    methodKeys: ["pcCourse1Method1", "pcCourse1Method2", "pcCourse1Method3"] as const,
  },
  { titleKey: "pcCourse2Title" as const, descKey: "pcCourse2Desc" as const },
];

export default function PrivateCourses() {
  const { t } = useLanguage();

  return (
    <section className="private-courses-section">
      <p className="private-courses-intro">{t("privateCoursesIntro")}</p>
      <div className="pc-list">
        {PRIVATE_COURSES.map(({ titleKey, descKey, methodsLabelKey, methodKeys }, index) => (
          <div
            className={`pc-card ${index % 2 === 1 ? "pc-card-flip" : ""}`}
            key={titleKey}
          >
            <div className="pc-card-image">
              <ImageIcon size={36} />
              <span>{t("servicesImageLabel")}</span>
            </div>
            <div className="pc-card-content">
              <h3 className="pc-card-title">{t(titleKey)}</h3>
              <p className="pc-card-desc">{t(descKey)}</p>
              {methodKeys && (
                <>
                  <p className="pc-card-methods-label">{t(methodsLabelKey!)}</p>
                  <ol className="pc-card-methods">
                    {methodKeys.map((methodKey) => (
                      <li key={methodKey}>{t(methodKey)}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
