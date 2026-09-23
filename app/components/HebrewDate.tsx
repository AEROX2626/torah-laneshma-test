"use client";
import { useEffect, useState } from "react";
import JewishCalendarWidget from "./JewishCalendarWidget";

export default function HebrewDate() {
  const [dateStr, setDateStr] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const d = new Date().toISOString().split('T')[0];
    fetch(`https://www.hebcal.com/converter?cfg=json&date=${d}&g2h=1&strict=1`)
      .then(r => r.json())
      .then(data => {
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

      {isModalOpen && <JewishCalendarWidget onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
