"use client";
import { useState } from "react";

export default function JoinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "bf5fc6bd-58b9-4a0f-ba00-721245781a7a",
          name: formData.get("name"),
          phone: formData.get("phone"),
          subject: "פנייה חדשה מאתר תורה לנשמה",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitting(false);
        setIsModalOpen(true);
        form.reset();
      } else {
        console.error("Form submission failed", data);
        alert("אירעה שגיאה בשליחת הטופס. אנא נסה שוב.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("שגיאת תקשורת. אנא נסה שוב מאוחר יותר.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
        <input type="text" name="name" placeholder="שם מלא" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm" />
        <input type="tel" name="phone" placeholder="מספר טלפון" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm text-right" dir="ltr" />
        <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-3.5 rounded-xl font-bold whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
          {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : "שליחה מהירה"}
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] p-10 md:p-12 max-w-md w-full relative z-10 shadow-elevated text-center transition-all duration-300 border border-ink-100">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-7 shadow-lg shadow-emerald-500/30">
              <i className="fas fa-check"></i>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-ink-900 mb-3">תודה רבה!</h3>
            <p className="text-ink-600 text-base md:text-lg mb-8 leading-relaxed font-medium">הפרטים שלך התקבלו בהצלחה. נציג מצוות תורה לנשמה ייצור איתך קשר בהקדם.</p>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-ink-50 text-ink-700 border-2 border-ink-100 py-4 rounded-2xl font-bold text-lg hover:bg-ink-100 hover:border-ink-200 transition-all">סגירה וחזרה</button>
          </div>
        </div>
      )}
    </>
  );
}
