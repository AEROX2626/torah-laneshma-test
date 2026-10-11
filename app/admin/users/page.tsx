"use client";

import { useState, useEffect } from "react";
import { AdminUser, UserRole } from "@/lib/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Invite state
  const [selectedRole, setSelectedRole] = useState<UserRole>("editor");
  const [newInviteUrl, setNewInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Direct user modal state
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);
  const [directEmail, setDirectEmail] = useState("");
  const [directPassword, setDirectPassword] = useState("");
  const [directRole, setDirectRole] = useState<UserRole>("editor");
  const [directLoading, setDirectLoading] = useState(false);
  const [directError, setDirectError] = useState("");
  const [directSuccess, setDirectSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.currentUser) setCurrentUser(data.currentUser);
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
        body: JSON.stringify({ action: "invite", role: selectedRole }),
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

  const handleDirectCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setDirectError("");
    setDirectSuccess("");
    setDirectLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          email: directEmail,
          password: directPassword,
          role: directRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setDirectError(data.error || "אירעה שגיאה ביצירת המשתמש");
      } else {
        setDirectSuccess("המשתמש נוצר בהצלחה!");
        setDirectEmail("");
        setDirectPassword("");
        await loadData();
        setTimeout(() => {
          setIsDirectModalOpen(false);
          setDirectSuccess("");
        }, 1500);
      }
    } catch {
      setDirectError("שגיאת תקשורת בשרת");
    } finally {
      setDirectLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את המשתמש ${email}?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      } else {
        alert(data.error || "שגיאה במחיקת משתמש");
      }
    } catch {
      alert("שגיאת תקשורת");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "מנהל מערכת (הכל)",
          icon: "fa-shield-halved",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "editor":
        return {
          label: "עורך תוכן",
          icon: "fa-pen-to-square",
          className: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "leads_manager":
        return {
          label: "מנהל לידים",
          icon: "fa-inbox",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      default:
        return {
          label: "משתמש",
          icon: "fa-user",
          className: "bg-neutral-100 text-neutral-700 border-neutral-200",
        };
    }
  };

  const roleLabels: Record<UserRole, string> = {
    admin: "מנהל מערכת",
    editor: "עורך תוכן",
    leads_manager: "מנהל לידים",
  };

  const whatsappShareUrl = newInviteUrl
    ? `https://wa.me/?text=${encodeURIComponent(
        `שלום, שלחתי לך קישור הצטרפות ישיר למערכת תורה לנשמה בתפקיד ${roleLabels[selectedRole]}:\n${newInviteUrl}\nהקישור תקף ל-7 ימים.`
      )}`
    : "#";

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-neutral-950">משתמשים והרשאות</h1>
          <p className="text-xs md:text-sm text-neutral-500 font-medium">
            ניהול עורכים, מנהלי לידים ומנהלי מערכת, והפקת קישורי גישה מאובטחים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDirectModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <i className="fas fa-user-plus text-xs"></i>
            <span>הוסף משתמש ישיר</span>
          </button>
        </div>
      </div>

      {/* Invite Generator Box */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="font-heading font-black text-lg text-neutral-950 mb-1">הפקת קישור הזמנה מהיר</h2>
          <p className="text-xs text-neutral-500 font-medium">
            בחר את התפקיד המבוקש והפק קישור מאובטח לשליחה בוואטסאפ או במייל. המשתמש יקבע סיסמה וייכנס מיד.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole("editor")}
            className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
              selectedRole === "editor"
                ? "bg-purple-50/70 border-purple-400 ring-2 ring-purple-400/20 shadow-xs"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-purple-900 mb-1">
              <i className="fas fa-pen-to-square text-purple-600"></i>
              <span>עורך תוכן</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
              עריכה ויזואלית של דפי האתר, שאלות ותשובות (FAQ) ושפת עיצוב.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("leads_manager")}
            className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
              selectedRole === "leads_manager"
                ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 mb-1">
              <i className="fas fa-inbox text-emerald-600"></i>
              <span>מנהל לידים</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
              צפייה בפניות מהאתר לחברותא ואמץ אברך, סימון סטטוסים והערות.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("admin")}
            className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
              selectedRole === "admin"
                ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/20 shadow-xs"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-blue-900 mb-1">
              <i className="fas fa-shield-halved text-blue-600"></i>
              <span>מנהל מערכת</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
              גישה מלאה לכל חלקי המערכת: תוכן, לידים, משתמשים והגדרות.
            </p>
          </button>
        </div>

        <button
          onClick={handleGenerateInvite}
          disabled={generating}
          className="px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {generating ? (
            <i className="fas fa-circle-notch fa-spin text-xs"></i>
          ) : (
            <i className="fas fa-key text-xs"></i>
          )}
          <span>הפק קישור הזמנה לתפקיד: {roleLabels[selectedRole]}</span>
        </button>

        {/* Generated Invite Box */}
        {newInviteUrl && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 md:p-6 animate-fade-in space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                  <i className="fas fa-link"></i>
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-emerald-950">
                    קישור הזמנה הופק בהצלחה עבור: {roleLabels[selectedRole]}!
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    שלח את הקישור למשתמש. בלחיצה עליו הוא יבחר סיסמה וייכנס למערכת עם ההרשאות המתאימות.
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

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <input
                type="text"
                readOnly
                value={newInviteUrl}
                className="flex-1 bg-white border border-emerald-300 rounded-xl px-4 py-2.5 text-xs text-neutral-800 font-mono select-all focus:outline-none"
                dir="ltr"
              />

              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
                <span>{copied ? "הועתק ללוח!" : "העתק קישור"}</span>
              </button>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <i className="fab fa-whatsapp text-sm"></i>
                <span>שלח בוואטסאפ</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Users List Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-lg text-neutral-950">משתמשי המערכת הפעילים</h2>
            <p className="text-xs text-neutral-500 font-medium">מורשים לפעול במערכת לפי תפקידם</p>
          </div>
          <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            {users.length} משתמשים
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-neutral-400 font-bold">טוען משתמשים...</div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {users.map((u) => {
              const badge = getRoleBadge(u.role);
              const isSelf = currentUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-heading font-black text-sm shrink-0">
                      {u.email.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-sm text-neutral-900 block" dir="ltr">
                          {u.email}
                        </span>
                        {isSelf && (
                          <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-bold">
                            אתה
                          </span>
                        )}
                      </div>
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
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border ${badge.className}`}
                    >
                      <i className={`fas ${badge.icon} text-[10px]`}></i>
                      <span>{badge.label}</span>
                    </span>

                    {!isSelf && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        className="w-8 h-8 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        title="מחק משתמש"
                      >
                        <i className="fas fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Roles Matrix Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-heading font-black text-sm text-blue-700">
            <i className="fas fa-shield-halved"></i>
            <span>מנהל מערכת (Admin)</span>
          </div>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            שליטה מלאה בכל חלקי האתר: עורך ויזואלי, שאלות ותשובות, פניות ולידים, הפקת הזמנות, ניהול משתמשים והגדרות מערכת.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-heading font-black text-sm text-purple-700">
            <i className="fas fa-pen-to-square"></i>
            <span>עורך תוכן (Editor)</span>
          </div>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            מורשה לערוך את תכני האתר בעורך הוויזואלי, לעדכן ולסדר שאלות ותשובות (FAQ). ללא גישה לניהול משתמשים והגדרות אתר.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-heading font-black text-sm text-emerald-700">
            <i className="fas fa-inbox"></i>
            <span>מנהל לידים (Leads Manager)</span>
          </div>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            גישה ממוקדת לטבלת הפניות וההרשמות לחברותא ואמץ אברך: עדכון סטטוסים, הערות מעקב ויצירת קשר ישיר עם פונים.
          </p>
        </div>
      </div>

      {/* Direct Add User Modal */}
      {isDirectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-neutral-100 animate-scale-in space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-sm">
                  <i className="fas fa-user-plus"></i>
                </div>
                <h3 className="font-heading font-black text-base text-neutral-950">הוספת משתמש ישיר</h3>
              </div>
              <button
                onClick={() => setIsDirectModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {directError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                {directError}
              </div>
            )}

            {directSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
                {directSuccess}
              </div>
            )}

            <form onSubmit={handleDirectCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">כתובת אימייל</label>
                <input
                  type="email"
                  required
                  value={directEmail}
                  onChange={(e) => setDirectEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-xl px-4 py-3 text-xs font-medium text-neutral-900 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">סיסמה ראשונית</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={directPassword}
                  onChange={(e) => setDirectPassword(e.target.value)}
                  placeholder="לפחות 6 תווים"
                  className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-xl px-4 py-3 text-xs font-medium text-neutral-900 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">תפקיד במערכת</label>
                <select
                  value={directRole}
                  onChange={(e) => setDirectRole(e.target.value as UserRole)}
                  className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-xl px-4 py-3 text-xs font-bold text-neutral-900 focus:outline-none"
                >
                  <option value="editor">עורך תוכן (עריכת דפים ו-FAQ)</option>
                  <option value="leads_manager">מנהל לידים (פניות וטיפול בחברותא)</option>
                  <option value="admin">מנהל מערכת (גישה מלאה להכל)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDirectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-bold"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  disabled={directLoading}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {directLoading ? "יוצר..." : "צור משתמש"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
