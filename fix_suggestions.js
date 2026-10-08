const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// Replace desktop suggestions
code = code.replace(
  'className="w-full text-right px-5 py-2.5 hover:bg-blue-50 hover:text-blue-700 transition-colors text-slate-700 dark:text-slate-300 font-medium text-[15px] border-b border-slate-50 last:border-0 truncate"',
  'className={`w-full text-right px-5 py-2.5 transition-colors font-medium text-[15px] border-b last:border-0 truncate ${isDarkMode ? \'text-slate-300 hover:text-blue-400 hover:bg-slate-800 border-slate-800\' : \'text-slate-700 hover:text-blue-700 hover:bg-blue-50 border-slate-50\'}`}'
);

// Replace mobile suggestions
code = code.replace(
  'className="w-full text-right px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors text-slate-700 dark:text-slate-300 font-medium text-[15px] border-b border-slate-50 last:border-0 truncate"',
  'className={`w-full text-right px-4 py-3 transition-colors font-medium text-[15px] border-b last:border-0 truncate ${isDarkMode ? \'text-slate-300 hover:text-blue-400 hover:bg-slate-800 border-slate-800\' : \'text-slate-700 hover:text-blue-700 hover:bg-blue-50 border-slate-50\'}`}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed suggestions dropdown text colors');
