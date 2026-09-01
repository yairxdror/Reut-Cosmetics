"use client";

import CareInstructions from "@/components/CareInstructions";
import { useLanguage } from "@/context/LanguageContext";

export default function CareInstructionsPage() {
  const { t } = useLanguage();

  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        {t("carePageTitle")}
      </h1>
      <CareInstructions />
    </section>
  );
}
