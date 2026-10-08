const fs = require('fs');
let code = fs.readFileSync('app/components/Navbar.tsx', 'utf8');

// 1. Remove the misplaced mobile link from desktop menu
const mobileLinkInDesktop = '              <Link href="/study" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-4 text-base font-semibold rounded-2xl transition-all ${pathname === \'/study\' ? \'text-primary-600 bg-primary-50\' : \'text-ink-700 hover:text-primary-600 hover:bg-primary-50\'}`}>בית מדרש</Link>\n';
code = code.replace(mobileLinkInDesktop, '');

// 2. Add it to the mobile menu (right after "איך זה עובד?")
const mobileMenuInsertPoint = '<Link href="/#how" onClick={(e) => handleLinkClick(e, "#how")} className="block px-5 py-4 text-base font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">איך זה עובד?</Link>\n';
const mobileLinkProper = '            <Link href="/study" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-4 text-base font-semibold rounded-2xl transition-all flex items-center gap-2 ${pathname === \'/study\' ? \'text-primary-600 bg-primary-50\' : \'text-ink-700 hover:text-primary-600 hover:bg-primary-50\'}`}><i className="fas fa-book-open text-primary-500"></i>בית מדרש</Link>\n';

code = code.replace(mobileMenuInsertPoint, mobileMenuInsertPoint + mobileLinkProper);

fs.writeFileSync('app/components/Navbar.tsx', code, 'utf8');
