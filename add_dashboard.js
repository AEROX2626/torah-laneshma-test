const fs = require('fs');

let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Add Calendar interface and state
code = code.replace(
  'const searchTimeout = useRef<NodeJS.Timeout | null>(null);',
  `const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const [calendar, setCalendar] = useState<any[]>([]);`
);

// 2. Add calendar fetch and remove default Berakhot 2a
code = code.replace(
  `    const lastRead = localStorage.getItem('sefaria_last_read');
    if (lastRead) {
      fetchText(lastRead);
    }
  }, []);`,
  `    const lastRead = localStorage.getItem('sefaria_last_read');
    if (lastRead) {
      fetchText(lastRead);
    }
    
    // Fetch daily calendar
    fetch('https://www.sefaria.org/api/calendars')
      .then(r => r.json())
      .then(d => setCalendar(d.calendar_items || []))
      .catch(e => console.error(e));
  }, []);`
);

// 3. Update empty state
const emptyStateCode = `
            <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-10 mt-4">
                <i className="fas fa-book-open text-5xl mb-4 text-blue-600 opacity-20"></i>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-serif mb-3">ברוכים הבאים לבית המדרש</h2>
                <p className="text-slate-600 text-lg">חפשו טקסט למעלה או התחילו מיד עם ספרי היסוד והלימוד היומי.</p>
              </div>

              {calendar.length > 0 && (
                <div className="mb-12 max-w-4xl mx-auto w-full">
                  <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <i className="fas fa-calendar-day text-blue-600"></i> הלימוד היומי
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {calendar.filter(c => ['Parashat Hashavua', 'Daf Yomi', '929', 'Daily Mishnah'].includes(c.title.en)).map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => fetchText(item.ref)}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-right group flex flex-col gap-2"
                      >
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.title.he}</span>
                        <span className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors font-serif">{item.displayValue.he}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto w-full mb-10">
                <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <i className="fas fa-star text-amber-500"></i> ספרי יסוד פופולריים
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "פרקי אבות", ref: "Pirkei Avot 1", desc: "מוסר ומידות מתקופת המשנה" },
                    { title: "חובות הלבבות", ref: "Duties of the Heart, First Treatise on Direction", desc: "שער הייחוד - יסודות האמונה" },
                    { title: "מסילת ישרים", ref: "Mesilat Yesharim, Introduction", desc: "הקדמת הרמח״ל לעבודת המידות" },
                    { title: "תהלים א׳", ref: "Psalms 1", desc: "אשרי האיש - פתיחת ספר תהלים" },
                    { title: "בראשית א׳", ref: "Genesis 1", desc: "בריאת העולם" },
                    { title: "איגרת הרמב״ן", ref: "Iggeret HaRamban 1", desc: "אגרת המוסר המפורסמת" }
                  ].map((book, idx) => (
                    <button 
                      key={idx}
                      onClick={() => fetchText(book.ref)}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-right group flex flex-col gap-1"
                    >
                      <span className="text-lg font-bold text-slate-800 group-hover:text-amber-700 transition-colors font-serif">{book.title}</span>
                      <span className="text-sm text-slate-500">{book.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
`;

code = code.replace(
  /<div className="flex-1 flex flex-col justify-center items-center opacity-30 pointer-events-none p-4">[\s\S]*?<\/div>/,
  emptyStateCode
);

// Wait, the original code had:
//          ) : (
//            <div className="flex-1 flex flex-col justify-center items-center opacity-30 pointer-events-none p-4">
//              <i className="fas fa-book-open text-8xl mb-6 text-slate-800"></i>
//            </div>
//          )}

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Added Dashboard');
