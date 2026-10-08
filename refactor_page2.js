const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Remove client directives and hooks
code = code.replace('"use client";\n', '');
code = code.replace(/import { useEffect, useState } from "react";\n/, '');

// 2. Add component imports
code = code.replace(
  'import Navbar from "./components/Navbar";',
  `import Navbar from "./components/Navbar";
import PageEffects from "./components/PageEffects";
import FaqAccordion from "./components/FaqAccordion";
import StatsCounters from "./components/StatsCounters";
import JoinForm from "./components/JoinForm";`
);

// 3. Match from 'export default function Home' exactly up to the MAIN return.
// The main return is `return (\n    <>` or `return (\n    <div`.
const mainReturnRegex = /export default function Home\(\) \{[\s\S]*?(?=return \(\s*<)/;
code = code.replace(mainReturnRegex, 'export default function Home() {\n  ');

// 4. Remove onClick scrollToSection
code = code.replace(/onClick=\{\(e\) => scrollToSection\(e, "[^"]+"\)\}/g, '');

// 5. Replace stats counter HTML with component
const statsRegex = /<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;
code = code.replace(statsRegex, `<StatsCounters />\n        </div>\n      </section>`);

// 6. Replace FAQ map with component
const faqRegex = /\{(?:\s*\/\*.*?\*\/\s*)?\[[\s\S]*?\]\.map\(\(faq, i\) => \([\s\S]*?<\/div>\s*\)\)\}/;
code = code.replace(faqRegex, `<FaqAccordion faqs={[
              { q: "האם החברותא בחינם או כרוכה בתשלום / התחייבות כלשהי?", a: "חינם לגמרי, לתמיד. המטרה שלנו היא להנגיש את התורה לכל יהודי, ללא שום עלות. אתם לא משלמים על השירות, ולא מחויבים להמשיך אם זה לא מתאים לכם." },
              { q: "איך מתבצע הלימוד בפועל? זה בטלפון או בזום?", a: "בטלפון! רוב הלומדים שלנו מעדיפים את הפשטות והנוחות של שיחת טלפון רגילה. אין צורך להסתבך עם זום, מצלמות או אינטרנט. פשוט מתקשרים, לומדים ומנתקים. קל ונגיש מכל מקום." },
              { q: "אני לא יודע לקרוא דף גמרא. האם זה מתאים לי?", a: "בהחלט! יש לנו מסלולי לימוד שמותאמים בדיוק לרמה שלך. בין אם אתה רוצה ללמוד פרשת שבוע, הלכה, מוסר, או גמרא מהבסיס – נתאים לך חברותא שילמד איתך בקצב ובשפה שלך." },
              { q: "תוך כמה זמן ימצאו לי חברותא?", a: "בדרך כלל, תוך 24-48 שעות ממועד הפנייה. צוות ההתאמה שלנו עובד קשה כדי למצוא עבורך את החברותא המדויק ביותר מתוך מאגר המתנדבים המסור שלנו. אם יש בקשות מיוחדות (כמו שפה ספציפית), זה עשוי לקחת מעט יותר זמן." },
              { q: "האם אפשר לבחור את נושא הלימוד?", a: "הבחירה כולה שלך! אתה יכול לבחור ללמוד גמרא (דף יומי או מסכת ספציפית), פרשת שבוע, הלכה, מוסר (כמו מסילת ישרים) או כל נושא תורני אחר. אם אתה לא בטוח, החברותא שלך ישמח להמליץ לך." },
              { q: "האם יש שעות ספציפיות בהן צריך ללמוד?", a: "לא. אתה מתאם את שעת הלימוד ישירות מול החברותא שלך, לפי מה שנוח לשניכם. זה יכול להיות בבוקר בדרך לעבודה, בערב לפני השינה, או ביום שישי בצהריים. הגמישות היא מלאה." },
            ]} />`);

// 7. Replace form with JoinForm component
const formRegex = /<form onSubmit=\{handleFormSubmit\}[\s\S]*?<\/form>/;
code = code.replace(formRegex, `<JoinForm />`);

// 8. Remove modal at bottom
const modalRegex = /\{isModalOpen && \([\s\S]*?\)\}/;
code = code.replace(modalRegex, '');

// 9. Add PageEffects inside body
code = code.replace('</main>', '</main>\n      <PageEffects />');

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Refactored page.tsx carefully');
