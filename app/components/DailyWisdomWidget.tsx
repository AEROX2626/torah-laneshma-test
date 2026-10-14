"use client";

import { useState, useEffect } from "react";
import dailyWisdom from "../data/daily-wisdom.json";

export default function DailyWisdomWidget() {
  const [wisdom, setWisdom] = useState(dailyWisdom[0]);

  useEffect(() => {
    const today = new Date().toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" });
    if (!wisdom || wisdom.date !== today) {
      fetch("/api/daily")
        .then((res) => res.json())
        .then((json) => {
          if (json?.dailyWisdom) {
            setWisdom(json.dailyWisdom);
          }
        })
        .catch(() => {});
    }
  }, [wisdom]);

  if (!wisdom) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-emerald-100 relative overflow-hidden h-full flex flex-col">
      <div className="absolute -top-12 -left-12 text-emerald-50 opacity-50 transform rotate-12 pointer-events-none">
        <i className="fas fa-leaf text-9xl"></i>
      </div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/30">
            <i className="fas fa-quote-right"></i>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">חיזוק יומי</span>
            <div className="text-sm font-semibold text-ink-500 mt-1">{wisdom.source}</div>
          </div>
        </div>
        
        <h3 className="font-heading font-black text-xl text-ink-900 mb-3 leading-snug">"{wisdom.quote}"</h3>
        <p className="text-ink-600 font-medium leading-relaxed flex-grow">{wisdom.explanation}</p>
      </div>
    </div>
  );
}
