const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

code = code.replace(
  /fetch\(`https:\/\/www\.hebcal\.com\/complete\?q=\$\{encodeURIComponent\(searchQuery\)\}`\)/,
  'fetch(`/api/hebcal?q=${encodeURIComponent(searchQuery)}`)'
);

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
console.log('Updated fetch URL to use local API route');
