const fs = require('fs');
let code = fs.readFileSync('app/articles/[slug]/page.tsx', 'utf8');

code = code.replace(/<img src=\{otherArticle\.image\}/g, '<img loading="lazy" src={otherArticle.image}');
// The main article image doesn't need lazy loading if it's at the top, but wait, the main article image might be LCP!
// Let's check how it's rendered.
