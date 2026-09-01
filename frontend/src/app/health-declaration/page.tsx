"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HealthDeclarationForm from "@/components/HealthDeclarationForm";
import Spinner from "@/components/Spinner";
import { ADMIN_AUTH_EVENT, isAdminLoggedIn } from "@/lib/adminAuth";
import { useLanguage } from "@/context/LanguageContext";

export default function HealthDeclarationPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    function checkAccess() {
      if (isAdminLoggedIn()) {
        setIsAuthorized(true);
        return;
      }

      setIsAuthorized(false);
      router.replace("/login");
    }

    checkAccess();
    window.addEventListener(ADMIN_AUTH_EVENT, checkAccess);
    window.addEventListener("storage", checkAccess);

    return () => {
      window.removeEventListener(ADMIN_AUTH_EVENT, checkAccess);
      window.removeEventListener("storage", checkAccess);
    };
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="admin-status">
        <Spinner />
      </div>
    );
  }

  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        {t("healthDeclaration")}
      </h1>
      <p style={{ textAlign: "center" }}>
        <span className="form-required">*</span> {t("hdRequiredNote")}
      </p>
      <HealthDeclarationForm />
    </section>
  );
}
