const fs = require('fs');

// Fix generate-daily-tip.mjs
let dTip = fs.readFileSync('scripts/generate-daily-tip.mjs', 'utf8');
dTip = dTip.replace(
  'const API_KEY = process.env.GEMINI_API_KEY;',
  'const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;'
);
dTip = dTip.replace(
  'const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`',
  `const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.1-flash-lite';\n    const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${modelName}:generateContent?key=\${API_KEY}\``
);
fs.writeFileSync('scripts/generate-daily-tip.mjs', dTip, 'utf8');

// Fix generate-daily-features.mjs
let dFeat = fs.readFileSync('scripts/generate-daily-features.mjs', 'utf8');
dFeat = dFeat.replace(
  'const API_KEY = process.env.GEMINI_API_KEY;',
  'const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;'
);
dFeat = dFeat.replace(
  'const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`',
  `const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.1-flash-lite';\n  const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${modelName}:generateContent?key=\${API_KEY}\``
);
fs.writeFileSync('scripts/generate-daily-features.mjs', dFeat, 'utf8');

console.log('Restored files and applied fixes');
