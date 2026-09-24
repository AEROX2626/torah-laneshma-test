import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'app', 'data');
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("No GEMINI_API_KEY found");
  process.exit(1);
}

async function askGemini(prompt, isJson = false) {
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.1-flash-lite';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
          temperature: 0.8,
          ...(isJson ? { responseMimeType: "application/json" } : {})
      }
    })
  });
  const result = await response.json();
  return result.candidates[0].content.parts[0].text;
}

async function generateDafYomi() {
  console.log("Generating Daf Yomi...");
  const res = await fetch('https://www.sefaria.org/api/calendars');
  const data = await res.json();
  const daf = data.calendar_items.find(i => i.title.en === 'Daf Yomi');
  
  if (!daf) return;

  const dafNameHe = daf.displayValue.he;
  const prompt = `הדף היומי היום הוא "${dafNameHe}". כתוב משפט אחד, בעברית מודרנית ונגישה, שמסכם בצורה מסקרנת את הנושא המרכזי שנידון בדף זה. התחל את המשפט ב-"הדף היומי היום עוסק ב..." בלי ניקוד, בלי הסברים נוספים.`;
  
  let summary = await askGemini(prompt);
  summary = summary.replace(/"/g, '').trim();

  const dafYomiData = {
    date: new Date().toLocaleDateString('he-IL'),
    daf: dafNameHe,
    summary: summary
  };

  await fs.writeFile(path.join(DATA_DIR, 'daf-yomi.json'), JSON.stringify(dafYomiData, null, 2), 'utf-8');
}

async function generateDailyWisdom() {
  console.log("Generating Daily Wisdom...");
  const prompt = `אתה רב ואיש חינוך. כתוב "חיזוק יומי" אוטומטי לאתר. 
בחר ציטוט קצר ומעורר השראה (מפרקי אבות, חסידות, או התלמוד) וכתוב מוסר השכל קצרצר בגובה העיניים לחילונים.
פורמט JSON בלבד:
{
  "source": "מקור הציטוט (למשל: משלי / רבי נחמן / פרקי אבות)",
  "quote": "הציטוט עצמו בגרשיים",
  "explanation": "משפט אחד או שניים שמסבירים איך זה קשור לחיים המודרניים שלנו היום"
}`;

  const text = await askGemini(prompt, true);
  const newWisdom = JSON.parse(text);
  newWisdom.id = Date.now().toString();
  newWisdom.date = new Date().toLocaleDateString('he-IL');

  const filePath = path.join(DATA_DIR, 'daily-wisdom.json');
  let wisdoms = [];
  try {
    const existing = await fs.readFile(filePath, 'utf-8');
    wisdoms = JSON.parse(existing);
  } catch (e) {}

  wisdoms.unshift(newWisdom);
  // Keep only last 30 to not bloat file
  wisdoms = wisdoms.slice(0, 30);
  
  await fs.writeFile(filePath, JSON.stringify(wisdoms, null, 2), 'utf-8');
}

async function checkHolidays() {
  console.log("Checking Holidays...");
  const date = new Date();
  const today = date.toISOString().split('T')[0];
  date.setDate(date.getDate() + 10); // Check 10 days ahead
  const nextWeek = date.toISOString().split('T')[0];

  const res = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&start=${today}&end=${nextWeek}`);
  const data = await res.json();
  
  const holidays = data.items.filter(i => !i.title.includes("Erev") && !i.title.includes("Havdalah"));
  
  if (holidays.length > 0) {
    const holiday = holidays[0]; // Next closest holiday
    // Translate holiday name to Hebrew using Gemini
    const prompt = `החג היהודי הבא הוא "${holiday.title}". תרגם את שם החג לעברית וכתוב תקציר של 2-3 משפטים מסקרנים על המשמעות הפנימית של החג. פורמט JSON בלבד:
{
  "hebrewName": "שם החג בעברית",
  "message": "המסר/תקציר של החג",
  "date": "${holiday.date}"
}`;
    const text = await askGemini(prompt, true);
    const holidayData = JSON.parse(text);
    holidayData.active = true;
    holidayData.originalTitle = holiday.title;

    await fs.writeFile(path.join(DATA_DIR, 'holiday.json'), JSON.stringify(holidayData, null, 2), 'utf-8');
  } else {
    // Write inactive state
    await fs.writeFile(path.join(DATA_DIR, 'holiday.json'), JSON.stringify({ active: false }), 'utf-8');
  }
}

async function runAll() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await generateDafYomi();
    await generateDailyWisdom();
    await checkHolidays();
    console.log("All tasks completed successfully.");
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

runAll();
