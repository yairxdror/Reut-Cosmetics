"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import logo from "@/assets/logo.png";
import { WhatsAppIcon, PhoneIcon, InstagramIcon, FacebookIcon, LocationPinIcon } from "@/components/icons";
import {
  PHONE_TEL_URL,
  PHONE_DISPLAY_NUMBER,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  FACEBOOK_URL,
  FACEBOOK_NAME,
  whatsappUrl,
} from "@/lib/contact";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-col footer-links-col">
          <Link href="/faq" className="footer-nav-link">
            {t("faq")}
          </Link>
          <Link href="/care-instructions" className="footer-nav-link">
            {t("careInstructions")}
          </Link>
          <Link href="/courses" className="footer-nav-link">
            {t("privateCourses")}
          </Link>
        </div>

        <div className="footer-col footer-links-col">
          <Link href="/privacy-policy" className="footer-nav-link">
            {t("privacyPolicy")}
          </Link>
          <Link href="/terms" className="footer-nav-link">
            {t("termsOfUse")}
          </Link>
          <Link href="/accessibility" className="footer-nav-link">
            {t("accessibility")}
          </Link>
        </div>

        <a className="footer-col footer-location-link" href="#location">
          <h3 className="footer-col-title">
            {t("locationTitle")}
            <LocationPinIcon size={16} />
          </h3>
          <p className="footer-hours-line">{t("locationAddress")}</p>
        </a>

        <div className="footer-col footer-socials">
          <a className="footer-social-item" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <span className="footer-social-btn">
              <InstagramIcon size={16} />
            </span>
            <span className="footer-social-caption">{INSTAGRAM_HANDLE}</span>
          </a>
          <a className="footer-social-item" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <span className="footer-social-btn">
              <FacebookIcon size={16} />
            </span>
            <span className="footer-social-caption">{FACEBOOK_NAME}</span>
          </a>
          <a className="footer-social-item" href={PHONE_TEL_URL} aria-label="Phone">
            <span className="footer-social-btn">
              <PhoneIcon size={16} />
            </span>
            <span className="footer-social-caption">{PHONE_DISPLAY_NUMBER}</span>
          </a>
          <a className="footer-social-item" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <span className="footer-social-btn">
              <WhatsAppIcon size={16} />
            </span>
            <span className="footer-social-caption">{PHONE_DISPLAY_NUMBER}</span>
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
        <span className="footer-credit">{t("developedBy")}</span>
      </p>
    </footer>
  );
}
