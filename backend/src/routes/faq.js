import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { createFaq, listFaqs, removeFaq, replaceFaq } from "../repositories/faqRepository.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const MAX_QUESTION_LENGTH = 300;
const MAX_ANSWER_LENGTH = 2000;

// Seeds the store on first run only — once backend/src/data/faq.json
// exists, this is never consulted again. Matches what the site already
// showed before FAQ became an admin-managed list, so migrating to this
// doesn't lose or change anything a visitor would see.
const SEED_FAQS = [
  {
    id: 1,
    heQuestion: "כואב לעשות איפור קבוע?",
    enQuestion: "Does permanent makeup hurt?",
    heAnswer: "לפני הטיפול מורחים קרם הרדמה מקומי, כך שברוב המקרים מרגישים אי-נוחות קלה בלבד ולא כאב ממשי.",
    enAnswer:
      "A topical numbing cream is applied before the treatment, so most clients feel only mild discomfort rather than real pain.",
  },
  {
    id: 2,
    heQuestion: "כמה זמן מחזיק איפור קבוע?",
    enQuestion: "How long does permanent makeup last?",
    heAnswer:
      "התוצאה נשארת בממוצע 1-3 שנים, בהתאם לסוג העור, החשיפה לשמש והטיפוח היומיומי. מומלץ טאצ'-אפ מדי שנה-שנתיים.",
    enAnswer:
      "Results typically last 1–3 years, depending on skin type, sun exposure and daily care. A touch-up every 1–2 years is recommended.",
  },
  {
    id: 3,
    heQuestion: "כמה זמן לוקח תהליך ההחלמה?",
    enQuestion: "How long is the healing process?",
    heAnswer: "ההחלמה הראשונית אורכת כשבוע עד עשרה ימים. פירוט מלא אפשר למצוא בעמוד הוראות הטיפוח שלנו.",
    enAnswer: "Initial healing takes about a week to ten days. Full details are available on our care instructions page.",
  },
  {
    id: 4,
    heQuestion: "אפשר לעשות טיפול בהריון או בהנקה?",
    enQuestion: "Can I get treated while pregnant or breastfeeding?",
    heAnswer: "לא, מטעמי בטיחות איננו מבצעות איפור קבוע במהלך הריון או הנקה.",
    enAnswer: "No, for safety reasons we do not perform permanent makeup during pregnancy or breastfeeding.",
  },
  {
    id: 5,
    heQuestion: "האם צריך למלא הצהרת בריאות?",
    enQuestion: "Do I need to fill out a health declaration?",
    heAnswer: "כן, כל לקוחה ממלאת הצהרת בריאות לפני הטיפול הראשון. אפשר למלא אותה מראש בעמוד הצהרת הבריאות שלנו.",
    enAnswer:
      "Yes, every client fills out a health declaration before the first treatment. You can fill it out in advance on our health declaration page.",
  },
  {
    id: 6,
    heQuestion: "כמה זמן אורך הטיפול עצמו?",
    enQuestion: "How long does the treatment itself take?",
    heAnswer: "תלוי בסוג הטיפול - בממוצע בין שעה לשעתיים, כולל ייעוץ ובחירת צורה וצבע.",
    enAnswer: "It depends on the treatment type — on average one to two hours, including consultation and shape/color selection.",
  },
  {
    id: 7,
    heQuestion: "אפשר להתאפר רגיל אחרי הטיפול?",
    enQuestion: "Can I wear regular makeup after the treatment?",
    heAnswer: "מומלץ להימנע מאיפור באזור המטופל למשך כשבוע, עד לסיום תהליך ההחלמה הראשוני.",
    enAnswer: "It's recommended to avoid makeup on the treated area for about a week, until initial healing is complete.",
  },
  {
    id: 8,
    heQuestion: "מה קורה אם אני לא מרוצה מהתוצאה?",
    enQuestion: "What if I'm not happy with the result?",
    heAnswer: "קובעים פגישת מעקב תוך כמה שבועות לבדיקת התוצאה, ואם צריך מבצעים תיקון קל ללא עלות נוספת.",
    enAnswer:
      "We schedule a follow-up appointment within a few weeks to check the result, and if needed we make a light correction at no extra charge.",
  },
  {
    id: 9,
    heQuestion: "אתן מציעות גם קורסים?",
    enQuestion: "Do you also offer courses?",
    heAnswer: "כן, אנחנו מעבירות קורסי הכשרה מקצועיים למיקרובליידינג ועיצוב גבות. אפשר לקרוא עוד בעמוד הדרכת הקורסים.",
    enAnswer:
      "Yes, we run professional training courses in microblading and eyebrow shaping. Learn more on our private course guidance page.",
  },
  {
    id: 10,
    heQuestion: "איך קובעים תור?",
    enQuestion: "How do I book an appointment?",
    heAnswer: "הכי קל לתאם תור דרך הוואטסאפ שלנו, או בטלפון.",
    enAnswer: "The easiest way is to book via our WhatsApp, or by phone.",
  },
];

function validateFaqFields({ heQuestion, enQuestion, heAnswer, enAnswer }) {
  const trimmedHeQ = typeof heQuestion === "string" ? heQuestion.trim() : "";
  const trimmedEnQ = typeof enQuestion === "string" ? enQuestion.trim() : "";
  const trimmedHeA = typeof heAnswer === "string" ? heAnswer.trim() : "";
  const trimmedEnA = typeof enAnswer === "string" ? enAnswer.trim() : "";

  if (!trimmedHeQ || !trimmedEnQ || trimmedHeQ.length > MAX_QUESTION_LENGTH || trimmedEnQ.length > MAX_QUESTION_LENGTH) {
    return { error: `A question (Hebrew and English, up to ${MAX_QUESTION_LENGTH} characters) is required` };
  }
  if (!trimmedHeA || !trimmedEnA || trimmedHeA.length > MAX_ANSWER_LENGTH || trimmedEnA.length > MAX_ANSWER_LENGTH) {
    return { error: `An answer (Hebrew and English, up to ${MAX_ANSWER_LENGTH} characters) is required` };
  }

  return { heQuestion: trimmedHeQ, enQuestion: trimmedEnQ, heAnswer: trimmedHeA, enAnswer: trimmedEnA };
}

router.get("/", asyncHandler(async (req, res) => {
  res.json(await listFaqs(SEED_FAQS));
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const fields = validateFaqFields(req.body || {});
  if (fields.error) {
    return res.status(400).json({ error: fields.error });
  }

  const faq = { id: Date.now(), ...fields };
  await createFaq(faq, SEED_FAQS);

  res.status(201).json(faq);
}));

router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const faqs = await listFaqs(SEED_FAQS);
  const faq = faqs.find((f) => f.id === id);
  if (!faq) {
    return res.status(404).json({ error: "Question not found" });
  }

  const fields = validateFaqFields(req.body || {});
  if (fields.error) {
    return res.status(400).json({ error: fields.error });
  }

  faq.heQuestion = fields.heQuestion;
  faq.enQuestion = fields.enQuestion;
  faq.heAnswer = fields.heAnswer;
  faq.enAnswer = fields.enAnswer;
  await replaceFaq(faq, SEED_FAQS);

  res.json(faq);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!(await removeFaq(id, SEED_FAQS))) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.status(204).end();
}));

export default router;
