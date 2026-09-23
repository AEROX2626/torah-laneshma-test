const fs = require('fs');
const lines = fs.readFileSync('app/page.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('id="join"'));
if (idx > -1) console.log(lines.slice(idx, idx+40).join('\n'));
