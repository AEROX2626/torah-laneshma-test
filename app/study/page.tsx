import SefariaReader from './SefariaReader';

export const metadata = {
  title: 'בית מדרש - לימוד וקריאה | תורה לנשמה',
  description: 'ספרי לימוד, גמרא, תנ״ך והלכה לקריאה ישירות באתר, מופעל באמצעות Sefaria.',
};

export default function StudyPage() {
  return (
    <div className="h-screen w-full bg-[#f4ece3] overflow-hidden flex flex-col font-serif">
      <SefariaReader />
    </div>
  );
}
