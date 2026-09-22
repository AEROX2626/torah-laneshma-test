const fs = require('fs');
let p = fs.readFileSync('app/page.tsx', 'utf8');

p = p.replace(/<span>חוכמת הדורות, במרחק שיחת טלפון<\/span>\s*<\/div>/, `<span>חוכמת הדורות, במרחק שיחת טלפון</span>\n                </div>\n                <ShabbatTimes />\n              </div>`);

fs.writeFileSync('app/page.tsx', p, 'utf8');
