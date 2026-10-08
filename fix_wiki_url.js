const fs = require('fs');
let code = fs.readFileSync('scripts/generate-parasha.mjs', 'utf8');
code = code.replace(
  "return imgInfo.url;",
  "return imgInfo.url.split('?')[0];"
);
fs.writeFileSync('scripts/generate-parasha.mjs', code, 'utf8');
console.log('Fixed wikimedia URL string');
