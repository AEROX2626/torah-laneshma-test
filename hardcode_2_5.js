const fs = require('fs');

let pMjs = fs.readFileSync('scripts/generate-parasha.mjs', 'utf8');
pMjs = pMjs.replace("let modelName = 'gemini-1.5-flash';", "let modelName = 'gemini-2.5-flash';");
fs.writeFileSync('scripts/generate-parasha.mjs', pMjs, 'utf8');

let dMjs = fs.readFileSync('scripts/generate-daily-tip.mjs', 'utf8');
dMjs = dMjs.replace("let modelName = 'gemini-1.5-flash';", "let modelName = 'gemini-2.5-flash';");
fs.writeFileSync('scripts/generate-daily-tip.mjs', dMjs, 'utf8');

console.log('Fixed fallback to 2.5');
