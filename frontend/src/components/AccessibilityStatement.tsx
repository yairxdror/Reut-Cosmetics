"use client";

import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import type { EditableTextKey } from "@/lib/editableContent";
import { PHONE_TEL_URL } from "@/lib/contact";

const MEASURE_KEYS: EditableTextKey[] = ["asMeasure1", "asMeasure2", "asMeasure3", "asMeasure4", "asMeasure5"];

export default function AccessibilityStatement() {
  const { t } = useLanguage();

  return (
    <div className="care-instructions">
      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="asCommitmentTitle">{t("asCommitmentTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="asCommitmentText">{t("asCommitmentText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="asMeasuresTitle">{t("asMeasuresTitle")}</Editable>
        </h2>
        <ul className="care-list">
          {MEASURE_KEYS.map((key) => (
            <li key={key}>
              <Editable contentKey={key}>{t(key)}</Editable>
            </li>
          ))}
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="asLevelTitle">{t("asLevelTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="asLevelText">{t("asLevelText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="asLimitationsTitle">{t("asLimitationsTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="asLimitationsText">{t("asLimitationsText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="asContactTitle">{t("asContactTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="asContactIntro">{t("asContactIntro")}</Editable>
        </p>
        <p>
          <Editable contentKey="legalPhoneLabel">{t("legalPhoneLabel")}</Editable>{" "}
          <a href={PHONE_TEL_URL}>
            <Editable contentKey="phoneDisplayNumber">{t("phoneDisplayNumber")}</Editable>
          </a>
          <br />
          <Editable contentKey="asEmailLabel">{t("asEmailLabel")}</Editable>{" "}
          <a href="mailto:codedly.il@gmail.com">
            <Editable contentKey="asCoordinatorEmail">{t("asCoordinatorEmail")}</Editable>
          </a>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="asComplaintsTitle">{t("asComplaintsTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="asComplaintsText">{t("asComplaintsText")}</Editable>
        </p>
      </section>

      <p className="accessibility-updated">
        <Editable contentKey="asLastUpdated">{t("asLastUpdated")}</Editable>
      </p>
    </div>
  );
}
