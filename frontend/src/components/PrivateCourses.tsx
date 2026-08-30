"use client";

import eyebrowShaping from "@/assets/Eyebrow-shaping.png";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import EditableImage from "@/components/EditableImage";

const PRIVATE_COURSES = [
  {
    titleKey: "pcCourse1Title" as const,
    descKey: "pcCourse1Desc" as const,
    imageKey: "pcCourse1Image" as const,
    methodsLabelKey: "pcCourse1MethodsLabel" as const,
    methodKeys: ["pcCourse1Method1", "pcCourse1Method2", "pcCourse1Method3"] as const,
  },
  { titleKey: "pcCourse2Title" as const, descKey: "pcCourse2Desc" as const, imageKey: "pcCourse2Image" as const },
];

export default function PrivateCourses() {
  const { t } = useLanguage();

  return (
    <section className="private-courses-section">
      <p className="private-courses-intro">
        <Editable contentKey="privateCoursesIntro">{t("privateCoursesIntro")}</Editable>
      </p>
      <div className="pc-list">
        {PRIVATE_COURSES.map(({ titleKey, descKey, imageKey, methodsLabelKey, methodKeys }, index) => (
          <div
            className={`pc-card ${index % 2 === 1 ? "pc-card-flip" : ""}`}
            key={titleKey}
          >
            <div className="pc-card-image">
              <EditableImage
                imageKey={imageKey}
                fallbackSrc={eyebrowShaping}
                alt={t(titleKey)}
                sizes="(max-width: 700px) 235px, 370px"
                className="pc-card-photo"
              />
            </div>
            <div className="pc-card-content">
              <h3 className="pc-card-title">
                <Editable contentKey={titleKey}>{t(titleKey)}</Editable>
              </h3>
              <p className="pc-card-desc">
                <Editable contentKey={descKey}>{t(descKey)}</Editable>
              </p>
              {methodKeys && (
                <>
                  <p className="pc-card-methods-label">
                    <Editable contentKey={methodsLabelKey!}>{t(methodsLabelKey!)}</Editable>
                  </p>
                  <ol className="pc-card-methods">
                    {methodKeys.map((methodKey) => (
                      <li key={methodKey}>
                        <Editable contentKey={methodKey}>{t(methodKey)}</Editable>
                      </li>
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
