"use client";
import { useState, useId } from "react";

// Web3Forms access key (get/manage at https://web3forms.com). Can be overridden via env var.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b556ba1-7101-43c0-b8d2-890c4226ec11";
// Fallback channel so a lead is never lost if the form service fails.
const WHATSAPP_NUMBER = "972585986685";

export default function JoinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fallbackLead, setFallbackLead] = useState<{ name: string; phone: string; topic: string } | null>(null);
  
  const formId = useId();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const topic = String(formData.get("topic") || "").trim();

    // FormData (multipart) is a "simple" CORS request – no preflight, as recommended by Web3Forms.
    const payload = new FormData();
    payload.append("access_key", WEB3FORMS_KEY);
    payload.append("name", name);
    payload.append("phone", phone);
    if (topic) payload.append("נושא לימוד מועדף", topic);
    payload.append("subject", "פנייה חדשה מאתר תורה לנשמה");
    payload.append("from_name", "אתר תורה לנשמה");

    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: payload });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setIsModalOpen(true);
        form.reset();
      } else {
        console.error("Form submission failed", data);
        setFallbackLead({ name, phone, topic });
      }
    } catch (error) {
      console.error(error);
      setFallbackLead({ name, phone, topic });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappHref = fallbackLead
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `שלום, אשמח להצטרף לחברותא בתורה לנשמה 🙏\nשם: ${fallbackLead.name}\nטלפון: ${fallbackLead.phone}${
          fallbackLead.topic ? `\nנושא מועדף: ${fallbackLead.topic}` : ""
        }`
      )}`
    : "";

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 w-full max-w-sm mx-auto my-auto py-4" aria-busy={isSubmitting}>
        <div className="text-center mb-2">
          <h4 className="font-heading font-black text-2xl text-ink-900 mb-1">מלאו פרטים</h4>
          <p className="text-ink-500 font-medium">ונחזור אליכם בהקדם האפשרי</p>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-ink-400 group-focus-within:text-primary-500 transition-colors">
            <i className="fas fa-user text-lg"></i>
          </div>
          <input id={`${formId}-name`} type="text" name="name" placeholder="שם מלא" required className="w-full bg-ink-50/50 focus:bg-white border-2 border-transparent focus:border-primary-400 rounded-2xl pr-14 pl-4 py-4 text-ink-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm placeholder:font-normal placeholder:text-ink-400" />
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-ink-400 group-focus-within:text-primary-500 transition-colors">
            <i className="fas fa-phone text-lg"></i>
          </div>
          <input id={`${formId}-phone`} type="tel" name="phone" placeholder="מספר טלפון" required className="w-full bg-ink-50/50 focus:bg-white border-2 border-transparent focus:border-primary-400 rounded-2xl pr-14 pl-4 py-4 text-ink-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm placeholder:font-normal placeholder:text-ink-400 text-right" dir="ltr" />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-ink-400 group-focus-within:text-primary-500 transition-colors">
            <i className="fas fa-book-open text-lg"></i>
          </div>
          <select id={`${formId}-topic`} name="topic" defaultValue="" className="w-full bg-ink-50/50 focus:bg-white border-2 border-transparent focus:border-primary-400 rounded-2xl pr-14 pl-10 py-4 text-ink-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm appearance-none cursor-pointer">
            <option value="" disabled>נושא לימוד מועדף (לא חובה)</option>
            <option value="פרשת שבוע">פרשת שבוע</option>
            <option value="גמרא / תלמוד">גמרא / תלמוד</option>
            <option value="הלכה ומשפט עברי">הלכה ומשפט עברי</option>
            <option value="אמונה, מוסר ומידות">אמונה, מוסר ומידות</option>
            <option value="עדיין לא בטוח, אשמח לייעוץ">עדיין לא בטוח, אשמח לייעוץ</option>
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-ink-400">
            <i className="fas fa-chevron-down text-sm"></i>
          </div>
        </div>
        
        <button type="submit" disabled={isSubmitting} aria-label="שליחת טופס" className="w-full mt-2 bg-gradient-to-l from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-4 rounded-2xl font-black text-xl transition-all shadow-xl shadow-primary-600/30 hover:shadow-primary-600/50 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
          {isSubmitting ? <i aria-hidden="true" className="fas fa-circle-notch fa-spin text-2xl"></i> : (
            <>
              <span>הצטרפות מהירה</span>
              <i className="fas fa-arrow-left opacity-90"></i>
            </>
          )}
        </button>
      </form>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-label="אישור קבלת פרטים" className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] p-10 md:p-12 max-w-md w-full relative z-10 shadow-elevated text-center transition-all duration-300 border border-ink-100">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-7 shadow-lg shadow-emerald-500/30">
              <i aria-hidden="true" className="fas fa-check"></i>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-ink-900 mb-3">תודה רבה!</h3>
            <p className="text-ink-600 text-base md:text-lg mb-8 leading-relaxed font-medium">הפרטים שלך התקבלו בהצלחה. נציג מצוות תורה לנשמה ייצור איתך קשר בהקדם.</p>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-ink-50 text-ink-700 border-2 border-ink-100 py-4 rounded-2xl font-bold text-lg hover:bg-ink-100 hover:border-ink-200 transition-all">סגירה וחזרה</button>
          </div>
        </div>
      )}

      {fallbackLead && (
        <div role="dialog" aria-modal="true" aria-label="השלמת ההרשמה בוואטסאפ" className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setFallbackLead(null)}></div>
          <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-md w-full relative z-10 shadow-elevated text-center border border-ink-100">
            <div className="w-20 h-20 bg-[#25D366] text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              <i aria-hidden="true" className="fab fa-whatsapp"></i>
            </div>
            <h3 className="font-heading text-2xl font-black text-ink-900 mb-3">עוד צעד קטן!</h3>
            <p className="text-ink-600 text-base mb-7 leading-relaxed font-medium">
              לא הצלחנו לשלוח את הטופס כרגע. בלחיצה אחת הפרטים שלך יישלחו אלינו בוואטסאפ – ונחזור אליך בהקדם.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setFallbackLead(null)}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-md"
            >
              <i aria-hidden="true" className="fab fa-whatsapp text-xl"></i>
              שליחת הפרטים בוואטסאפ
            </a>
            <button onClick={() => setFallbackLead(null)} className="mt-3 w-full text-ink-500 hover:text-ink-700 py-2 font-semibold transition-colors">
              ביטול
            </button>
          </div>
        </div>
      )}
    </>
  );
}
