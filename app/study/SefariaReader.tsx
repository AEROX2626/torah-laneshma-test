"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SefariaResponse {
  ref: string;
  heRef: string;
  he: string[];
  text: string[];
  error?: string;
  next?: string;
  prev?: string;
}

interface Bookmark {
  ref: string;
  heRef: string;
  timestamp: number;
}

export default function SefariaReader() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<SefariaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showEnglish, setShowEnglish] = useState(false);
  const [fontSize, setFontSize] = useState(26);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Autocomplete states
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const [calendar, setCalendar] = useState<any[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sefaria_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {}
    }
    const lastRead = localStorage.getItem('sefaria_last_read');
    if (lastRead) {
      fetchText(lastRead);
    }
    
    // Fetch daily calendar
    fetch('https://www.sefaria.org/api/calendars')
      .then(r => r.json())
      .then(d => setCalendar(d.calendar_items || []))
      .catch(e => console.error(e));
  }, []);

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('sefaria_bookmarks', JSON.stringify(newBookmarks));
  };

  const fetchText = async (ref: string) => {
    setLoading(true);
    setError('');
    setSidebarOpen(false); // Close sidebar on mobile after selecting
    setShowSuggestions(false);
    
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      const response = await fetch(`https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?context=0`);
      const result: SefariaResponse = await response.json();
      
      if (result.error) {
        if (result.error.includes("complex' book-level ref")) {
          setError("הספר שבחרת מחולק לשערים או חלקים. אנא חפש שוב ובחר חלק ספציפי מתוך הרשימה (למשל: 'חובות הלבבות, שער ראשון').");
        } else {
          setError("שגיאה בטעינת הטקסט: " + result.error);
        }
        setData(null);
      } else {
        setData(result);
        localStorage.setItem('sefaria_last_read', result.ref);
      }
    } catch (err) {
      setError("שגיאה בטעינת הטקסט. אנא נסה שוב.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length >= 2) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://www.sefaria.org/api/name/${encodeURIComponent(val)}`);
          const data = await res.json();
          setSuggestions(data.completions || []);
          setShowSuggestions(true);
        } catch (e) {
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    fetchText(suggestion);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) {
      fetchText(query.trim());
    }
  };

  const addBookmark = () => {
    if (!data) return;
    if (bookmarks.some(b => b.ref === data.ref)) return;

    const newBookmark: Bookmark = {
      ref: data.ref,
      heRef: data.heRef,
      timestamp: Date.now()
    };
    saveBookmarks([newBookmark, ...bookmarks]);
  };

  const removeBookmark = (e: React.MouseEvent, ref: string) => {
    e.stopPropagation();
    saveBookmarks(bookmarks.filter(b => b.ref !== ref));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f5f0] font-sans">
      
      {/* APP TOP BAR */}
      <header className="h-16 md:h-20 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 md:px-8 shrink-0 z-50 relative">
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <i className="fas fa-arrow-right text-lg"></i>
            </div>
            <span className="font-semibold hidden md:inline">חזרה לאתר</span>
          </Link>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-600 p-2 text-xl"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="font-serif font-bold text-xl md:text-2xl text-slate-800 whitespace-nowrap">
            בית מדרש
          </h1>
        </div>

        <div className="flex-1 max-w-xl mx-4 md:mx-8 hidden md:block relative">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="חפש ספר, פרק או דף (למשל: חובות הלבבות, יומא ב)"
              className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 rounded-full py-2.5 px-6 pr-12 outline-none transition-all shadow-inner text-[15px]"
              dir="rtl"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
              <i className="fas fa-search"></i>
            </button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 py-2 custom-scrollbar">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button 
                    type="button"
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full text-right px-5 py-2.5 hover:bg-blue-50 hover:text-blue-700 transition-colors text-slate-700 font-medium text-[15px] border-b border-slate-50 last:border-0 truncate"
                    dir="rtl"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full font-medium text-slate-700 transition-colors">
            <i className="fas fa-bookmark text-blue-600"></i> סימניות
          </button>
        </div>
      </header>

      {/* MOBILE SEARCH */}
      <div className="md:hidden bg-white border-b border-slate-200 p-3 shrink-0 z-40 relative">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="חפש (למשל: חובות הלבבות)..."
            className="w-full bg-slate-100 rounded-full py-2.5 px-4 pr-10 outline-none shadow-inner text-[15px]"
            dir="rtl"
          />
          <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
            <i className="fas fa-search"></i>
          </button>
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 mx-3 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 py-2 custom-scrollbar">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button 
                  type="button"
                  onMouseDown={() => selectSuggestion(s)}
                  className="w-full text-right px-4 py-3 hover:bg-blue-50 transition-colors text-slate-800 font-medium text-[15px] border-b border-slate-100 last:border-0 truncate"
                  dir="rtl"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative z-0">
        
        {/* SIDEBAR OVERLAY (Mobile) */}
        {sidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside className={`
          absolute md:static top-0 right-0 h-full w-72 bg-white border-l border-slate-200 shadow-2xl md:shadow-none z-40
          transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 hidden md:flex'}
        `}>
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800"><i className="fas fa-bookmark text-blue-500 mr-2"></i>הסימניות שלי</h3>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 text-lg p-2"><i className="fas fa-times"></i></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {bookmarks.length === 0 ? (
              <div className="text-center p-6 text-slate-400 text-sm">
                <i className="far fa-bookmark text-3xl mb-3 opacity-50"></i>
                <p>אין סימניות עדיין.<br/>ניתן לשמור דפים תוך כדי קריאה.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {bookmarks.map((b) => (
                  <li key={b.ref} className="group flex justify-between items-center p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all cursor-pointer" onClick={() => fetchText(b.ref)}>
                    <span className="font-semibold text-slate-700 group-hover:text-blue-700 text-sm">{b.heRef || b.ref}</span>
                    <button 
                      onClick={(e) => removeBookmark(e, b.ref)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <a href="https://www.sefaria.org" target="_blank" rel="noreferrer" className="inline-block opacity-50 hover:opacity-100 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Sefaria_Logo.png" alt="Sefaria" className="h-5 grayscale mx-auto mb-1" />
              <span className="text-[10px] text-slate-500">מופעל באמצעות Sefaria API</span>
            </a>
          </div>
        </aside>

        {/* READER CONTAINER */}
        <main className="flex-1 flex justify-center bg-[#f8f5f0] overflow-hidden relative">
          
          {loading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
              <p className="text-slate-500 font-medium">טוען טקסט...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-red-500 p-8 text-center">
              <i className="fas fa-exclamation-triangle text-5xl mb-4 opacity-80"></i>
              <p className="text-xl font-medium">{error}</p>
            </div>
          ) : data ? (
            <div className="w-full max-w-4xl h-full flex flex-col bg-white shadow-2xl md:my-0 border-x border-slate-200">
              
              {/* READER TOOLBAR */}
              <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex justify-between items-center shrink-0">
                <h2 className="text-lg md:text-2xl font-bold text-slate-800 font-serif truncate pl-4">
                  {data.heRef || data.ref}
                </h2>
                
                <div className="flex items-center gap-1 md:gap-3 shrink-0">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded shadow-sm transition-all text-sm font-bold">A-</button>
                    <button onClick={() => setFontSize(Math.min(48, fontSize + 2))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded shadow-sm transition-all text-lg font-bold">A+</button>
                  </div>

                  <button
                    onClick={() => setShowEnglish(!showEnglish)}
                    className="w-10 h-10 md:w-auto md:px-4 flex items-center justify-center border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-slate-700 bg-white"
                    title="תרגום"
                  >
                    <span className="hidden md:inline">{showEnglish ? 'עברית בלבד' : 'עברית + English'}</span>
                    <i className="fas fa-language text-lg md:hidden"></i>
                  </button>

                  <button
                    onClick={addBookmark}
                    disabled={bookmarks.some(b => b.ref === data.ref)}
                    className={`w-10 h-10 md:w-auto md:px-4 flex items-center justify-center rounded-lg font-bold transition-all
                      ${bookmarks.some(b => b.ref === data.ref) 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    <i className={bookmarks.some(b => b.ref === data.ref) ? "fas fa-bookmark" : "far fa-bookmark"}></i>
                    <span className="hidden md:inline mr-2">{bookmarks.some(b => b.ref === data.ref) ? 'נשמר' : 'שמור'}</span>
                  </button>
                </div>
              </div>

              {/* SCROLLABLE TEXT */}
              <div 
                ref={contentRef}
                className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth bg-white"
                dir="rtl"
              >
                {data.he.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-20 text-lg">לא נמצא טקסט זמין עבור ערך זה.</p>
                ) : (
                  <div className="space-y-6 max-w-3xl mx-auto pb-10">
                    {data.he.map((paragraph, idx) => (
                      <div key={idx} className="group">
                        <p 
                          dangerouslySetInnerHTML={{ __html: paragraph }} 
                          style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
                          className="font-serif text-slate-900 leading-loose"
                        />
                        {showEnglish && data.text[idx] && (
                          <p 
                            dir="ltr" 
                            style={{ fontSize: `${Math.max(14, fontSize - 6)}px` }}
                            className="mt-3 text-slate-500 font-sans leading-relaxed text-left opacity-90 border-l-4 border-slate-200 pl-4"
                            dangerouslySetInnerHTML={{ __html: data.text[idx] }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* READER FOOTER PAGER */}
              <div className="bg-slate-50 border-t border-slate-200 p-3 md:p-4 flex justify-between items-center shrink-0">
                <button
                  onClick={() => data.next && fetchText(data.next)}
                  disabled={!data.next}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all flex items-center gap-2 text-sm md:text-base shadow-sm"
                >
                  <i className="fas fa-chevron-right text-xs"></i> פרק הבא
                </button>
                <span className="text-slate-400 font-serif text-sm hidden md:block">
                  {data.heRef}
                </span>
                <button
                  onClick={() => data.prev && fetchText(data.prev)}
                  disabled={!data.prev}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all flex items-center gap-2 text-sm md:text-base shadow-sm"
                >
                  פרק קודם <i className="fas fa-chevron-left text-xs"></i>
                </button>
              </div>

            </div>
          ) : (
            
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

          )}

        </main>
      </div>
    </div>
  );
}
