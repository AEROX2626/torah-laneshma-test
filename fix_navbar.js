const fs = require('fs');
let code = fs.readFileSync('app/components/Navbar.tsx', 'utf8');

code = code.replace(
  '"bg-white shadow-soft border-ink-100" : "bg-transparent border-ink-100/0"',
  '"bg-white/85 backdrop-blur-lg shadow-soft border-ink-100" : "bg-transparent border-ink-100/0"'
);

fs.writeFileSync('app/components/Navbar.tsx', code, 'utf8');
