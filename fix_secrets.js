const fs = require('fs');

// Fix parasha.yml
let pYml = fs.readFileSync('.github/workflows/parasha.yml', 'utf8');
pYml = pYml.replace('GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}', 'GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY_NEW }}');
fs.writeFileSync('.github/workflows/parasha.yml', pYml, 'utf8');

// Fix daily-tip.yml
let dYml = fs.readFileSync('.github/workflows/daily-tip.yml', 'utf8');
dYml = dYml.replace('GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}', 'GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY_NEW }}');
fs.writeFileSync('.github/workflows/daily-tip.yml', dYml, 'utf8');

// Fix generate-parasha.mjs model typo
let pMjs = fs.readFileSync('scripts/generate-parasha.mjs', 'utf8');
pMjs = pMjs.replace('gemini-3.6-flash', 'gemini-1.5-flash-latest');
fs.writeFileSync('scripts/generate-parasha.mjs', pMjs, 'utf8');

console.log('Fixed workflow secrets and typo');
