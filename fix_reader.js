const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Add "Home" button
const returnHomeBtn = `
          <button 
            onClick={() => {
              setData(null);
              setQuery("");
            }} 
            className={\`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors \${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}\`}
            title="חזרה לראשי"
          >
            <i className="fas fa-home text-blue-500"></i> ראשי
          </button>
          
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={\`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors \${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}\`}>
`;

code = code.replace(
  '<button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-full font-medium text-slate-700 dark:text-slate-300 transition-colors">',
  returnHomeBtn
);

// Add Home button to mobile as well (in the header)
const mobileHomeBtn = `
          <button 
            onClick={() => {
              setData(null);
              setQuery("");
            }}
            className={\`md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors \${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}\`}
          >
            <i className="fas fa-home"></i>
          </button>
`;
code = code.replace(
  '<i className={`fas ${isDarkMode ? \'fa-sun\' : \'fa-moon\'}`}></i>\n          </button>',
  '<i className={`fas ${isDarkMode ? \'fa-sun\' : \'fa-moon\'}`}></i>\n          </button>\n' + mobileHomeBtn
);

// 2. Fix the paragraph text color to be hardcoded conditional!
code = code.replace(
  'className="font-serif text-slate-900 dark:text-slate-50 leading-loose"',
  'className={`font-serif leading-loose ${isDarkMode ? \'text-slate-50\' : \'text-slate-900\'}`}'
);

code = code.replace(
  'className="mt-3 text-slate-500 dark:text-slate-400 font-sans leading-relaxed text-left opacity-90 border-l-4 border-slate-200 dark:border-slate-800 pl-4"',
  'className={`mt-3 font-sans leading-relaxed text-left opacity-90 border-l-4 pl-4 ${isDarkMode ? \'text-slate-400 border-slate-800\' : \'text-slate-500 border-slate-200\'}`}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed buttons and text colors');
