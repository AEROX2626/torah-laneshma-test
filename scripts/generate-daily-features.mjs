import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'app', 'data');
const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro'
].filter(Boolean);

// Curated pool of high-quality wisdom quotes if AI is temporarily unavailable
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
  },
  {
    source: "פרקי אבות, פרק ב'",
    quote: "הוי שוקד ללמוד תורה, ודע מה שתשיב",
    explanation: "לימוד מעמיק מפתח חשיבה ביקורתית, ענווה ויכולת להקשיב לדעות שונות בגובה העיניים – בדיוק המהות של שיחת חברותא טובה."
  }
];

async function requestGeminiWithFallback(requestBody) {
  if (!API_KEY) {
    throw new Error("No GEMINI_API_KEY found");
  }

  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Trying Gemini model: ${modelName} (attempt ${attempt})...`);
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(20000)
        });

        if (res.ok) {
          return await res.json();
        }

        const errText = await res.text();
        console.warn(`Gemini model ${modelName} returned status ${res.status}: ${errText.slice(0, 120)}`);
        lastError = new Error(`Status ${res.status}: ${errText}`);
      } catch (e) {
        console.warn(`Network/timeout with ${modelName}:`, e.message);
        lastError = e;
      }
      // Brief pause before retry
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

async function askGemini(prompt, isJson = false) {
  const result = await requestGeminiWithFallback({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      ...(isJson ? { responseMimeType: "application/json" } : {})
    }
  });
  return result.candidates[0].content.parts[0].text;
}

async function generateDafYomi() {
  console.log("Generating Daf Yomi...");
  const res = await fetch('https://www.sefaria.org/api/calendars');
  const data = await res.json();
  const daf = data.calendar_items.find(i => i.title.en === 'Daf Yomi');
  
  if (!daf) {
    console.warn("Could not find Daf Yomi in Sefaria response");
    return;
  }

  const dafNameHe = daf.displayValue.he;
  const todayStr = new Date().toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' });
  const tractateName = dafNameHe.split(' ')[0] || "התלמוד";
  
  let summary = "";
  try {
    const prompt = `הדף היומי היום הוא "${dafNameHe}". כתוב משפט אחד, בעברית מודרנית ונגישה, שמסכם בצורה מסקרנת את הנושא המרכזי שנידון בדף זה. התחל את המשפט ב-"הדף היומי היום עוסק ב..." בלי ניקוד, בלי הסברים נוספים.`;
    summary = await askGemini(prompt);
    summary = summary.replace(/"/g, '').trim();
  } catch (err) {
    console.warn("AI generation failed for Daf Yomi summary, using intelligent fallback:", err.message);
    summary = `הדף היומי היום עוסק בסוגיות עמוקות ומרתקות במסכת ${tractateName}, ומזמין את הלומדים לעצור לחצי שעה של שיח מפרה, לימוד משותף וחיבור למסורת בחברותא.`;
  }

  const dafYomiData = {
    date: todayStr,
    daf: dafNameHe,
    summary: summary
  };

  await fs.writeFile(path.join(DATA_DIR, 'daf-yomi.json'), JSON.stringify(dafYomiData, null, 2), 'utf-8');
  console.log(`Successfully updated Daf Yomi for ${todayStr}: ${dafNameHe}`);
}

async function generateDailyWisdom() {
  console.log("Generating Daily Wisdom...");
  const todayStr = new Date().toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' });
  let newWisdom = null;

  try {
    const prompt = `אתה רב ואיש חינוך. כתוב "חיזוק יומי" אוטומטי לאתר. 
בחר ציטוט קצר ומעורר השראה (מפרקי אבות, חסידות, או התלמוד) וכתוב מוסר השכל קצרצר בגובה העיניים לחילונים.
פורמט JSON בלבד:
{
  "source": "מקור הציטוט (למשל: משלי / רבי נחמן / פרקי אבות)",
  "quote": "הציטוט עצמו בגרשיים",
  "explanation": "משפט אחד או שניים שמסבירים איך זה קשור לחיים המודרניים שלנו היום"
}`;

    const text = await askGemini(prompt, true);
    newWisdom = JSON.parse(text);
  } catch (e) {
    console.warn("AI generation failed for Daily Wisdom, using curated pool:", e.message);
    const dayIndex = Math.floor(Date.now() / 86400000) % FALLBACK_WISDOMS.length;
    newWisdom = { ...FALLBACK_WISDOMS[dayIndex] };
  }

  newWisdom.id = Date.now().toString();
  newWisdom.date = todayStr;

  const filePath = path.join(DATA_DIR, 'daily-wisdom.json');
  let wisdoms = [];
  try {
    const existing = await fs.readFile(filePath, 'utf-8');
    wisdoms = JSON.parse(existing);
  } catch {}

  // Avoid duplicate if today's entry already exists
  if (!wisdoms.length || wisdoms[0].date !== todayStr) {
    wisdoms.unshift(newWisdom);
  } else {
    wisdoms[0] = newWisdom;
  }

  wisdoms = wisdoms.slice(0, 30);
  await fs.writeFile(filePath, JSON.stringify(wisdoms, null, 2), 'utf-8');
  console.log(`Successfully updated Daily Wisdom for ${todayStr}: ${newWisdom.source}`);
}

async function checkHolidays() {
  console.log("Checking Holidays...");
  try {
    const date = new Date();
    const today = date.toISOString().split('T')[0];
    date.setDate(date.getDate() + 10);
    const nextWeek = date.toISOString().split('T')[0];

    const res = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&start=${today}&end=${nextWeek}`);
    const data = await res.json();
    
    const holidays = (data.items || []).filter(i => !i.title.includes("Erev") && !i.title.includes("Havdalah"));
    
    if (holidays.length > 0) {
      const holiday = holidays[0];
      let holidayData = null;

      try {
        const prompt = `החג היהודי הבא הוא "${holiday.title}". תרגם את שם החג לעברית וכתוב תקציר של 2-3 משפטים מסקרנים על המשמעות הפנימית של החג. פורמט JSON בלבד:
{
  "hebrewName": "שם החג בעברית",
  "message": "המסר/תקציר של החג",
  "date": "${holiday.date}"
}`;
        const text = await askGemini(prompt, true);
        holidayData = JSON.parse(text);
      } catch {
        holidayData = {
          hebrewName: holiday.hebrew || holiday.title,
          message: "מועד קדוש של שמחה, חיבור והתחדשות בלוח השנה העברי.",
          date: holiday.date
        };
      }

      holidayData.active = true;
      holidayData.originalTitle = holiday.title;
      await fs.writeFile(path.join(DATA_DIR, 'holiday.json'), JSON.stringify(holidayData, null, 2), 'utf-8');
    } else {
      await fs.writeFile(path.join(DATA_DIR, 'holiday.json'), JSON.stringify({ active: false }), 'utf-8');
    }
  } catch (e) {
    console.warn("Holiday check error:", e.message);
  }
}

async function runAll() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await generateDafYomi();
    await generateDailyWisdom();
    await checkHolidays();
    console.log("All daily features generated successfully.");
  } catch (e) {
    console.error("Critical error in runAll:", e);
  }
}

runAll();
