import dailyWisdom from "../data/daily-wisdom.json";

export default function DailyWisdomWidget() {
  const latestWisdom = dailyWisdom[0];

  if (!latestWisdom) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-emerald-100 relative overflow-hidden h-full flex flex-col">
      <div className="absolute -top-12 -left-12 text-emerald-50 opacity-50 transform rotate-12 pointer-events-none">
        <i className="fas fa-leaf text-9xl"></i>
      </div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/30">
            <i className="fas fa-quote-right"></i>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">חיזוק יומי</span>
            <div className="text-sm font-semibold text-ink-400 mt-1">{latestWisdom.source}</div>
          </div>
        </div>
        
        <h3 className="font-heading font-black text-xl text-ink-900 mb-3 leading-snug">"{latestWisdom.quote}"</h3>
        <p className="text-ink-600 font-medium leading-relaxed flex-grow">{latestWisdom.explanation}</p>
      </div>
    </div>
  );
}
