"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { WazeIcon } from "@/components/icons";
import Editable from "@/components/Editable";
import TieredTitle from "@/components/TieredTitle";

export default function Location() {
  const { t } = useLanguage();
  const address = t("locationAddress");
  const sectionRef = useRef<HTMLElement>(null);
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setLoadMap(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setLoadMap(true);
      observer.disconnect();
    }, {
      // The page scrolls inside SiteChrome; a viewport root would clip away
      // the preload margin at that scrolling ancestor.
      root: section.closest(".page-scroll"),
      rootMargin: "800px 0px",
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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
    <section className="location-section" id="location" ref={sectionRef}>
      <TieredTitle contentKey="locationTitle" className="location-title" />
      <div className="location-content">
        <div className="location-map-wrap">
          {loadMap && (
            <iframe
              className="location-map"
              src={mapsEmbedSrc}
              title={t("locationTitle")}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
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
