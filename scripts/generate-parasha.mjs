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

// Retry temporary server failures, with a finite number of attempts.
async function requestGemini(modelName, requestBody) {
  const maxAttempts = 6;
  const retryableStatuses = new Set([500, 502, 503, 504]);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Gemini attempt ${attempt}/${maxAttempts}`);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(120_000)
    });

    if (res.ok) return res.json();

    const errorText = await res.text();
    const error = new Error(`Gemini API error (${modelName}, attempt ${attempt}/${maxAttempts}): ${res.status} - ${errorText}`);
    if (!retryableStatuses.has(res.status) || attempt === maxAttempts) {
      throw error;
    }

    // Respect Retry-After when present, but do not keep a workflow waiting indefinitely.
    const retryAfter = res.headers.get('retry-after');
    let serverDelayMs = 0;
    if (retryAfter) {
      const seconds = Number(retryAfter);
      serverDelayMs = Number.isFinite(seconds)
        ? Math.max(0, seconds * 1000)
        : Math.max(0, Date.parse(retryAfter) - Date.now());
      if (!Number.isFinite(serverDelayMs)) serverDelayMs = 0;
    }
    if (serverDelayMs > 300_000) throw error;

    const backoffMs = Math.min(10_000 * 2 ** (attempt - 1), 120_000);
    const delayMs = Math.max(backoffMs, serverDelayMs) + Math.floor(Math.random() * 1000);
    console.warn(`Gemini returned ${res.status}; retrying in ${Math.ceil(delayMs / 1000)} seconds...`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
}

// 2. Call Gemini
async function generateArticle(parashaNameHe, parashaNameEn) {
  // Use an explicit text model; list order does not guarantee model access.
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.1-flash-lite';

  console.log("Using model:", modelName);

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

  const data = await requestGemini(modelName, requestBody);
  const contentText = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(contentText);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", contentText);
    throw e;
  }
}

// Fetch a random amazing Israel landscape from Wikimedia Commons
async function getRandomIsraelImage() {
  try {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Landscapes_of_Israel&cmnamespace=6&cmlimit=500&format=json';
    const res = await fetch(url);
    const data = await res.json();
    const members = data.query.categorymembers;
    const randomFile = members[Math.floor(Math.random() * members.length)].title;
    
    const imgUrlRes = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(randomFile)}&prop=imageinfo&iiprop=url&format=json`);
    const imgData = await imgUrlRes.json();
    const pages = imgData.query.pages;
    const imgInfo = Object.values(pages)[0].imageinfo[0];
    return imgInfo.url;
  } catch(e) {
    console.error("Failed to fetch Wikimedia image", e);
    // fallback
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/NahalHavarimNov212022_03.jpg/1280px-NahalHavarimNov212022_03.jpg";
  }
}

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
  
  const randomImage = await getRandomIsraelImage();

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
