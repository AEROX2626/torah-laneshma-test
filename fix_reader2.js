const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

code = code.replace(
  'className="text-xl md:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-2 leading-tight"',
  'className={`text-xl md:text-3xl font-bold font-serif mb-2 leading-tight ${isDarkMode ? \'text-slate-100\' : \'text-slate-900\'}`}'
);

code = code.replace(
  'className="text-slate-500 dark:text-slate-400 font-medium"',
  'className={`font-medium ${isDarkMode ? \'text-slate-400\' : \'text-slate-500\'}`}'
);

// Container background
code = code.replace(
  '<div className="flex-1 flex flex-col h-[calc(100vh-80px)] font-sans relative overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">',
  '<div className={`flex-1 flex flex-col h-[calc(100vh-80px)] font-sans relative overflow-hidden transition-colors duration-300 ${isDarkMode ? \'bg-slate-950 text-slate-200\' : \'bg-slate-50 text-slate-900\'}`}>'
);

// Reader scrollable text background
code = code.replace(
  'className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth bg-white dark:bg-slate-900"',
  'className={`flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth ${isDarkMode ? \'bg-slate-900\' : \'bg-white\'}`}'
);

// App Top Bar background
code = code.replace(
  'className="h-16 md:h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between px-4 md:px-8 shrink-0 z-50 relative"',
  'className={`h-16 md:h-20 border-b shadow-sm flex items-center justify-between px-4 md:px-8 shrink-0 z-50 relative transition-colors ${isDarkMode ? \'bg-slate-900 border-slate-800\' : \'bg-white border-slate-200\'}`}'
);

// Search bar background
code = code.replace(
  'className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:bg-white dark:bg-slate-900 focus:border-blue-500 rounded-full py-2.5 px-6 pr-12 outline-none transition-all shadow-inner text-[15px]"',
  'className={`w-full border border-transparent focus:border-blue-500 rounded-full py-2.5 px-6 pr-12 outline-none transition-all shadow-inner text-[15px] ${isDarkMode ? \'bg-slate-800 focus:bg-slate-900 text-slate-200 placeholder-slate-400\' : \'bg-slate-100 focus:bg-white text-slate-900\'}`}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed more reader classes');
