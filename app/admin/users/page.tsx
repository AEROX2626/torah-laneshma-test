"use client";

import { useState, useEffect } from "react";
import { AdminUser } from "@/lib/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInviteUrl, setNewInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.invites) setInvites(data.invites);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateInvite = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite", role: "editor" }),
      });
      const data = await res.json();
      if (data.success && data.inviteUrl) {
        setNewInviteUrl(data.inviteUrl);
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!newInviteUrl) return;
    navigator.clipboard.writeText(newInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappShareUrl = newInviteUrl
    ? `https://wa.me/?text=${encodeURIComponent(
        `שלום, שלחתי לך קישור הצטרפות ישיר לניהול ועריכת תוכן באתר תורה לנשמה:\n${newInviteUrl}\nהקישור תקף ל-7 ימים.`
      )}`
    : "#";

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-neutral-950">משתמשים והרשאות</h1>
          <p className="text-xs md:text-sm text-neutral-500 font-medium">
            ניהול עורכים ומנהלים, והפקת קישורי הזמנה מהירים לשיתוף גישה
          </p>
        </div>

        <button
          onClick={handleGenerateInvite}
          disabled={generating}
          className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {generating ? (
            <i className="fas fa-circle-notch fa-spin text-xs"></i>
          ) : (
            <i className="fas fa-key text-xs"></i>
          )}
          <span>צור קישור הזמנה מהיר</span>
        </button>
      </div>

      {/* Generated Invite Box */}
      {newInviteUrl && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 md:p-8 animate-fade-in space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                <i className="fas fa-link"></i>
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-emerald-950">
                  קישור ההזמנה הופק בהצלחה!
                </h3>
                <p className="text-xs text-emerald-700 font-medium">
                  שלח את הקישור לעורך החדש. בלחיצה עליו הוא יבחר סיסמה וייכנס ישירות למערכת.
                </p>
              </div>
            </div>

            <button
              onClick={() => setNewInviteUrl(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
            >
              סגור
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <input
              type="text"
              readOnly
              value={newInviteUrl}
              className="flex-1 bg-white border border-emerald-300 rounded-xl px-4 py-2.5 text-xs text-neutral-800 font-mono select-all focus:outline-none"
              dir="ltr"
            />

            <button
              onClick={handleCopyLink}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
              <span>{copied ? "הועתק ללוח!" : "העתק קישור"}</span>
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <i className="fab fa-whatsapp text-sm"></i>
              <span>שלח בוואטסאפ</span>
            </a>
          </div>
        </div>
      )}

      {/* Users List Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-lg text-neutral-950">משתמשי המערכת הפעילים</h2>
            <p className="text-xs text-neutral-500 font-medium">מורשים לערוך תכנים ולצפות בפניות</p>
          </div>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
            {users.length} משתמשים
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-neutral-400 font-bold">טוען משתמשים...</div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {users.map((u) => (
              <div key={u.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-heading font-black text-sm shrink-0">
                    {u.email.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-heading font-black text-sm text-neutral-900 block" dir="ltr">
                      {u.email}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      נוצר ב-
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("he-IL")
                        : "מערכת"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      u.role === "admin"
                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    <i className={`fas ${u.role === "admin" ? "fa-shield-halved" : "fa-pen-to-square"} text-[10px]`}></i>
                    <span>{u.role === "admin" ? "מנהל מערכת (הכל)" : "עורך תוכן"}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roles Explanation */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-heading font-black text-sm text-primary-700">
            <i className="fas fa-shield-halved"></i>
            <span>תפקיד מנהל/ת מערכת</span>
          </div>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            גישה מלאה לכל חלקי המערכת: עריכה ויזואלית של עמודי האתר, ניהול שאלות ותשובות, צפייה וניהול פניות, ייצוא נתונים, והפקת קישורי הזמנה למשתמשים נוספים.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-heading font-black text-sm text-neutral-700">
            <i className="fas fa-pen-to-square"></i>
            <span>תפקיד עורך/ת תוכן</span>
          </div>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            מורשה לנהל ולעדכן שאלות ותשובות (FAQ), לצפות בפניות של גולשים ולעדכן סטטוס טיפול והערות מעקב, ללא אפשרות לשנות הגדרות אתר או למחוק נתונים לצמיתות.
          </p>
        </div>
      </div>
    </div>
  );
}
