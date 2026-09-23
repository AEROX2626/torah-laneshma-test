const fs = require("fs");
let p = fs.readFileSync("app/components/Navbar.tsx", "utf8");
p = p.replace('<Link href="/" className="flex items-center gap-3 group">', '<Link href="/" onClick={(e) => { if(isHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }} className="flex items-center gap-3 group">');
fs.writeFileSync("app/components/Navbar.tsx", p, "utf8");
