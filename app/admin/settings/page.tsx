"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    site_name: "תורה לנשמה",
    whatsapp_number: "050-3938114",
    contact_email: "contact@torah-laneshma.co.il",
    analytics_id: "G-PQ4ZMY1H4V",
    hide_from_google: false,
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl pb-16">
      {/* Top Header */}
      <div>
        <h1 className="font-heading font-black text-2xl md:text-3xl text-neutral-950">הגדרות אתר כלליות</h1>
        <p className="text-xs md:text-sm text-neutral-500 font-medium">
          פרטי קשר, אנליטיקס, והגדרות חשיפה במנועי חיפוש
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200/80 shadow-xs space-y-5">
          <h2 className="font-heading font-black text-lg text-neutral-950 pb-2 border-b border-neutral-100">
            פרטי התקשרות
          </h2>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">שם האתר הרשמי</label>
            <input
              type="text"
              required
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3 text-xs font-bold text-neutral-900 focus:outline-none transition-all"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">מספר וואטסאפ ללידים</label>
              <input
                type="text"
                required
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3 text-xs font-bold text-neutral-900 focus:outline-none transition-all"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">כתובת אימייל ליצירת קשר</label>
              <input
                type="email"
                required
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3 text-xs font-bold text-neutral-900 focus:outline-none transition-all"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Analytics & SEO Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200/80 shadow-xs space-y-5">
          <h2 className="font-heading font-black text-lg text-neutral-950 pb-2 border-b border-neutral-100">
            אנליטיקס וקידום בגוגל
          </h2>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">מזהה Google Analytics (Tag ID)</label>
            <input
              type="text"
              value={settings.analytics_id}
              onChange={(e) => setSettings({ ...settings, analytics_id: e.target.value })}
              placeholder="G-XXXXXX"
              className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3 text-xs font-mono text-neutral-900 focus:outline-none transition-all"
              dir="ltr"
            />
            <span className="text-[10px] text-neutral-400">מוזרק אך ורק לעמודי האתר הציבוריים.</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div>
              <span className="block text-xs font-bold text-neutral-900">להסתיר מגוגל ומנועי חיפוש (noindex)</span>
              <span className="text-[10px] text-neutral-500">הפעל מצב זה רק אם האתר נמצא בבנייה סגורה.</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, hide_from_google: !settings.hide_from_google })}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 relative ${
                settings.hide_from_google ? "bg-rose-500" : "bg-neutral-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  settings.hide_from_google ? "-translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                <span>שומר...</span>
              </>
            ) : savedSuccess ? (
              <>
                <i className="fas fa-check text-emerald-400"></i>
                <span>ההגדרות נשמרו בהצלחה!</span>
              </>
            ) : (
              <span>שמור הגדרות</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
