"use client";
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
    fetch(`https://www.hebcal.com/hebcal?cfg=json&v=1&year=${year}&month=${month}&maj=on&min=on&mod=on&nx=on&d=on&lg=h`)
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
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayItems = items.filter(i => i.date === dStr);
    const hebDate = dayItems.find(i => i.category === 'hebdate');
    const holidays = dayItems.filter(i => i.category !== 'hebdate' && i.category !== 'candles' && i.category !== 'havdalah' && i.category !== 'parashat');
    const parasha = dayItems.find(i => i.category === 'parashat');
    
    return {
      hebDateStr: hebDate ? hebDate.hebrew.split(' ')[0].replace(/[\u0591-\u05C7]/g, '') : '',
      holidays: holidays,
      parasha: parasha ? parasha.hebrew.replace(/[\u0591-\u05C7]/g, '') : ''
    };
  };

  const weekdays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6" dir="rtl">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl md:rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-fade-up border border-ink-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 md:px-8 py-4 md:py-6 border-b border-ink-100 bg-ink-50/50 shrink-0 gap-4 sm:gap-0">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex flex-col">
              <h3 className="font-heading font-black text-xl md:text-3xl text-ink-950 tracking-tight">
                לוח שנה עברי
              </h3>
              <span className="text-ink-500 font-medium text-sm md:text-base mt-0.5">
                {monthNames[month - 1]} {year}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mr-auto sm:mr-6 bg-white p-1 rounded-full shadow-sm border border-ink-200">
              <button onClick={nextMonth} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-primary-50 text-ink-600 hover:text-primary-600 transition-colors" title="החודש הבא">
                <i className="fas fa-chevron-right text-sm md:text-base"></i>
              </button>
              <div className="w-px h-5 bg-ink-200"></div>
              <button onClick={prevMonth} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-primary-50 text-ink-600 hover:text-primary-600 transition-colors" title="החודש הקודם">
                <i className="fas fa-chevron-left text-sm md:text-base"></i>
              </button>
            </div>
          </div>
          
          <button onClick={onClose} className="absolute sm:relative top-4 left-4 sm:top-0 sm:left-0 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-ink-200 text-ink-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors shadow-sm z-10">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        
        {/* Calendar Body */}
        <div className="flex-grow overflow-y-auto p-3 md:p-8 bg-ink-50/30 no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-ink-500 gap-4">
              <i className="fas fa-circle-notch fa-spin text-4xl text-primary-500"></i>
              <span className="font-medium text-lg">מכין את לוח השנה...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 md:gap-4">
              {weekdays.map((wd, i) => (
                <div key={wd} className={`text-center font-bold text-xs md:text-sm py-2 ${i === 6 ? 'text-primary-600' : 'text-ink-500'}`}>
                  {wd}
                </div>
              ))}
              
              {Array.from({ length: startWeekday }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[60px] md:min-h-[110px] rounded-xl md:rounded-2xl bg-white/40 border border-ink-100/40"></div>
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { hebDateStr, holidays, parasha } = getDayItems(day);
                const isToday = new Date().getDate() === day && new Date().getMonth() + 1 === month && new Date().getFullYear() === year;
                const isShabbat = (startWeekday + i) % 7 === 6;
                
                return (
                  <div key={day} className={`min-h-[70px] md:min-h-[110px] rounded-xl md:rounded-2xl border p-1.5 md:p-3 flex flex-col transition-all group ${
                    isToday 
                      ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-200/50 shadow-sm' 
                      : 'bg-white border-ink-200 hover:border-primary-200 hover:shadow-md'
                  }`}>
                    
                    <div className="flex justify-between items-start mb-1 md:mb-2">
                      <span className={`font-black text-sm md:text-xl leading-none ${isToday ? 'text-primary-700' : (isShabbat ? 'text-primary-600' : 'text-ink-800')}`}>{day}</span>
                      <span className={`text-[10px] md:text-sm font-semibold leading-none ${isToday ? 'text-primary-600' : 'text-ink-400'}`}>{hebDateStr}</span>
                    </div>
                    
                    <div className="flex-grow flex flex-col gap-1 mt-1 overflow-hidden">
                      {holidays.map((h, idx) => {
                        const cleanTitle = h.hebrew.replace(/[\u0591-\u05C7]/g, '').replace(/\s\d{4}$/, '');
                        return (
                          <div key={idx} className="text-[9px] md:text-xs font-bold px-1.5 py-1 md:px-2 md:py-1.5 rounded-lg md:rounded-md bg-amber-50 text-amber-700 border border-amber-100/50 leading-tight text-center md:text-right truncate" title={cleanTitle}>
                            {cleanTitle}
                          </div>
                        );
                      })}
                      {parasha && (
                        <div className="text-[9px] md:text-xs font-bold px-1.5 py-1 md:px-2 md:py-1.5 rounded-lg md:rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/50 leading-tight text-center md:text-right truncate" title={parasha}>
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
