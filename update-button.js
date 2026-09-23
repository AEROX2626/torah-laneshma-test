const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

p = p.replace(/<a href="#join" onClick=\{\(e\) => scrollToSection\(e, "#join"\)\} className="btn-outline bg-white px-6 py-3 rounded-2xl font-bold text-ink-700 inline-flex items-center gap-2 whitespace-nowrap\">\s*צפייה בכל התכנים <i className="fas fa-arrow-left text-xs"><\/i>\s*<\/a>/, 
  `<Link href="/articles" className="btn-outline bg-white px-6 py-3 rounded-2xl font-bold text-ink-700 inline-flex items-center gap-2 whitespace-nowrap">
              צפייה בכל התכנים <i className="fas fa-arrow-left text-xs"></i>
            </Link>`);

fs.writeFileSync("app/page.tsx", p, "utf8");
console.log("Updated button in page.tsx using regex");
