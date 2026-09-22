const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

// find index of "מה אומרים הלומדים"
const startStr = `<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">`;
const endStr = `</section>`;

const startIndex = p.indexOf(startStr);
const endIndex = p.indexOf(endStr, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find boundaries");
  process.exit(1);
}

const newReviews = `<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal">
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"האמת? הייתי סקפטי רצח בהתחלה. פנו אליי ואמרתי יאללה, ננסה. היום זה פק"ל. החברותא שלי, רב מבני ברק, הפך ממש לפסיכולוג שלי. לומדים פרשת שבוע, מדברים על החיים, העבודה... פשוט שעת ניתוק מהטירוף."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">ע</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">עמרי דהן</div>
                  <div className="text-ink-400 text-xs font-semibold">בן 32, רמת גן</div>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"מה שהכי תפס אותי זה שלא מנסים 'להחזיר' אותך בתשובה. באתי עם המון אנטגוניזם, וגיליתי בן אדם זהב מעבר לקו. אנחנו פותחים תלמוד, מתווכחים כמו פסיכים וצוחקים מלא. מחכה לטלפון הזה כל שבוע."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold">א</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">אלעד כהן</div>
                  <div className="text-ink-400 text-xs font-semibold">בן 41, תל אביב</div>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-3xl p-8 border border-ink-100 reveal md:col-span-2 lg:col-span-1" style={{ transitionDelay: "0.2s" }}>
              <div className="flex gap-1 mb-5 text-amber-400">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="text-ink-700 leading-relaxed font-medium mb-6 text-[15px]">"אני עובד בהייטק 12 שעות ביום, כל היום מול מסכים. השעה הזאת של החברותא היא הזמן היחיד בשבוע שאני מדבר עם מישהו לא על קוד. זה חיבור נטו לנשמה. ממליץ בחום לכל גבר שרוצה קצת שקט בראש."</p>
              <div className="flex items-center gap-3 pt-5 border-t border-ink-50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">נ</div>
                <div>
                  <div className="font-heading font-extrabold text-ink-900 text-sm">נדב שפירא</div>
                  <div className="text-ink-400 text-xs font-semibold">בן 28, חיפה</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

p = p.substring(0, startIndex) + newReviews + p.substring(endIndex);
fs.writeFileSync("app/page.tsx", p, "utf8");
console.log("Replaced successfully.");
