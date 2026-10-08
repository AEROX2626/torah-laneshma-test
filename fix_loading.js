const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

// 1. Add isLoading state
code = code.replace(
  'const [searchResults, setSearchResults] = useState<any[]>([]);',
  'const [searchResults, setSearchResults] = useState<any[]>([]);\n  const [isLoading, setIsLoading] = useState(false);'
);

// 2. Set isLoading in fetchShabbatTimes
code = code.replace(
  'const fetchShabbatTimes = (query: string, cityName: string, d: Date = targetDate) => {',
  `const fetchShabbatTimes = (query: string, cityName: string, d: Date = targetDate) => {
    setIsLoading(true);`
);

// 3. Clear isLoading after fetch
code = code.replace(
  /dateStr: new Date\(candles\.date\)\.toLocaleDateString\('he-IL', \{ day: 'numeric', month: 'long', timeZone: 'Asia\/Jerusalem' \}\),\n\s*\}\);\n\s*\}\n\s*\}\)\n\s*\.catch\(\(err\) => console\.error\("Failed to load Shabbat times", err\)\);/,
  `dateStr: new Date(candles.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', timeZone: 'Asia/Jerusalem' }),
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Shabbat times", err);
        setIsLoading(false);
      });`
);

// 4. Update UI to reflect loading state
const oldUI = `<span className="font-bold text-xs tracking-wide min-w-[75px] text-center">{times.dateStr}</span>`;
const newUI = `<span className={\`font-bold text-xs tracking-wide min-w-[75px] text-center transition-opacity duration-300 \${isLoading ? 'opacity-30' : 'opacity-100'}\`}>{times.dateStr}</span>`;
code = code.replace(oldUI, newUI);

const oldUI2 = `<div className="flex flex-col text-[11px] font-medium text-ink-500 leading-tight">
          <span>כניסה: {times.inTime}</span>
          <span>יציאה: {times.outTime}</span>
        </div>`;
const newUI2 = `<div className={\`flex flex-col text-[11px] font-medium text-ink-500 leading-tight transition-opacity duration-300 \${isLoading ? 'opacity-30' : 'opacity-100'}\`}>
          <span>כניסה: {times.inTime}</span>
          <span>יציאה: {times.outTime}</span>
        </div>`;

if (code.includes(oldUI2)) {
  code = code.replace(oldUI2, newUI2);
} else {
  code = code.replace(/<div className="flex flex-col text-\[11px\] font-medium text-ink-500 leading-tight">\s*<span>כניסה: \{times\.inTime\}<\/span>\s*<span>יציאה: \{times\.outTime\}<\/span>\s*<\/div>/, newUI2);
}

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
console.log('Added isLoading state');
