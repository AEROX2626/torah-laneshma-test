const fs = require('fs');

const filePath = 'app/layout.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('next/script')) {
    content = content.replace(
        'import type { Metadata } from "next";',
        'import type { Metadata } from "next";\nimport Script from "next/script";'
    );
}

const scriptTag = `        <Script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="n9w2GKUrpeZ8gQf6pLCWlA" 
          strategy="afterInteractive" 
        />
`;

// Insert the Script component right after <HolidayBanner />
if (!content.includes('analytics.ahrefs.com')) {
    content = content.replace(
        '<HolidayBanner />',
        '<HolidayBanner />\n' + scriptTag
    );
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Script injected.');
