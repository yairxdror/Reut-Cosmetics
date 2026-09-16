"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANGUAGE_COOKIE_NAME, type Language } from "@/lib/language";
import { API_BASE_URL, fetchSiteContent, type LegalPage } from "@/lib/api";
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
  facebookCta: { he: "עקבו בפייסבוק", en: "Follow us on Facebook" },
  facebookCtaMobile: { he: "פייסבוק", en: "Facebook" },
  whatsappCtaCore: { he: "דברו איתנו", en: "Chat with us" },
  whatsappCtaSuffix: { he: "בוואטסאפ", en: "on WhatsApp" },
  featureDiagnostics: { he: "טיפול שמותאם\nבדיוק בשבילך", en: "A treatment tailored\njust for you" },
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
  adminSearchPlaceholder: { he: "חיפוש לפי שם הלקוחה או תאריך", en: "Search by customer name or date" },
  adminClearSearch: { he: "ניקוי חיפוש", en: "Clear search" },
  adminNoSearchResults: { he: "לא נמצאו הצהרות בריאות התואמות לחיפוש.", en: "No health declarations match your search." },
  adminLoadMore: { he: "הצג עוד", en: "Show More" },
  adminLoadingMore: { he: "טוען עוד...", en: "Loading more..." },

  locationTitle: { he: "המיקום שלנו", en: "Our Location" },
  locationAddress: { he: "משה רחמילביץ 34, ירושלים", en: "Moshe Rachmilevitz 34, Jerusalem" },
  wazeCta: { he: "Waze", en: "Waze" },

  contactSectionTitle: { he: "צרי קשר", en: "Contact Us" },
  instagramCta: { he: "עקבו באינסטגרם", en: "Follow on Instagram" },
  instagramCtaMobile: { he: "אינסטגרם", en: "Instagram" },
  phoneCta: { he: "התקשרו אלינו", en: "Call Us" },
  phoneCtaMobile: { he: "טלפון", en: "Call" },
  // Same value in both languages, like wazeCta above — a handle/name/phone
  // number doesn't translate. The link targets (contact.ts's INSTAGRAM_URL
  // / FACEBOOK_URL / PHONE_TEL_URL / whatsappUrl) are separate hardcoded
  // values, not derived from these — editing this text doesn't repoint them.
  instagramHandle: { he: "reut_cosmetics_", en: "reut_cosmetics_" },
  facebookName: { he: "Reut Yakobi", en: "Reut Yakobi" },
  phoneDisplayNumber: { he: "050-998-8848", en: "050-998-8848" },
  whatsappDisplayNumber: { he: "050-998-8848", en: "050-998-8848" },
  allRightsReserved: { he: "כל הזכויות שמורות.", en: "All rights reserved." },
  footerRights: { he: "כל הזכויות שמורות ל-Reut Cosmetics ©", en: "© All rights reserved to Reut Cosmetics" },
  developedBy: { he: "פותח על ידי Codedly", en: "Developed by Codedly" },

  consultationNamePlaceholder: { he: "שם מלא", en: "Full Name" },
  consultationPhonePlaceholder: { he: "טלפון", en: "Phone" },
  consultationServicePlaceholder: { he: "תחום שירות", en: "Service Area" },
  consultationSubmit: { he: "שלחי בוואטסאפ", en: "Send Details" },
  consultationNameRequired: { he: "יש למלא שם", en: "Name is required" },
  consultationNameTooShort: { he: "השם חייב לכלול לפחות 2 אותיות", en: "Name must be at least 2 letters" },
  consultationPhoneRequired: { he: "יש למלא טלפון", en: "Phone is required" },
  consultationPhoneInvalid: { he: "מספר הטלפון אינו תקין", en: "Invalid phone number" },
  consultationServiceRequired: { he: "יש לבחור תחום שירות", en: "Please select a service area" },
  consultationWhatsappMessage: {
    he: "שלום, אני",
    en: "Hi, I'm",
  },
  consultationWhatsappPhoneLabel: { he: "טלפון", en: "Phone" },
  consultationWhatsappClosingWithService: {
    he: "אשמח לקבל פרטים נוספים על",
    en: "I'd love to get more details about",
  },

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
  reviewDeleteButton: { he: "מחיקת ביקורת", en: "Delete review" },
  reviewDeleteConfirm: { he: "למחוק את הביקורת הזו לצמיתות?", en: "Permanently delete this review?" },
  reviewDeleteError: { he: "לא ניתן למחוק את הביקורת כרגע.", en: "The review cannot be deleted right now." },
  reviewRateLimited: {
    he: "נשלחו יותר מדי ביקורות מהמכשיר הזה. נסי שוב בעוד כמה דקות.",
    en: "Too many reviews submitted from this device. Please try again in a few minutes.",
  },
  reviewsEmpty: { he: "עדיין אין ביקורות. תהיי הראשונה לכתוב!", en: "No reviews yet. Be the first to write one!" },
  reviewsLoadError: { he: "לא ניתן לטעון ביקורות כרגע.", en: "Unable to load reviews right now." },

  // ---------- Care instructions page ----------
  carePageTitle: {
    he: "הוראות לטיפול בעור לאחר איפור קבוע",
    en: "Permanent Makeup Aftercare Instructions",
  },
  careIntroGreeting: { he: "לקוחה יקרה,", en: "Dear client," },
  careIntroLine1: {
    he: "אם את קוראת את הדף הזה, כנראה שכבר סיימת את הטיפול והגבות שלך נראות נפלא.",
    en: "If you're reading this page, you've likely completed your treatment and your brows look beautiful.",
  },
  careIntroLine2: {
    he: "בימים הקרובים חשוב להקפיד על ההנחיות הבאות, כדי לסייע לגבות להחלים באופן מיטבי.",
    en: "Over the coming days, please follow these instructions carefully to support the best possible healing of your brows.",
  },
  careWarningBold: {
    he: "החל מהיום, אין להרטיב או לשטוף את הגבות במשך חמישה ימים מלאים.",
    en: "Starting today, do not wet or wash your brows for five full days.",
  },
  careWarningNote: {
    he: "כיצד לחפוף? הטי את הראש לאחור, כמו במספרה. את הפנים יש לשטוף מאזור העיניים ומטה.",
    en: "When washing your hair, tilt your head back as you would at a salon. Wash your face only from the eye area downward.",
  },
  careDailyTitle: { he: "טיפול יומי בגבות", en: "Daily Brow Care" },
  careDaily1: {
    he: "החל ממחר, הרטיבי פד כותנה במעט מים פושרים, סחטי אותו היטב עד שיהיה לח בלבד וטפחי בעדינות על הגבות.",
    en: "Starting tomorrow, moisten a cotton pad with a small amount of lukewarm water, squeeze it thoroughly until it is only damp, and gently pat your brows.",
  },
  careDaily2: {
    he: "אף שאין לשטוף את הגבות במשך חמישה ימים, חשוב לנקות בעדינות את האזור בדרך זו.",
    en: "Although the brows must not be washed for five days, it is important to gently clean the area in this way.",
  },
  careDaily3: {
    he: 'מיד לאחר מכן, מרחי שכבה דקה מאוד של משחת "בפנטן פלוס".',
    en: 'Immediately afterward, apply a very thin layer of "Bepanthen Plus" ointment.',
  },
  careDaily4: {
    he: "את המשחה יש למרוח פעם ביום, במשך חמישה ימים בלבד. רצוי לעשות זאת בערב, לאחר ניקוי הפנים.",
    en: "Apply the ointment once a day for five days only, preferably in the evening after cleansing your face.",
  },
  careDaily5: {
    he: "חשוב: יש להתחיל את הטיפול הביתי ביום שלאחר הטיפול. ביום הטיפול עצמו אין לעשות דבר בגבות.",
    en: "Important: begin this home-care routine on the day after your treatment. Do not do anything to your brows on the day of the treatment itself.",
  },
  careImportantTitle: { he: "חשוב לדעת", en: "Important to Know" },
  careRule1: {
    he: "אין לגרד או לשפשף את הגבות. פעולות אלה עלולות לפגוע באזור ולגרום להתפשטות הפיגמנט מתחת לעור.",
    en: "Do not scratch or rub your brows. Doing so may damage the area and cause the pigment to spread beneath the skin.",
  },
  careRule2: {
    he: "אין להשתמש באזור הגבות והמצח בתכשירים קוסמטיים פעילים, ובהם קרמים המכילים חומצות, תכשירי קילוף, קרמי הבהרה, תכשירים לטיפול באקנה, פילינג או סבון פנים פעיל, עד להשלמת שני הטיפולים.",
    en: "Do not use active cosmetic products on the brow or forehead area, including acid-based creams, exfoliating products, skin-lightening creams, acne treatments, peels, or active facial cleansers, until both treatments are complete.",
  },
  careRule3: {
    he: "גם קרם פנים טבעי שאינו מכיל חומצות אין למרוח באזור הגבות במהלך עשרת הימים הראשונים להחלמה. ניתן למרוח אותו מאזור העיניים ומטה, ולאחר עשרה ימים גם באזור הגבות.",
    en: "Do not apply even a natural, acid-free face cream to the brow area during the first ten days of healing. It may be applied from the eye area downward, and after ten days it may also be applied to the brow area.",
  },
  careRule4: {
    he: "ניתן לעבור טיפול פנים רק בחלוף חודש מהטיפול השני.",
    en: "A facial treatment may be performed only after one month has passed since the second session.",
  },
  careRule5: {
    he: "אין להתאפר באזור הגבות והמצח במשך שבעה ימים. לאחר מכן ניתן להתאפר באזור.",
    en: "Do not apply makeup to the brow or forehead area for seven days. Makeup may be applied to the area afterward.",
  },
  careRule6: {
    he: "אין לבצע פעילות גופנית במשך שבוע מלא, גם אם אינה גורמת להזעה.",
    en: "Do not engage in physical activity for one full week, even if it does not cause sweating.",
  },
  careRule7: {
    he: "אין להיכנס לים, לבריכה, לסאונה או לג'קוזי במהלך שבעת הימים הראשונים.",
    en: "Do not enter the sea, a swimming pool, a sauna, or a jacuzzi during the first seven days.",
  },
  careRule8: {
    he: "מומלץ להימנע מחשיפת אזור הגבות לשמש, כדי למנוע דהייה מהירה של הצבע. ניתן למרוח קרם הגנה באזור רק החל מהיום העשירי לאחר הטיפול, כדי להימנע ממריחתו על עור שטרם החלים.",
    en: "Avoid exposing the brow area to the sun to prevent the color from fading quickly. Sunscreen may be applied to the area only from the tenth day after treatment, to avoid applying it to skin that has not yet healed.",
  },
  careHealingTitle: { he: "תהליך ההחלמה", en: "The Healing Process" },
  careHealing1: { he: "חשוב שתדעי:", en: "Important to know:" },
  careHealing2: {
    he: "ביום הטיפול הגבות נראות מודגשות ומדויקות.",
    en: "On the day of treatment, the brows look defined and precise.",
  },
  careHealing3: {
    he: "החל ממחר, הגבות עשויות להתכהות באופן משמעותי. אין להיבהל — זהו חלק טבעי מתהליך ההחלמה והיווצרות הגלד.",
    en: "Starting tomorrow, the brows may darken significantly. Do not be alarmed — this is a natural part of the healing and scab-forming process.",
  },
  careHealing4: {
    he: "בין היום החמישי ליום הארבעה־עשר עשוי להתחיל קילוף באזור הגבות.",
    en: "Flaking in the brow area may begin between the fifth and fourteenth day.",
  },
  careHealing5: {
    he: "לאחר הקילוף, הצבע עשוי להיראות בהיר מאוד וחלק מהפיגמנט עשוי להיעלם. הצורה, הסימטריה והגוון בשלב זה עדיין אינם התוצאה הסופית. תהליך האיפור הקבוע כולל שני טיפולים, והתוצאה מתייצבת לאחר טיפול ההשלמה וסיום ההחלמה.",
    en: "After flaking, the color may appear very light and some of the pigment may seem to disappear. At this stage, the shape, symmetry, and shade are not yet the final result. The permanent makeup process includes two sessions, and the result settles after the follow-up treatment and the completion of healing.",
  },
  careHealingImageAlt: { he: "שלבי החלמת הגבות לפי ימים", en: "Stages of eyebrow healing by day" },
  careContactIntro: {
    he: "לכל שאלה, אני כאן בשבילך. ניתן ליצור איתי קשר בטלפון:",
    en: "If you have any questions, I'm here for you. You can contact me by phone:",
  },
  carePhoneNumber: { he: "050-9988848", en: "050-9988848" },
  careSignoff: { he: "באהבה,", en: "With love," },
  careSignoffName: { he: "רעות יעקובי ♥", en: "Reut Yakobi ♥" },


  // ---------- Privacy policy page ----------
  ppGeneralTitle: { he: "כללי", en: "General" },
  ppGeneralText: {
    he: "Reut Cosmetics מכבדת את פרטיותך. מדיניות זו היא הודעה בדבר איסוף מידע אישי: היא מסבירה איזה מידע נאסף, האם מסירתו חובה, לאילו מטרות הוא משמש, למי הוא עשוי להימסר, כמה זמן הוא נשמר ומהן זכויותייך. גלישה באתר כשלעצמה אינה מהווה הסכמה לעיבוד שאינו נחוץ להפעלתו; במקום שבו נדרשת הסכמה, היא מתבקשת באופן מפורש בנקודת האיסוף.",
    en: "Reut Cosmetics respects your privacy. This policy is a notice about the collection of personal information: it explains what is collected, whether providing it is mandatory, the purposes of use, potential recipients, retention periods, and your rights. Browsing the site alone is not consent to processing that is not necessary for its operation; where consent is required, it is requested expressly at the point of collection.",
  },
  ppControllerTitle: { he: "בעלת השליטה במאגר ופרטי קשר", en: "Data Controller and Contact Details" },
  ppControllerText: {
    he: "בעלת השליטה במידע היא רעות יעקובי, המפעילה את Reut Cosmetics, בכתובת משה רחמילביץ 34, ירושלים. לפניות בנושא פרטיות ניתן ליצור קשר:",
    en: "The data controller is Reut Yakobi, operator of Reut Cosmetics, at 34 Moshe Rachmilevitz Street, Jerusalem. For privacy inquiries, contact us:",
  },
  ppDataCollectedTitle: { he: "המידע שאנו אוספות", en: "Information We Collect" },
  ppDataItem1: {
    he: "ביקורות: שם, דירוג וטקסט הביקורת. המסירה היא לבחירתך; ללא המידע לא ניתן לפרסם ביקורת. לאחר אישור מפורש, הפרטים מוצגים בפומבי בעמוד הביקורות באתר.",
    en: "Reviews: name, rating, and review text. Providing them is optional; without them, a review cannot be published. After express approval, the details are displayed publicly on the site's reviews page.",
  },
  ppDataItem2: {
    he: "הצהרת בריאות: שם מלא, מספר תעודת זהות, מספר טלפון ותשובות לשאלון הבריאות. מסירת המידע תלויה ברצונך ובהסכמתך; ללא המידע לא נוכל לבדוק התאמה ובטיחות לטיפול או להעניק טיפול המחייב בדיקה זו.",
    en: "Health declaration: full name, ID number, phone number, and health-questionnaire answers. Providing this information depends on your choice and consent; without it, we cannot assess treatment suitability and safety or provide a treatment that requires such an assessment.",
  },
  ppDataItem3: {
    he: 'פניית "צרי קשר": שם, מספר טלפון ותחום השירות המבוקש. המסירה היא לבחירתך; ללא שם וטלפון לא ניתן ליצור הודעת WhatsApp מוכנה. המידע אינו נשמר בשרתי האתר ונשלח ל-WhatsApp רק לאחר פעולתך.',
    en: 'A "Contact Us" inquiry: name, phone number, and requested service area. Providing them is optional; without a name and phone number, a prepared WhatsApp message cannot be created. The information is not stored on the site servers and is sent to WhatsApp only after your action.',
  },
  ppDataItem4: {
    he: "מידע במכשיר: העדפת שפה נשמרת בעוגייה למשך שנה; העדפות נגישות, אסימון עריכת ביקורת זמני ואסימון התחברות של מנהלת נשמרים באחסון המקומי של הדפדפן לפי הצורך.",
    en: "Information on your device: language preference is stored in a cookie for one year; accessibility preferences, a temporary review-edit token, and an administrator login token are stored in browser local storage as needed.",
  },
  ppDataItem5: {
    he: "התחברות מנהלת: כתובת אימייל וסיסמה נשלחות לשרת לצורך אימות בלבד. הסיסמה אינה נשמרת במאגר כטקסט גלוי; בדפדפן נשמר אסימון התחברות מוגבל בזמן.",
    en: "Administrator login: an email address and password are sent to the server solely for authentication. The password is not stored in the database as plain text; a time-limited login token is stored in the browser.",
  },
  ppDataItem6: {
    he: "מידע טכני ואבטחתי: תשתיות האירוח עשויות לתעד כתובת IP, מועד בקשה, סוג דפדפן או מכשיר, נתוני שגיאה ואירועי אבטחה, לצורך תפעול, אבטחה, מניעת שימוש לרעה ואבחון תקלות.",
    en: "Technical and security data: hosting infrastructure may record IP address, request time, browser or device type, error data, and security events for operation, security, abuse prevention, and troubleshooting.",
  },
  ppSensitiveTitle: { he: "מידע בעל רגישות מיוחדת — הצהרת בריאות", en: "Specially Sensitive Information — Health Declaration" },
  ppSensitiveIntro: {
    he: 'פרטי הצהרת הבריאות, ובפרט תשובות רפואיות ומספר תעודת זהות, עשויים להיחשב "מידע בעל רגישות מיוחדת" לפי חוק הגנת הפרטיות, התשמ"א-1981. הם נאספים רק לאחר הודעה והסכמה מפורשת ולמטרת בדיקת התאמה ובטיחות לטיפול. בהתאם לכך:',
    en: 'Health-declaration details, particularly medical answers and an ID number, may constitute "specially sensitive information" under the Israeli Privacy Protection Law, 5741-1981. They are collected only after notice and express consent for assessing treatment suitability and safety. Accordingly:',
  },
  ppSensitiveItem1: {
    he: "תוכן ההצהרה מוצפן באחסון באמצעות AES-256-GCM, כך שגישה ישירה לרשומה אינה חושפת אותו כטקסט גלוי ואף מאפשרת לזהות שינוי בלתי מורשה במידע.",
    en: "Declaration content is encrypted at rest using AES-256-GCM, so direct access to a record does not reveal plain text and unauthorized alteration can be detected.",
  },
  ppSensitiveItem2: {
    he: "הגישה למידע מוגבלת לצוות מורשה בלבד, באמצעות התחברות מאובטחת.",
    en: "Access to the information is limited to authorized staff only, via secure login.",
  },
  ppSensitiveItem3: {
    he: "המידע נשמר עד 7 שנים ממועד המסירה ונמחק בתום התקופה באמצעות מנגנון מחיקה מתוזמן ובדיקות ניקוי בשרת.",
    en: "The information is retained for up to seven years from submission and deleted at the end of that period through scheduled deletion and server-side cleanup checks.",
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
    he: "לצורך הפעלת האתר ואבטחתו נעשה שימוש בשירותי Google/Firebase, ובהם Hosting, Cloud Run, Firestore ו-Cloud Storage, העשויים לעבד מידע עבורנו כספקי תשתית. פניות קשר מועברות ל-WhatsApp/Meta רק לאחר בחירתך לשלוח אותן. מפה מוטמעת של Google Maps נטענת בעמוד הבית, וקישור Waze נפתח רק בלחיצה. ספקים אלה עשויים לעבד מידע גם מחוץ לישראל בהתאם לתשתיותיהם ולהגדרות השירות. מידע עשוי להימסר גם לרשות מוסמכת אם הדבר נדרש על פי דין. איננו מוכרות מידע אישי ואיננו מוסרות אותו לצדדים שלישיים לצורכי פרסום שלהם.",
    en: "To operate and secure the site, we use Google/Firebase services, including Hosting, Cloud Run, Firestore, and Cloud Storage, which may process information for us as infrastructure providers. Contact inquiries are transferred to WhatsApp/Meta only after you choose to send them. An embedded Google Maps map loads on the home page, and a Waze link opens only when clicked. These providers may process information outside Israel according to their infrastructure and service settings. Information may also be disclosed to a competent authority where required by law. We do not sell personal information or disclose it to third parties for their advertising purposes.",
  },
  ppRetentionTitle: { he: "משך שמירת המידע ומחיקתו", en: "Retention and Deletion" },
  ppRetentionText: {
    he: "הצהרות בריאות נשמרות עד 7 שנים ממועד המסירה. ביקורות נשמרות כל עוד הן מוצגות או נדרשות לניהול השירות, אלא אם התבקשה הסרתן ונמצא שאין חובה חוקית לשמרן. פרטי פנייה אינם נשמרים בשרת האתר, אך הודעה שנשלחה נשמרת ב-WhatsApp בהתאם למדיניות ולהגדרות החשבון שם. העדפות ואסימונים בדפדפן נשמרים עד לפקיעתם, למחיקתם בידי המשתמשת או לניקוי נתוני האתר. יומנים טכניים נשמרים בהתאם להגדרות ולתקופות השמירה של ספקי התשתית ורק כל עוד הם נחוצים לתפעול, אבטחה ועמידה בדין.",
    en: "Health declarations are retained for up to seven years from submission. Reviews are retained while displayed or needed to manage the service, unless removal is requested and no legal duty requires retention. Contact details are not stored on the site server, but a sent message is retained by WhatsApp according to its policy and account settings. Browser preferences and tokens remain until expiry, user deletion, or clearing site data. Technical logs are retained according to infrastructure-provider settings and only as long as needed for operation, security, and legal compliance.",
  },
  ppSecurityTitle: { he: "אבטחת מידע", en: "Data Security" },
  ppSecurityText: {
    he: "אנו נוקטות באמצעי אבטחה טכניים וארגוניים סבירים להגנה על המידע שנמסר לנו, לרבות הצפנת מידע רגיש והגבלת קצב שליחת טפסים. יחד עם זאת, אין אפשרות להבטיח אבטחה מוחלטת של מידע המועבר או מאוחסן באופן דיגיטלי.",
    en: "We take reasonable technical and organizational security measures to protect the information provided to us, including encrypting sensitive information and rate-limiting form submissions. That said, absolute security of information transmitted or stored digitally can never be fully guaranteed.",
  },
  ppCookiesTitle: { he: "עוגיות (Cookies)", en: "Cookies" },
  ppCookiesText: {
    he: "האתר שומר עוגיית שפה למשך שנה ומשתמש באחסון המקומי של הדפדפן לשמירת העדפות נגישות, אסימון עריכת ביקורת זמני ואסימון מנהלת. הטמעת Google Maps עשויה להשתמש בעוגיות או באחסון של Google בעת טעינת המפה. האתר עצמו אינו מפעיל עוגיות פרסום או מערכת ניתוח שיווקית. ניתן למחוק או לחסום עוגיות ואחסון מקומי דרך הגדרות הדפדפן, אך חלק מההעדפות או התכונות עלולות שלא להישמר.",
    en: "The site stores a language cookie for one year and uses browser local storage for accessibility preferences, a temporary review-edit token, and an administrator token. The Google Maps embed may use Google cookies or storage when the map loads. The site itself does not run advertising cookies or a marketing analytics system. Cookies and local storage can be deleted or blocked through browser settings, but some preferences or features may no longer persist.",
  },
  ppRightsTitle: { he: "הזכויות שלך", en: "Your Rights" },
  ppRightsText: {
    he: "בכפוף לחוק הגנת הפרטיות, עומדת לך הזכות לעיין בעצמך, או באמצעות באת כוח שהורשתה בכתב, במידע אישי המוחזק עלייך; ואם מצאת שאינו נכון, שלם, ברור או מעודכן — לבקש את תיקונו או מחיקתו. ניתן גם לבקש הסרת ביקורת או מידע שאינו דרוש עוד. בקשות מחיקה נבחנות לפי הדין, מטרת האיסוף וחובות שמירה החלות על העסק ואינן זכות מוחלטת בכל מקרה. לצורך הגנה על פרטיותך אנו עשויות לבקש אימות זהות לפני מסירת מידע או ביצוע שינוי.",
    en: "Subject to the Israeli Privacy Protection Law, you may inspect personal information held about you, personally or through a representative authorized in writing; if it is incorrect, incomplete, unclear, or outdated, you may request correction or deletion. You may also request removal of a review or information no longer needed. Deletion requests are assessed under applicable law, the collection purpose, and any retention duties, and are not an absolute right in every case. To protect your privacy, we may verify identity before disclosing or changing information.",
  },
  ppContactTitle: { he: "יצירת קשר בנושא פרטיות", en: "Contact Us About Privacy" },
  ppContactIntro: {
    he: "לכל שאלה או בקשה הנוגעת למדיניות זו ולמידע האישי שלך, ניתן לפנות אלינו:",
    en: "For any question or request regarding this policy or your personal information, you can reach us at:",
  },
  ppUpdatesTitle: { he: "עדכוני מדיניות", en: "Policy Updates" },
  ppUpdatesText: {
    he: "מדיניות זו עשויה להתעדכן מעת לעת. מועד העדכון יופיע בתחתית העמוד. אם יחול שינוי מהותי באופן השימוש במידע, תפורסם הודעה בולטת ובמקום שבו הדין מחייב זאת תתבקש הסכמה חדשה; עצם המשך הגלישה לא יחליף הסכמה מפורשת הנדרשת לפי דין.",
    en: "This policy may be updated from time to time, and the revision date will appear at the bottom of this page. If there is a material change in how information is used, a prominent notice will be posted and, where required by law, renewed consent will be requested; continued browsing alone will not replace express consent required by law.",
  },
  // The date itself is server-computed (see PrivacyPolicy.tsx) — this is
  // only the fixed lead-in text, no longer admin-editable as free text.
  ppLastUpdatedPrefix: {
    he: "מדיניות פרטיות זו עודכנה לאחרונה בתאריך",
    en: "This privacy policy was last updated on",
  },

  // ---------- Privacy notices at collection points ----------
  privacyPolicyLinkLabel: { he: "למדיניות הפרטיות המלאה", en: "Read the full privacy policy" },
  hdPrivacyNoticeTitle: { he: "פרטיות והסכמה למסירת מידע רפואי", en: "Privacy and Consent to Provide Health Information" },
  hdPrivacyNotice1: {
    he: "המידע בטופס נמסר מרצונך לבעלת השליטה במידע, רעות יעקובי — Reut Cosmetics, ומשמש לבדיקת התאמה ובטיחות לפני טיפול.",
    en: "The information in this form is provided voluntarily to the data controller, Reut Yakobi — Reut Cosmetics, and is used to assess treatment suitability and safety.",
  },
  hdPrivacyNotice2: {
    he: "ללא המידע לא ניתן לבצע את הבדיקה או להעניק טיפול המחייב אותה.",
    en: "Without it, the assessment or a treatment requiring it cannot be provided.",
  },
  hdPrivacyNotice3: {
    he: "תוכן ההצהרה מוצפן ונשמר בתשתיות Google/Firebase עד 7 שנים, ונגיש רק למורשות.",
    en: "Declaration content is encrypted and stored on Google/Firebase infrastructure for up to seven years, with access limited to authorized persons.",
  },
  hdPrivacyNotice4: {
    he: "ניתן לפנות בטלפון או ב-WhatsApp המופיעים במדיניות לצורך עיון, תיקון או בקשה למחיקה, בכפוף לדין.",
    en: "Use the phone or WhatsApp listed in the policy to request access, correction, or deletion, subject to law.",
  },
  hdPrivacyConsentText: {
    he: "קראתי את הודעת הפרטיות ומסכימה לאיסוף, לשימוש ולאחסון של המידע שמסרתי, כמפורט בה",
    en: "I have read the privacy notice and consent to the collection, use, and storage of the information I provided, as detailed in it",
  },
  hdPrivacyConsentRequired: { he: "יש לאשר את הודעת הפרטיות כדי להמשיך", en: "You must accept the privacy notice to continue" },
  reviewPublishConsentText: {
    he: "אני מסכימה לפרסום בפומבי את השם שלי, הדירוג ותוכן הביקורת באתר",
    en: "I consent to the public publication of my name, rating, and review text on the site",
  },
  reviewConsentRequired: { he: "יש לאשר את פרסום הביקורת כדי להמשיך", en: "You must approve publication of the review to continue" },

  // ---------- Terms of use page ----------
  touGeneralTitle: { he: "כללי", en: "General" },
  touGeneralText: {
    he: "תנאים אלה מסדירים את השימוש באתר Reut Cosmetics ואת התנאים הכלליים לקבלת השירותים המוצגים בו. האתר מאפשר לעיין במידע, ליצור קשר, לפרסם ביקורות ולמלא הצהרת בריאות. בשלב זה לא ניתן לשלם או להשלים הזמנה באתר עצמו. השימוש באתר כפוף לתנאים אלה; אם אינך מסכימה להם, יש להימנע מהשימוש בו. הנוסח בלשון נקבה מטעמי נוחות ומתייחס לכל המשתמשות והמשתמשים. אין בתנאים אלה כדי לגרוע מזכויות שלא ניתן להתנות עליהן לפי דין.",
    en: "These terms govern use of the Reut Cosmetics website and the general terms for receiving the services it presents. The site lets you read information, contact us, post reviews, and complete a health declaration. Payments and bookings cannot currently be completed on the site itself. Use of the site is subject to these terms; if you do not agree, please refrain from using it. Feminine wording in the Hebrew version is used for convenience and refers to all users. These terms do not limit rights that cannot be waived under applicable law.",
  },
  touOperatorTitle: { he: "מפעילת האתר ופרטי העסק", en: "Website Operator and Business Details" },
  touOperatorText: {
    he: "האתר והשירותים מופעלים בידי רעות יעקובי — Reut Cosmetics, בכתובת משה רחמילביץ 34, ירושלים. ניתן ליצור קשר:",
    en: "The site and services are operated by Reut Yakobi — Reut Cosmetics, at 34 Moshe Rachmilevitz Street, Jerusalem. Contact is available:",
  },
  touServicesTitle: { he: "השירותים המוצעים", en: "Services Offered" },
  touServicesText: {
    he: "Reut Cosmetics מציעה טיפולי איפור קבוע, לרבות מיקרובליידינג, איפור כלות וערב, הסרת שיער בשעווה באזור הפנים וקורסי הכשרה מקצועיים. תיאורי השירותים באתר הם כלליים. לפני ביצוע עסקה יימסרו ויאושרו פרטי השירות: התאמתו לצרכייך, היקפו, המחיר הכולל לתשלום, מה כלול בו, מועדי המפגשים והתנאים הנלווים. תוספת שאינה כלולה במחיר תחייב הסכמה מראש. אם קיימת סתירה בין מידע כללי באתר לבין הצעה או הסכם אישי שאושרו, יחול ההסכם האישי, בכפוף לדין ולזכויותייך.",
    en: "Reut Cosmetics offers permanent makeup, including microblading, bridal and evening makeup, facial waxing, and professional training courses. Service descriptions on the site are general. Before a transaction is concluded, the service details will be disclosed and agreed: suitability for your needs, scope, total amount payable, what is included, session dates, and related terms. Any extra that is not included in the price requires prior agreement. If general site information conflicts with an agreed individual quote or agreement, the individual agreement applies, subject to applicable law and your rights.",
  },
  touBookingTitle: { he: "יצירת קשר, קביעת תור והרשמה לקורס", en: "Contact, Appointments, and Course Enrollment" },
  touBookingText: {
    he: "שליחת טופס, פתיחת שיחה ב-WhatsApp או בקשת מידע אינן מהוות כשלעצמן אישור לתור, להרשמה לקורס או לרכישה. תור או הרשמה יאושרו לאחר הסכמה מפורשת שלך ושל Reut Cosmetics על סוג השירות, המחיר, תנאי התשלום, המועד ותנאי הביטול. אם נדרשת מקדמה, סכומה ותנאיה יימסרו לפני התשלום. עד לקבלת אישור סופי, זמינות המועד עשויה להשתנות. מומלץ לשמור את אישור התור או ההרשמה ואת התנאים שנמסרו לך.",
    en: "Submitting a form, opening a WhatsApp conversation, or requesting information does not by itself confirm an appointment, course enrollment, or purchase. An appointment or enrollment will be confirmed after you and Reut Cosmetics expressly agree on the service, price, payment terms, date, and cancellation terms. If a deposit is required, its amount and terms will be disclosed before payment. Availability may change until final confirmation. We recommend keeping your booking or enrollment confirmation and the terms provided to you.",
  },
  touHealthTitle: { he: "הצהרת בריאות", en: "Health Declaration" },
  touHealthText: {
    he: "לפני טיפול המחייב בדיקת התאמה, תתבקשי למלא הצהרת בריאות מלאה ומדויקת ולעדכן את המטפלת בכל שינוי רלוונטי עד למועד הטיפול. מילוי ההצהרה ושליחתה אינם מהווים כשלעצמם אישור להתאמה לטיפול. מידע חסר או שגוי עלול להשפיע על בטיחות הטיפול ועל תוצאותיו. אם קיים חשש בטיחותי או שחסר מידע הדרוש לבדיקה, Reut Cosmetics רשאית לדחות, להפסיק או להימנע מביצוע הטיפול. האחריות למסירת מידע נכון אינה גורעת מחובות המטפלת או מזכויותייך. הטיפול בתשלום במקרה כזה מפורט בסעיף העוסק בביטול מצד העסק ובאי־התאמה לטיפול.",
    en: "Before a treatment requiring a suitability assessment, you will be asked to complete an accurate and complete health declaration and tell the practitioner about any relevant changes up to the treatment date. Completing and submitting the declaration does not by itself confirm suitability for treatment. Missing or incorrect information may affect treatment safety and results. If there is a safety concern or information needed for the assessment is missing, Reut Cosmetics may postpone, stop, or decline treatment. Your responsibility to provide accurate information does not limit the practitioner's duties or your rights. Payments in these circumstances are addressed in the section on business cancellations and treatment suitability.",
  },
  touPaymentTitle: { he: "תשלום וחבילת איפור קבוע", en: "Payment and Permanent Makeup Packages" },
  touPayment1: {
    he: "הסעיפים המתייחסים לשני מפגשים חלים על חבילת איפור קבוע שנרכשה במתכונת זו. תנאי השירות והתשלום לאיפור כלות וערב, לשעווה בפנים ולקורסים יימסרו בנפרד לפני הרכישה.",
    en: "Provisions referring to two sessions apply to a permanent-makeup package purchased on that basis. Service and payment terms for bridal and evening makeup, facial waxing, and courses will be provided separately before purchase.",
  },
  touPayment2: {
    he: "אלא אם הוסכם אחרת בכתב, מחיר חבילת האיפור הקבוע כולל שני מפגשים ומשולם מראש, בהתאם להצעה שנמסרה לך. אם התשלום מחולק למקדמה וליתרה, סכום כל תשלום, מועדו והאופן שבו המקדמה נכללת במחיר הכולל יפורטו מראש. טיפול נוסף שאינו כלול בחבילה יחייב הסכמה נפרדת על המחיר לפני ביצועו.",
    en: "Unless otherwise agreed in writing, the permanent-makeup package includes two sessions and is paid in advance according to the quote provided to you. If payment is divided into a deposit and a balance, each amount, its due date, and how the deposit counts toward the total price will be specified in advance. Any additional treatment outside the package requires separate price agreement before it is performed.",
  },
  touPayment3: {
    he: "בקשה לביטול רכישת טיפול, חבילה או קורס תטופל בהתאם לחוק הגנת הצרכן, לתקנות החלות ולנסיבות העסקה. תחילת השירות אינה שוללת כשלעצמה זכות ביטול הקיימת לפי דין. אם מותר לחייב עבור שירות שכבר ניתן או לגבות דמי ביטול, החיוב ייעשה רק בהיקף המותר בדין. פירוט סכום ההחזר וכל ניכוי ממנו יימסר בכתב. זכויותייך במקרה של פגם, אי־התאמה או הפרת התחייבות נשמרות.",
    en: "A request to cancel the purchase of a treatment, package, or course will be handled under the Israeli Consumer Protection Law, applicable regulations, and the circumstances of the transaction. Starting a service does not by itself remove a statutory cancellation right. Charges for services already provided or cancellation fees will apply only where and to the extent permitted by law. The refund amount and any deductions will be itemized in writing. Your rights in the event of a defect, non-conformity, or breach of an obligation remain unaffected.",
  },
  touPayment4: {
    he: "קליטת הפיגמנט והתוצאה משתנות לפי סוג העור, תגובת הגוף, אורח החיים והקפדה על הוראות הטיפול. אם לאחר שני המפגשים יומלץ על מפגש נוסף, הצורך בו, מחירו ומועדו יימסרו ללקוחה ויאושרו מראש.",
    en: "Pigment retention and results vary according to skin type, individual response, lifestyle, and adherence to aftercare instructions. If an additional session is recommended after the two included sessions, its purpose, price, and date will be disclosed and approved in advance.",
  },
  touPayment5: {
    he: "מועד המפגש השני ייקבע בתיאום איתך ובהתאם לטווח הזמן המקצועי שיימסר לך, אשר עשוי להיות עד חודשיים מהמפגש הראשון. דחייה מעבר לטווח המומלץ עלולה להשפיע על התוצאה ולהצריך בדיקת התאמה מחודשת. אם נדרש שינוי במועד, יש לפנות לתיאום כמפורט בסעיף הבא.",
    en: "The second session will be arranged with you within the professional timeframe communicated to you, which may be up to two months after the first session. A delay beyond the recommended period may affect the result and require a new suitability assessment. If you need to change the date, please contact us as described in the next section.",
  },
  touPayment6: {
    he: "לשינוי מועד או לביטול פגישה, יש לפנות ב-WhatsApp ולציין שם מלא, סוג הטיפול ומועד הפגישה. בקשה לדחות פגישה ולהמשיך בחבילה אינה בקשה לבטל את רכישת החבילה. מועד חלופי ייקבע בתיאום ובאישור של שני הצדדים, בהתאם לזמינות ולטווח הזמן המקצועי המתאים לטיפול.",
    en: "To reschedule or cancel an appointment, contact us via WhatsApp with your full name, treatment type, and appointment date and time. A request to postpone an appointment and continue a package is not a request to cancel the package purchase. A new date will be agreed and confirmed by both parties, subject to availability and the appropriate treatment timeframe.",
  },
  touPayment7: {
    he: "אם העסקה נכרתת מרחוק, לרבות ב-WhatsApp בעקבות פנייה דרך האתר, יימסרו ללקוחה פרטי העסקה ודרכי הביטול הנדרשים לפי דין. האפשרות לפנות ב-WhatsApp אינה גורעת מהזכות למסור הודעת ביטול בכל דרך אחרת הקבועה בדין. מועדי הביטול וההחזר ייקבעו לפי סוג השירות, אופן ביצוע העסקה והוראות הדין החלות.",
    en: "If a transaction is concluded remotely, including via WhatsApp following contact through the site, the customer will receive the transaction details and cancellation methods required by law. The option to contact us via WhatsApp does not limit the right to cancel by any other legally provided method. Cancellation and refund deadlines depend on the service, how the transaction was concluded, and applicable law.",
  },
  touPayment8: {
    he: "הרשמה לקורס כפופה לתוכנית, למועדים, למחיר ולתנאים שיימסרו בכתב לפני ההרשמה. זכות הביטול של קורס וכל החזר ייקבעו לפי הדין החל ומועד תחילת הקורס; תנאי פרטני לא יגרע מזכות שלא ניתן להתנות עליה.",
    en: "Course enrollment is subject to the syllabus, dates, price, and terms provided in writing before enrollment. Course cancellation rights and refunds are determined by applicable law and the course start date; individual terms do not limit rights that cannot lawfully be waived.",
  },
  touSchedulingTitle: { he: "שינוי מועד, איחור ואי־הגעה", en: "Rescheduling, Late Arrival, and Missed Appointments" },
  touSchedulingText: {
    he: "תנאי שינוי התור, האיחור ואי־ההגעה יימסרו ויאושרו בעת קביעת התור; אין פרק זמן אחיד להודעה מראש או חיוב קבוע החל על כל התורים. אם את צפויה לאחר או לא תוכלי להגיע, אנא עדכני בהקדם. בהתאם לזמן שנותר ולשיקולים מקצועיים, נבדוק אם ניתן לקיים את הטיפול או שיש לתאם מועד חדש. חיוב או ניכוי מהמקדמה יחולו רק אם נמסרו ואושרו מראש ובמידה המותרת בדין. שינוי תור אינו גורע מזכותך לבטל עסקה לפי דין.",
    en: "Terms for rescheduling, late arrival, and missed appointments will be disclosed and agreed when booking; there is no uniform notice period or fixed charge for all appointments. If you expect to be late or cannot attend, please let us know promptly. We will assess whether treatment can proceed or a new appointment is needed, based on the time remaining and professional considerations. A charge or deposit deduction applies only if disclosed and agreed in advance and permitted by law. Rescheduling does not limit your statutory right to cancel a transaction.",
  },
  touCancellationTitle: { he: "ביטול עסקה והחזר כספי", en: "Transaction Cancellation and Refunds" },
  touCancellationNotice: {
    he: "לביטול רכישת טיפול, חבילה או קורס, צייני בהודעה במפורש שברצונך לבטל את העסקה, את שמך המלא ואת השירות שנרכש. הוסיפי את מועד הרכישה או הפגישה, ואם יש ברשותך מספר הזמנה או קבלה, מומלץ לציינו כדי לסייע באיתור העסקה. מספר זהות או פרט מזהה נוסף יימסרו ככל שנדרש לפי הדין החל. ניתן לשלוח הודעת ביטול כאן:",
    en: "To cancel the purchase of a treatment, package, or course, clearly state that you wish to cancel the transaction and include your full name and the service purchased. Add the purchase or appointment date; an order or receipt number, if available, can help us locate the transaction. An ID number or further identifying detail should be provided where required by applicable law. You can send a cancellation notice here:",
  },
  touCancellationReceipt: {
    he: "לאחר עיון בהודעה נשלח מענה ב-WhatsApp המאשר את קבלתה ומבהיר אם הבקשה היא לשינוי תור או לביטול עסקה. פרטי המשך הטיפול וההחזר, ככל שמגיע, יימסרו לך בהמשך. מומלץ לשמור את ההודעה ואת תיעוד שליחתה. אם לא התקבל מענה, אפשר לפנות שוב לבירור. הודעת ביטול שנמסרה כדין אינה טעונה אישור של העסק כדי להיות תקפה, והמתנה למענה אינה דוחה את המועדים הקבועים בדין.",
    en: "After reviewing your message, we will reply on WhatsApp to acknowledge receipt and clarify whether the request concerns an appointment change or a transaction cancellation. Details of further handling and any refund due will follow. We recommend keeping your message and a record of sending it. If you receive no reply, you can follow up. A cancellation notice delivered in accordance with the law does not require the business's approval to be valid, and waiting for a reply does not extend statutory deadlines.",
  },
  touBusinessCancellationTitle: { he: "ביטול או דחייה מצד העסק ואי־התאמה לטיפול", en: "Business Cancellations, Postponements, and Treatment Suitability" },
  touBusinessAppointment: {
    he: "אם רעות מבטלת פגישה: נעדכן אותך ונציע מועד חלופי בתיאום איתך. המקדמה או התשלום יישמרו למועד החדש רק בהסכמתך. אם לא יוסכם על מועד חלופי, יוחזר הסכום ששולם עבור השירות שלא ניתן, ללא דמי ביטול בשל הביטול מצד העסק ובכפוף לזכויותייך לפי דין.",
    en: "If Reut cancels an appointment: we will notify you and offer an alternative date by agreement. Your deposit or payment will be transferred to the new date only with your consent. If no alternative date is agreed, the amount paid for the service not provided will be refunded, with no cancellation fee for the business's cancellation and subject to your statutory rights.",
  },
  touBusinessSuitability: {
    he: "אם מתברר שאין התאמה לטיפול: הטיפול לא יבוצע, ותיבחן דחייה רק אם היא מתאימה מבחינה מקצועית ובהסכמתך. אם הטיפול טרם החל ולא יתקיים, יוחזר התשלום שנגבה עבורו, לרבות מקדמה. אם כבר ניתן חלק מהשירות, ייערך חישוב מפורט של ההחזר עבור החלק שלא ניתן, לפי התמחור שסוכם מראש והדין, ללא קביעת מחיר חדש בדיעבד לשירות שכבר ניתן.",
    en: "If treatment is found unsuitable: it will not be performed, and postponement will be considered only if professionally appropriate and with your consent. If treatment has not begun and will not take place, the payment collected for it, including any deposit, will be refunded. If part of the service has already been provided, the refund for the unprovided portion will be itemized using the pricing agreed in advance and applicable law, without retrospectively setting a new price for services already provided.",
  },
  touBusinessSecondSession: {
    he: "אם אי אפשר להשלים את המפגש השני בחבילת איפור קבוע בשל מניעה מצד העסק או אי־התאמה מקצועית: נבחן מועד חלופי בטווח המתאים ובהסכמתך. אם אין אפשרות להשלימו, יוחזר התשלום עבור החלק שלא ניתן, בחישוב שיימסר לך לפי תנאי החבילה שסוכמו מראש והדין. אי־השלמת המפגש אינה גוררת אוטומטית אובדן של יתרת התשלום.",
    en: "If the second session in a permanent-makeup package cannot be completed because the business cannot provide it or treatment is professionally unsuitable: we will consider an alternative date within the appropriate timeframe and with your consent. If completion is not possible, the payment for the unprovided portion will be refunded, with a calculation supplied to you under the package terms agreed in advance and applicable law. Failure to complete the session does not automatically forfeit the remaining payment.",
  },
  touBusinessCourse: {
    he: "אם קורס נדחה או מתבטל מצד העסק: יוצע מועד חלופי, ככל שניתן, והרשמתך והתשלום יועברו אליו רק בהסכמתך. אם הקורס טרם החל ואינך מסכימה למועד החלופי, או שאין מועד חלופי, יוחזר מלוא התשלום שנגבה עבור הקורס. אם הקורס כבר החל ואי אפשר להשלימו במתכונת מוסכמת, יוחזר התשלום עבור החלק שלא סופק, לפי התנאים שסוכמו מראש והדין.",
    en: "If the business postpones or cancels a course: an alternative date will be offered where possible, and your enrollment and payment will transfer only with your consent. If the course has not begun and you do not accept the alternative date, or none is available, the full payment collected for the course will be refunded. If the course has already begun and cannot be completed under an agreed arrangement, payment for the unprovided portion will be refunded under the terms agreed in advance and applicable law.",
  },
  touBusinessRefund: {
    he: "במקרים המתוארים בסעיף זה לא ייגבו דמי ביטול בגין שירות שהעסק אינו יכול לספק או שנמצא שאינו מתאים לך מבחינה מקצועית. פרטי ההחזר, אופן חישובו ומועד ביצועו יימסרו בכתב, וההחזר יבוצע במועדים ובאופן הנדרשים לפי דין. אין באמור כדי להגביל זכות להחזר נוסף או לסעד אחר לפי דין.",
    en: "In the cases described in this section, no cancellation fee will be charged for a service the business cannot provide or that is found professionally unsuitable for you. Refund details, calculation, and timing will be provided in writing, and refunds will be made within the time and by the method required by law. This does not limit any right to an additional refund or other legal remedy.",
  },
  touCoursesTitle: { he: "פרטי הקורס ותנאי ההרשמה", en: "Course Details and Enrollment Terms" },
  touCoursesDetails: {
    he: "לפני ההרשמה תקבלי מסמך המפרט את תוכנית הלימודים, מספר המפגשים, היקף השעות, המועדים, המיקום, המחיר ותנאי התשלום והביטול. המסמך יבהיר אילו ציוד וחומרים כלולים ומה יש לרכוש בנפרד, מהם כללי הנוכחות וההיעדרות, והאם ניתן להשלים מפגשים ובאיזו עלות. בנוסף יפורטו תנאי קבלת התעודה, הגוף המנפיק ומה התעודה מעידה על ההכשרה. אם קיימת הכרה של גורם חיצוני, יצוינו הגורם והיקף ההכרה. אין לראות בתעודה רישיון מקצועי או הכרה רשמית מעבר למה שצוין במפורש. תיאור הקורסים והתכנים מופיע בדף הקורסים:",
    en: "Before enrollment, you will receive a document setting out the syllabus, number of sessions, total hours, dates, location, price, and payment and cancellation terms. It will explain which equipment and materials are included, what must be purchased separately, attendance and absence rules, and whether makeup sessions are available and at what cost. It will also specify certificate requirements, the issuer, and what the certificate confirms about the training. Any external recognition will be identified along with its scope. A certificate should not be treated as a professional license or official recognition beyond what is expressly stated. Course descriptions and topics are available on the courses page:",
  },
  touCoursesLink: { he: "לפרטים על הקורסים", en: "View course details" },
  touReviewsTitle: { he: "ביקורות לקוחות", en: "Customer Reviews" },
  touReviewsText: {
    he: "הביקורות מבטאות את דעת הכותבות ואת ניסיונן האישי. בפרסום ביקורת את מאשרת שהיא מתארת חוויה אמיתית שלך, שאינך מתחזה לאדם אחר ושהתוכן אינו מפר דין או זכויות של אחרים. הזכויות בביקורת נשארות שלך, ואת מעניקה ל-Reut Cosmetics רשות לא בלעדית וללא תמורה להציג אותה באתר. ניתן לערוך ביקורת במשך 15 דקות לאחר פרסומה, בדפדפן שבו פורסמה וכל עוד נתוני העריכה שנשמרו בו לא נמחקו. לבקשת הסרה ניתן לפנות דרך פרטי הקשר. Reut Cosmetics רשאית להסיר ספאם, התחזות, פרטים אישיים של אחרים שפורסמו ללא רשות, איומים, הטרדה, תוכן מפלה, מטעה, בלתי חוקי או שאינו קשור לשירות, תוך הפעלת שיקול דעת סביר. ביקורת עניינית לא תוסר רק משום שהיא שלילית או מביעה חוסר שביעות רצון.",
    en: "Reviews reflect their authors' opinions and personal experiences. By posting a review, you confirm that it describes your own genuine experience, that you are not impersonating anyone, and that the content does not violate the law or anyone else's rights. You retain the rights to your review and grant Reut Cosmetics non-exclusive permission, without payment, to display it on the site. A review can be edited for 15 minutes after publication using the browser in which it was posted, provided the stored editing data has not been deleted. Removal can be requested using the contact details. Reut Cosmetics may remove spam, impersonation, personal information about others shared without permission, threats, harassment, discriminatory, misleading, unlawful, or unrelated content, using reasonable judgment. A substantive review will not be removed merely because it is negative or expresses dissatisfaction.",
  },
  touPrivacyTitle: { he: "פרטיות ומידע אישי", en: "Privacy and Personal Information" },
  touPrivacyText: {
    he: "איסוף מידע אישי, השימוש בו, שמירתו והזכויות הנוגעות אליו מפורטים במדיניות הפרטיות, המהווה חלק מתנאים אלה:",
    en: "The collection, use, and retention of personal information and the rights relating to it are detailed in the Privacy Policy, which forms part of these terms:",
  },
  touIpTitle: { he: "קניין רוחני", en: "Intellectual Property" },
  touIpText: {
    he: "הזכויות בתכנים המקוריים של האתר, לרבות עיצוב, טקסטים, תמונות ולוגו, שייכות ל-Reut Cosmetics או משמשות אותה ברישיון. סימנים, שירותים ותכנים של צדדים שלישיים, לרבות Google,‏ WhatsApp ו-Waze, שייכים לבעליהם. ביקורות נשארות של הכותבות בכפוף לרישיון ההצגה שניתן לעיל. אין להעתיק, להפיץ, לשנות או לעשות שימוש מסחרי בתכני האתר ללא הרשאה מראש או זכות מפורשת בדין.",
    en: "Rights in the site's original content, including design, text, images, and logo, belong to Reut Cosmetics or are used under license. Third-party marks, services, and content, including Google, WhatsApp, and Waze, belong to their respective owners. Reviews remain their authors' content, subject to the display license above. Site content may not be copied, distributed, modified, or commercially used without prior permission or an express legal right.",
  },
  touLiabilityTitle: {
    he: "המידע באתר ואחריות",
    en: "Website Information and Responsibility",
  },
  touLiabilityText: {
    he: "המידע באתר הוא כללי ואינו מחליף אבחון או ייעוץ רפואי אישי של גורם מוסמך. תוצאות הטיפול משתנות מאדם לאדם; תמונות ודוגמאות באתר אינן מבטיחות תוצאה זהה אצלך. לפני רכישה ניתן לפנות לקבלת הסבר על השירות ועל התאמתו לצרכייך. קישורים ושירותים של צדדים שלישיים כפופים לתנאיהם, ותוכנם וזמינותם אינם בשליטת Reut Cosmetics. ייתכנו תקלות או הפסקות זמניות בפעילות האתר. אין באמור בסעיף זה כדי לפטור את העסק מחובת זהירות, מאחריות מקצועית, מהתחייבות כלפייך או מאחריות שלא ניתן להגביל לפי דין.",
    en: "Information on the site is general and does not replace individual diagnosis or medical advice from a qualified professional. Treatment results vary; images and examples on the site do not guarantee the same result for you. Before purchasing, you may contact us for an explanation of the service and its suitability for your needs. Third-party links and services are subject to their own terms, and their content and availability are outside Reut Cosmetics' control. Technical faults or temporary interruptions may occur. Nothing in this section releases the business from its duty of care, professional responsibility, commitments to you, or liability that cannot lawfully be limited.",
  },
  touProhibitedTitle: { he: "שימוש אסור באתר", en: "Prohibited Use" },
  touProhibitedText: {
    he: "אין להשתמש באתר למטרה בלתי חוקית, להתחזות לאחרת, לפרסם ביודעין מידע כוזב, לאיים, להטריד או לפגוע בזכויות של אחרים. אין לנסות לגשת ללא הרשאה למערכות, לחשבונות או למידע, להחדיר קוד מזיק, לשבש את פעילות האתר או לאסוף מידע באופן אוטומטי בהיקף הפוגע באתר או במשתמשותיו. הוראות אלה אינן מונעות שימוש חוקי וסביר באתר, שימוש בכלי נגישות או פרסום ביקורת עניינית בהתאם לכללים לעיל.",
    en: "Do not use the site for unlawful purposes, impersonate others, knowingly post false information, threaten, harass, or violate others' rights. Do not attempt unauthorized access to systems, accounts, or information, introduce malicious code, disrupt the site, or collect information automatically at a scale that harms the site or its users. These rules do not prevent lawful and reasonable use, use of accessibility tools, or substantive reviews that follow the rules above.",
  },
  touChangesTitle: { he: "שינויים בתנאים", en: "Changes to These Terms" },
  touChangesText: {
    he: "Reut Cosmetics רשאית לעדכן תנאים אלה מעת לעת. תאריך העדכון יופיע בתחתית העמוד, ועל שינוי מהותי תפורסם הודעה בולטת ככל שנדרש לפי דין. הנוסח המעודכן יחול על השימוש באתר לאחר פרסומו. הוא לא ישנה בדיעבד תנאים של עסקה שכבר אושרה ולא יגרע מזכויות שניתנו לך לפי דין.",
    en: "Reut Cosmetics may update these terms from time to time. The revision date will appear at the bottom of the page, and material changes will be prominently announced where required by law. The updated wording applies to use of the site after publication. It will not retrospectively change the terms of an already confirmed transaction or reduce your statutory rights.",
  },
  touJurisdictionTitle: { he: "דין וסמכות שיפוט", en: "Governing Law and Jurisdiction" },
  touJurisdictionText: {
    he: "על תנאים אלה יחולו דיני מדינת ישראל. כל מחלוקת תידון בבית המשפט המוסמך בהתאם להוראות הדין ולכללי הסמכות החלים, מבלי לשלול מהלקוחה זכות דיונית המוקנית לה לפי דין.",
    en: "These terms are governed by the laws of the State of Israel. Any dispute will be heard by a competent court under applicable jurisdiction rules, without limiting any procedural right granted to the customer by law.",
  },
  touSeverabilityTitle: { he: "הפרדת הוראות", en: "Severability" },
  touSeverabilityText: {
    he: "אם ייקבע שהוראה מתנאים אלה אינה תקפה או אינה ניתנת לאכיפה, היא תצומצם או תופרד במידה הנדרשת, ויתר ההוראות יוסיפו לעמוד בתוקפן. בכל מקרה יגברו הוראות דין שאי אפשר להתנות עליהן.",
    en: "If a provision of these terms is found invalid or unenforceable, it will be limited or severed only to the extent necessary, and the remaining provisions will continue in effect. Mandatory legal provisions prevail in all cases.",
  },
  touContactTitle: { he: "יצירת קשר", en: "Contact Us" },
  touContactIntroBefore: {
    he: "לשאלות על תנאי השימוש, לבירור פרטי שירות או לפנייה הנוגעת לתור, לרכישה או לביקורת, ניתן ליצור קשר ב-",
    en: "For questions about these terms, service details, or an appointment, purchase, or review, contact us via ",
  },
  touContactIntroAfter: {
    he: ". מומלץ לציין את נושא הפנייה ואת הפרטים הדרושים לאיתורה.",
    en: ". Please include the subject of your inquiry and the details needed to identify it.",
  },
  // The date itself is server-computed (see TermsOfUse.tsx) — this is only
  // the fixed lead-in text, no longer admin-editable as free text.
  touLastUpdatedPrefix: {
    he: "תנאי שימוש אלה עודכנו לאחרונה בתאריך",
    en: "These terms of use were last updated on",
  },

  // ---------- Accessibility statement page ----------
  asCommitmentTitle: { he: "מחויבות לנגישות", en: "Accessibility Commitment" },
  asCommitmentText: {
    he: "ב-Reut Cosmetics אנו פועלות לאפשר לכלל הלקוחות, לרבות אנשים עם מוגבלות, לקבל מידע ושירות בצורה נוחה, מכבדת ושוויונית. הצהרה זו מתארת את התאמות הנגישות באתר, את המגבלות הידועות ואת דרכי הפנייה לקבלת סיוע או לדיווח על קושי. אנו פועלות לשיפור הנגישות בהתאם להוראות הדין החלות.",
    en: "At Reut Cosmetics, we work to make information and services convenient, respectful, and equally accessible to all customers, including people with disabilities. This statement describes the site's accessibility features, known limitations, and ways to request assistance or report a difficulty. We work to improve accessibility in accordance with applicable legal requirements.",
  },
  asMeasuresTitle: { he: "התאמות הנגישות באתר", en: "Accessibility Measures on the Site" },
  asMeasure1: {
    he: "חלוקה לכותרות, לאזור ניווט ולתוכן מרכזי, כדי לסייע בהתמצאות באתר ובקריאה באמצעות טכנולוגיות מסייעות.",
    en: "Headings, a navigation region, and a main content region help users find their way around the site and read it with assistive technology.",
  },
  asMeasure2: {
    he: "תיאורי טקסט לתמונות תוכן, כדי להעביר מידע גם למי שמשתמשת בקורא מסך.",
    en: "Text descriptions for content images help convey information to people using screen readers.",
  },
  asMeasure3: {
    he: "אפשר לעבור בין קישורים, כפתורים ושדות באמצעות Tab ו-Shift+Tab. ניתן לסגור את תפריט הצד באמצעות Escape. מגבלה בפתיחת תפריט הנגישות באמצעות מקלדת מפורטת בהמשך.",
    en: "Tab and Shift+Tab move between links, buttons, and fields. Escape closes the side menu. A limitation affecting keyboard access to the accessibility menu is described below.",
  },
  asMeasure4: {
    he: "תוויות לשדות בטפסים והודעות שגיאה המסייעות לזהות מידע חסר או שגוי.",
    en: "Form-field labels and error messages help identify missing or incorrect information.",
  },
  asMeasure5: {
    he: "תפריט נגישות עם אפשרויות להגדלת טקסט, לשינוי ניגודיות, לעצירת אנימציות, להדגשת קישורים בקו תחתון, להצגה בגווני אפור ולהחלפת הגופן הדקורטיבי של שם המותג בגופן קריא יותר.",
    en: "An accessibility menu offers larger text, contrast adjustments, stopped animations, underlined links, grayscale display, and a more readable font in place of the decorative brand-name font.",
  },
  asLevelTitle: {
    he: "יעד הנגישות והיקף הבדיקה",
    en: "Accessibility Target and Scope of Assessment",
  },
  asLevelText: {
    he: "יעד ההנגשה של האתר הוא דרישות תקן ישראלי ת״י 5568 חלק 1 ברמה AA, המבוסס על הנחיות WCAG 2.0 ובכפוף להתאמות שבתקן הישראלי. ההצהרה מתארת את האפשרויות שנבדקו באתר ואת המגבלות הידועות במועד העדכון. היא אינה אישור לעמידה מלאה בתקן או תחליף לבדיקת נגישות מקצועית מקיפה.",
    en: "The site's accessibility target is Israeli Standard SI 5568 Part 1 at level AA, based on WCAG 2.0 and subject to the adaptations in the Israeli standard. This statement describes the features checked on the site and the limitations known as of the revision date. It is not certification of full compliance or a substitute for a comprehensive professional accessibility assessment.",
  },
  asLimitationsTitle: { he: "מגבלות ידועות", en: "Known Limitations" },
  asLimitationsText: {
    he: "בבדיקה נמצא שכפתור פתיחת תפריט הנגישות מגיב ללחיצה בעכבר או במגע, אך אינו פותח את התפריט באמצעות Enter או מקש הרווח. ניתן להשתמש בהגדלת התצוגה של הדפדפן ולפנות אלינו לקבלת סיוע. תכנים ושירותים חיצוניים, כגון מפת Google Maps, אינם בשליטתנו המלאה ועלולים להציב קשיי נגישות נוספים. רשימה זו אינה תוצאה של מבדק נגישות מקיף; אם נתקלת בקושי אחר, נשמח לקבל דיווח ולבדוק דרך חלופית לקבלת המידע או השירות.",
    en: "Testing found that the accessibility-menu button responds to mouse clicks or touch but does not open the menu using Enter or Space. You can use browser zoom and contact us for assistance. External content and services, such as Google Maps, are not fully under our control and may present additional accessibility difficulties. This list is not the result of a comprehensive accessibility audit; if you encounter another difficulty, please report it so we can explore an alternative way to provide the information or service.",
  },
  asContactTitle: { he: "פנייה בנושא נגישות", en: "Accessibility Inquiries" },
  asContactIntroBefore: {
    he: "נתקלת בקושי בגלישה, במילוי טופס או בקבלת מידע? אפשר לפנות אלינו לבירור, לבקשת סיוע או להצעת שיפור באמצעות ",
    en: "Having difficulty browsing, completing a form, or obtaining information? You can contact us to ask a question, request assistance, or suggest an improvement via ",
  },
  asContactIntroAfter: {
    he: " או אימייל: ",
    en: " or email: ",
  },
  asCoordinatorEmail: { he: "codedly.il@gmail.com", en: "codedly.il@gmail.com" },
  asComplaintsTitle: {
    he: "פנייה לנציבות שוויון זכויות לאנשים עם מוגבלות",
    en: "Contacting the Commission for Equal Rights of Persons with Disabilities",
  },
  asComplaintsText: {
    he: "לצד האפשרות לפנות אלינו, ניתן להגיש לנציבות שוויון זכויות לאנשים עם מוגבלות במשרד המשפטים תלונה על הפליה בשל מוגבלות או על אי־ביצוע הוראות הנגישות. מידע על אופן ההגשה מופיע בשירות הרשמי:",
    en: "In addition to contacting us, you may submit a complaint to the Ministry of Justice's Commission for Equal Rights of Persons with Disabilities about disability discrimination or failure to implement accessibility requirements. Submission instructions are available through the official service:",
  },
  // The date itself is server-computed (see AccessibilityStatement.tsx) —
  // this is only the fixed lead-in text, no longer admin-editable as free
  // text.
  asLastUpdatedPrefix: {
    he: "הצהרת נגישות זו עודכנה לאחרונה בתאריך",
    en: "This accessibility statement was last updated on",
  },
  asUsageTitle: {
    he: "שימוש באפשרויות הנגישות",
    en: "Using the Accessibility Options",
  },
  asUsageText: {
    he: "לחיצה או נגיעה בכפתור עם סמל הנגישות שבשולי המסך פותחת את התפריט. לחיצות חוזרות על הגדלת הטקסט מחליפות בין שלוש רמות גודל; את יתר האפשרויות אפשר להפעיל ולכבות בנפרד. אפשר להחזיר את ההגדרות לברירת המחדל באמצעות כפתור האיפוס. ניתן גם להגדיל את תצוגת האתר דרך תפריט הדפדפן, ללא פתיחת תפריט הנגישות.",
    en: "Click or tap the accessibility-symbol button at the edge of the screen to open the menu. Repeatedly selecting the text-size option cycles through three sizes; other options can be turned on and off individually. The reset button restores the default settings. You can also enlarge the site through your browser's zoom menu without opening the accessibility menu.",
  },
  asContactDetails: {
    he: "כדי לסייע בבדיקה, מומלץ לציין את כתובת העמוד, את הפעולה שניסית לבצע ואת הקושי שנתקלת בו. אם ידוע לך, אפשר להוסיף את סוג המכשיר, הדפדפן והטכנולוגיה המסייעת שבה השתמשת, וכן דרך נוחה לחזור אלייך. אין צורך באבחון טכני כדי לפנות, ואין צורך לצרף מידע רפואי.",
    en: "To help us investigate, please include the page address, what you were trying to do, and the difficulty encountered. If known, you can also include your device, browser, any assistive technology used, and a convenient way to reply. You do not need a technical diagnosis to contact us, and there is no need to attach medical information.",
  },
  asContactResponse: {
    he: "נבדוק את הפנייה ונשיב בהקדם האפשרי. אם נדרש בירור נוסף, נעדכן על המשך הטיפול ונבחן איתך אפשרות לקבל את המידע או השירות בדרך חלופית המתאימה לצורך שתיארת.",
    en: "We will review your inquiry and reply as soon as possible. If further investigation is needed, we will update you on the next steps and explore an alternative way to provide the information or service that meets the need you described.",
  },
  asVisitTitle: {
    he: "בירור נגישות לפני הגעה לקליניקה",
    en: "Accessibility Information Before Visiting the Clinic",
  },
  asVisitTextBefore: {
    he: "לקבלת מידע על נגישות הקליניקה ברחוב משה רחמילביץ 34, ירושלים, אפשר לפנות ב-",
    en: "For accessibility information about the clinic at 34 Moshe Rachmilevitz Street, Jerusalem, you can contact us via",
  },
  asVisitTextAfter: {
    he: " לפני ההגעה. החניה ברחוב כפופה לחוקי החניה של עיריית ירושלים, והכניסה למקום כוללת מדרגות ללא מעלית. ניתן לברר על מרחב התנועה, שירותים ופרטים נוספים, ולתאר התאמה הנדרשת לך לצורך הביקור. פרטי ההתאמות הפיזיות הנוספים במקום אינם מפורטים בהצהרה זו, ואין בתיאור נגישות האתר כדי להעיד על נגישות המבנה.",
    en: " before visiting. Street parking is subject to Jerusalem Municipality parking regulations, and the entrance includes stairs with no elevator. You may ask about space to move around, toilets, and other details, and describe any adjustment you need for your visit. Additional physical accessibility arrangements are not detailed in this statement; the description of website accessibility does not establish the accessibility of the premises.",
  },
  asComplaintsLink: {
    he: "למידע ולהגשת תלונה באתר הנציבות",
    en: "Complaint information and submission on the Commission's website",
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
    he: "האם את רגישה לתכשירים קוסמטיים (אלרגיות למשחות/תרופות/חומרים כלשהם)?",
    en: "Are you sensitive to cosmetic products (allergies to ointments/medications/any substances)?",
  },
  hdQ2: {
    he: "האם את סובלת ממחלת עור, גירוי או פצע באזור המיועד לטיפול?",
    en: "Do you have a skin condition, irritation, or a wound in the area intended for treatment?",
  },
  hdQ3: {
    he: "האם את סובלת מריפוי איטי של פצעים/הצטלקותם?",
    en: "Do you suffer from slow wound healing or scarring?",
  },
  hdQ4: { he: "האם את בהריון?", en: "Are you pregnant?" },
  hdQ5: {
    he: "האם את נוטלת תרופות באופן קבוע ו/או כדורים לדילול דם?",
    en: "Do you regularly take medication and/or blood-thinning pills?",
  },
  hdQ6: {
    he: "האם את כעת תחת השפעת אלכוהול/סמים/סמים עם מרשם רופא?",
    en: "Are you currently under the influence of alcohol, drugs, or prescription medication?",
  },
  hdQ7: { he: "האם קיים אצלך חוסר באנזים (G6PD)?", en: "Do you have a G6PD enzyme deficiency?" },
  hdQ8: {
    he: "האם את סובלת ממחלת עור מסוג סבוריאה/אקזמה/פסוריאזיס במקום המיועד לטיפול?",
    en: "Do you suffer from a skin condition such as seborrhea, eczema, or psoriasis at the site intended for treatment?",
  },
  hdQ9: { he: "האם את נוטלת כדורים מסוג רקוטאן?", en: "Are you taking Roaccutane-type medication?" },
  hdQ10: {
    he: "האם את לוקחת הורמונים באופן קבוע או בזמן טיפול פוריות IVF?",
    en: "Are you taking hormones regularly or as part of IVF fertility treatment?",
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
    he: "המטפלת תציג לי לפני תחילת הטיפול את הצורה המוצעת בהתאם לתווי פניי, באמצעות שבלונה, סרגל או כלי עזר מתאים. הטיפול יתחיל רק לאחר שאאשר את הצורה. ידוע לי שלאחר תחילת העבודה האפשרות לבצע שינויים עשויה להיות מוגבלת ותלויה בשלב הטיפול, בבטיחות ובשיקול דעת מקצועי.",
    en: "Before treatment begins, the practitioner will show me the proposed shape based on my facial features, using a stencil, ruler, or another suitable aid. Treatment will begin only after I approve the shape. I understand that once work begins, changes may be limited depending on the treatment stage, safety, and professional judgment.",
  },
  hdAgreement2: {
    he: 'ידוע לי כי הצבע המתקבל תלוי בפיגמנט העור שלי ולכן זה שונה מאדם לאדם. לפיכך ידועה לי העובדה כי במקרים מסוימים הצבע עלול להידחות על ידי העור שלי ואתבקש להגיע לטיפול נוסף בתשלום (להלן: "טיפול שלישי").',
    en: 'I understand that the resulting color depends on my skin pigment and therefore differs from person to person. I am accordingly aware that in some cases the color may be rejected by my skin, and I may be asked to come in for an additional paid treatment (hereinafter: "the third treatment").',
  },
  hdAgreement3: {
    he: "ידוע לי כי המחיר שנמסר לי עבור חבילת האיפור הקבוע כולל שני מפגשים בלבד, אלא אם הוסכם אחרת בכתב. כל טיפול נוסף יהיה כפוף להסכמה נפרדת ומראש על מחירו.",
    en: "I understand that the quoted permanent-makeup package price includes two sessions only, unless otherwise agreed in writing. Any additional treatment is subject to separate advance agreement on its price.",
  },
  hdAgreement4: {
    he: "ידוע לי כי אין אחריות על קליטת הפיגמנט בעור והליך המיקרובליידינג הינו אינדיבידואלי ומשתנה מאדם לאדם (סוגי העור שונים וכיוצא בזה).",
    en: "I understand that there is no guarantee regarding how the skin absorbs the pigment, and that the microblading procedure is individual and varies from person to person (different skin types, and so on).",
  },
  hdAgreement5: {
    he: "ידוע לי כי ביטול והחזר כספי יטופלו בהתאם להוראות הדין ולנסיבות העסקה. אם הביטול נעשה לאחר תחילת השירות, ניתן יהיה לחייב עבור החלק שניתן בפועל ובדמי ביטול המותרים בדין, מבלי לגרוע מזכויותיי במקרה של פגם, אי-התאמה או הפרת חובה.",
    en: "I understand that cancellations and refunds are handled under applicable law and the circumstances of the transaction. If cancellation occurs after service has begun, I may be charged for the portion actually provided and any cancellation fee permitted by law, without limiting my rights in the event of a defect, non-conformity, or breach of duty.",
  },
  hdAgreement6: {
    he: "אני מבינה את חשיבות מסירת כל המידע הנוגע לי לפני תחילת העבודה וברור לי שהסתרת מידע רלוונטי הנוגע אלי עלולה לפגוע בתוצאה הסופית ואף לסכן את בריאותי.",
    en: "I understand the importance of disclosing all information relevant to me before work begins, and I understand that withholding any relevant information about myself may harm the final result and even endanger my health.",
  },
  hdAgreement7: {
    he: "אני מבינה את חשיבות הוראות הטיפול בעור לאחר איפור קבוע שאקבל בסיום הטיפול, וכי אי-קיום ההוראות עלול לפגוע בתהליך ההחלמה ובתוצאה.",
    en: "I understand the importance of the permanent-makeup aftercare instructions I will receive at the end of treatment, and that failing to follow them may affect healing and the result.",
  },
  hdAgreement8: {
    he: "ידוע לי כי מומלץ להגיע למפגש השני במועד שייקבע ובתוך הטווח המקצועי שיימסר לי, אשר עשוי להיות עד חודשיים מהמפגש הראשון. דחייה מעבר לטווח המומלץ עלולה להשפיע על התוצאה ולחייב הערכה מקצועית חדשה.",
    en: "I understand that the second session should take place on the scheduled date and within the professional timeframe communicated to me, which may be up to two months after the first session. A delay beyond the recommended period may affect the result and require a new professional assessment.",
  },
  hdAgreement9: {
    he: "אם חלף הטווח המקצועי למפגש השני, המטפלת תבחן מחדש את התאמת הטיפול, ורשאית מטעמי בטיחות או התאמה להציע מועד או טיפול חלופי, או שלא לבצעו. כל חיוב נוסף יימסר ויאושר מראש ובכפוף לדין.",
    en: "If the professional timeframe for the second session has passed, the practitioner will reassess suitability and may, for safety or suitability reasons, offer another date or treatment or decline to perform it. Any additional charge will be disclosed and approved in advance, subject to law.",
  },
  hdAgreement10: {
    he: "אלא אם הוסכם אחרת בכתב, מלוא מחיר חבילת שני המפגשים ישולם מראש בהתאם להצעה שנמסרה לי.",
    en: "Unless otherwise agreed in writing, the full price of the two-session package will be paid in advance according to the quote provided to me.",
  },
  // Risk information: https://www.fda.gov/consumers/consumer-updates/think-you-ink-tattoo-safety
  hdAgreementRisks: {
    he: "אני מבינה כי איפור קבוע כרוך בהחדרת פיגמנט לעור. לאחר הטיפול עשויים להופיע אדמומיות, נפיחות ואי־נוחות באזור. סיכונים אפשריים כוללים זיהום, תגובה אלרגית לפיגמנט והצטלקות, לרבות צלקות בולטות. תגובות עלולות להופיע סמוך לטיפול או בשלב מאוחר יותר. במקרה של פריחה, חום או אזור שאינו מחלים, יש לפנות לרופא ולעדכן את המטפלת; פנייה למטפלת אינה מחליפה בדיקה רפואית. לפני מתן הסכמתי אוכל לשאול שאלות ולקבל הסבר על הסיכונים ועל התאמת הטיפול למצבי.",
    en: "I understand that permanent makeup involves inserting pigment into the skin. Redness, swelling, and discomfort may occur in the treated area. Possible risks include infection, an allergic reaction to the pigment, and scarring, including raised scars. Reactions may occur soon after treatment or later. If a rash, fever, or failure to heal occurs, I should seek medical advice and inform the practitioner; contacting the practitioner does not replace a medical assessment. Before giving consent, I can ask questions and receive an explanation of the risks and whether the treatment is suitable for me.",
  },
  hdAgreementCheckboxText: {
    he: "אני מאשרת שקראתי ואני מסכימה להסכם זה",
    en: "I confirm that I have read and agree to this agreement",
  },
  hdSubmit: { he: "שליחת הצהרת הבריאות", en: "Submit Health Declaration" },
  hdSuccessTitle: { he: "תודה שמילאת את הצהרת הבריאות.", en: "Thank you for completing the health declaration." },
  hdSuccessText: {
    he: "הפרטים נשמרו וייבדקו על ידי רעות לפני הטיפול, אם יידרש בירור נוסף ניצור איתך קשר.",
    en: "Your details have been saved and will be reviewed by Reut before your treatment, and we'll contact you if anything needs clarification.",
  },
  hdRequiredNote: {
    he: "שאלות המסומנות בכוכבית אדומה הן שאלות חובה.",
    en: "Questions marked with a red asterisk are required.",
  },
  hdNameRequired: { he: "יש למלא שם מלא", en: "Full name is required" },
  hdNameTooShort: { he: "השם חייב לכלול לפחות 2 אותיות", en: "Name must be at least 2 letters" },
  hdIdNumberRequired: { he: "יש למלא מספר תעודת זהות", en: "ID number is required" },
  hdIdNumberInvalid: { he: "מספר תעודת הזהות אינו תקין", en: "ID number is invalid" },
  hdPhoneRequired: { he: "יש למלא מספר טלפון", en: "Phone number is required" },
  hdPhoneInvalid: { he: "מספר הטלפון אינו תקין", en: "Phone number is invalid" },
  hdAnswerRequired: { he: "יש לבחור תשובה", en: "Please select an answer" },
  hdDetailRequired: { he: "בחרת כן — יש למלא פירוט", en: "You selected Yes — please provide details" },
  hdConfirmationRequired: {
    he: "יש לאשר שתשובותייך בהצהרת הבריאות נכונות ומלאות",
    en: "Please confirm that your health declaration answers are true and complete",
  },
  hdAgreementRequired: { he: "יש לאשר את ההסכם כדי להמשיך", en: "You must accept the agreement to continue" },
  hdSubmitting: { he: "שולח...", en: "Sending..." },
  hdSubmitError: {
    he: "אירעה שגיאה בשליחת הטופס. נסי שוב או צרי קשר טלפוני.",
    en: "An error occurred while submitting the form. Please try again or contact us by phone.",
  },
  spinnerLoading: { he: "טוען", en: "Loading" },

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

  // ---------- Accessibility widget (floating panel — intentionally not
  // admin-editable, per explicit earlier request) ----------
  a11yToggleLabel: { he: "תפריט נגישות (ניתן לגרירה)", en: "Accessibility menu (draggable)" },
  a11yPanelLabel: { he: "אפשרויות נגישות", en: "Accessibility options" },
  a11yPanelTitle: { he: "נגישות", en: "Accessibility" },
  a11yFontSize: { he: "גודל טקסט", en: "Text size" },
  a11yHighContrast: { he: "ניגודיות גבוהה", en: "High contrast" },
  a11yReduceMotion: { he: "עצירת אנימציות", en: "Stop animations" },
  a11yUnderlineLinks: { he: "הדגשת קישורים", en: "Underline links" },
  a11yReadableFont: { he: "גופן קריא", en: "Readable font" },
  a11yGrayscale: { he: "גווני אפור", en: "Grayscale" },
  a11yResetSettings: { he: "איפוס הגדרות", en: "Reset settings" },
  a11yResetPosition: { he: "איפוס מיקום", en: "Reset position" },

  // ---------- Home page: before/after comparison slider ----------
  beforeAfterTitle: { he: "לפני ואחרי", en: "Before and After" },
  beforeAfterBeforeLabel: { he: "לפני", en: "Before" },
  beforeAfterAfterLabel: { he: "אחרי", en: "After" },
  beforeAfterBeforeAlt: { he: "תמונת לפני הטיפול", en: "Before treatment photo" },
  beforeAfterAfterAlt: { he: "תמונת אחרי הטיפול", en: "After treatment photo" },
  beforeAfterHandleLabel: {
    he: "גררי כדי להשוות בין לפני לאחרי",
    en: "Drag to compare before and after",
  },
  beforeAfterExampleLabel: { he: "דוגמה", en: "Example" },
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
  getPageLastUpdated: (page: LegalPage) => string | undefined;
  applyPageLastUpdated: (page: LegalPage, isoDate: string) => void;
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
  const [pageLastUpdated, setPageLastUpdated] = useState<Partial<Record<LegalPage, string>>>({});

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
        if (content.pageLastUpdated) setPageLastUpdated(content.pageLastUpdated);
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

  const applyPageLastUpdated = useCallback((page: LegalPage, isoDate: string) => {
    setPageLastUpdated((prev) => ({ ...prev, [page]: isoDate }));
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
      getPageLastUpdated: (page) => pageLastUpdated[page],
      applyPageLastUpdated,
    }),
    [
      language,
      setLanguage,
      textOverrides,
      imageOverrides,
      applyTextOverride,
      applyImageOverride,
      pageLastUpdated,
      applyPageLastUpdated,
    ]
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
