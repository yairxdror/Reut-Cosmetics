import { PHONE_TEL_URL, PHONE_DISPLAY_NUMBER, whatsappUrl } from "@/lib/contact";

const DATA_COLLECTED = [
  "ביקורות: שם, דירוג וטקסט הביקורת, מוצגים באופן פומבי בעמוד הביקורות באתר.",
  "הצהרת בריאות: שם מלא, מספר תעודת זהות, מספר טלפון ותשובות לשאלון הבריאות, נאספים לצורך בדיקת התאמה ובטיחות לפני טיפול.",
  "פניית \"צרי קשר\": שם, מספר טלפון ותחום השירות המבוקש, נשלחים ישירות בהודעת WhatsApp ואינם נשמרים בשרתי האתר.",
  "העדפת שפה: נשמרת בעוגייה (cookie) במכשיר שלך, לצורך הצגת האתר בשפה שבחרת בביקור הבא.",
  "פרטי התחברות מנהלת: אימייל וסיסמה, לשימוש צוות האתר בלבד.",
];

export default function PrivacyPolicy() {
  return (
    <div className="care-instructions">
      <section className="form-section">
        <h2 className="form-section-title text-gold">כללי</h2>
        <p>
          Reut Cosmetics מכבדת את פרטיותך. מדיניות זו מסבירה אילו נתונים אנו אוספות, לשם מה, וכיצד הם
          נשמרים ומאובטחים. השימוש באתר ובשירותים מהווה הסכמה לתנאי מדיניות זו.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">המידע שאנו אוספות</h2>
        <ul className="care-list">
          {DATA_COLLECTED.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">מידע רגיש, הצהרת בריאות</h2>
        <p>
          פרטי הצהרת הבריאות (לרבות תעודת הזהות ותשובות שאלון הבריאות) מהווים &quot;מידע רגיש&quot; כהגדרתו
          בחוק הגנת הפרטיות, התשמ&quot;א-1981 (לרבות תיקון 13 לחוק). בהתאם לכך:
        </p>
        <ul className="care-list">
          <li>המידע מוצפן (AES-256) באחסון, כך שגם גישה ישירה לקובצי הנתונים אינה חושפת אותו כטקסט גלוי.</li>
          <li>הגישה למידע מוגבלת לצוות מורשה בלבד, באמצעות התחברות מאובטחת.</li>
          <li>המידע נמחק אוטומטית 7 שנים לאחר מועד המסירה.</li>
          <li>קיימת הגבלת קצב על שליחת טפסים כדי למנוע ניצול לרעה של המערכת.</li>
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">כיצד אנו משתמשות במידע</h2>
        <p>
          אנו משתמשות במידע אך ורק למטרה שלשמה נאסף: בדיקת התאמה ובטיחות לפני טיפול, מענה לפניות, תיאום
          שירות והצגת ביקורות לקוחות. אנו לא מוכרות, משכירות או משתפות את המידע האישי שלך עם צדדים
          שלישיים למטרות שיווק.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">שיתוף עם צדדים שלישיים</h2>
        <p>
          פנייה דרך טופס &quot;צרי קשר&quot; נשלחת כהודעת WhatsApp ישירות למספר העסק; מרגע השליחה חלה עליה
          מדיניות הפרטיות של WhatsApp/Meta. מלבד זאת, אין אנו משתפות מידע אישי עם גורמים חיצוניים, למעט
          כאשר הדבר נדרש על פי דין.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">אבטחת מידע</h2>
        <p>
          אנו נוקטות באמצעי אבטחה טכניים וארגוניים סבירים להגנה על המידע שנמסר לנו, לרבות הצפנת מידע רגיש
          והגבלת קצב שליחת טפסים. יחד עם זאת, אין אפשרות להבטיח אבטחה מוחלטת של מידע המועבר או מאוחסן
          באופן דיגיטלי.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">עוגיות (Cookies)</h2>
        <p>
          האתר משתמש בעוגייה אחת בלבד, לשמירת העדפת השפה שבחרת. איננו משתמשות בעוגיות מעקב, פרסום או
          ניתוח שימוש.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">הזכויות שלך</h2>
        <p>
          בהתאם לחוק הגנת הפרטיות, את/ה רשאי/ת לפנות אלינו בבקשה לעיין במידע שנשמר עליך, לתקן אותו או
          לבקש את מחיקתו (בכפוף לכל דין המחייב שמירתו, כגון הוראות רפואיות). נשמח לטפל בכל פנייה בהקדם.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">יצירת קשר בנושא פרטיות</h2>
        <p>לכל שאלה או בקשה הנוגעת למדיניות זו ולמידע האישי שלך, ניתן לפנות אלינו:</p>
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

      <section className="form-section">
        <h2 className="form-section-title text-gold">עדכוני מדיניות</h2>
        <p>מדיניות זו עשויה להתעדכן מעת לעת. המשך השימוש באתר לאחר עדכון מהווה הסכמה לתנאים המעודכנים.</p>
      </section>

      <p className="accessibility-updated">מדיניות פרטיות זו עודכנה לאחרונה בתאריך 25.08.2026.</p>
    </div>
  );
}
