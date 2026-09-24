const fs = require('fs');
const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace snippet 1 text
content = content.replace(
  /<h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">\s*מוכנים לצאת לדרך\?\s*<\/h3>\s*<p className="text-ink-600 font-medium">\s*השאירו פרטים ונציג שלנו יחזור אליכם להתאמה מדויקת\. בלי טפסים ארוכים\.\s*<\/p>/,
  `<h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">
                שעה בשבוע לעצמכם
              </h3>
              <p className="text-ink-600 font-medium">
                השאירו פרטים ונחבר לכם חברותא טלפונית ללא עלות, ביום ובשעה שהכי נוחים לכם.
              </p>`
);

// Replace snippet 2 text
content = content.replace(
  /<h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">\s*הגיע הזמן לדבר באמת\.\s*<\/h3>\s*<p className="text-ink-600 font-medium">\s*רוצים לנסות שיחה קצרה ופתוחה\? השאירו פרטים קצרים ונתחיל\.\s*<\/p>/,
  `<h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">
                חברותא טלפונית בחינם
              </h3>
              <p className="text-ink-600 font-medium">
                שיחה קצרה ופתוחה מתי שנוח לכם. השירות ניתן ללא כל התחייבות, השאירו פרטים ונתחיל.
              </p>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Text updated successfully');
