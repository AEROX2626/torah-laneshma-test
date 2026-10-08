const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

code = code.replace(/<link rel="preconnect" href="https:\/\/cdnjs\.cloudflare\.com" crossOrigin="anonymous" \/>/g, '');

fs.writeFileSync('app/layout.tsx', code, 'utf8');
console.log('Cleaned up preconnects');
