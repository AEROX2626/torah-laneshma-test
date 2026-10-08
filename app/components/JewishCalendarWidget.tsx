"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type HebcalItem = {
  date: string;
  category: string;
  subcat?: string;
  title: string;
  hebrew: string;
};

type DayEvent = { title: string; kind: "holiday" | "modern" | "roshchodesh" | "parasha" };

/* ---------- Hebrew date helpers (computed locally – no network needed) ---------- */

const HEB_ONES = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
const HEB_TENS = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
const HEB_HUNDREDS = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];

/** 26 -> כ״ו , 5787 -> תשפ״ז */
function toHebrewNumeral(n: number): string {
  n = n % 1000;
  let s = HEB_HUNDREDS[Math.floor(n / 100)];
  const rest = n % 100;
  if (rest === 15) s += "טו";
  else if (rest === 16) s += "טז";
  else s += HEB_TENS[Math.floor(rest / 10)] + HEB_ONES[rest % 10];
  if (s.length === 1) return s + "׳";
  return s.slice(0, -1) + "״" + s.slice(-1);
}

const hebFmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("he-IL-u-ca-hebrew", opts);
const fmtDay = hebFmt({ day: "numeric" });
const fmtMonth = hebFmt({ month: "long" });
const fmtYear = hebFmt({ year: "numeric" });

function hebrewParts(d: Date) {
  const day = parseInt(fmtDay.format(d), 10);
  const year = parseInt(fmtYear.format(d).replace(/\D/g, ""), 10);
  return {
    day,
    dayStr: toHebrewNumeral(day),
    month: fmtMonth.format(d),
    yearStr: toHebrewNumeral(year),
  };
}

const stripNikud = (s: string) => s.replace(/[\u0591-\u05C7]/g, "").replace(/\s\d{4}$/, "").trim();

/* ---------- constants ---------- */

const WEEKDAYS = [
  { full: "ראשון", short: "א׳" },
  { full: "שני", short: "ב׳" },
  { full: "שלישי", short: "ג׳" },
  { full: "רביעי", short: "ד׳" },
  { full: "חמישי", short: "ה׳" },
  { full: "שישי", short: "ו׳" },
  { full: "שבת", short: "ש׳" },
];
const GREG_MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

