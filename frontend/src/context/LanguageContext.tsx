"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANGUAGE_COOKIE_NAME, type Language } from "@/lib/language";
import { API_BASE_URL, fetchSiteContent } from "@/lib/api";
import type { EditableImageKey, EditableTextKey } from "@/lib/editableContent";

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
  privateCourses: { he: "הדרכת קורסים", en: "Course Guidance" },
  login: { he: "התחברות", en: "Login" },
  privacyPolicy: { he: "מדיניות פרטיות", en: "Privacy Policy" },
  accessibility: { he: "הצהרת נגישות", en: "Accessibility Statement" },
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
  adminBadge: { he: "מנהל", en: "Admin" },
  logout: { he: "התנתקות", en: "Log Out" },
  editModeToggle: { he: "מצב עריכה", en: "Edit Mode" },
  editFieldTitle: { he: "עריכת טקסט", en: "Edit Text" },
  editTextHebrewLabel: { he: "עברית", en: "Hebrew" },
  editTextEnglishLabel: { he: "אנגלית", en: "English" },
  editSave: { he: "שמירה", en: "Save" },
  editSaving: { he: "שומר...", en: "Saving..." },
  editBothFieldsRequired: { he: "יש למלא את שני השדות", en: "Both fields are required" },
  editSessionExpired: { he: "ההתחברות פגה, יש להתחבר מחדש", en: "Your session has expired, please log in again" },
  editGenericError: { he: "אירעה שגיאה. נסי שוב.", en: "Something went wrong. Please try again." },
  editImageTitle: { he: "עריכת תמונה", en: "Edit Image" },
  editImageUploadLabel: { he: "העלאת תמונה חדשה", en: "Upload a new image" },
  editImageInvalidType: {
    he: "יש לבחור קובץ מסוג JPEG, PNG או WebP",
    en: "Please choose a JPEG, PNG or WebP file",
  },
  editImageTooLarge: { he: "התמונה גדולה מדי (עד 15MB)", en: "Image is too large (max 15MB)" },
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
  // Same value in both languages, like wazeCta above — a handle/name/phone
  // number doesn't translate. The link targets (contact.ts's INSTAGRAM_URL
  // / FACEBOOK_URL / PHONE_TEL_URL / whatsappUrl) are separate hardcoded
  // values, not derived from these — editing this text doesn't repoint them.
  instagramHandle: { he: "reut_cosmetics_", en: "reut_cosmetics_" },
  facebookName: { he: "Reut Yakobi", en: "Reut Yakobi" },
  phoneDisplayNumber: { he: "050-998-8848", en: "050-998-8848" },
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

  reviewsTitle: { he: "לקוחות מספרות", en: "Clients Share" },
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

  // ---------- Care instructions page ----------
  careIntroGreeting: { he: "לקוחה יקרה,", en: "Dear client," },
  careIntroLine1: {
    he: "אם את קוראת דף זה כנראה שאת כבר לאחר הטיפול והגבות שלך נראות מושלמות מתמיד.",
    en: "If you're reading this page, you've likely already had your treatment and your brows are looking more perfect than ever.",
  },
  careIntroLine2: {
    he: "בימים הקרובים תצטרכי להקפיד על הוראות חשובות שיעזרו לגבות שלך להחלים בצורה הטובה ביותר.",
    en: "Over the coming days, please follow these important instructions to help your brows heal in the best possible way.",
  },
  careWarningBold: {
    he: "מהיום אסור להרטיב/לשטוף את הגבות למשך חמישה ימים שלמים!",
    en: "As of today, do not wet or wash your brows for five full days!",
  },
  careWarningNote: {
    he: "(איך חופפים? עם ראש אחורנית כמו במספרה, שטיפת פנים מהעיניים ומטה).",
    en: "(How to wash your hair: tilt your head back like at a salon, and wash your face from the eyes down.)",
  },
  careDailyTitle: { he: "טיפול יומי בגבות", en: "Daily Brow Care" },
  careDaily1: {
    he: "ממחר עליך לקחת צמר גפן עם מעט מים פושרים ולסחוט אותו שיהיה רק לח! ולעשות טפיחות עדינות על הגבות.",
    en: "Starting tomorrow, take a cotton pad with a little lukewarm water, wring it out so it's just damp, and gently pat your brows with it.",
  },
  careDaily2: {
    he: "(הרי אסור לשטוף את הגבות למשך חמישה ימים אך עדיין עלינו לנקות את הרקמה).",
    en: "(Since you can't wash your brows for five days, we still need to gently clean the area this way.)",
  },
  careDaily3: {
    he: 'מיד לאחר פעולה זו יש למרוח ממש מעט משחת "בפנטן פלוס" (ממש בקמצנות עם המשחה).',
    en: 'Right after this, apply a very small amount of "Bepanthen Plus" ointment (use it very sparingly).',
  },
  careDaily4: {
    he: "את הפעולה עם המשחה יש לבצע פעם 1 ביום למשך 5 ימים בלבד! (עדיפות בערב שהפנים נקיות).",
    en: "Apply the ointment once a day for 5 days only! (Preferably in the evening, once your face is clean.)",
  },
  careDaily5: {
    he: "(מדגישה שעושים זאת יום אחרי הטיפול, ביום הטיפול לא עושים כלום בגבות).",
    en: "(Note: start this the day after your treatment — do not do anything to your brows on the day of the treatment itself.)",
  },
  careImportantTitle: { he: "חשוב לדעת", en: "Important to Know" },
  careRule1: {
    he: "לא לגרד ו/או לשפשף את הגבות – שפשוף המקום עלול לגרום לנזק! ולגרום לצבע להימרח מתחת לעור.",
    en: "Do not scratch and/or rub your brows — rubbing the area can cause damage and smear the pigment beneath the skin.",
  },
  careRule2: {
    he: "אין להשתמש בתכשירים קוסמטיים כגון – קרמים המכילים חומצות, קרמים הגורמים לקילוף העור, קרמים להבהרה, קרמים לאקנה, פילינג, סבון פנים פעיל באזור הגבות והמצח עד תום התהליך של 2 הטיפולים.",
    en: "Do not use cosmetic products such as acid-based creams, exfoliating creams, skin-lightening creams, acne creams, peels, or active facial soap on the brow and forehead area until both treatments are complete.",
  },
  careRule3: {
    he: "קרם פנים טבעי ללא חומצות – אסור למרוח באזור הגבות מיום הטיפול ועד עשרה הימים הראשונים של ההחלמה (ניתן למרוח מאזור העיניים ומטה). לאחר עשרה ימים מותר.",
    en: "Natural, acid-free face cream — do not apply to the brow area from the day of treatment through the first ten days of healing (you may apply it from the eye area down). After ten days it's permitted.",
  },
  careRule4: {
    he: "טיפול פנים ניתן לעשות רק חודש לאחר הטיפול השני.",
    en: "A facial treatment may only be done one month after the second session.",
  },
  careRule5: {
    he: "אסור לאפר את אזור הגבות כולל המצח למשך 7 ימים, רק לאחר 7 ימים מותר לאפר!",
    en: "Do not apply makeup to the brow area, including the forehead, for 7 days — makeup is only permitted after 7 days!",
  },
  careRule6: {
    he: "אין לבצע כל פעילות ספורטיבית למשך שבוע שלם! כן, אסור גם אם לא מזיעים בה.",
    en: "Do not do any physical exercise for a full week! Yes, this applies even to activities that don't make you sweat.",
  },
  careRule7: {
    he: "אסור ים / בריכה / סאונה / ג'קוזי שבעה ימים הראשונים.",
    en: "No sea, pool, sauna, or jacuzzi for the first seven days.",
  },
  careRule8: {
    he: "מומלץ לא להיחשף לשמש באזור הגבות! יש לשמור עליהן על מנת שלא ידהה הצבע במהירות. כמו כן שימוש בקרם הגנה מותר רק עשרה ימים לאחר הטיפול, על מנת שלא יימרח קרם הגנה על עור פתוח!",
    en: "It's recommended to avoid sun exposure on the brow area — protect them so the color doesn't fade quickly. Sunscreen may only be used starting ten days after treatment, so it isn't applied to open skin.",
  },
  careHealingTitle: { he: "תהליך ההחלמה", en: "The Healing Process" },
  careHealing1: { he: "יקרה שלי,", en: "My dear," },
  careHealing2: { he: "היום הגבה נראית מושלמת!", en: "Today your brow looks perfect!" },
  careHealing3: {
    he: "ממחר הגבה מתחילה להתכהות מאוד! לא להיבהל, זהו תהליך נורמלי של הגלדה!",
    en: "Starting tomorrow, the brow will begin to darken significantly! Don't worry — this is a normal part of the scabbing process!",
  },
  careHealing4: {
    he: "בין חמישה ימים לשבועיים הגבה מתחילה להתקלף!",
    en: "Between five days and two weeks, the brow will start to flake!",
  },
  careHealing5: {
    he: "מה קורה אחרי הקילוף? בקושי יישאר משהו מהטיפול הראשון! 90 אחוז מהצבע פשוט יורד ונדחה מהעור! לא תישאר הצורה / הסימטריה / הפיגמנט שנעשה עבורך במעמד הטיפול הראשון, אין תוצאה מושלמת אחרי טיפול אחד בלבד, וזו הסיבה שכל התהליך מורכב משני טיפולים!",
    en: "What happens after the flaking? Barely anything will remain from the first treatment! About 90% of the pigment simply fades and is shed by the skin! The shape, symmetry, and pigment created in the first session won't fully remain — there's no perfect result after just one treatment alone, which is exactly why the full process consists of two sessions!",
  },
  careHealingImageAlt: { he: "תהליך ההחלמה של הגבות לפי ימים", en: "The eyebrow healing process by day" },
  careContactIntro: { he: "לכל שאלה אני כאן בשבילך בטלפון:", en: "For any question, I'm here for you by phone:" },
  carePhoneNumber: { he: "050-9988848", en: "050-9988848" },
  careSignoff: { he: "באהבה,", en: "With love," },
  careSignoffName: { he: "רעות יעקובי ♥", en: "Reut Yakobi ♥" },

  // ---------- Shared legal-page contact line labels ----------
  legalPhoneLabel: { he: "טלפון:", en: "Phone:" },
  legalWhatsappLabel: { he: "WhatsApp:", en: "WhatsApp:" },

  // ---------- Privacy policy page ----------
  ppGeneralTitle: { he: "כללי", en: "General" },
  ppGeneralText: {
    he: "Reut Cosmetics מכבדת את פרטיותך. מדיניות זו מסבירה אילו נתונים אנו אוספות, לשם מה, וכיצד הם נשמרים ומאובטחים. השימוש באתר ובשירותים מהווה הסכמה לתנאי מדיניות זו.",
    en: "Reut Cosmetics respects your privacy. This policy explains what data we collect, why, and how it is stored and secured. Using the site and its services constitutes agreement to the terms of this policy.",
  },
  ppDataCollectedTitle: { he: "המידע שאנו אוספות", en: "Information We Collect" },
  ppDataItem1: {
    he: "ביקורות: שם, דירוג וטקסט הביקורת, מוצגים באופן פומבי בעמוד הביקורות באתר.",
    en: "Reviews: name, rating, and review text, displayed publicly on the site's reviews page.",
  },
  ppDataItem2: {
    he: "הצהרת בריאות: שם מלא, מספר תעודת זהות, מספר טלפון ותשובות לשאלון הבריאות, נאספים לצורך בדיקת התאמה ובטיחות לפני טיפול.",
    en: "Health declaration: full name, ID number, phone number, and answers to the health questionnaire, collected to assess suitability and safety before treatment.",
  },
  ppDataItem3: {
    he: 'פניית "צרי קשר": שם, מספר טלפון ותחום השירות המבוקש, נשלחים ישירות בהודעת WhatsApp ואינם נשמרים בשרתי האתר.',
    en: 'A "Contact Us" inquiry: name, phone number, and the requested service area, sent directly as a WhatsApp message and not stored on the site\'s servers.',
  },
  ppDataItem4: {
    he: "העדפת שפה: נשמרת בעוגייה (cookie) במכשיר שלך, לצורך הצגת האתר בשפה שבחרת בביקור הבא.",
    en: "Language preference: stored in a cookie on your device, so the site displays in the language you chose on your next visit.",
  },
  ppDataItem5: {
    he: "פרטי התחברות מנהלת: אימייל וסיסמה, לשימוש צוות האתר בלבד.",
    en: "Admin login details: email and password, for use by the site team only.",
  },
  ppSensitiveTitle: { he: "מידע רגיש, הצהרת בריאות", en: "Sensitive Information — Health Declaration" },
  ppSensitiveIntro: {
    he: 'פרטי הצהרת הבריאות (לרבות תעודת הזהות ותשובות שאלון הבריאות) מהווים "מידע רגיש" כהגדרתו בחוק הגנת הפרטיות, התשמ"א-1981 (לרבות תיקון 13 לחוק). בהתאם לכך:',
    en: 'The health declaration details (including the ID number and health questionnaire answers) constitute "sensitive information" as defined by the Israeli Privacy Protection Law, 5741-1981 (including Amendment 13). Accordingly:',
  },
  ppSensitiveItem1: {
    he: "המידע מוצפן (AES-256) באחסון, כך שגם גישה ישירה לקובצי הנתונים אינה חושפת אותו כטקסט גלוי.",
    en: "The information is encrypted (AES-256) at rest, so that even direct access to the data files does not expose it as plain text.",
  },
  ppSensitiveItem2: {
    he: "הגישה למידע מוגבלת לצוות מורשה בלבד, באמצעות התחברות מאובטחת.",
    en: "Access to the information is limited to authorized staff only, via secure login.",
  },
  ppSensitiveItem3: {
    he: "המידע נמחק אוטומטית 7 שנים לאחר מועד המסירה.",
    en: "The information is automatically deleted 7 years after the date it was submitted.",
  },
  ppSensitiveItem4: {
    he: "קיימת הגבלת קצב על שליחת טפסים כדי למנוע ניצול לרעה של המערכת.",
    en: "Form submissions are rate-limited to prevent abuse of the system.",
  },
  ppUsageTitle: { he: "כיצד אנו משתמשות במידע", en: "How We Use the Information" },
  ppUsageText: {
    he: "אנו משתמשות במידע אך ורק למטרה שלשמה נאסף: בדיקת התאמה ובטיחות לפני טיפול, מענה לפניות, תיאום שירות והצגת ביקורות לקוחות. אנו לא מוכרות, משכירות או משתפות את המידע האישי שלך עם צדדים שלישיים למטרות שיווק.",
    en: "We use the information solely for the purpose for which it was collected: assessing suitability and safety before treatment, responding to inquiries, coordinating service, and displaying customer reviews. We do not sell, rent, or share your personal information with third parties for marketing purposes.",
  },
  ppSharingTitle: { he: "שיתוף עם צדדים שלישיים", en: "Sharing With Third Parties" },
  ppSharingText: {
    he: 'פנייה דרך טופס "צרי קשר" נשלחת כהודעת WhatsApp ישירות למספר העסק; מרגע השליחה חלה עליה מדיניות הפרטיות של WhatsApp/Meta. מלבד זאת, אין אנו משתפות מידע אישי עם גורמים חיצוניים, למעט כאשר הדבר נדרש על פי דין.',
    en: 'An inquiry sent via the "Contact Us" form is delivered as a WhatsApp message directly to the business\'s number; from the moment it is sent, it becomes subject to WhatsApp/Meta\'s own privacy policy. Beyond that, we do not share personal information with external parties, except where required by law.',
  },
  ppSecurityTitle: { he: "אבטחת מידע", en: "Data Security" },
  ppSecurityText: {
    he: "אנו נוקטות באמצעי אבטחה טכניים וארגוניים סבירים להגנה על המידע שנמסר לנו, לרבות הצפנת מידע רגיש והגבלת קצב שליחת טפסים. יחד עם זאת, אין אפשרות להבטיח אבטחה מוחלטת של מידע המועבר או מאוחסן באופן דיגיטלי.",
    en: "We take reasonable technical and organizational security measures to protect the information provided to us, including encrypting sensitive information and rate-limiting form submissions. That said, absolute security of information transmitted or stored digitally can never be fully guaranteed.",
  },
  ppCookiesTitle: { he: "עוגיות (Cookies)", en: "Cookies" },
  ppCookiesText: {
    he: "האתר משתמש בעוגייה אחת בלבד, לשמירת העדפת השפה שבחרת. איננו משתמשות בעוגיות מעקב, פרסום או ניתוח שימוש.",
    en: "The site uses a single cookie, to remember your chosen language preference. We do not use tracking, advertising, or usage-analytics cookies.",
  },
  ppRightsTitle: { he: "הזכויות שלך", en: "Your Rights" },
  ppRightsText: {
    he: "בהתאם לחוק הגנת הפרטיות, את/ה רשאי/ת לפנות אלינו בבקשה לעיין במידע שנשמר עליך, לתקן אותו או לבקש את מחיקתו (בכפוף לכל דין המחייב שמירתו, כגון הוראות רפואיות). נשמח לטפל בכל פנייה בהקדם.",
    en: "In accordance with the Privacy Protection Law, you are entitled to contact us to request to review the information held about you, correct it, or request its deletion (subject to any legal requirement to retain it, such as medical record-keeping rules). We will be glad to handle any request promptly.",
  },
  ppContactTitle: { he: "יצירת קשר בנושא פרטיות", en: "Contact Us About Privacy" },
  ppContactIntro: {
    he: "לכל שאלה או בקשה הנוגעת למדיניות זו ולמידע האישי שלך, ניתן לפנות אלינו:",
    en: "For any question or request regarding this policy or your personal information, you can reach us at:",
  },
  ppUpdatesTitle: { he: "עדכוני מדיניות", en: "Policy Updates" },
  ppUpdatesText: {
    he: "מדיניות זו עשויה להתעדכן מעת לעת. המשך השימוש באתר לאחר עדכון מהווה הסכמה לתנאים המעודכנים.",
    en: "This policy may be updated from time to time. Continued use of the site after an update constitutes agreement to the updated terms.",
  },
  ppLastUpdated: {
    he: "מדיניות פרטיות זו עודכנה לאחרונה בתאריך 25.08.2026.",
    en: "This privacy policy was last updated on 25.08.2026.",
  },

  // ---------- Terms of use page ----------
  touGeneralTitle: { he: "כללי", en: "General" },
  touGeneralText: {
    he: "תנאי שימוש אלו חלים על כל שימוש באתר Reut Cosmetics ובשירותים המוצעים בו. גלישה באתר, שימוש בטפסים או הזמנת שירות מהווים הסכמה לתנאים אלו במלואם.",
    en: "These terms of use apply to all use of the Reut Cosmetics site and the services it offers. Browsing the site, using its forms, or booking a service constitutes full agreement to these terms.",
  },
  touServicesTitle: { he: "השירותים המוצעים", en: "Services Offered" },
  touServicesText: {
    he: "Reut Cosmetics מציעה טיפולי איפור קבוע (מיקרובליידינג) והדרכת קורסים בתחום. האתר מספק מידע על השירותים, אפשרות ליצירת קשר ותיאום, ומרחב להצגת ביקורות לקוחות.",
    en: "Reut Cosmetics offers permanent makeup treatments (microblading) and training courses in the field. The site provides information about the services, a way to get in touch and schedule, and a space to display customer reviews.",
  },
  touHealthTitle: { he: "הצהרת בריאות", en: "Health Declaration" },
  touHealthText: {
    he: "לפני קבלת טיפול נדרשת מילוי הצהרת בריאות מלאה ואמיתית. מסירת מידע חלקי או לא מדויק עלולה לפגוע בתוצאה הסופית ואף לסכן את בריאות הלקוחה, והאחריות לכך תחול על הלקוחה בלבד.",
    en: "Before receiving treatment, you are required to complete a full and truthful health declaration. Providing partial or inaccurate information may harm the final result and even endanger the client's health, and responsibility for this rests solely with the client.",
  },
  touPaymentTitle: { he: "תנאי תשלום, ביטולים והחזרים", en: "Payment, Cancellation, and Refund Terms" },
  touPayment1: {
    he: 'התמורה הכספית (להלן: "שכר טרחה") מזכה בשני טיפולים בלבד. כל טיפול נוסף מעבר לכך יהיה בתשלום.',
    en: 'The payment (hereinafter: "the fee") entitles the client to two treatments only. Any additional treatment beyond that will be charged separately.',
  },
  touPayment2: {
    he: "יש לשלם מראש את מלוא המחיר עבור שני הטיפולים.",
    en: "The full price for both treatments must be paid in advance.",
  },
  touPayment3: {
    he: "לא תתאפשר החזרת כספים לאחר תחילת הטיפול הראשון, גם אם בוצע רק חלקית.",
    en: "No refunds will be given once the first treatment has begun, even if it was only partially performed.",
  },
  touPayment4: {
    he: 'הצבע המתקבל תלוי בפיגמנט העור ומשתנה מאדם לאדם. במקרים בהם הצבע נדחה על ידי העור, ייתכן צורך בטיפול נוסף בתשלום (להלן: "טיפול שלישי").',
    en: 'The resulting color depends on the client\'s skin pigment and varies from person to person. In cases where the color is rejected by the skin, an additional paid treatment may be required (hereinafter: "the third treatment").',
  },
  touPayment5: {
    he: "יש להגיע לטיפול השני במועד שייקבע. אי הגעה בטווח של עד חודשיים עלולה לפגוע בתוצאה הסופית, והאחריות לכך לא תחול על המטפלת.",
    en: "The client must arrive for the second treatment on the scheduled date. Failing to attend within two months may harm the final result, and responsibility for this will not fall on the practitioner.",
  },
  touPayment6: {
    he: "המטפלת אינה מחויבת לקבל לקוחה לטיפול מעבר למועד המיועד והנכון לכך.",
    en: "The practitioner is not obligated to accept a client for treatment beyond the date designated and appropriate for it.",
  },
  touReviewsTitle: { he: "ביקורות לקוחות", en: "Customer Reviews" },
  touReviewsText: {
    he: "ביקורות המתפרסמות באתר משקפות את דעתן האישית של הלקוחות ואינן מבוטאות את עמדת Reut Cosmetics. לקוחה רשאית לערוך ביקורת שפרסמה בתוך 15 דקות ממועד הפרסום. אנו שומרות לעצמנו את הזכות להסיר ביקורות הכוללות תוכן פוגעני, מטעה או שאינו הולם.",
    en: "Reviews published on the site reflect the personal opinions of customers and do not represent the position of Reut Cosmetics. A customer may edit a review she posted within 15 minutes of publishing it. We reserve the right to remove reviews containing offensive, misleading, or inappropriate content.",
  },
  touIpTitle: { he: "קניין רוחני", en: "Intellectual Property" },
  touIpText: {
    he: "כל הזכויות בתכני האתר, לרבות טקסטים, תמונות, עיצוב ולוגו, שייכות ל-Reut Cosmetics. אין להעתיק, להפיץ או לעשות שימוש בתכני האתר ללא אישור מראש ובכתב.",
    en: "All rights to the site's content, including text, images, design, and logo, belong to Reut Cosmetics. The site's content may not be copied, distributed, or used without prior written permission.",
  },
  touLiabilityTitle: { he: "הגבלת אחריות", en: "Limitation of Liability" },
  touLiabilityText: {
    he: "הטיפולים המוצעים הינם אינדיבידואליים ותוצאותיהם משתנות מאדם לאדם בהתאם לסוג העור ולגורמים נוספים; אין באתר או בתיאום טיפול משום התחייבות לתוצאה מסוימת. Reut Cosmetics אינה אחראית לתכנים חיצוניים המוטמעים באתר (כגון מפת Google Maps) ואינה נושאת באחריות לנזק עקיף שייגרם כתוצאה משימוש באתר.",
    en: "The treatments offered are individual, and their results vary from person to person depending on skin type and other factors; neither the site nor scheduling a treatment constitutes a commitment to any particular result. Reut Cosmetics is not responsible for external content embedded in the site (such as the Google Maps map) and bears no liability for indirect damage arising from use of the site.",
  },
  touChangesTitle: { he: "שינויים בתנאים", en: "Changes to These Terms" },
  touChangesText: {
    he: "Reut Cosmetics רשאית לעדכן תנאים אלו מעת לעת. המשך השימוש באתר לאחר פרסום עדכון מהווה הסכמה לתנאים המעודכנים.",
    en: "Reut Cosmetics may update these terms from time to time. Continued use of the site after an update is published constitutes agreement to the updated terms.",
  },
  touJurisdictionTitle: { he: "דין וסמכות שיפוט", en: "Governing Law and Jurisdiction" },
  touJurisdictionText: {
    he: "על תנאים אלו יחולו דיני מדינת ישראל בלבד, וסמכות השיפוט הבלעדית בכל עניין הנוגע להם תהא נתונה לבתי המשפט המוסמכים בירושלים.",
    en: "These terms are governed solely by the laws of the State of Israel, and exclusive jurisdiction over any matter relating to them shall rest with the competent courts in Jerusalem.",
  },
  touContactTitle: { he: "יצירת קשר", en: "Contact Us" },
  touContactIntro: {
    he: "לכל שאלה בנוגע לתנאי השימוש ניתן לפנות אלינו:",
    en: "For any question regarding these terms of use, you can reach us at:",
  },
  touLastUpdated: {
    he: "תנאי שימוש אלו עודכנו לאחרונה בתאריך 25.08.2026.",
    en: "These terms of use were last updated on 25.08.2026.",
  },

  // ---------- Accessibility statement page ----------
  asCommitmentTitle: { he: "מחויבות לנגישות", en: "Accessibility Commitment" },
  asCommitmentText: {
    he: 'אנו ב-Reut Cosmetics רואות חשיבות רבה במתן שירות שוויוני ונגיש לכלל הלקוחות, לרבות אנשים עם מוגבלות. אנו פועלות להנגשת האתר בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.',
    en: "At Reut Cosmetics, we place great importance on providing equal and accessible service to all customers, including people with disabilities. We work to make the site accessible in accordance with the Equal Rights for Persons with Disabilities Law, 5758-1998, and the Equal Rights for Persons with Disabilities Regulations (Service Accessibility Adjustments), 5773-2013.",
  },
  asMeasuresTitle: { he: "התאמות הנגישות באתר", en: "Accessibility Measures on the Site" },
  asMeasure1: {
    he: "מבנה סמנטי של הדף (כותרות, אזורי ניווט ותוכן) לתמיכה בקוראי מסך.",
    en: "Semantic page structure (headings, navigation and content regions) to support screen readers.",
  },
  asMeasure2: {
    he: "טקסט חלופי (alt) לתמונות משמעותיות באתר.",
    en: "Alternative text (alt) for meaningful images on the site.",
  },
  asMeasure3: {
    he: "אפשרות ניווט וסגירת תפריטים באמצעות מקלדת (כולל מקש Escape בתפריט הצד).",
    en: "Keyboard navigation and the ability to close menus via keyboard (including the Escape key in the side menu).",
  },
  asMeasure4: {
    he: "ניגודיות צבעים נבדקת בין טקסט לרקע בהתאם לעיצוב האתר.",
    en: "Color contrast between text and background is checked in line with the site's design.",
  },
  asMeasure5: {
    he: "תפריט נגישות צף המאפשר הגדלת טקסט, ניגודיות גבוהה, עצירת אנימציות, הדגשת קישורים, גופן קריא וגווני אפור.",
    en: "A floating accessibility menu that allows enlarging text, high contrast, stopping animations, underlining links, a readable font, and grayscale mode.",
  },
  asLevelTitle: { he: "רמת הנגישות", en: "Accessibility Level" },
  asLevelText: {
    he: "האתר נבנה מתוך כוונה לעמוד בדרישות תקן ישראלי 5568, בהתאם להנחיות הנגישות לתכנים באינטרנט WCAG 2.0 ברמה AA. ההצהרה מבוססת על בדיקה עצמית ואינה מהווה אישור ממבדק נגישות מוסמך.",
    en: "The site was built with the intention of meeting the requirements of Israeli Standard 5568, in line with the Web Content Accessibility Guidelines WCAG 2.0 level AA. This statement is based on a self-assessment and does not constitute certification from an accredited accessibility auditor.",
  },
  asLimitationsTitle: { he: "מגבלות ידועות", en: "Known Limitations" },
  asLimitationsText: {
    he: "ייתכן שחלקים מסוימים באתר טרם הונגשו במלואם, ובכלל זה תכנים חיצוניים המוטמעים באתר (כגון מפת Google Maps) שאינם בשליטתנו המלאה. אנו ממשיכות לפעול לשיפור מתמיד של הנגישות באתר.",
    en: "Some parts of the site may not yet be fully accessible, including external content embedded in the site (such as the Google Maps map) that is not entirely within our control. We continue to work on ongoing improvement of the site's accessibility.",
  },
  asContactTitle: { he: "פנייה בנושא נגישות", en: "Accessibility Inquiries" },
  asContactIntro: {
    he: "נתקלת בבעיית נגישות באתר? נשמח שתפני אלינו ונטפל בפנייתך בהקדם:",
    en: "Encountered an accessibility issue on the site? We'd be glad for you to reach out, and we'll handle your inquiry promptly:",
  },
  asCoordinatorLabel: { he: "רכזת הנגישות:", en: "Accessibility Coordinator:" },
  asCoordinatorName: { he: "Codedly", en: "Codedly" },
  asCoordinatorPhone: { he: "052-222-5834", en: "052-222-5834" },
  asEmailLabel: { he: "אימייל:", en: "Email:" },
  asCoordinatorEmail: { he: "codedly.il@gmail.com", en: "codedly.il@gmail.com" },
  asComplaintsTitle: { he: "פנייה לנציבות שוויון זכויות", en: "Contacting the Commission for Equal Rights" },
  asComplaintsText: {
    he: "במידה שלא קיבלת מענה מספק לפנייתך, ניתן לפנות לנציבות שוויון זכויות לאנשים עם מוגבלות במשרד המשפטים.",
    en: "If you did not receive a satisfactory response to your inquiry, you may contact the Commission for Equal Rights of Persons with Disabilities at the Ministry of Justice.",
  },
  asLastUpdated: {
    he: "הצהרת נגישות זו עודכנה לאחרונה בתאריך 25.08.2026.",
    en: "This accessibility statement was last updated on 25.08.2026.",
  },

  // ---------- Health declaration page (substantive content only — field
  // validation errors are intentionally left untranslated/non-editable,
  // same as every other form in this app) ----------
  hdPersonalTitle: { he: "פרטים אישיים", en: "Personal Details" },
  hdFullNameLabel: { he: "שם מלא", en: "Full Name" },
  hdIdNumberLabel: { he: "מספר תעודת זהות", en: "ID Number" },
  hdPhoneLabel: { he: "מספר טלפון", en: "Phone Number" },
  hdQuestionnaireTitle: { he: "שאלון בריאות", en: "Health Questionnaire" },
  hdQ1: {
    he: "האם הינך רגישה לתכשירים קוסמטיים (אלרגיות למשחות/תרופות/חומרים כלשהם)?",
    en: "Are you sensitive to cosmetic products (allergies to ointments/medications/any substances)?",
  },
  hdQ2: {
    he: "האם הינך סובלת ממחלת עור/גירוי פצע באזור המיועד לטיפול?",
    en: "Do you suffer from a skin condition or wound irritation in the area intended for treatment?",
  },
  hdQ3: {
    he: "האם הינך סובלת מריפוי איטי של פצעים/הצטלקותם?",
    en: "Do you suffer from slow wound healing or scarring?",
  },
  hdQ4: { he: "האם הינך בהריון?", en: "Are you pregnant?" },
  hdQ5: {
    he: "האם הינך נוטלת תרופות באופן קבוע ו/או כדורים לדילול דם?",
    en: "Do you regularly take medication and/or blood-thinning pills?",
  },
  hdQ6: {
    he: "האם הינך כעת תחת השפעת אלכוהול/סמים/סמים עם מרשם רופא?",
    en: "Are you currently under the influence of alcohol, drugs, or prescription medication?",
  },
  hdQ7: { he: "האם קיים אצלך חוסר באנזים (G6PD)?", en: "Do you have a G6PD enzyme deficiency?" },
  hdQ8: {
    he: "האם הינך סובלת ממחלת עור מסוג סבוריאה/אקזמה/פסוריאזיס במקום המיועד לטיפול?",
    en: "Do you suffer from a skin condition such as seborrhea, eczema, or psoriasis at the site intended for treatment?",
  },
  hdQ9: { he: "האם הינך נוטלת כדורים מסוג רקוטאן?", en: "Are you taking Roaccutane-type medication?" },
  hdQ10: {
    he: "האם הינך לוקחת הורמונים באופן קבוע או בזמן טיפול פוריות IVF?",
    en: "Are you regularly taking hormones, or currently undergoing IVF fertility treatment?",
  },
  healthFormYes: { he: "כן", en: "Yes" },
  healthFormNo: { he: "לא", en: "No" },
  hdDetailLabel: { he: "אנא פרטי", en: "Please specify" },
  hdConfirmationText: {
    he: "אני מאשרת שכל תשובותיי בהצהרת הבריאות נכונות ומלאות",
    en: "I confirm that all my answers in the health declaration are true and complete",
  },
  hdAgreementTitle: { he: "הסכם", en: "Agreement" },
  hdAgreementIntro: { he: "ידוע לי כי:", en: "I understand that:" },
  hdAgreement1: {
    he: "ידוע לי כי חובת המטפלת להראות לי את הצורה המתאימה לי בהתאם לתווי הפנים שלי על ידי שימוש בשבלונה/סרגל או כל כלי עזר שברשותה. רק לאחר שראיתי והסכמתי, המטפלת תחל בעבודתה. כמו כן מובן לי שלא יהיה ניתן לעשות כל שינוי בצורה לאחר תחילת העבודה.",
    en: "I understand that the practitioner is required to show me the shape suited to my facial features, using a stencil, ruler, or any tool she has available. Only after I have seen and agreed to it will the practitioner begin her work. I also understand that no change to the shape will be possible once work has begun.",
  },
  hdAgreement2: {
    he: 'ידוע לי כי הצבע המתקבל תלוי בפיגמנט העור שלי ולכן זה שונה מאדם לאדם. לפיכך ידועה לי העובדה כי במקרים מסוימים הצבע עלול להידחות על ידי העור שלי ואתבקש להגיע לטיפול נוסף בתשלום (להלן: "טיפול שלישי").',
    en: 'I understand that the resulting color depends on my skin pigment and therefore differs from person to person. I am accordingly aware that in some cases the color may be rejected by my skin, and I may be asked to come in for an additional paid treatment (hereinafter: "the third treatment").',
  },
  hdAgreement3: {
    he: 'ידוע לי כי בעבור התמורה הכספית (להלן: "שכר טרחה") אקבל שני טיפולים בלבד. כל טיפול מעבר לכך יהיה בתשלום.',
    en: 'I understand that in exchange for the payment (hereinafter: "the fee") I will receive two treatments only. Any treatment beyond that will be charged separately.',
  },
  hdAgreement4: {
    he: "ידוע לי כי אין אחריות על קליטת הפיגמנט בעור והליך המיקרובליידינג הינו אינדיבידואלי ומשתנה מאדם לאדם (סוגי העור שונים וכיוצא בזה).",
    en: "I understand that there is no guarantee regarding how the skin absorbs the pigment, and that the microblading procedure is individual and varies from person to person (different skin types, and so on).",
  },
  hdAgreement5: {
    he: "ידוע לי כי לא תתאפשר החזרת כספים לאחר תחילת הטיפול הראשון, גם אם בוצע רק חלקית.",
    en: "I understand that no refund will be given once the first treatment has begun, even if it was only partially performed.",
  },
  hdAgreement6: {
    he: "אני מבינה את חשיבות מסירת כל המידע הנוגע לי לפני תחילת העבודה וברור לי שהסתרת כל מידע רלוונטי הנוגע אלי עלול לפגוע בתוצאה הסופית ואף לסכן את בריאותי.",
    en: "I understand the importance of disclosing all information relevant to me before work begins, and I understand that withholding any relevant information about myself may harm the final result and even endanger my health.",
  },
  hdAgreement7: {
    he: 'אני מבינה את חשיבות "דף ההוראות לטיפול בעור לאחר איפור קבוע" שאקבל בסיום הטיפול ואי התייחסותי אליו ואי ביצוע ההוראות שרשומות עלול לפגוע בתהליך הכולל של האיפור הקבוע.',
    en: 'I understand the importance of the "skin aftercare instructions for permanent makeup" sheet I will receive at the end of the treatment, and that disregarding it or not following the instructions listed may harm the overall permanent makeup process.',
  },
  hdAgreement8: {
    he: "ידוע לי כי עליי להגיע לטיפול השני במועד שייקבע לי, וכי אי הגעה לטיפול בטווח של עד חודשיים עלולה לפגוע בתוצאה הסופית הרצויה, כאשר האחריות לכך לא תחול על המטפלת.",
    en: "I understand that I must arrive for the second treatment on the date set for me, and that failing to attend within two months may harm the desired final result, with responsibility for this not falling on the practitioner.",
  },
  hdAgreement9: {
    he: "כמו כן ידוע לי כי המטפלת לא תהיה חייבת לקבל אותי לטיפול מעבר למועד המיועד והנכון לכך.",
    en: "I also understand that the practitioner will not be obligated to accept me for treatment beyond the date designated and appropriate for it.",
  },
  hdAgreement10: {
    he: "על הלקוחה לשלם מראש את מלוא המחיר עבור שני הטיפולים.",
    en: "The client must pay the full price for both treatments in advance.",
  },
  hdAgreementCheckboxText: {
    he: "אני מאשרת שקראתי ואני מסכימה להסכם זה",
    en: "I confirm that I have read and agree to this agreement",
  },
  hdSubmit: { he: "שליחת הטופס", en: "Submit Form" },
  hdSuccessTitle: { he: "הטופס נשלח בהצלחה", en: "Form Submitted Successfully" },
  hdSuccessText: {
    he: "תודה שמילאת את הצהרת הבריאות. הפרטים התקבלו אצלנו.",
    en: "Thank you for completing the health declaration. Your details have been received.",
  },

  // ---------- Site brand name (nav bar + footer, shared) ----------
  // Same value in both languages — a brand name doesn't translate. Stored
  // in the already-uppercase form: the nav bar's own CSS uppercases it a
  // second time (a harmless no-op), but the footer's does not, so this is
  // the one casing that renders correctly in both places.
  brandNameMain: { he: "Reut", en: "Reut" },
  brandNameSub: { he: "COSMETICS", en: "COSMETICS" },

  // ---------- FAQ admin add/edit/delete UI (not admin-editable content
  // itself — chrome for the tool, same category as editSave/editModeToggle) ----------
  faqAddButton: { he: "הוספת שאלה", en: "Add Question" },
  faqEditTitle: { he: "עריכת שאלה", en: "Edit Question" },
  faqQuestionSectionLabel: { he: "שאלה", en: "Question" },
  faqAnswerSectionLabel: { he: "תשובה", en: "Answer" },
  faqDeleteButton: { he: "מחיקת שאלה", en: "Delete question" },
  faqDeleteConfirm: { he: "למחוק את השאלה הזו?", en: "Delete this question?" },
  faqValidationError: {
    he: "יש למלא שאלה ותשובה בשתי השפות",
    en: "Please fill in the question and answer in both languages",
  },
  faqLoadError: { he: "לא ניתן לטעון שאלות כרגע.", en: "Unable to load questions right now." },

  // ---------- Service detail modals (permanent makeup, bridal/evening, facial waxing) ----------
  service1Detail: {
    he: "איפור קבוע (מיקרובליידינג) הוא טיפול קוסמטי מתקדם ליצירת גבות, אייליינר או שפתיים בעלי מראה טבעי ומדויק, המחזיק לאורך זמן. הטיפול נעשה בשתי פגישות: באחת בונים את הצורה והצבע המדויקים לפנייך, ובשנייה, כחודש לאחר מכן, מבצעים תיקון עדין להשלמת התוצאה. לפני כל טיפול מתקיים ייעוץ אישי לבחירת הצורה, הגוון והטכניקה המתאימים ביותר לתווי הפנים ולסגנון שלך.",
    en: "Permanent makeup (microblading) is an advanced cosmetic treatment that creates natural-looking, long-lasting brows, eyeliner, or lips. The treatment is done in two sessions: the first builds the exact shape and color for your face, and the second — about a month later — makes gentle adjustments to complete the result. Every treatment begins with a personal consultation to choose the shape, tone, and technique best suited to your features and style.",
  },
  service2Detail: {
    he: "איפור כלות וערב מותאם אישית לאירוע שלך — חתונה, אירוסין, נשף או כל ערב מיוחד. האיפור נבנה בהתאמה למראה, לשמלה ולתאורת האירוע, כך שיחזיק לאורך כל הערב ויצולם בצורה מושלמת. ניתן לתאם פגישת ניסיון מראש כדי לוודא שהתוצאה בדיוק כפי שדמיינת, ולהגיע ליום הגדול רגועה ובטוחה.",
    en: "Bridal and evening makeup is fully personalized for your event — a wedding, engagement, gala, or any special evening. The look is tailored to your appearance, outfit, and the event's lighting, so it lasts all night and photographs beautifully. A trial session can be scheduled in advance to make sure the result is exactly as you imagined, so you arrive at your big day calm and confident.",
  },
  service4Detail: {
    he: "שעווה בפנים היא שיטה עדינה ומדויקת להסרת שיער עודף באזור הפנים, המשאירה את העור חלק ונקי לאורך זמן ממושך יותר בהשוואה לשיטות אחרות. הטיפול מתאים לגבות, שפה עליונה, סנטר ולחיים, ומבוצע תוך הקפדה על נוחות ועדינות כלפי העור הרגיש של הפנים.",
    en: "Facial waxing is a gentle, precise method for removing unwanted hair from the face, leaving skin smooth and clear for longer than many other methods. The treatment suits brows, upper lip, chin, and cheeks, and is performed with careful attention to comfort and to the delicate skin of the face.",
  },
};

