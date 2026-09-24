"use client";
import Link from "next/link";
import Image from "next/image";
import { articles } from "./articles/data";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import DailyInspiration from "./components/DailyInspiration";
import Footer from "./components/Footer";
import ShabbatTimes from "./components/ShabbatTimes";
import HebrewDate from "./components/HebrewDate";

export default function Home() {

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Counters
  const [counters, setCounters] = useState({
    learners: 0,
    hours: 0,
    volunteers: 0,
  });

  useEffect(() => {
    // Scroll Progress
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const el = document.getElementById("scroll-progress");
      if (el) el.style.width = `${(scrollTop / docHeight) * 100}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Intersection Observer for Reveal
    const els = document.querySelectorAll(".reveal, .reveal-scale");
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
   els.forEach((el) => observer.observe(el));

    // Intersection Observer for Counters
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const start = performance.now();
            const duration = 1800;
            const animate = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              
              setCounters({
                learners: Math.floor(eased * 2500),
                hours: Math.floor(eased * 80),
                volunteers: Math.floor(eased * 340),
              });

              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    
    const statsSection = document.getElementById("stats-section");
    if (statsSection) counterObserver.observe(statsSection);

    // 3D Tilt for hover devices
    if (window.matchMedia("(hover: hover)").matches) {
      document.querySelectorAll<HTMLElement>(".card-hover").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
          card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
          card.style.transformStyle = "preserve-3d";
          card.style.perspective = "1000px";
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Add Web3Forms access key
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b556ba1-7101-43c0-b8d2-890c4226ec11");
    formData.append("subject", "ליד חדש מהאתר - בקשה לחברותא!");
    formData.append("from_name", "תורה לנשמה");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      
      if (data.success) {
        setIsSubmitting(false);
        setIsModalOpen(true);
        form.reset();
      } else {
        console.error("Form submission failed", data);
        alert("����� ����� ������ �����. ��� ��� �� ��� ����� ��������.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("����� �����. ���� �� ������ �������� ���� ���.");
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const target = document.querySelector(hash);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <div id="scroll-progress" style={{ width: `0%` }}></div>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob bg-primary-200 w-[600px] h-[600px] rounded-full top-[-200px] right-[-200px] animate-float"></div>
        <div className="blob bg-accent-100 w-[500px] h-[500px] rounded-full top-[30%] left-[-200px] animate-float-slow" style={{ animationDelay: "-4s" }}></div>
        <div className="blob bg-primary-100 w-[450px] h-[450px] rounded-full bottom-[-100px] right-[10%] animate-float" style={{ animationDelay: "-8s" }}></div>
      </div>

      <Navbar />

      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            <div className="lg:col-span-6 text-center lg:text-right">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-7 relative z-50">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-bold text-sm shadow-soft">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                  </span>
                  <span>שעה בשבוע שמטעינה את הנשמה</span>
                </div>
                <ShabbatTimes />
                <HebrewDate />
              </div>

              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-[4.2rem] text-ink-950 leading-[1.05] mb-7" style={{ transitionDelay: "0.1s" }}>
                להתחבר למסורת,<br />
                <span className="text-gradient">בקצב המדויק שלכם.</span>
              </h1>

              <p className="text-lg lg:text-xl text-ink-600 mb-9 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium" style={{ transitionDelay: "0.2s" }}>
                סקרנים לגבי המסורת היהודית אבל השגרה העמוסה לא משאירה לכם רגע פנוי? <strong className="text-ink-800">'תורה לנשמה'</strong> מזמינה אתכם לחברותא טלפונית: שעת איכות שבועית של לימוד משותף ושיח פתוח, מכל מקום ובזמן שהכי נוח לכם.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8" style={{ transitionDelay: "0.3s" }}>
                <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="btn-primary px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-3 group">
                  <span>מצאו לי חברותא</span>
                  <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                </a>
                <a href="#how" onClick={(e) => scrollToSection(e, "#how")} className="btn-outline px-8 py-4 rounded-2xl font-bold text-ink-700 bg-white inline-flex items-center justify-center gap-2">
                  <i className="fas fa-play-circle text-primary-500"></i>
                  איך זה עובד?
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-ink-500 font-semibold" style={{ transitionDelay: "0.4s" }}>
                <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> 100% בחינם</div>
                <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> ללא שום התחייבות</div>
                <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> התאמה אישית מדויקת</div>
              </div>
            </div>

            <div className="lg:col-span-6 relative" style={{ transitionDelay: "0.2s" }}>
              <div className="hero-frame relative">
                <div className="relative w-full h-[420px] md:h-[560px] rounded-[2.5rem] shadow-elevated border border-white overflow-hidden"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Westernwall2.jpg/1280px-Westernwall2.jpg" alt="הכותל המערבי – ירושלים" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" /></div>
                <div className="absolute -bottom-5 -left-5 md:-left-8 bg-white p-4 md:p-5 rounded-2xl shadow-elevated flex items-center gap-4 border border-ink-50">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-primary-500/40">
                    <i className="fas fa-phone-volume"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] md:text-xs text-ink-400 font-bold uppercase tracking-wider">נגיש מכל מקום</p>
                    <p className="font-heading font-extrabold text-ink-900 text-base md:text-lg">רק שיחת טלפון</p>
                  </div>
                </div>

                <div className="absolute top-6 -right-3 md:-right-6 bg-white px-4 py-3 rounded-2xl shadow-elevated flex items-center gap-3 border border-ink-50">
                  <div className="flex -space-x-2 space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">ר</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">י</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">ד</div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-extrabold text-ink-900 text-sm">+2,500</p>
                    <p className="text-[10px] text-ink-400 font-bold">לומדים פעילים</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28 border-y border-ink-100 bg-white/60 backdrop-blur">
          <div className="marquee-container py-6">
            <div className="flex gap-16 animate-marquee whitespace-nowrap items-center">
              <div className="flex gap-16 items-center">
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-star text-amber-400"></i> 4.9 שביעות רצון</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-users text-primary-400"></i> +2,500 משתתפים</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-clock text-primary-400"></i> +80,000 שעות לימוד</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-hand-holding-heart text-rose-400"></i> יוזמה התנדבותית</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-shield-alt text-emerald-400"></i> דיסקרטיות מלאה</span>
              </div>
              <div className="flex gap-16 items-center" aria-hidden="true">
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-star text-amber-400"></i> 4.9 שביעות רצון</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-users text-primary-400"></i> +2,500 משתתפים</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-clock text-primary-400"></i> +80,000 שעות לימוד</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-hand-holding-heart text-rose-400"></i> יוזמה התנדבותית</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-shield-alt text-emerald-400"></i> דיסקרטיות מלאה</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DailyInspiration />

      <section id="about" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-xs tracking-widest uppercase mb-4">
              <i className="fas fa-bookmark"></i>
              <span>מהי בעצם "חברותא"?</span>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-6 leading-tight">
              חיבור אנושי אמיתי, <span className="text-gradient">מכל מקום</span>
            </h2>
            <p className="text-lg text-ink-600 font-medium leading-relaxed">
              מיזם "חברותא טלפונית" הוא ארגון התנדבותי שנועד לבנות גשרים בעם ישראל. אנחנו מזמינים אתכם להקדיש שעה אחת בשבוע ללימוד ושיח מכבד ופתוח – בקלות, מכל מקום, ישירות דרך הטלפון הנייד שלכם.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="card-hover bg-white rounded-3xl p-8 md:p-10 border border-ink-100 hover:border-primary-200 reveal group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-7 shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-ink-900 mb-3">שיא הגמישות</h3>
                <p className="text-ink-600 leading-relaxed font-medium">בבית הקפה, ברכבת או בסלון הבית. שעת האיכות שלכם מתקיימת היכן שהכי נוח לכם, מבלי לשבש את סדר היום או להתרוצץ בפקקים.</p>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 md:p-10 border border-ink-100 hover:border-primary-200 reveal group relative overflow-hidden" style={{ transitionDelay: "0.1s" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-7 shadow-lg shadow-accent-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <i className="fas fa-book-reader"></i>
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-ink-900 mb-3">תוכן שנוגע בכם</h3>
                <p className="text-ink-600 leading-relaxed font-medium">השיח מתמקד בדיוק במה שמעניין אתכם – מפרשת השבוע ואקטואליה, דרך פילוסופיה יהודית מורכבת, ועד לשאלות העומק של החיים.</p>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 md:p-10 border border-ink-100 hover:border-primary-200 reveal group relative overflow-hidden" style={{ transitionDelay: "0.2s" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-7 shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-ink-900 mb-3">100% מכל הלב</h3>
                <p className="text-ink-600 leading-relaxed font-medium">המיזם פועל בהתנדבות מלאה וטהורה. החברותא שלכם מקדיש מזמנו האישי באהבה, רק כדי לשתף, ללמוד יחד ולחבר בין העולמות.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stats-section" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="bg-gradient-to-br from-ink-950 to-ink-900 rounded-[2rem] md:rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden noise">
            <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0yMCAyMGMtNS41IDAtMTAtNC41LTEwLTEwUzE0LjUgMTAgMjAgMTBzMTAgNC41IDEwIDEwLTQuNSAxMC0xMCAxMHoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
              <div className="text-center reveal">
                <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">{counters.learners.toLocaleString("he-IL")}</div>
                <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">לומדים פעילים</div>
              </div>
              <div className="text-center reveal" style={{ transitionDelay: "0.1s" }}>
                <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">
                  <span>{counters.hours}</span>K+
                </div>
                <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">שעות של למידה</div>
              </div>
              <div className="text-center reveal" style={{ transitionDelay: "0.2s" }}>
                <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">
                  <span>{counters.volunteers}</span>+
                </div>
                <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">מתנדבים ברחבי הארץ</div>
              </div>
              <div className="text-center reveal" style={{ transitionDelay: "0.3s" }}>
                <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">4.9<span className="text-accent-400 text-3xl">★</span></div>
                <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">דירוג שביעות רצון</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-50 text-accent-700 font-bold text-xs tracking-widest uppercase mb-4">
              <i className="fas fa-route"></i>
              <span>שלושה צעדים פשוטים</span>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-6 leading-tight">
              הדרך שלכם מתחילה <span className="text-gradient">כאן</span>
            </h2>
            <p className="text-lg text-ink-600 font-medium leading-relaxed">
              התהליך הוא קל, מהיר וללא מסמכים מעייפים. בתוך יממה כבר תקבלו התאמה מדויקת לחברותא שתענה בדיוק על הציפיות שלכם.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 right-[16%] left-[16%] h-0.5 bg-gradient-to-l from-primary-200 via-primary-300 to-primary-200"></div>
            
            <div className="relative reveal">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-primary-100 rounded-full blur-2xl opacity-60"></div>
                  <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-primary-100 shadow-elevated">
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-black shadow-lg">1</div>
                    <i className="fas fa-clipboard-list text-4xl text-primary-600"></i>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">מספרים לנו עליכם</h3>
                <p className="text-ink-600 font-medium leading-relaxed max-w-xs mx-auto">ממלאים שאלון קצר בו אתם משתפים אותנו בתחומי העניין שלכם והזמנים שנוחים לכם לשיחה.</p>
              </div>
            </div>

            <div className="relative reveal" style={{ transitionDelay: "0.15s" }}>
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-accent-100 rounded-full blur-2xl opacity-60"></div>
                  <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-accent-100 shadow-elevated">
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-700 rounded-full flex items-center justify-center text-white font-black shadow-lg">2</div>
                    <i className="fas fa-user-check text-4xl text-accent-600"></i>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">חיבור מדויק בשבילכם</h3>
                <p className="text-ink-600 font-medium leading-relaxed max-w-xs mx-auto">הצוות המסור שלנו יוצר עמכם קשר, מבין את הצרכים לעומק, ומתאים לכם את החברותא המושלמת.</p>
              </div>
            </div>

            <div className="relative reveal" style={{ transitionDelay: "0.3s" }}>
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-60"></div>
                  <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-emerald-100 shadow-elevated">
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-black shadow-lg">3</div>
                    <i className="fas fa-phone-alt text-4xl text-emerald-600"></i>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">יוצאים לדרך משותפת</h3>
                <p className="text-ink-600 font-medium leading-relaxed max-w-xs mx-auto">קובעים יחד שעה שבועית קבועה שנוחה לשניכם, ומתחילים במסע מרתק של גילוי, למידה והשראה.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-primary-50 to-white p-8 md:p-10 rounded-[2rem] shadow-soft border border-primary-100 reveal-scale">
            <div className="md:w-5/12 text-center md:text-right">
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">
                שעה בשבוע לעצמכם
              </h3>
              <p className="text-ink-600 font-medium">
                השאירו פרטים ונחבר לכם חברותא טלפונית ללא עלות, ביום ובשעה שהכי נוחים לכם.
              </p>
            </div>
            <div className="md:w-7/12 w-full">
              <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
                <input type="text" name="name" placeholder="שם מלא" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm" />
                <input type="tel" name="phone" placeholder="מספר טלפון" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm text-right" dir="ltr" />
                <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-3.5 rounded-xl font-bold whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
                  {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : "שליחה מהירה"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 relative bg-gradient-to-b from-white to-primary-50/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 font-bold text-xs tracking-widest uppercase mb-4">
              <i className="fas fa-quote-right"></i>
              <span>מה אומרים הלומדים</span>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-6 leading-tight">
              קולות <span className="text-gradient">מהשטח</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal">
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"האמת? הייתי סקפטי רצח בהתחלה. פנו אליי ואמרתי יאללה, ננסה. היום זה פק"ל. החברותא שלי, רב מבני ברק, הפך ממש לפסיכולוג שלי. לומדים פרשת שבוע, מדברים על החיים, העבודה... פשוט שעת ניתוק מהטירוף."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">ע</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">עמרי דהן</div>
                  <div className="text-ink-400 text-xs font-semibold">בן 32, רמת גן</div>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"מה שהכי תפס אותי זה שלא מנסים 'להחזיר' אותך בתשובה. באתי עם המון אנטגוניזם, וגיליתי בן אדם זהב מעבר לקו. אנחנו פותחים תלמוד, מתווכחים כמו פסיכים וצוחקים מלא. מחכה לטלפון הזה כל שבוע."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold">א</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">אלעד כהן</div>
                  <div className="text-ink-400 text-xs font-semibold">בן 41, תל אביב</div>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal md:col-span-2 lg:col-span-1" style={{ transitionDelay: "0.2s" }}>
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"אני עובד בהייטק 12 שעות ביום, כל היום מול מסכים. השעה הזאת של החברותא היא הזמן היחיד בשבוע שאני מדבר עם מישהו לא על קוד. זה חיבור נטו לנשמה. ממליץ בחום לכל גבר שרוצה קצת שקט בראש."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">נ</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">נדב שפירא</div>
                  <div className="text-ink-400 text-xs font-semibold">בן 28, חיפה</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 relative overflow-hidden bg-ink-950 text-white noise selection:bg-white/30 selection:text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0yMCAyMGMtNS41IDAtMTAtNC41LTEwLTEwUzE0LjUgMTAgMjAgMTBzMTAgNC41IDEwIDEwLTQuNSAxMC0xMCAxMHoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative reveal-scale">
              <div className="relative">
                <div className="relative w-full h-[440px] md:h-[520px] rounded-[2rem] shadow-2xl border border-ink-800 overflow-hidden"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Safed1.jpg/1280px-Safed1.jpg" alt="סמטאות ירושלים – מרחב בטוח ופתוח" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" /></div>
                <div className="absolute -bottom-5 -right-5 w-full h-full border-2 border-primary-500/60 rounded-[2rem] -z-10"></div>
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3">
                  <i className="fas fa-shield-halved text-primary-600 text-xl"></i>
                  <div className="text-right">
                    <p className="font-heading font-extrabold text-ink-900 text-sm">מרחב בטוח</p>
                    <p className="text-[10px] text-ink-400 font-bold">100% נטול שיפוטיות</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 reveal">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/20 text-primary-300 font-bold text-xs tracking-widest uppercase mb-6 border border-primary-500/30">
                <i className="fas fa-handshake"></i>
                <span>הערכים שמנחים אותנו</span>
              </div>
              <h2 className="font-heading font-black text-3xl md:text-5xl mb-6 leading-tight">
                שיח פתוח ואמיתי,<br />
                <span className="text-primary-400">בלי אג'נדות נסתרות.</span>
              </h2>
              <p className="text-ink-300 text-lg mb-5 leading-relaxed font-medium">
                הרבה אנשים שואלים את עצמם: "האם החברותא ינסה להחזיר אותי בתשובה?" התשובה שלנו היא ברורה וחד-משמעית: <strong className="text-white">ממש לא.</strong> המטרה היחידה שלנו היא לחבר בין אנשים ולצמצם את הפערים שנוצרו בחברה הישראלית.
              </p>
              <p className="text-ink-300 text-lg mb-9 leading-relaxed font-medium">
                הלומדים והמתנדבים שלנו הם אנשים פתוחים וסקרנים, בדיוק כמוכם, שרוצים ללמוד יחד, לשתף ידע ולייצר שיח מכבד ומועיל – בגובה העיניים.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-9">
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                  <i className="fas fa-check-circle text-emerald-400 text-xl"></i>
                  <span className="text-white font-bold text-sm">נטול אג'נדות</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                  <i className="fas fa-check-circle text-emerald-400 text-xl"></i>
                  <span className="text-white font-bold text-sm">מרחב מכבד</span>
                </div>
              </div>
              <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="inline-flex items-center gap-3 px-8 py-4 bg-white text-ink-900 rounded-full font-bold hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group">
                <span>מעולה, זה מה שחיפשתי</span>
                <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-accent-50 to-white p-8 md:p-10 rounded-[2rem] shadow-soft border border-accent-100 reveal-scale">
            <div className="md:w-5/12 text-center md:text-right">
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">
                חברותא טלפונית בחינם
              </h3>
              <p className="text-ink-600 font-medium">
                שיחה קצרה ופתוחה מתי שנוח לכם. השירות ניתן ללא כל התחייבות, השאירו פרטים ונתחיל.
              </p>
            </div>
            <div className="md:w-7/12 w-full">
              <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
                <input type="text" name="name" placeholder="שם מלא" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all shadow-sm" />
                <input type="tel" name="phone" placeholder="מספר טלפון" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all shadow-sm text-right" dir="ltr" />
                <button type="submit" disabled={isSubmitting} className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3.5 rounded-xl font-bold whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                  {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : "בואו נדבר"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="content" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 reveal">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-xs tracking-widest uppercase mb-4">
                <i className="fas fa-feather-alt"></i>
                <span>עולם של תוכן</span>
              </div>
              <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-4 leading-tight">
                מאמרים, פרשת השבוע <span className="text-gradient">ותורת הנפש</span>
              </h2>
              <p className="text-lg text-ink-600 font-medium leading-relaxed">
                טעימות תוכן שפותחות את הראש והלב, מבוססות על החוכמה היהודית העתיקה והרלוונטיות העמוקה שלה לחיינו כיום.
              </p>
            </div>
            <Link href="/articles" className="btn-outline bg-white px-6 py-3 rounded-2xl font-bold text-ink-700 inline-flex items-center gap-2 whitespace-nowrap">
              צפייה בכל התכנים <i className="fas fa-arrow-left text-xs"></i>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {articles.map((article, index) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
                <div className="h-52 overflow-hidden relative">
                  <Image src={article.image} alt={article.title} fill className="object-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-extrabold text-primary-700 shadow-sm border border-primary-100">
                    {article.category} {article.date && <span className="font-medium text-ink-500 ml-1 mr-1">• {article.date}</span>}
                  </div>
                </div>
                <div className="p-7 flex-grow flex flex-col">
                  <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">{article.title}</h3>
                  <p className="text-ink-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">{article.excerpt}</p>
                  <div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                    <span>המשך לקרוא</span>
                    <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 md:py-28 relative bg-gradient-to-b from-primary-50/30 to-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-xs tracking-widest uppercase mb-4">
              <i className="fas fa-question-circle"></i>
              <span>שאלות נפוצות</span>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-4 leading-tight">
              עדיין נותרו לכם <span className="text-gradient">שאלות?</span>
            </h2>
            <p className="text-lg text-ink-600 font-medium">ריכזנו עבורכם את התשובות לשאלות שעולות הכי הרבה. לא מצאתם? דברו איתנו בוואטסאפ.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "האם החברותא אכן מוצעת בחינם וללא אותיות קטנות?", a: "לחלוטין כן. זהו פרויקט התנדבותי שפועל ללא מטרות רווח וללא עלויות נסתרות. המתנדבים שלנו עושים זאת באהבה, נטו מתוך רצון לבנות גשרים ולחלוק ידע." },
              { q: "יש לכם אג'נדה סמויה להחזיר בתשובה?", a: "ממש לא! המטרה היא לצמצם פערים בחברה הישראלית ולאפשר לימוד משותף. אין אצלנו אג'נדות נסתרות או 'החזרה בתשובה' – אלא רק כבוד הדדי, סקרנות ושיח פתוח." },
              { q: "מה אם אין לי שום ידע מוקדם ביהדות?", a: "מצוין! אין שום צורך בידע מוקדם או הכנה מראש. הלימוד גמיש לחלוטין ומותאם לקצב ולהעדפות שלכם. כל שאלה שתשאלו היא מבורכת, וכל נושא מהווה הזדמנות מרתקת." },
              { q: "איך עובד תהליך החיבור וההתאמה?", a: "בדרך כלל, בתוך 24-48 שעות מאז שהשארתם פנייה, נציג מטעמנו יצלצל אליכם לשיחת היכרות קצרה. נבין מה בדיוק מעניין אתכם ונתאים לכם את החברותא המושלמת. לאחר מכן פשוט תתאמו ביניכם את שעת הלימוד הנוחה." },
              { q: "איך אתם שומרים על הפרטיות שלי?", a: "הפרטיות שלכם היא ערך עליון מבחינתנו. המידע שתמסרו יישמר תחת אבטחה קפדנית ולא יועבר לשום גורם חיצוני. תוכלו גם לסיים את החברותא בכל שלב, בלי שאלות מיותרות." },
              { q: "האם אוכל לבחור את נושא הלימוד?", a: "בוודאי. כבר בטופס ההרשמה תוכלו לבחור תחומים מועדפים, ובשיחת ההתאמה נדייק את זה עוד יותר. אפשר ללמוד פרשת שבוע, פילוסופיה יהודית, תורת הנפש או אפילו לדון סתם כך על משמעות החיים." },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-ink-100 hover:border-primary-200 transition-colors overflow-hidden reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="faq-toggle w-full flex items-center justify-between gap-4 text-right p-6 md:p-7">
                  <span className="font-heading font-extrabold text-lg text-ink-900">{faq.q}</span>
                  <i className={`fas fa-chevron-down accordion-icon text-primary-500 flex-shrink-0 ${openFaq === i ? "open" : ""}`}></i>
                </button>
                <div className={`accordion-content px-6 md:px-7 pb-6 md:pb-7 ${openFaq === i ? "open" : ""}`}>
                  <p className="text-ink-600 leading-relaxed font-medium">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-elevated overflow-hidden flex flex-col lg:flex-row border border-ink-100 reveal-scale">
            
            <div className="lg:w-5/12 bg-gradient-to-br from-primary-700 via-primary-800 to-ink-950 p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-72 h-72 border-[40px] border-white/5 rounded-full"></div>
              <div className="absolute -left-24 -top-24 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-primary-100 border border-white/20 text-xs font-bold mb-6 tracking-widest uppercase">הצעד הראשון שלכם</span>
                <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight text-white">אז מתי מתחילים ללמוד?</h3>
                <p className="text-primary-100/90 text-lg mb-9 leading-relaxed font-medium">אין שום צורך להתכונן. השאירו פרטים ונציג שלנו ישמח ליצור קשר בהקדם לשיחת היכרות קצרצרה – כך שנוכל למצוא את החברותא שמתאימה בדיוק למידות שלכם.</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20"><i className="fas fa-shield-alt"></i></div>
                    <span className="font-semibold text-white">שירות בחינם, בלי שום אותיות קטנות.</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20"><i className="fas fa-bolt"></i></div>
                    <span className="font-semibold text-white">מענה אנושי מהיר בתוך יממה.</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20"><i className="fas fa-user-lock"></i></div>
                    <span className="font-semibold text-white">הפרטיות שלכם נשמרת בקפידה.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-7/12 p-8 md:p-14 bg-white">
              <form id="signup-form" className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-ink-800" htmlFor="name">איך קוראים לך?</label>
                    <input type="text" id="name" name="Full Name" required className="w-full input-modern p-4 rounded-2xl text-ink-900 font-medium text-base" placeholder="שם מלא" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-ink-800" htmlFor="phone">לאן נוכל להתקשר?</label>
                    <input type="tel" id="phone" name="Phone Number" required pattern="[0-9]{9,10}" className="w-full input-modern p-4 rounded-2xl text-ink-900 text-left font-medium text-base" dir="ltr" placeholder="050-0000000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="topic">איזה נושא הכי מסקרן אותך? (לא חובה)</label>
                  <div className="relative">
                    <select id="topic" name="Preferred Topic" className="w-full input-modern p-4 rounded-2xl text-ink-900 appearance-none pl-12 font-medium text-base cursor-pointer" defaultValue="">
                      <option value="" disabled>אנא בחר/י מהרשימה...</option>
                      <option value="פילוסופיה של הנפש / חובת הלבבות">פילוסופיה של הנפש / חובת הלבבות</option>
                      <option value="אקטואליה ופרשת השבוע">אקטואליה ופרשת השבוע</option>
                      <option value="תלמוד או גמרא לעומק">תלמוד או גמרא לעומק</option>
                      <option value="הלכה ומושגי יסוד">הלכה ומושגי יסוד</option>
                      <option value="תפתיעו אותי – אשמח להמלצה">תפתיעו אותי – אשמח להמלצה</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-400">
                      <i className="fas fa-chevron-down text-sm"></i>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="notes">יש משהו נוסף שחשוב שנדע? (לא חובה)</label>
                  <textarea id="notes" name="Additional Notes" rows={3} className="w-full input-modern p-4 rounded-2xl text-ink-900 font-medium text-base resize-none" placeholder="זה הזמן לספר על עצמך, על שעות שנוחות לך, או כל בקשה מיוחדת שתעזור לנו לדייק..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-5 rounded-2xl font-extrabold text-lg inline-flex items-center justify-center gap-3 group">
                  {isSubmitting ? (
                    <><i className="fas fa-circle-notch fa-spin"></i><span>מעבד את הנתונים, רק רגע...</span></>
                  ) : (
                    <><span>מצאו לי את החברותא המושלמת!</span><i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i></>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-400 font-bold pt-2">
                  <span className="flex items-center gap-1.5"><i className="fas fa-lock text-ink-300"></i> אבטחת פרטיות מחמירה</span>
                  <span className="hidden sm:inline text-ink-200">|</span>
                  <span className="flex items-center gap-1.5"><i className="fas fa-gift text-ink-300"></i> שירות ללא כל תשלום</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 relative overflow-hidden bg-ink-950 selection:bg-white/30 selection:text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Jerusalem_stone.jpg/1280px-Jerusalem_stone.jpg')", opacity: 0.25 }}></div>
        <div className="absolute inset-0 bg-gradient-to-l from-ink-950 via-ink-950/70 to-transparent"></div>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10 text-center reveal">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-4xl mx-auto mb-7 border border-green-500/30 shadow-lg pulse-whatsapp">
            <i className="fab fa-whatsapp"></i>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">בואו להכיר אותנו בוואטסאפ</h2>
          <p className="text-ink-300 text-lg md:text-xl font-medium mb-9 max-w-2xl mx-auto">מצטרפים לקבוצה השקטה שלנו ומקבלים תכנים מעשירים, סרטונים קצרים והשראה יומיומית היישר לנייד – בלי חפירות.</p>
          <a href="https://chat.whatsapp.com/KTQP8QX3l7XEdkRvGgphNo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white text-ink-900 px-8 py-4 rounded-full font-extrabold text-lg shadow-xl hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <i className="fab fa-whatsapp text-xl"></i>
            <span>לחצו כאן כדי להצטרף לקהילה!</span>
            <i className="fas fa-arrow-left text-sm"></i>
          </a>
        </div>
      </section>

      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] p-10 md:p-12 max-w-md w-full relative z-10 shadow-elevated text-center transition-all duration-300 border border-ink-100">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-7 shadow-lg shadow-emerald-500/30">
              <i className="fas fa-check"></i>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-ink-900 mb-3">תודה מכל הלב! ✨</h3>
            <p className="text-ink-600 text-base md:text-lg mb-8 leading-relaxed font-medium">הפרטים התקבלו בהצלחה. הנציגים שלנו יעברו על הפנייה וייצרו עמך קשר בקרוב כדי למצוא את החברותא המושלמת עבורך.</p>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-ink-50 text-ink-700 border-2 border-ink-100 py-4 rounded-2xl font-bold text-lg hover:bg-ink-100 hover:border-ink-200 transition-all">סגירה והמשך גלישה</button>
          </div>
        </div>
      )}
    </>
  );
}
