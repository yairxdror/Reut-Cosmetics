"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { WazeIcon } from "@/components/icons";
import Editable from "@/components/Editable";
import TieredTitle from "@/components/TieredTitle";

export default function Location() {
  const { t } = useLanguage();
  const address = t("locationAddress");

  // Derived via useMemo (keyed on the resolved, possibly admin-edited
  // address) rather than a module-level const, so editing the address
  // updates these links too instead of leaving them pointed at whatever
  // address was hardcoded at build time.
  const mapsEmbedSrc = useMemo(
    () => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`,
    [address]
  );
  const wazeUrl = useMemo(
    () => `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`,
    [address]
  );

  return (
    <section className="location-section" id="location">
      <TieredTitle contentKey="locationTitle" className="location-title" />
      <div className="location-content">
        <div className="location-map-wrap">
          <iframe
            className="location-map"
            src={mapsEmbedSrc}
            title={t("locationTitle")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="location-info">
          <p className="location-address">
            <Editable contentKey="locationAddress">{address}</Editable>
          </p>
          <a className="btn btn-blue" href={wazeUrl} target="_blank" rel="noopener noreferrer">
            <WazeIcon size={18} />
            <Editable contentKey="wazeCta">{t("wazeCta")}</Editable>
          </a>
        </div>
      </div>
    </section>
  );
}
