const fs = require('fs');

const requestGeminiBlock = `
async function requestGemini(modelName, requestBody) {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${encodeURIComponent(modelName)}:generateContent?key=\${API_KEY}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    if (res.ok) return res.json();
    const errorText = await res.text();
    console.error(\`Gemini API error (attempt \${attempt}): \${res.status} - \${errorText}\`);
    if (attempt === maxAttempts) throw new Error(\`Gemini failed: \${res.status} - \${errorText}\`);
    await new Promise(r => setTimeout(r, 2000));
  }
}
`;

// Fix generate-daily-tip.mjs
let dTip = fs.readFileSync('scripts/generate-daily-tip.mjs', 'utf8');
if (!dTip.includes('async function requestGemini')) {
  dTip = dTip.replace('async function run() {', requestGeminiBlock + '\nasync function run() {');
  dTip = dTip.replace(/const response = await fetch\([\s\S]*?\}\);[\s\S]*?const result = await response.json\(\);/, `const result = await requestGemini(modelName, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json"
        }
      });`);
  fs.writeFileSync('scripts/generate-daily-tip.mjs', dTip, 'utf8');
}

// Fix generate-daily-features.mjs
let dFeat = fs.readFileSync('scripts/generate-daily-features.mjs', 'utf8');
if (!dFeat.includes('async function requestGemini')) {
  dFeat = dFeat.replace('async function askGemini(prompt, isJson = false) {', requestGeminiBlock + '\nasync function askGemini(prompt, isJson = false) {');
  dFeat = dFeat.replace(/const response = await fetch\([\s\S]*?\}\);[\s\S]*?const result = await response.json\(\);/, `const result = await requestGemini(modelName, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
          temperature: 0.8,
          ...(isJson ? { responseMimeType: "application/json" } : {})
      }
    });`);
  fs.writeFileSync('scripts/generate-daily-features.mjs', dFeat, 'utf8');
}

console.log('Added requestGemini wrapper');
