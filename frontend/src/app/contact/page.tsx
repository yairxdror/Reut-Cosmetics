"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  return (
    <section>
      <h1 className="text-gold">{t("aboutTitle")}</h1>
      <p>{t("comingSoon")}</p>
    </section>
  );
}
