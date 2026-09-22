"use client";

import { useEffect, useState } from "react";

export default function ShabbatTimes() {
  const [times, setTimes] = useState<{ inTime: string; outTime: string; eventName: string; city: string } | null>(null);

  useEffect(() => {
    // 281184 is Jerusalem. lg=he for Hebrew text. m=50 for Havdalah 50 mins after sundown.
    fetch("https://www.hebcal.com/shabbat?cfg=json&geonameid=281184&m=50&lg=he")
      .then((res) => res.json())
      .then((data) => {
        const items = data.items;
        const candles = items.find((i: any) => i.category === "candles");
        const havdalah = items.find((i: any) => i.category === "havdalah" && (!candles || new Date(i.date) > new Date(candles.date)));
        
        let eventName = candles?.memo || "שבת קודש";
        
        // Remove Nikud (optional, but usually looks cleaner in modern UI)
        eventName = eventName.replace(/[\u0591-\u05C7]/g, "");

        if (candles && havdalah) {
          setTimes({
            eventName: eventName,
            inTime: new Date(candles.date).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
            outTime: new Date(havdalah.date).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
            city: "ירושלים",
          });
        }
      })
      .catch((err) => console.error("Failed to load Shabbat times", err));
  }, []);

  if (!times) return null;

  return (
    <div className="hidden lg:flex items-center gap-4 bg-white/95 backdrop-blur-sm shadow-soft border border-ink-100 rounded-full px-5 py-2.5 animate-fade-up">
      <div className="flex items-center gap-2 text-ink-700">
        <i className="fas fa-candles text-primary-500 text-lg"></i>
        <span className="font-bold text-sm">{times.eventName}</span>
      </div>
      <div className="w-px h-4 bg-ink-200"></div>
      <div className="flex flex-col text-[11px] font-medium text-ink-500 leading-tight">
        <span>כניסה: {times.inTime}</span>
        <span>יציאה: {times.outTime}</span>
      </div>
      <div className="w-px h-4 bg-ink-200"></div>
      <div className="flex items-center gap-1 text-ink-500 text-xs font-semibold">
        <i className="fas fa-map-marker-alt"></i>
        <span>{times.city}</span>
      </div>
    </div>
  );
}
