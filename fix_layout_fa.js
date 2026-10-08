const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

if (!code.includes('import FontAwesome from')) {
  code = code.replace('import HolidayBanner from "./components/HolidayBanner";', 'import HolidayBanner from "./components/HolidayBanner";\nimport FontAwesome from "./components/FontAwesome";');
}

const originalLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />';

const newHead = `<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </noscript>`;

code = code.replace(originalLink, newHead);

code = code.replace('<HolidayBanner />', '<FontAwesome />\n        <HolidayBanner />');

fs.writeFileSync('app/layout.tsx', code, 'utf8');
