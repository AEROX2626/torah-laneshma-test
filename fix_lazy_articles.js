const fs = require('fs');
let code = fs.readFileSync('app/articles/page.tsx', 'utf8');

code = code.replace(/<img src=\{article.image\}/g, '<img loading="lazy" src={article.image}');

fs.writeFileSync('app/articles/page.tsx', code, 'utf8');
console.log('Added loading="lazy" to articles');
