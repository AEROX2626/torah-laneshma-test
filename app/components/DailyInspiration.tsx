import DailyTipWidget from "./DailyTipWidget";
import DailyWisdomWidget from "./DailyWisdomWidget";
import DafYomiWidget from "./DafYomiWidget";

export default function DailyInspiration() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-rose-50/50 via-white to-indigo-50/50 border-y border-ink-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading font-black text-3xl md:text-4xl text-ink-950 mb-3">חיבור יומי למקורות</h2>
          <p className="text-ink-600 font-medium text-lg">פנינים קטנות של חוכמה שמתעדכנות בכל בוקר</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <DailyTipWidget standalone={false} />
          <DailyWisdomWidget />
          <DafYomiWidget />
        </div>
      </div>
    </section>
  );
}
