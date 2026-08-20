"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "he" | "en";

type Dictionary = Record<string, { he: string; en: string }>;

const dictionary: Dictionary = {
  contactUs: { he: "צור קשר", en: "Contact Us" },
  aboutTitle: { he: "צור קשר", en: "Contact" },
  aboutText: {
    he: "זהו עמוד לדוגמה שמדגים את כפתור החזרה.",
    en: "This is a placeholder page demonstrating the back button.",
  },

  heroTitleMain: { he: "יופי, דיוק ונוכחות", en: "Beauty, Precision, and Presence," },
  heroTitleLine2Prefix: { he: "בדיוק", en: "Made" },
  heroTitleHighlight: { he: "בשבילך", en: "Just for You" },
  heroSubtitle: {
    he: "טיפולי קוסמטיקה מתקדמים, איפור קבוע, איפור ערב, איפור כלות, עיצוב גבות, שעווה בפנים, קורסי הכשרה מקצועיים.\nכל מה שצריך כדי להרגיש מושלמת.",
    en: "Advanced cosmetic treatments, permanent makeup, evening makeup, bridal makeup, eyebrow shaping, facial waxing, professional training courses.\nEverything you need to feel perfect.",
  },
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
  careInstructions: { he: "הוראות לטיפול", en: "Treatment Instructions" },
  privateCourses: { he: "הדרכת קורסים פרטניים", en: "Private Course Guidance" },
  login: { he: "התחברות", en: "Login" },
  privacyPolicy: { he: "מדיניות פרטיות", en: "Privacy Policy" },
  termsOfUse: { he: "תנאי שימוש", en: "Terms of Use" },
  comingSoon: { he: "תוכן העמוד יתווסף בקרוב.", en: "Page content coming soon." },

  loginSubtitle: { he: "כניסת מנהלת אתר", en: "Site admin sign-in" },
  loginEmailLabel: { he: "אימייל", en: "Email" },
  loginPasswordLabel: { he: "סיסמה", en: "Password" },
  loginSubmit: { he: "התחברות", en: "Log In" },
  loginSubmitting: { he: "מתחברת...", en: "Logging in..." },
  loginEmailRequired: { he: "יש למלא אימייל", en: "Email is required" },
  loginEmailInvalid: { he: "כתובת האימייל אינה תקינה", en: "Please enter a valid email address" },
  loginPasswordRequired: { he: "יש למלא סיסמה", en: "Password is required" },
  loginPasswordTooShort: { he: "הסיסמה חייבת להכיל לפחות 6 תווים", en: "Password must be at least 6 characters" },
  loginInvalidCredentials: { he: "אימייל או סיסמה שגויים", en: "Invalid email or password" },
  loginGenericError: { he: "אירעה שגיאה. נסי שוב מאוחר יותר.", en: "Something went wrong. Please try again later." },
  loginSuccessTitle: { he: "התחברת בהצלחה", en: "Logged in successfully" },
  loginSuccessText: { he: "התחברת כמנהלת האתר.", en: "You are now signed in as the site admin." },

  reviewsTitle: { he: "מה הלקוחות שלנו אומרות", en: "What Our Clients Say" },
  addReviewButton: { he: "הוסיפי ביקורת", en: "Add a Review" },
  reviewFormTitle: { he: "כתיבת ביקורת", en: "Write a Review" },
  requiredFieldsNote: {
    he: "שאלות המסומנות בכוכבית אדומה הן שאלות חובה.",
    en: "Fields marked with a red asterisk are required.",
  },
  reviewNameLabel: { he: "שם", en: "Name" },
  reviewRatingLabel: { he: "דירוג", en: "Rating" },
  reviewTextLabel: { he: "הביקורת שלך", en: "Your Review" },
  reviewTextPlaceholder: { he: "ספרי לנו על החוויה שלך...", en: "Tell us about your experience..." },
  reviewSubmit: { he: "פרסום ביקורת", en: "Post Review" },
  reviewSubmitting: { he: "מפרסמת...", en: "Posting..." },
  reviewEditFormTitle: { he: "עריכת ביקורת", en: "Edit Review" },
  reviewUpdate: { he: "עדכון ביקורת", en: "Update Review" },
  reviewUpdating: { he: "מעדכנת...", en: "Updating..." },
  reviewEditedLabel: { he: "נערך", en: "edited" },
  reviewEditExpired: {
    he: "לא ניתן יותר לערוך ביקורת זו (עברו יותר מ-15 דקות מהפרסום).",
    en: "This review can no longer be edited (more than 15 minutes have passed since posting).",
  },
  reviewNameRequired: { he: "יש למלא שם", en: "Name is required" },
  reviewRatingRequired: { he: "יש לבחור דירוג", en: "Please select a rating" },
  reviewTextRequired: { he: "יש לכתוב ביקורת", en: "Please write a review" },
  reviewTextTooShort: { he: "הביקורת קצרה מדי (לפחות 3 תווים)", en: "Review is too short (at least 3 characters)" },
  reviewProfanityError: {
    he: "הביקורת מכילה שפה לא הולמת. נא לנסח מחדש.",
    en: "This review contains inappropriate language. Please rephrase.",
  },
  reviewTextTooLong: { he: "הביקורת ארוכה מדי (עד 500 תווים)", en: "Review is too long (max 500 characters)" },
  reviewGenericError: { he: "אירעה שגיאה. נסי שוב מאוחר יותר.", en: "Something went wrong. Please try again later." },
  reviewRateLimited: {
    he: "נשלחו יותר מדי ביקורות מהמכשיר הזה. נסי שוב בעוד כמה דקות.",
    en: "Too many reviews submitted from this device. Please try again in a few minutes.",
  },
  reviewsEmpty: { he: "עדיין אין ביקורות. תהיי הראשונה לכתוב!", en: "No reviews yet. Be the first to write one!" },
  reviewsLoadError: { he: "לא ניתן לטעון ביקורות כרגע.", en: "Unable to load reviews right now." },
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
    const root = document.documentElement;
    root.classList.add("no-transitions");
    root.lang = language;
    root.dir = language === "he" ? "rtl" : "ltr";

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("no-transitions");
      });
    });
    return () => cancelAnimationFrame(raf);
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
