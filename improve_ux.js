const fs = require('fs');
let code = fs.readFileSync('app/components/JewishCalendarWidget.tsx', 'utf8');

// 1. Add touch state
code = code.replace(
  'const [items, setItems] = useState<any[]>([]);',
  'const [items, setItems] = useState<any[]>([]);\n  const [touchStartX, setTouchStartX] = useState<number | null>(null);'
);

// 2. Add swipe handlers
code = code.replace(
  'const nextMonth = () => setCurrentDate(new Date(year, month, 1));',
  `const nextMonth = () => setCurrentDate(new Date(year, month, 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    
    // In RTL, swipe right (diff > 50) goes to NEXT month (visually left). Swipe left (diff < -50) goes to PREV month.
    if (diff > 50) {
      nextMonth();
    } else if (diff < -50) {
      prevMonth();
    }
    setTouchStartX(null);
  };`
);

// 3. Attach swipe handlers and improve UI
code = code.replace(
  '<div className="flex-grow overflow-y-auto p-2 md:p-8 bg-ink-50/30 no-scrollbar">',
  '<div className="flex-grow overflow-y-auto p-3 md:p-8 bg-ink-50/40 no-scrollbar" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>'
);

// 4. Improve cell design (Today circle, softer colors, nicer badges)
const cellOld = /const isToday = new Date\(\)\.getDate\(\)[\s\S]*?<div className="flex-grow flex flex-col gap-1 mt-0\.5 md:mt-1 overflow-hidden justify-end md:justify-start">/m;
const cellNew = `const isToday = new Date().getDate() === day && new Date().getMonth() + 1 === month && new Date().getFullYear() === year;
                const isShabbat = (startWeekday + i) % 7 === 6;
                
                return (
                  <div key={day} className={\`min-h-[80px] md:min-h-[120px] rounded-xl md:rounded-2xl border p-1.5 md:p-3 flex flex-col transition-all group \${
                    isToday 
                      ? 'bg-white border-primary-300 ring-1 ring-primary-200 shadow-sm relative' 
                      : 'bg-white border-ink-100 hover:border-primary-200 hover:shadow-md'
                  }\`}>
                    {isToday && <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 rounded-t-xl md:rounded-t-2xl"></div>}
                    
                    <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start mb-2 gap-1 md:gap-0">
                      <div className={\`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full \${isToday ? 'bg-primary-600 text-white font-bold' : (isShabbat ? 'text-primary-600 font-bold' : 'text-ink-800 font-bold')} text-[14px] md:text-lg\`}>
                        {day}
                      </div>
                      <span className={\`text-[10px] md:text-sm font-semibold leading-none \${isToday ? 'text-primary-700' : 'text-ink-500'}\`}>{hebDateStr}</span>
                    </div>
                    
                    <div className="flex-grow flex flex-col gap-1 md:gap-1.5 mt-0.5 md:mt-1 overflow-y-auto no-scrollbar justify-end md:justify-start">`;
code = code.replace(cellOld, cellNew);

// 5. Improve badges
code = code.replace(
  /className="text-\[8\.5px\] md:text-xs font-bold px-0\.5 md:px-2 py-0\.5 md:py-1\.5 rounded-\[4px\] md:rounded-md bg-amber-50 text-amber-700 border border-amber-100\/50 leading-\[1\.1\] text-center md:text-right whitespace-normal md:truncate line-clamp-2 md:line-clamp-none"/g,
  'className="text-[9px] md:text-[11px] font-bold px-1 md:px-2 py-1 md:py-1.5 rounded bg-amber-50 text-amber-700 border border-amber-100 leading-tight text-center md:text-right line-clamp-2 md:line-clamp-none shadow-sm"'
);
code = code.replace(
  /className="text-\[8\.5px\] md:text-xs font-bold px-0\.5 md:px-2 py-0\.5 md:py-1\.5 rounded-\[4px\] md:rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100\/50 leading-\[1\.1\] text-center md:text-right whitespace-normal md:truncate line-clamp-2 md:line-clamp-none"/g,
  'className="text-[9px] md:text-[11px] font-bold px-1 md:px-2 py-1 md:py-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 leading-tight text-center md:text-right line-clamp-2 md:line-clamp-none shadow-sm"'
);

fs.writeFileSync('app/components/JewishCalendarWidget.tsx', code, 'utf8');
console.log('Applied UX improvements');
