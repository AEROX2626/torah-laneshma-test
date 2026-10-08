const fs = require('fs');
let code = fs.readFileSync('app/components/JewishCalendarWidget.tsx', 'utf8');

const start = code.indexOf('{/* Header */}');
const end = code.indexOf('{/* Calendar Body */}');

if (start !== -1 && end !== -1) {
  const newHeader = `{/* Header */}
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
                    const getMonthYear = (str) => {
                      const parts = str.split(' ').slice(1);
                      return parts.join(' ').replace(/[\\u0591-\\u05C7]/g, '');
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
        
        `;
  code = code.substring(0, start) + newHeader + code.substring(end);
  fs.writeFileSync('app/components/JewishCalendarWidget.tsx', code, 'utf8');
  console.log('Successfully replaced header block!');
} else {
  console.log('Could not find header or body boundaries');
}
