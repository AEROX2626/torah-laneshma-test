"use client";

import { useState, useEffect } from "react";
import { Submission } from "@/lib/db";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [editingNoteItem, setEditingNoteItem] = useState<Submission | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/submissions?status=${statusFilter}&kind=${kindFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.items) {
        setSubmissions(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter, kindFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadSubmissions();
  };

  const handleStatusChange = async (id: string, newStatus: Submission["status"]) => {
    // Optimistic UI update
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  const handleSaveNote = async () => {
    if (!editingNoteItem) return;
    setSavingNote(true);

    try {
      await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingNoteItem.id, notes: noteText }),
      });

      setSubmissions((prev) =>
        prev.map((s) => (s.id === editingNoteItem.id ? { ...s, notes: noteText } : s))
      );
      setEditingNoteItem(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const exportUrl = `/api/admin/submissions?export=csv&status=${statusFilter}&kind=${kindFilter}&search=${encodeURIComponent(search)}`;

  const statuses = [
    { id: "all", label: "כל הפניות" },
    { id: "new", label: "חדשות" },
    { id: "in_progress", label: "בטיפול" },
    { id: "done", label: "טופלו" },
    { id: "trash", label: "סל מיחזור" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-neutral-950">ניהול פניות ולידים</h1>
          <p className="text-xs md:text-sm text-neutral-500 font-medium">
            ריכוז כל הפניות שהתקבלו מטופס החברותא ועמוד אמץ אברך
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={exportUrl}
            className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <i className="fas fa-file-excel text-emerald-600"></i>
            <span>ייצוא לאקסל (CSV)</span>
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl overflow-x-auto">
          {statuses.map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st.id
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Kind & Search */}
        <div className="flex flex-wrap items-center gap-3 flex-1 justify-end min-w-[280px]">
          {/* Kind Select */}
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-xs font-bold rounded-xl px-3 py-2 text-neutral-700 focus:outline-none cursor-pointer"
          >
            <option value="all">כל המקורות</option>
            <option value="chavruta">טופס חברותא</option>
            <option value="adopt">אמץ אברך</option>
          </select>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[180px] sm:min-w-[220px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש שם, טלפון, תוכן..."
              className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-xl pr-3 pl-8 py-2 text-xs font-medium text-neutral-900 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-neutral-400 hover:text-neutral-900"
            >
              <i className="fas fa-search text-xs"></i>
            </button>
          </form>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-neutral-400 font-bold">
            <i className="fas fa-circle-notch fa-spin text-2xl mb-3 block text-neutral-300"></i>
            טוען פניות...
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-16 text-center text-neutral-400 font-bold space-y-2">
            <i className="fas fa-inbox text-3xl mb-2 block text-neutral-300"></i>
            <span>לא נמצאו פניות העונות לסינון</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-400 font-bold uppercase text-[10px]">
                  <th className="px-6 py-3.5">שם הפונה</th>
                  <th className="px-6 py-3.5">סוג</th>
                  <th className="px-6 py-3.5">יצירת קשר</th>
                  <th className="px-6 py-3.5">נושא / הודעה</th>
                  <th className="px-6 py-3.5">סטטוס טיפול</th>
                  <th className="px-6 py-3.5">הערות פנימיות</th>
                  <th className="px-6 py-3.5">תאריך</th>
                  <th className="px-6 py-3.5">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {submissions.map((sub) => {
                  const rawPhone = sub.phone.replace(/[^0-9]/g, "");
                  const intlPhone = rawPhone.startsWith("0") ? "972" + rawPhone.slice(1) : rawPhone;
                  const waUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(
                    `שלום ${sub.name}, פנית אלינו דרך אתר תורה לנשמה.`
                  )}`;

                  return (
                    <tr key={sub.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Name */}
                      <td className="px-6 py-4 font-bold text-neutral-900 whitespace-nowrap">
                        {sub.name}
                      </td>

                      {/* Kind */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700">
                          {sub.kind === "chavruta" ? "חברותא" : "אמץ אברך"}
                        </span>
                      </td>

                      {/* Phone & Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${sub.phone}`}
                            className="font-mono text-neutral-800 hover:text-primary-600 font-bold"
                            dir="ltr"
                          >
                            {sub.phone}
                          </a>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-[11px] transition-colors"
                            title="שלח וואטסאפ מהיר"
                          >
                            <i className="fab fa-whatsapp"></i>
                          </a>
                        </div>
                      </td>

                      {/* Topic / Message */}
                      <td className="px-6 py-4 max-w-xs text-neutral-600">
                        <span className="line-clamp-2" title={sub.topic_or_message}>
                          {sub.topic_or_message || "—"}
                        </span>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={sub.status}
                          onChange={(e) => handleStatusChange(sub.id, e.target.value as any)}
                          className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer focus:outline-none ${
                            sub.status === "new"
                              ? "bg-primary-50 text-primary-800 border-primary-200"
                              : sub.status === "in_progress"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : sub.status === "done"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          <option value="new">חדשה</option>
                          <option value="in_progress">בטיפול</option>
                          <option value="done">טופלה</option>
                          <option value="trash">סל מיחזור</option>
                        </select>
                      </td>

                      {/* Notes Button / Display */}
                      <td className="px-6 py-4 max-w-xs">
                        {sub.notes ? (
                          <button
                            onClick={() => {
                              setEditingNoteItem(sub);
                              setNoteText(sub.notes || "");
                            }}
                            className="text-right text-neutral-600 hover:text-neutral-900 group flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="truncate max-w-[140px] text-[11px]">{sub.notes}</span>
                            <i className="fas fa-pen text-[9px] text-neutral-400 group-hover:text-neutral-700"></i>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingNoteItem(sub);
                              setNoteText("");
                            }}
                            className="text-[11px] text-neutral-400 hover:text-neutral-700 flex items-center gap-1 cursor-pointer font-bold"
                          >
                            <i className="fas fa-plus text-[9px]"></i>
                            <span>הוסף הערה</span>
                          </button>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-400 text-[11px]">
                        {new Date(sub.created_at).toLocaleDateString("he-IL", {
                          day: "numeric",
                          month: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sub.status === "trash" ? (
                          <button
                            onClick={() => handleStatusChange(sub.id, "new")}
                            className="text-emerald-600 hover:text-emerald-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                            title="שחזר מסל המיחזור"
                          >
                            <i className="fas fa-rotate-left"></i>
                            <span>שחזר</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(sub.id, "trash")}
                            className="text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="העבר לסל מיחזור"
                          >
                            <i className="fas fa-trash-can text-xs"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Internal Notes Modal */}
      {editingNoteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-950/50 backdrop-blur-xs"
            onClick={() => setEditingNoteItem(null)}
          ></div>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl border border-neutral-200">
            <h3 className="font-heading font-black text-lg text-neutral-950 mb-1">
              הערות פנימיות עבור {editingNoteItem.name}
            </h3>
            <p className="text-xs text-neutral-500 mb-4 font-medium">
              הערות אלו גלויות רק למנהלים ולעורכים במערכת
            </p>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="כתוב הערה (למשל: תואמה שיחה ליום ראשון בשעה 20:00)..."
              className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl p-3.5 text-xs text-neutral-900 focus:outline-none mb-4 resize-none"
            ></textarea>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingNoteItem(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-bold hover:bg-neutral-50"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={savingNote}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingNote ? "שומר..." : "שמירת הערה"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
