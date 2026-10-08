const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// Fix text-[15px] everywhere in SefariaReader
code = code.replace(/text-\[15px\]/g, 'text-base');

// Fix the dark mode text color for the mobile search bar
code = code.replace(
  "${isDarkMode ? 'bg-slate-800 focus:bg-slate-900 text-slate-100 placeholder:text-slate-400' : 'bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-500'}",
  "${isDarkMode ? 'bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-300' : 'bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-500'}"
);

// Fix the jump input text color
code = code.replace(
  'className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-center text-base font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"',
  'className={`flex-1 rounded-lg px-3 py-2 text-center text-base font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? \'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400\' : \'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500\'}`}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed mobile search bar and jump input zoom and color');
