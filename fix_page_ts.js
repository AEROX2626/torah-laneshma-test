const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

code = code.replace('constEls', 'const els');
code = code.replace('   Els.forEach', '   els.forEach');

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Fixed typescript error');