const EVENT_STYLE: Record<DayEvent["kind"], { chip: string; dot: string; icon: string }> = {
  holiday: { chip: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500", icon: "fa-star" },
  modern: { chip: "bg-indigo-50 text-indigo-800 border-indigo-200", dot: "bg-indigo-500", icon: "fa-flag" },
  roshchodesh: { chip: "bg-sky-50 text-sky-800 border-sky-200", dot: "bg-sky-500", icon: "fa-moon" },
  parasha: { chip: "bg-emerald-50 text-emerald-800 border-emerald-200", dot: "bg-emerald-500", icon: "fa-book-open" },
};

function toKind(item: HebcalItem): DayEvent["kind"] | null {
  if (item.category === "parashat") return "parasha";
  if (item.category === "roshchodesh") return "roshchodesh";
  if (item.category === "holiday") return item.subcat === "modern" ? "modern" : "holiday";
  return null;
}

/* ---------- component ---------- */

export default function JewishCalendarWidget({ onClose }: { onClose: () => void }) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [items, setItems] = useState<HebcalItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  useEffect(() => setMounted(true), []);

  // Lock background scroll + close on Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Holidays & parashot (Israel schedule)
  useEffect(() => {
    const ctrl = new AbortController();
    setLoadingEvents(true);
    fetch(
      `https://www.hebcal.com/hebcal?cfg=json&v=1&year=${year}&month=${month + 1}&maj=on&min=on&mod=on&nx=on&s=on&i=on&lg=h`,
      { signal: ctrl.signal }
    )
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoadingEvents(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setLoadingEvents(false);
      });
    return () => ctrl.abort();
  }, [year, month]);

  // Build day models for the month
  const days = useMemo(() => {
    const byDate: Record<string, DayEvent[]> = {};
    for (const it of items) {
      const kind = toKind(it);
      if (!kind) continue;
      const key = it.date.slice(0, 10);
      const title = stripNikud(it.hebrew || it.title);
      const list = (byDate[key] ||= []);
      if (!list.some((e) => e.title === title)) list.push({ title, kind });
    }
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month, day);
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return {
        day,
        date,
        weekday: date.getDay(),
        heb: hebrewParts(date),
        events: byDate[key] || [],
        isToday: isCurrentMonth && day === today.getDate(),
      };
    });
  }, [items, year, month, daysInMonth, isCurrentMonth, today]);

  // Header: Hebrew month range for the visible Gregorian month
  const hebrewRange = useMemo(() => {
    const first = hebrewParts(new Date(year, month, 1));
    const last = hebrewParts(new Date(year, month, daysInMonth));
    if (first.month === last.month) return `${first.month} ${first.yearStr}`;
    if (first.yearStr === last.yearStr) return `${first.month} – ${last.month} ${last.yearStr}`;
    return `${first.month} ${first.yearStr} – ${last.month} ${last.yearStr}`;
  }, [year, month, daysInMonth]);

  const goToMonth = (offset: number) => {
    const next = new Date(year, month + offset, 1);
    setViewDate(next);
    const nextIsCurrent = next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth();
    setSelectedDay(nextIsCurrent ? today.getDate() : 1);
  };
  const goToToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  // RTL swipe: finger moving right (→) reveals the next month (which sits on the left in RTL)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) goToMonth(dx > 0 ? 1 : -1);
    touchStartX.current = touchStartY.current = null;
  };

  const selected = days[Math.min(selectedDay, daysInMonth) - 1];
  const monthEvents = days.filter((d) => d.events.length > 0);

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-stretch sm:items-center justify-center sm:p-4 md:p-6" dir="rtl" role="dialog" aria-modal="true" aria-label="לוח שנה עברי">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full sm:max-w-5xl sm:rounded-3xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-ink-100">
        {/* ---------- Header ---------- */}
        <div className="shrink-0 border-b border-ink-100 bg-white px-4 sm:px-6 pt-3 pb-3 sm:py-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs font-bold tracking-widest text-ink-400">לוח שנה עברי</span>
            <div className="flex items-center gap-2">
              {!isCurrentMonth && (
                <button onClick={goToToday} className="text-sm font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-100 px-3 py-1.5 rounded-full transition-colors">
                  היום
                </button>
              )}
              <button onClick={onClose} aria-label="סגירה" className="w-9 h-9 flex items-center justify-center rounded-full bg-ink-50 text-ink-500 hover:text-rose-700 hover:bg-rose-50 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* RTL: previous on the right, next on the left */}
            <button onClick={() => goToMonth(-1)} aria-label="חודש קודם" className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="text-center min-w-0">
              <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-ink-950 leading-tight truncate">{hebrewRange}</h3>
              <div className="text-ink-500 font-semibold text-sm sm:text-base">{GREG_MONTHS[month]} {year}</div>
            </div>
            <button onClick={() => goToMonth(1)} aria-label="חודש הבא" className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
              <i className="fas fa-chevron-left"></i>
            </button>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div className="flex-grow overflow-y-auto overscroll-contain bg-ink-50/40" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="md:flex md:gap-6 p-2 sm:p-4 md:p-6">
            {/* Grid */}
            <div className="md:flex-1">
              <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1">
                {WEEKDAYS.map((wd, i) => (
                  <div key={wd.full} className={`text-center font-bold text-xs md:text-sm py-1.5 ${i === 6 ? "text-primary-600" : "text-ink-500"}`}>
                    <span className="hidden md:inline">{wd.full}</span>
                    <span className="md:hidden">{wd.short}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {Array.from({ length: startWeekday }).map((_, i) => (
                  <div key={`e-${i}`} aria-hidden="true"></div>
                ))}

                {days.map((d) => {
                  const isSelected = d.day === selectedDay;
                  const isShabbat = d.weekday === 6;
                  const monthStart = d.heb.day === 1;
                  return (
                    <button
                      key={d.day}
                      onClick={() => setSelectedDay(d.day)}
                      aria-label={`${d.day} ב${GREG_MONTHS[month]}, ${d.heb.dayStr} ב${d.heb.month}${d.events.length ? ", " + d.events.map((e) => e.title).join(", ") : ""}`}
                      aria-pressed={isSelected}
                      className={`relative flex flex-col items-center md:items-stretch rounded-xl md:rounded-2xl border text-center md:text-right transition-all min-h-[58px] md:min-h-[104px] p-1 md:p-2.5 ${
                        isSelected
                          ? "border-primary-500 ring-2 ring-primary-200 bg-white shadow-sm"
                          : isShabbat
                          ? "border-primary-100/70 bg-primary-50/40 hover:border-primary-200"
                          : "border-ink-100 bg-white hover:border-primary-200"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between items-center w-full">
                        <span
                          className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full font-bold text-[15px] md:text-lg ${
                            d.isToday ? "bg-primary-600 text-white shadow" : isShabbat ? "text-primary-700" : "text-ink-900"
                          }`}
                        >
                          {d.day}
                        </span>
                        <span
                          className={`leading-tight font-bold whitespace-nowrap mt-0.5 md:mt-1 ${
                            monthStart ? "text-primary-700 text-[10px] md:text-xs bg-primary-50 md:bg-transparent px-1 rounded" : "text-ink-500 text-[11px] md:text-sm"
                          }`}
                        >
                          {monthStart ? `א׳ ${d.heb.month}` : d.heb.dayStr}
                        </span>
                      </div>

                      {/* Mobile: dots */}
                      {d.events.length > 0 && (
                        <div className="md:hidden flex gap-0.5 mt-auto pt-0.5">
                          {d.events.slice(0, 3).map((e, i) => (
                            <span key={i} className={`w-1.5 h-1.5 rounded-full ${EVENT_STYLE[e.kind].dot}`}></span>
                          ))}
                        </div>
                      )}

                      {/* Desktop: chips */}
                      <div className="hidden md:flex flex-col gap-1 mt-2 min-w-0">
                        {d.events.map((e, i) => (
                          <span key={i} className={`block truncate text-[11px] font-bold px-1.5 py-1 rounded-md border leading-tight ${EVENT_STYLE[e.kind].chip}`} title={e.title}>
                            {e.title}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-[11px] md:text-xs font-semibold text-ink-500">
                <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${EVENT_STYLE.holiday.dot}`}></span>חג / מועד</span>
                <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${EVENT_STYLE.parasha.dot}`}></span>פרשת השבוע</span>
                <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${EVENT_STYLE.roshchodesh.dot}`}></span>ראש חודש</span>
                <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${EVENT_STYLE.modern.dot}`}></span>יום לאומי</span>
              </div>
            </div>

            {/* Side / bottom panel */}
            <aside className="md:w-80 shrink-0 mt-3 md:mt-0 space-y-3">
              {selected && (
                <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-4" aria-live="polite">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-heading font-black text-2xl text-ink-950 leading-tight">
                        {selected.heb.dayStr} ב{selected.heb.month} {selected.heb.yearStr}
                      </div>
                      <div className="text-ink-500 font-semibold text-sm mt-0.5">
                        יום {WEEKDAYS[selected.weekday].full}, {selected.day} ב{GREG_MONTHS[month]} {year}
                      </div>
                    </div>
                    {selected.isToday && <span className="shrink-0 text-xs font-bold text-white bg-primary-600 px-2.5 py-1 rounded-full">היום</span>}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {selected.events.length > 0 ? (
                      selected.events.map((e, i) => (
                        <div key={i} className={`flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-xl border ${EVENT_STYLE[e.kind].chip}`}>
                          <i className={`fas ${EVENT_STYLE[e.kind].icon} text-xs opacity-80`}></i>
                          {e.title}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-ink-400 font-medium">{loadingEvents ? "טוען אירועים..." : "אין מועדים מיוחדים ביום זה"}</div>
                    )}
                  </div>
                </div>
              )}

              {monthEvents.length > 0 && (
                <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-2">
                  <div className="px-2 pt-1.5 pb-2 text-xs font-bold tracking-wider text-ink-400">מועדים החודש</div>
                  <ul>
                    {monthEvents.map((d) => (
                      <li key={d.day}>
                        <button
                          onClick={() => setSelectedDay(d.day)}
                          className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl text-right transition-colors ${d.day === selectedDay ? "bg-primary-50" : "hover:bg-ink-50"}`}
                        >
                          <span className="w-11 shrink-0 text-center leading-tight">
                            <span className="block font-black text-ink-900">{d.day}</span>
                            <span className="block text-[11px] font-semibold text-ink-500">{d.heb.dayStr} {d.heb.month}</span>
                          </span>
                          <span className="flex flex-col gap-1 min-w-0">
                            {d.events.map((e, i) => (
                              <span key={i} className="flex items-center gap-1.5 text-sm font-semibold text-ink-800 truncate">
                                <span className={`w-2 h-2 shrink-0 rounded-full ${EVENT_STYLE[e.kind].dot}`}></span>
                                <span className="truncate">{e.title}</span>
                              </span>
                            ))}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
