"use client";

import Link from "next/link";
import { whatsappUrl } from "@/lib/contact";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import type { EditableTextKey } from "@/lib/editableContent";
import { formatLegalDate } from "@/lib/legalDate";

// Shown until the first admin edit ever sets a server-computed date (see
// backend/src/routes/content.js's pageLastUpdated logic).
const FALLBACK_LAST_UPDATED = "2026-09-16T00:00:00.000Z";

const PAYMENT_TERM_KEYS: EditableTextKey[] = [
  "touPayment1",
  "touPayment2",
  "touPayment4",
  "touPayment5",
];

export default function TermsOfUse() {
  const { t, getPageLastUpdated } = useLanguage();
  const lastUpdated = getPageLastUpdated("terms") ?? FALLBACK_LAST_UPDATED;

  return (
    <div className="care-instructions">
      <section className="form-section">
        <h2 className="form-section-title text-gold">
          1. <Editable contentKey="touGeneralTitle">{t("touGeneralTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touGeneralText">{t("touGeneralText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          2. <Editable contentKey="touOperatorTitle">{t("touOperatorTitle")}</Editable>
        </h2>
        <p className="legal-contact-line">
          <Editable contentKey="touOperatorText">{t("touOperatorText")}</Editable>{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          3. <Editable contentKey="touServicesTitle">{t("touServicesTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touServicesText">{t("touServicesText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          4. <Editable contentKey="touBookingTitle">{t("touBookingTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touBookingText">{t("touBookingText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          5. <Editable contentKey="touHealthTitle">{t("touHealthTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touHealthText">{t("touHealthText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          6. <Editable contentKey="touPaymentTitle">{t("touPaymentTitle")}</Editable>
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
          7. <Editable contentKey="touSchedulingTitle">{t("touSchedulingTitle")}</Editable>
        </h2>
        <p><Editable contentKey="touPayment6">{t("touPayment6")}</Editable></p>
        <p><Editable contentKey="touSchedulingText">{t("touSchedulingText")}</Editable></p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          8. <Editable contentKey="touCancellationTitle">{t("touCancellationTitle")}</Editable>
        </h2>
        <p><Editable contentKey="touPayment3">{t("touPayment3")}</Editable></p>
        <p><Editable contentKey="touCancellationNotice">{t("touCancellationNotice")}</Editable>{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </p>
        <p><Editable contentKey="touCancellationReceipt">{t("touCancellationReceipt")}</Editable></p>
        <p><Editable contentKey="touPayment7">{t("touPayment7")}</Editable></p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          9. <Editable contentKey="touBusinessCancellationTitle">{t("touBusinessCancellationTitle")}</Editable>
        </h2>
        <ul className="care-list">
          {(["touBusinessAppointment", "touBusinessSuitability", "touBusinessSecondSession", "touBusinessCourse"] as const).map((key) => (
            <li key={key}><Editable contentKey={key}>{t(key)}</Editable></li>
          ))}
        </ul>
        <p><Editable contentKey="touBusinessRefund">{t("touBusinessRefund")}</Editable></p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          10. <Editable contentKey="touCoursesTitle">{t("touCoursesTitle")}</Editable>
        </h2>
        <p><Editable contentKey="touPayment8">{t("touPayment8")}</Editable></p>
        <p><Editable contentKey="touCoursesDetails">{t("touCoursesDetails")}</Editable></p>
        <p><Link href="/courses"><Editable contentKey="touCoursesLink">{t("touCoursesLink")}</Editable></Link></p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          11. <Editable contentKey="touReviewsTitle">{t("touReviewsTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touReviewsText">{t("touReviewsText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          12. <Editable contentKey="touPrivacyTitle">{t("touPrivacyTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touPrivacyText">{t("touPrivacyText")}</Editable>{" "}
          <Link href="/privacy-policy">{t("privacyPolicyLinkLabel")}</Link>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          13. <Editable contentKey="touIpTitle">{t("touIpTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touIpText">{t("touIpText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          14. <Editable contentKey="touLiabilityTitle">{t("touLiabilityTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touLiabilityText">{t("touLiabilityText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          15. <Editable contentKey="touProhibitedTitle">{t("touProhibitedTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touProhibitedText">{t("touProhibitedText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          16. <Editable contentKey="touChangesTitle">{t("touChangesTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touChangesText">{t("touChangesText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          17. <Editable contentKey="touJurisdictionTitle">{t("touJurisdictionTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touJurisdictionText">{t("touJurisdictionText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          18. <Editable contentKey="touSeverabilityTitle">{t("touSeverabilityTitle")}</Editable>
        </h2>
        <p>
          <Editable contentKey="touSeverabilityText">{t("touSeverabilityText")}</Editable>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">
          19. <Editable contentKey="touContactTitle">{t("touContactTitle")}</Editable>
        </h2>
        <p className="legal-contact-line">
          <Editable contentKey="touContactIntroBefore">{t("touContactIntroBefore")}</Editable>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-gold">
            WhatsApp
          </a>
          <Editable contentKey="touContactIntroAfter">{t("touContactIntroAfter")}</Editable>
        </p>
      </section>

      <p className="accessibility-updated">
        {t("touLastUpdatedPrefix")} {formatLegalDate(lastUpdated)}.
      </p>
    </div>
  );
}
