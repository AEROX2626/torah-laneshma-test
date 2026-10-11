"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b556ba1-7101-43c0-b8d2-890c4226ec11";
const WHATSAPP_NUMBER = "972503938114";

export default function AdoptPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fallbackLead, setFallbackLead] = useState<{ name: string; phone: string; message?: string } | null>(null);

  useEffect(() => {
    // Intersection Observer for Reveal
    const revealEls = document.querySelectorAll(".reveal, .reveal-scale");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const payload = new FormData();
    payload.append("access_key", WEB3FORMS_KEY);
    payload.append("Name", name);
    payload.append("Phone", phone);
    if (message) payload.append("Message", message);
    payload.append("kind", "adopt");
    payload.append("subject", "פנייה חדשה מאתר תורה לנשמה - עמוד אמץ אברך");
    payload.append("from_name", "אתר תורה לנשמה - אמץ אברך");

    try {
      const res = await fetch("/api/submit", { method: "POST", body: payload });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setIsModalOpen(true);
        form.reset();
      } else {
        console.error("Form submission failed", data);
        setFallbackLead({ name, phone, message });
      }
    } catch (error) {
      console.error(error);
      setFallbackLead({ name, phone, message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappHref = fallbackLead
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `שלום, אשמח לשמוע פרטים על מסלול אמץ אברך 🙏\nשם: ${fallbackLead.name}\nטלפון: ${fallbackLead.phone}${
          fallbackLead.message ? `\nהודעה: ${fallbackLead.message}` : ""
        }`
      )}`
    : "";

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] right-[-200px] w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(184,221,253,0.3)_0%,_transparent_60%)] animate-float"></div>
        <div className="absolute top-[30%] left-[-200px] w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(254,215,170,0.25)_0%,_transparent_60%)] animate-float-slow" style={{ animationDelay: "-4s" }}></div>
      </div>

      <Navbar />

      <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-bold text-sm mb-7 shadow-soft reveal">
                <i className="fas fa-hand-holding-heart text-rose-700"></i>
                <span>שותפות נצחית בלימוד התורה</span>
              </div>

              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-[4rem] text-ink-950 leading-[1.1] mb-7 reveal" style={{ transitionDelay: "0.1s" }}>
                אמץ אברך:<br />
                <span className="text-gradient">זכות של חיבור עמוק</span>
              </h1>

              <p className="text-lg lg:text-xl text-ink-600 mb-9 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium reveal" style={{ transitionDelay: "0.2s" }}>
                בימים אלו, אנו זקוקים יותר מתמיד לזכויות ולשמירה על עם ישראל. קחו חלק במיזם מרגש המחבר בין לומדי התורה לביניכם, ברוח הסכם יששכר וזבולון, והפכו לשותפים פעילים בלימוד תורה – מכל מקום בעולם.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start reveal" style={{ transitionDelay: "0.3s" }}>
                <Link href="#donate" className="btn-primary px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-3 group shadow-lg shadow-primary-500/30">
                  <span>כן, אני רוצה להיות שותף</span>
                  <i className="fas fa-heart group-hover:scale-125 transition-transform text-white"></i>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative reveal-scale" style={{ transitionDelay: "0.2s" }}>
              <div className="relative">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Westernwall2.jpg/1280px-Westernwall2.jpg"
                    alt="אברכים מתפללים בכותל המערבי"
                    className="rounded-[2.5rem] shadow-2xl img-cover h-[400px] md:h-[500px] w-full border-2 border-white relative z-10"
                  />
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[radial-gradient(circle,_#f59e0b44_0%,_transparent_70%)] opacity-30"></div>
                <div className="absolute -top-6 -left-6 md:-left-8 bg-white p-5 rounded-2xl shadow-elevated flex items-center gap-4 border border-ink-50 z-20">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-rose-500/40">
                    <i className="fas fa-hand-holding-usd"></i>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-extrabold text-ink-900 text-lg">100% ישירות</p>
                    <p className="text-xs text-ink-500 font-bold">ללא דמי תיווך, ישר ללומד</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-6 leading-tight">
              מה עומד מאחורי <span className="text-gradient">ההסכם?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div className="reveal">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <i className="fas fa-scroll"></i>
              </div>
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-900 mb-4">ברית יששכר וזבולון</h3>
              <p className="text-lg text-ink-600 leading-relaxed font-medium mb-6">
                הסכם זה מושרש עמוק במסורת שלנו. יששכר היה יושב ולומד תורה באוהל, בעוד זבולון היה יוצא לעסוק במסחר. ההסכם קובע שזבולון תומך כלכלית ביששכר, ובתמורה, שניהם חולקים שווה בשווה בזכות ובהשפעה הרוחנית של לימוד התורה.
              </p>
              <p className="text-lg text-ink-600 leading-relaxed font-medium">
                היום, אתם יכולים להיות זבולון. השותפות הזו מאפשרת לאברכים (תלמידי חכמים) להמשיך להקדיש את חייהם ללימוד תורה, כאשר הזכות הרוחנית נזקפת גם לזכותכם.
              </p>
            </div>
              <div className="reveal-scale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben.jpg/1280px-Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben.jpg" alt="לימוד תלמוד ותורה" className="rounded-3xl shadow-xl border border-ink-100" />
              </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-ink-50 rounded-3xl p-8 md:p-10 border border-ink-100 reveal group">
              <div className="w-14 h-14 bg-white text-emerald-500 rounded-xl flex items-center justify-center text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="fas fa-seedling"></i>
              </div>
              <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">מעשר כספים שמניב פירות</h3>
              <p className="text-ink-600 leading-relaxed font-medium">
                תרומה ללומדי תורה נחשבת לאחת הצדקות החשובות ביותר בהלכה. זוהי הזדמנות עצומה לקיים את מצוות מעשר הכספים, שהובטח עליה כי היא פותחת שערי שפע, ברכה והצלחה בפרנסה.
              </p>
            </div>

            <div className="bg-ink-50 rounded-3xl p-8 md:p-10 border border-ink-100 reveal group" style={{ transitionDelay: "0.1s" }}>
              <div className="w-14 h-14 bg-white text-primary-500 rounded-xl flex items-center justify-center text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="fas fa-home"></i>
              </div>
              <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">תמיכה במשפחות נזקקות</h3>
              <p className="text-ink-600 leading-relaxed font-medium">
                מעבר לזכות הרוחנית, התרומה מסייעת ישירות למשפחות של לומדי תורה שמתמודדות עם אתגרים כלכליים, ומעניקה להם אוויר לנשימה ואפשרות להתקיים בכבוד.
              </p>
            </div>

            <div className="bg-ink-50 rounded-3xl p-8 md:p-10 border border-ink-100 reveal group" style={{ transitionDelay: "0.2s" }}>
              <div className="w-14 h-14 bg-white text-accent-500 rounded-xl flex items-center justify-center text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">100% נטו לשם שמיים</h3>
              <p className="text-ink-600 leading-relaxed font-medium">
                אצלנו אין הוצאות תקורה או עמלות תיווך. כל שקל שתתרמו מגיע בשלמותו ישירות לידיו של האברך. אתם שותפים ישירים ללא שום מתווכים בדרך.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Form Section */}
      <section id="donate" className="py-20 md:py-28 relative bg-gradient-to-b from-white via-amber-50/50 to-primary-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10 text-center">
          <div className="reveal">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-amber-100 text-amber-500 text-2xl mb-6">
              <i className="fas fa-handshake"></i>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-5xl mb-5 text-ink-950 leading-tight">לקבלת פרטים והצטרפות למיזם</h2>
            <p className="text-lg md:text-xl text-ink-600 font-medium mb-12 max-w-2xl mx-auto">
              השאירו פרטים ונציג מטעמנו ייצור עמכם קשר בהקדם כדי להסביר על מסלולי התרומה והשותפות, ולענות לכם על כל שאלה באהבה.
            </p>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-elevated text-ink-900 border border-white max-w-2xl mx-auto text-right relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-primary-500 to-amber-400"></div>
              
              <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10" aria-busy={isSubmitting}>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="donate-name">שם מלא</label>
                  <input type="text" id="donate-name" name="name" required className="w-full input-modern p-4 rounded-2xl font-medium text-base border-ink-200 bg-ink-50 focus:bg-white transition-colors" placeholder="הכנס/י את שמך" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="donate-phone">מספר טלפון ליצירת קשר</label>
                  <input type="tel" id="donate-phone" name="phone" required pattern="[0-9]{9,10}" className="w-full input-modern p-4 rounded-2xl text-right font-medium text-base border-ink-200 bg-ink-50 focus:bg-white transition-colors" dir="ltr" placeholder="050-0000000" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="donate-msg">הודעה (רשות)</label>
                  <textarea id="donate-msg" name="message" rows={3} className="w-full input-modern p-4 rounded-2xl font-medium text-base resize-none border-ink-200 bg-ink-50 focus:bg-white transition-colors" placeholder="רצית להוסיף משהו?"></textarea>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-l from-primary-500 to-primary-600 text-white py-4 md:py-5 rounded-2xl font-extrabold text-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
                  {isSubmitting ? <i aria-hidden="true" className="fas fa-circle-notch fa-spin"></i> : "שליחת פנייה"}
                </button>
                <p className="text-center text-sm text-ink-500 font-medium mt-5">
                  <i className="fas fa-shield-alt mr-1.5 opacity-70"></i> הפרטים יישמרו בסודיות מלאה ולא יועברו לגורם שלישי
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {isModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] p-10 md:p-12 max-w-md w-full relative z-10 shadow-elevated text-center border border-ink-100">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-7 shadow-lg shadow-emerald-500/30">
              <i aria-hidden="true" className="fas fa-check"></i>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-ink-900 mb-3">תודה רבה!</h3>
            <p className="text-ink-600 text-base md:text-lg mb-8 leading-relaxed font-medium">
              הפרטים שלך התקבלו בהצלחה. נציג תורה לנשמה ייצור איתך קשר בהקדם.
            </p>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-ink-50 text-ink-700 border-2 border-ink-100 py-4 rounded-2xl font-bold text-lg hover:bg-ink-100 hover:border-ink-200 transition-all">סגירה</button>
          </div>
        </div>
      )}

      {/* Fallback WhatsApp Modal */}
      {fallbackLead && (
        <div role="dialog" aria-modal="true" aria-label="השלמת הפנייה בוואטסאפ" className="fixed inset-0 z-[100] flex items-center justify-center px-4">
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
            <button onClick={() => setFallbackLead(null)} className="mt-4 w-full text-ink-500 hover:text-ink-700 py-2 font-semibold transition-colors">
              ביטול
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
