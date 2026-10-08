const fs = require('fs');
const filePath = 'app/layout.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Use a stronger regex to strip the Script component
content = content.replace(/<Script\s+src="https:\/\/analytics\.ahrefs\.com\/analytics\.js"\s+data-key="n9w2GKUrpeZ8gQf6pLCWlA"\s+strategy="afterInteractive"\s+\/>/g, '');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done');
