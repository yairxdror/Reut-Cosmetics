"use client";

import PrivateCourses from "@/components/PrivateCourses";
import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";

export default function CoursesPage() {
  const { t } = useLanguage();

  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        <Editable contentKey="privateCourses">{t("privateCourses")}</Editable>
      </h1>
      <PrivateCourses />
    </section>
  );
}
