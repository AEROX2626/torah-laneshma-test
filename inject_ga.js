const fs = require('fs');
const filePath = 'app/layout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const gaScript = `
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PQ4ZMY1H4V" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PQ4ZMY1H4V');
          \`}
        </Script>`;

if (!content.includes('G-PQ4ZMY1H4V')) {
  // Inject right before </head>
  content = content.replace('      </head>', gaScript + '\n      </head>');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Injected Google Analytics');