export type TranslationKey = keyof typeof dictionary;

type TextOverrides = Partial<Record<TranslationKey, { he: string; en: string }>>;
type ImageOverrides = Partial<Record<EditableImageKey, string>>;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  getTextPair: (key: EditableTextKey) => { he: string; en: string };
  getImageUrl: (key: EditableImageKey) => string | undefined;
  applyTextOverride: (key: EditableTextKey, he: string, en: string) => void;
  applyImageOverride: (key: EditableImageKey, url: string) => void;
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
  const [textOverrides, setTextOverrides] = useState<TextOverrides>({});
  const [imageOverrides, setImageOverrides] = useState<ImageOverrides>({});

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

  // Admin-edited content layers on top of the static defaults above once
  // loaded. Production is a static export with no server behind it, so this
  // is the only way edited content can ever reach a visitor. A fetch
  // failure (backend unreachable) just leaves both maps empty, which falls
  // back to the fully static site exactly as it behaved before this existed.
  useEffect(() => {
    fetchSiteContent()
      .then((content) => {
        setTextOverrides(content.text as TextOverrides);
        setImageOverrides(content.images as ImageOverrides);
      })
      .catch(() => {});
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${next}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  const applyTextOverride = useCallback((key: EditableTextKey, he: string, en: string) => {
    setTextOverrides((prev) => ({ ...prev, [key]: { he, en } }));
  }, []);

  const applyImageOverride = useCallback((key: EditableImageKey, url: string) => {
    setImageOverrides((prev) => ({ ...prev, [key]: url }));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => (textOverrides[key] ?? dictionary[key])[language],
      getTextPair: (key) => textOverrides[key] ?? dictionary[key],
      getImageUrl: (key) => {
        const path = imageOverrides[key];
        if (!path) return undefined;
        return /^https?:\/\//i.test(path) ? path : `${API_BASE_URL}${path}`;
      },
      applyTextOverride,
      applyImageOverride,
    }),
    [language, setLanguage, textOverrides, imageOverrides, applyTextOverride, applyImageOverride]
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
