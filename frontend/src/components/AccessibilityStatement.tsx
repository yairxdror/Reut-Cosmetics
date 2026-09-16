"use client";

import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import type { EditableTextKey } from "@/lib/editableContent";
import { whatsappUrl } from "@/lib/contact";
import { formatLegalDate } from "@/lib/legalDate";

const MEASURE_KEYS: EditableTextKey[] = ["asMeasure1", "asMeasure2", "asMeasure3", "asMeasure4", "asMeasure5"];

// Shown until the first admin edit ever sets a server-computed date (see
// backend/src/routes/content.js's pageLastUpdated logic).
const FALLBACK_LAST_UPDATED = "2026-09-16T00:00:00.000Z";

export default function AccessibilityStatement() {
  const { t, getPageLastUpdated } = useLanguage();
  const lastUpdated = getPageLastUpdated("accessibility") ?? FALLBACK_LAST_UPDATED;

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
          <Editable contentKey="asUsageTitle">{t("asUsageTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="asUsageText">{t("asUsageText")}</Editable>
        </p>
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
          <Editable contentKey="asContactIntroBefore">{t("asContactIntroBefore")}</Editable>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-gold">
            WhatsApp
          </a>
          <Editable contentKey="asContactIntroAfter">{t("asContactIntroAfter")}</Editable>
          <a href="mailto:codedly.il@gmail.com" className="text-gold">
            <Editable contentKey="asCoordinatorEmail">{t("asCoordinatorEmail")}</Editable>
          </a>
        </p>
        <p>
          <Editable contentKey="asContactDetails">{t("asContactDetails")}</Editable>
        </p>
        <p>
          <Editable contentKey="asContactResponse">{t("asContactResponse")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="asVisitTitle">{t("asVisitTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="asVisitTextBefore">{t("asVisitTextBefore")}</Editable>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-gold">
            WhatsApp
          </a>
          <Editable contentKey="asVisitTextAfter">{t("asVisitTextAfter")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="asComplaintsTitle">{t("asComplaintsTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="asComplaintsText">{t("asComplaintsText")}</Editable>
        </p>
        <p>
          <a href="https://www.gov.il/he/service/complaint_discrimination_inaccessibility_people_with_disabilities" target="_blank" rel="noopener noreferrer">
            <Editable contentKey="asComplaintsLink">{t("asComplaintsLink")}</Editable>
          </a>
        </p>
      </section>

      <p className="accessibility-updated">
        {t("asLastUpdatedPrefix")} {formatLegalDate(lastUpdated)}.
      </p>
    </div>
  );
}
