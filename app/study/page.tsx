import SefariaReader from './SefariaReader';

export const metadata = {
  title: 'בית מדרש - לימוד וקריאה',
  description: 'ספרי לימוד, גמרא, תנ״ך והלכה לקריאה ישירות באתר, מופעל באמצעות Sefaria.',
};

export default function StudyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 font-serif">בית המדרש</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          כאן תוכלו ללמוד ולעיין בכל ארון הספרים היהודי ישירות מהאתר. 
          חפשו פרק בתנ״ך, דף בגמרא או הלכה במשנה תורה, ושמרו סימניות להמשך קריאה.
        </p>
      </div>
      
      <SefariaReader />
    </div>
  );
}
