"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANGUAGE_COOKIE_NAME, type Language } from "@/lib/language";

export type { Language };
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type Dictionary = Record<string, { he: string; en: string }>;

const dictionary: Dictionary = {

  heroTitleMain: { he: "יופי, דיוק ונוכחות", en: "Beauty, Precision, and Presence," },
  heroTitleLine2Prefix: { he: "בדיוק", en: "Made" },
  heroTitleHighlight: { he: "בשבילך", en: "Just for You" },
  heroSubtitle: {
    he: "טיפולי קוסמטיקה מתקדמים, איפור קבוע, איפור ערב, איפור כלות, עיצוב גבות, שעווה בפנים, קורסי הכשרה מקצועיים.\nכל מה שצריך כדי להרגיש מושלמת.",
    en: "Advanced cosmetic treatments, permanent makeup, evening makeup, bridal makeup, eyebrow shaping, facial waxing, professional training courses.\nEverything you need to feel perfect.",
  },
  whatsappCta: { he: "דברו איתנו בוואטסאפ", en: "Chat with us on WhatsApp" },
  whatsappCtaCore: { he: "דברו איתנו", en: "Chat with us" },
  whatsappCtaSuffix: { he: "בוואטסאפ", en: "on WhatsApp" },
  featureDiagnostics: { he: "בדיקות מדויקות\nלהתאמה מושלמת", en: "Precise diagnostics\nfor a perfect fit" },
  featurePersonalService: { he: "שירות אישי\nוליווי צמוד", en: "Personal service\nand close guidance" },
  featureEquipped: { he: "מכון מאובזר\nבסטנדרטים גבוהים", en: "Facility equipped\nto high standards" },
  featureMaterials: { he: "חומרים איכותיים\nלמראה מושלם", en: "Quality materials\nfor a flawless look" },
  heroBadgeLine1: { he: "סטנדרט של", en: "A standard of" },
  heroBadgeLine2: { he: "יוקרה", en: "luxury" },
  heroBadgeLine3: { he: "ותוצאות מושלמות", en: "and flawless results" },

  servicesTitle: { he: "עולם האיפור", en: "Our Services" },
  servicesTitleKicker: { he: "עולם", en: "Our" },
  servicesTitleMain: { he: "האיפור", en: "Services" },
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

  privateCoursesIntro: {
    he: "קורסי הכשרה פרטניים בליווי אישי צמוד, המותאמים לקצב ולרמת הידע שלך.",
    en: "Private training courses with close personal guidance, tailored to your pace and level.",
  },
  pcCourse1Title: { he: "מיקרובליידינג איפור קבוע", en: "Microblading Permanent Makeup" },
  pcCourse1Desc: {
    he: "לימוד מקצועי של טכניקת המיקרובליידינג ליצירת גבות טבעיות ומדויקות, בליווי אישי צעד אחר צעד.",
    en: "Professional training in the microblading technique for natural, precise eyebrows, with personal step-by-step guidance.",
  },
  pcCourse1MethodsLabel: { he: "שלוש שיטות ללימוד:", en: "Three methods taught:" },
  pcCourse1Method1: { he: "שיטת השערה", en: "Hair-stroke method" },
  pcCourse1Method2: { he: "שיטת הפודרה", en: "Powder method" },
  pcCourse1Method3: { he: "השיטה המשולבת", en: "Combined method" },
  pcCourse2Title: { he: "עיצוב גבות", en: "Eyebrow Shaping" },
  pcCourse2Desc: {
    he: "הקניית כלים מקצועיים לעיצוב וחיטוב גבות בהתאמה אישית, מהתאוריה ועד תרגול מעשי.",
    en: "Professional tools for personalized eyebrow shaping and grooming, from theory to hands-on practice.",
  },

  menu: { he: "תפריט", en: "Menu" },
  faq: { he: "שאלות ותשובות", en: "FAQ" },
  healthDeclaration: { he: "הצהרת בריאות", en: "Health Declaration" },
  careInstructions: { he: "הוראות לטיפול", en: "Treatment Instructions" },
  privateCourses: { he: "הדרכת קורסים פרטניים", en: "Private Course Guidance" },
  login: { he: "התחברות", en: "Login" },
  privacyPolicy: { he: "מדיניות פרטיות", en: "Privacy Policy" },
  accessibility: { he: "הצהרת נגישות", en: "Accessibility Statement" },
  termsOfUse: { he: "תנאי שימוש", en: "Terms of Use" },
  comingSoon: { he: "תוכן העמוד יתווסף בקרוב.", en: "Page content coming soon." },

  faq1Question: { he: "כואב לעשות איפור קבוע?", en: "Does permanent makeup hurt?" },
  faq1Answer: {
    he: "לפני הטיפול מורחים קרם הרדמה מקומי, כך שברוב המקרים מרגישים אי-נוחות קלה בלבד ולא כאב ממשי.",
    en: "A topical numbing cream is applied before the treatment, so most clients feel only mild discomfort rather than real pain.",
  },
  faq2Question: { he: "כמה זמן מחזיק איפור קבוע?", en: "How long does permanent makeup last?" },
  faq2Answer: {
    he: "התוצאה נשארת בממוצע 1-3 שנים, בהתאם לסוג העור, החשיפה לשמש והטיפוח היומיומי. מומלץ טאצ'-אפ מדי שנה-שנתיים.",
    en: "Results typically last 1–3 years, depending on skin type, sun exposure and daily care. A touch-up every 1–2 years is recommended.",
  },
  faq3Question: { he: "כמה זמן לוקח תהליך ההחלמה?", en: "How long is the healing process?" },
  faq3Answer: {
    he: "ההחלמה הראשונית אורכת כשבוע עד עשרה ימים. פירוט מלא אפשר למצוא בעמוד הוראות הטיפוח שלנו.",
    en: "Initial healing takes about a week to ten days. Full details are available on our care instructions page.",
  },
  faq4Question: { he: "אפשר לעשות טיפול בהריון או בהנקה?", en: "Can I get treated while pregnant or breastfeeding?" },
  faq4Answer: {
    he: "לא, מטעמי בטיחות איננו מבצעות איפור קבוע במהלך הריון או הנקה.",
    en: "No, for safety reasons we do not perform permanent makeup during pregnancy or breastfeeding.",
  },
  faq5Question: { he: "האם צריך למלא הצהרת בריאות?", en: "Do I need to fill out a health declaration?" },
  faq5Answer: {
    he: "כן, כל לקוחה ממלאת הצהרת בריאות לפני הטיפול הראשון. אפשר למלא אותה מראש בעמוד הצהרת הבריאות שלנו.",
    en: "Yes, every client fills out a health declaration before the first treatment. You can fill it out in advance on our health declaration page.",
  },
  faq6Question: { he: "כמה זמן אורך הטיפול עצמו?", en: "How long does the treatment itself take?" },
  faq6Answer: {
    he: "תלוי בסוג הטיפול - בממוצע בין שעה לשעתיים, כולל ייעוץ ובחירת צורה וצבע.",
    en: "It depends on the treatment type — on average one to two hours, including consultation and shape/color selection.",
  },
  faq7Question: { he: "אפשר להתאפר רגיל אחרי הטיפול?", en: "Can I wear regular makeup after the treatment?" },
  faq7Answer: {
    he: "מומלץ להימנע מאיפור באזור המטופל למשך כשבוע, עד לסיום תהליך ההחלמה הראשוני.",
    en: "It's recommended to avoid makeup on the treated area for about a week, until initial healing is complete.",
  },
  faq8Question: { he: "מה קורה אם אני לא מרוצה מהתוצאה?", en: "What if I'm not happy with the result?" },
  faq8Answer: {
    he: "קובעים פגישת מעקב תוך כמה שבועות לבדיקת התוצאה, ואם צריך מבצעים תיקון קל ללא עלות נוספת.",
    en: "We schedule a follow-up appointment within a few weeks to check the result, and if needed we make a light correction at no extra charge.",
  },
  faq9Question: { he: "אתן מציעות גם קורסים?", en: "Do you also offer courses?" },
  faq9Answer: {
    he: "כן, אנחנו מעבירות קורסי הכשרה מקצועיים למיקרובליידינג ועיצוב גבות. אפשר לקרוא עוד בעמוד הדרכת הקורסים הפרטניים.",
    en: "Yes, we run professional training courses in microblading and eyebrow shaping. Learn more on our private course guidance page.",
  },
  faq10Question: { he: "איך קובעים תור?", en: "How do I book an appointment?" },
  faq10Answer: {
    he: "הכי קל לתאם תור דרך הוואטסאפ שלנו, או בטלפון.",
    en: "The easiest way is to book via our WhatsApp, or by phone.",
  },

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
  adminBadge: { he: "מנהל", en: "Admin" },
  logout: { he: "התנתקות", en: "Log Out" },
  adminDashboardTitle: { he: "אזור ניהול", en: "Admin Area" },
  adminHealthDeclarationsTitle: { he: "הצהרות בריאות שהתקבלו", en: "Received Health Declarations" },
  adminHealthDeclarationsEmpty: { he: "לא התקבלו הצהרות בריאות עדיין.", en: "No health declarations received yet." },
  adminHealthDeclarationsError: { he: "שגיאה בטעינת ההצהרות. נסי לרענן את הדף.", en: "Failed to load declarations. Try refreshing the page." },
  adminUnauthorized: { he: "אין הרשאה לצפות בעמוד זה.", en: "You are not authorized to view this page." },
  adminAnswerYes: { he: "כן", en: "Yes" },
  adminAnswerNo: { he: "לא", en: "No" },
  adminDetailLabel: { he: "פירוט", en: "Details" },
  adminSearchPlaceholder: { he: "חיפוש לפי שם הלקוחה", en: "Search by customer name" },
  adminClearSearch: { he: "ניקוי חיפוש", en: "Clear search" },
  adminNoSearchResults: { he: "לא נמצאו הצהרות בריאות התואמות לחיפוש.", en: "No health declarations match your search." },
  adminLoadMore: { he: "הצג עוד", en: "Show More" },
  adminLoadingMore: { he: "טוען עוד...", en: "Loading more..." },

  locationTitle: { he: "המיקום שלנו", en: "Our Location" },
  locationAddress: { he: "משה רחמילביץ 34, ירושלים", en: "Moshe Rachmilevitz 34, Jerusalem" },
  wazeCta: { he: "Waze", en: "Waze" },

  contactSectionTitle: { he: "צרי קשר", en: "Contact Us" },
  instagramCta: { he: "עקבו באינסטגרם", en: "Follow on Instagram" },
  phoneCta: { he: "התקשרו אלינו", en: "Call Us" },
  allRightsReserved: { he: "כל הזכויות שמורות.", en: "All rights reserved." },
  footerRights: { he: "כל הזכויות שמורות ל-Reut Cosmetics ©", en: "© All rights reserved to Reut Cosmetics" },
  developedBy: { he: "פותח על ידי Codedly", en: "Developed by Codedly" },

  consultationNamePlaceholder: { he: "שם מלא", en: "Full Name" },
  consultationPhonePlaceholder: { he: "טלפון", en: "Phone" },
  consultationServicePlaceholder: { he: "תחום שירות", en: "Service Area" },
  consultationSubmit: { he: "שלחי פרטים", en: "Send Details" },
  consultationNameRequired: { he: "יש למלא שם", en: "Name is required" },
  consultationPhoneRequired: { he: "יש למלא טלפון", en: "Phone is required" },
  consultationPhoneInvalid: { he: "מספר הטלפון אינו תקין", en: "Invalid phone number" },
  consultationWhatsappMessage: {
    he: "שלום, אני",
    en: "Hi, I'm",
  },
  consultationWhatsappPhoneLabel: { he: "טלפון", en: "Phone" },
  consultationWhatsappServiceLabel: { he: "מתעניינת ב", en: "Interested in" },

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

export function LanguageProvider({
  children,
  initialLanguage = "he",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  // The server reads the customer's saved choice from a cookie and renders
  // <html> with it directly (see layout.tsx), so this starts correct on the
  // very first paint — no post-hydration language switch/flash.
  const [language, setLanguageState] = useState<Language>(initialLanguage);

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

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${next}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => dictionary[key][language],
    }),
    [language, setLanguage]
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
