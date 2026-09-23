import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dailyTips from "../data/daily-tips.json";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "המדריך השלם לזוגיות, שידוכים ומידות | תורה לנשמה",
  description: "אוסף הטיפים והפנינות היומיות שלנו בנושאי שלום בית, הכנה לפגישות, וזיהוי מידות אמיתיות.",
};

export default function RelationshipsGuidePage() {
  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900 selection:bg-rose-200 selection:text-rose-900 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          
          <div className="text-center mb-12 md:mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs tracking-widest uppercase mb-4 shadow-sm">
              <i className="fas fa-heart"></i>
              <span>מתעדכן כל יום</span>
            </div>
            <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-ink-950 mb-6 leading-tight">
              המדריך המלא ל<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">זוגיות ושידוכים</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-600 font-medium leading-relaxed max-w-3xl mx-auto">
              כאן תמצאו את כל הטיפים, העצות והכלים המעשיים לבדיקת מידות נכונה לפני נישואין, ולבניית שלום בית אמיתי ואיתן לאורך שנים - פנינה אחת בכל פעם.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {dailyTips.map((tip, index) => (
              <div key={tip.id} className="bg-white rounded-3xl p-8 shadow-soft border border-rose-100 flex flex-col h-full reveal-scale hover:shadow-lg transition-shadow" style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full">{tip.category}</span>
                  <span className="text-xs font-medium text-ink-400">{tip.date}</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl text-ink-900 mb-3">{tip.title}</h3>
                <p className="text-ink-600 font-medium leading-relaxed flex-grow">{tip.content}</p>
                <div className="mt-6 pt-4 border-t border-ink-50 flex items-center justify-end">
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center text-sm">
                    <i className="fas fa-quote-left"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
