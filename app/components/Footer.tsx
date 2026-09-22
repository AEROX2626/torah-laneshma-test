"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (isHome) {
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <footer className="bg-ink-50 border-t border-ink-100 pt-16 md:pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-10 md:gap-8 mb-14">
            <div className="md:col-span-5">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-heading font-black text-xl text-ink-900 leading-tight tracking-tight">תורה לנשמה</span>
                  <span className="text-primary-600 font-bold text-xs tracking-wide leading-none mt-0.5">חברותא אישית, למידה משותפת</span>
                </div>
              </Link>
              <p className="text-ink-500 text-base font-medium leading-relaxed max-w-md">פרויקט התנדבותי שפועל ללא מטרות רווח ומיועד לחבר בין קצוות החברה הישראלית על ידי לימוד טלפוני משותף, מקרב ונטול פילטרים.</p>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-heading font-extrabold text-ink-900 mb-5 text-sm uppercase tracking-widest">תפריט ניווט</h4>
              <ul className="space-y-3">
                <li><Link href="/#about" onClick={(e) => handleLinkClick(e, "#about")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">מהות החברותא</Link></li>
                <li><Link href="/#how" onClick={(e) => handleLinkClick(e, "#how")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">תכלס, איך מתחילים?</Link></li>
                <li><Link href="/adopt" className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">אמץ אברך (שותפות)</Link></li>
                <li><Link href="/#faq" onClick={(e) => handleLinkClick(e, "#faq")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">כל מה שרציתם לשאול</Link></li>
                <li><Link href="/#join" onClick={(e) => handleLinkClick(e, "#join")} className="text-ink-600 hover:text-primary-600 font-semibold transition-colors">השארת פרטים</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-heading font-extrabold text-ink-900 mb-5 text-sm uppercase tracking-widest">דברו איתנו</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-ink-600 font-semibold">
                  <i className="fab fa-whatsapp text-emerald-500 text-lg"></i>
                  <a href="https://wa.me/972585986685" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors" dir="ltr">+972 58-598-6685</a>
                </li>
                <li className="flex items-center gap-3 text-ink-600 font-semibold">
                  <i className="fas fa-phone text-primary-500 text-lg"></i>
                  <span>ייעוץ והכוונה ללא עלות</span>
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
            <p>© <span>{year}</span> כל הזכויות שמורות – תורה לנשמה.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-600 transition-colors">מדיניות פרטיות</a>
              <a href="#" className="hover:text-primary-600 transition-colors">הצהרת נגישות</a>
            </div>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/972585986685" target="_blank" rel="noopener noreferrer" aria-label="פניה בוואטסאפ" className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 group flex items-center">
        <span className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl text-sm font-bold text-ink-700 shadow-elevated opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-ink-100 translate-x-2 group-hover:translate-x-0">
          זמינים עבורכם בוואטסאפ!
        </span>
        <div className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-xl pulse-whatsapp transform group-hover:scale-110 transition-transform duration-300">
          <i className="fab fa-whatsapp"></i>
        </div>
      </a>
    </>
  );
}
