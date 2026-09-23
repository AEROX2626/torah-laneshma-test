const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");
p = p.replace('className="py-20 md:py-28 relative overflow-hidden bg-ink-950 text-white noise"', 'className="py-20 md:py-28 relative overflow-hidden bg-ink-950 text-white noise selection:bg-white/30 selection:text-white"');
p = p.replace('className="py-16 md:py-20 relative overflow-hidden bg-ink-950"', 'className="py-16 md:py-20 relative overflow-hidden bg-ink-950 selection:bg-white/30 selection:text-white"');
fs.writeFileSync("app/page.tsx", p, "utf8");
