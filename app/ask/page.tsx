import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RabbiAIChat from "../components/RabbiAIChat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "שאל את הרב AI | תורה לנשמה",
  description: "יש לכם שאלות על יהדות, הלכה או אמונה? הרב הווירטואלי שלנו זמין עבורכם 24/6 לכל שאלה, באנונימיות מלאה ובגובה העיניים.",
};

export default function AskRabbiPage() {
  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900 selection:bg-primary-200 selection:text-primary-900 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-xs tracking-widest uppercase mb-4 shadow-sm">
              <i className="fas fa-robot"></i>
              <span>זמין 24 שעות ביממה</span>
            </div>
            <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-ink-950 mb-6 leading-tight">
              שאל את הרב <span className="text-gradient">הווירטואלי</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-600 font-medium leading-relaxed max-w-2xl mx-auto">
              מתביישים לשאול? יש לכם שאלות על יהדות, פרשת השבוע, הלכה או אמונה? 
              הרב הווירטואלי שלנו כאן כדי לתת לכם תשובות מיידיות, באנונימיות מלאה ובגובה העיניים.
            </p>
          </div>

          <div>
            <RabbiAIChat />
          </div>

          <div className="mt-12 text-center text-ink-400 text-sm font-medium flex items-center justify-center gap-2">
            <i className="fas fa-info-circle"></i>
            <span>התשובות ניתנות על ידי בינה מלאכותית ונועדו להעשרה ולימוד בלבד.</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
