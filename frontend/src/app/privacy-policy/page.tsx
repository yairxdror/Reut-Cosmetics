"use client";

import PrivacyPolicy from "@/components/PrivacyPolicy";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        {t("privacyPolicy")}
      </h1>
      <PrivacyPolicy />
    </section>
  );
}
