const fs = require('fs');
let code = fs.readFileSync('scripts/generate-parasha.mjs', 'utf8');

code = code.replace(
  "const parashaEvent = data.items.find(item => item.category === 'parashat');",
  "const today = new Date().toISOString().split('T')[0];\n  const parashaEvent = data.items.find(item => item.category === 'parashat' && item.date >= today);"
);

fs.writeFileSync('scripts/generate-parasha.mjs', code, 'utf8');
console.log('Fixed parasha fetching logic');
