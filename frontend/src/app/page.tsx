"use client";

import Image from "next/image";
import heroProduct from "@/assets/hero-product.jpg";
import { useLanguage } from "@/context/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";
import {
  CrownIcon,
  DiamondIcon,
  HeartIcon,
  PersonIcon,
  ShieldIcon,
  SparkleIcon,
  WhatsAppIcon,
} from "@/components/icons";
import Services from "@/components/Services";
import Courses from "@/components/Courses";
import Location from "@/components/Location";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const FEATURES = [
  { icon: SparkleIcon, key: "featureDiagnostics" as const },
  { icon: PersonIcon, key: "featurePersonalService" as const },
  { icon: DiamondIcon, key: "featureEquipped" as const },
  { icon: ShieldIcon, key: "featureMaterials" as const },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <section className="hero-banner">
        <div className="hero-image-col">
          <div className="hero-image-placeholder-full">
            <Image
              src={heroProduct}
              alt={`${t("heroTitleMain")} ${t("heroTitleLine2Prefix")} ${t("heroTitleHighlight")}`}
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="hero-badge">
            <CrownIcon size={27} />
            <span>
              {t("heroBadgeLine1")}
              <br />
              <strong>{t("heroBadgeLine2")}</strong>
              <br />
              {t("heroBadgeLine3")}
            </span>
          </div>
        </div>

        <div className="hero-content">
          <h1>
            {t("heroTitleMain")}
            <br />
            {t("heroTitleLine2Prefix")} <span className="text-gold">{t("heroTitleHighlight")}</span>
          </h1>

          <div className="hero-divider">
            <span className="hero-divider-line" />
            <HeartIcon size={18} className="hero-heart" />
            <span className="hero-divider-line" />
          </div>

          <p className="hero-description">{t("heroSubtitle")}</p>

          <div className="hero-cta-row">
            <a
              className="btn-hero btn-hero-gold hero-whatsapp-cta"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={18} />
              {t("whatsappCta")}
            </a>
          </div>

          <div className="hero-features">
            {FEATURES.map(({ icon: FeatureIcon, key }) => (
              <div className="hero-feature" key={key}>
                <FeatureIcon size={26} />
                <span>{t(key)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-wave" aria-hidden="true" />
      </section>

      <Services />
      <Courses />
      <Location />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
}
