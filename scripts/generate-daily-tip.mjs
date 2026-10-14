import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'app', 'data', 'daily-tips.json');
const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro'
].filter(Boolean);

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

const prompt = `
אתה יועץ זוגיות, שדכן ומומחה לחכמת ישראל (תורה).
המטרה שלך היא לייצר "טיפ יומי" קצרצר, מעשי ומבריק לאתר שעוסק בחיבורים ובלימוד בחברותא.

הנושא צריך להיות אחד מאלה (תבחר אקראית):
1. 'פגישות ושידוכים' (למשל: איך לזהות מידות טובות, שאלות נכונות בדייט, למה לשים לב)
2. 'שלום בית' (למשל: תקשורת זוגית, כבוד הדדי, עין טובה)
3. 'תיקון מידות' (למשל: כעס, סבלנות, ענווה - בהקשר של קשר בין-אישי)

החזר רק פלט בפורמט JSON בלבד, בלי שום הסבר ובלי תגיות Markdown.
המבנה הנדרש:
{
  "category": "הנושא שבחרת (פגישות ושידוכים / שלום בית / תיקון מידות)",
  "title": "כותרת קליטה קצרה (עד 4 מילים)",
  "content": "הטיפ עצמו. משהו פסיכולוגי, עמוק אבל קצר. לא יותר מ-2 עד 3 משפטים קלילים וקריאים. בגובה העיניים, שנוגע בלב ובשכל."
}
`;

async function requestGeminiWithFallback(requestBody) {
  if (!API_KEY) {
    throw new Error("No GEMINI_API_KEY found");
  }

  let lastError = null;
  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Trying Gemini model for Daily Tip: ${modelName} (attempt ${attempt})...`);
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
        console.warn(`Model ${modelName} returned status ${res.status}: ${errText.slice(0, 120)}`);
        lastError = new Error(`Status ${res.status}: ${errText}`);
      } catch (e) {
        console.warn(`Network/timeout with ${modelName}:`, e.message);
        lastError = e;
      }
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  throw lastError || new Error("All models failed for Daily Tip");
}

async function run() {
  const todayStr = new Date().toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' });
  let newTip = null;

  try {
    const result = await requestGeminiWithFallback({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json"
      }
    });

    const text = result.candidates[0].content.parts[0].text;
    newTip = JSON.parse(text);
  } catch (error) {
    console.warn("AI generation failed for daily tip, using curated fallback:", error.message);
    const dayIndex = Math.floor(Date.now() / 86400000) % FALLBACK_TIPS.length;
    newTip = { ...FALLBACK_TIPS[dayIndex] };
  }

  newTip.id = Date.now().toString();
  newTip.date = todayStr;

  let tips = [];
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    tips = JSON.parse(data);
  } catch {
    console.log("Creating new tips file");
  }

  // If today's tip was already added, replace it, otherwise unshift
  if (!tips.length || tips[0].date !== todayStr) {
    tips.unshift(newTip);
  } else {
    tips[0] = newTip;
  }

  tips = tips.slice(0, 30);
  await fs.writeFile(DATA_FILE, JSON.stringify(tips, null, 2), 'utf-8');
  console.log(`Successfully updated Daily Tip for ${todayStr}: ${newTip.title}`);
}

run();
