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
  sectionNames?: string[];
  sections?: (string | number)[];
  indexTitle?: string;
  heIndexTitle?: string;
  book?: string;
}


function numberToHebrew(num: number) {
  if (num <= 0) return '';
  const letters: [number, string][] = [
    [400, 'ת'], [300, 'ש'], [200, 'ר'], [100, 'ק'],
    [90, 'צ'], [80, 'פ'], [70, 'ע'], [60, 'ס'], [50, 'נ'], [40, 'מ'], [30, 'ל'], [20, 'כ'],
    [10, 'י'], [9, 'ט'], [8, 'ח'], [7, 'ז'], [6, 'ו'], [5, 'ה'], [4, 'ד'], [3, 'ג'], [2, 'ב'], [1, 'א']
  ];
  let res = '';
  for (const [val, letter] of letters) {
    while (num >= val) {
      if (num === 15) { res += 'טו'; num = 0; break; }
      if (num === 16) { res += 'טז'; num = 0; break; }
      res += letter;
      num -= val;
    }
  }
  return res;
}

interface Bookmark {
  ref: string;
  heRef: string;
  timestamp: number;
  verseIdx?: number;
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
  
  const [showJump, setShowJump] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentToc, setCurrentToc] = useState<any>(null);
  const [bookTocData, setBookTocData] = useState<any>(null);
  const [pendingScrollVerse, setPendingScrollVerse] = useState<number | null>(null);
  const [showTocModal, setShowTocModal] = useState(false);

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem('sefaria_dark_mode', String(newVal));
  };

  
  const [calendar, setCalendar] = useState<any[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sefaria_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {}
    }
    const savedDark = localStorage.getItem('sefaria_dark_mode');
    if (savedDark) {
      setIsDarkMode(savedDark === 'true');
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
    setBookTocData(null);
    setShowSuggestions(false);
    
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      const response = await fetch(`https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?context=0`);
      const result: SefariaResponse = await response.json();
      
      if (result.error) {
        if (result.error.includes("complex' book-level ref")) {
          // Instead of error, fetch TOC and show it
          try {
            const idxRes = await fetch(`https://www.sefaria.org/api/index/${encodeURIComponent(ref)}`);
            const idxData = await idxRes.json();
            if (idxData.schema) {
              setBookTocData({ title: ref, schema: idxData.schema });
              setError('');
              setData(null);
              return;
            }
          } catch(e) {}
          setError("הספר שבחרת מחולק לשערים או חלקים. אנא חפש שוב ובחר חלק ספציפי מתוך הרשימה (למשל: 'חובות הלבבות, שער ראשון').");
        } else {
          setError("שגיאה בטעינת הטקסט: " + result.error);
        }
        setData(null);
      } else {
        setData(result);
        localStorage.setItem('sefaria_last_read', result.ref);
        const baseBook = result.indexTitle || result.book;
        if (baseBook) {
          fetch(`https://www.sefaria.org/api/index/${encodeURIComponent(baseBook)}`)
            .then(r => r.json())
            .then(d => { if (d.schema) setCurrentToc(d.schema); })
            .catch(()=>console.log('No TOC found'));
        }
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

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jumpInput.trim() && data) {
      // For complex texts, append to book title, for simple texts it just works
      const baseTitle = data.indexTitle || data.book || '';
      if (baseTitle) {
        fetchText(`${baseTitle} ${jumpInput.trim()}`);
      }
      setShowJump(false);
      setJumpInput('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) {
      fetchText(query.trim());
    }
  };

  
  useEffect(() => {
    if (data && pendingScrollVerse !== null) {
      setTimeout(() => {
        const el = document.getElementById(`verse-${pendingScrollVerse}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-amber-100/50', 'dark:bg-amber-900/30', 'rounded-xl', 'transition-colors', 'duration-1000');
          setTimeout(() => el.classList.remove('bg-amber-100/50', 'dark:bg-amber-900/30'), 2500);
        }
        setPendingScrollVerse(null);
      }, 300);
    }
  }, [data, pendingScrollVerse]);

  const handleBookmarkClick = (b: Bookmark) => {
    setSidebarOpen(false);
    if (b.verseIdx !== undefined) {
      setPendingScrollVerse(b.verseIdx);
    } else {
      setPendingScrollVerse(null);
    }
    fetchText(b.ref);
  };

  const toggleVerseBookmark = (idx: number) => {
    if (!data) return;
    const isBookmarked = bookmarks.some(b => b.ref === data.ref && b.verseIdx === idx);
    if (isBookmarked) {
      saveBookmarks(bookmarks.filter(b => !(b.ref === data.ref && b.verseIdx === idx)));
    } else {
      const newBookmark: Bookmark = {
        ref: data.ref,
        heRef: data.heRef,
        timestamp: Date.now(),
        verseIdx: idx
      };
      saveBookmarks([newBookmark, ...bookmarks]);
    }
  };

  const addBookmark = () => {
    if (!data) return;
    if (bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined)) return;

    const newBookmark: Bookmark = {
      ref: data.ref,
      heRef: data.heRef,
      timestamp: Date.now()
    };
    saveBookmarks([newBookmark, ...bookmarks]);
  };

  const removeBookmark = (e: React.MouseEvent, ref: string, verseIdx?: number) => {
    e.stopPropagation();
    saveBookmarks(bookmarks.filter(b => !(b.ref === ref && b.verseIdx === verseIdx)));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f5f0] dark:bg-slate-950 font-sans">
      
      {/* APP TOP BAR */}
      <header className={`h-16 md:h-20 border-b shadow-sm flex items-center justify-between px-4 md:px-8 shrink-0 z-50 relative transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-colors group">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <i className="fas fa-arrow-right text-lg"></i>
            </div>
            <span className="font-semibold hidden md:inline">חזרה לאתר</span>
          </Link>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-600 dark:text-slate-400 p-2 text-xl"
          >
            <i className="fas fa-bars"></i>
          </button>
          <button onClick={() => { setData(null); setQuery(""); }} className="font-serif font-bold text-xl md:text-2xl text-slate-800 dark:text-slate-200 whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            בית מדרש
          </button>
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
              className={`w-full border border-transparent focus:border-blue-500 rounded-full py-2.5 px-6 pr-12 outline-none transition-all shadow-inner text-base ${isDarkMode ? 'bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-300' : 'bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-500'}`}
              dir="rtl"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
              <i className="fas fa-search"></i>
            </button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 py-2 custom-scrollbar">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button 
                    type="button"
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full text-right px-5 py-2.5 hover:bg-blue-50 hover:text-blue-700 transition-colors text-slate-700 dark:text-slate-300 font-medium text-base border-b border-slate-50 last:border-0 truncate"
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
          
          <button 
            onClick={toggleDarkMode} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="מצב קריאת לילה"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          <Link 
            href="/"
            className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
          >
            <i className="fas fa-home"></i>
          </Link>


          
          <Link 
            href="/"
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            title="חזרה לעמוד הבית"
          >
            <i className="fas fa-home text-blue-500"></i> ראשי
          </Link>
          
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>

            <i className="fas fa-bookmark text-blue-600"></i> סימניות
          </button>
        </div>
      </header>

      {/* MOBILE SEARCH */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 shrink-0 z-40 relative">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="חפש (למשל: חובות הלבבות)..."
            className={`w-full rounded-full py-2.5 px-4 pr-10 outline-none shadow-inner text-base ${isDarkMode ? 'bg-slate-800 focus:bg-slate-900 text-white placeholder:text-slate-300' : 'bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-500'}`}
            dir="rtl"
          />
          <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
            <i className="fas fa-search"></i>
          </button>
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 mx-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 py-2 custom-scrollbar">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button 
                  type="button"
                  onMouseDown={() => selectSuggestion(s)}
                  className="w-full text-right px-4 py-3 hover:bg-blue-50 transition-colors text-slate-800 dark:text-slate-200 font-medium text-base border-b border-slate-100 dark:border-slate-800/50 last:border-0 truncate"
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
          absolute md:static top-0 right-0 h-full w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl md:shadow-none z-40
          transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0 flex' : 'translate-x-full hidden'}
        `}>
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-200"><i className="fas fa-bookmark text-blue-500 mr-2"></i>הסימניות שלי</h3>
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
                  <li key={b.ref + (b.verseIdx !== undefined ? '-' + b.verseIdx : '')} className="group flex justify-between items-center p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all cursor-pointer" onClick={() => handleBookmarkClick(b)}>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-700 text-sm">{b.heRef || b.ref} {b.verseIdx !== undefined && <span className="text-xs text-slate-400 font-normal mr-1">(פסקה {b.verseIdx + 1})</span>}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeBookmark(e, b.ref, b.verseIdx); }}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/50 text-center">
            <a href="https://www.sefaria.org" target="_blank" rel="noreferrer" className="inline-block opacity-50 hover:opacity-100 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Sefaria_Logo.png" alt="Sefaria" className="h-5 grayscale mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">מופעל באמצעות Sefaria API</span>
            </a>
          </div>
        </aside>

        {/* READER CONTAINER */}
        <main className="flex-1 flex justify-center bg-[#f8f5f0] dark:bg-slate-950 overflow-hidden relative">
          
          {loading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 mb-4"></div>
              <p className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>טוען טקסט...</p>
            </div>
          ) : bookTocData ? (
            <div className="absolute inset-0 flex flex-col p-6 md:p-12 overflow-y-auto custom-scrollbar bg-[#f8f5f0] dark:bg-slate-950">
               <div className="max-w-3xl mx-auto w-full">
                 <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 font-serif mb-2 text-center">{bookTocData.schema.heTitle || bookTocData.title}</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-center mb-8">בחר פרק או שער כדי להתחיל לקרוא</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {bookTocData.schema.nodes ? (
                     bookTocData.schema.nodes.map((node: any, idx: number) => (
                       <button key={idx} onClick={() => fetchText(bookTocData.schema.title + ', ' + node.title)} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-right group">
                         <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700">{node.heTitle || node.title}</span>
                       </button>
                     ))
                   ) : bookTocData.schema.nodeType === 'JaggedArrayNode' ? (
                     Array.from({length: bookTocData.schema.lengths[0]}).map((_, idx) => (
                       <button key={idx} onClick={() => fetchText(bookTocData.schema.title + ' ' + (idx + 1))} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-center group font-bold text-slate-700 dark:text-slate-300 hover:text-blue-700">
                         {bookTocData.schema.heSectionNames?.[0] || 'פרק'} {idx + 1}
                       </button>
                     ))
                   ) : (
                     <p className="text-slate-500 dark:text-slate-400 text-center col-span-2">מבנה הספר מורכב מדי לתצוגה זו.</p>
                   )}
                 </div>
               </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-red-500 p-8 text-center">
              <i className="fas fa-exclamation-triangle text-5xl mb-4 opacity-80"></i>
              <p className="text-xl font-medium">{error}</p>
            </div>
          ) : data ? (
            <div className="w-full max-w-4xl h-full flex flex-col bg-white dark:bg-slate-900 shadow-2xl md:my-0 border-x border-slate-200 dark:border-slate-800">
              
              {/* READER TOOLBAR */}
              <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex justify-between items-center shrink-0">
                <h2 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-200 font-serif truncate pl-4">
                  {data.heRef || data.ref}
                </h2>
                
                <div className="flex items-center gap-1 md:gap-3 shrink-0">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:bg-slate-900 rounded shadow-sm transition-all text-sm font-bold">A-</button>
                    <button onClick={() => setFontSize(Math.min(48, fontSize + 2))} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:bg-slate-900 rounded shadow-sm transition-all text-lg font-bold">A+</button>
                  </div>

                  <button
                    onClick={() => setShowEnglish(!showEnglish)}
                    className="w-10 h-10 md:w-auto md:px-4 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-lg font-semibold hover:bg-slate-50 dark:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
                    title="תרגום"
                  >
                    <span className="hidden md:inline">{showEnglish ? 'עברית בלבד' : 'עברית + English'}</span>
                    <i className="fas fa-language text-lg md:hidden"></i>
                  </button>

                  <button
                    onClick={addBookmark}
                    disabled={bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined)}
                    className={`w-10 h-10 md:w-auto md:px-4 flex items-center justify-center rounded-lg font-bold transition-all
                      ${bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined) ? 'bg-amber-100 text-amber-700' 
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-800/50'}`}
                  >
                    <i className={bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined) ? "fas fa-bookmark" : "far fa-bookmark"}></i>
                    <span className="hidden md:inline mr-2">{bookmarks.some(b => b.ref === data.ref) ? 'נשמר' : 'שמור'}</span>
                  </button>
                </div>
              </div>

              {/* SCROLLABLE TEXT */}
              <div 
                ref={contentRef}
                className={`flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
                dir="rtl"
              >
                {data.he.length === 0 ? (
                  <p className="text-slate-400 italic text-center py-20 text-lg">לא נמצא טקסט זמין עבור ערך זה.</p>
                ) : (
                  <div className="space-y-6 max-w-3xl mx-auto pb-10">
                    {data.he.map((paragraph, idx) => (
                      <div key={idx} id={`verse-${idx}`} className="group relative pr-8 md:pr-12">
                          <button 
                            onClick={() => toggleVerseBookmark(idx)}
                            className={`absolute right-0 md:-right-2 top-2 p-1.5 rounded-lg transition-all ${bookmarks.some(b => b.ref === data.ref && b.verseIdx === idx) ? 'opacity-100 text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                            title="שמור סימניה לפסוק זה"
                          >
                            <i className={`${bookmarks.some(b => b.ref === data.ref && b.verseIdx === idx) ? 'fas' : 'far'} fa-bookmark`}></i>
                          </button>
                        <p 
    style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
    className={`font-serif leading-loose ${isDarkMode ? 'text-slate-50' : 'text-slate-900'}`}
  >
    <span className="font-bold text-slate-400 dark:text-slate-500 ml-2 select-none" style={{ fontSize: `${Math.max(12, fontSize - 6)}px` }}>{numberToHebrew(idx + 1)}.</span>
    <span dangerouslySetInnerHTML={{ __html: paragraph }} />
  </p>
                        {showEnglish && data.text[idx] && (
                          <p 
                            dir="ltr" 
                            style={{ fontSize: `${Math.max(14, fontSize - 6)}px` }}
                            className={`mt-3 font-sans leading-relaxed text-left opacity-90 border-l-4 pl-4 ${isDarkMode ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'}`}
                            dangerouslySetInnerHTML={{ __html: data.text[idx] }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* READER FOOTER PAGER */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 p-3 md:p-4 flex justify-between items-center shrink-0">
                <button
                  onClick={() => data.next && fetchText(data.next)}
                  disabled={!data.next}
                  className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all flex items-center gap-2 text-sm md:text-base shadow-sm"
                >
                  <i className="fas fa-chevron-right text-xs"></i> פרק הבא
                </button>
                <div className="relative flex items-center justify-center">
                  <button 
                    onClick={() => { if(currentToc) { setShowTocModal(true); setShowJump(false); } else { setShowJump(!showJump); } }} 
                    className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors font-serif font-bold text-sm md:text-base px-3 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 border border-transparent hover:border-blue-100"
                    title="פתח תוכן עניינים"
                  >
                    {data.heRef} <i className="fas fa-list text-xs"></i>
                  </button>
                  
                  {showJump && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 w-64 md:w-72 flex flex-col gap-3 animate-fade-in">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">קפיצה מהירה</p>
                        <button onClick={() => setShowJump(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400"><i className="fas fa-times"></i></button>
                      </div>
                      <form onSubmit={handleJumpSubmit} className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                          עבור
                        </button>
                        <input 
                          type="text" 
                          value={jumpInput} 
                          onChange={e=>setJumpInput(e.target.value)} 
                          placeholder={data.sectionNames?.[0] === 'Daf' ? "לדוגמה: 5 או 2b" : "מספר פרק"} 
                          className={`flex-1 rounded-lg px-3 py-2 text-center text-base font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500'}`} 
                          dir="ltr" 
                          autoFocus 
                        />
                      </form>
                      <p className="text-[11px] text-slate-400 text-center mt-1">
                        הכנס מספר פרק או דף כדי לקפוץ אליו ישירות
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => data.prev && fetchText(data.prev)}
                  disabled={!data.prev}
                  className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all flex items-center gap-2 text-sm md:text-base shadow-sm"
                >
                  פרק קודם <i className="fas fa-chevron-left text-xs"></i>
                </button>
              </div>

            </div>
          ) : (
            
            <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-10 mt-4">
                <i className="fas fa-book-open text-5xl mb-4 text-blue-600 opacity-20"></i>
                <h2 className={`text-2xl md:text-3xl font-bold font-serif mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>ברוכים הבאים לבית המדרש</h2>
                <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>חפשו טקסט למעלה או התחילו מיד עם ספרי היסוד והלימוד היומי.</p>
              </div>

              {calendar.length > 0 && (
                <div className="mb-12 max-w-4xl mx-auto w-full">
                  <h3 className={`text-xl font-bold mb-5 flex items-center gap-2 border-b pb-2 ${isDarkMode ? 'text-slate-200 border-slate-800' : 'text-slate-800 border-slate-200'}`}>
                    <i className="fas fa-calendar-day text-blue-600"></i> הלימוד היומי
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {calendar.filter(c => ['Parashat Hashavua', 'Daf Yomi', '929', 'Daily Mishnah'].includes(c.title.en)).map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => fetchText(item.ref)}
                        className={`p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-right group flex flex-col gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                      >
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.title.he}</span>
                        <span className={`text-lg font-bold group-hover:text-blue-700 transition-colors font-serif ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.displayValue.he}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto w-full mb-10">
                <h3 className={`text-xl font-bold mb-5 flex items-center gap-2 border-b pb-2 ${isDarkMode ? 'text-slate-200 border-slate-800' : 'text-slate-800 border-slate-200'}`}>
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
                      className={`p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-right group flex flex-col gap-1 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                    >
                      <span className={`text-lg font-bold group-hover:text-amber-700 transition-colors font-serif ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{book.title}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{book.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          )}

        </main>
      </div>

      {/* TOC MODAL */}
      {showTocModal && currentToc && data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTocModal(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl relative z-10 flex flex-col animate-fade-in">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 font-serif">{currentToc.heTitle || data.heIndexTitle || data.indexTitle}</h3>
              <button onClick={() => setShowTocModal(false)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:shadow-sm transition-all"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {currentToc.nodes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentToc.nodes.map((node: any, idx: number) => (
                    <button key={idx} onClick={() => { fetchText((data.indexTitle || '') + ', ' + node.title); setShowTocModal(false); }} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-right font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700">
                      {node.heTitle || node.title}
                    </button>
                  ))}
                </div>
              ) : currentToc.nodeType === 'JaggedArrayNode' ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 dir-rtl">
                  {Array.from({length: currentToc.lengths[0]}).map((_, idx) => (
                    <button key={idx} onClick={() => { fetchText((data.indexTitle || '') + ' ' + (idx + 1)); setShowTocModal(false); }} className="p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all text-center font-bold text-slate-700 dark:text-slate-300 hover:text-blue-700">
                      {idx + 1}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-10">לא נמצא תוכן עניינים זמין.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
