const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

// Add targetDate state
code = code.replace(
  'const [times, setTimes] = useState<{ inTime: string; outTime: string; eventName: string; city: string } | null>(null);',
  'const [times, setTimes] = useState<{ inTime: string; outTime: string; eventName: string; city: string; dateStr: string } | null>(null);\n  const [targetDate, setTargetDate] = useState<Date>(new Date());'
);

// Update fetchShabbatTimes signature to take targetDate
code = code.replace(
  'const fetchShabbatTimes = (query: string, cityName: string) => {',
  `const fetchShabbatTimes = (query: string, cityName: string, d: Date = targetDate) => {
    const gy = d.getFullYear();
    const gm = d.getMonth() + 1;
    const gd = d.getDate();`
);

// Update fetch URL inside fetchShabbatTimes
code = code.replace(
  /fetch\(`https:\/\/www\.hebcal\.com\/shabbat\?cfg=json&\$\{query\}&lg=he`\)/,
  'fetch(`https://www.hebcal.com/shabbat?cfg=json&${query}&lg=he&gy=${gy}&gm=${gm}&gd=${gd}`)'
);

// Update setTimes inside fetchShabbatTimes
code = code.replace(
  /city: cityName,\n\s*\}\);/,
  `city: cityName,
            dateStr: new Date(candles.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', timeZone: 'Asia/Jerusalem' }),
          });`
);

// Add useEffect dependency to re-fetch on targetDate change
code = code.replace(
  'fetchShabbatTimes(`geonameid=${cityId}`, cityName);',
  'fetchShabbatTimes(`geonameid=${cityId}`, cityName, targetDate);'
);

const oldUseEffectStorage = `  useEffect(() => {
    const saved = localStorage.getItem("shabbatLocation");
    if (saved) {
      try {
        const { query, cityName } = JSON.parse(saved);
        fetchShabbatTimes(query, cityName);
      } catch (e) {
        fetchShabbatTimes("geonameid=281184", "ירושלים");
      }
    } else {
      fetchShabbatTimes("geonameid=281184", "ירושלים");
    }
  }, []);`;

const newUseEffectStorage = `  useEffect(() => {
    const saved = localStorage.getItem("shabbatLocation");
    if (saved) {
      try {
        const { query, cityName } = JSON.parse(saved);
        fetchShabbatTimes(query, cityName, targetDate);
      } catch (e) {
        fetchShabbatTimes("geonameid=281184", "ירושלים", targetDate);
      }
    } else {
      fetchShabbatTimes("geonameid=281184", "ירושלים", targetDate);
    }
  }, [targetDate]);`;

if (code.includes(oldUseEffectStorage)) {
  code = code.replace(oldUseEffectStorage, newUseEffectStorage);
} else {
  // LF fallback
  code = code.replace(oldUseEffectStorage.replace(/\r\n/g, '\n'), newUseEffectStorage);
}

// Add UI elements
const oldUI = `        <div className="flex flex-col text-[11px] font-medium text-ink-500 leading-tight">
          <span>כניסה: {times.inTime}</span>
          <span>יציאה: {times.outTime}</span>
        </div>`;
const newUI = `        <div className="flex items-center gap-2 text-ink-600 bg-ink-50 px-2.5 py-1 rounded-lg border border-ink-100">
          <button onClick={() => setTargetDate(d => new Date(d.getTime() - 7 * 86400000))} className="hover:text-primary-600 transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-white"><i className="fas fa-chevron-right text-[10px]"></i></button>
          <span className="font-bold text-xs tracking-wide min-w-[75px] text-center">{times.dateStr}</span>
          <button onClick={() => setTargetDate(d => new Date(d.getTime() + 7 * 86400000))} className="hover:text-primary-600 transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-white"><i className="fas fa-chevron-left text-[10px]"></i></button>
        </div>
        <div className="flex flex-col text-[11px] font-medium text-ink-500 leading-tight">
          <span>כניסה: {times.inTime}</span>
          <span>יציאה: {times.outTime}</span>
        </div>`;

if (code.includes(oldUI)) {
  code = code.replace(oldUI, newUI);
} else {
  // Regex fallback
  code = code.replace(/<div className="flex flex-col text-\[11px\] font-medium text-ink-500 leading-tight">\s*<span>כניסה: \{times\.inTime\}<\/span>\s*<span>יציאה: \{times\.outTime\}<\/span>\s*<\/div>/, newUI);
}

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
