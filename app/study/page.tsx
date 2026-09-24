import SefariaReader from './SefariaReader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'בית מדרש - לימוד וקריאה',
  description: 'ספרי לימוד, גמרא, תנ״ך והלכה לקריאה ישירות באתר, מופעל באמצעות Sefaria.',
};

export default function StudyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto pt-24 pb-12 px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 font-serif">בית המדרש</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
            כאן תוכלו ללמוד ולעיין בכל ארון הספרים היהודי ישירות מהאתר. 
            חפשו פרק בתנ״ך, דף בגמרא או הלכה במשנה תורה, ושמרו סימניות להמשך קריאה.
          </p>
        </div>
        
        <SefariaReader />
      </main>

      <Footer />
    </div>
  );
}
