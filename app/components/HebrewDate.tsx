"use client";

import { useEffect, useState } from "react";

export default function HebrewDate() {
  const [dateStr, setDateStr] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const d = new Date().toISOString().split('T')[0];
    fetch(`https://www.hebcal.com/converter?cfg=json&date=${d}&g2h=1&strict=1`)
      .then(r => r.json())
      .then(data => {
         // Remove nikud for cleaner look
         const cleanText = data.hebrew.replace(/[\u0591-\u05C7]/g, '');
         setDateStr(cleanText);
      })
      .catch(() => {});
  }, []);
  
  if (!dateStr) return null;

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-bold text-sm shadow-soft hover:bg-primary-50 transition-colors group"
        title="צפו בלוח השנה המלא"
      >
        <i className="fas fa-calendar-alt text-primary-500 group-hover:scale-110 transition-transform"></i>
        <span>{dateStr}</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 bg-ink-50/50">
              <h3 className="font-heading font-black text-xl text-ink-900">לוח שנה יהודי עולמי</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-ink-200 text-ink-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flex-grow bg-white relative">
              <iframe 
                src="https://www.hebcal.com/hebcal?v=1&year=now&month=x&yt=H&lg=h" 
                className="w-full h-full border-none"
                title="Hebrew Calendar"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
