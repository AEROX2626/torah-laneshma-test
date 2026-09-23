const fs = require("fs");
let p = fs.readFileSync("app/components/Navbar.tsx", "utf8");

// Desktop Link
p = p.replace(
  `<Link href="/adopt"`,
  `<Link href="/ask" className={\`px-4 py-2.5 font-bold text-[15px] rounded-xl transition-all flex items-center gap-2 \${pathname === '/ask' ? 'text-primary-700 bg-primary-100/80' : 'text-primary-600 bg-primary-50 hover:bg-primary-100/80'}\`}><i className="fas fa-robot text-primary-500"></i>שאל את הרב</Link>
              <Link href="/adopt"`
);

// Mobile Link
p = p.replace(
  `<Link href="/adopt" onClick={() => setIsMenuOpen(false)}`,
  `<Link href="/ask" onClick={() => setIsMenuOpen(false)} className={\`block px-5 py-4 text-base font-bold rounded-2xl transition-all flex items-center gap-3 \${pathname === '/ask' ? 'text-primary-700 bg-primary-100/80' : 'text-primary-600 bg-primary-50 hover:bg-primary-100/80'}\`}><i className="fas fa-robot text-primary-500"></i>שאל את הרב</Link>
              <Link href="/adopt" onClick={() => setIsMenuOpen(false)}`
);

fs.writeFileSync("app/components/Navbar.tsx", p, "utf8");
console.log("Navbar modified");
