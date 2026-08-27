import type { TranslationKey } from "@/context/LanguageContext";

// Keep in sync with backend/src/routes/content.js's ALLOWED_TEXT_KEYS /
// ALLOWED_IMAGE_KEYS. There's no package shared between the two runtimes,
// so a key added here without a matching backend addition fails at
// click-time with a 400 rather than at compile time.
export const EDITABLE_TEXT_KEYS = [
  "heroTitleMain",
  "heroTitleLine2Prefix",
  "heroTitleHighlight",
  "heroSubtitle",
  "featureDiagnostics",
  "featurePersonalService",
  "featureEquipped",
  "featureMaterials",
  "heroBadgeLine1",
  "heroBadgeLine2",
  "heroBadgeLine3",
  "servicesTitleKicker",
  "servicesTitleMain",
  "service1Title",
  "service1Desc",
  "service2Title",
  "service2Desc",
  "service3Title",
  "service3Desc",
  "service4Title",
  "service4Desc",
  "privateCoursesIntro",
  "pcCourse1Title",
  "pcCourse1Desc",
  "pcCourse1MethodsLabel",
  "pcCourse1Method1",
  "pcCourse1Method2",
  "pcCourse1Method3",
  "pcCourse2Title",
  "pcCourse2Desc",
  "locationTitle",
  "locationAddress",
  "reviewsTitle",
  "footerRights",
  "developedBy",
] as const satisfies readonly TranslationKey[];

export type EditableTextKey = (typeof EDITABLE_TEXT_KEYS)[number];

export const EDITABLE_IMAGE_KEYS = ["heroProduct", "logo", "servicesCardImage", "coursesCardImage"] as const;

export type EditableImageKey = (typeof EDITABLE_IMAGE_KEYS)[number];
