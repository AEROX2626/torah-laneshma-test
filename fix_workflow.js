const fs = require('fs');
let code = fs.readFileSync('.github/workflows/daily-tip.yml', 'utf8');

code = code.replace(
  'node scripts/generate-daily-tip.mjs\n          node scripts/generate-daily-features.mjs',
  'node scripts/generate-daily-tip.mjs\n          sleep 30\n          node scripts/generate-daily-features.mjs'
);

fs.writeFileSync('.github/workflows/daily-tip.yml', code, 'utf8');
console.log('Added sleep to avoid rate limits');
