"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Spinner({ size = 32 }: { size?: number }) {
  const { t } = useLanguage();
  return <span className="spinner" style={{ width: size, height: size }} role="status" aria-label={t("spinnerLoading")} />;
}
