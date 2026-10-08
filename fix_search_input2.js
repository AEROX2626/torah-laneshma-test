const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

code = code.replace(
  "text-[15px] ${isDarkMode ? 'bg-slate-800 focus:bg-slate-900 text-slate-100 placeholder:text-slate-400'",
  "text-base ${isDarkMode ? 'bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-300'"
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed search text size and color');
