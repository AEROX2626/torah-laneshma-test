const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

code = code.replace(
  '<link\n          rel="stylesheet"\n          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"\n          media="print"\n          onLoad={(e) => { e.currentTarget.media = "all"; }}\n        />',
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />'
);

code = code.replace(
  '<noscript>\n          <link\n            rel="stylesheet"\n            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"\n          />\n        </noscript>',
  ''
);

fs.writeFileSync('app/layout.tsx', code, 'utf8');
