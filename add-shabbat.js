const fs = require('fs');
let p = fs.readFileSync('app/page.tsx', 'utf8');

// Add import
p = p.replace('import Navbar from "./components/Navbar";\nimport Footer from "./components/Footer";', 'import Navbar from "./components/Navbar";\nimport Footer from "./components/Footer";\nimport ShabbatTimes from "./components/ShabbatTimes";');

const target = `<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-bold text-sm mb-7 shadow-soft reveal">`;

const replacement = `<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-7 reveal">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-bold text-sm shadow-soft">`;

const targetEnd = `<span>חוכמת הדורות, במרחק שיחת טלפון</span>
              </div>`;
              
const replacementEnd = `<span>חוכמת הדורות, במרחק שיחת טלפון</span>
                </div>
                <ShabbatTimes />
              </div>`;

p = p.replace(target, replacement);
p = p.replace(targetEnd, replacementEnd);

fs.writeFileSync('app/page.tsx', p, 'utf8');
