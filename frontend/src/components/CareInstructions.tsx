"use client";

import healingTimeline from "@/assets/healing-timeline.png";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import EditableImage from "@/components/EditableImage";
import type { EditableTextKey } from "@/lib/editableContent";

const RULE_KEYS: EditableTextKey[] = [
  "careRule1",
  "careRule2",
  "careRule3",
  "careRule4",
  "careRule5",
  "careRule6",
  "careRule7",
  "careRule8",
];

export default function CareInstructions() {
  const { t } = useLanguage();

  return (
    <div className="care-instructions">
      <section className="form-section care-intro">
        <p>
          <Editable contentKey="careIntroGreeting">{t("careIntroGreeting")}</Editable>
        </p>
        <p>
          <Editable contentKey="careIntroLine1">{t("careIntroLine1")}</Editable>
        </p>
        <p>
          <Editable contentKey="careIntroLine2">{t("careIntroLine2")}</Editable>
        </p>
      </section>

      <section className="form-section care-warning">
        <p>
          <strong>
            <Editable contentKey="careWarningBold">{t("careWarningBold")}</Editable>
          </strong>
        </p>
        <p>
          <Editable contentKey="careWarningNote">{t("careWarningNote")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="careDailyTitle">{t("careDailyTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="careDaily1">{t("careDaily1")}</Editable>
        </p>
        <p>
          <Editable contentKey="careDaily2">{t("careDaily2")}</Editable>
        </p>
        <p>
          <Editable contentKey="careDaily3">{t("careDaily3")}</Editable>
        </p>
        <p>
          <Editable contentKey="careDaily4">{t("careDaily4")}</Editable>
        </p>
        <p>
          <Editable contentKey="careDaily5">{t("careDaily5")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="careImportantTitle">{t("careImportantTitle")}</Editable>
        </h2>
        <ul className="care-list">
          {RULE_KEYS.map((key) => (
            <li key={key}>
              <Editable contentKey={key}>{t(key)}</Editable>
            </li>
          ))}
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="careHealingTitle">{t("careHealingTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="careHealing1">{t("careHealing1")}</Editable>
        </p>
        <p>
          <Editable contentKey="careHealing2">{t("careHealing2")}</Editable>
        </p>
        <p>
          <Editable contentKey="careHealing3">{t("careHealing3")}</Editable>
        </p>
        <p>
          <Editable contentKey="careHealing4">{t("careHealing4")}</Editable>
        </p>
        <p>
          <Editable contentKey="careHealing5">{t("careHealing5")}</Editable>
        </p>
      </section>

      <div className="care-timeline-image">
        <EditableImage
          imageKey="careTimelineImage"
          fallbackSrc={healingTimeline}
          alt={t("careHealingImageAlt")}
          sizes="(max-width: 720px) 100vw, 720px"
          style={{ objectFit: "contain" }}
        />
      </div>

      <section className="form-section care-contact">
        <p>
          <Editable contentKey="careContactIntro">{t("careContactIntro")}</Editable>
        </p>
        <a href="tel:0509988848" className="care-phone">
          <Editable contentKey="carePhoneNumber">{t("carePhoneNumber")}</Editable>
        </a>
      </section>

      <p className="care-signoff">
        <Editable contentKey="careSignoff">{t("careSignoff")}</Editable>
        <br />
        <strong className="text-gold">
          <Editable contentKey="careSignoffName">{t("careSignoffName")}</Editable>
        </strong>
      </p>
    </div>
  );
}
