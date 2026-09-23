import Link from "next/link";
import dailyTips from "../data/daily-tips.json";

export default function DailyTipWidget({ standalone = true }: { standalone?: boolean }) {
  const latestTip = dailyTips[0];

  if (!latestTip) return null;

  const content = (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-rose-100 relative overflow-hidden h-full flex flex-col">
      <div className="absolute -top-12 -right-12 text-rose-50 opacity-50 transform -rotate-12 pointer-events-none">
        <i className="fas fa-heart text-9xl"></i>
      </div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xl shadow-lg shadow-rose-500/30">
              <i className="fas fa-gem"></i>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full">לזוגיות ושידוכים</span>
              <div className="text-sm font-semibold text-ink-400 mt-1">{latestTip.category}</div>
            </div>
          </div>
        </div>
        
        <h3 className="font-heading font-black text-xl text-ink-900 mb-3 leading-snug">{latestTip.title}</h3>
        <p className="text-ink-600 font-medium leading-relaxed flex-grow">{latestTip.content}</p>

        <div className="mt-6 pt-5 border-t border-rose-50">
          <Link href="/relationships-guide" className="text-rose-600 font-bold text-sm inline-flex items-center gap-2 hover:text-rose-700 transition-colors group">
            <span>למדריך השלם</span>
            <i className="fas fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return (
      <section className="py-8 bg-gradient-to-br from-rose-50 to-orange-50 border-y border-rose-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          {content}
        </div>
      </section>
    );
  }

  return content;
}
