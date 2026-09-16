"use client";

import { whatsappUrl } from "@/lib/contact";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import type { EditableTextKey } from "@/lib/editableContent";
import { formatLegalDate } from "@/lib/legalDate";

// Shown until the first admin edit ever sets a server-computed date (see
// backend/src/routes/content.js's pageLastUpdated logic).
const FALLBACK_LAST_UPDATED = "2026-09-02T00:00:00.000Z";

const DATA_ITEM_KEYS: EditableTextKey[] = [
  "ppDataItem1",
  "ppDataItem2",
  "ppDataItem3",
  "ppDataItem4",
  "ppDataItem5",
  "ppDataItem6",
];
const SENSITIVE_ITEM_KEYS: EditableTextKey[] = [
  "ppSensitiveItem1",
  "ppSensitiveItem2",
  "ppSensitiveItem3",
  "ppSensitiveItem4",
];

export default function PrivacyPolicy() {
  const { t, getPageLastUpdated } = useLanguage();
  const lastUpdated = getPageLastUpdated("privacyPolicy") ?? FALLBACK_LAST_UPDATED;

  return (
    <div className="care-instructions">
      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppGeneralTitle">{t("ppGeneralTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppGeneralText">{t("ppGeneralText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppControllerTitle">{t("ppControllerTitle")}</Editable>
        </h2>
        <p className="legal-contact-line">
          <Editable contentKey="ppControllerText">{t("ppControllerText")}</Editable>{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppDataCollectedTitle">{t("ppDataCollectedTitle")}</Editable>
        </h2>
        <ul className="care-list">
          {DATA_ITEM_KEYS.map((key) => (
            <li key={key}>
              <Editable contentKey={key}>{t(key)}</Editable>
            </li>
          ))}
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppSensitiveTitle">{t("ppSensitiveTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppSensitiveIntro">{t("ppSensitiveIntro")}</Editable>
        </p>
        <ul className="care-list">
          {SENSITIVE_ITEM_KEYS.map((key) => (
            <li key={key}>
              <Editable contentKey={key}>{t(key)}</Editable>
            </li>
          ))}
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppUsageTitle">{t("ppUsageTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppUsageText">{t("ppUsageText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppSharingTitle">{t("ppSharingTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppSharingText">{t("ppSharingText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppRetentionTitle">{t("ppRetentionTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppRetentionText">{t("ppRetentionText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppSecurityTitle">{t("ppSecurityTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppSecurityText">{t("ppSecurityText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppCookiesTitle">{t("ppCookiesTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppCookiesText">{t("ppCookiesText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppRightsTitle">{t("ppRightsTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppRightsText">{t("ppRightsText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppUpdatesTitle">{t("ppUpdatesTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="ppUpdatesText">{t("ppUpdatesText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="ppContactTitle">{t("ppContactTitle")}</Editable>
        </h2>
        <p className="legal-contact-line">
          <Editable contentKey="ppContactIntro">{t("ppContactIntro")}</Editable>
          <br />
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </p>
      </section>

      <p className="accessibility-updated">
        {t("ppLastUpdatedPrefix")} {formatLegalDate(lastUpdated)}.
      </p>
    </div>
  );
}
