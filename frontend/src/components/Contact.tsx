"use client";

import { useState, type FormEvent } from "react";
import { useLanguage, type TranslationKey } from "@/context/LanguageContext";
import { WhatsAppIcon, InstagramIcon, PhoneIcon } from "@/components/icons";
import { WHATSAPP_URL, PHONE_TEL_URL, INSTAGRAM_URL, whatsappUrl } from "@/lib/contact";
import { isValidIsraeliPhone } from "@/lib/israeliValidation";

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
    if (!phone.trim()) {
      setError(t("consultationPhoneRequired"));
      return;
    }
    if (!isValidIsraeliPhone(phone)) {
      setError(t("consultationPhoneInvalid"));
      return;
    }
    setError("");

    const lines = [
      `${t("consultationWhatsappMessage")} ${name.trim()}.`,
      `${t("consultationWhatsappPhoneLabel")}: ${phone.trim()}`,
    ];
    if (service) lines.push(`${t("consultationWhatsappServiceLabel")}: ${service}`);

    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <section className="contact-section">
      <div className="contact-card">
        <h2 className="contact-title text-gold">{t("contactSectionTitle")}</h2>
        <div className="contact-buttons">
          <a className="btn-hero btn-hero-gold" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={18} />
            {t("whatsappCta")}
          </a>
          <a className="btn-hero btn-hero-gold" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={18} />
            {t("instagramCta")}
          </a>
          <a className="btn-hero btn-hero-gold" href={PHONE_TEL_URL}>
            <PhoneIcon size={18} />
            {t("phoneCta")}
          </a>
        </div>

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
              {t("consultationSubmit")}
            </button>
          </div>
          {error && <p className="form-error consultation-error">{error}</p>}
        </form>
      </div>
    </section>
  );
}
