"use client";

import React, { useState, useEffect } from 'react';
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
  const [fontSize, setFontSize] = useState(24);

  useEffect(() => {
    // Load bookmarks
    const saved = localStorage.getItem('sefaria_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
    
    // Load last read if available
    const lastRead = localStorage.getItem('sefaria_last_read');
    if (lastRead) {
      fetchText(lastRead);
    } else {
      fetchText('Berakhot 2a');
    }
  }, []);

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('sefaria_bookmarks', JSON.stringify(newBookmarks));
  };

  const fetchText = async (ref: string) => {
    setLoading(true);
    setError('');
    // Auto-scroll to top of reader
    window.scrollTo({ top: 300, behavior: 'smooth' });

    try {
      const response = await fetch(`https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?context=0`);
      const result: SefariaResponse = await response.json();
      
      if (result.error) {
        setError(result.error);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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

  const removeBookmark = (ref: string) => {
    saveBookmarks(bookmarks.filter(b => b.ref !== ref));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Sidebar - Bookmarks */}
      <aside className="w-full lg:w-1/4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 order-2 lg:order-1 sticky top-24">
        <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
          <i className="fas fa-bookmark text-primary-500"></i> הסימניות שלי
        </h3>
        
        {bookmarks.length === 0 ? (
          <div className="text-slate-500 text-sm bg-slate-50 p-4 rounded-xl text-center">
            עדיין לא שמרת סימניות.<br/>לחץ על סמל הסימניה בזמן הקריאה.
          </div>
        ) : (
          <ul className="space-y-2 max-h-[300px] lg:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {bookmarks.map((b) => (
              <li key={b.ref} className="group flex justify-between items-center bg-slate-50 hover:bg-primary-50 p-3 rounded-xl border border-slate-100 transition-all cursor-pointer">
                <button 
                  onClick={() => fetchText(b.ref)}
                  className="text-slate-700 group-hover:text-primary-700 text-right flex-1 font-semibold text-sm transition-colors"
                >
                  {b.heRef || b.ref}
                </button>
                <button 
                  onClick={() => removeBookmark(b.ref)}
                  className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="הסר סימניה"
                >
                  <i className="fas fa-times"></i>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
           <img src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Sefaria_Logo.png" alt="Sefaria" className="h-6 grayscale opacity-60" />
           <p className="text-[11px] text-slate-400 leading-tight">
            מופעל ע״י ה-API הפתוח של Sefaria
          </p>
        </div>
      </aside>

      {/* Main Content - Reader */}
      <div className="w-full lg:w-3/4 flex flex-col order-1 lg:order-2">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש ספר, פרק או דף (למשל: בראשית א, יומא ב)"
            className="w-full p-4 pr-12 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all shadow-sm text-lg font-medium"
            dir="rtl"
          />
          <button 
            type="submit" 
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-sm"
          >
            חפש
          </button>
          <i className="fas fa-search absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
        </form>

        {/* Reader Area */}
        <div className="bg-[#FDFBF7] rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[60vh] flex flex-col relative">
          {loading ? (
            <div className="flex-1 flex justify-center items-center h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-600"></div>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col justify-center items-center text-red-500 p-8 text-center h-[50vh]">
              <i className="fas fa-exclamation-circle text-4xl mb-3"></i>
              <p className="font-medium text-lg">{error}</p>
            </div>
          ) : data ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-serif">
                  {data.heRef || data.ref}
                </h2>
                
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Font Size Controls */}
                  <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1">
                    <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded hover:shadow-sm transition-all" title="הקטן טקסט">
                      <span className="text-sm">A</span>
                    </button>
                    <button onClick={() => setFontSize(Math.min(40, fontSize + 2))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded hover:shadow-sm transition-all" title="הגדל טקסט">
                      <span className="text-lg font-bold">A</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowEnglish(!showEnglish)}
                    className="text-sm px-3 md:px-4 py-2 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-slate-700"
                    title={showEnglish ? 'הסתר תרגום' : 'הצג תרגום'}
                  >
                    {showEnglish ? 'עברית' : 'Aa'}
                  </button>

                  <button
                    onClick={addBookmark}
                    disabled={bookmarks.some(b => b.ref === data.ref)}
                    className={`text-sm px-3 md:px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shadow-sm
                      ${bookmarks.some(b => b.ref === data.ref) 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200 opacity-80 cursor-not-allowed' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
                  >
                    <i className={bookmarks.some(b => b.ref === data.ref) ? "fas fa-bookmark" : "far fa-bookmark"}></i>
                    <span className="hidden md:inline">{bookmarks.some(b => b.ref === data.ref) ? 'נשמר' : 'שמור'}</span>
                  </button>
                </div>
              </div>

              {/* Text Body */}
              <div 
                className="p-6 md:p-10 flex-1 overflow-y-auto font-serif text-slate-900 leading-[1.8] scroll-smooth" 
                dir="rtl"
              >
                {data.he.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-20">לא נמצא טקסט זמין.</p>
                ) : (
                  <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
                    {data.he.map((paragraph, idx) => (
                      <div key={idx} className="group hover:bg-[#F4EFE6] p-3 md:p-4 -mx-3 md:-mx-4 rounded-xl transition-colors border-b border-[#EAE3D5] last:border-0">
                        <p 
                          dangerouslySetInnerHTML={{ __html: paragraph }} 
                          style={{ fontSize: \`\${fontSize}px\` }}
                          className="font-serif font-medium"
                        />
                        {showEnglish && data.text[idx] && (
                          <p 
                            dir="ltr" 
                            style={{ fontSize: \`\${Math.max(14, fontSize - 6)}px\` }}
                            className="mt-4 text-slate-600 font-sans leading-relaxed text-left opacity-90 border-l-4 border-slate-300 pl-4"
                            dangerouslySetInnerHTML={{ __html: data.text[idx] }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="bg-white border-t border-slate-200 p-4 md:p-5 flex justify-between sticky bottom-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => data.next && fetchText(data.next)}
                  disabled={!data.next}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-arrow-right"></i> הבא
                </button>
                <button
                  onClick={() => data.prev && fetchText(data.prev)}
                  disabled={!data.prev}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  הקודם <i className="fas fa-arrow-left"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-slate-400 p-8 text-center h-[50vh]">
               <i className="fas fa-book-open text-6xl mb-4 text-slate-200"></i>
               <p className="text-xl font-medium text-slate-500">הזן טקסט בשורת החיפוש<br/>או בחר סימניה מהרשימה כדי להתחיל ללמוד.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
