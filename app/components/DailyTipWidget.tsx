import Link from "next/link";
import dailyTips from "../data/daily-tips.json";

export default function DailyTipWidget() {
  const latestTip = dailyTips[0]; // The JSON will always have the newest at the top (index 0)

  if (!latestTip) return null;

  return (
    <section className="py-8 bg-gradient-to-br from-rose-50 to-orange-50 border-y border-rose-100">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-rose-100 relative overflow-hidden reveal">
          {/* Decorative background element */}
          <div className="absolute -top-12 -right-12 text-rose-50 opacity-50 transform -rotate-12 pointer-events-none">
            <i className="fas fa-heart text-9xl"></i>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-500/30">
              <i className="fas fa-gem"></i>
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full">פנינה יומית לזוגיות</span>
                <span className="text-xs font-semibold text-ink-400">{latestTip.category}</span>
              </div>
              <h3 className="font-heading font-black text-xl text-ink-900 mb-2">{latestTip.title}</h3>
              <p className="text-ink-600 font-medium leading-relaxed">{latestTip.content}</p>
            </div>

            <div className="flex-shrink-0 mt-4 md:mt-0 w-full md:w-auto">
              <Link href="/relationships-guide" className="btn-secondary w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 text-rose-600 border-rose-200 hover:bg-rose-50">
                <span>לכל הטיפים</span>
                <i className="fas fa-arrow-left text-xs"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
