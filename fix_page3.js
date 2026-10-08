const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /><\/div>\s*<div className="bg-white rounded-\[2rem\][\s\S]*?\)\}/;
code = code.replace(regex, '');

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Fixed syntax error');
