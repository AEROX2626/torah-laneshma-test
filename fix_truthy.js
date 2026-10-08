const fs = require('fs');
let code = fs.readFileSync('app/articles/[slug]/page.tsx', 'utf8');

code = code.replace("'תורה לנשמה' || 'תורה לנשמה'", "'תורה לנשמה'");

fs.writeFileSync('app/articles/[slug]/page.tsx', code, 'utf8');
console.log("Fixed truthy expression");
