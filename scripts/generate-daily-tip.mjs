import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'app', 'data', 'daily-tips.json');
const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;

if (!API_KEY) {
  console.error("No GEMINI_API_KEY found. Available env keys: " + Object.keys(process.env).join(", "));
  process.exit(1);
}

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

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json"
        }
      })
    });

    const result = await response.json();
    let text = result.candidates[0].content.parts[0].text;
    
    // Parse the new tip
    const newTip = JSON.parse(text);
    
    // Add Metadata
    newTip.id = Date.now().toString();
    newTip.date = new Date().toLocaleDateString('he-IL');

    // Read existing tips
    let tips = [];
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      tips = JSON.parse(data);
    } catch (e) {
      console.log("Creating new tips file");
    }

    // Unshift to add at the top (index 0)
    tips.unshift(newTip);

    // Save
    await fs.writeFile(DATA_FILE, JSON.stringify(tips, null, 2), 'utf-8');
    console.log("Added new daily tip:", newTip.title);
  } catch (error) {
    console.error("Error generating daily tip:", error);
    process.exit(1);
  }
}

run();
