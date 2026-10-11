"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function JoinFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("קישור ההזמנה חסר או אינו תקין");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    if (password.length < 6) {
      setError("על הסיסמה להכיל לפחות 6 תווים");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", token, email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "אירעה שגיאה בהרשמה");
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
    <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-neutral-200/80">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary-500 text-white flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
          <i className="fas fa-user-plus"></i>
        </div>
        <h1 className="font-heading font-black text-2xl text-neutral-950 mb-1">הצטרפות למערכת הניהול</h1>
        <p className="text-sm text-neutral-500 font-medium">הוזמנת לערוך ולנהל תכנים באתר תורה לנשמה</p>
      </div>

      {!token ? (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold text-center space-y-3">
          <p>קישור ההזמנה אינו תקף או שפג תוקפו.</p>
          <Link href="/admin/login" className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs">
            למסך הכניסה
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-3">
              <i className="fas fa-circle-exclamation text-base"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-700" htmlFor="join-email">כתובת אימייל</label>
              <input
                id="join-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3.5 text-sm font-medium text-neutral-900 focus:outline-none transition-all"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-700" htmlFor="join-password">בחר סיסמה</label>
              <input
                id="join-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="לפחות 6 תווים"
                className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3.5 text-sm font-medium text-neutral-900 focus:outline-none transition-all"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-700" htmlFor="join-confirm-password">אימות סיסמה</label>
              <input
                id="join-confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="חזור על הסיסמה"
                className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3.5 text-sm font-medium text-neutral-900 focus:outline-none transition-all"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>יוצר חשבון...</span>
                </>
              ) : (
                <span>סיום הרשמה וכניסה</span>
              )}
            </button>
          </form>
        </>
      )}

      <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
        <Link href="/admin/login" className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
          יש לך כבר חשבון? התחבר כאן
        </Link>
      </div>
    </div>
  );
}

export default function AdminJoinPage() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans text-neutral-900" dir="rtl">
      <Suspense fallback={<div className="p-6 text-center font-bold">טוען הזמנה...</div>}>
        <JoinFormContent />
      </Suspense>
    </div>
  );
}
