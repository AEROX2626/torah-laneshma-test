import dafYomiData from "../data/daf-yomi.json";

export default function DafYomiWidget() {
  if (!dafYomiData) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-indigo-100 relative overflow-hidden h-full flex flex-col">
      <div className="absolute -top-12 -left-12 text-indigo-50 opacity-50 transform -rotate-12 pointer-events-none">
        <i className="fas fa-book-open text-9xl"></i>
      </div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/30">
            <i className="fas fa-scroll"></i>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">הדף היומי היום</span>
            <div className="text-sm font-semibold text-ink-400 mt-1">{dafYomiData.daf} | {dafYomiData.date}</div>
          </div>
        </div>
        
        <h3 className="font-heading font-black text-xl text-ink-900 mb-3 leading-snug">מסכת {dafYomiData.daf.split(' ')[0]}</h3>
        <p className="text-ink-600 font-medium leading-relaxed flex-grow">{dafYomiData.summary}</p>
      </div>
    </div>
  );
}
