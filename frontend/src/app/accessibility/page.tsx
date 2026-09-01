"use client";

import AccessibilityStatement from "@/components/AccessibilityStatement";
import { useLanguage } from "@/context/LanguageContext";

export default function AccessibilityPage() {
  const { t } = useLanguage();

  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        {t("accessibility")}
      </h1>
      <AccessibilityStatement />
    </section>
  );
}
