"use client";

import { useState, type FormEvent } from "react";
import { useLanguage, type TranslationKey } from "@/context/LanguageContext";
import { FacebookIcon, InstagramIcon, PhoneIcon } from "@/components/icons";
import { FACEBOOK_URL, PHONE_TEL_URL, INSTAGRAM_URL, whatsappUrl } from "@/lib/contact";
import { isValidIsraeliPhone } from "@/lib/israeliValidation";
import Editable from "@/components/Editable";

const SERVICE_OPTIONS: TranslationKey[] = ["service1Title", "service2Title", "service3Title", "service4Title"];

export default function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError(t("consultationNameRequired"));
      return;
    }
    if (name.trim().length < 2) {
      setError(t("consultationNameTooShort"));
      return;
    }
    if (!phone.trim()) {
      setError(t("consultationPhoneRequired"));
      return;
    }
    if (!isValidIsraeliPhone(phone)) {
      setError(t("consultationPhoneInvalid"));
      return;
    }
    if (!service) {
      setError(t("consultationServiceRequired"));
      return;
    }
    setError("");

    const lines = [
      `${t("consultationWhatsappMessage")} ${name.trim()}.`,
      `${t("consultationWhatsappPhoneLabel")}: ${phone.trim()}`,
    ];

    // A warm, personal line below the structured details, asking for more
    // info about the service chosen.
    lines.push("");
    lines.push(`${t("consultationWhatsappClosingWithService")} ${service}`);

    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <section className="contact-section">
      <h2 className="contact-title services-title-kicker">
        <Editable contentKey="contactSectionTitle">{t("contactSectionTitle")}</Editable>
      </h2>
      <div className="contact-buttons">
        <a className="btn-hero btn-hero-gold" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
          <FacebookIcon size={18} />
          <span className="contact-button-label-desktop">
            <Editable contentKey="facebookCta">{t("facebookCta")}</Editable>
          </span>
          <span className="contact-button-label-mobile">
            <Editable contentKey="facebookCtaMobile">{t("facebookCtaMobile")}</Editable>
          </span>
        </a>
        <a className="btn-hero btn-hero-gold" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          <InstagramIcon size={18} />
          <span className="contact-button-label-desktop">
            <Editable contentKey="instagramCta">{t("instagramCta")}</Editable>
          </span>
          <span className="contact-button-label-mobile">
            <Editable contentKey="instagramCtaMobile">{t("instagramCtaMobile")}</Editable>
          </span>
        </a>
        <a className="btn-hero btn-hero-gold" href={PHONE_TEL_URL}>
          <PhoneIcon size={18} />
          <span className="contact-button-label-desktop">
            <Editable contentKey="phoneCta">{t("phoneCta")}</Editable>
          </span>
          <span className="contact-button-label-mobile">
            <Editable contentKey="phoneCtaMobile">{t("phoneCtaMobile")}</Editable>
          </span>
        </a>
      </div>

      <div className="contact-card">
        <form className="consultation-bar" onSubmit={handleSubmit}>
          <div className="consultation-fields">
            <input
              type="text"
              name="name"
              autoComplete="name"
              className="consultation-input"
              placeholder={t("consultationNamePlaceholder")}
              value={name}
              onChange={(event) => setName(event.target.value.replace(/\d/g, ""))}
            />
            <select
              className="consultation-input consultation-select"
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              <option value="" disabled hidden>
                {t("consultationServicePlaceholder")}
              </option>
              {SERVICE_OPTIONS.map((key) => (
                <option key={key} value={t(key)}>
                  {t(key)}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="tel"
              autoComplete="tel"
              className="consultation-input"
              placeholder={t("consultationPhonePlaceholder")}
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))}
              inputMode="tel"
            />
            <button type="submit" className="btn btn-black consultation-submit">
              <Editable contentKey="consultationSubmit">{t("consultationSubmit")}</Editable>
            </button>
          </div>
          {error && <p className="form-error consultation-error">{error}</p>}
        </form>
      </div>
    </section>
  );
}
