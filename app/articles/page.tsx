import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { articles } from "./data";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "כל המאמרים ופרשות השבוע | תורה לנשמה",
  description: "מאגר התוכן המלא של תורה לנשמה. פרשות שבוע, מאמרים מרתקים בנושאי אמונה, הלכה והשקפה לחיים.",
};

export default function ArticlesIndexPage() {
  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900 selection:bg-primary-200 selection:text-primary-900 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-xs tracking-widest uppercase mb-4 shadow-sm">
              <i className="fas fa-book-open"></i>
              <span>מאגר התוכן המלא</span>
            </div>
            <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-ink-950 mb-6 leading-tight">
              כל המאמרים ו<span className="text-gradient">פרשות השבוע</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-600 font-medium leading-relaxed max-w-3xl mx-auto">
              מקור המידע המרכזי של האתר. כאן תוכלו למצוא את כל פרשות השבוע, המאמרים והרעיונות שנכתבו כדי לתת לכם טעימה של חוכמה לחיים, מוכנים לשיחה בחברותא.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 shadow-soft hover:shadow-lg flex flex-col h-full transition-all duration-300 hover:-translate-y-1">
                <div className="h-52 overflow-hidden relative">
                  <img loading="lazy" src={article.image} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" alt={article.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{article.category}</span>
                    {article.date && <span className="text-xs font-medium text-ink-400">{article.date}</span>}
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-ink-900 mb-3 group-hover:text-primary-600 transition-colors">{article.title}</h3>
                  <p className="text-ink-600 font-medium leading-relaxed flex-grow">{article.excerpt}</p>
                  <div className="mt-6 pt-5 border-t border-ink-50 flex items-center justify-between text-primary-600 font-bold text-sm">
                    <span>קראו עוד</span>
                    <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
