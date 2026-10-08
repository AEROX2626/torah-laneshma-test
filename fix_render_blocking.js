const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

const oldCss = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />';
const newCss = `<link rel="preload" as="style" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onLoad={(e) => { e.currentTarget.media = 'all'; }} />
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </noscript>`;

code = code.replace(oldCss, newCss);

fs.writeFileSync('app/layout.tsx', code, 'utf8');
console.log('Fixed render blocking CSS');
