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

  useEffect(() => {
    // Load bookmarks from local storage on mount
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
      // Default to today's Daf Yomi or a default text
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
    
    // Check if already bookmarked
    if (bookmarks.some(b => b.ref === data.ref)) {
      return;
    }

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
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar - Bookmarks */}
      <div className="md:w-1/4 bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-xl mb-4 text-slate-800 flex items-center gap-2">
          <span>🔖</span> סימניות
        </h3>
        
        {bookmarks.length === 0 ? (
          <p className="text-slate-500 text-sm">עדיין לא שמרת סימניות. לחץ על כפתור השמירה בזמן הקריאה.</p>
        ) : (
          <ul className="space-y-3">
            {bookmarks.map((b) => (
              <li key={b.ref} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200 shadow-sm">
                <button 
                  onClick={() => fetchText(b.ref)}
                  className="text-blue-600 hover:text-blue-800 text-right flex-1 font-medium text-sm transition-colors"
                >
                  {b.heRef || b.ref}
                </button>
                <button 
                  onClick={() => removeBookmark(b.ref)}
                  className="text-red-400 hover:text-red-600 px-2"
                  title="הסר סימניה"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 leading-relaxed">
            מופעל באמצעות ה-API הפתוח של <a href="https://www.sefaria.org" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Sefaria</a>. <br/>
            ניתן לחפש ספרים לפי שמם (למשל: ״בראשית א״, ״ברכות ב״).
          </p>
        </div>
      </div>

      {/* Main Content - Reader */}
      <div className="md:w-3/4 flex flex-col">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש ספר, פרק או דף (למשל: בראשית א, יומא ב)"
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
            dir="rtl"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            חפש
          </button>
        </form>

        {/* Reader Area */}
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex-1 flex justify-center items-center text-red-500 p-8 text-center">
              {error}
            </div>
          ) : data ? (
            <>
              {/* Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-10">
                <h2 className="text-2xl font-bold text-slate-800">
                  {data.heRef || data.ref}
                </h2>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEnglish(!showEnglish)}
                    className="text-sm px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                  >
                    {showEnglish ? 'הסתר אנגלית' : 'הצג אנגלית'}
                  </button>
                  <button
                    onClick={addBookmark}
                    disabled={bookmarks.some(b => b.ref === data.ref)}
                    className="text-sm px-4 py-1.5 bg-amber-100 text-amber-800 border border-amber-300 rounded hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    🔖 {bookmarks.some(b => b.ref === data.ref) ? 'נשמר' : 'שמור סימניה'}
                  </button>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto font-serif text-lg leading-loose text-slate-800" dir="rtl">
                {data.he.length === 0 ? (
                  <p className="text-slate-500 italic text-center">טקסט לא נמצא.</p>
                ) : (
                  <div className="space-y-6">
                    {data.he.map((paragraph, idx) => (
                      <div key={idx} className="group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors border-b border-slate-100 pb-4 last:border-0">
                        <p dangerouslySetInnerHTML={{ __html: paragraph }} className="text-xl md:text-2xl" />
                        {showEnglish && data.text[idx] && (
                          <p 
                            dir="ltr" 
                            className="mt-3 text-base text-slate-600 font-sans leading-relaxed text-left"
                            dangerouslySetInnerHTML={{ __html: data.text[idx] }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between">
                <button
                  onClick={() => data.next && fetchText(data.next)}
                  disabled={!data.next}
                  className="px-4 py-2 text-blue-600 disabled:text-slate-400 font-medium hover:bg-blue-50 rounded transition-colors"
                >
                  הבא ←
                </button>
                <button
                  onClick={() => data.prev && fetchText(data.prev)}
                  disabled={!data.prev}
                  className="px-4 py-2 text-blue-600 disabled:text-slate-400 font-medium hover:bg-blue-50 rounded transition-colors"
                >
                  → הקודם
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex justify-center items-center text-slate-400 p-8 text-center">
              הזן טקסט בשורת החיפוש או בחר סימניה מהרשימה.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
