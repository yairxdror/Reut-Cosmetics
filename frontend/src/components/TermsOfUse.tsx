"use client";

import { PHONE_TEL_URL, whatsappUrl } from "@/lib/contact";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import type { EditableTextKey } from "@/lib/editableContent";

const PAYMENT_TERM_KEYS: EditableTextKey[] = [
  "touPayment1",
  "touPayment2",
  "touPayment3",
  "touPayment4",
  "touPayment5",
  "touPayment6",
];

export default function TermsOfUse() {
  const { t } = useLanguage();

  return (
    <div className="care-instructions">
      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touGeneralTitle">{t("touGeneralTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touGeneralText">{t("touGeneralText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touServicesTitle">{t("touServicesTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touServicesText">{t("touServicesText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touHealthTitle">{t("touHealthTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touHealthText">{t("touHealthText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touPaymentTitle">{t("touPaymentTitle")}</Editable>
        </h2>
        <ul className="care-list">
          {PAYMENT_TERM_KEYS.map((key) => (
            <li key={key}>
              <Editable contentKey={key}>{t(key)}</Editable>
            </li>
          ))}
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touReviewsTitle">{t("touReviewsTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touReviewsText">{t("touReviewsText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touIpTitle">{t("touIpTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touIpText">{t("touIpText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touLiabilityTitle">{t("touLiabilityTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touLiabilityText">{t("touLiabilityText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touChangesTitle">{t("touChangesTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touChangesText">{t("touChangesText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touJurisdictionTitle">{t("touJurisdictionTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touJurisdictionText">{t("touJurisdictionText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          <Editable contentKey="touContactTitle">{t("touContactTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touContactIntro">{t("touContactIntro")}</Editable>
        </p>
        <p className="legal-contact-line">
          <Editable contentKey="legalPhoneLabel">{t("legalPhoneLabel")}</Editable>{" "}
          <a href={PHONE_TEL_URL}>
            <Editable contentKey="phoneDisplayNumber">{t("phoneDisplayNumber")}</Editable>
          </a>
        </p>
        <p className="legal-contact-line">
          <Editable contentKey="legalWhatsappLabel">{t("legalWhatsappLabel")}</Editable>{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <Editable contentKey="phoneDisplayNumber">{t("phoneDisplayNumber")}</Editable>
          </a>
        </p>
      </section>

      <p className="accessibility-updated">
        <Editable contentKey="touLastUpdated">{t("touLastUpdated")}</Editable>
      </p>
    </div>
  );
}
