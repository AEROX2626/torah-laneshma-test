const fs = require('fs');

let pMjs = fs.readFileSync('scripts/generate-parasha.mjs', 'utf8');
pMjs = pMjs.replace('const API_KEY = process.env.GEMINI_API_KEY;', 'const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;');
pMjs = pMjs.replace('console.error("Missing GEMINI_API_KEY");', 'console.error("Missing GEMINI_API_KEY. Available env keys: " + Object.keys(process.env).join(", "));');
fs.writeFileSync('scripts/generate-parasha.mjs', pMjs, 'utf8');

let dMjs = fs.readFileSync('scripts/generate-daily-tip.mjs', 'utf8');
dMjs = dMjs.replace('const API_KEY = process.env.GEMINI_API_KEY;', 'const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;');
dMjs = dMjs.replace('console.error("No GEMINI_API_KEY found");', 'console.error("No GEMINI_API_KEY found. Available env keys: " + Object.keys(process.env).join(", "));');
fs.writeFileSync('scripts/generate-daily-tip.mjs', dMjs, 'utf8');

console.log('Added debug logs');
