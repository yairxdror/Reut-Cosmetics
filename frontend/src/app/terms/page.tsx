"use client";

import TermsOfUse from "@/components/TermsOfUse";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        {t("termsOfUse")}
      </h1>
      <TermsOfUse />
    </section>
  );
}
