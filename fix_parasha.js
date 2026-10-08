const fs = require('fs');
let code = fs.readFileSync('scripts/generate-parasha.mjs', 'utf8');
code = code.replace(
  "const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';",
  "const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash';"
);
// Make sure it doesn't fail on 429 either
code = code.replace(
  "const retryableStatuses = new Set([500, 502, 503, 504]);",
  "const retryableStatuses = new Set([429, 500, 502, 503, 504]);"
);
fs.writeFileSync('scripts/generate-parasha.mjs', code, 'utf8');
console.log('Fixed generate-parasha.mjs');
