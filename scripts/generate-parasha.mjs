import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY. Available env keys: " + Object.keys(process.env).join(", "));
  process.exit(1);
}

// 1. Fetch Parashat Hashavua from Hebcal
async function getParasha() {
  const res = await fetch('https://www.hebcal.com/hebcal?v=1&cfg=json&m=50&s=on');
  const data = await res.json();
  const parashaEvent = data.items.find(item => item.category === 'parashat');
  if (!parashaEvent) {
    throw new Error("Could not find Parasha in Hebcal response.");
  }
  return parashaEvent;
}

// 2. Call Gemini
async function generateArticle(parashaNameHe, parashaNameEn) {
  const prompt = `
אתה כותב תוכן לאתר אינטרנט בשם 'תורה לנשמה', שמטרתו להנגיש חיבור למסורת לאנשים עמוסים דרך לימוד טלפוני (חברותא).
כתוב מאמר מעורר השראה בן 3 פסקאות על ${parashaNameHe} (פרשת השבוע).
המאמר צריך להיות כתוב בשפה מודרנית, בגובה העיניים, לקשר את הרעיון המרכזי של הפרשה לחיי היומיום, לאתגרים מודרניים, ולסיים במסר מחזק.

עליך להחזיר את התשובה *אך ורק* כ-JSON תקין, ללא כל טקסט לפני או אחרי, וללא בלוק קוד (\`\`\`json).
המבנה הנדרש:
{
  "title": "כותרת קליטה ומושכת",
  "excerpt": "תקציר קצר של משפט אחד (עד 20 מילים)",
  "content": "המאמר עצמו עם תגיות HTML בסיסיות (<p>, <h3>, <strong>). ללא כותרת ראשית h1 או h2 בתוך התוכן. שים לב להשתמש במירכאות כפולות שעברו אסקייפ אם צריך, כדי לשמור על JSON חוקי."
}
  `;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  const contentText = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(contentText);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", contentText);
    throw e;
  }
}

// List of amazing fallback images for the articles
const defaultImages = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/NahalHavarimNov212022_03.jpg/1280px-NahalHavarimNov212022_03.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Judea_2_by_David_Shankbone.jpg/1280px-Judea_2_by_David_Shankbone.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Mahane_Yehuda_%28I%29_%2845298221191%29.jpg/1280px-Mahane_Yehuda_%28I%29_%2845298221191%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Safed1.jpg/1280px-Safed1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/%D7%9E%D7%92%D7%93%D7%9C_-%D7%93%D7%95%D7%93.jpg/1280px-%D7%9E%D7%92%D7%93%D7%9C_-%D7%93%D7%95%D7%93.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kinneret_cropped.jpg/1280px-Kinneret_cropped.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Dead_Sea_beach_00.JPG/1280px-Dead_Sea_beach_00.JPG"
];

async function main() {
  console.log("Fetching Parasha from Hebcal...");
  const parasha = await getParasha();
  console.log(`Found: ${parasha.title} (${parasha.hebrew})`);

  // Transform title for slug: "Parashat Ha'azinu" -> "haazinu"
  const slug = parasha.title.toLowerCase().replace('parashat ', '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const contentPath = path.join(process.cwd(), 'app', 'articles', 'content.json');
  let existingArticles = [];
  if (fs.existsSync(contentPath)) {
    existingArticles = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  }

  // Check if article already exists for this week
  if (existingArticles.some(a => a.slug === slug)) {
    console.log(`Article for ${slug} already exists. Skipping.`);
    process.exit(0);
  }

  console.log("Generating article using Gemini AI...");
  const generated = await generateArticle(parasha.hebrew, parasha.title);
  
  const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];

  const today = new Date();
  const dateStr = today.toLocaleDateString('he-IL');

  const newArticle = {
    slug: slug,
    title: generated.title,
    excerpt: generated.excerpt,
    category: 'פרשת השבוע',
    date: dateStr,
    image: randomImage,
    content: generated.content
  };

  existingArticles.unshift(newArticle); // Add to the beginning

  fs.writeFileSync(contentPath, JSON.stringify(existingArticles, null, 2), 'utf8');
  console.log(`Successfully generated and saved new article: ${generated.title}`);
}

main().catch(err => {
  console.error("Error generating parasha:", err);
  process.exit(1);
});
