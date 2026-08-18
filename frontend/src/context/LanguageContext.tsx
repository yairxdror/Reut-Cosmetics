"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "he" | "en";

type Dictionary = Record<string, { he: string; en: string }>;

const dictionary: Dictionary = {
  back: { he: "חזור", en: "Back" },
  viewProducts: { he: "לצפייה במוצרים", en: "View Products" },
  contactUs: { he: "צור קשר", en: "Contact Us" },
  productsTitle: { he: "המוצרים שלנו", en: "Our Products" },
  aboutTitle: { he: "צור קשר", en: "Contact" },
  aboutText: {
    he: "זהו עמוד לדוגמה שמדגים את כפתור החזרה.",
    en: "This is a placeholder page demonstrating the back button.",
  },
  loading: { he: "טוען...", en: "Loading..." },
  price: { he: "מחיר", en: "Price" },

  heroTitleMain: { he: "יופי, דיוק ונוכחות", en: "Beauty, Precision, and Presence," },
  heroTitleLine2Prefix: { he: "בדיוק", en: "Made" },
  heroTitleHighlight: { he: "בשבילך", en: "Just for You" },
  heroSubtitle: {
    he: "טיפולי קוסמטיקה מתקדמים, איפור קבוע, איפור ערב, עיצוב גבות, לק ג'ל, קורסי הכשרה מקצועיים - כל מה שצריך כדי להרגיש מושלמת.",
    en: "Advanced cosmetic treatments, permanent makeup, evening makeup, eyebrow shaping, gel polish, professional training courses - everything you need to feel perfect.",
  },
  bookAppointment: { he: "לקביעת תור", en: "Book an Appointment" },
  whatsappCta: { he: "דברו איתנו בוואטסאפ", en: "Chat with us on WhatsApp" },
  featureDiagnostics: { he: "בדיקות מדויקות\nלהתאמה מושלמת", en: "Precise diagnostics\nfor a perfect fit" },
  featurePersonalService: { he: "שירות אישי\nוליווי צמוד", en: "Personal service\nand close guidance" },
  featureEquipped: { he: "המרכז מאובזר\nבסטנדרטים גבוהים", en: "Facility equipped\nto high standards" },
  featureMaterials: { he: "חומרים איכותיים\nלמראה מושלם", en: "Quality materials\nfor a flawless look" },
  heroBadgeLine1: { he: "סטנדרט של", en: "A standard of" },
  heroBadgeLine2: { he: "יוקרה", en: "luxury" },
  heroBadgeLine3: { he: "ותוצאות מושלמות", en: "and flawless results" },

  servicesTitle: { he: "השירותים שלנו", en: "Our Services" },
  servicesImageLabel: { he: "תמונה תתווסף בקרוב", en: "Image coming soon" },
  detailsLink: { he: "לפרטים נוספים", en: "Learn more" },
  service1Title: { he: "איפור קבוע", en: "Permanent Makeup" },
  service1Desc: { he: "גבות, אייליינר ושפתיים בתוצאה טבעית ומדויקת.", en: "Brows, eyeliner and lips with a natural, precise result." },
  service2Title: { he: "איפור כלות וערב", en: "Bridal & Evening Makeup" },
  service2Desc: { he: "איפור מקצועי לאירועים, חתונות וערבים מיוחדים.", en: "Professional makeup for events, weddings and special evenings." },
  service3Title: { he: "קורסי לימוד", en: "Training Courses" },
  service3Desc: { he: "קורסים מקצועיים באיפור קבוע בהדרכה אישית.", en: "Professional permanent makeup courses with personal guidance." },
  service4Title: { he: "שעווה בפנים", en: "Facial Waxing" },
  service4Desc: { he: "עיצוב וחיטוב הפנים בטכניקה עדינה ומדויקת.", en: "Gentle, precise facial hair removal and shaping." },

  coursesTitle: { he: "הקורסים שלנו", en: "Our Courses" },
  course1Title: { he: "מיקרובליידינג", en: "Microblading" },
  course1Desc: { he: "איפור קבוע לגבות - כל השיטות", en: "Permanent eyebrow makeup - all methods" },
  course2Title: { he: "עיצוב גבות", en: "Eyebrow Shaping" },

  menu: { he: "תפריט", en: "Menu" },
  faq: { he: "שאלות ותשובות", en: "FAQ" },
  healthDeclaration: { he: "הצהרת בריאות", en: "Health Declaration" },
  privateCourses: { he: "הדרכת קורסים פרטניים", en: "Private Course Guidance" },
  login: { he: "התחברות", en: "Login" },
  privacyPolicy: { he: "מדיניות פרטיות", en: "Privacy Policy" },
  termsOfUse: { he: "תנאי שימוש", en: "Terms of Use" },
  comingSoon: { he: "תוכן העמוד יתווסף בקרוב.", en: "Page content coming soon." },
};

export type TranslationKey = keyof typeof dictionary;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("he");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key) => dictionary[key][language],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
