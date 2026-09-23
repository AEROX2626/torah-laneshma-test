const fs = require("fs");
let c = fs.readFileSync("app/components/Navbar.tsx", "utf8");

// Desktop
c = c.replace(
  '<Link href="/ask" className={`px-4 py-2.5 font-bold',
  '<Link href="/relationships-guide" className={`px-4 py-2.5 font-semibold text-[15px] rounded-xl transition-all ${pathname === \'/relationships-guide\' ? \'text-primary-600 bg-primary-50\' : \'text-ink-600 hover:text-primary-600 hover:bg-primary-50\'}`}>זוגיות ומידות</Link>\n              <Link href="/ask" className={`px-4 py-2.5 font-bold'
);

// Mobile
c = c.replace(
  '<Link href="/ask" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-4 text-base font-bold',
  '<Link href="/relationships-guide" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-4 text-base font-semibold rounded-2xl transition-all ${pathname === \'/relationships-guide\' ? \'text-primary-600 bg-primary-50\' : \'text-ink-700 hover:text-primary-600 hover:bg-primary-50\'}`}>זוגיות ומידות</Link>\n            <Link href="/ask" onClick={() => setIsMenuOpen(false)} className={`block px-5 py-4 text-base font-bold'
);

fs.writeFileSync("app/components/Navbar.tsx", c, "utf8");
