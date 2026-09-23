import Link from "next/link";

export default function GlobalCTA() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100/50 py-16 md:py-24 border-t border-primary-100 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 font-bold text-xs tracking-widest uppercase mb-6 shadow-sm">
          <i className="fas fa-gift"></i>
          <span>ללא עלות וללא התחייבות</span>
        </div>
        
        <h2 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-6 leading-tight">
          מוכנים להתחיל את ה<span className="text-primary-600">חברותא</span> שלכם?
        </h2>
        
        <p className="text-lg md:text-xl text-ink-600 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
          הצטרפו לאלפי אנשים שכבר נהנים משעת לימוד שבועית, מרתקת ומעשירה עם שותף ללימוד מותאם אישית. 
          השאירו פרטים עכשיו ונתאים לכם חברותא!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/#join" className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <span>השארת פרטים לחברותא</span>
            <i className="fas fa-arrow-left"></i>
          </Link>
          
          <a href="https://wa.me/972585986685" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-3 bg-white text-ink-700 border border-ink-200 hover:border-emerald-500 hover:text-emerald-600 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <i className="fab fa-whatsapp text-emerald-500 text-xl"></i>
            <span>או דברו איתנו בוואטסאפ</span>
          </a>
        </div>
      </div>
    </section>
  );
}
