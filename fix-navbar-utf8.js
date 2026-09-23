const fs = require("fs");
let p = fs.readFileSync("app/components/Navbar.tsx", "utf8");

const desktopReplacement = `<Link href="/relationships-guide" className={\`px-4 py-2.5 font-semibold text-[15px] rounded-xl transition-all \${pathname === '/relationships-guide' ? 'text-primary-600 bg-primary-50' : 'text-ink-600 hover:text-primary-600 hover:bg-primary-50'}\`}>זוגיות ומידות</Link>
              <Link href="/ask" className={\`px-4 py-2.5 font-bold text-[15px] rounded-xl transition-all flex items-center gap-2 \${pathname === '/ask' ? 'text-primary-700 bg-primary-100/80' : 'text-primary-600 bg-primary-50 hover:bg-primary-100/80'}\`}><i className="fas fa-robot text-primary-500"></i>שאל את הרב</Link>`;

const mobileReplacement = `<Link href="/relationships-guide" onClick={() => setIsMenuOpen(false)} className={\`block px-5 py-4 text-base font-semibold rounded-2xl transition-all \${pathname === '/relationships-guide' ? 'text-primary-600 bg-primary-50' : 'text-ink-700 hover:text-primary-600 hover:bg-primary-50'}\`}>זוגיות ומידות</Link>
            <Link href="/ask" onClick={() => setIsMenuOpen(false)} className={\`block px-5 py-4 text-base font-bold rounded-2xl transition-all flex items-center gap-3 \${pathname === '/ask' ? 'text-primary-700 bg-primary-100/80' : 'text-primary-600 bg-primary-50 hover:bg-primary-100/80'}\`}><i className="fas fa-robot text-primary-500"></i>שאל את הרב</Link>`;

// Replace only desktop (it lacks onClick)
p = p.replace(/<Link href="\/relationships-guide" className=[\s\S]*?<i className="fas fa-robot text-primary-500"><\/i>[^<]*<\/Link>/, desktopReplacement);

// Replace mobile (it has onClick)
p = p.replace(/<Link href="\/relationships-guide" onClick=[\s\S]*?<i className="fas fa-robot text-primary-500"><\/i>[^<]*<\/Link>/, mobileReplacement);

fs.writeFileSync("app/components/Navbar.tsx", p, "utf8");
console.log("Navbar fixed");
