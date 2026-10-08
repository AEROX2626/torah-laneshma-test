const fs = require('fs');
const filePath = 'app/layout.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// The exact string to remove from body
const oldScript = `        <Script \n          src="https://analytics.ahrefs.com/analytics.js" \n          data-key="n9w2GKUrpeZ8gQf6pLCWlA" \n          strategy="afterInteractive" \n        />`;

content = content.replace(oldScript, '');
// Also remove empty lines left behind if needed.

// Add to head
const rawScript = `        <script src="https://analytics.ahrefs.com/analytics.js" data-key="n9w2GKUrpeZ8gQf6pLCWlA" async></script>`;

if (!content.includes('<script src="https://analytics.ahrefs.com/analytics.js"')) {
    content = content.replace(
        '</head>',
        rawScript + '\n      </head>'
    );
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Moved script to <head> accurately');
