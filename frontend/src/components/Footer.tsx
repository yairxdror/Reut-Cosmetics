"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import logo from "@/assets/logo.png";
import { WhatsAppIcon, PhoneIcon, InstagramIcon, FacebookIcon, TikTokIcon, LocationPinIcon } from "@/components/icons";
import { PHONE_TEL_URL, PHONE_DISPLAY_NUMBER, INSTAGRAM_URL, FACEBOOK_URL, TIKTOK_URL, whatsappUrl } from "@/lib/contact";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h3 className="footer-col-title">{t("openingHoursTitle")}</h3>
          <p className="footer-hours-line">{t("openingHoursWeekdays")}</p>
          <p className="footer-hours-line">{t("openingHoursFriday")}</p>
        </div>

        <div className="footer-col">
          <h3 className="footer-col-title">
            Reut Cosmetics
            <LocationPinIcon size={16} />
          </h3>
          <p className="footer-hours-line">{t("locationAddress")}</p>
        </div>

        <a className="footer-col footer-contact-link" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          {PHONE_DISPLAY_NUMBER}
          <WhatsAppIcon size={18} />
        </a>

        <a className="footer-col footer-contact-link" href={PHONE_TEL_URL}>
          {PHONE_DISPLAY_NUMBER}
          <PhoneIcon size={16} />
        </a>

        <div className="footer-col footer-socials">
          <a className="footer-social-btn" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon size={16} />
          </a>
          <a className="footer-social-btn" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookIcon size={16} />
          </a>
          <a className="footer-social-btn" href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <TikTokIcon size={16} />
          </a>
        </div>

        <div className="footer-col footer-col-brand">
          <Image src={logo} alt="Reut Yakobi" className="footer-logo" />
          <div className="footer-brand-text">
            <span className="footer-brand-main">Reut</span>
            <span className="footer-brand-sub">COSMETICS</span>
          </div>
        </div>
      </div>

      <p className="footer-copyright">
        {t("footerRights")}
        {" · "}
        <Link href="/accessibility" className="footer-accessibility-link">
          {t("accessibility")}
        </Link>
        <span className="footer-credit">{t("developedBy")}</span>
      </p>
    </footer>
  );
}
