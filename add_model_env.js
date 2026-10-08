const fs = require('fs');

let pYml = fs.readFileSync('.github/workflows/parasha.yml', 'utf8');
pYml = pYml.replace('GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY_NEW }}\n          OLD_KEY: ${{ secrets.GEMINI_API_KEY }}', 'GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY_NEW }}\n          GEMINI_MODEL: gemini-3.1-flash-lite');
fs.writeFileSync('.github/workflows/parasha.yml', pYml, 'utf8');

console.log('Updated workflow');
