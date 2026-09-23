"use client";

import { useEffect, useState, useRef } from "react";

const CITIES = [
  { id: "281184", name: "ירושלים" },
  { id: "293397", name: "תל אביב" },
  { id: "294801", name: "חיפה" },
  { id: "295530", name: "באר שבע" },
  { id: "295277", name: "אילת" },
  { id: "293812", name: "פתח תקווה" }
];

export default function ShabbatTimes() {
  const [times, setTimes] = useState<{ inTime: string; outTime: string; eventName: string; city: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchShabbatTimes = (query: string, cityName: string) => {
    fetch(`https://www.hebcal.com/shabbat?cfg=json&${query}&lg=he`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.items;
        const candles = items.find((i: any) => i.category === "candles");
        const havdalah = items.find((i: any) => i.category === "havdalah" && (!candles || new Date(i.date) > new Date(candles.date)));
        
        let eventName = candles?.memo || "שבת קודש";
        eventName = eventName.replace(/[\u0591-\u05C7]/g, "");

        if (candles && havdalah) {
          setTimes({
            eventName,
            inTime: candles.title.match(/\d{1,2}:\d{2}/)?.[0] || "",
            outTime: havdalah.title.match(/\d{1,2}:\d{2}/)?.[0] || "",
            city: cityName,
          });
        }
      })
      .catch((err) => console.error("Failed to load Shabbat times", err));
  };

  useEffect(() => {
    const saved = localStorage.getItem("shabbatLocation");
    if (saved) {
      try {
        const { query, cityName } = JSON.parse(saved);
        fetchShabbatTimes(query, cityName);
      } catch (e) {
        fetchShabbatTimes("geonameid=281184", "ירושלים");
      }
    } else {
      fetchShabbatTimes("geonameid=281184", "ירושלים");
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (cityId: string, cityName: string) => {
    fetchShabbatTimes(`geonameid=${cityId}`, cityName);
    localStorage.setItem("shabbatLocation", JSON.stringify({ query: `geonameid=${cityId}`, cityName }));
    setIsDropdownOpen(false);
  };

  const handleLocationDetect = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=he`, {
            headers: { "User-Agent": "TorahLaneshama/1.0" }
          })
            .then(res => res.json())
            .then(loc => {
              const address = loc.address || {};
              const locationName = address.city || address.town || address.village || address.state_district || "לפי מיקום";
              fetchShabbatTimes(`latitude=${lat}&longitude=${lng}&tzid=Asia/Jerusalem`, locationName);
              localStorage.setItem("shabbatLocation", JSON.stringify({ query: `latitude=${lat}&longitude=${lng}&tzid=Asia/Jerusalem`, cityName: locationName }));
              setIsDropdownOpen(false);
            })
            .catch(() => {
              fetchShabbatTimes(`latitude=${lat}&longitude=${lng}&tzid=Asia/Jerusalem`, "לפי מיקום");
              localStorage.setItem("shabbatLocation", JSON.stringify({ query: `latitude=${lat}&longitude=${lng}&tzid=Asia/Jerusalem`, cityName: "לפי מיקום" }));
              setIsDropdownOpen(false);
            });
        },
        (error) => {
          console.error("Error getting location", error);
          alert("לא הצלחנו לאתר את המיקום שלך. אנא ודא שאישרת גישה למיקום בהגדרות הדפדפן.");
        }
      );
    } else {
      alert("הדפדפן שלך אינו תומך באיתור מיקום.");
    }
  };

  if (!times) return null;

  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-center relative items-center gap-3 sm:gap-4 bg-white/95 backdrop-blur-sm shadow-soft border border-ink-100 rounded-2xl sm:rounded-full px-5 py-2.5 animate-fade-up" ref={dropdownRef}>
      <div className="flex items-center gap-2 text-ink-700">
        <i className="fas fa-star-of-david text-primary-500 text-[15px]"></i>
        <span className="font-bold text-sm">{times.eventName}</span>
      </div>
      <div className="hidden sm:block w-px h-4 bg-ink-200"></div>
      <div className="flex flex-col text-[11px] font-medium text-ink-500 leading-tight">
        <span>כניסה: {times.inTime}</span>
        <span>יציאה: {times.outTime}</span>
      </div>
      <div className="hidden sm:block w-px h-4 bg-ink-200"></div>
      
      {/* Dropdown Toggle */}
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-1.5 text-ink-600 hover:text-primary-600 transition-colors text-xs font-semibold cursor-pointer group"
      >
        <i className="fas fa-map-marker-alt"></i>
        <span>{times.city}</span>
        <i className={`fas fa-chevron-down text-[10px] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}></i>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-ink-100 py-2 z-50 animate-fade-in text-sm font-medium">
          <button 
            onClick={handleLocationDetect}
            className="w-full text-right px-4 py-3 text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2 border-b border-ink-50"
          >
            <i className="fas fa-location-arrow"></i>
            <span>איתור מיקום אוטומטי</span>
          </button>
          <div className="py-1">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCitySelect(c.id, c.name)}
                className={`w-full text-right px-4 py-2 hover:bg-primary-50 transition-colors ${times.city === c.name ? "text-primary-600 bg-primary-50/50" : "text-ink-700"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
