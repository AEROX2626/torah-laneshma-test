"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isNavGlass, setIsNavGlass] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsNavGlass(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open to prevent background dragging
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setIsMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      const isMobile = window.innerWidth < 1024;
      let target = document.querySelector(hash);

      if (isMobile && (hash === "#join" || hash === "#contact")) {
        const formTarget = document.getElementById("join-form-wrapper");
        if (formTarget) {
          target = formTarget;
        }
      }

      if (target) {
        const navOffset = 85;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // If landing on join/contact, add visual pulse and focus input
        if (hash === "#join" || hash === "#contact") {
          setTimeout(() => {
            const formCard = document.getElementById("join-card") || target;
            formCard.classList.add("highlight-pulse");
            const nameInput = target.querySelector<HTMLInputElement>("input[name='name']");
            if (nameInput) {
              nameInput.focus({ preventScroll: true });
            }
            setTimeout(() => {
              formCard.classList.remove("highlight-pulse");
            }, 2500);
          }, 600);
        }
      }
    }
  };

  return (
    <>
      <nav id="navbar" className={`sticky top-0 w-full z-50 transition-all duration-500 border-b ${isNavGlass ? "bg-white/85 backdrop-blur-lg shadow-soft border-ink-100" : "bg-transparent border-ink-100/0"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <Link href="/" onClick={(e) => { if(isHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }} className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-heading font-black text-xl md:text-2xl text-ink-900 leading-tight tracking-tight">תורה לנשמה</span>
                <span className="text-primary-600 font-bold text-[10px] md:text-xs tracking-widest leading-none mt-0.5">חברותא ללימוד תורה</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link href="/#about" onClick={(e) => handleLinkClick(e, "#about")} className="px-2 lg:px-3 py-2 text-ink-600 whitespace-nowrap text-[14px] lg:text-[15px] hover:text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all">מהי חברותא?</Link>
              <Link href="/#how" onClick={(e) => handleLinkClick(e, "#how")} className="px-2 lg:px-3 py-2 text-ink-600 whitespace-nowrap text-[14px] lg:text-[15px] hover:text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all">איך זה עובד?</Link>
              <Link href="/study" className={`px-2 lg:px-3 py-2 font-semibold text-[14px] lg:text-[15px] whitespace-nowrap rounded-xl transition-all ${pathname === '/study' ? 'text-primary-600 bg-primary-50' : 'text-ink-600 hover:text-primary-600 hover:bg-primary-50'}`}>בית מדרש</Link>
              <Link href="/relationships-guide" className={`px-2 lg:px-3 py-2 font-semibold text-[14px] lg:text-[15px] whitespace-nowrap rounded-xl transition-all ${pathname === '/relationships-guide' ? 'text-primary-600 bg-primary-50' : 'text-ink-600 hover:text-primary-600 hover:bg-primary-50'}`}>זוגיות ומידות</Link>
              <Link href="/ask" className={`px-2 lg:px-3 py-2 font-bold text-[14px] lg:text-[15px] whitespace-nowrap rounded-xl transition-all flex items-center gap-2 ${pathname === '/ask' ? 'text-primary-700 bg-primary-100/80' : 'text-primary-600 bg-primary-50 hover:bg-primary-100/80'}`}><i className="fas fa-robot text-primary-500"></i>שאל את הרב</Link>
              <Link href="/adopt" className={`px-2 lg:px-3 py-2 font-semibold text-[14px] lg:text-[15px] whitespace-nowrap rounded-xl transition-all ${pathname === '/adopt' ? 'text-primary-600 bg-primary-50' : 'text-ink-600 hover:text-primary-600 hover:bg-primary-50'}`}>אמץ אברך</Link>
              <Link href="/#content" onClick={(e) => handleLinkClick(e, "#content")} className="px-2 lg:px-3 py-2 text-ink-600 whitespace-nowrap text-[14px] lg:text-[15px] hover:text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all">כל הכתבות</Link>
              <Link href="/#faq" onClick={(e) => handleLinkClick(e, "#faq")} className="px-2 lg:px-3 py-2 text-ink-600 whitespace-nowrap text-[14px] lg:text-[15px] hover:text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all">שאלות נפוצות</Link>
              <Link href="/#join" onClick={(e) => handleLinkClick(e, "#join")} className="btn-primary mr-1 lg:mr-3 px-4 lg:px-6 py-2.5 rounded-full font-bold text-[15px] inline-flex items-center gap-2">
                <span>להרשמה מהירה</span>
                <i className="fas fa-arrow-left text-xs"></i>
              </Link>
            </div>

            <button aria-expanded={isMenuOpen} aria-controls="mobile-menu" onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-soft border border-ink-100 hover:border-primary-200 transition-colors" aria-label="תפריט">
              <div className="flex flex-col gap-1.5 items-center">
                <span className="block w-5 h-0.5 bg-ink-700 rounded-full transition-all duration-300" style={isMenuOpen ? { transform: "translateY(8px) rotate(45deg)" } : {}}></span>
                <span className="block w-5 h-0.5 bg-ink-700 rounded-full transition-all duration-300" style={isMenuOpen ? { opacity: 0 } : {}}></span>
                <span className="block w-5 h-0.5 bg-ink-700 rounded-full transition-all duration-300" style={isMenuOpen ? { transform: "translateY(-8px) rotate(-45deg)" } : {}}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`lg:hidden fixed inset-0 top-20 bg-ink-950/40 backdrop-blur-xs z-40 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
        />

        {/* Mobile Menu Overlay */}
        <div id="mobile-menu" className={`lg:hidden bg-white/98 backdrop-blur-xl border-t border-ink-100 shadow-2xl z-50 ${isMenuOpen ? "open" : ""}`}>
          <div className="px-5 py-6 space-y-2">
            
            {/* High Converting Chavruta Feature Box */}
            <div className="bg-gradient-to-br from-primary-50 via-primary-50/80 to-blue-50/40 p-4 rounded-2xl border border-primary-200/70 mb-3 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-lg shadow-md shadow-primary-500/20">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <span className="font-heading font-black text-ink-900 text-base block leading-tight">חברותא טלפונית אישית</span>
                  <span className="text-xs text-primary-700 font-bold">לימוד שבועי בקצב שלך • ללא עלות</span>
                </div>
              </div>
              <p className="text-xs text-ink-600 mb-3 font-medium leading-relaxed">
                מתאימים לך חברותא טלפונית אישית לחצי שעה בשבוע בנושא שמעניין אותך, בשיחה טלפונית נוחה.
              </p>
              <Link
                href="/#join"
                onClick={(e) => handleLinkClick(e, "#join")}
                className="w-full btn-primary py-3 px-4 rounded-xl font-black text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-primary-500/25"
              >
                <span>להרשמה מהירה לחברותא</span>
                <i className="fas fa-arrow-left text-xs"></i>
              </Link>
            </div>

            {/* Direct Contact / Join item */}
            <Link
              href="/#join"
              onClick={(e) => handleLinkClick(e, "#join")}
              className="flex items-center justify-between px-4 py-3.5 text-base font-bold text-primary-700 bg-primary-100/50 hover:bg-primary-100 rounded-2xl transition-all border border-primary-200"
            >
              <span className="flex items-center gap-3">
                <i className="fas fa-phone-volume text-primary-600"></i>
                <span>צור קשר והרשמה לחברותא</span>
              </span>
              <span className="text-xs bg-primary-600 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs">חינם</span>
            </Link>

            {/* Quick navigation grid */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <Link
                href="/study"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center gap-2.5 ${
                  pathname === "/study" ? "text-primary-600 bg-primary-50" : "text-ink-700 hover:text-primary-600 hover:bg-ink-50"
                }`}
              >
                <i className="fas fa-book-open text-primary-500 text-xs"></i>
                <span>בית מדרש</span>
              </Link>
              <Link
                href="/relationships-guide"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center gap-2.5 ${
                  pathname === "/relationships-guide" ? "text-primary-600 bg-primary-50" : "text-ink-700 hover:text-primary-600 hover:bg-ink-50"
                }`}
              >
                <i className="fas fa-heart text-rose-500 text-xs"></i>
                <span>זוגיות ומידות</span>
              </Link>
              <Link
                href="/ask"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 text-sm font-bold rounded-xl transition-all flex items-center gap-2.5 ${
                  pathname === "/ask" ? "text-primary-700 bg-primary-100/80" : "text-primary-600 bg-primary-50"
                }`}
              >
                <i className="fas fa-robot text-primary-500 text-xs"></i>
                <span>שאל את הרב</span>
              </Link>
              <Link
                href="/adopt"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center gap-2.5 ${
                  pathname === "/adopt" ? "text-primary-600 bg-primary-50" : "text-ink-700 hover:text-primary-600 hover:bg-ink-50"
                }`}
              >
                <i className="fas fa-hands-helping text-amber-500 text-xs"></i>
                <span>אמץ אברך</span>
              </Link>
            </div>

            {/* Main Section Links */}
            <div className="pt-2 border-t border-ink-100 space-y-1">
              <Link
                href="/#about"
                onClick={(e) => handleLinkClick(e, "#about")}
                className="block px-4 py-3 text-sm font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                מהי חברותא?
              </Link>
              <Link
                href="/#how"
                onClick={(e) => handleLinkClick(e, "#how")}
                className="block px-4 py-3 text-sm font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                איך זה עובד?
              </Link>
              <Link
                href="/#content"
                onClick={(e) => handleLinkClick(e, "#content")}
                className="block px-4 py-3 text-sm font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                כל הכתבות והמאמרים
              </Link>
              <Link
                href="/#faq"
                onClick={(e) => handleLinkClick(e, "#faq")}
                className="block px-4 py-3 text-sm font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                שאלות נפוצות
              </Link>
            </div>

            {/* Direct WhatsApp Callout */}
            <a
              href="https://wa.me/972503938114?text=שלום%2C%20אשמח%20לפרטים%20על%20חברותא%20טלפונית%20בתורה%20לנשמה"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3.5 text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 rounded-xl border border-emerald-200/70 transition-all mt-3"
            >
              <span className="flex items-center gap-2.5">
                <i className="fab fa-whatsapp text-emerald-600 text-base"></i>
                <span>וואטסאפ ישיר לרכז הלימוד (050-3938114)</span>
              </span>
              <i className="fas fa-arrow-left text-xs text-emerald-600"></i>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
