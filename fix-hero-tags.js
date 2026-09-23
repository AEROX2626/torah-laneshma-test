const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");
p = p.replace('flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-7', 'flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-7');
fs.writeFileSync("app/page.tsx", p, "utf8");
