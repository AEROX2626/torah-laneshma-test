const fs = require('fs');
let p = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /<div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">[\s\S]*?<i className="fas fa-arrow-left mt-0\.5 text-xs"><\/i>\s*<\/div>/g;

p = p.replace(regex, `<div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                    <span>המשך לקרוא</span>
                    <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                  </div>`);

fs.writeFileSync('app/page.tsx', p, 'utf8');
