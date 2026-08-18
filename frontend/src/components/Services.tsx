"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BrushIcon, FeatherIcon, GraduationCapIcon, ImageIcon, LeafIcon } from "@/components/icons";

const SERVICES = [
  { badgeIcon: FeatherIcon, titleKey: "service1Title" as const, descKey: "service1Desc" as const },
  { badgeIcon: BrushIcon, titleKey: "service2Title" as const, descKey: "service2Desc" as const },
  { badgeIcon: GraduationCapIcon, titleKey: "service3Title" as const, descKey: "service3Desc" as const },
  { badgeIcon: LeafIcon, titleKey: "service4Title" as const, descKey: "service4Desc" as const },
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <section className="services-section">
      <h2 className="services-title text-gold">{t("servicesTitle")}</h2>
      <div className="services-grid">
        {SERVICES.map(({ badgeIcon: BadgeIcon, titleKey, descKey }) => (
          <div className="service-card" key={titleKey}>
            <div className="service-image">
              <ImageIcon size={32} />
              <span>{t("servicesImageLabel")}</span>
              <div className="service-badge">
                <BadgeIcon size={18} />
              </div>
            </div>
            <h3 className="service-card-title">{t(titleKey)}</h3>
            <p className="service-card-desc">{t(descKey)}</p>
            <a className="service-card-link" href="#">
              {t("detailsLink")}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
