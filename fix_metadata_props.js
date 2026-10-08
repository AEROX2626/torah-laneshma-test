const fs = require('fs');
let code = fs.readFileSync('app/articles/[slug]/page.tsx', 'utf8');

code = code.replace(/article\.abstract/g, 'article.excerpt');
code = code.replace(/article\.author/g, "'תורה לנשמה'");

fs.writeFileSync('app/articles/[slug]/page.tsx', code, 'utf8');
console.log("Fixed metadata properties");
