const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Make the h1 title clickable to reset Beit Midrash
code = code.replace(
  '<h1 className="font-serif font-bold text-xl md:text-2xl text-slate-800 dark:text-slate-200 whitespace-nowrap">\n            בית מדרש\n          </h1>',
  '<button onClick={() => { setData(null); setQuery(""); }} className="font-serif font-bold text-xl md:text-2xl text-slate-800 dark:text-slate-200 whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors">\n            בית מדרש\n          </button>'
);

// 2. Change the mobile fa-home button to link to '/'
code = code.replace(
  '<button \n            onClick={() => {\n              setData(null);\n              setQuery("");\n            }}\n            className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isDarkMode ? \'bg-slate-800 text-slate-300\' : \'bg-slate-100 text-slate-700\'}`}\n          >\n            <i className="fas fa-home"></i>\n          </button>',
  '<Link \n            href="/"\n            className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isDarkMode ? \'bg-slate-800 text-slate-300\' : \'bg-slate-100 text-slate-700\'}`}\n          >\n            <i className="fas fa-home"></i>\n          </Link>'
);

// 3. Change the desktop fa-home button to link to '/'
code = code.replace(
  '<button \n            onClick={() => {\n              setData(null);\n              setQuery("");\n            }} \n            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${isDarkMode ? \'bg-slate-800 hover:bg-slate-700 text-slate-300\' : \'bg-slate-100 hover:bg-slate-200 text-slate-700\'}`}\n            title="חזרה לראשי"\n          >\n            <i className="fas fa-home text-blue-500"></i> ראשי\n          </button>',
  '<Link \n            href="/"\n            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${isDarkMode ? \'bg-slate-800 hover:bg-slate-700 text-slate-300\' : \'bg-slate-100 hover:bg-slate-200 text-slate-700\'}`}\n            title="חזרה לעמוד הבית"\n          >\n            <i className="fas fa-home text-blue-500"></i> ראשי\n          </Link>'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed navigation behavior');
