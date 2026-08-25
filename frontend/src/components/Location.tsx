"use client";

import { useLanguage } from "@/context/LanguageContext";
import { WazeIcon } from "@/components/icons";

const ADDRESS = "משה רחמילביץ 34, ירושלים";
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent(ADDRESS)}&navigate=yes`;

export default function Location() {
  const { t } = useLanguage();

  return (
    <section className="location-section" id="location">
      <h2 className="location-title text-gold">{t("locationTitle")}</h2>
      <div className="location-content">
        <div className="location-map-wrap">
          <iframe
            className="location-map"
            src={MAPS_EMBED_SRC}
            title={t("locationTitle")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="location-info">
          <p className="location-address">{t("locationAddress")}</p>
          <a className="btn btn-blue" href={WAZE_URL} target="_blank" rel="noopener noreferrer">
            <WazeIcon size={18} />
            {t("wazeCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
