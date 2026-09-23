const fs = require("fs");
const code = `"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type HebcalItem = {
  date: string;
  category: string;
  title: string;
  hebrew: string;
  memo?: string;
};

export default function JewishCalendarWidget({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<HebcalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    setLoading(true);
    fetch(\`https://www.hebcal.com/hebcal?cfg=json&v=1&year=\${year}&month=\${month}&maj=on&min=on&mod=on&nx=on&d=on&lg=h\`)
      .then(r => r.json())
      .then(d => {
        setItems(d.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, month]);

  const firstDayOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstDayOfMonth.getDay(); // 0 is Sunday

  const prevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month, 1));

  const getDayItems = (day: number) => {
    const dStr = \`\${year}-\${String(month).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`;
    const dayItems = items.filter(i => i.date === dStr);
    const hebDate = dayItems.find(i => i.category === 'hebdate');
    const holidays = dayItems.filter(i => i.category !== 'hebdate' && i.category !== 'candles' && i.category !== 'havdalah' && i.category !== 'parashat');
    const parasha = dayItems.find(i => i.category === 'parashat');
    
    return {
      hebDateStr: hebDate ? hebDate.hebrew.split(' ')[0].replace(/[\\u0591-\\u05C7]/g, '') : '',
      holidays: holidays,
      parasha: parasha ? parasha.hebrew.replace(/[\\u0591-\\u05C7]/g, '') : ''
    };
  };

  const weekdays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6" dir="rtl">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl md:rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-fade-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-ink-100 bg-ink-50/50 shrink-0 gap-3 sm:gap-0">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <h3 className="font-heading font-black text-lg md:text-2xl text-ink-900">
              לוח שנה עברי - {monthNames[month - 1]} {year}
            </h3>
            <div className="flex items-center gap-1.5 md:gap-2">
              <button onClick={prevMonth} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white border border-ink-200 hover:bg-primary-50 hover:text-primary-600 transition-colors shadow-sm">
                <i className="fas fa-chevron-right text-xs md:text-sm"></i>
              </button>
              <button onClick={nextMonth} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white border border-ink-200 hover:bg-primary-50 hover:text-primary-600 transition-colors shadow-sm">
                <i className="fas fa-chevron-left text-xs md:text-sm"></i>
              </button>
            </div>
          </div>
          <button onClick={onClose} className="absolute sm:relative top-3 left-3 sm:top-0 sm:left-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white border border-ink-200 text-ink-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors shadow-sm">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Calendar Body */}
        <div className="flex-grow overflow-y-auto p-2 md:p-6 bg-ink-50/30 no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-ink-500 gap-3">
              <i className="fas fa-circle-notch fa-spin text-3xl text-primary-500"></i>
              <span className="font-medium">טוען לוח שנה...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 md:gap-3">
              {weekdays.map(wd => (
                <div key={wd} className="text-center font-bold text-[10px] md:text-base text-ink-700 py-1 md:py-2">
                  {wd}
                </div>
              ))}
              
              {Array.from({ length: startWeekday }).map((_, i) => (
                <div key={\`empty-\${i}\`} className="min-h-[60px] md:min-h-[100px] rounded-lg md:rounded-xl bg-white/50 border border-ink-100/50"></div>
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { hebDateStr, holidays, parasha } = getDayItems(day);
                const isToday = new Date().getDate() === day && new Date().getMonth() + 1 === month && new Date().getFullYear() === year;
                
                return (
                  <div key={day} className={\`min-h-[70px] md:min-h-[110px] rounded-lg md:rounded-xl border p-1 md:p-2.5 flex flex-col transition-all \${isToday ? 'bg-primary-50 border-primary-300 ring-1 md:ring-2 ring-primary-200 shadow-sm' : 'bg-white border-ink-200 hover:shadow-md'}\`}>
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-0.5 md:mb-1">
                      <span className={\`font-bold text-sm md:text-xl leading-none \${isToday ? 'text-primary-700' : 'text-ink-900'}\`}>{day}</span>
                      <span className="text-[9px] md:text-sm font-medium text-ink-500 mt-0.5 md:mt-0 leading-none">{hebDateStr}</span>
                    </div>
                    <div className="flex-grow flex flex-col gap-0.5 md:gap-1 mt-1 overflow-hidden">
                      {holidays.map((h, idx) => {
                        const cleanTitle = h.hebrew.replace(/[\\u0591-\\u05C7]/g, '').replace(/\\s\\d{4}$/, '');
                        return (
                          <div key={idx} className="text-[8px] md:text-xs font-bold px-1 py-0.5 md:px-1.5 md:py-1 rounded bg-amber-100 text-amber-800 leading-none md:leading-tight text-center md:text-right truncate" title={cleanTitle}>
                            {cleanTitle}
                          </div>
                        );
                      })}
                      {parasha && (
                        <div className="text-[8px] md:text-xs font-semibold px-1 py-0.5 md:px-1.5 md:py-1 rounded bg-emerald-50 text-emerald-700 leading-none md:leading-tight text-center md:text-right truncate" title={parasha}>
                          {parasha}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
`;
fs.writeFileSync("app/components/JewishCalendarWidget.tsx", code, "utf8");
