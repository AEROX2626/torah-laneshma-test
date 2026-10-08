const fs = require('fs');
let code = fs.readFileSync('.github/workflows/parasha.yml', 'utf8');
code = code.replace(
  "GEMINI_MODEL: gemini-3.8-flash",
  "GEMINI_MODEL: gemini-3.5-flash"
);
fs.writeFileSync('.github/workflows/parasha.yml', code, 'utf8');
console.log('Fixed GEMINI_MODEL env var in parasha.yml');
