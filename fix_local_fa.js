const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

// Remove the external CDN links
code = code.replace(/<link rel="preload" as="style" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css" \/>\s*<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css" media="print" onLoad=\{\(e\) => \{ e\.currentTarget\.media = 'all'; \}\} \/>\s*<noscript>\s*<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css" \/>\s*<\/noscript>/g, '');

// Import local CSS
if (!code.includes('@fortawesome/fontawesome-free/css/all.min.css')) {
  code = code.replace('import "./globals.css";', 'import "./globals.css";\nimport "@fortawesome/fontawesome-free/css/all.min.css";');
}

fs.writeFileSync('app/layout.tsx', code, 'utf8');
console.log('Fixed FontAwesome to use local import');
