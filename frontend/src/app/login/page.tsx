"use client";

import LoginForm from "@/components/LoginForm";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        {t("login")}
      </h1>
      <p style={{ textAlign: "center" }}>{t("loginSubtitle")}</p>
      <LoginForm />
    </section>
  );
}
