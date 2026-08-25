import { PHONE_TEL_URL, PHONE_DISPLAY_NUMBER, whatsappUrl } from "@/lib/contact";

const PAYMENT_TERMS = [
  'התמורה הכספית (להלן: "שכר טרחה") מזכה בשני טיפולים בלבד. כל טיפול נוסף מעבר לכך יהיה בתשלום.',
  "יש לשלם מראש את מלוא המחיר עבור שני הטיפולים.",
  "לא תתאפשר החזרת כספים לאחר תחילת הטיפול הראשון, גם אם בוצע רק חלקית.",
  'הצבע המתקבל תלוי בפיגמנט העור ומשתנה מאדם לאדם. במקרים בהם הצבע נדחה על ידי העור, ייתכן צורך בטיפול נוסף בתשלום (להלן: "טיפול שלישי").',
  "יש להגיע לטיפול השני במועד שייקבע. אי הגעה בטווח של עד חודשיים עלולה לפגוע בתוצאה הסופית, והאחריות לכך לא תחול על המטפלת.",
  "המטפלת אינה מחויבת לקבל לקוחה לטיפול מעבר למועד המיועד והנכון לכך.",
];

export default function TermsOfUse() {
  return (
    <div className="care-instructions">
      <section className="form-section">
        <h2 className="form-section-title text-gold">כללי</h2>
        <p>
          תנאי שימוש אלו חלים על כל שימוש באתר Reut Cosmetics ובשירותים המוצעים בו. גלישה באתר, שימוש
          בטפסים או הזמנת שירות מהווים הסכמה לתנאים אלו במלואם.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">השירותים המוצעים</h2>
        <p>
          Reut Cosmetics מציעה טיפולי איפור קבוע (מיקרובליידינג) והדרכת קורסים פרטניים בתחום. האתר מספק
          מידע על השירותים, אפשרות ליצירת קשר ותיאום, ומרחב להצגת ביקורות לקוחות.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">הצהרת בריאות</h2>
        <p>
          לפני קבלת טיפול נדרשת מילוי הצהרת בריאות מלאה ואמיתית. מסירת מידע חלקי או לא מדויק עלולה לפגוע
          בתוצאה הסופית ואף לסכן את בריאות הלקוחה, והאחריות לכך תחול על הלקוחה בלבד.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">תנאי תשלום, ביטולים והחזרים</h2>
        <ul className="care-list">
          {PAYMENT_TERMS.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">ביקורות לקוחות</h2>
        <p>
          ביקורות המתפרסמות באתר משקפות את דעתן האישית של הלקוחות ואינן מבוטאות את עמדת Reut Cosmetics.
          לקוחה רשאית לערוך ביקורת שפרסמה בתוך 15 דקות ממועד הפרסום. אנו שומרות לעצמנו את הזכות להסיר
          ביקורות הכוללות תוכן פוגעני, מטעה או שאינו הולם.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">קניין רוחני</h2>
        <p>
          כל הזכויות בתכני האתר, לרבות טקסטים, תמונות, עיצוב ולוגו, שייכות ל-Reut Cosmetics. אין להעתיק,
          להפיץ או לעשות שימוש בתכני האתר ללא אישור מראש ובכתב.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">הגבלת אחריות</h2>
        <p>
          הטיפולים המוצעים הינם אינדיבידואליים ותוצאותיהם משתנות מאדם לאדם בהתאם לסוג העור ולגורמים
          נוספים; אין באתר או בתיאום טיפול משום התחייבות לתוצאה מסוימת. Reut Cosmetics אינה אחראית לתכנים
          חיצוניים המוטמעים באתר (כגון מפת Google Maps) ואינה נושאת באחריות לנזק עקיף שייגרם כתוצאה משימוש
          באתר.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">שינויים בתנאים</h2>
        <p>
          Reut Cosmetics רשאית לעדכן תנאים אלו מעת לעת. המשך השימוש באתר לאחר פרסום עדכון מהווה הסכמה
          לתנאים המעודכנים.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">דין וסמכות שיפוט</h2>
        <p>
          על תנאים אלו יחולו דיני מדינת ישראל בלבד, וסמכות השיפוט הבלעדית בכל עניין הנוגע להם תהא נתונה
          לבתי המשפט המוסמכים בירושלים.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">יצירת קשר</h2>
        <p>לכל שאלה בנוגע לתנאי השימוש ניתן לפנות אלינו:</p>
        <p className="legal-contact-line">
          טלפון: <a href={PHONE_TEL_URL}>{PHONE_DISPLAY_NUMBER}</a>
        </p>
        <p className="legal-contact-line">
          WhatsApp:{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            {PHONE_DISPLAY_NUMBER}
          </a>
        </p>
      </section>

      <p className="accessibility-updated">תנאי שימוש אלו עודכנו לאחרונה בתאריך 25.08.2026.</p>
    </div>
  );
}
