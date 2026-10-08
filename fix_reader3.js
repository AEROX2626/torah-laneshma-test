const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// Dashboard Title
code = code.replace(
  'className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 font-serif mb-3"',
  'className={`text-2xl md:text-3xl font-bold font-serif mb-3 ${isDarkMode ? \'text-slate-200\' : \'text-slate-800\'}`}'
);

// Dashboard subtitle
code = code.replace(
  'className="text-slate-600 dark:text-slate-400 text-lg"',
  'className={`text-lg ${isDarkMode ? \'text-slate-400\' : \'text-slate-600\'}`}'
);

// Dashboard sections
code = code.replace(
  'className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2"',
  'className={`text-xl font-bold mb-5 flex items-center gap-2 border-b pb-2 ${isDarkMode ? \'text-slate-200 border-slate-800\' : \'text-slate-800 border-slate-200\'}`}'
);
code = code.replace(
  'className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2"',
  'className={`text-xl font-bold mb-5 flex items-center gap-2 border-b pb-2 ${isDarkMode ? \'text-slate-200 border-slate-800\' : \'text-slate-800 border-slate-200\'}`}'
);

// Buttons in dashboard
code = code.replace(
  /className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-right group flex flex-col gap-2"/g,
  'className={`p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-right group flex flex-col gap-2 ${isDarkMode ? \'bg-slate-900 border-slate-800\' : \'bg-white border-slate-200\'}`}'
);

code = code.replace(
  /className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-right group flex flex-col gap-1"/g,
  'className={`p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-right group flex flex-col gap-1 ${isDarkMode ? \'bg-slate-900 border-slate-800\' : \'bg-white border-slate-200\'}`}'
);

code = code.replace(
  /className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 transition-colors font-serif"/g,
  'className={`text-lg font-bold group-hover:text-blue-700 transition-colors font-serif ${isDarkMode ? \'text-slate-200\' : \'text-slate-800\'}`}'
);

code = code.replace(
  /className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 transition-colors font-serif"/g,
  'className={`text-lg font-bold group-hover:text-amber-700 transition-colors font-serif ${isDarkMode ? \'text-slate-200\' : \'text-slate-800\'}`}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed dashboard classes');
