"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavGlass, setIsNavGlass] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Counters
  const [counters, setCounters] = useState({
    learners: 0,
    hours: 0,
    volunteers: 0,
  });

  const year = new Date().getFullYear();

  useEffect(() => {
    // Scroll Progress & Navbar
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrollTop / docHeight) * 100);
      setIsNavGlass(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(true);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <>
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob bg-primary-200 w-[600px] h-[600px] rounded-full top-[-200px] right-[-200px] animate-float"></div>
        <div className="blob bg-accent-100 w-[500px] h-[500px] rounded-full top-[30%] left-[-200px] animate-float-slow" style={{ animationDelay: "-4s" }}></div>
        <div className="blob bg-primary-100 w-[450px] h-[450px] rounded-full bottom-[-100px] right-[10%] animate-float" style={{ animationDelay: "-8s" }}></div>
      </div>

      <nav id="navbar" className={`fixed w-full z-50 transition-all duration-500 ${isNavGlass ? "glass shadow-soft" : ""}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-heading font-black text-xl md:text-2xl text-ink-900 leading-tight tracking-tight">תורה לנשמה</span>
                <span className="text-primary-600 font-bold text-[10px] md:text-xs tracking-widest leading-none mt-0.5">חברותא עם רבנים</span>
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-1">
              <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="px-4 py-2.5 text-ink-600 hover:text-primary-600 font-semibold text-[15px] rounded-xl hover:bg-primary-50 transition-all">מה זה חברותא?</a>
              <a href="#how" onClick={(e) => scrollToSection(e, "#how")} className="px-4 py-2.5 text-ink-600 hover:text-primary-600 font-semibold text-[15px] rounded-xl hover:bg-primary-50 transition-all">איך זה עובד?</a>
              <a href="#content" onClick={(e) => scrollToSection(e, "#content")} className="px-4 py-2.5 text-ink-600 hover:text-primary-600 font-semibold text-[15px] rounded-xl hover:bg-primary-50 transition-all">תוכן</a>
              <a href="#faq" onClick={(e) => scrollToSection(e, "#faq")} className="px-4 py-2.5 text-ink-600 hover:text-primary-600 font-semibold text-[15px] rounded-xl hover:bg-primary-50 transition-all">שאלות</a>
              <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="btn-primary mr-3 px-7 py-3 rounded-full font-bold text-[15px] inline-flex items-center gap-2">
                <span>להרשמה מהירה</span>
                <i className="fas fa-arrow-left text-xs"></i>
              </a>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-soft border border-ink-100 hover:border-primary-200 transition-colors" aria-label="תפריט">
              <div className="flex flex-col gap-1.5 items-center">
                <span className="block w-5 h-0.5 bg-ink-700 rounded-full transition-all duration-300" style={isMenuOpen ? { transform: "translateY(8px) rotate(45deg)" } : {}}></span>
                <span className="block w-5 h-0.5 bg-ink-700 rounded-full transition-all duration-300" style={isMenuOpen ? { opacity: 0 } : {}}></span>
                <span className="block w-5 h-0.5 bg-ink-700 rounded-full transition-all duration-300" style={isMenuOpen ? { transform: "translateY(-8px) rotate(-45deg)" } : {}}></span>
              </div>
            </button>
          </div>
        </div>

        <div id="mobile-menu" className={`lg:hidden bg-white/98 backdrop-blur-2xl border-t border-ink-100 ${isMenuOpen ? "open" : ""}`}>
          <div className="px-5 py-6 space-y-1">
            <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="block px-5 py-4 text-base font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">מה זה חברותא?</a>
            <a href="#how" onClick={(e) => scrollToSection(e, "#how")} className="block px-5 py-4 text-base font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">איך זה עובד?</a>
            <a href="#content" onClick={(e) => scrollToSection(e, "#content")} className="block px-5 py-4 text-base font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">תוכן מעשיר</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, "#faq")} className="block px-5 py-4 text-base font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">שאלות נפוצות</a>
            <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="btn-primary block text-center mt-4 px-6 py-4 rounded-2xl font-bold">להרשמה מהירה (ללא עלות)</a>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            <div className="lg:col-span-6 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-bold text-sm mb-7 shadow-soft reveal">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </span>
                <span>הסטארטאפ הוותיק בעולם, עכשיו בטלפון שלך</span>
              </div>

              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-[4.2rem] text-ink-950 leading-[1.05] mb-7 reveal" style={{ transitionDelay: "0.1s" }}>
                חיבור למסורת,<br />
                <span className="text-gradient">בקצב שלכם.</span>
              </h1>

              <p className="text-lg lg:text-xl text-ink-600 mb-9 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium reveal" style={{ transitionDelay: "0.2s" }}>
                רוצים להכיר את המסורת היהודית אבל שגרת החיים לא מאפשרת? <strong className="text-ink-800">'תורה לנשמה'</strong> מציעה חברותא טלפונית: שעת איכות שבועית של לימוד ושיח, מכל מקום ובזמן שנוח לכם.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 reveal" style={{ transitionDelay: "0.3s" }}>
                <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="btn-primary px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-3 group">
                  <span>מצאו לי חברותא</span>
                  <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                </a>
                <a href="#how" onClick={(e) => scrollToSection(e, "#how")} className="btn-outline px-8 py-4 rounded-2xl font-bold text-ink-700 bg-white inline-flex items-center justify-center gap-2">
                  <i className="fas fa-play-circle text-primary-500"></i>
                  איך זה עובד?
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-ink-500 font-semibold reveal" style={{ transitionDelay: "0.4s" }}>
                <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> ללא עלות</div>
                <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> ללא התחייבות</div>
                <div className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> מותאם אישית</div>
              </div>
            </div>

            <div className="lg:col-span-6 relative reveal-scale" style={{ transitionDelay: "0.2s" }}>
              <div className="hero-frame relative">
                <img
                  src="https://images.unsplash.com/photo-1601314002592-b8734bca6604?auto=format&fit=crop&w=1200&q=85&crop=center"
                  alt="הכותל המערבי – ירושלים"
                  className="rounded-[2.5rem] shadow-elevated img-cover h-[420px] md:h-[560px] w-full border border-white"
                />
                <div className="absolute -bottom-5 -left-5 md:-left-8 bg-white p-4 md:p-5 rounded-2xl shadow-elevated flex items-center gap-4 border border-ink-50">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-primary-500/40">
                    <i className="fas fa-phone-volume"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] md:text-xs text-ink-400 font-bold uppercase tracking-wider">זמין מכל מקום</p>
                    <p className="font-heading font-extrabold text-ink-900 text-base md:text-lg">פשוט שיחת טלפון</p>
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
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-star text-amber-400"></i> 4.9 דירוג ממוצע</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-users text-primary-400"></i> +2,500 לומדים</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-clock text-primary-400"></i> +80,000 שעות לימוד</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-hand-holding-heart text-rose-400"></i> פרויקט התנדבותי</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-shield-alt text-emerald-400"></i> 100% פרטיות</span>
              </div>
              <div className="flex gap-16 items-center" aria-hidden="true">
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-star text-amber-400"></i> 4.9 דירוג ממוצע</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-users text-primary-400"></i> +2,500 לומדים</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-clock text-primary-400"></i> +80,000 שעות לימוד</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-hand-holding-heart text-rose-400"></i> פרויקט התנדבותי</span>
                <span className="flex items-center gap-3 text-ink-400 font-bold text-lg"><i className="fas fa-shield-alt text-emerald-400"></i> 100% פרטיות</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-xs tracking-widest uppercase mb-4">
              <i className="fas fa-bookmark"></i>
              <span>מה זה בעצם "חברותא"?</span>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-6 leading-tight">
              זמן איכות משותף, <span className="text-gradient">מכל מקום</span>
            </h2>
            <p className="text-lg text-ink-600 font-medium leading-relaxed">
              "חברותא טלפונית" הינו שירות ללא מטרות רווח שמחבר בין חילונים לחרדים. אנו מאפשרים לקבוע זמן איכות של שעה, פעם בשבוע, ללימוד ושיח בגובה העיניים - דרך הטלפון.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="card-hover bg-white rounded-3xl p-8 md:p-10 border border-ink-100 hover:border-primary-200 reveal group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-7 shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-ink-900 mb-3">גמישות מלאה</h3>
                <p className="text-ink-600 leading-relaxed font-medium">בבית הקפה, בדרך לבסיס או מהסלון בבית. שעת האיכות מתקיימת היכן שהכי נוח לכם, בלי צורך לשנות את סדר היום.</p>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 md:p-10 border border-ink-100 hover:border-primary-200 reveal group relative overflow-hidden" style={{ transitionDelay: "0.1s" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-7 shadow-lg shadow-accent-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <i className="fas fa-book-reader"></i>
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-ink-900 mb-3">תוכן מותאם אישית</h3>
                <p className="text-ink-600 leading-relaxed font-medium">השיח מתמקד בנושאים שמדברים אליכם - החל מפרשת השבוע, דרך תורת הנפש, ועד לשאלות עומק על משמעות החיים.</p>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 md:p-10 border border-ink-100 hover:border-primary-200 reveal group relative overflow-hidden" style={{ transitionDelay: "0.2s" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-7 shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-ink-900 mb-3">נטו מכל הלב</h3>
                <p className="text-ink-600 leading-relaxed font-medium">המיזם פועל בהתנדבות מלאה. החברותא שלכם מקדיש את זמנו כדי לחלוק ידע ולבנות גשרים בעם ישראל, ללא כל תמורה כספית.</p>
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
                <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">שעות לימוד</div>
              </div>
              <div className="text-center reveal" style={{ transitionDelay: "0.2s" }}>
                <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">
                  <span>{counters.volunteers}</span>+
                </div>
                <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">חברותות התנדבו</div>
              </div>
              <div className="text-center reveal" style={{ transitionDelay: "0.3s" }}>
                <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">4.9<span className="text-accent-400 text-3xl">★</span></div>
                <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">דירוג מרוצה</div>
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
              איך זה <span className="text-gradient">עובד?</span>
            </h2>
            <p className="text-lg text-ink-600 font-medium leading-relaxed">
              התהליך פשוט ומהיר. תוך 24 שעות תקבלו התאמה אישית לחברותא שתענה בדיוק על מה שחיפשתם.
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
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">ממלאים טופס קצר</h3>
                <p className="text-ink-600 font-medium leading-relaxed max-w-xs mx-auto">מספרים לנו על עצמכם, על סגנון הלימוד המועדף ועל הזמנים הנוחים לכם.</p>
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
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">מקבלים התאמה אישית</h3>
                <p className="text-ink-600 font-medium leading-relaxed max-w-xs mx-auto">נציג שלנו יוצר קשר, מבין את הצרכים שלכם ומתאים לכם חברותא מושלמת.</p>
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
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3">מתחילים ללמוד</h3>
                <p className="text-ink-600 font-medium leading-relaxed max-w-xs mx-auto">קובעים שעה שבועית קבועה, ומתחילים מסע של גילוי, לימוד והשראה.</p>
              </div>
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
              סיפורים <span className="text-gradient">אמיתיים</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal">
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"בהתחלה חששתי שזה יהיה מוזר, אבל תוך חמש דקות הרגשתי כאילו אני משוחח עם חבר ותיק. הלימוד ממש עזר לי למצוא שקט בתוך השגרה העמוסה."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">א</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">אבי כהן</div>
                  <div className="text-ink-400 text-xs font-semibold">תל אביב</div>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"מה שאהבתי זה שאין שום לחץ ואין אג'נדות. פשוט לומדים יחד, דנים, וכל אחד שואל מה שהוא רוצה. זו חוויה אמיתית של חיבור."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold">מ</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">מיכל לוי</div>
                  <div className="text-ink-400 text-xs font-semibold">חיפה</div>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal md:col-span-2 lg:col-span-1" style={{ transitionDelay: "0.2s" }}>
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"אני חילוני גמור, והחברותא שלי הוא רב חרדי. השיחות בינינו שינו לי את הראש לחלוטין - לא במובן של חזרה בתשובה, אלא של הבנה, כבוד וסקרנות."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">י</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">יוסי אברהם</div>
                  <div className="text-ink-400 text-xs font-semibold">ירושלים</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 relative overflow-hidden bg-ink-950 text-white noise">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0yMCAyMGMtNS41IDAtMTAtNC41LTEwLTEwUzE0LjUgMTAgMjAgMTBzMTAgNC41IDEwIDEwLTQuNSAxMC0xMCAxMHoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative reveal-scale">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=85&crop=center"
                  alt="ספרים עתיקים – חוכמה ומסורת"
                  className="rounded-[2rem] shadow-2xl img-cover h-[440px] md:h-[520px] w-full border border-ink-800"
                />
                <div className="absolute -bottom-5 -right-5 w-full h-full border-2 border-primary-500/60 rounded-[2rem] -z-10"></div>
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3">
                  <i className="fas fa-shield-halved text-primary-600 text-xl"></i>
                  <div className="text-right">
                    <p className="font-heading font-extrabold text-ink-900 text-sm">100% דיסקרטי</p>
                    <p className="text-[10px] text-ink-400 font-bold">בלי שיפוטיות</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 reveal">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/20 text-primary-300 font-bold text-xs tracking-widest uppercase mb-6 border border-primary-500/30">
                <i className="fas fa-handshake"></i>
                <span>הפילוסופיה שלנו</span>
              </div>
              <h2 className="font-heading font-black text-3xl md:text-5xl mb-6 leading-tight">
                בגובה העיניים,<br />
                <span className="text-primary-400">בלי אג'נדות.</span>
              </h2>
              <p className="text-ink-300 text-lg mb-5 leading-relaxed font-medium">
                רבים שואלים: "האם החברותא ינסה להחזיר אותי בתשובה?" התשובה הקצרה היא: <strong className="text-white">ממש לא.</strong> המטרה שלנו משותפת – לצמצם פערים בחברה הישראלית.
              </p>
              <p className="text-ink-300 text-lg mb-9 leading-relaxed font-medium">
                מדובר באנשים כמוני וכמוך, שיש להם ידע רב ביהדות ועניין לחלוק אותו, לדבר וללמוד יחד מתוך כבוד הדדי.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-9">
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                  <i className="fas fa-check-circle text-emerald-400 text-xl"></i>
                  <span className="text-white font-bold text-sm">ללא אג'נדות</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                  <i className="fas fa-check-circle text-emerald-400 text-xl"></i>
                  <span className="text-white font-bold text-sm">כבוד הדדי</span>
                </div>
              </div>
              <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="inline-flex items-center gap-3 px-8 py-4 bg-white text-ink-900 rounded-full font-bold hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group">
                <span>הבנתי, נשמע מעולה</span>
                <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </a>
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
                <span>טעימה מהלימוד</span>
              </div>
              <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-4 leading-tight">
                מאמרים, פרשת השבוע <span className="text-gradient">והשראה</span>
              </h2>
              <p className="text-lg text-ink-600 font-medium leading-relaxed">
                טעימות תוכן שמרחיבות את האופקים, מבוססות על תורת הנפש היהודית וחוכמת הדורות.
              </p>
            </div>
            <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="btn-outline bg-white px-6 py-3 rounded-2xl font-bold text-ink-700 inline-flex items-center gap-2 whitespace-nowrap">
              כל המאמרים <i className="fas fa-arrow-left text-xs"></i>
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal">
              <div className="h-52 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80&crop=center" className="w-full h-full img-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" alt="אור השמש דרך העננים – ביטחון" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-extrabold text-primary-700 shadow-sm border border-primary-100">ביטחון בהשם</div>
              </div>
              <div className="p-7 flex-grow flex flex-col">
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">מהו ביטחון בהשם? המפתח לפרנסה ולרוגע</h3>
                <p className="text-ink-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">ביטחון בהשם הוא הכלי הרוחני באמצעותו אדם מקבל את פרנסתו. בעזרת אמונה, אנחנו מחייכים ואיננו מודאגים מהיכן יגיע הלחם מחר.</p>
                <div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                  <span>בואו ללמוד על זה</span>
                  <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                </div>
              </div>
            </a>

            <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="h-52 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80&crop=center" className="w-full h-full img-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" alt="אנשים לומדים יחד" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-extrabold text-primary-700 shadow-sm border border-primary-100">היכרות</div>
              </div>
              <div className="p-7 flex-grow flex flex-col">
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">הכירו את החברותא הטלפונית שלנו</h3>
                <p className="text-ink-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">לימוד תורה הוא הזדמנות מצוינת להתרחק מההמולה של חיי היומיום. אנו מציעים לכם לפגוש חבר לשעה של לימוד בשבוע - ללא התחייבות וללא תשלום!</p>
                <div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                  <span>בואו ללמוד על זה</span>
                  <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                </div>
              </div>
            </a>

            <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.2s" }}>
              <div className="h-52 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80&crop=center" className="w-full h-full img-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" alt="מסע במדבר – לך לך" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-extrabold text-accent-700 shadow-sm border border-accent-100">פרשת השבוע</div>
              </div>
              <div className="p-7 flex-grow flex flex-col">
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">פרשת לך לך: ניצחון מעל לטבע</h3>
                <p className="text-ink-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">כאשר נודע לאברהם אבינו שלוט בן אחיו נפל בשבי, הוא יצא לבדו להילחם נגד ארבע מעצמות על חמושות היטב. איש אחד בודד ומנצח.</p>
                <div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                  <span>בואו ללמוד על זה</span>
                  <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                </div>
              </div>
            </a>

            <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal">
              <div className="h-52 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=800&q=80&crop=center" className="w-full h-full img-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" alt="מי אגם שקטים – פרשת נח" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-extrabold text-accent-700 shadow-sm border border-accent-100">פרשת השבוע</div>
              </div>
              <div className="p-7 flex-grow flex flex-col">
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">פרשת נח: היונה ועלה הזית</h3>
                <p className="text-ink-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">לאחר המבול, נח החליט לשלוח יונה כדי לראות אם קלו המים. היונה חזרה עם עלה זית בפיה - סמל עולמי לתקווה, לשלום ולהתחלה חדשה.</p>
                <div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                  <span>בואו ללמוד על זה</span>
                  <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                </div>
              </div>
            </a>

            <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="h-52 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80&crop=center" className="w-full h-full img-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" alt="אוהל באש קמפינג – הכנסת אורחים" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-extrabold text-accent-700 shadow-sm border border-accent-100">פרשת השבוע</div>
              </div>
              <div className="p-7 flex-grow flex flex-col">
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">פרשת וירא: מפעל החסד של אברהם</h3>
                <p className="text-ink-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">בתחילת הפרשה מסופר על מידת החסד המופלאה של אברהם אבינו. הוא הקים את מפעל החסד הגדול מסוגו בעולם, "הכנסת אורחים א.ש.ל" בלב המדבר.</p>
                <div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                  <span>בואו ללמוד על זה</span>
                  <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                </div>
              </div>
            </a>

            <a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.2s" }}>
              <div className="h-52 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80&crop=center" className="w-full h-full img-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" alt="זריחה מרהיבה – כוחה של התחלה" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-extrabold text-accent-700 shadow-sm border border-accent-100">פרשת השבוע</div>
              </div>
              <div className="p-7 flex-grow flex flex-col">
                <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">פרשת בראשית: כוחה של התחלה</h3>
                <p className="text-ink-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">בריאת העולם אינה רק אירוע היסטורי, אלא תהליך שמתרחש בכל רגע. איך אפשר להשתמש באנרגיה העוצמתית של התחלה חדשה כדי לברוא את המציאות האישית שלנו טוב יותר?</p>
                <div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                  <span>בואו ללמוד על זה</span>
                  <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                </div>
              </div>
            </a>
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
              יש לכם <span className="text-gradient">שאלות?</span>
            </h2>
            <p className="text-lg text-ink-600 font-medium">ריכזנו עבורכם את השאלות הנפוצות ביותר. לא מצאתם תשובה? דברו איתנו בוואטסאפ.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "האם החברותא באמת בחינם?", a: "כן, לחלוטין. מדובר בפרויקט התנדבותי לחלוטין ללא עלויות נסתרות. החברותא שלכם מקדיש מזמנו בהתנדבות מלאה מתוך רצון לחלוק ידע ולבנות גשרים בעם ישראל." },
              { q: "האם מנסים להחזיר אותי בתשובה?", a: "ממש לא. המטרה שלנו היא לצמצם פערים בחברה הישראלית דרך לימוד משותף. אין שום אג'נדה של החזרה בתשובה - רק שיח פתוח, כבוד הדדי וסקרנות אינטלקטואלית." },
              { q: "אני צריך ידע מוקדם ביהדות?", a: "ממש לא! אין צורך בידע מוקדם או בהכנה. הלימוד מותאם לרמתכם ולקצב שלכם. כל שאלה היא מבורכת, וכל נושא הוא הזדמנות למידה." },
              { q: "כמה זמן לוקח התהליך?", a: "בדרך כלל תוך 24-48 שעות תקבלו שיחה מנציג שלנו שיבין את הצרכים שלכם ויתאים לכם חברותא. לאחר מכן תוכלו לתאם ישירות עם החברותא את מועד השיעור הראשון." },
              { q: "האם המידע שלי נשמר?", a: "הפרטיות שלכם חשובה לנו מאוד. כל המידע נשמר באופן מאובטח, ולא מועבר לשום צד שלישי. אתם יכולים להפסיק את הלימוד בכל רגע שתבחרו, ללא כל התחייבות." },
              { q: "איך מתבצעת ההתאמה בין החברותא?", a: "נציג שלנו יוצר קשר טלפוני קצר, מבין את סגנון הלימוד המועדף עליכם, את הזמנים הנוחים לכם ואת התחומים המעניינים אתכם - ומתאים לכם חברותא שהיא ההתאמה הטובה ביותר עבורכם." },
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
                <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight text-white">רוצים להצטרף לחברותא?</h3>
                <p className="text-primary-100/90 text-lg mb-9 leading-relaxed font-medium">אין צורך בידע כלשהו או בהכנה מוקדמת. נציג שלנו יצור עמך קשר לשיחה קצרה, על מנת להבין את הסגנון והבקשות שלך ולהתאים לך חברותא כלבבך.</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20"><i className="fas fa-shield-alt"></i></div>
                    <span className="font-semibold text-white">ללא התחייבות, וללא עלות.</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20"><i className="fas fa-bolt"></i></div>
                    <span className="font-semibold text-white">מענה תוך 24 שעות.</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20"><i className="fas fa-user-lock"></i></div>
                    <span className="font-semibold text-white">פרטיות מלאה מובטחת.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-7/12 p-8 md:p-14 bg-white">
              <form id="signup-form" className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-ink-800" htmlFor="name">איך קוראים לך?</label>
                    <input type="text" id="name" required className="w-full input-modern p-4 rounded-2xl text-ink-900 font-medium text-base" placeholder="שם מלא" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-ink-800" htmlFor="phone">לאן להתקשר?</label>
                    <input type="tel" id="phone" required pattern="[0-9]{9,10}" className="w-full input-modern p-4 rounded-2xl text-ink-900 text-left font-medium text-base" dir="ltr" placeholder="050-0000000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="topic">נושא לימוד מועדף (לא חובה)</label>
                  <div className="relative">
                    <select id="topic" className="w-full input-modern p-4 rounded-2xl text-ink-900 appearance-none pl-12 font-medium text-base cursor-pointer" defaultValue="">
                      <option value="" disabled>לחץ לבחירה...</option>
                      <option value="bitachon">חובת הלבבות / פילוסופיה של הנפש</option>
                      <option value="parasha">פרשת שבוע / אקטואליה</option>
                      <option value="talmud">תלמוד / גמרא לעומק</option>
                      <option value="halacha">הלכה יומיומית</option>
                      <option value="open">אשמח שתמליצו לי</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-400">
                      <i className="fas fa-chevron-down text-sm"></i>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink-800" htmlFor="notes">משהו שתרצה להוסיף? (לא חובה)</label>
                  <textarea id="notes" rows={3} className="w-full input-modern p-4 rounded-2xl text-ink-900 font-medium text-base resize-none" placeholder="ספר לנו על עצמך, על הזמנים הנוחים לך, או על כל בקשה מיוחדת..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-5 rounded-2xl font-extrabold text-lg inline-flex items-center justify-center gap-3 group">
                  {isSubmitting ? (
                    <><i className="fas fa-circle-notch fa-spin"></i><span>מעבד את הנתונים...</span></>
                  ) : (
                    <><span>מצאו לי את החברותא המושלמת</span><i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i></>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-400 font-bold pt-2">
                  <span className="flex items-center gap-1.5"><i className="fas fa-lock text-ink-300"></i> פרטיות מובטחת</span>
                  <span className="hidden sm:inline text-ink-200">|</span>
                  <span className="flex items-center gap-1.5"><i className="fas fa-gift text-ink-300"></i> השירות חינם לחלוטין</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=1600&q=80')", opacity: 0.18 }}></div>
        <div className="absolute inset-0 bg-gradient-to-l from-ink-950 via-ink-950/70 to-transparent"></div>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10 text-center reveal">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-4xl mx-auto mb-7 border border-green-500/30 shadow-lg pulse-whatsapp">
            <i className="fab fa-whatsapp"></i>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">הצטרפו לקבוצת הוואטסאפ שלנו</h2>
          <p className="text-ink-300 text-lg md:text-xl font-medium mb-9 max-w-2xl mx-auto">לקבלת סרטונים קצרים לחיזוק הנשמה, השראה יומיומית ותכנים מעשירים שיעשו לכם סדר בראש.</p>
          <a href="https://chat.whatsapp.com/KTQP8QX3l7XEdkRvGgphNo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white text-ink-900 px-8 py-4 rounded-full font-extrabold text-lg shadow-xl hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <i className="fab fa-whatsapp text-xl"></i>
            <span>להצטרפות לקבוצה הקליקו עכשיו</span>
            <i className="fas fa-arrow-left text-sm"></i>
          </a>
        </div>
      </section>

      <footer className="bg-ink-50 border-t border-ink-100 pt-16 md:pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-10 md:gap-8 mb-14">
            <div className="md:col-span-5">
              <a href="#" className="flex items-center gap-3 mb-6">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-heading font-black text-xl text-ink-900 leading-tight tracking-tight">תורה לנשמה</span>
                  <span className="text-primary-600 font-bold text-xs tracking-wide leading-none mt-0.5">חברותא טלפונית ללימוד תורה</span>
                </div>
              </a>
              <p className="text-ink-500 text-base font-medium leading-relaxed max-w-md">מחברים בין עולמות בחברה הישראלית באמצעות זמן איכות טלפוני אישי ולימוד משותף. פרויקט ללא מטרות רווח.</p>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-heading font-extrabold text-ink-900 mb-5 text-sm uppercase tracking-widest">ניווט</h4>
              <ul className="space-y-3">
                <li><a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">מה זה חברותא?</a></li>
                <li><a href="#how" onClick={(e) => scrollToSection(e, "#how")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">איך זה עובד?</a></li>
                <li><a href="#content" onClick={(e) => scrollToSection(e, "#content")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">פרשות שבוע ומאמרים</a></li>
                <li><a href="#faq" onClick={(e) => scrollToSection(e, "#faq")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">שאלות נפוצות</a></li>
                <li><a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">הרשמה לחברותא</a></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-heading font-extrabold text-ink-900 mb-5 text-sm uppercase tracking-widest">יצירת קשר</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-ink-600 font-semibold">
                  <i className="fab fa-whatsapp text-emerald-500 text-lg"></i>
                  <a href="https://wa.me/972585986685" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors" dir="ltr">+972 58-598-6685</a>
                </li>
                <li className="flex items-center gap-3 text-ink-600 font-semibold">
                  <i className="fas fa-phone text-primary-500 text-lg"></i>
                  <span>שיחת טלפון חינם</span>
                </li>
              </ul>

              <div className="mt-6 flex gap-3">
                <a href="https://wa.me/972585986685" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-white border border-ink-100 flex items-center justify-center text-ink-600 hover:text-emerald-500 hover:border-emerald-200 transition-all" aria-label="וואטסאפ">
                  <i className="fab fa-whatsapp text-lg"></i>
                </a>
                <a href="#" className="w-11 h-11 rounded-xl bg-white border border-ink-100 flex items-center justify-center text-ink-600 hover:text-primary-600 hover:border-primary-200 transition-all" aria-label="אימייל">
                  <i className="fas fa-envelope text-lg"></i>
                </a>
                <a href="#" className="w-11 h-11 rounded-xl bg-white border border-ink-100 flex items-center justify-center text-ink-600 hover:text-primary-600 hover:border-primary-200 transition-all" aria-label="פייסבוק">
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-ink-200/60 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ink-500 font-medium">
            <p>© <span>{year}</span> תורה לנשמה. כל הזכויות שמורות.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-600 transition-colors">מדיניות פרטיות</a>
              <a href="#" className="hover:text-primary-600 transition-colors">הצהרת נגישות</a>
            </div>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/972585986685" target="_blank" rel="noopener noreferrer" aria-label="פניה בוואטסאפ" className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 group flex items-center">
        <span className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl text-sm font-bold text-ink-700 shadow-elevated opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-ink-100 translate-x-2 group-hover:translate-x-0">
          דברו איתנו בוואטסאפ!
        </span>
        <div className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-xl pulse-whatsapp transform group-hover:scale-110 transition-transform duration-300">
          <i className="fab fa-whatsapp"></i>
        </div>
      </a>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] p-10 md:p-12 max-w-md w-full relative z-10 shadow-elevated text-center transition-all duration-300 border border-ink-100">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-7 shadow-lg shadow-emerald-500/30">
              <i className="fas fa-check"></i>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-ink-900 mb-3">תודה שפנית אלינו! ✨</h3>
            <p className="text-ink-600 text-base md:text-lg mb-8 leading-relaxed font-medium">קיבלנו את פנייתך בנושא חברותא טלפונית, נציג שלנו ייצור עמך קשר בהקדם האפשרי על מנת להתאים לך חברותא כלבבך.</p>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-ink-50 text-ink-700 border-2 border-ink-100 py-4 rounded-2xl font-bold text-lg hover:bg-ink-100 hover:border-ink-200 transition-all">סגור</button>
          </div>
        </div>
      )}
    </>
  );
}
