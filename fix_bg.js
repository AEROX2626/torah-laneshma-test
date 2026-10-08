const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="absolute inset-0 opacity-[^"]* bg-\[url\('data:image\/svg\+xml;base64,[^']+'\)\]"><\/div>/g;

content = content.replace(regex, '');

fs.writeFileSync(file, content, 'utf8');
console.log('Removed base64 SVGs from page.tsx');
