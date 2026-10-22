"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { scrollToJoinForm } from "./scrollToJoin";

export default function MobileQuickBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearForm, setIsNearForm] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // Show bar once user scrolls past initial hero
      setIsVisible(window.scrollY > 220);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Observe #join-card section to hide sticky bar when the user is viewing the form
    const joinSection = document.getElementById("join-card") || document.getElementById("join");
    let observer: IntersectionObserver | null = null;

    if (joinSection) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If form area is visible, hide bottom bar so it doesn't block inputs / keyboard
            setIsNearForm(entry.isIntersecting);
          });
        },
        { threshold: 0.12 }
      );
      observer.observe(joinSection);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (observer) observer.disconnect();
    };
  }, [isHome]);

  const scrollToJoin = () => {
    scrollToJoinForm();
  };

  const showBar = isVisible && !isNearForm;

  return (
    <div
      role="region"
      aria-label="סרגל הצטרפות מהירה למובייל"
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-xl border-t border-ink-100 shadow-[0_-8px_25px_rgba(15,23,42,0.12)] transition-all duration-300 ease-in-out ${
        showBar ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-md mx-auto flex items-center gap-2">
        {/* Main CTA button */}
        <button
          onClick={scrollToJoin}
          type="button"
          className="flex-1 btn-primary py-3 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between shadow-lg shadow-primary-500/25 active:scale-[0.98] transition-all"
          aria-label="הרשמה מהירה לחברותא טלפונית"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white text-xs">
              <i className="fas fa-phone-alt"></i>
            </span>
            <div className="text-right">
              <span className="block leading-tight text-white font-extrabold text-sm sm:text-base">חברותא טלפונית</span>
              <span className="block text-[11px] text-white/80 font-medium">ללא עלות • חצי שעה בשבוע</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs bg-white text-primary-700 px-2.5 py-1 rounded-full font-bold shadow-xs">
            <span>להרשמה</span>
            <i className="fas fa-arrow-left text-[10px]"></i>
          </span>
        </button>

        {/* Quick WhatsApp button */}
        <a
          href="https://wa.me/972503938114?text=שלום%2C%20אשמח%20לפרטים%20על%20חברותא%20טלפונית%20בתורה%20לנשמה"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="פנייה מהירה בוואטסאפ"
          className="w-12 h-12 flex-shrink-0 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30 transition-all pulse-whatsapp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </div>
  );
}
