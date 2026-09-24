const fs = require('fs');

let pYml = fs.readFileSync('.github/workflows/parasha.yml', 'utf8');
pYml = pYml.replace('GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY_NEW }}', 'GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY_NEW }}\n          OLD_KEY: ${{ secrets.GEMINI_API_KEY }}');
fs.writeFileSync('.github/workflows/parasha.yml', pYml, 'utf8');

let dYml = fs.readFileSync('.github/workflows/daily-tip.yml', 'utf8');
dYml = dYml.replace('GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY_NEW }}', 'GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY_NEW }}\n          OLD_KEY: ${{ secrets.GEMINI_API_KEY }}');
fs.writeFileSync('.github/workflows/daily-tip.yml', dYml, 'utf8');

console.log('Passed old key too');
