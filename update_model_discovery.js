const fs = require('fs');

let pMjs = fs.readFileSync('scripts/generate-parasha.mjs', 'utf8');

// Replace the generateArticle model call with auto-detection of model
const newGenerateArticle = `async function generateArticle(parashaNameHe, parashaNameEn) {
  // Discover available models
  let modelName = 'gemini-1.5-flash';
  try {
    const listRes = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models?key=\${API_KEY}\`);
    if (listRes.ok) {
      const listData = await listRes.json();
      const models = listData.models || [];
      console.log("Available models:", models.map(m => m.name.replace('models/', '')).join(', '));
      const flash = models.find(m => m.name.includes('flash') && m.supportedGenerationMethods.includes('generateContent'));
      if (flash) {
        modelName = flash.name.replace('models/', '');
      } else if (models.length > 0) {
        const any = models.find(m => m.supportedGenerationMethods.includes('generateContent'));
        if (any) modelName = any.name.replace('models/', '');
      }
    }
  } catch (err) {
    console.warn("Could not list models, falling back to default:", err);
  }

  console.log("Using model:", modelName);

  const prompt = \`
אתה כותב תוכן לאתר אינטרנט בשם 'תורה לנשמה', שמטרתו להנגיש חיבור למסורת לאנשים עמוסים דרך לימוד טלפוני (חברותא).
כתוב מאמר מעורר השראה בן 3 פסקאות על \${parashaNameHe} (פרשת השבוע).
המאמר צריך להיות כתוב בשפה מודרנית, בגובה העיניים, לקשר את הרעיון המרכזי של הפרשה לחיי היומיום, לאתגרים מודרניים, ולסיים במסר מחזק.

עליך להחזיר את התשובה *אך ורק* כ-JSON תקין, ללא כל טקסט לפני או אחרי, וללא בלוק קוד (\\\`\\\`\\\`json).
המבנה הנדרש:
{
  "title": "כותרת קליטה ומושכת",
  "excerpt": "תקציר קצר של משפט אחד (עד 20 מילים)",
  "content": "המאמר עצמו עם תגיות HTML בסיסיות (<p>, <h3>, <strong>). ללא כותרת ראשית h1 או h2 בתוך התוכן. שים לב להשתמש במירכאות כפולות שעברו אסקייפ אם צריך, כדי לשמור על JSON חוקי."
}
  \`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${modelName}:generateContent?key=\${API_KEY}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(\`Gemini API error: \${res.status} - \${errorText}\`);
  }

  const data = await res.json();
  const contentText = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(contentText);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", contentText);
    throw e;
  }
}`;

pMjs = pMjs.replace(/async function generateArticle[\s\S]*?return JSON\.parse\(contentText\);\s*\}\s*catch[\s\S]*?\}\s*\}/, newGenerateArticle);

fs.writeFileSync('scripts/generate-parasha.mjs', pMjs, 'utf8');

// Do the same for generate-daily-tip.mjs
let dMjs = fs.readFileSync('scripts/generate-daily-tip.mjs', 'utf8');
dMjs = dMjs.replace(
  /const response = await fetch\(`https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/[^:]+:generateContent\?key=\${API_KEY}`/,
  `// Auto-discover model
    let modelName = 'gemini-1.5-flash';
    try {
      const listRes = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models?key=\${API_KEY}\`);
      if (listRes.ok) {
        const listData = await listRes.json();
        const models = listData.models || [];
        const flash = models.find(m => m.name.includes('flash') && m.supportedGenerationMethods.includes('generateContent'));
        if (flash) modelName = flash.name.replace('models/', '');
      }
    } catch (e) {}

    const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${modelName}:generateContent?key=\${API_KEY}\``
);
fs.writeFileSync('scripts/generate-daily-tip.mjs', dMjs, 'utf8');

console.log('Updated to dynamic model selection');
