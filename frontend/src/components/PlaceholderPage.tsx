"use client";

import { useLanguage, type TranslationKey } from "@/context/LanguageContext";

export default function PlaceholderPage({ titleKey }: { titleKey: TranslationKey }) {
  const { t } = useLanguage();
  return (
    <section>
      <h1 className="text-gold">{t(titleKey)}</h1>
      <p>{t("comingSoon")}</p>
    </section>
  );
}
