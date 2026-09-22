import Link from 'next/link';

export default function CreditsPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen relative overflow-hidden bg-[#fbfcfd]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="text-ink-500 hover:text-primary-600 font-medium inline-flex items-center gap-2 transition-colors">
            <i className="fas fa-arrow-right text-sm"></i>
            חזרה לעמוד הבית
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-elevated border border-ink-100 reveal-scale active">
          
          <h1 className="font-heading font-black text-3xl md:text-5xl text-ink-950 mb-8 leading-tight">
            זכויות יוצרים וקרדיטים
          </h1>

          <div className="prose prose-lg prose-ink max-w-none text-ink-700 font-medium leading-relaxed">
            <p>
              אנו בפרויקט "תורה לנשמה" מכבדים יוצרים וצלמים. כל צילומי הנוף והאילוסטרציה המופיעים באתר נלקחו ממאגר <strong>Wikimedia Commons</strong>, ומופצים תחת רישיונות <strong>Creative Commons (CC)</strong> או <strong>נחלת הכלל (Public Domain)</strong>.
            </p>
            
            <h3>רשימת קרדיטים מפורטת לתמונות</h3>
            <ul>
              <li><strong>הכותל המערבי בשקיעה:</strong> מתוך Wikimedia Commons, צילום תחת רישיון CC.</li>
              <li><strong>סמטאות עתיקות (צפת / ירושלים):</strong> מתוך Wikimedia Commons, באדיבות קהילת ויקיפדיה.</li>
              <li><strong>שוק מחנה יהודה:</strong> מתוך Wikimedia Commons, רישיון CC-BY.</li>
              <li><strong>ים המלח, מדבר יהודה והנגב:</strong> דוד שנקבון (David Shankbone) ויוצרים נוספים מ-Wikimedia Commons.</li>
              <li><strong>הכנרת ורמת הגליל:</strong> מתוך מאגר Wikimedia Commons.</li>
              <li><strong>מגדל דוד ואבני ירושלים:</strong> באדיבות קהילת היוצרים של ויקיפדיה.</li>
              <li><strong>ספרי תורה ולומדים:</strong> מאגרי תמונות חופשיות ו-Wikimedia Commons.</li>
            </ul>

            <p className="mt-8 text-sm text-ink-500">
              * במידה ומצאתם תמונה באתר שזכויותיה שייכות לכם והיא פורסמה בטעות ללא קרדיט מתאים, אנא פנו אלינו בהקדם ונדאג לתקן או להסיר אותה בהתאם לבקשתכם.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
