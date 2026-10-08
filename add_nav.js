const fs = require('fs');

let navbar = fs.readFileSync('app/components/Navbar.tsx', 'utf8');

const navLink = `<Link href="/study" className={\`px-2 lg:px-3 py-2 font-semibold text-[14px] lg:text-[15px] whitespace-nowrap rounded-xl transition-all \${pathname === '/study' ? 'text-primary-600 bg-primary-50' : 'text-ink-600 hover:text-primary-600 hover:bg-primary-50'}\`}>בית מדרש</Link>`;
const mobileNavLink = `<Link href="/study" onClick={() => setIsMenuOpen(false)} className={\`block px-5 py-4 text-base font-semibold rounded-2xl transition-all \${pathname === '/study' ? 'text-primary-600 bg-primary-50' : 'text-ink-700 hover:text-primary-600 hover:bg-primary-50'}\`}>בית מדרש</Link>`;

navbar = navbar.replace('<Link href="/relationships-guide"', navLink + '\n              <Link href="/relationships-guide"');
navbar = navbar.replace('<Link href="/relationships-guide"', mobileNavLink + '\n            <Link href="/relationships-guide"');

fs.writeFileSync('app/components/Navbar.tsx', navbar, 'utf8');

console.log('Added Study links to Navbar');
