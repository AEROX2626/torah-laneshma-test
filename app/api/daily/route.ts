import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "app", "data");

const FALLBACK_TIPS = [
  {
    category: "שלום בית",
    title: "כוחה של מילה טובה",
    content: "חז\"ל לימדו ש'טוב המלבין שיניים לחברו יותר ממשקהו חלב'. מחמאה כנה אחת ביום לבן או בת הזוג מעניקה כוח, בונה אמון ומאירה את כל הבית. נסו למצוא היום מעשה קטן ולהודות עליו מכל הלב."
  },
  {
    category: "תיקון מידות",
    title: "לעצור לפני שמגיבים",
    content: "ברגעי כעס או ויכוח, העוצמה האמיתית היא בשתיקה של כמה שניות. כשאנחנו נושמים עמוק ומוותרים על הצורך 'לנצח', אנחנו מרוויחים את הקשר עצמו."
  },
  {
    category: "פגישות ושידוכים",
    title: "הקשבה בגובה העיניים",
    content: "בפגישה או בשיחה זוגית, שאלות של התעניינות כנה בערכים ובחלומות של האחר יוצרות חיבור עמוק פי כמה מכל שיחה שטחית."
  },
  {
    category: "שלום בית",
    title: "הנחת כוונות טובות",
    content: "כשבן הזוג עושה משהו שפגע בנו, הצעד הראשון הוא להניח שהוא לא התכוון לרע. לימוד זכות היא לא רק הלכה – היא המתכון המנצח לזוגיות יציבה ומאושרת."
  }
];

const FALLBACK_WISDOMS = [
  {
    source: "רבי נחמן מברסלב",
    quote: "אם אתה מאמין שיכולים לקלקל, תאמין שיכולים לתקן",
    explanation: "בתוך קצב החיים התובעני קל לפעמים להרגיש חרטה או החמצה. התזכורת העמוקה היא שתמיד ישנה הזדמנות שנייה, ובכל רגע אפשר לבחור מחדש בחיבור, באהבה ובצמיחה."
  },
  {
    source: "פרקי אבות, פרק א'",
    quote: "אוהב שלום ורודף שלום, אוהב את הבריות ומקרבן לתורה",
    explanation: "שלום אינו מצב פסיבי אלא פעולה מתמדת. כשאנחנו ניגשים לכל אדם בסבר פנים יפות וללא שיפוטיות, הלבבות נפתחים מאליהם."
  },
  {
    source: "הרמב\"ם, הלכות דעות",
    quote: "לעולם ירבה אדם בשתיקה, ולא ידבר אלא בדברי חכמה או בדברים שצריכים לו לחיי גופו",
    explanation: "בעידן של רעש בלתי פוסק והתראות מסכים, היכולת לשמור על מרחב של שקט פנימי והקשבה היא מקור החוסן האמיתי של הנפש."
  },
  {
    source: "הבעל שם טוב",
    quote: "במקום שמחשבתו של אדם שם הוא נמצא כולו",
    explanation: "המציאות שלנו מעוצבת לפי מה שאנחנו בוחרים להתרכז בו. כשאנו ממקדים את תשומת הלב בטוב ובאדם שמולנו, כל היום מקבל משמעות שונה."
  }
];

function getTodayIsrael(): string {
  return new Date().toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" });
}

export async function GET() {
  const todayStr = getTodayIsrael();

  // 1. DAF YOMI
  let dafYomi = {
    date: todayStr,
    daf: "בכורות כ״ו",
    summary: "הדף היומי היום עוסק בסוגיות עמוקות ומרתקות במסכת בכורות, ומזמין לעצור לחצי שעה של לימוד משותף, שיח פורה וחיבור אישי למסורת בחברותא."
  };

  try {
    const dafFile = path.join(DATA_DIR, "daf-yomi.json");
    if (fs.existsSync(dafFile)) {
      const parsed = JSON.parse(fs.readFileSync(dafFile, "utf-8"));
      if (parsed && parsed.date === todayStr) {
        dafYomi = parsed;
      } else {
        // Fetch fresh from Sefaria for exact Israel date
        const now = new Date();
        const d = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));
        const res = await fetch(`https://www.sefaria.org/api/calendars?day=${d.getDate()}&month=${d.getMonth() + 1}&year=${d.getFullYear()}`, { next: { revalidate: 1800 } });
        if (res.ok) {
          const data = await res.json();
          const dafItem = data.calendar_items?.find((i: any) => i.title?.en === "Daf Yomi");
          if (dafItem) {
            const dafNameHe = dafItem.displayValue?.he || "דף יומי";
            const tractate = dafNameHe.split(" ")[0] || "התלמוד";
            dafYomi = {
              date: todayStr,
              daf: dafNameHe,
              summary: `הדף היומי היום עוסק בסוגיות עמוקות ומרתקות במסכת ${tractate}, ומזמין לעצור לחצי שעה של שיח מפרה ולימוד פורה בחברותא.`
            };
          }
        }
      }
    }
  } catch (e) {
    console.warn("Daily API Daf Yomi error:", e);
  }

  // 2. DAILY TIP
  let dailyTip = {
    ...FALLBACK_TIPS[0],
    id: `tip-${todayStr}`,
    date: todayStr
  };

  try {
    const tipFile = path.join(DATA_DIR, "daily-tips.json");
    if (fs.existsSync(tipFile)) {
      const tips = JSON.parse(fs.readFileSync(tipFile, "utf-8"));
      if (Array.isArray(tips) && tips.length > 0) {
        if (tips[0].date === todayStr) {
          dailyTip = tips[0];
        } else {
          // Curated rotation based on today's timestamp
          const dayIndex = Math.floor(Date.now() / 86400000) % FALLBACK_TIPS.length;
          dailyTip = {
            ...FALLBACK_TIPS[dayIndex],
            id: `tip-${todayStr}`,
            date: todayStr
          };
        }
      }
    }
  } catch (e) {
    console.warn("Daily API Tip error:", e);
  }

  // 3. DAILY WISDOM
  let dailyWisdom = {
    ...FALLBACK_WISDOMS[0],
    id: `wisdom-${todayStr}`,
    date: todayStr
  };

  try {
    const wisdomFile = path.join(DATA_DIR, "daily-wisdom.json");
    if (fs.existsSync(wisdomFile)) {
      const wisdoms = JSON.parse(fs.readFileSync(wisdomFile, "utf-8"));
      if (Array.isArray(wisdoms) && wisdoms.length > 0) {
        if (wisdoms[0].date === todayStr) {
          dailyWisdom = wisdoms[0];
        } else {
          const dayIndex = Math.floor(Date.now() / 86400000) % FALLBACK_WISDOMS.length;
          dailyWisdom = {
            ...FALLBACK_WISDOMS[dayIndex],
            id: `wisdom-${todayStr}`,
            date: todayStr
          };
        }
      }
    }
  } catch (e) {
    console.warn("Daily API Wisdom error:", e);
  }

  return NextResponse.json({
    date: todayStr,
    dafYomi,
    dailyTip,
    dailyWisdom
  });
}
