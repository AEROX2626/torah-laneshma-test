"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "פרטי התחברות שגויים");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("אירעה שגיאה בחיבור לשרת");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans text-neutral-900" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-neutral-200/80">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            <i className="fas fa-lock"></i>
          </div>
          <h1 className="font-heading font-black text-2xl text-neutral-950 mb-1">כניסה למערכת הניהול</h1>
          <p className="text-sm text-neutral-500 font-medium">תורה לנשמה · לוח בקרה ועריכת תוכן</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-3">
            <i className="fas fa-circle-exclamation text-base"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700" htmlFor="admin-email">כתובת אימייל</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-400">
                <i className="fas fa-envelope text-sm"></i>
              </div>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl pr-11 pl-4 py-3.5 text-sm font-medium text-neutral-900 focus:outline-none transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700" htmlFor="admin-password">סיסמה</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-400">
                <i className="fas fa-key text-sm"></i>
              </div>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl pr-11 pl-4 py-3.5 text-sm font-medium text-neutral-900 focus:outline-none transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                <span>מתחבר...</span>
              </>
            ) : (
              <span>כניסה למערכת</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <Link href="/" className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
            <i className="fas fa-arrow-right ml-1.5"></i> חזרה לאתר הראשי
          </Link>
        </div>
      </div>
    </div>
  );
}
