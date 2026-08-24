const MEASURES = [
  "מבנה סמנטי של הדף (כותרות, אזורי ניווט ותוכן) לתמיכה בקוראי מסך.",
  "טקסט חלופי (alt) לתמונות משמעותיות באתר.",
  "אפשרות ניווט וסגירת תפריטים באמצעות מקלדת (כולל מקש Escape בתפריט הצד).",
  "ניגודיות צבעים נבדקת בין טקסט לרקע בהתאם לעיצוב האתר.",
  "תפריט נגישות צף המאפשר הגדלת טקסט, ניגודיות גבוהה, עצירת אנימציות והדגשת קישורים.",
];

export default function AccessibilityStatement() {
  return (
    <div className="care-instructions">
      <section className="form-section">
        <h2 className="form-section-title text-gold">מחויבות לנגישות</h2>
        <p>
          אנו ב-Reut Cosmetics רואות חשיבות רבה במתן שירות שוויוני ונגיש לכלל הלקוחות, לרבות אנשים עם
          מוגבלות. אנו פועלות להנגשת האתר בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998,
          ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">התאמות הנגישות באתר</h2>
        <ul className="care-list">
          {MEASURES.map((measure, index) => (
            <li key={index}>{measure}</li>
          ))}
        </ul>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">רמת הנגישות</h2>
        <p>
          האתר נבנה מתוך כוונה לעמוד בדרישות תקן ישראלי 5568, בהתאם להנחיות הנגישות לתכנים באינטרנט
          WCAG 2.0 ברמה AA. ההצהרה מבוססת על בדיקה עצמית ואינה מהווה אישור ממבדק נגישות מוסמך.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">מגבלות ידועות</h2>
        <p>
          ייתכן שחלקים מסוימים באתר טרם הונגשו במלואם, ובכלל זה תכנים חיצוניים המוטמעים באתר (כגון מפת
          Google Maps) שאינם בשליטתנו המלאה. אנו ממשיכות לפעול לשיפור מתמיד של הנגישות באתר.
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">פנייה בנושא נגישות</h2>
        <p>נתקלת בבעיית נגישות באתר? נשמח שתפני אלינו ונטפל בפנייתך בהקדם:</p>
        <p>
          רכזת הנגישות: <strong>Codedly</strong>
          <br />
          טלפון: <a href="tel:+972522225834">052-222-5834</a>
          <br />
          אימייל: <a href="mailto:codedly.il@gmail.com">codedly.il@gmail.com</a>
        </p>
      </section>

      <section className="form-section">
        <h2 className="form-section-title text-gold">פנייה לנציבות שוויון זכויות</h2>
        <p>
          במידה שלא קיבלת מענה מספק לפנייתך, ניתן לפנות לנציבות שוויון זכויות לאנשים עם מוגבלות במשרד
          המשפטים.
        </p>
      </section>

      <p className="accessibility-updated">הצהרת נגישות זו עודכנה לאחרונה בתאריך 24.08.2026.</p>
    </div>
  );
}
