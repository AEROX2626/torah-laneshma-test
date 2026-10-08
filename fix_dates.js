const fs = require('fs');

function fixDate(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /new Date\(\)\.toLocaleDateString\('he-IL'\)/g,
    "new Date().toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' })"
  );
  fs.writeFileSync(file, code, 'utf8');
}

fixDate('scripts/generate-daily-tip.mjs');
fixDate('scripts/generate-daily-features.mjs');

console.log('Fixed dates');
