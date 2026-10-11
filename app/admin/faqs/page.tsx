"use client";

import { useState, useEffect } from "react";
import { FaqItem } from "@/lib/db";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showTrash, setShowTrash] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; undoId?: string } | null>(null);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/faqs?trash=${showTrash}`);
      const data = await res.json();
      if (data.items) {
        setFaqs(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, [showTrash]);

  const categories = ["הכל", "כללי", "לימוד", "התנדבות"];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || selectedCategory === "הכל" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq?.question || !editingFaq?.answer) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFaq),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        setEditingFaq(null);
        await loadFaqs();
        showToast("השאלה נשמרה בהצלחה!");
      }
    } catch {
      showToast("אירעה שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToTrash = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}&action=trash`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await loadFaqs();
        showToast("השאלה הועברה לסל המיחזור", id);
      }
    } catch {
      showToast("שגיאה במחיקה");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}&action=restore`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await loadFaqs();
        showToast("השאלה שוחזרה בהצלחה");
      }
    } catch {
      showToast("שגיאה בשחזור");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("האם למחוק שאלה זו לצמיתות? לא ניתן יהיה לשחזר אותה.")) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}&action=permanent`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await loadFaqs();
        showToast("השאלה נמחקה לצמיתות");
      }
    } catch {
      showToast("שגיאה במחיקה");
    }
  };

  const handleOrderChange = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= filteredFaqs.length) return;

    const newFaqs = [...filteredFaqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIdx];
    newFaqs[targetIdx] = temp;

    // Update orders
    const payload = newFaqs.map((f, i) => ({ id: f.id, display_order: i + 1 }));
    setFaqs(newFaqs);

    await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", items: payload }),
    });
  };

  const showToast = (message: string, undoId?: string) => {
    setToast({ message, undoId });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-neutral-950">ניהול שאלות ותשובות (FAQ)</h1>
          <p className="text-xs md:text-sm text-neutral-500 font-medium">
            עריכה, הוספה וסידור שאלות המוצגות באקורדיון בעמוד הבית
          </p>
        </div>

        <button
          onClick={() =>
            setEditingFaq({
              question: "",
              answer: "",
              category: "כללי",
              display_order: faqs.length + 1,
              is_published: true,
            })
          }
          className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fas fa-plus text-xs"></i>
          <span>הוספת שאלה חדשה</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-neutral-400">
              <i className="fas fa-search text-xs"></i>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש שאלה או תשובה..."
              className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-xl pr-9 pl-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none transition-all"
            />
          </div>

          {/* Categories Segmented */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat || (cat === "הכל" && selectedCategory === "all")
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Trash Toggle */}
        <div className="flex items-center gap-3 border-r border-neutral-100 pr-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-600 select-none">
            <input
              type="checkbox"
              checked={showTrash}
              onChange={(e) => setShowTrash(e.target.checked)}
              className="rounded text-neutral-900 focus:ring-0 cursor-pointer"
            />
            <i className={`fas fa-trash-can ${showTrash ? "text-rose-600" : "text-neutral-400"}`}></i>
            <span>סל המיחזור</span>
          </label>
        </div>
      </div>

      {/* FAQ Items Grid */}
      {loading ? (
        <div className="p-16 text-center text-neutral-400 font-bold">
          <i className="fas fa-circle-notch fa-spin text-2xl mb-3 block text-neutral-300"></i>
          טוען שאלות ותשובות...
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center text-2xl mx-auto">
            <i className="fas fa-circle-question"></i>
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-neutral-900">
              {showTrash ? "סל המיחזור ריק" : "לא נמצאו שאלות ותשובות"}
            </h3>
            <p className="text-xs text-neutral-500 font-medium max-w-sm mx-auto mt-1">
              {showTrash
                ? "שאלות שיועברו למחיקה יופיעו כאן וניתן יהיה לשחזר אותן."
                : "לחץ על כפתור ההוספה כדי ליצור שאלה ראשונה שתופיע באתר."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Order and info */}
              <div className="flex items-start md:items-center gap-4 flex-1">
                {/* Order arrows */}
                {!showTrash && (
                  <div className="flex flex-col gap-1 items-center shrink-0">
                    <button
                      onClick={() => handleOrderChange(index, "up")}
                      disabled={index === 0}
                      className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed text-[10px] flex items-center justify-center text-neutral-600 transition-colors"
                      title="הזז למעלה"
                    >
                      <i className="fas fa-chevron-up"></i>
                    </button>
                    <span className="text-[10px] font-bold text-neutral-400">{faq.display_order}</span>
                    <button
                      onClick={() => handleOrderChange(index, "down")}
                      disabled={index === filteredFaqs.length - 1}
                      className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed text-[10px] flex items-center justify-center text-neutral-600 transition-colors"
                      title="הזז למטה"
                    >
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </div>
                )}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700">
                      {faq.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        faq.is_deleted
                          ? "bg-rose-50 text-rose-700"
                          : faq.is_published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {faq.is_deleted ? "בסל המיחזור" : faq.is_published ? "מוצג באתר" : "טיוטה מוסתרת"}
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-sm md:text-base text-neutral-900">{faq.question}</h4>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{faq.answer}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
                {showTrash ? (
                  <>
                    <button
                      onClick={() => handleRestore(faq.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-rotate-left"></i>
                      <span>שחזר</span>
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(faq.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-trash"></i>
                      <span>מחק לצמיתות</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingFaq(faq)}
                      className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-pen text-[10px]"></i>
                      <span>עריכה</span>
                    </button>
                    <button
                      onClick={() => handleMoveToTrash(faq.id)}
                      className="w-8 h-8 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
                      title="העבר לסל המיחזור"
                    >
                      <i className="fas fa-trash-can"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Drawer / Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-xs" onClick={() => setEditingFaq(null)}></div>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full relative z-10 shadow-2xl border border-neutral-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
              <h3 className="font-heading font-black text-xl text-neutral-950">
                {editingFaq.id ? "עריכת שאלה ותשובה" : "הוספת שאלה חדשה"}
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs"
              >
                <i className="fas fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Question */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">נוסח השאלה</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="לדוגמה: האם החברותא כרוכה בתשלום?"
                  className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl px-4 py-3 text-sm font-bold text-neutral-900 focus:outline-none transition-all"
                />
              </div>

              {/* Answer (Rich Text area) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-700">התשובה המלאה</label>
                  <span className="text-[10px] text-neutral-400 font-semibold">ניתן להוסיף קישורים ופירוט</span>
                </div>
                <textarea
                  rows={5}
                  required
                  value={editingFaq.answer || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="הסבר את התשובה בצורה ברורה ונעימה..."
                  className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-2xl p-4 text-sm font-medium text-neutral-800 focus:outline-none transition-all resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* Category Segmented */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">קטגוריה</label>
                <div className="grid grid-cols-3 gap-2">
                  {["כללי", "לימוד", "התנדבות"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditingFaq({ ...editingFaq, category: cat })}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        editingFaq.category === cat
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Stepper */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">סדר הצגה באקורדיון</label>
                <div className="inline-flex items-center gap-3 bg-neutral-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingFaq({ ...editingFaq, display_order: Math.max(1, (editingFaq.display_order || 1) - 1) })
                    }
                    className="w-8 h-8 rounded-xl bg-white text-neutral-700 font-bold shadow-xs hover:bg-neutral-50 flex items-center justify-center"
                  >
                    <i className="fas fa-minus text-xs"></i>
                  </button>
                  <span className="font-heading font-black text-sm text-neutral-900 w-8 text-center">
                    {editingFaq.display_order || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingFaq({ ...editingFaq, display_order: (editingFaq.display_order || 1) + 1 })
                    }
                    className="w-8 h-8 rounded-xl bg-white text-neutral-700 font-bold shadow-xs hover:bg-neutral-50 flex items-center justify-center"
                  >
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Published Switch */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div>
                  <span className="block text-xs font-bold text-neutral-900">סטטוס פרסום (מוצג באתר)</span>
                  <span className="text-[10px] text-neutral-500">האם השאלה תוצג לגולשים באתר הציבורי</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingFaq({ ...editingFaq, is_published: !editingFaq.is_published })}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 relative ${
                    editingFaq.is_published ? "bg-emerald-500" : "bg-neutral-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      editingFaq.is_published ? "-translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-xs hover:bg-neutral-50"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      <span>שומר...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <i className="fas fa-check text-emerald-400"></i>
                      <span>נשמר!</span>
                    </>
                  ) : (
                    <span>שמירת שאלה</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification with Undo */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span>{toast.message}</span>
          {toast.undoId && (
            <button
              onClick={() => {
                if (toast.undoId) handleRestore(toast.undoId);
                setToast(null);
              }}
              className="text-primary-400 hover:text-primary-300 underline font-black mr-2 cursor-pointer"
            >
              בטל
            </button>
          )}
        </div>
      )}
    </div>
  );
}
