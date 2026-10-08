const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// Add the HTML class toggler inside useEffect
const toggler = `
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
`;

code = code.replace(
  '  const [calendar, setCalendar] = useState<any[]>([]);',
  `  const [calendar, setCalendar] = useState<any[]>([]);\n${toggler}`
);

// Clean up the wrapper div
code = code.replace(
  '<div className={`flex-1 flex flex-col h-[calc(100vh-80px)] font-sans relative overflow-hidden transition-colors duration-300 ${isDarkMode ? \'dark bg-slate-950 text-slate-200\' : \'bg-slate-50\'}`}>',
  '<div className="flex-1 flex flex-col h-[calc(100vh-80px)] font-sans relative overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Added html dark class toggler');
