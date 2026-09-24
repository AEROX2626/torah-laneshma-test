const fs = require('fs');
const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const snippet1 = `
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-primary-50 to-white p-8 md:p-10 rounded-[2rem] shadow-soft border border-primary-100 reveal-scale">
            <div className="md:w-5/12 text-center md:text-right">
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">
                מוכנים לצאת לדרך?
              </h3>
              <p className="text-ink-600 font-medium">
                השאירו פרטים ונציג שלנו יחזור אליכם להתאמה מדויקת. בלי טפסים ארוכים.
              </p>
            </div>
            <div className="md:w-7/12 w-full">
              <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
                <input type="text" name="name" placeholder="שם מלא" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm" />
                <input type="tel" name="phone" placeholder="מספר טלפון" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm text-right" dir="ltr" />
                <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-3.5 rounded-xl font-bold whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
                  {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : "שליחה מהירה"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
`;

const snippet2 = `
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-accent-50 to-white p-8 md:p-10 rounded-[2rem] shadow-soft border border-accent-100 reveal-scale">
            <div className="md:w-5/12 text-center md:text-right">
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">
                הגיע הזמן לדבר באמת.
              </h3>
              <p className="text-ink-600 font-medium">
                רוצים לנסות שיחה קצרה ופתוחה? השאירו פרטים קצרים ונתחיל.
              </p>
            </div>
            <div className="md:w-7/12 w-full">
              <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
                <input type="text" name="name" placeholder="שם מלא" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all shadow-sm" />
                <input type="tel" name="phone" placeholder="מספר טלפון" required className="flex-1 bg-white border border-ink-200 rounded-xl px-4 py-3.5 text-ink-900 font-medium focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all shadow-sm text-right" dir="ltr" />
                <button type="submit" disabled={isSubmitting} className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3.5 rounded-xl font-bold whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                  {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : "בואו נדבר"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
`;

content = content.replace(/<\/section>\s*<section className="py-20 md:py-28 relative bg-gradient-to-b from-white to-primary-50\/30">/, `</section>\n${snippet1}\n      <section className="py-20 md:py-28 relative bg-gradient-to-b from-white to-primary-50/30">`);
content = content.replace(/<\/section>\s*<section id="content"/, `</section>\n${snippet2}\n      <section id="content"`);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
