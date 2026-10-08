const fs = require('fs');
let code = fs.readFileSync('app/components/Navbar.tsx', 'utf8');

const target = '<Link href="/#how" onClick={(e) => handleLinkClick(e, "#how")} className="block px-5 py-4 text-base font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">איך זה עובד?</Link>';
const replacement = target + '\n            <Link href="/study" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-4 text-base font-semibold rounded-2xl transition-all flex items-center gap-3 ${pathname === \'/study\' ? \'text-primary-600 bg-primary-50\' : \'text-ink-700 hover:text-primary-600 hover:bg-primary-50\'}`}><i className="fas fa-book-open text-primary-500"></i>בית מדרש</Link>';

code = code.replace(target, replacement);
fs.writeFileSync('app/components/Navbar.tsx', code, 'utf8');
