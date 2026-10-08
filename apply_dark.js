const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Replace classes
const classMap = {
  'bg-white': 'bg-white dark:bg-slate-900',
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-800/50',
  'bg-slate-100': 'bg-slate-100 dark:bg-slate-800',
  'bg-\\[#f8f5f0\\]': 'bg-[#f8f5f0] dark:bg-slate-950',
  'text-slate-900': 'text-slate-900 dark:text-slate-50',
  'text-slate-800': 'text-slate-800 dark:text-slate-200',
  'text-slate-700': 'text-slate-700 dark:text-slate-300',
  'text-slate-600': 'text-slate-600 dark:text-slate-400',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'border-slate-200': 'border-slate-200 dark:border-slate-800',
  'border-slate-100': 'border-slate-100 dark:border-slate-800/50',
  'border-slate-300': 'border-slate-300 dark:border-slate-700',
};

// Careful not to replace already replaced ones, so let's do a simple replace logic
Object.entries(classMap).forEach(([oldClass, newClass]) => {
  // Regex to match exact old class, making sure it's not already followed by dark:
  const regex = new RegExp(`(?<!dark:)${oldClass}(?![\\w-])`, 'g');
  code = code.replace(regex, newClass);
});

// 2. Add Dark Mode State
code = code.replace(
  'const [jumpInput, setJumpInput] = useState(\'\');',
  `const [jumpInput, setJumpInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);`
);

// 3. Load Dark Mode from LocalStorage
code = code.replace(
  `const lastRead = localStorage.getItem('sefaria_last_read');`,
  `const savedDark = localStorage.getItem('sefaria_dark_mode');
    if (savedDark) {
      setIsDarkMode(savedDark === 'true');
    }
    const lastRead = localStorage.getItem('sefaria_last_read');`
);

// 4. Toggle function
const toggleDarkModeCode = `
  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem('sefaria_dark_mode', String(newVal));
  };
`;
code = code.replace(
  'const [showTocModal, setShowTocModal] = useState(false);',
  `const [showTocModal, setShowTocModal] = useState(false);\n${toggleDarkModeCode}`
);

// 5. Wrap the main component in .dark if enabled.
// We need to find the outermost div and make sure it has dark conditional.
// The outermost div currently is `<div className="flex-1 flex flex-col h-[calc(100vh-80px)] font-sans relative overflow-hidden bg-slate-50">`
// Wait, the outermost is actually `<div className="flex-1 flex flex-col h-[calc(100vh-80px)] font-sans relative overflow-hidden bg-slate-50">`
code = code.replace(
  `<div className="flex-1 flex flex-col h-[calc(100vh-80px)] font-sans relative overflow-hidden bg-slate-50 dark:bg-slate-800/50">`,
  `<div className={\`flex-1 flex flex-col h-[calc(100vh-80px)] font-sans relative overflow-hidden transition-colors duration-300 \${isDarkMode ? 'dark bg-slate-950 text-slate-200' : 'bg-slate-50'}\`}>`
);

// 6. Add a toggle button to the header
const toggleBtn = `
          <button 
            onClick={toggleDarkMode} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="מצב קריאת לילה"
          >
            <i className={\`fas \${isDarkMode ? 'fa-sun' : 'fa-moon'}\`}></i>
          </button>
`;
code = code.replace(
  '<button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex',
  toggleBtn + '\n          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Done applying dark mode');
