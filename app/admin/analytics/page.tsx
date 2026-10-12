"use client";

import { useState, useEffect } from "react";
import { SiteVisitsSummary } from "@/lib/db";

interface TelegramConfigState {
  bot_token: string;
  chat_id: string;
  daily_report_enabled: boolean;
  instant_leads_enabled: boolean;
  is_configured: boolean;
}

export default function AdminAnalyticsPage() {
  const [config, setConfig] = useState<TelegramConfigState>({
    bot_token: "",
    chat_id: "",
    daily_report_enabled: true,
    instant_leads_enabled: true,
    is_configured: false,
  });

  const [summary, setSummary] = useState<SiteVisitsSummary>({
    total_visits: 0,
    unique_visitors: 0,
    top_pages: [],
    top_sources: [],
    devices: { mobile: 0, desktop: 0, tablet: 0 },
    new_leads_count: 0,
    new_leads: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/telegram");
      const data = await res.json();
      if (data.config) setConfig(data.config);
      if (data.summary) setSummary(data.summary);
    } catch {
      setStatusMessage({ text: "שגיאה בטעינת נתוני האנליטיקס", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_config",
          bot_token: config.bot_token,
          chat_id: config.chat_id,
          daily_report_enabled: config.daily_report_enabled,
          instant_leads_enabled: config.instant_leads_enabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig((prev) => ({
          ...prev,
          is_configured: Boolean(config.bot_token && config.chat_id),
        }));
        setStatusMessage({ text: "הגדרות טלגרם נשמרו בהצלחה!", type: "success" });
      } else {
        setStatusMessage({ text: data.error || "שגיאה בשמירת הגדרות", type: "error" });
      }
    } catch {
      setStatusMessage({ text: "שגיאת תקשורת עם השרת", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    setTesting(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          bot_token: config.bot_token,
          chat_id: config.chat_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: data.message, type: "success" });
      } else {
        setStatusMessage({ text: data.error || "שגיאה בשליחת הודעת הבדיקה", type: "error" });
      }
    } catch {
      setStatusMessage({ text: "שגיאת רשת בבדיקת החיבור", type: "error" });
    } finally {
      setTesting(false);
    }
  };

  const handleSendReportNow = async () => {
    setSendingReport(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_report",
          bot_token: config.bot_token,
          chat_id: config.chat_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: data.message, type: "success" });
      } else {
        setStatusMessage({ text: data.error || "שגיאה בשליחת הדוח", type: "error" });
      }
    } catch {
      setStatusMessage({ text: "שגיאה בשליחת הדוח לטלגרם", type: "error" });
    } finally {
      setSendingReport(false);
    }
  };

  const totalDev = (summary.devices.mobile || 0) + (summary.devices.desktop || 0) + (summary.devices.tablet || 0);
  const mobilePct = totalDev > 0 ? Math.round(((summary.devices.mobile || 0) / totalDev) * 100) : 0;
  const desktopPct = totalDev > 0 ? 100 - mobilePct : 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-neutral-950 flex items-center gap-3">
            <span>אנליטיקס ודוחות טלגרם</span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                config.is_configured
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <i className={`fas ${config.is_configured ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
              {config.is_configured ? "בוט טלגרם מחובר" : "טלגרם לא מוגדר"}
            </span>
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 font-medium mt-1">
            ניטור כניסות לאתר בזמן אמת, דוחות יומיים אוטומטיים והתראות פניות לטלגרם
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <i className={`fas fa-rotate-right ${loading ? "fa-spin" : ""}`}></i>
          <span>רענן נתונים</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 animate-fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <i
            className={`fas ${
              statusMessage.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"
            }`}
          ></i>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Visits */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500">כניסות ב-24 שעות</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
              <i className="fas fa-eye"></i>
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-neutral-950 font-heading">
            {summary.total_visits}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium mt-1">סה״כ צפיות בעמודים</div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500">מבקרים ייחודיים</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-neutral-950 font-heading">
            {summary.unique_visitors}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium mt-1">משתמשים שונים</div>
        </div>

        {/* Devices */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500">חלוקת מכשירים</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <i className="fas fa-mobile-screen-button"></i>
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-neutral-950 font-heading">
            {mobilePct}% <span className="text-xs text-neutral-400 font-normal">נייד</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-medium mt-1">
            {desktopPct}% מחשב נייח/נייד
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500">פניות ולידים (24 שעות)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="fas fa-handshake-angle"></i>
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-600 font-heading">
            {summary.new_leads_count}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium mt-1">
            {summary.new_leads_count > 0 ? "פניות חדשות שהושארו" : "לא הושארו פניות חדשות"}
          </div>
        </div>
      </div>

      {/* Tables: Top Pages & Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs">
          <h2 className="font-heading font-black text-base text-neutral-950 mb-4 flex items-center gap-2">
            <i className="fas fa-file-lines text-primary-500 text-sm"></i>
            <span>עמודים נצפים ביותר</span>
          </h2>
          {summary.top_pages.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 font-bold">
              עוד לא נרשמו כניסות ב-24 שעות האחרונות
            </div>
          ) : (
            <div className="space-y-2.5">
              {summary.top_pages.map((p, i) => (
                <div
                  key={p.path}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-5 h-5 rounded-md bg-white text-neutral-600 font-bold flex items-center justify-center text-[10px] shrink-0 border border-neutral-200">
                      {i + 1}
                    </span>
                    <span className="font-mono font-medium text-neutral-800 truncate" dir="ltr">
                      {p.path === "/" ? "/ (עמוד הבית)" : p.path}
                    </span>
                  </div>
                  <span className="font-black text-neutral-900 shrink-0 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                    {p.count} צפיות
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Sources */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs">
          <h2 className="font-heading font-black text-base text-neutral-950 mb-4 flex items-center gap-2">
            <i className="fas fa-arrow-trend-up text-emerald-500 text-sm"></i>
            <span>ערוצי הגעת גולשים (Sources)</span>
          </h2>
          {summary.top_sources.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 font-bold">
              עוד לא נרשמו מקורות כניסה
            </div>
          ) : (
            <div className="space-y-2.5">
              {summary.top_sources.map((s) => (
                <div
                  key={s.source}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <i className="fab fa-telegram text-sky-500"></i>
                    <span className="font-bold text-neutral-800">{s.source}</span>
                  </div>
                  <span className="font-black text-neutral-900 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                    {s.count} כניסות
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Telegram Settings & Direct Controls */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200/80 shadow-xs space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="font-heading font-black text-lg text-neutral-950 flex items-center gap-2.5">
            <i className="fab fa-telegram text-sky-500 text-xl"></i>
            <span>הגדרות בוט טלגרם לדוחות והתראות</span>
          </h2>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            חבר בוט טלגרם כדי לקבל בכל ערב דוח כניסות מסכם, והתראה מיידית בכל פעם שגולש משאיר פרטים.
          </p>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bot Token */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700" htmlFor="tg-token">
                Telegram Bot Token
              </label>
              <div className="relative">
                <input
                  id="tg-token"
                  type={showToken ? "text" : "password"}
                  value={config.bot_token}
                  onChange={(e) => setConfig({ ...config, bot_token: e.target.value })}
                  placeholder="לדוגמה: 789456123:AAH_XYZ..."
                  className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3 text-xs font-mono text-neutral-900 focus:outline-none transition-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer"
                >
                  <i className={`fas ${showToken ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Chat ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700" htmlFor="tg-chat">
                Telegram Chat ID (המזהה שלך)
              </label>
              <input
                id="tg-chat"
                type="text"
                value={config.chat_id}
                onChange={(e) => setConfig({ ...config, chat_id: e.target.value })}
                placeholder="לדוגמה: 123456789"
                className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3 text-xs font-mono text-neutral-900 focus:outline-none transition-all"
                dir="ltr"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer bg-neutral-50/50">
              <input
                type="checkbox"
                checked={config.daily_report_enabled}
                onChange={(e) => setConfig({ ...config, daily_report_enabled: e.target.checked })}
                className="w-4 h-4 rounded text-neutral-900 accent-neutral-900 cursor-pointer"
              />
              <span className="text-xs font-bold text-neutral-800">
                שלח דוח יומי מרוכז בטלגרם (כל ערב)
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer bg-neutral-50/50">
              <input
                type="checkbox"
                checked={config.instant_leads_enabled}
                onChange={(e) => setConfig({ ...config, instant_leads_enabled: e.target.checked })}
                className="w-4 h-4 rounded text-neutral-900 accent-neutral-900 cursor-pointer"
              />
              <span className="text-xs font-bold text-neutral-800">
                שלח התראה מיידית בטלגרם על כל ליד חדש 🔥
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-60 flex items-center gap-2 cursor-pointer"
            >
              <i className={`fas ${saving ? "fa-circle-notch fa-spin" : "fa-floppy-disk"}`}></i>
              <span>{saving ? "שומר..." : "שמור הגדרות טלגרם"}</span>
            </button>

            <button
              type="button"
              onClick={handleSendTest}
              disabled={testing || !config.bot_token || !config.chat_id}
              className="py-3 px-5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <i className={`fas ${testing ? "fa-circle-notch fa-spin" : "fa-paper-plane"}`}></i>
              <span>{testing ? "בודק חיבור..." : "שלח הודעת בדיקה לטלגרם 📲"}</span>
            </button>

            <button
              type="button"
              onClick={handleSendReportNow}
              disabled={sendingReport || !config.bot_token || !config.chat_id}
              className="py-3 px-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <i className={`fas ${sendingReport ? "fa-circle-notch fa-spin" : "fa-chart-pie"}`}></i>
              <span>{sendingReport ? "שולח דוח..." : "שלח דוח יומי עכשיו 📊"}</span>
            </button>
          </div>
        </form>

        {/* 1-Minute Setup Guide Box */}
        <div className="mt-6 p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-xs space-y-3">
          <div className="font-black text-sky-950 flex items-center gap-2 text-sm">
            <i className="fas fa-lightbulb text-amber-500"></i>
            <span>מדריך דקה ליצירת בוט טלגרם (בחינם לגמרי):</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-neutral-700 font-medium leading-relaxed">
            <li>
              פתח את טלגרם וחפש את <b>@BotFather</b> (הבוט הרשמי של טלגרם).
            </li>
            <li>
              שלח לו את הפקודה <code>/newbot</code>, בחר שם לבוט (למשל: <i>TorahLaneshamaBot</i>), ותקבל ממנו קוד <b>Token</b>. העתק אותו והדבק בשדה <b>Telegram Bot Token</b> למעלה.
            </li>
            <li>
              פתח שיחה עם הבוט החדש שיצרת ולחץ על כפתור <b>Start</b>.
            </li>
            <li>
              כדי לדעת מה ה-<b>Chat ID</b> שלך: חפש בטלגרם את <b>@userinfobot</b> – הוא ישלח לך מיד מספר מזהה (Id). העתק והדבק בשדה <b>Telegram Chat ID</b> למעלה.
            </li>
            <li>
              לחץ על <b>"שמור הגדרות טלגרם"</b> ואז על <b>"שלח הודעת בדיקה לטלגרם"</b> – ותקבל אישור מיידי בנייד!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
