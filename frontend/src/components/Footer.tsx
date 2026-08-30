"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import EditableImage from "@/components/EditableImage";
import logo from "@/assets/logo.png";
import { WhatsAppIcon, PhoneIcon, InstagramIcon, FacebookIcon, LocationPinIcon } from "@/components/icons";
import { PHONE_TEL_URL, INSTAGRAM_URL, FACEBOOK_URL, whatsappUrl } from "@/lib/contact";

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
            <Editable contentKey="locationTitle">{t("locationTitle")}</Editable>
            <LocationPinIcon size={16} />
          </h3>
          <p className="footer-hours-line">
            <Editable contentKey="locationAddress">{t("locationAddress")}</Editable>
          </p>
        </a>

        <div className="footer-col footer-socials">
          <a className="footer-social-item" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <span className="footer-social-btn">
              <InstagramIcon size={16} />
            </span>
            <span className="footer-social-caption">
              <Editable contentKey="instagramHandle">{t("instagramHandle")}</Editable>
            </span>
          </a>
          <a className="footer-social-item" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <span className="footer-social-btn">
              <FacebookIcon size={16} />
            </span>
            <span className="footer-social-caption">
              <Editable contentKey="facebookName">{t("facebookName")}</Editable>
            </span>
          </a>
          <a className="footer-social-item" href={PHONE_TEL_URL} aria-label="Phone">
            <span className="footer-social-btn">
              <PhoneIcon size={16} />
            </span>
            <span className="footer-social-caption">
              <Editable contentKey="phoneDisplayNumber">{t("phoneDisplayNumber")}</Editable>
            </span>
          </a>
          <a className="footer-social-item" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <span className="footer-social-btn">
              <WhatsAppIcon size={16} />
            </span>
            <span className="footer-social-caption">
              <Editable contentKey="phoneDisplayNumber">{t("phoneDisplayNumber")}</Editable>
            </span>
          </a>
        </div>

        <div className="footer-col footer-col-brand">
          <span className="footer-logo-frame">
            <EditableImage
              imageKey="logo"
              fallbackSrc={logo}
              alt="Reut Yakobi"
              sizes="40px"
              style={{ objectFit: "contain" }}
              editable={false}
            />
          </span>
          <div className="footer-brand-text">
            <span className="footer-brand-main">
              <Editable contentKey="brandNameMain" editable={false}>
                {t("brandNameMain")}
              </Editable>
            </span>
            <span className="footer-brand-sub">
              <Editable contentKey="brandNameSub" editable={false}>
                {t("brandNameSub")}
              </Editable>
            </span>
          </div>
        </div>
      </div>

      <p className="footer-copyright">
        <Editable contentKey="footerRights" editable={false}>
          {t("footerRights")}
        </Editable>
        <span className="footer-credit">
          <Editable contentKey="developedBy" editable={false}>
            {t("developedBy")}
          </Editable>
        </span>
      </p>
    </footer>
  );
}
