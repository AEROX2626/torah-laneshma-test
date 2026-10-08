const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

code = code.replace(
  'className="w-full bg-slate-100 dark:bg-slate-800 rounded-full py-2.5 px-4 pr-10 outline-none shadow-inner text-base"',
  'className={`w-full rounded-full py-2.5 px-4 pr-10 outline-none shadow-inner text-base ${isDarkMode ? \'bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-300\' : \'bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-500\'}`}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed mobile search bar text color');
