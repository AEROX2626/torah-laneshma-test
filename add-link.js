const fs = require('fs');
let p = fs.readFileSync('app/components/Navbar.tsx', 'utf8');

const desktopLink = '<Link href="/#content" onClick={(e) => handleLinkClick(e, "#content")} className="px-4 py-2.5 text-ink-600 hover:text-primary-600 font-semibold text-[15px] rounded-xl hover:bg-primary-50 transition-all">כל הכתבות</Link>\n              ';
const mobileLink = '<Link href="/#content" onClick={(e) => handleLinkClick(e, "#content")} className="block px-5 py-4 text-base font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">כל הכתבות</Link>\n            ';

p = p.replace('<Link href="/#faq" onClick={(e) => handleLinkClick(e, "#faq")} className="px-4 py-2.5', desktopLink + '<Link href="/#faq" onClick={(e) => handleLinkClick(e, "#faq")} className="px-4 py-2.5');

p = p.replace('<Link href="/#faq" onClick={(e) => handleLinkClick(e, "#faq")} className="block px-5 py-4', mobileLink + '<Link href="/#faq" onClick={(e) => handleLinkClick(e, "#faq")} className="block px-5 py-4');

fs.writeFileSync('app/components/Navbar.tsx', p, 'utf8');
