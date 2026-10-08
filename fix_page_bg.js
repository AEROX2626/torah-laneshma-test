const fs = require('fs');
let code = fs.readFileSync('app/study/page.tsx', 'utf8');
code = code.replace('bg-[#f4ece3]', 'bg-[#f4ece3] dark:bg-slate-950');
fs.writeFileSync('app/study/page.tsx', code, 'utf8');
