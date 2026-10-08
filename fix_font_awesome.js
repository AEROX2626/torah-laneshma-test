const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

// Remove duplicate preloads and fix FontAwesome loading
code = code.replace(/<head>[\s\S]*?<\/head>/, `<head>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>`);

// Remove FontAwesome component import and usage
code = code.replace(/import FontAwesome from "\.\/components\/FontAwesome";\n/, '');
code = code.replace(/<FontAwesome \/>\n\s*/, '');

fs.writeFileSync('app/layout.tsx', code, 'utf8');
console.log('Fixed layout.tsx head and FontAwesome');
