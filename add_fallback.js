const fs = require('fs');

function addFallbackModel(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    'async function requestGemini(modelName, requestBody) {',
    'async function requestGemini(baseModelName, requestBody) {'
  );
  code = code.replace(
    'for (let attempt = 1; attempt <= maxAttempts; attempt++) {\n    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${API_KEY}`',
    `for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const modelName = (attempt >= 4 && baseModelName === 'gemini-3.8-flash') ? 'gemini-3.8-flash-lite' : baseModelName;
    const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${encodeURIComponent(modelName)}:generateContent?key=\${API_KEY}\``
  );
  fs.writeFileSync(file, code, 'utf8');
}

addFallbackModel('scripts/generate-daily-tip.mjs');
addFallbackModel('scripts/generate-daily-features.mjs');
console.log('Added fallback logic');
