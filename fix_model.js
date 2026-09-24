const fs = require('fs');

let pMjs = fs.readFileSync('scripts/generate-parasha.mjs', 'utf8');
pMjs = pMjs.replace('gemini-1.5-flash-latest', 'gemini-1.5-flash');
fs.writeFileSync('scripts/generate-parasha.mjs', pMjs, 'utf8');

let dMjs = fs.readFileSync('scripts/generate-daily-tip.mjs', 'utf8');
dMjs = dMjs.replace('gemini-1.5-flash-latest', 'gemini-1.5-flash');
fs.writeFileSync('scripts/generate-daily-tip.mjs', dMjs, 'utf8');

console.log('Fixed model name');
