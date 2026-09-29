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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
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
  };

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

  const weekdays = [
    { full: 'ראשון', short: "א'" },
    { full: 'שני', short: "ב'" },
    { full: 'שלישי', short: "ג'" },
    { full: 'רביעי', short: "ד'" },
    { full: 'חמישי', short: "ה'" },
    { full: 'שישי', short: "ו'" },
    { full: 'שבת', short: 'שבת' }
  ];
  const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6" dir="rtl">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl md:rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-fade-up border border-ink-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 md:px-8 py-5 border-b border-ink-100 bg-ink-50/50 shrink-0 relative">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto mt-6 sm:mt-0">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 tracking-tight">
                לוח שנה עברי
              </h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                <span className="text-ink-600 font-bold text-base">
                  {monthNames[month - 1]} {year}
                </span>
                <span className="text-ink-300 hidden sm:inline">•</span>
                <span className="text-primary-700 font-bold text-sm bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-100/50">
                  {(() => {
                    if (items.length === 0) return '';
                    const hebDates = items.filter(i => i.category === 'hebdate');
                    if (hebDates.length === 0) return '';
                    const getMonthYear = (str: string) => {
                      const parts = str.split(' ').slice(1);
                      return parts.join(' ').replace(/[\u0591-\u05C7]/g, '');
                    };
                    const firstMonth = getMonthYear(hebDates[0].hebrew);
                    const lastMonth = getMonthYear(hebDates[hebDates.length - 1].hebrew);
                    if (firstMonth === lastMonth) return firstMonth;
                    return firstMonth + " / " + lastMonth;
                  })()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-full shadow-sm border border-ink-200 w-full sm:w-auto justify-center">
              <button onClick={nextMonth} className="w-12 h-10 sm:w-10 flex items-center justify-center rounded-full hover:bg-primary-50 text-ink-600 hover:text-primary-600 transition-colors" title="חודש הבא">
                <i className="fas fa-chevron-right text-base"></i>
              </button>
              <div className="w-px h-6 bg-ink-200"></div>
              <button onClick={prevMonth} className="w-12 h-10 sm:w-10 flex items-center justify-center rounded-full hover:bg-primary-50 text-ink-600 hover:text-primary-600 transition-colors" title="חודש קודם">
                <i className="fas fa-chevron-left text-base"></i>
              </button>
            </div>
          </div>
          
          <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-ink-200 text-ink-500 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 transition-colors shadow-sm z-10">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        
        {/* Calendar Body */}
        <div className="flex-grow overflow-y-auto p-3 md:p-8 bg-ink-50/40 no-scrollbar" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-ink-500 gap-4">
              <i className="fas fa-circle-notch fa-spin text-4xl text-primary-500"></i>
              <span className="font-medium text-lg">מכין את לוח השנה...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1 md:gap-4">
              {weekdays.map((wd, i) => (
                <div key={wd.full} className={`text-center font-bold text-[11px] md:text-sm py-1.5 md:py-2 ${i === 6 ? 'text-primary-600' : 'text-ink-500'}`}>
                  <span className="hidden md:inline">{wd.full}</span>
                  <span className="md:hidden">{wd.short}</span>
                </div>
              ))}
              
              {Array.from({ length: startWeekday }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[70px] md:min-h-[110px] rounded-lg md:rounded-2xl bg-white/40 border border-ink-100/40"></div>
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { hebDateStr, holidays, parasha } = getDayItems(day);
                const isToday = new Date().getDate() === day && new Date().getMonth() + 1 === month && new Date().getFullYear() === year;
                const isShabbat = (startWeekday + i) % 7 === 6;
                
                return (
                  <div key={day} className={`min-h-[80px] md:min-h-[120px] rounded-xl md:rounded-2xl border p-1.5 md:p-3 flex flex-col transition-all group ${
                    isToday 
                      ? 'bg-white border-primary-300 ring-1 ring-primary-200 shadow-sm relative' 
                      : 'bg-white border-ink-100 hover:border-primary-200 hover:shadow-md'
                  }`}>
                    {isToday && <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 rounded-t-xl md:rounded-t-2xl"></div>}
                    
                    <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start mb-2 gap-1 md:gap-0">
                      <div className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full ${isToday ? 'bg-primary-600 text-white font-bold' : (isShabbat ? 'text-primary-600 font-bold' : 'text-ink-800 font-bold')} text-[14px] md:text-lg`}>
                        {day}
                      </div>
                      <span className={`text-[10px] md:text-sm font-semibold leading-none ${isToday ? 'text-primary-700' : 'text-ink-500'}`}>{hebDateStr}</span>
                    </div>
                    
                    <div className="flex-grow flex flex-col gap-1 md:gap-1.5 mt-0.5 md:mt-1 overflow-y-auto no-scrollbar justify-end md:justify-start">
                      {holidays.map((h, idx) => {
                        const cleanTitle = h.hebrew.replace(/[\u0591-\u05C7]/g, '').replace(/\s\d{4}$/, '');
                        return (
                          <div key={idx} className="text-[9px] md:text-[11px] font-bold px-1 md:px-2 py-1 md:py-1.5 rounded bg-amber-50 text-amber-700 border border-amber-100 leading-tight text-center md:text-right line-clamp-2 md:line-clamp-none shadow-sm" title={cleanTitle}>
                            {cleanTitle}
                          </div>
                        );
                      })}
                      {parasha && (
                        <div className="text-[9px] md:text-[11px] font-bold px-1 md:px-2 py-1 md:py-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 leading-tight text-center md:text-right line-clamp-2 md:line-clamp-none shadow-sm" title={parasha}>
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
