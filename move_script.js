const fs = require('fs');
const filePath = 'app/layout.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Remove from body
content = content.replace(/<Script[\s\S]*?analytics\.ahrefs\.com[\s\S]*?\/>\n/g, '');

// Add to head
const rawScript = `
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="n9w2GKUrpeZ8gQf6pLCWlA" async></script>`;

if (!content.includes('analytics.ahrefs.com')) {
    content = content.replace(
        '</head>',
        rawScript + '\n      </head>'
    );
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Moved script to <head>');
