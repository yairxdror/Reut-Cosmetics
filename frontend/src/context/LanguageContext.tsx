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

  // ---------- Shared legal-page contact line labels ----------
  // legalPhoneLabel: still used standalone by AccessibilityStatement.tsx.
  // legalContactLabel: the combined phone+WhatsApp line used by
  // PrivacyPolicy.tsx/TermsOfUse.tsx (previously two separate lines).
  legalPhoneLabel: { he: "טלפון:", en: "Phone:" },
  legalContactLabel: { he: "בטלפון ובישומון וואטסאפ:", en: "By phone and WhatsApp:" },

  // ---------- Privacy policy page ----------
  ppGeneralTitle: { he: "כללי", en: "General" },
  ppGeneralText: {
    he: "Reut Cosmetics מכבדת את פרטיותך. מדיניות זו היא הודעה בדבר איסוף מידע אישי: היא מסבירה איזה מידע נאסף, האם מסירתו חובה, לאילו מטרות הוא משמש, למי הוא עשוי להימסר, כמה זמן הוא נשמר ומהן זכויותייך. גלישה באתר כשלעצמה אינה מהווה הסכמה לעיבוד שאינו נחוץ להפעלתו; במקום שבו נדרשת הסכמה, היא מתבקשת באופן מפורש בנקודת האיסוף.",
    en: "Reut Cosmetics respects your privacy. This policy is a notice about the collection of personal information: it explains what is collected, whether providing it is mandatory, the purposes of use, potential recipients, retention periods, and your rights. Browsing the site alone is not consent to processing that is not necessary for its operation; where consent is required, it is requested expressly at the point of collection.",
  },
  ppControllerTitle: { he: "בעלת השליטה במאגר ופרטי קשר", en: "Data Controller and Contact Details" },
  ppControllerText: {
    he: "בעלת השליטה במידע היא רעות יעקובי, המפעילה את Reut Cosmetics, בכתובת משה רחמילביץ 34, ירושלים. לפניות בנושא פרטיות ניתן ליצור קשר בטלפון או ב-WhatsApp:",
    en: "The data controller is Reut Yakobi, operator of Reut Cosmetics, at 34 Moshe Rachmilevitz Street, Jerusalem. For privacy inquiries, contact us by phone or WhatsApp:",
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
    he: "לכל שאלה או בקשה הנוגעת למדיניות זו ולמידע האישי שלך, ניתן לפנות אלינו",
    en: "For any question or request regarding this policy or your personal information, you can reach us at:",
  },
  ppUpdatesTitle: { he: "עדכוני מדיניות", en: "Policy Updates" },
  ppUpdatesText: {
    he: "מדיניות זו עשויה להתעדכן מעת לעת. מועד העדכון יופיע בתחתית העמוד. אם יחול שינוי מהותי באופן השימוש במידע, תפורסם הודעה בולטת ובמקום שבו הדין מחייב זאת תתבקש הסכמה חדשה; עצם המשך הגלישה לא יחליף הסכמה מפורשת הנדרשת לפי דין.",
    en: "This policy may be updated from time to time, and the revision date will appear at the bottom of this page. If there is a material change in how information is used, a prominent notice will be posted and, where required by law, renewed consent will be requested; continued browsing alone will not replace express consent required by law.",
  },
  ppLastUpdated: {
    he: "מדיניות פרטיות זו עודכנה לאחרונה בתאריך 02.09.2026.",
    en: "This privacy policy was last updated on 02.09.2026.",
  },

  // ---------- Privacy notices at collection points ----------
  privacyPolicyLinkLabel: { he: "למדיניות הפרטיות המלאה", en: "Read the full privacy policy" },
  hdPrivacyNoticeTitle: { he: "פרטיות והסכמה למסירת מידע רפואי", en: "Privacy and Consent to Provide Health Information" },
  hdPrivacyNoticeText: {
    he: "המידע בטופס נמסר מרצונך לבעלת השליטה במידע, רעות יעקובי — Reut Cosmetics, ומשמש לבדיקת התאמה ובטיחות לפני טיפול. ללא המידע לא ניתן לבצע את הבדיקה או להעניק טיפול המחייב אותה. תוכן ההצהרה מוצפן ונשמר בתשתיות Google/Firebase עד 7 שנים, ונגיש רק למורשות. ניתן לפנות בטלפון או ב-WhatsApp המופיעים במדיניות לצורך עיון, תיקון או בקשה למחיקה, בכפוף לדין.",
    en: "The information in this form is provided voluntarily to the data controller, Reut Yakobi — Reut Cosmetics, and is used to assess treatment suitability and safety. Without it, the assessment or a treatment requiring it cannot be provided. Declaration content is encrypted and stored on Google/Firebase infrastructure for up to seven years, with access limited to authorized persons. Use the phone or WhatsApp listed in the policy to request access, correction, or deletion, subject to law.",
  },
  hdPrivacyConsentText: {
    he: "קראתי את הודעת הפרטיות ואני מסכימה לאיסוף, לשימוש ולאחסון של פרטי הזיהוי והמידע הרפואי שמסרתי למטרות המפורטות בה",
    en: "I have read the privacy notice and consent to the collection, use, and storage of the identification and health information I provided for the stated purposes",
  },
  hdPrivacyConsentRequired: { he: "יש לאשר את הודעת הפרטיות כדי להמשיך", en: "You must accept the privacy notice to continue" },
  reviewPrivacyNoticeText: {
    he: "השם, הדירוג ותוכן הביקורת יישמרו ויוצגו בפומבי באתר. המסירה היא לבחירתך; ללא הסכמה לפרסום לא ניתן לשלוח ביקורת. ניתן לבקש את הסרתה באמצעות פרטי הקשר שבמדיניות הפרטיות.",
    en: "Your name, rating, and review text will be stored and displayed publicly on the site. Providing them is optional; without publication consent, the review cannot be submitted. You may request removal using the contact details in the privacy policy.",
  },
  reviewPublishConsentText: {
    he: "אני מסכימה לפרסום שמי, הדירוג ותוכן הביקורת באתר",
    en: "I consent to the publication of my name, rating, and review text on the site",
  },
  reviewConsentRequired: { he: "יש לאשר את פרסום הביקורת כדי להמשיך", en: "You must approve publication of the review to continue" },

  // ---------- Terms of use page ----------
  touGeneralTitle: { he: "כללי", en: "General" },
  touGeneralText: {
    he: "תנאים אלה מסדירים את השימוש באתר Reut Cosmetics. האתר מיועד להצגת מידע, יצירת קשר, פרסום ביקורות ומתן גישה לשירותים נלווים; הוא אינו מאפשר כרגע ביצוע תשלום או השלמת הזמנה באופן מקוון. השימוש באתר כפוף לתנאים אלה. אם אינך מסכימה להם, יש להימנע מן השימוש באתר. אין בתנאים כדי לגרוע מזכות או מהגנה שלא ניתן להתנות עליהן לפי דין.",
    en: "These terms govern use of the Reut Cosmetics website. The site provides information, contact options, customer reviews, and access to related services; it does not currently process payments or complete bookings online. Use of the site is subject to these terms. If you do not agree, please refrain from using it. Nothing in these terms limits any right or protection that cannot lawfully be waived.",
  },
  touOperatorTitle: { he: "מפעילת האתר ופרטי העסק", en: "Website Operator and Business Details" },
  touOperatorText: {
    he: "האתר והשירותים מופעלים בידי רעות יעקובי — Reut Cosmetics, בכתובת משה רחמילביץ 34, ירושלים. ניתן ליצור קשר בטלפון או ב-WhatsApp:",
    en: "The site and services are operated by Reut Yakobi — Reut Cosmetics, at 34 Moshe Rachmilevitz Street, Jerusalem. Contact is available by phone or WhatsApp:",
  },
  touServicesTitle: { he: "השירותים המוצעים", en: "Services Offered" },
  touServicesText: {
    he: "Reut Cosmetics מציעה טיפולי איפור קבוע, לרבות מיקרובליידינג, איפור כלות וערב, הסרת שיער בשעווה באזור הפנים וקורסי הכשרה מקצועיים. התיאור באתר הוא כללי; התאמת הטיפול, היקפו, מחירו, מועדי המפגשים והתנאים הייחודיים לו יימסרו ויאושרו לפני ביצוע עסקה. במקרה של סתירה בין מידע כללי באתר לבין הצעה או הסכם פרטני שאושרו כדין, יחול המסמך הפרטני, בכפוף להוראות הדין.",
    en: "Reut Cosmetics offers permanent makeup treatments, including microblading, bridal and evening makeup, facial waxing, and professional training courses. Site descriptions are general; treatment suitability, scope, price, session dates, and service-specific terms will be disclosed and approved before a transaction is concluded. If general site information conflicts with a lawfully approved individual quote or agreement, the individual document applies, subject to applicable law.",
  },
  touBookingTitle: { he: "יצירת קשר, קביעת תור והרשמה לקורס", en: "Contact, Appointments, and Course Enrollment" },
  touBookingText: {
    he: "שליחת טופס, פתיחת קישור WhatsApp, שיחת טלפון או בקשת מידע אינן קובעות תור ואינן משלימות הרשמה או עסקה. תור או הרשמה לקורס יחייבו רק לאחר אישור מפורש של Reut Cosmetics ושל הלקוחה, ולאחר מסירת הפרטים המהותיים הנדרשים, לרבות סוג השירות, מחיר, תנאי תשלום, מועד ותנאי ביטול. זמינות המועדים עשויה להשתנות עד לקבלת אישור סופי.",
    en: "Submitting a form, opening a WhatsApp link, making a phone call, or requesting information does not book an appointment or complete an enrollment or transaction. An appointment or course enrollment becomes binding only after express confirmation by both Reut Cosmetics and the customer and disclosure of the required material details, including service type, price, payment terms, date, and cancellation terms. Availability may change until final confirmation is given.",
  },
  touHealthTitle: { he: "הצהרת בריאות", en: "Health Declaration" },
  touHealthText: {
    he: "לפני טיפול המחייב בדיקת התאמה תתבקש הלקוחה למלא הצהרת בריאות מלאה ומדויקת ולעדכן בכל שינוי רלוונטי. מידע חסר או שגוי עלול לפגוע בבטיחות הטיפול או בתוצאתו. Reut Cosmetics רשאית לדחות, להפסיק או לסרב לבצע טיפול אם קיים חשש בטיחותי או אם חסר מידע הנחוץ לבדיקת ההתאמה. אחריות הלקוחה למסירת מידע נכון אינה גורעת מחובות המטפלת, מאחריות מקצועית החלה עליה או מזכויות הלקוחה לפי דין.",
    en: "Before a treatment that requires a suitability assessment, the customer will be asked to complete an accurate and complete health declaration and report relevant changes. Missing or incorrect information may affect treatment safety or results. Reut Cosmetics may postpone, stop, or decline a treatment where there is a safety concern or information needed for the assessment is missing. The customer's responsibility to provide accurate information does not limit the practitioner's duties, applicable professional responsibility, or the customer's legal rights.",
  },
  touPaymentTitle: { he: "תשלום, ביטול והחזרים", en: "Payment, Cancellation, and Refunds" },
  touPayment1: {
    he: "התנאים הנוגעים לשני מפגשים חלים רק על חבילת איפור קבוע שנמכרה כחבילה כזו. תנאי איפור כלות וערב, שעווה בפנים וקורסים יימסרו בנפרד לפני ביצוע העסקה.",
    en: "Terms referring to two sessions apply only to a permanent-makeup package sold as such. Terms for bridal and evening makeup, facial waxing, and courses will be disclosed separately before the transaction.",
  },
  touPayment2: {
    he: "אלא אם הוסכם אחרת בכתב, מחיר חבילת האיפור הקבוע כולל שני מפגשים ומשולם מראש בהתאם להצעה שנמסרה ללקוחה. כל טיפול נוסף מחייב הסכמה נפרדת למחירו לפני ביצועו.",
    en: "Unless otherwise agreed in writing, the permanent-makeup package price covers two sessions and is paid in advance according to the quote provided to the customer. Any additional treatment requires separate price approval before it is performed.",
  },
  touPayment3: {
    he: "ביטול עסקה והחזר כספי יטופלו בהתאם לחוק הגנת הצרכן, לתקנות החלות ולנסיבות העסקה. כאשר הדין מאפשר ביטול לאחר שהשירות החל, ניתן יהיה לחייב בתמורה היחסית עבור השירות שניתן בפועל ובדמי ביטול המותרים בדין, ככל שמותר לגבותם. אין בסעיף זה כדי לשלול זכות בשל פגם, אי-התאמה או הפרת חובה לפי דין.",
    en: "Cancellations and refunds are handled under the Israeli Consumer Protection Law, applicable regulations, and the circumstances of the transaction. Where the law permits cancellation after service has begun, the customer may be charged the proportionate value of services actually provided and any cancellation fee lawfully permitted. This clause does not limit rights arising from a defect, non-conformity, or breach of a legal duty.",
  },
  touPayment4: {
    he: "קליטת הפיגמנט והתוצאה משתנות לפי סוג העור, תגובת הגוף, אורח החיים והקפדה על הוראות הטיפול. אם לאחר שני המפגשים יומלץ על מפגש נוסף, הצורך בו, מחירו ומועדו יימסרו ללקוחה ויאושרו מראש.",
    en: "Pigment retention and results vary according to skin type, individual response, lifestyle, and adherence to aftercare instructions. If an additional session is recommended after the two included sessions, its purpose, price, and date will be disclosed and approved in advance.",
  },
  touPayment5: {
    he: "יש להגיע למפגש השני במועד שייקבע, ובדרך כלל בתוך פרק הזמן המקצועי שיימסר ללקוחה, אשר עשוי להיות עד חודשיים מהמפגש הראשון. דחייה מעבר לטווח המומלץ עלולה להשפיע על התוצאה ולחייב הערכה מקצועית חדשה.",
    en: "The second session should take place on the agreed date and generally within the professional timeframe communicated to the customer, which may be up to two months after the first session. A delay beyond the recommended period may affect the result and require a new professional assessment.",
  },
  touPayment6: {
    he: "בקשה לשינוי או ביטול מועד יש למסור מוקדם ככל האפשר בטלפון או ב-WhatsApp. דמי ביטול, אובדן מקדמה או חיוב בגין אי-הגעה יחולו רק אם נמסרו ואושרו מראש ובמידה המותרת לפי דין.",
    en: "A request to change or cancel an appointment should be made as early as possible by phone or WhatsApp. A cancellation fee, loss of a deposit, or no-show charge applies only if disclosed and agreed in advance and to the extent permitted by law.",
  },
  touPayment7: {
    he: "אם עסקה נכרתת מרחוק, לרבות בטלפון או ב-WhatsApp בעקבות פנייה דרך האתר, יימסרו ללקוחה הפרטים ודרכי הביטול הנדרשים לפי דין. ניתן למסור הודעת ביטול באמצעות פרטי הקשר המופיעים בתנאים אלה, בכפוף לסוג העסקה ולהוראות החוק.",
    en: "If a transaction is concluded remotely, including by phone or WhatsApp following contact through the site, the customer will receive the disclosures and cancellation methods required by law. A cancellation notice may be delivered using the contact details in these terms, subject to the transaction type and applicable law.",
  },
  touPayment8: {
    he: "הרשמה לקורס כפופה לתוכנית, למועדים, למחיר ולתנאים שיימסרו בכתב לפני ההרשמה. זכות הביטול של קורס וכל החזר ייקבעו לפי הדין החל ומועד תחילת הקורס; תנאי פרטני לא יגרע מזכות שלא ניתן להתנות עליה.",
    en: "Course enrollment is subject to the syllabus, dates, price, and terms provided in writing before enrollment. Course cancellation rights and refunds are determined by applicable law and the course start date; individual terms do not limit rights that cannot lawfully be waived.",
  },
  touReviewsTitle: { he: "ביקורות לקוחות", en: "Customer Reviews" },
  touReviewsText: {
    he: "ביקורות משקפות את דעת הכותבות ואינן מבטאות את עמדת Reut Cosmetics. שולחת הביקורת מאשרת שהיא מתארת חוויה אישית ואמיתית, שאינה מתחזה לאחרת ושאין בתוכן הפרת דין או זכויות של צד שלישי. בשליחת ביקורת ניתן ל-Reut Cosmetics רישיון לא בלעדי וללא תמורה להציג אותה באתר. ניתן לערוך ביקורת במשך 15 דקות לאחר פרסומה ולבקש את הסרתה באמצעות פרטי הקשר. Reut Cosmetics רשאית שלא לפרסם או להסיר ספאם, התחזות, מידע אישי של אחרים, תוכן פוגעני, מטעה, בלתי חוקי או שאינו קשור לשירות, תוך הפעלת שיקול דעת סביר.",
    en: "Reviews reflect their authors' opinions and do not express the position of Reut Cosmetics. A submitter confirms that the review describes a genuine personal experience, does not impersonate another person, and does not violate law or third-party rights. By submitting a review, the author grants Reut Cosmetics a non-exclusive, royalty-free license to display it on the site. A review may be edited for 15 minutes after publication, and removal may be requested using the contact details. Reut Cosmetics may decline to publish or remove spam, impersonation, another person's personal information, offensive, misleading, unlawful, or unrelated content, using reasonable judgment.",
  },
  touPrivacyTitle: { he: "פרטיות ומידע אישי", en: "Privacy and Personal Information" },
  touPrivacyText: {
    he: "איסוף מידע אישי והשימוש בו מתוארים במדיניות הפרטיות, המהווה חלק מתנאים אלה. במקום שבו נדרשת הסכמה נפרדת לעיבוד מידע או לפרסום ביקורת, היא תתבקש באופן מפורש:",
    en: "The collection and use of personal information are described in the Privacy Policy, which forms part of these terms. Where separate consent is required for data processing or review publication, it will be requested expressly:",
  },
  touIpTitle: { he: "קניין רוחני", en: "Intellectual Property" },
  touIpText: {
    he: "הזכויות בתכנים המקוריים של האתר, לרבות עיצוב, טקסטים, תמונות ולוגו, שייכות ל-Reut Cosmetics או משמשות אותה ברישיון. סימנים, שירותים ותכנים של צדדים שלישיים, לרבות Google,‏ WhatsApp ו-Waze, שייכים לבעליהם. ביקורות נשארות של הכותבות בכפוף לרישיון ההצגה שניתן לעיל. אין להעתיק, להפיץ, לשנות או לעשות שימוש מסחרי בתכני האתר ללא הרשאה מראש או זכות מפורשת בדין.",
    en: "Rights in the site's original content, including design, text, images, and logo, belong to Reut Cosmetics or are used under license. Third-party marks, services, and content, including Google, WhatsApp, and Waze, belong to their respective owners. Reviews remain their authors' content, subject to the display license above. Site content may not be copied, distributed, modified, or commercially used without prior permission or an express legal right.",
  },
  touLiabilityTitle: { he: "הגבלת אחריות", en: "Limitation of Liability" },
  touLiabilityText: {
    he: "המידע באתר הוא כללי ואינו מהווה אבחון, ייעוץ רפואי או תחליף להתייעצות עם גורם רפואי מוסמך. תוצאות טיפול משתנות מאדם לאדם ואין התחייבות לתוצאה מסוימת, אך אין בכך כדי לגרוע מחובת זהירות, מאחריות מקצועית או מאחריות אחרת החלה לפי דין. האתר עשוי לכלול קישורים ותוכן של צדדים שלישיים; השימוש בהם כפוף לתנאיהם ואינו מהווה המלצה או אחריות לתוכנם. Reut Cosmetics אינה אחראית להפרעות זמניות באתר או לנזק שלא ניתן היה לצפותו באופן סביר, והכול במידה המרבית המותרת לפי דין.",
    en: "Information on the site is general and is not a diagnosis, medical advice, or a substitute for consultation with a qualified medical professional. Treatment results vary and no specific result is promised, but this does not limit any duty of care, professional responsibility, or other liability imposed by law. The site may include third-party links and content; their use is subject to their own terms and does not constitute endorsement or responsibility for their content. Reut Cosmetics is not responsible for temporary site interruptions or damage that could not reasonably have been foreseen, to the fullest extent permitted by law.",
  },
  touProhibitedTitle: { he: "שימוש אסור באתר", en: "Prohibited Use" },
  touProhibitedText: {
    he: "אין להשתמש באתר למטרה בלתי חוקית; להתחזות לאחרת; למסור תוכן כוזב או פוגעני; לפגוע בזכויות צד שלישי; לנסות לקבל גישה ללא הרשאה למערכות, לחשבונות או למידע; להחדיר קוד מזיק; לשבש את פעילות האתר; או לבצע איסוף אוטומטי בהיקף הפוגע באתר או במשתמשותיו. אין באמור כדי למנוע שימוש חוקי, סביר ונגיש באתר.",
    en: "The site may not be used for unlawful purposes; impersonation; false or abusive content; violation of third-party rights; unauthorized access to systems, accounts, or information; introduction of malicious code; disruption of the site; or automated collection at a scale that harms the site or its users. This does not restrict lawful, reasonable, and accessible use of the site.",
  },
  touChangesTitle: { he: "שינויים בתנאים", en: "Changes to These Terms" },
  touChangesText: {
    he: "Reut Cosmetics רשאית לעדכן תנאים אלה מעת לעת. מועד העדכון יופיע בתחתית העמוד, ובשינוי מהותי תפורסם הודעה בולטת ככל שנדרש. שינוי לא יחול למפרע על עסקה שכבר נכרתה ולא יגרע מזכות שהוקנתה ללקוחה לפי דין. המשך שימוש לאחר פרסום עדכון יחיל את הנוסח החדש על שימוש עתידי באתר בלבד.",
    en: "Reut Cosmetics may update these terms from time to time. The revision date will appear at the bottom of the page, and a material change will be prominently announced where required. A change will not apply retroactively to an existing transaction or reduce a right granted by law. Continued use after publication applies the revised terms only to future use of the site.",
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
  touContactIntro: {
    he: "לכל שאלה בנוגע לתנאי השימוש ניתן לפנות אלינו",
    en: "For any question regarding these terms of use, you can reach us at:",
  },
  touLastUpdated: {
    he: "תנאי שימוש אלה עודכנו לאחרונה בתאריך 02.09.2026.",
    en: "These terms of use were last updated on 02.09.2026.",
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
    he: "אני מבינה את חשיבות מסירת כל המידע הנוגע לי לפני תחילת העבודה וברור לי שהסתרת כל מידע רלוונטי הנוגע אלי עלול לפגוע בתוצאה הסופית ואף לסכן את בריאותי.",
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
  hdRequiredNote: {
    he: "שאלות המסומנות בכוכבית אדומה הן שאלות חובה.",
    en: "Questions marked with a red asterisk are required.",
  },
  hdNameRequired: { he: "יש למלא שם מלא", en: "Full name is required" },
  hdIdNumberRequired: { he: "יש למלא מספר תעודת זהות", en: "ID number is required" },
  hdIdNumberInvalid: { he: "מספר תעודת הזהות אינו תקין", en: "ID number is invalid" },
  hdPhoneRequired: { he: "יש למלא מספר טלפון", en: "Phone number is required" },
  hdPhoneInvalid: { he: "מספר הטלפון אינו תקין", en: "Phone number is invalid" },
  hdAnswerRequired: { he: "יש לבחור תשובה", en: "Please select an answer" },
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
