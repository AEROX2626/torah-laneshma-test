"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function AdoptPage() {
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

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob bg-primary-200 w-[600px] h-[600px] rounded-full top-[-200px] right-[-200px] animate-float"></div>
        <div className="blob bg-accent-100 w-[500px] h-[500px] rounded-full top-[30%] left-[-200px] animate-float-slow" style={{ animationDelay: "-4s" }}></div>
      </div>

      <Navbar />

      <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-bold text-sm mb-7 shadow-soft reveal">
                <i className="fas fa-hand-holding-heart text-rose-500"></i>
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
                  src="https://image.pollinations.ai/prompt/Jewish%20man%20praying%20at%20the%20Western%20Wall%20Jerusalem%20back%20view%20tallit%20realistic%20photography?width=1000&height=800&nologo=true"
                  alt="תפילה בכותל המערבי בירושלים"
                  className="rounded-[2.5rem] shadow-2xl img-cover h-[400px] md:h-[500px] w-full border-2 border-white relative z-10"
                />
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>
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
              <img src="https://image.pollinations.ai/prompt/Ancient%20Torah%20scroll%20on%20a%20wooden%20desk%20with%20Jerusalem%20window%20view%20light%20rays%20realistic%20photography?width=800&height=800&nologo=true" alt="ספר תורה ונוף ירושלים" className="rounded-3xl shadow-xl border border-ink-100" />
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

      <section id="donate" className="py-20 md:py-28 relative bg-gradient-to-br from-primary-800 to-ink-950 overflow-hidden text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0yMCAyMGMtNS41IDAtMTAtNC41LTEwLTEwUzE0LjUgMTAgMjAgMTBzMTAgNC41IDEwIDEwLTQuNSAxMC0xMCAxMHoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        
        <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10 text-center">
          <div className="reveal">
            <h2 className="font-heading font-black text-3xl md:text-5xl mb-6 leading-tight">לקבלת פרטים והצטרפות למיזם</h2>
            <p className="text-lg md:text-xl text-primary-100 font-medium mb-12 max-w-2xl mx-auto">
              השאירו פרטים ונציג מטעמנו יצור עמכם קשר בהקדם כדי להסביר על מסלולי התרומה והשותפות.
            </p>
            
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-ink-900 border border-white/20 max-w-2xl mx-auto text-right">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="donate-name">שם מלא</label>
                  <input type="text" id="donate-name" required className="w-full input-modern p-4 rounded-2xl font-medium text-base border-ink-200 bg-ink-50 focus:bg-white" placeholder="הכנס/י את שמך" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="donate-phone">מספר טלפון ליצירת קשר</label>
                  <input type="tel" id="donate-phone" required pattern="[0-9]{9,10}" className="w-full input-modern p-4 rounded-2xl text-left font-medium text-base border-ink-200 bg-ink-50 focus:bg-white" dir="ltr" placeholder="050-0000000" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="donate-msg">הודעה (רשות)</label>
                  <textarea id="donate-msg" rows={3} className="w-full input-modern p-4 rounded-2xl font-medium text-base resize-none border-ink-200 bg-ink-50 focus:bg-white" placeholder="רצית להוסיף משהו?"></textarea>
                </div>
                
                <button type="submit" className="w-full bg-gradient-to-l from-primary-500 to-primary-600 text-white py-5 rounded-2xl font-extrabold text-xl shadow-lg shadow-primary-500/40 hover:shadow-primary-500/60 hover:-translate-y-1 transition-all duration-300">
                  שלח פנייה עכשיו
                </button>
                <p className="text-center text-sm text-ink-400 font-medium mt-4">
                  <i className="fas fa-lock mr-1"></i> הפרטים יישמרו בסודיות מלאה ולא יועברו לאיש
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
